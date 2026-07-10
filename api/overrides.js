// Vercel Edge function — shared storage for LeetCode solution overrides, so
// edits made on the page can be published for every visitor WITHOUT the
// export-file → git commit → redeploy loop. Backed by Upstash Redis (free
// tier) through its REST API; writes are gated by a single master key.
//
//   GET /api/overrides
//     → { enabled: true, canEdit: false, overrides: { "16": "public int[][] merge…", … } }
//     Public read — the overrides are shown to every visitor anyway. Include
//     an  Authorization: Bearer <master key>  header and `canEdit` reports
//     whether that key is accepted (used by the page to verify a typed key).
//
//   PUT /api/overrides           (requires  Authorization: Bearer <master key>)
//     body { num: 16, code: "…" }   → save/replace the override for problem 16
//     body { num: 16, code: null }  → delete it (revert to the committed file)
//     → { ok: true }
//
// Storage model: one Redis hash ("lc:overrides"), field = problem num
// (the stable internal id that also keys user-overrides.js), value = the
// Java source. Commands are sent as JSON arrays to the Upstash REST root —
// that keeps arbitrary code payloads out of URL paths.
//
// Required env vars (Vercel → Settings → Environment Variables):
//   UPSTASH_REDIS_REST_URL    from console.upstash.com → your DB → REST API
//   UPSTASH_REDIS_REST_TOKEN  same page
//   OVERRIDES_MASTER_KEY      any long random secret you choose — whoever
//                             holds it can publish edits from the page
// With any of them missing, GET reports { enabled: false } and the page
// silently falls back to the committed user-overrides.js workflow.

export const config = { runtime: 'edge' };

const HASH_KEY = 'lc:overrides';
const MAX_CODE_LEN = 50_000;   // one solution — far above any real solution size
const MAX_NUM = 100_000;       // sanity bound for the problem id

// Soft per-instance limiter for FAILED key attempts, mirroring api/chat.js's
// approach: edge instances are ephemeral and plural, so this is a brute-force
// deterrent, not a guarantee. Successful writes are not limited — they already
// require the master key.
const authFails = new Map();   // ip → { day: 'YYYY-MM-DD', count }
const MAX_AUTH_FAILS_PER_DAY = 30;

/** JSON response; overrides change on demand, so never edge-cache them. */
function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function clientIp(req) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}

function tooManyAuthFails(ip) {
  const day = new Date().toISOString().slice(0, 10);
  const rec = authFails.get(ip);
  return !!rec && rec.day === day && rec.count >= MAX_AUTH_FAILS_PER_DAY;
}

function recordAuthFail(ip) {
  const day = new Date().toISOString().slice(0, 10);
  const rec = authFails.get(ip);
  if (rec && rec.day === day) rec.count++;
  else authFails.set(ip, { day, count: 1 });
}

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Does the Authorization header carry the master key? Compared via SHA-256
 * digests so the string comparison can't leak the match length (a plain
 * `===` on secrets is timing-observable in principle).
 */
async function isAuthorized(req, masterKey) {
  const m = /^Bearer\s+(.+)$/.exec(req.headers.get('authorization') || '');
  if (!m || !masterKey) return false;
  return (await sha256Hex(m[1])) === (await sha256Hex(masterKey));
}

/**
 * Run one Redis command through the Upstash REST API.
 * @param {string[]} command  e.g. ['HSET', 'lc:overrides', '16', '…code…']
 * @returns {Promise<any>} the command's result field
 */
async function redis(url, token, command) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Upstash returned ${res.status}`);
  const payload = await res.json();
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

export default async function handler(req) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const masterKey = process.env.OVERRIDES_MASTER_KEY;
  const enabled = !!(url && token && masterKey);

  if (req.method === 'GET') {
    // Unconfigured is a NORMAL state (feature not set up yet), not an error —
    // report it as data so the page can degrade without console noise.
    if (!enabled) return json(200, { enabled: false, canEdit: false, overrides: {} });

    const canEdit = await isAuthorized(req, masterKey);
    let flat;
    try {
      flat = await redis(url, token, ['HGETALL', HASH_KEY]);
    } catch (e) {
      return json(502, { error: `Storage read failed: ${e.message}` });
    }
    // HGETALL over REST comes back as a flat [field, value, field, value, …] array
    const overrides = {};
    for (let i = 0; i + 1 < (flat || []).length; i += 2) overrides[flat[i]] = flat[i + 1];
    return json(200, { enabled: true, canEdit, overrides });
  }

  if (req.method !== 'PUT') return json(405, { error: 'Method not allowed' });
  if (!enabled) return json(503, { error: 'Overrides API not configured' });

  const ip = clientIp(req);
  if (tooManyAuthFails(ip)) return json(429, { error: 'Too many failed key attempts today' });
  if (!(await isAuthorized(req, masterKey))) {
    recordAuthFail(ip);
    return json(401, { error: 'Master key missing or wrong' });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'Body must be JSON' });
  }
  const num = body?.num;
  const code = body?.code;
  if (!Number.isInteger(num) || num < 1 || num > MAX_NUM) {
    return json(400, { error: '"num" must be a positive integer' });
  }
  if (code !== null && typeof code !== 'string') {
    return json(400, { error: '"code" must be a string, or null to delete' });
  }
  if (typeof code === 'string' && code.length > MAX_CODE_LEN) {
    return json(400, { error: `"code" too large (max ${MAX_CODE_LEN} chars)` });
  }

  try {
    if (code === null) await redis(url, token, ['HDEL', HASH_KEY, String(num)]);
    else await redis(url, token, ['HSET', HASH_KEY, String(num), code]);
  } catch (e) {
    return json(502, { error: `Storage write failed: ${e.message}` });
  }
  return json(200, { ok: true });
}
