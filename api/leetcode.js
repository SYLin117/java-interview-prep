// Vercel Edge function — proxies the official LeetCode problem statement so the
// browser can show it inline. Two reasons this has to be server-side:
//   1. CORS: leetcode.com/graphql doesn't allow cross-origin browser calls.
//   2. The statement HTML lives behind LeetCode's GraphQL API, not the page HTML.
//
// GET /api/leetcode?slug=two-sum
//   → { id: "1", title: "Two Sum", difficulty: "Easy", content: "<p>…</p>" }
//
// Responses are cached hard at the edge (problem statements don't change), so a
// given problem hits LeetCode at most once per cache window across all visitors.

export const config = { runtime: 'edge' };

const LC_GRAPHQL = 'https://leetcode.com/graphql';

// LeetCode's public question-content query, by URL slug.
const QUERY = `query questionContent($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId
    title
    difficulty
    content
  }
}`;

/**
 * Build a JSON response with a status code and edge-cache headers.
 *
 * @param {number} status - HTTP status code.
 * @param {object} obj - JSON-serializable body.
 * @param {string} [cache] - Optional Cache-Control value (omitted for errors).
 * @returns {Response}
 */
function json(status, obj, cache) {
  const headers = { 'content-type': 'application/json' };
  if (cache) headers['cache-control'] = cache;
  return new Response(JSON.stringify(obj), { status, headers });
}

/**
 * Edge entry point. Validates the slug, queries LeetCode's GraphQL API, and
 * returns the official problem number, title, difficulty, and statement HTML.
 *
 * Failure modes (all JSON):
 *   405 - non-GET method
 *   400 - missing or malformed slug
 *   404 - LeetCode has no such problem
 *   502 - upstream fetch failed or returned non-2xx
 *
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export default async function handler(req) {
  if (req.method !== 'GET') return json(405, { error: 'Method not allowed' });

  const slug = new URL(req.url).searchParams.get('slug') || '';
  // Slugs are lowercase words joined by hyphens, e.g. "two-sum", "lru-cache".
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return json(400, { error: 'Invalid or missing slug' });
  }

  let upstream;
  try {
    upstream = await fetch(LC_GRAPHQL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        // A realistic UA + Referer makes LeetCode far less likely to 403 the call.
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'referer': `https://leetcode.com/problems/${slug}/`,
        'origin': 'https://leetcode.com',
      },
      body: JSON.stringify({
        operationName: 'questionContent',
        query: QUERY,
        variables: { titleSlug: slug },
      }),
    });
  } catch (e) {
    return json(502, { error: `Upstream fetch failed: ${e.message}` });
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    return json(502, { error: `LeetCode returned ${upstream.status}`, detail: detail.slice(0, 200) });
  }

  let payload;
  try {
    payload = await upstream.json();
  } catch {
    return json(502, { error: 'LeetCode returned non-JSON' });
  }

  const q = payload?.data?.question;
  if (!q || !q.content) {
    return json(404, { error: `No content for slug "${slug}"` });
  }

  return json(
    200,
    {
      id: q.questionFrontendId,
      title: q.title,
      difficulty: q.difficulty,
      content: q.content,
    },
    // Statements are effectively static — cache 7 days at the edge, serve stale
    // for a day while revalidating.
    'public, s-maxage=604800, stale-while-revalidate=86400'
  );
}
