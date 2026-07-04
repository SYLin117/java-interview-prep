// System Design interview prep — ported from the standalone study site.
// Loaded as a classic <script src="systemdesign.js"></script> before the inline
// renderer in index.html, which reads 'systemDesignThemes' and
// 'systemDesignCases' from the shared script realm.
//
// systemDesignThemes: concept Q&A grouped by topic. Each question is
//   { d: 'easy'|'medium'|'hard', q: 'question', a: `answer HTML` } — 'a' is
//   rendered via innerHTML (use <strong>, <ul><li>, <br>, <code>).
// systemDesignCases: full design walkthroughs. String / string[] fields are all
//   HTML (innerHTML); 'flow' is a plain-text step diagram rendered in <pre>.

const systemDesignThemes = [
  {
    id: "scalability", icon: "📈", color: "#5a7a52", bg: "rgba(90,122,82,0.12)", title: "Scalability",
    questions: [
      { d: "easy", q: "What is horizontal vs vertical scaling?",
        a: `<strong>Vertical scaling</strong> means adding more resources (CPU, RAM) to a single machine. <strong>Horizontal scaling</strong> means adding more machines to distribute the load.<br><br><ul><li><strong>Vertical:</strong> Simpler, no code changes needed, but has physical limits and single point of failure.</li><li><strong>Horizontal:</strong> Near-infinite capacity, fault-tolerant, but requires stateless apps and load balancing.</li></ul><strong>Example:</strong> A database can be scaled vertically by upgrading to a larger instance, or horizontally by adding read replicas.` },
      { d: "easy", q: "What is a load balancer and why is it needed?",
        a: `A <strong>load balancer</strong> distributes incoming traffic across multiple backend servers to prevent any single server from becoming a bottleneck.<br><br><strong>Types:</strong><ul><li><strong>L4 (Transport):</strong> Routes based on IP/TCP — fast but no content inspection.</li><li><strong>L7 (Application):</strong> Routes based on HTTP headers, URL path, cookies — more intelligent.</li></ul><strong>Algorithms:</strong> Round-robin, least connections, IP hash, weighted round-robin.<br><br><strong>Tools:</strong> Nginx, HAProxy, AWS ALB/NLB.` },
      { d: "easy", q: "What is stateless vs stateful architecture?",
        a: `<strong>Stateless:</strong> Each request contains all the information needed — no server-side session. Makes horizontal scaling trivial.<br><br><strong>Stateful:</strong> Server remembers client state between requests. Hard to scale because requests must reach the same server.<br><br><strong>Solution:</strong> Move state to shared storage (Redis for sessions, S3 for files) so any server can handle any request.` },
      { d: "medium", q: "How do you scale a write-heavy database?",
        a: `<strong>Strategies:</strong><ul><li><strong>Sharding:</strong> Partition data across multiple DB nodes by a shard key (e.g., user_id % N). Each shard handles a subset of writes.</li><li><strong>CQRS:</strong> Separate read and write models. Writes go to a primary; reads can be served from optimized read models.</li><li><strong>Async writes:</strong> Use a message queue (Kafka) — accept writes fast, persist asynchronously.</li><li><strong>Write batching:</strong> Buffer writes in memory and flush in bulk to reduce IOPS.</li></ul><strong>Trade-off:</strong> Sharding adds complexity — cross-shard queries become expensive.` },
      { d: "medium", q: "Explain database read replicas and their limitations.",
        a: `<strong>Read replicas</strong> are copies of the primary DB that serve read traffic. Writes go to primary and are replicated asynchronously.<br><br><strong>Benefits:</strong> Offloads read traffic, enables geographic distribution, provides backup.<br><br><strong>Limitations:</strong><ul><li><strong>Replication lag:</strong> Replicas may be seconds behind — stale reads possible.</li><li><strong>Not for writes:</strong> All writes still hit one primary.</li><li><strong>Consistency issues:</strong> A user writes then reads — might hit a lagging replica and not see their own write.</li></ul><strong>Fix:</strong> Route reads-after-writes to primary or use read-your-writes consistency.` },
      { d: "medium", q: "What is database sharding and what are common sharding strategies?",
        a: `<strong>Sharding</strong> splits data across multiple DB nodes, each responsible for a partition (shard).<br><br><strong>Strategies:</strong><ul><li><strong>Range-based:</strong> Shard by value range (users A-M on shard 1). Simple but can cause hotspots.</li><li><strong>Hash-based:</strong> hash(key) % N determines shard. Even distribution but range queries are hard.</li><li><strong>Directory-based:</strong> A lookup table maps key → shard. Flexible but lookup table is a bottleneck.</li><li><strong>Geographic:</strong> Shard by region. Good for latency and compliance.</li></ul><strong>Challenges:</strong> Cross-shard joins, re-sharding when adding nodes, distributed transactions.` },
      { d: "hard", q: "How would you design an auto-scaling system that responds to traffic spikes in under 60 seconds?",
        a: `<strong>Key components:</strong><ul><li><strong>Metrics collection:</strong> Push real-time CPU, RPS, latency metrics to a time-series DB (Prometheus) every 5–10 seconds.</li><li><strong>Predictive scaling:</strong> Use ML or historical patterns (e.g., daily traffic peaks) to pre-scale before demand hits.</li><li><strong>Reactive scaling:</strong> Threshold triggers scale-out in &lt;30s using pre-warmed AMIs or containers.</li><li><strong>Containerization:</strong> Kubernetes HPA (Horizontal Pod Autoscaler) can spin up pods in &lt;10 seconds.</li><li><strong>Connection draining:</strong> Old instances finish in-flight requests before termination.</li></ul><strong>AWS approach:</strong> EC2 Auto Scaling Groups with Target Tracking policies + scheduled actions for predictable load.` },
      { d: "hard", q: "Design a system to handle 1 million concurrent WebSocket connections.",
        a: `<strong>Challenges:</strong> Each WebSocket holds a TCP connection — 1M connections = enormous fd and memory pressure on a single server.<br><br><strong>Architecture:</strong><ul><li><strong>Connection layer:</strong> Stateless WebSocket servers, each handling ~50K connections. Use sticky sessions at L7 LB so reconnects hit the right server.</li><li><strong>Message broker:</strong> Kafka or Redis Pub/Sub routes messages between connection servers.</li><li><strong>Connection registry:</strong> Redis maps user_id → server_id so targeted messages are routed correctly.</li><li><strong>Horizontal scale:</strong> 20 servers × 50K = 1M connections.</li></ul><strong>Optimization:</strong> Use epoll (Linux) for non-blocking I/O, keep payloads binary (protobuf), heartbeat/ping to detect dead connections.` },
    ],
  },
  {
    id: "availability", icon: "🛡️", color: "#8b5e3c", bg: "rgba(139,94,60,0.12)", title: "Availability",
    questions: [
      { d: "easy", q: "What does 99.9% vs 99.99% availability mean in practice?",
        a: `<strong>SLA math:</strong><ul><li><strong>99.9% (three nines):</strong> ~8.7 hours downtime/year, ~43 min/month</li><li><strong>99.99% (four nines):</strong> ~52 minutes downtime/year, ~4.3 min/month</li><li><strong>99.999% (five nines):</strong> ~5 minutes downtime/year</li></ul><strong>Key insight:</strong> Each additional 9 requires ~10x more engineering investment. Five nines is extremely expensive and usually only for life-critical systems.` },
      { d: "easy", q: "What is a single point of failure (SPOF) and how do you eliminate it?",
        a: `A <strong>SPOF</strong> is any component whose failure causes the entire system to go down.<br><br><strong>Common SPOFs:</strong> Single database, single load balancer, single DNS server, single data center.<br><br><strong>Solutions:</strong><ul><li>Add redundancy — at least 2 of every critical component.</li><li>Use active-active (both serve traffic) or active-passive (failover) setups.</li><li>Distribute across availability zones/regions.</li><li>Use health checks + automatic failover.</li></ul>` },
      { d: "easy", q: "What is the difference between failover and fallback?",
        a: `<strong>Failover:</strong> Automatically switching to a backup system when the primary fails. Example: primary DB goes down, standby DB is promoted automatically.<br><br><strong>Fallback:</strong> Returning to a simpler, degraded mode when full functionality isn't available. Example: payment service is down → show "try again later" instead of crashing.<br><br><strong>Circuit breaker pattern</strong> implements fallback — after N failures, stop calling the downstream service and return a cached/default response.` },
      { d: "medium", q: "Explain the CAP theorem and how it applies to distributed systems.",
        a: `<strong>CAP theorem:</strong> A distributed system can guarantee at most 2 of 3 properties simultaneously:<ul><li><strong>Consistency (C):</strong> Every read returns the most recent write.</li><li><strong>Availability (A):</strong> Every request gets a response (not necessarily current).</li><li><strong>Partition Tolerance (P):</strong> System continues operating despite network partitions.</li></ul><strong>In practice:</strong> Network partitions are unavoidable, so the real choice is between <strong>CP</strong> (sacrifice availability) and <strong>AP</strong> (sacrifice consistency).<br><br><strong>Examples:</strong> HBase = CP, Cassandra = AP, MySQL single-node = CA (no partition tolerance).` },
      { d: "medium", q: "How do you design a system to survive a full data center outage?",
        a: `<strong>Multi-region architecture:</strong><ul><li><strong>Active-Active:</strong> Both regions serve traffic. Uses geo-DNS to route users to nearest region. Data is replicated bidirectionally. Higher complexity, handles any regional failure.</li><li><strong>Active-Passive:</strong> Primary region serves all traffic. Replica is a warm standby. DNS failover on outage. Simpler but has failover latency.</li></ul><strong>Requirements:</strong><ul><li>Data replication with async or sync cross-region replication.</li><li>RPO (Recovery Point Objective): max data loss tolerance.</li><li>RTO (Recovery Time Objective): max time to recover.</li><li>Global load balancer (e.g., AWS Route53 with health checks).</li></ul>` },
      { d: "hard", q: "Design a distributed system with 99.999% availability. What are the engineering trade-offs?",
        a: `<strong>Five nines = ~5 min downtime/year.</strong> Every component must be multiply redundant.<br><br><strong>Architecture decisions:</strong><ul><li><strong>No single deploys during peak:</strong> Use canary releases, blue/green deployments.</li><li><strong>Chaos engineering:</strong> Intentionally kill instances in prod to test resilience (Netflix Chaos Monkey).</li><li><strong>Bulkheads:</strong> Isolate failure domains so one failing service can't cascade.</li><li><strong>Graceful degradation:</strong> Core features work even when auxiliary services fail.</li><li><strong>Synchronous → async:</strong> Replace blocking calls with queues to decouple failure.</li></ul><strong>Trade-offs:</strong> Cost (3–5x more infrastructure), operational complexity, eventual consistency is unavoidable.` },
    ],
  },
  {
    id: "consistency", icon: "⚖️", color: "#4a7c4e", bg: "rgba(74,124,78,0.12)", title: "Consistency",
    questions: [
      { d: "easy", q: "What is the difference between strong and eventual consistency?",
        a: `<strong>Strong consistency:</strong> After a write completes, all subsequent reads see that write. Like a single-threaded model. Simple but requires coordination — slower.<br><br><strong>Eventual consistency:</strong> After a write, replicas will <em>eventually</em> converge to the same value — but reads may temporarily return stale data. Much faster and more available.<br><br><strong>Example:</strong> Your bank balance needs strong consistency. Your Twitter follower count can be eventually consistent.` },
      { d: "easy", q: "What is a write conflict and how can it be resolved?",
        a: `A <strong>write conflict</strong> occurs when two clients update the same data concurrently in a distributed system.<br><br><strong>Resolution strategies:</strong><ul><li><strong>Last Write Wins (LWW):</strong> Use timestamps — most recent write survives. Risk of data loss.</li><li><strong>Merge:</strong> Combine both writes (works for commutative operations like counters).</li><li><strong>Versioning (MVCC):</strong> Keep multiple versions, let the application choose.</li><li><strong>Pessimistic locking:</strong> Lock before write — prevents conflicts but reduces concurrency.</li></ul>` },
      { d: "medium", q: "What are ACID properties and when do you need them?",
        a: `<strong>ACID</strong> guarantees for database transactions:<ul><li><strong>Atomicity:</strong> All operations in a transaction succeed or all fail — no partial updates.</li><li><strong>Consistency:</strong> DB transitions from one valid state to another — constraints always maintained.</li><li><strong>Isolation:</strong> Concurrent transactions don't interfere — as if executed serially.</li><li><strong>Durability:</strong> Committed transactions survive crashes.</li></ul><strong>When needed:</strong> Financial transactions, inventory management, booking systems — anywhere partial updates cause data corruption.<br><br><strong>Cost:</strong> ACID requires locking, 2-phase commit → lower throughput.` },
      { d: "medium", q: "What is the difference between optimistic and pessimistic locking?",
        a: `<strong>Pessimistic locking:</strong> Lock the row before reading. Other transactions must wait. Safe but creates bottlenecks. Used in banking.<br><div class="code-block">SELECT * FROM orders WHERE id=1 FOR UPDATE;</div><strong>Optimistic locking:</strong> Read without lock. Include a version number. On update, check version hasn't changed. If it has, retry.<br><div class="code-block">UPDATE orders SET status='shipped', version=6
WHERE id=1 AND version=5;</div><strong>Choose optimistic</strong> when conflicts are rare (low contention). Choose pessimistic when conflicts are frequent.` },
      { d: "hard", q: "Explain the two-phase commit (2PC) protocol and its limitations.",
        a: `<strong>2PC</strong> coordinates a distributed transaction across multiple nodes:<br><br><strong>Phase 1 — Prepare:</strong> Coordinator asks all participants "can you commit?" Each responds YES (and locks resources) or NO.<br><br><strong>Phase 2 — Commit/Abort:</strong> If all YES → coordinator sends COMMIT. If any NO → sends ABORT.<br><br><strong>Limitations:</strong><ul><li><strong>Blocking:</strong> If coordinator crashes after prepare, participants are locked indefinitely.</li><li><strong>Latency:</strong> 2 round trips minimum across nodes.</li><li><strong>Not partition-tolerant:</strong> Network split can leave system in inconsistent state.</li></ul><strong>Alternative:</strong> Saga pattern — local transactions with compensating transactions for rollback.` },
      { d: "hard", q: "Design a distributed transaction system for a cross-bank payment.",
        a: `<strong>Challenge:</strong> Debit from Bank A and credit Bank B — both must succeed or neither should.<br><br><strong>Approach — Saga Pattern (preferred over 2PC):</strong><ul><li><strong>Step 1:</strong> Reserve funds at Bank A (local transaction).</li><li><strong>Step 2:</strong> Send money to Bank B (async message).</li><li><strong>Step 3:</strong> Confirm receipt at Bank B.</li><li><strong>On failure:</strong> Compensating transaction at Bank A releases the hold.</li></ul><strong>Key tools:</strong><ul><li>Idempotent operations with unique transaction IDs to handle retries.</li><li>Outbox pattern: write event to DB in same transaction as business data, then publish.</li><li>Reconciliation jobs detect and fix inconsistencies.</li></ul>` },
    ],
  },
  {
    id: "loadbalancing", icon: "⚡", color: "#b8732a", bg: "rgba(184,115,42,0.12)", title: "Load Balancing",
    questions: [
      { d: "easy", q: "What are common load balancing algorithms?",
        a: `<ul><li><strong>Round Robin:</strong> Requests cycle through servers in order. Simple, works when servers are equal.</li><li><strong>Weighted Round Robin:</strong> Servers with more capacity get more requests.</li><li><strong>Least Connections:</strong> Send to server with fewest active connections. Good for long-lived connections.</li><li><strong>IP Hash:</strong> Hash client IP → always routes to same server. Used for sticky sessions.</li><li><strong>Random:</strong> Pick randomly — surprisingly effective at scale.</li><li><strong>Least Response Time:</strong> Route to fastest responding server.</li></ul>` },
      { d: "easy", q: "What is sticky session (session affinity) and when should you avoid it?",
        a: `<strong>Sticky sessions</strong> ensure a client always hits the same server (via IP hash or session cookie). Needed when session state is stored in-memory on the server.<br><br><strong>Problems:</strong><ul><li>Uneven load distribution if one user is very active.</li><li>If that server goes down, the user's session is lost.</li><li>Prevents true horizontal scaling.</li></ul><strong>Better solution:</strong> Store sessions in Redis — then any server can handle any request and you don't need sticky sessions.` },
      { d: "medium", q: "How does a Layer 7 load balancer enable more sophisticated routing than Layer 4?",
        a: `<strong>L4 load balancer</strong> sees only TCP/UDP packets — routes by IP and port. Fast but blind to content.<br><br><strong>L7 load balancer</strong> understands HTTP — can route by:<ul><li>URL path: <code>/api/*</code> → API servers, <code>/static/*</code> → CDN</li><li>HTTP headers: <code>Accept-Language</code> → locale-specific server</li><li>Cookie: A/B testing, canary deployments</li><li>Request body: GraphQL query type routing</li></ul><strong>L7 also enables:</strong> SSL termination, gzip compression, WAF integration, rate limiting.` },
      { d: "medium", q: "What is a global server load balancer (GSLB) and how does it work?",
        a: `A <strong>GSLB</strong> routes users to the best data center globally using DNS-based routing.<br><br><strong>How it works:</strong><ol><li>User queries DNS for <code>api.example.com</code>.</li><li>GSLB DNS checks: health of each region, user's geographic location, latency, capacity.</li><li>Returns the IP of the optimal regional cluster.</li><li>TTL is kept short (30–60s) to enable fast failover.</li></ol><strong>Strategies:</strong> Latency-based, geography-based, weighted, failover.<br><br><strong>Tools:</strong> AWS Route53, Cloudflare Load Balancing, Akamai GTM.` },
      { d: "hard", q: "Design a load balancer that handles 10 million requests per second.",
        a: `<strong>At 10M RPS, software L7 LB is the bottleneck. Solution: tiered architecture.</strong><ul><li><strong>Tier 1 — Anycast DNS:</strong> BGP anycast routes users to nearest PoP. Handled by Cloudflare/AWS at the network layer.</li><li><strong>Tier 2 — L4 hardware LB:</strong> ECMP routing across multiple L4 LBs (stateless, line-rate packet forwarding). No connection state.</li><li><strong>Tier 3 — L7 software LB:</strong> Nginx or Envoy clusters. Handle HTTP logic: SSL, routing, rate-limiting.</li><li><strong>Health checking:</strong> Every LB tier health-checks the next. Auto-removes failed nodes.</li></ul><strong>Key:</strong> Consistent hashing for L4 so connection state (if any) stays on same L7 node.` },
    ],
  },
  {
    id: "caching", icon: "🚀", color: "#8b3a2a", bg: "rgba(139,58,42,0.12)", title: "Caching",
    questions: [
      { d: "easy", q: "What are the main cache eviction policies?",
        a: `<ul><li><strong>LRU (Least Recently Used):</strong> Evicts item not accessed for the longest time. Most common — good for general use.</li><li><strong>LFU (Least Frequently Used):</strong> Evicts item accessed least often. Good when popular items stay popular.</li><li><strong>FIFO:</strong> Evicts oldest inserted item. Simple but ignores access patterns.</li><li><strong>TTL-based:</strong> Items expire after a fixed time regardless of access. Good for freshness guarantees.</li></ul><strong>Redis default:</strong> LRU when <code>maxmemory-policy allkeys-lru</code>.` },
      { d: "easy", q: "What is cache-aside (lazy loading) pattern?",
        a: `<strong>Cache-aside</strong> is the most common caching pattern:<ol><li>Application checks cache first.</li><li>On <strong>cache miss</strong>: fetch from DB, store in cache, return data.</li><li>On <strong>cache hit</strong>: return cached data directly.</li></ol><strong>Pros:</strong> Only caches what's actually needed. Cache stays relatively lean.<br><br><strong>Cons:</strong> First request always misses (cold start). Risk of stale data if cache TTL is too long.<br><br><strong>vs Write-through:</strong> Write-through updates cache on every write — always fresh but caches everything.` },
      { d: "medium", q: "What is a cache stampede and how do you prevent it?",
        a: `A <strong>cache stampede</strong> (or thundering herd) happens when a popular cache key expires and many requests simultaneously go to the DB to recompute it.<br><br><strong>Prevention strategies:</strong><ul><li><strong>Mutex lock:</strong> Only one process rebuilds the cache; others wait. Use Redis SETNX.</li><li><strong>Probabilistic early expiration:</strong> Randomly refresh before TTL expires based on computation time.</li><li><strong>Stale-while-revalidate:</strong> Serve stale data while refreshing in background.</li><li><strong>Jitter on TTL:</strong> Add random offset to expiration times so not all keys expire simultaneously.</li></ul>` },
      { d: "medium", q: "How would you cache a user's personalized news feed efficiently?",
        a: `<strong>Challenge:</strong> Feeds are user-specific — can't share a single cache entry.<br><br><strong>Approach — Fanout on Write (Push model):</strong><ul><li>When a user posts, pre-compute and push to followers' feed caches.</li><li>Store each user's feed as a list in Redis: <code>feed:user_id → [post_id1, post_id2, ...]</code></li><li>Paginate by reading slices of the list.</li></ul><strong>Problem:</strong> Celebrity with 10M followers = 10M write operations per post.<br><br><strong>Hybrid solution:</strong> Push for normal users. Pull and merge for celebrities. Blend at read time.` },
      { d: "hard", q: "Design a distributed cache system like Redis Cluster.",
        a: `<strong>Architecture:</strong><ul><li><strong>Sharding:</strong> Use consistent hashing with virtual nodes. Redis Cluster uses 16384 hash slots assigned to nodes.</li><li><strong>Replication:</strong> Each primary has 1–2 replicas. Replicas handle reads and promote to primary on failure.</li><li><strong>Gossip protocol:</strong> Nodes communicate cluster state (membership, slot ownership) via gossip — no central coordinator.</li><li><strong>Failover:</strong> Replicas detect primary failure via heartbeat timeout. Majority vote triggers promotion.</li></ul><strong>Client routing:</strong> Client receives MOVED/ASK redirects if it hits wrong node. Smart clients cache slot map locally.` },
      { d: "hard", q: "How do you handle cache invalidation in a microservices architecture?",
        a: `Cache invalidation across services is one of the hardest distributed systems problems.<br><br><strong>Strategies:</strong><ul><li><strong>Event-driven invalidation:</strong> Service publishes "data changed" event to Kafka. Cache layer consumes and invalidates relevant keys. Decoupled but eventual consistency.</li><li><strong>TTL + Accept Staleness:</strong> Short TTL (30s–5min). Simple, no coordination needed. Works when slight staleness is acceptable.</li><li><strong>Write-through + versioning:</strong> Cache key includes version number. On update, write new version. Old version expires naturally.</li><li><strong>CDC (Change Data Capture):</strong> Debezium watches DB transaction log, publishes changes → cache invalidation. No application changes needed.</li></ul>` },
    ],
  },
  {
    id: "database", icon: "🗄️", color: "#3b6e6e", bg: "rgba(59,110,110,0.12)", title: "Database Choice",
    questions: [
      { d: "easy", q: "When should you choose SQL vs NoSQL?",
        a: `<strong>Choose SQL (PostgreSQL, MySQL) when:</strong><ul><li>Data has clear relationships and structure.</li><li>You need ACID transactions (financial data, inventory).</li><li>Complex queries with JOINs are required.</li><li>Schema is stable and well-defined.</li></ul><strong>Choose NoSQL when:</strong><ul><li>Schema is flexible or evolves rapidly.</li><li>Need massive horizontal scale (billions of records).</li><li>Data is document-like, graph-like, or time-series.</li><li>High write throughput is needed.</li></ul><strong>Not either/or:</strong> Most large systems use multiple databases (polyglot persistence).` },
      { d: "easy", q: "What is an index and when should you not use one?",
        a: `An <strong>index</strong> is a data structure (usually B-tree) that allows fast lookups without full table scans.<br><br><strong>Use indexes on:</strong> Columns in WHERE clauses, JOIN conditions, ORDER BY, columns with high cardinality.<br><br><strong>Don't index when:</strong><ul><li>Table is small — full scan is faster.</li><li>Column has low cardinality (e.g., boolean) — index not selective enough.</li><li>Table has very high write rate — each write must update all indexes.</li><li>Rarely queried columns — index cost outweighs benefit.</li></ul>` },
      { d: "medium", q: "What is the N+1 query problem and how do you fix it?",
        a: `<strong>N+1 problem:</strong> Fetching a list of N items, then making 1 additional query per item.<br><div class="code-block">-- 1 query for orders
SELECT * FROM orders;
-- Then N queries for each order's customer
SELECT * FROM customers WHERE id = ?; -- repeated N times</div><strong>Fixes:</strong><ul><li><strong>JOIN:</strong> Fetch in one query with a join.</li><li><strong>Eager loading:</strong> ORM loads associations upfront (<code>@OneToMany(fetch=EAGER)</code> or <code>.include(:customer)</code>).</li><li><strong>Batch loading / DataLoader:</strong> Collect all IDs, fetch in one <code>IN</code> query.</li></ul>` },
      { d: "medium", q: "Compare wide-column stores (Cassandra) vs document stores (MongoDB).",
        a: `| | Cassandra | MongoDB |
|---|---|---|
| Model | Wide rows, column families | JSON documents |
| Query | Limited — must know partition key | Flexible, rich query language |
| Scaling | Linear horizontal scale | Horizontal + vertical |
| Consistency | Tunable (QUORUM etc.) | Tunable |
| Best for | Time-series, IoT, high-write | Catalogs, user profiles, CMS |<br><br><strong>Cassandra</strong> is designed for extreme write throughput. <strong>MongoDB</strong> is easier to query but has more complex sharding.` },
      { d: "hard", q: "Design the database schema and access patterns for a ride-sharing app like Uber.",
        a: `<strong>Core entities:</strong> Users, Drivers, Trips, Locations.<br><br><strong>Relational DB (PostgreSQL) for:</strong><ul><li>Users, Drivers (profile, payment methods) — structured, transactional.</li><li>Trips — ACID needed for payment and status transitions.</li></ul><strong>NoSQL / specialized:</strong><ul><li><strong>Driver location:</strong> Redis Geo — <code>GEOADD, GEODIST, GEORADIUS</code> for real-time location updates and nearby driver search.</li><li><strong>Trip events / audit log:</strong> Cassandra — append-only, time-ordered, high write throughput.</li><li><strong>Search / matching:</strong> PostGIS (geospatial extension for Postgres) or Elasticsearch.</li></ul><strong>Access patterns:</strong> Find drivers within 2km = Redis/PostGIS. Trip history by user = Postgres with index on (user_id, created_at).` },
    ],
  },
  {
    id: "api", icon: "🔌", color: "#6b5e3a", bg: "rgba(107,94,58,0.12)", title: "API Design",
    questions: [
      { d: "easy", q: "What are REST API best practices for resource naming?",
        a: `<strong>Rules:</strong><ul><li>Use <strong>nouns</strong>, not verbs: <code>/users</code> not <code>/getUsers</code></li><li>Use <strong>plural</strong>: <code>/users</code>, <code>/orders</code></li><li>Hierarchical for relationships: <code>/users/{id}/orders</code></li><li>Use HTTP methods for actions: GET=read, POST=create, PUT=replace, PATCH=update, DELETE=remove</li><li>Return appropriate status codes: 200, 201, 400, 401, 403, 404, 409, 500</li></ul><strong>Versioning:</strong> Use URL prefix <code>/api/v1/</code> or <code>Accept: application/vnd.api+json;version=1</code> header.` },
      { d: "easy", q: "What is the difference between REST, GraphQL, and gRPC?",
        a: `| | REST | GraphQL | gRPC |
|---|---|---|---|
| Protocol | HTTP | HTTP | HTTP/2 |
| Format | JSON/XML | JSON | Protobuf |
| Schema | OpenAPI (optional) | Strongly typed | Strongly typed |
| Over-fetching | Common | Solved by design | N/A |
| Best for | Public APIs | Complex UIs | Microservices |<br><br><strong>gRPC</strong> is fastest (binary, multiplexed). <strong>GraphQL</strong> lets clients request exactly what they need. <strong>REST</strong> is simplest and most universal.` },
      { d: "medium", q: "How do you design rate limiting for a public API?",
        a: `<strong>Algorithms:</strong><ul><li><strong>Token Bucket:</strong> Bucket refills at rate R. Request consumes 1 token. Allows bursts up to bucket size.</li><li><strong>Leaky Bucket:</strong> Requests queued and processed at fixed rate — smooth output, no bursts.</li><li><strong>Sliding Window Counter:</strong> Track requests in rolling time window per user. More accurate than fixed window.</li></ul><strong>Implementation:</strong> Redis + Lua script for atomic check-and-decrement. Key: <code>ratelimit:{user_id}:{minute}</code>.<br><br><strong>Headers to return:</strong> <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>, <code>Retry-After</code>.` },
      { d: "medium", q: "What is idempotency in APIs and why is it critical for payment systems?",
        a: `An operation is <strong>idempotent</strong> if calling it multiple times produces the same result as calling it once.<br><br><strong>HTTP methods:</strong> GET, PUT, DELETE are idempotent by spec. POST is not.<br><br><strong>Why critical for payments:</strong> Network failures may cause client to retry a payment request. Without idempotency, you'd charge the user twice.<br><br><strong>Solution:</strong> Client sends a unique <code>Idempotency-Key</code> header with each request. Server stores the result keyed by it. On retry, return stored result without re-processing.<div class="code-block">POST /payments
Idempotency-Key: uuid-1234-...</div>` },
      { d: "hard", q: "Design a versioning strategy for a high-traffic public API with thousands of clients.",
        a: `<strong>Requirements:</strong> Don't break existing clients, allow evolution, support multiple versions simultaneously.<br><br><strong>Versioning approaches:</strong><ul><li><strong>URL versioning</strong> (<code>/v1/</code>): Easiest for clients, most common. Downside: routes duplication.</li><li><strong>Header versioning</strong> (<code>API-Version: 2024-01</code>): Cleaner URLs. Stripe uses this.</li><li><strong>Content negotiation</strong>: <code>Accept: application/vnd.company.v2+json</code>. Purist REST but complex.</li></ul><strong>Operational strategy:</strong><ul><li>Never remove fields — only add (additive changes are backward compatible).</li><li>Deprecate with sunset headers: <code>Sunset: Sat, 1 Jan 2026 00:00:00 GMT</code></li><li>Track which clients use which versions via analytics before deprecating.</li><li>Run versions simultaneously behind a router proxy.</li></ul>` },
    ],
  },
  {
    id: "observability", icon: "👁️", color: "#7a5c2e", bg: "rgba(122,92,46,0.12)", title: "Observability",
    questions: [
      { d: "easy", q: "What are the three pillars of observability?",
        a: `<ul><li><strong>Metrics:</strong> Numeric time-series data. CPU, RPS, error rate, p99 latency. Tools: Prometheus, Datadog.</li><li><strong>Logs:</strong> Timestamped text records of events. Great for debugging specific incidents. Tools: ELK Stack, Splunk.</li><li><strong>Traces:</strong> Track a request across multiple services end-to-end. Shows where time was spent. Tools: Jaeger, Zipkin, AWS X-Ray.</li></ul><strong>Together:</strong> Metrics alert you to a problem, logs help you understand it, traces show you exactly where in the call chain it occurred.` },
      { d: "easy", q: "What is the difference between latency percentiles (p50, p95, p99)?",
        a: `<ul><li><strong>p50 (median):</strong> Half of requests are faster than this. Represents the typical experience.</li><li><strong>p95:</strong> 95% of requests are faster. Catches outliers that affect a meaningful portion of users.</li><li><strong>p99:</strong> 99% of requests are faster. Catches the worst cases — heavy users often experience this.</li></ul><strong>Why not use average?</strong> Averages hide bimodal distributions. If 99% of requests take 10ms and 1% take 10 seconds, average looks fine but 1% of users are suffering.<br><br><strong>SLOs</strong> (Service Level Objectives) are typically defined on p99 latency.` },
      { d: "medium", q: "How do you implement distributed tracing in a microservices system?",
        a: `<strong>Core concept:</strong> Propagate a <code>trace-id</code> and <code>span-id</code> through every service call via HTTP headers (<code>traceparent</code> in W3C standard).<br><br><strong>Implementation:</strong><ul><li>Use OpenTelemetry SDK — instrument once, export to any backend (Jaeger, Datadog, Honeycomb).</li><li>Each service creates a child span, records timing, tags (user_id, order_id), and errors.</li><li>Async propagation: include trace context in Kafka message headers.</li></ul><strong>Sampling:</strong> Don't trace 100% of requests at scale — use head-based (sample at ingress) or tail-based (sample after seeing errors) sampling.` },
      { d: "medium", q: "What is SLI, SLO, and SLA? How do you set them for a web API?",
        a: `<ul><li><strong>SLI (Service Level Indicator):</strong> A specific metric. E.g., "the percentage of HTTP requests that succeed."</li><li><strong>SLO (Service Level Objective):</strong> A target for an SLI. E.g., "99.9% of requests succeed and return in &lt;200ms, measured over 30 days."</li><li><strong>SLA (Service Level Agreement):</strong> A contractual commitment. Breaching it has financial consequences.</li></ul><strong>Practical approach:</strong><ul><li>Define SLIs around user-visible behavior: availability, latency, error rate, throughput.</li><li>Set SLOs tighter than SLAs. Use an <strong>error budget</strong> — the 0.1% allowed failures per period.</li><li>Alert when error budget burn rate is too high, not just when SLO is breached.</li></ul>` },
      { d: "hard", q: "Design an alerting system that minimizes both false positives and false negatives.",
        a: `<strong>The challenge:</strong> Too sensitive = alert fatigue (team ignores alerts). Too loose = miss real incidents.<br><br><strong>Strategies:</strong><ul><li><strong>Multi-window burn rate alerts:</strong> Alert when error budget burns fast over 1h AND 5m window. Catches both sudden spikes and slow burns (Google SRE approach).</li><li><strong>Anomaly detection:</strong> Alert on deviations from baseline (time-of-day, day-of-week patterns) rather than static thresholds.</li><li><strong>Symptom-based alerts:</strong> Alert on user impact (error rate, latency) not causes (CPU%). CPU at 90% might be fine; user errors are never fine.</li><li><strong>Deduplication + grouping:</strong> AlertManager groups related alerts into one incident.</li><li><strong>Runbooks:</strong> Each alert links to a runbook — reduces MTTR and responder anxiety.</li></ul>` },
    ],
  },
];

const systemDesignCases = [
  {
    id: 1, icon: "🔗", title: "URL Shortener (e.g. bit.ly, tinyurl)",
    tagline: "Convert long URLs into short ones, then redirect users back",
    problem: `Imagine you have a really long URL like <code>https://example.com/very/long/path/with/many/parameters?id=12345</code>. You want to make it short like <code>bit.ly/abc123</code> so it's easier to share. When someone clicks the short URL, they should be sent to the original long URL.`,
    requirements: [
      `<strong>Functional:</strong> Generate short URLs from long ones. Redirect short URLs to long ones. (Optional: track click analytics, allow custom aliases, expiration dates.)`,
      `<strong>Non-functional:</strong> Very fast redirects (under 100ms). Highly available (99.99%+). Read-heavy: 100x more clicks than URLs created.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 100 million new URLs/month = ~40 URLs/second<br>• 10 billion redirects/month = ~4,000 redirects/second<br>• Storage: 100M × 12 months × 5 years = 6 billion URLs × 500 bytes = ~3 TB`,
    components: [
      `<strong>Web servers:</strong> Handle the API requests (create short URL, redirect).`,
      `<strong>Database:</strong> Stores the mapping <code>short_code → long_url</code>. NoSQL works great here (e.g., DynamoDB, Cassandra) since we don't need complex joins.`,
      `<strong>Cache (Redis):</strong> Holds popular short URLs in memory for instant lookups.`,
      `<strong>ID generator:</strong> Creates unique short codes.`,
    ],
    deepDive: `<strong>How to generate short codes? (The most interesting part)</strong><ul><li><strong>Option A — Hash the URL:</strong> Take MD5 of the long URL, base62 encode the first 6–7 characters. Problem: collisions possible.</li><li><strong>Option B — Counter-based (recommended):</strong> Use a global counter (1, 2, 3, ...) and base62 encode it. Counter <code>125</code> → <code>"21"</code>. Counter <code>62^6 = 56 billion</code> codes possible with 6 chars.</li><li><strong>Option C — Pre-generated:</strong> A background job pre-generates batches of unused short codes into a "available codes" table. The API just picks one.</li></ul>Most large systems use a distributed counter (e.g., Twitter Snowflake) to avoid coordination on every request.`,
    flow: `Create flow:
1. User submits long URL
2. App generates short_code (base62 of next counter)
3. Save (short_code, long_url) to DB
4. Return https://bit.ly/{short_code}

Redirect flow:
1. User visits https://bit.ly/abc123
2. Check Redis cache for "abc123"
3. Cache miss? Query DB
4. Return HTTP 301 redirect to long_url`,
    tradeoffs: [
      `<strong>SQL vs NoSQL:</strong> NoSQL chosen for horizontal scaling. Reads are by primary key (short_code) — no JOINs needed.`,
      `<strong>301 vs 302:</strong> 301 (permanent) caches in browser → fewer hits to your server but harder to track. 302 (temporary) means every click hits your server → better analytics, more load.`,
      `<strong>Cache eviction:</strong> Use LRU. Popular URLs stay hot.`,
    ],
    tags: ["NoSQL","Caching","Hashing","Base62","CDN"],
  },
  {
    id: 2, icon: "🚦", title: "Rate Limiter",
    tagline: "Prevent abuse by limiting how often a client can call an API",
    problem: `Your API receives requests. To prevent abuse (or to enforce paid plans), you want to say "this user can only make 100 requests per minute." Beyond that, return HTTP 429 "Too Many Requests."`,
    requirements: [
      `<strong>Functional:</strong> Block requests that exceed limits. Return clear error with retry timing.`,
      `<strong>Non-functional:</strong> Very low latency (must not slow API). Distributed (works across many servers). Accurate (don't undercount or overcount).`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 1M users × 100 requests/min = 100M req/min = ~1.6M req/sec<br>• Each rate-limit check must be < 5ms<br>• Memory: 1M users × 100 bytes = 100 MB (fits in Redis easily)`,
    components: [
      `<strong>API Gateway / Middleware:</strong> Intercepts every request before it reaches your business logic.`,
      `<strong>Redis:</strong> Stores per-user counters in memory (atomic INCR + TTL).`,
      `<strong>Rate limit rules engine:</strong> Defines who gets what limits (free user vs paid user).`,
    ],
    deepDive: `<strong>Algorithm comparison (beginner-friendly):</strong><ul><li><strong>Fixed Window:</strong> Count requests in 1-minute buckets. Simple but allows 2× burst at boundaries (59 requests at 12:59:59 + 60 at 13:00:01 = 100+ in 2 seconds).</li><li><strong>Sliding Window Log:</strong> Keep timestamp of every request. Count those in last 60 seconds. Accurate but uses lots of memory.</li><li><strong>Token Bucket (most popular):</strong> Imagine a bucket that holds 100 tokens. Refills at 100/min. Each request takes 1 token. If empty → reject. Allows bursts but enforces average rate.</li><li><strong>Leaky Bucket:</strong> Like a queue with fixed processing rate. Smooths spiky traffic.</li></ul>`,
    flow: `Token Bucket flow:
1. Request arrives for user_123
2. Lookup Redis key "rl:user_123" → {tokens: 45, last_refill: T1}
3. Calculate tokens to add since last_refill
4. tokens = min(100, tokens + elapsed * rate)
5. If tokens >= 1: tokens -= 1, ALLOW
6. Else: REJECT with 429 + Retry-After header
7. Save back to Redis (atomic Lua script)`,
    tradeoffs: [
      `<strong>Where to limit:</strong> Per-user, per-IP, per-API-key, or globally? Usually combination.`,
      `<strong>Hard vs soft limits:</strong> Hard = reject. Soft = throttle (slow down).`,
      `<strong>Distributed accuracy:</strong> If you have 10 API servers, they must share counters → centralized Redis is the standard answer.`,
      `<strong>Failure mode:</strong> If Redis is down — fail open (allow all) or fail closed (block all)? Most APIs fail open to avoid outages.`,
    ],
    tags: ["Redis","Token Bucket","Distributed","API Gateway"],
  },
  {
    id: 3, icon: "📰", title: "News Feed / Timeline (Twitter, Facebook)",
    tagline: "Show users a personalized stream of posts from people they follow",
    problem: `When you open Twitter, you see posts from accounts you follow, sorted by time. The challenge: with millions of users posting and following each other, how do you build each user's personalized feed quickly?`,
    requirements: [
      `<strong>Functional:</strong> User can post. User can follow others. User sees feed of posts from followees, in some order.`,
      `<strong>Non-functional:</strong> Feed loads fast (under 200ms). Handle celebrities with 100M followers. Read:write ratio is ~100:1.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 200M daily users × 5 feed loads = 1B feed loads/day = ~12K reads/sec<br>• 100M posts/day = ~1,200 posts/sec<br>• Storage: 100M posts × 365 days × 1KB = ~36 TB/year`,
    components: [
      `<strong>Post service:</strong> Saves new posts to DB.`,
      `<strong>Follow service:</strong> Manages follow relationships.`,
      `<strong>Feed generation service:</strong> Builds each user's feed.`,
      `<strong>Feed cache (Redis):</strong> Stores pre-computed feeds.`,
      `<strong>Notification/Fanout service:</strong> Pushes new posts to followers' feeds.`,
    ],
    deepDive: `<strong>The big question: Push or Pull?</strong><ul><li><strong>Pull (fan-out on read):</strong> When user opens app, query "give me latest 100 posts from all 500 people I follow." Simple but slow at scale — that's 500 queries per feed load.</li><li><strong>Push (fan-out on write):</strong> When someone posts, push that post into all their followers' feed caches. Feed loads are then just one Redis read. Fast but expensive for celebrities (1 post → 100M writes).</li><li><strong>Hybrid (best for real systems):</strong> Use Push for normal users (under 10K followers). Use Pull for celebrities. At read time, merge: get pushed posts from feed cache + pulled posts from celebrities the user follows.</li></ul>`,
    flow: `Post flow (Push model):
1. User Alice posts "Hello!"
2. Save post to Posts DB
3. Lookup Alice's followers (e.g., 500 users)
4. For each follower, prepend post_id to their Redis feed list
5. Trim each list to last 1000 posts

Feed read flow:
1. User Bob opens app
2. Read Redis feed:bob → [post_id1, post_id2, ...]
3. Hydrate post_ids → full posts (parallel read)
4. Return to client`,
    tradeoffs: [
      `<strong>Storage cost:</strong> Push duplicates posts in many caches. Worth it for read speed.`,
      `<strong>Ranking:</strong> Pure chronological is simple. ML-based ranking (Facebook, Instagram) requires a separate ranking service.`,
      `<strong>Consistency:</strong> Slight delay (seconds) for posts to appear in followers' feeds is acceptable.`,
    ],
    tags: ["Fanout","Pub/Sub","Redis","Caching","Hybrid Push-Pull"],
  },
  {
    id: 4, icon: "💬", title: "Real-Time Chat System (WhatsApp, Slack)",
    tagline: "Send messages instantly between users and groups",
    problem: `Two users send messages to each other. The message must appear instantly (under 1 second). You must support 1-on-1 chats, group chats, online/offline status, and message history.`,
    requirements: [
      `<strong>Functional:</strong> Send/receive messages. Group chats. Read receipts. Online presence. Message history.`,
      `<strong>Non-functional:</strong> Messages delivered in real-time (<500ms). Support millions of concurrent connections. Messages must not be lost.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 50M daily users × 40 messages = 2B messages/day = ~23K messages/sec<br>• 10M concurrent users online<br>• Storage: 2B msg × 365 days × 200 bytes = ~146 TB/year`,
    components: [
      `<strong>WebSocket gateway:</strong> Holds long-lived connections to clients.`,
      `<strong>Message service:</strong> Routes messages between users.`,
      `<strong>Message storage:</strong> Stores history (Cassandra is great — high write, ordered by time).`,
      `<strong>Presence service:</strong> Tracks who's online (Redis).`,
      `<strong>Notification service:</strong> Sends push notifications when user is offline.`,
    ],
    deepDive: `<strong>How do messages travel in real-time?</strong><br>The traditional HTTP model is request-response — but for chat we need the server to push messages to the client. Options:<ul><li><strong>Polling:</strong> Client asks server every few seconds. Wasteful, slow.</li><li><strong>Long polling:</strong> Client waits, server responds when there's a message. Better, but still some delay.</li><li><strong>WebSocket (winner):</strong> Persistent two-way connection. Server can push instantly. Used by Slack, WhatsApp Web.</li></ul><br><strong>The routing problem:</strong> Alice (connected to Server A) sends message to Bob (connected to Server B). How does Server A know to forward to Server B?<br><br><strong>Solution:</strong> A connection registry (Redis) maps user_id → server_id. When Server A receives the message, it looks up Bob's location and either forwards directly OR publishes to a message broker (Kafka/Redis Pub/Sub) that all servers subscribe to.`,
    flow: `Message flow:
1. Alice types message → her client sends via WebSocket to Server A
2. Server A saves message to Cassandra (history)
3. Server A looks up Bob in connection registry → "Bob is on Server B"
4. Server A publishes to Kafka topic "messages.bob"
5. Server B (subscribed) receives message
6. Server B sends to Bob via WebSocket
7. Bob's client renders the message

If Bob is offline: skip step 6, send push notification (FCM/APNs).`,
    tradeoffs: [
      `<strong>End-to-end encryption:</strong> WhatsApp encrypts so even servers can't read. Adds complexity but better privacy.`,
      `<strong>Message ordering:</strong> Hard in distributed systems. Use timestamps + tie-breakers (server_id, sequence number).`,
      `<strong>Group chats with 100K members:</strong> Don't fan out 100K times — use a separate broadcast service.`,
    ],
    tags: ["WebSocket","Cassandra","Pub/Sub","Real-time","Push Notifications"],
  },
  {
    id: 5, icon: "🔍", title: "Search Autocomplete (Google, Amazon)",
    tagline: "Suggest queries as the user types each letter",
    problem: `As a user types "iph" you instantly suggest "iphone", "iphone 15", "iphone case". The challenge: do this in under 100ms across hundreds of millions of possible queries.`,
    requirements: [
      `<strong>Functional:</strong> Suggest top N completions for any prefix. Suggestions ranked by popularity.`,
      `<strong>Non-functional:</strong> Sub-100ms latency. Updated daily with new trending queries.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 10B searches/day, 5 keystrokes each = 50B autocomplete requests/day = ~600K req/sec<br>• 10M unique queries to suggest from<br>• Average query: 20 chars × 5 bytes = 100 bytes<br>• Memory for trie: ~5 GB`,
    components: [
      `<strong>Aggregator service:</strong> Collects search query logs daily.`,
      `<strong>Trie builder:</strong> Builds the prefix tree from top queries.`,
      `<strong>Query service:</strong> Holds the trie in memory, serves suggestions.`,
      `<strong>CDN:</strong> Caches common prefix → suggestions at edge.`,
    ],
    deepDive: `<strong>What is a Trie? (Beginner explanation)</strong><br>A trie is a tree where each node represents a character. Following a path from root spells a word. To find suggestions for "ip", traverse i → p, then collect all words below that node.<br><br><strong>The naive trie won't scale</strong> because finding top 5 suggestions requires walking the entire subtree. <strong>Solution:</strong> Pre-compute and store top-5 suggestions <em>at each node</em>. So when you reach "ip", you immediately have ["iphone", "ipad", "ipod", ...] without traversing further.<br><br><strong>How is the trie updated?</strong><ul><li>Search logs flow into Kafka.</li><li>A daily batch job (Hadoop/Spark) counts query frequencies.</li><li>Top 10M queries are used to build a new trie.</li><li>The new trie is deployed to all query servers (it's read-only).</li></ul>`,
    flow: `Query flow:
1. User types "ip" → frontend sends GET /autocomplete?q=ip
2. CDN: cached? Return immediately.
3. Cache miss → request hits query service
4. Service traverses trie: root → i → p
5. Reads top-5 cached at this node: ["iphone", "ipad", ...]
6. Returns JSON in under 50ms

Update flow (offline):
1. Aggregator reads yesterday's queries from log storage
2. Spark job: count frequency, take top 10M
3. Build new trie with cached top-5 at each node
4. Deploy to query servers (blue-green)`,
    tradeoffs: [
      `<strong>Personalization:</strong> Generic vs user-specific suggestions. Personalization adds complexity (per-user trie not feasible — use a small model on top instead).`,
      `<strong>Real-time updates:</strong> If a celebrity is suddenly trending, daily updates may be too slow. Hybrid: serve daily trie + a small "trending" overlay updated every minute.`,
      `<strong>Language/locale:</strong> Need separate tries per language.`,
    ],
    tags: ["Trie","Prefix Search","CDN","Batch Processing","Spark"],
  },
  {
    id: 6, icon: "🔔", title: "Notification System",
    tagline: "Send emails, SMS, and push notifications reliably to millions of users",
    problem: `When a user gets a Facebook message, completes a purchase, or has an Uber driver arriving, the system must send them a notification — via push, email, or SMS. The challenge: deliver fast, don't spam, and handle millions per second.`,
    requirements: [
      `<strong>Functional:</strong> Multiple channels (push, email, SMS, in-app). Templates for messages. User preferences (don't email me at night).`,
      `<strong>Non-functional:</strong> Reliable delivery (no lost notifications). High throughput. Don't send duplicates.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 1B daily notifications across all channels = ~12K/sec average, 100K/sec peak<br>• Emails: 1KB × 1B = 1 TB/day if we stored<br>• Most are fire-and-forget; we keep audit logs only`,
    components: [
      `<strong>Notification API:</strong> Other services call this to send a notification.`,
      `<strong>Message Queue (Kafka):</strong> Buffers requests so spikes don't overwhelm.`,
      `<strong>Notification workers:</strong> Pull from queue, process, send.`,
      `<strong>Channel adapters:</strong> APNs (iOS), FCM (Android), SendGrid (email), Twilio (SMS).`,
      `<strong>Template service:</strong> Stores message templates.`,
      `<strong>Preference service:</strong> User opt-ins, quiet hours, channel preferences.`,
      `<strong>Dedup store (Redis):</strong> Prevents duplicate sends.`,
    ],
    deepDive: `<strong>Why so much complexity for "just sending a notification"?</strong><br>Three challenges:<ul><li><strong>Reliability:</strong> External services (APNs, SendGrid) can fail. We need retries with backoff.</li><li><strong>Throughput:</strong> Marketing campaigns send millions in minutes. Direct sending would crash. Use queues to smooth out.</li><li><strong>Idempotency:</strong> If a worker crashes mid-send, retry might send duplicate. Solution: each notification has a unique ID. Before sending, check Redis SETNX to ensure not already sent.</li></ul><strong>Priority queues matter:</strong> "Your driver arrived" (high priority) shouldn't wait behind "Weekly newsletter" (low priority). Use multiple Kafka topics: <code>notifications.high</code>, <code>notifications.normal</code>, <code>notifications.bulk</code>.`,
    flow: `Send flow:
1. Order service calls POST /notify {user_id, type: "order_shipped"}
2. API generates notification_id, looks up user prefs
3. User has email enabled → publish to Kafka "email.normal"
4. Worker consumes message:
   a. Check Redis: notification_id seen? Skip if yes.
   b. Render template with order details
   c. Call SendGrid API
   d. On success: mark sent in Redis (TTL 24h), log audit
   e. On failure: retry with exponential backoff (1s, 5s, 30s...)
5. After 5 failed retries → dead letter queue for manual review`,
    tradeoffs: [
      `<strong>At-least-once vs exactly-once:</strong> Exactly-once is impossible in distributed systems. Use at-least-once + idempotency.`,
      `<strong>Real-time vs batch:</strong> Time-sensitive (alerts) → real-time. Marketing → batch and rate-limit.`,
      `<strong>Channel fallback:</strong> Push failed? Try email? Adds complexity but improves reach.`,
    ],
    tags: ["Kafka","Idempotency","APNs/FCM","Priority Queues","Retry"],
  },
  {
    id: 7, icon: "📁", title: "File Storage Service (Dropbox, Google Drive, S3)",
    tagline: "Upload, store, and retrieve files of any size, accessible from anywhere",
    problem: `Users upload files (photos, videos, documents) and access them from any device. Files can be huge (a 4K video is gigabytes). The system must be reliable — losing a user's data is unacceptable.`,
    requirements: [
      `<strong>Functional:</strong> Upload, download, delete files. Sync across devices. Share links.`,
      `<strong>Non-functional:</strong> Durability (99.999999999% — 11 nines). Available globally. Handle huge files.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 500M users, 10 GB each = 5 EB (exabytes!) total storage<br>• 100M uploads/day, average 5 MB = 500 TB/day ingress<br>• Read:write = 5:1`,
    components: [
      `<strong>API Gateway:</strong> Authenticates and routes requests.`,
      `<strong>Upload service:</strong> Handles uploads, splits files into chunks.`,
      `<strong>Metadata service:</strong> Stores file info — name, size, owner, chunk locations (relational DB).`,
      `<strong>Block storage:</strong> Stores actual file chunks (object storage like S3).`,
      `<strong>Sync service:</strong> Notifies clients of changes.`,
      `<strong>CDN:</strong> Caches popular files at edge for fast download.`,
    ],
    deepDive: `<strong>Why split files into chunks?</strong><br>If you upload a 5GB video and your connection drops at 4.9GB, you'd have to start over. Solution: split into 4MB chunks, upload each independently, retry only failed ones.<br><br><strong>How chunks work:</strong><ul><li>Client splits file into 4MB chunks.</li><li>Computes a hash (e.g., SHA-256) of each chunk.</li><li>Uploads each chunk to object storage with the hash as the key.</li><li>Sends metadata (file name, ordered list of chunk hashes) to metadata service.</li></ul><strong>Bonus benefit — Deduplication:</strong> If two users upload the same video, the chunk hashes will match. Don't store twice — just save space! Dropbox saves enormous storage this way.<br><br><strong>How is durability achieved?</strong> Each chunk is stored in 3 different locations (data centers). Erasure coding (like RAID) can do this with less overhead — store data + parity, can rebuild from any subset.`,
    flow: `Upload flow:
1. Client splits 100MB file into 25 chunks of 4MB
2. For each chunk: compute hash, upload to storage
3. Storage replicates chunk to 3 zones
4. Client sends file metadata (chunk hashes in order) to metadata DB

Download flow:
1. Client requests file_id
2. Metadata service returns ordered chunk hashes
3. Client (or CDN) fetches chunks in parallel from storage
4. Client reassembles file

Sync flow:
1. User edits file on Device A
2. Only changed chunks re-uploaded (delta sync)
3. Sync service publishes "file changed" event
4. Device B subscribes via WebSocket → pulls new chunks`,
    tradeoffs: [
      `<strong>Strong consistency vs availability:</strong> S3 was originally eventually consistent for performance. Now it's strong (since 2020).`,
      `<strong>Chunk size:</strong> Smaller = better resume, more metadata overhead. Larger = faster upload, worse on flaky connections. 4MB is a common sweet spot.`,
      `<strong>Encryption:</strong> Server-side (simpler) vs client-side (more secure but you can't preview).`,
    ],
    tags: ["Object Storage","Chunking","Deduplication","CDN","Erasure Coding"],
  },
  {
    id: 8, icon: "🎬", title: "Video Streaming Service (YouTube, Netflix)",
    tagline: "Upload, process, and stream videos to millions globally",
    problem: `Users upload videos. Other users watch them. The challenge: videos are huge, viewers have varying internet speeds, and a popular video might be watched by millions simultaneously.`,
    requirements: [
      `<strong>Functional:</strong> Upload videos. Stream at adaptive quality. Search/recommend. Comments/likes.`,
      `<strong>Non-functional:</strong> Stream starts in <2s. No buffering. Global low-latency. Survive viral spikes (10M concurrent on one video).`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 500 hours uploaded/minute (YouTube actual)<br>• 1B hours watched/day<br>• Storage: 500hr × 60min × 60 × ~5MB/s = ~5.4 PB/day uploaded`,
    components: [
      `<strong>Upload service:</strong> Receives raw video.`,
      `<strong>Transcoding pipeline:</strong> Converts video into multiple resolutions/bitrates.`,
      `<strong>Object storage (S3):</strong> Stores all versions of every video.`,
      `<strong>CDN:</strong> Critical — caches video chunks at edge servers worldwide.`,
      `<strong>Metadata DB:</strong> Title, owner, tags, view counts.`,
      `<strong>Recommendation engine:</strong> ML service for "Up Next."`,
      `<strong>Streaming server:</strong> Serves manifest files (HLS/DASH playlists).`,
    ],
    deepDive: `<strong>What is adaptive bitrate streaming? (Key concept)</strong><br>Your phone on 4G has fast WiFi at home but slow data on subway. The video player should automatically pick the right quality. The trick:<ul><li>When you upload, the system creates the same video at <strong>multiple qualities</strong>: 240p, 480p, 720p, 1080p, 4K.</li><li>Each version is split into <strong>2-10 second chunks</strong>.</li><li>The video player downloads chunks one at a time. Based on download speed, it picks higher or lower quality for the next chunk.</li><li>Result: video adapts to network conditions in real-time, no buffering.</li></ul>This is HLS (HTTP Live Streaming, Apple) or DASH (Dynamic Adaptive Streaming over HTTP).<br><br><strong>Why CDN is essential:</strong> A 4K video chunk is 5MB. If 10M people watch the same video, serving from origin = 50TB transferred. CDN edge servers (close to users) cache the chunks — origin is hit only on cache miss. Netflix even has its own CDN (Open Connect) installed inside ISPs.`,
    flow: `Upload flow:
1. User uploads MP4 to upload service
2. Service writes to raw storage, queues transcoding job
3. Transcoding workers (e.g., AWS MediaConvert) create:
   - 240p, 480p, 720p, 1080p, 4K versions
   - Each split into 6-second .ts chunks
   - Manifest .m3u8 file listing all chunks per quality
4. All output stored in object storage
5. Metadata DB updated: video is "ready"

Watch flow:
1. User clicks video → request manifest URL
2. Player downloads .m3u8 (lists all qualities & chunks)
3. Player picks 720p, downloads chunk 1 from CDN
4. CDN cache hit → instant. Miss → fetch from origin, cache.
5. While playing chunk 1, player downloads chunk 2
6. If download slow → switch to 480p for chunk 3
7. Continue until video ends`,
    tradeoffs: [
      `<strong>Live vs VOD:</strong> Live needs even lower latency (HLS = 10-30s lag, WebRTC = sub-second). VOD is easier — pre-process everything.`,
      `<strong>Storage cost:</strong> Storing 5 qualities = 5x cost. Worth it for user experience.`,
      `<strong>DRM:</strong> Premium content (Netflix) needs encryption + key servers.`,
    ],
    tags: ["CDN","HLS/DASH","Transcoding","Adaptive Bitrate","Object Storage"],
  },
  {
    id: 9, icon: "⚡", title: "Distributed Cache (Redis Cluster, Memcached)",
    tagline: "Store hot data in memory across many machines for ultra-fast access",
    problem: `Your database is too slow for popular queries. You want to keep frequently-accessed data in RAM. A single Redis server can hold ~100GB. What if you need 10TB of cached data and 1M operations/sec?`,
    requirements: [
      `<strong>Functional:</strong> GET/SET key-value. Optional TTL. Atomic operations.`,
      `<strong>Non-functional:</strong> Sub-millisecond latency. Horizontally scalable. Survives node failures.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 10 TB data / 100 GB per node = 100 nodes<br>• 1M ops/sec / 100K ops per node = 10 nodes minimum<br>• Each piece of data replicated 2-3x for fault tolerance`,
    components: [
      `<strong>Cache nodes:</strong> Each holds a subset of keys + RAM-only storage.`,
      `<strong>Client library:</strong> Knows how to find which node holds which key.`,
      `<strong>Coordination layer:</strong> Membership, failover (gossip protocol or central coordinator).`,
    ],
    deepDive: `<strong>How is data spread across nodes? Consistent Hashing!</strong><br>Naive approach: <code>node = hash(key) % N</code>. Problem: when N changes (add/remove node), almost <em>every</em> key remaps to a different node — cache entirely invalidated.<br><br><strong>Consistent hashing solves this:</strong><ul><li>Imagine a circle (ring) numbered 0 to 2^32.</li><li>Each node is placed on the ring at a hashed position.</li><li>Each key is also hashed to a position.</li><li>Key belongs to the next node clockwise.</li></ul>When you add a node, only keys between it and its predecessor are remapped — much smaller disruption.<br><br><strong>Replication for fault tolerance:</strong> Each key is stored on the next 2-3 nodes clockwise. If primary fails, next node takes over instantly.<br><br><strong>How clients find the right node:</strong><ul><li><strong>Smart clients:</strong> Library knows the ring topology. Sends request directly. (Redis Cluster).</li><li><strong>Proxy:</strong> Client sends to any proxy, proxy forwards to right node. (Twemproxy).</li></ul>`,
    flow: `SET flow:
1. Client wants SET user:123 → "alice"
2. Client hashes "user:123" → position 0x7A on ring
3. Looks up: position 0x7A → Node 5
4. Sends SET request to Node 5
5. Node 5 stores in RAM, replicates to Node 6, 7
6. Returns OK to client

GET flow (with node failure):
1. Client wants GET user:123 → goes to Node 5
2. Node 5 is dead → connection fails
3. Client tries replica Node 6
4. Node 6 is the new primary, returns "alice"

Membership change:
1. Node 8 added at position 0xA0
2. Gossip protocol spreads: "Node 8 joined"
3. All clients update ring map
4. Node 8 pulls keys for its range from Node 9 (its predecessor)`,
    tradeoffs: [
      `<strong>Memory cost:</strong> RAM is 10x more expensive than SSD. Use cache for hottest data only.`,
      `<strong>Consistency:</strong> Replication is async by default = eventual consistency. Sync replication = strong consistency but slower.`,
      `<strong>Eviction:</strong> When full, evict using LRU/LFU/TTL.`,
      `<strong>Cache invalidation:</strong> Hardest problem. Use TTLs liberally + event-based invalidation.`,
    ],
    tags: ["Consistent Hashing","Replication","Gossip Protocol","RAM","Sharding"],
  },
  {
    id: 10, icon: "🕷️", title: "Web Crawler (Googlebot)",
    tagline: "Visit billions of web pages to build a search index",
    problem: `To make a search engine, you need to know what's on every webpage. A crawler starts from a few seed URLs, downloads pages, extracts links, and follows them — eventually visiting most of the web.`,
    requirements: [
      `<strong>Functional:</strong> Download HTML, extract links, store content. Avoid duplicates. Respect robots.txt. Re-crawl periodically.`,
      `<strong>Non-functional:</strong> Crawl billions of pages. Polite (don't overwhelm sites). Distributed across thousands of machines.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 10B pages × 500KB = 5 PB raw HTML<br>• Re-crawl every 30 days = 10B / 30d / 86400s = ~3,800 pages/sec<br>• Need ~1,000 crawler machines, each downloading ~4 pages/sec`,
    components: [
      `<strong>URL frontier (queue):</strong> Holds URLs to be crawled. Prioritized.`,
      `<strong>Fetcher service:</strong> Downloads HTML.`,
      `<strong>Parser service:</strong> Extracts text and links.`,
      `<strong>Duplicate detector:</strong> Avoids crawling the same page twice (Bloom filter).`,
      `<strong>URL filter:</strong> Skips bad URLs, blocked by robots.txt, etc.`,
      `<strong>Storage:</strong> Saves raw HTML + extracted text for later indexing.`,
      `<strong>DNS resolver cache:</strong> Resolving DNS is slow — cache results.`,
    ],
    deepDive: `<strong>Why is "politeness" so important?</strong><br>If your crawler hits example.com 1000 times per second, you'll DDoS the site and they'll block you. Politeness rules:<ul><li>Honor robots.txt (says what you may/may not crawl).</li><li>Don't hit one domain more than once per second (per crawler).</li><li>Use User-Agent header so site owners can identify you.</li></ul><strong>The URL frontier is the heart:</strong> It's not just a queue — it's a priority system. <strong>News sites</strong> should be re-crawled every few minutes. <strong>Static blogs</strong> every month. Importance is determined by PageRank, freshness, etc.<br><br><strong>How to detect duplicates at scale:</strong> 10B URLs in a hash set = too much memory. Use a <strong>Bloom filter</strong>: a probabilistic data structure that says "definitely not seen" or "probably seen" with 1% false positive rate. Uses 1 byte per URL = 10 GB total — fits in memory.<br><br><strong>How to detect duplicate content (different URLs, same content)?</strong> Compute a fingerprint (e.g., SimHash) of the page text. Pages with similar SimHash are near-duplicates.`,
    flow: `Crawl loop:
1. Pull URL from frontier (high-priority queue)
2. Check Bloom filter: seen this URL? Skip.
3. Resolve DNS (cached if possible)
4. Check robots.txt for the domain (cached)
5. Wait if last crawl of this domain < 1s ago (politeness)
6. HTTP GET the URL
7. Parse HTML:
   - Extract text → save to storage
   - Extract links → for each: filter, normalize, push to frontier
   - Compute content fingerprint → check duplicate content
8. Update Bloom filter: URL now seen
9. Schedule next visit time based on freshness
10. Repeat`,
    tradeoffs: [
      `<strong>Breadth-first vs depth-first:</strong> BFS reaches diverse pages faster. Most crawlers use BFS with priority adjustments.`,
      `<strong>Distributed crawling:</strong> Partition by domain hash so each crawler handles a subset of domains (politeness easier).`,
      `<strong>JavaScript-heavy sites:</strong> Need a headless browser (Chromium) to render — much slower.`,
      `<strong>Trap detection:</strong> Some sites generate infinite URLs (e.g., calendar with next-month links). Need cycle detection.`,
    ],
    tags: ["BFS","Bloom Filter","Priority Queue","robots.txt","Distributed"],
  },
  {
    id: 11, icon: "💳", title: "Payment System (Stripe, PayPal)",
    tagline: "Charge customers reliably without losing or duplicating money",
    problem: `User clicks "Buy." Money must move from their bank to your bank. The challenge: this involves multiple external systems (card networks, banks), can fail at any step, and absolutely must never charge twice or lose track of a charge.`,
    requirements: [
      `<strong>Functional:</strong> Charge a card. Refund. Handle webhooks from banks. Multiple currencies. Recurring billing.`,
      `<strong>Non-functional:</strong> ACID guarantees. Idempotent. Auditable (every cent tracked). PCI-compliant.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 1M payments/day = ~12/sec average, 100/sec peak<br>• Each payment: $50 average × 1M = $50M/day flowing<br>• Storage: small (text records) but must be retained for years (audit/legal)`,
    components: [
      `<strong>Payment API:</strong> Accepts charge requests with idempotency key.`,
      `<strong>Ledger service:</strong> Double-entry bookkeeping of every transaction.`,
      `<strong>Card network gateway:</strong> Talks to Visa/Mastercard.`,
      `<strong>Bank integrations:</strong> ACH, wire, SEPA.`,
      `<strong>Webhook handler:</strong> Banks send delayed status updates.`,
      `<strong>Reconciliation service:</strong> Daily batch — does our ledger match bank statements?`,
      `<strong>Fraud detection:</strong> ML scoring on each transaction.`,
    ],
    deepDive: `<strong>Why is idempotency the #1 concern?</strong><br>Imagine: User clicks "Pay $100." Network fails before response. User retries. Without protection, you'd charge $200.<br><br><strong>Solution:</strong> Client generates a unique <strong>Idempotency-Key</strong> (UUID) and includes it in the request. Server stores key + result. If key seen again, return stored result without re-processing.<br><br><strong>What is the ledger?</strong><br>A ledger is just a list of money movements, recorded immutably. Double-entry means every transaction has a debit and credit that sum to zero:<br><div class="case-flow">Debit:  user_alice_balance   -$100
Credit: merchant_bob_balance +$100</div>Why double-entry? It mathematically <em>must</em> balance. If our ledger ever doesn't sum to zero, we have a bug.<br><br><strong>The Saga pattern for distributed transactions:</strong><br>Real payment touches your DB + card network + bank. You can't have a single ACID transaction across all three. Instead, use a <strong>saga</strong>: a series of local transactions with compensating actions for rollback.<br><br><strong>Webhooks and the "settlement" problem:</strong> When you charge a card, the response is "authorized" — the money hasn't actually moved yet. Settlement happens 1-3 days later via batch ACH. Banks send webhooks: "auth captured", "auth declined", "chargeback filed". Your system must handle these out-of-order events.`,
    flow: `Charge flow (saga):
1. Client sends POST /charges with Idempotency-Key
2. API checks key → not seen? Continue.
3. Begin saga, save state: PENDING
4. Step A: Reserve in ledger (debit user, credit pending account)
5. Step B: Call Stripe/Visa API → returns "authorized"
6. Step C: Update saga state → AUTHORIZED
7. Return success to client

If step B fails:
- Compensating: release ledger reservation
- Mark saga FAILED, log reason

Settlement (asynchronous, days later):
1. Bank webhook arrives: "tx_123 captured"
2. Move money from pending account to merchant balance
3. Mark saga COMPLETE

Reconciliation (daily):
1. Pull bank statement
2. Compare to our ledger
3. Any mismatch → alert ops team`,
    tradeoffs: [
      `<strong>Strong consistency required:</strong> Cannot use eventual consistency for money. Use ACID database (PostgreSQL).`,
      `<strong>Audit trail forever:</strong> Never delete transactions. Soft-delete + immutable event log.`,
      `<strong>Latency vs safety:</strong> Synchronous fraud check adds ~500ms. Acceptable for trust.`,
      `<strong>PCI compliance:</strong> Don't store raw card numbers — tokenize via Stripe/Braintree.`,
    ],
    tags: ["ACID","Idempotency","Saga","Double-Entry Ledger","Webhooks"],
  },
  {
    id: 12, icon: "🚗", title: "Ride-sharing System (Uber, Lyft)",
    tagline: "Match riders with nearby drivers in real-time",
    problem: `A rider opens the app and requests a ride. The system must find the nearest driver, send them the request, track both during the ride, and process payment. All in seconds.`,
    requirements: [
      `<strong>Functional:</strong> Match rider to nearest driver. Show ETA. Track location during trip. Process fare.`,
      `<strong>Non-functional:</strong> Real-time location updates (every 5s). Match in under 5s. Survive city-scale demand spikes.`,
    ],
    estimation: `<strong>Back-of-envelope:</strong><br>• 5M active drivers globally, each updating location every 5s = 1M updates/sec<br>• 1M ride requests/day = ~12/sec, 1000/sec peak (NYE)<br>• Trip data: 100M trips/day × 1KB = 100 GB/day`,
    components: [
      `<strong>Mobile apps:</strong> Driver app (sends location), rider app (requests ride).`,
      `<strong>Location service:</strong> Receives driver location updates, indexes by geography.`,
      `<strong>Matching service:</strong> Given a pickup point, finds nearby drivers.`,
      `<strong>Trip service:</strong> Manages trip state machine (requested → matched → in-progress → completed).`,
      `<strong>Payment service:</strong> Processes fare at trip end.`,
      `<strong>Notification service:</strong> Push notifications to driver/rider.`,
      `<strong>Maps/Routing:</strong> ETA, route guidance (Google Maps API or in-house).`,
    ],
    deepDive: `<strong>The core challenge: "Find drivers near me" — fast.</strong><br>If you have 1M drivers and a rider at lat=37.78, lng=-122.41, scanning all 1M is too slow. Solutions:<ul><li><strong>Geohashing:</strong> Convert (lat, lng) to a string like "9q8yyk". Strings with similar prefixes are nearby. Index by geohash → query "all drivers with prefix 9q8yyk".</li><li><strong>Quad-trees:</strong> Recursively divide map into 4 quadrants. Each leaf holds a few drivers. Search only leaves near the rider.</li><li><strong>Redis Geo (simplest):</strong> Built-in commands: <code>GEOADD drivers 37.78 -122.41 driver_42</code>, <code>GEORADIUS drivers 37.78 -122.41 2 km</code> — Uber-scale companies use custom solutions but Redis Geo is great for most use cases.</li></ul><strong>The trip state machine:</strong><div class="case-flow">REQUESTED → MATCHED → DRIVER_EN_ROUTE
  → ARRIVED → IN_TRIP → COMPLETED
                       ↘ CANCELED</div>State must be persisted (DB) and broadcast to both rider and driver in real-time (WebSocket).<br><br><strong>Surge pricing in plain English:</strong> If demand &gt; supply in an area, raise prices. This (a) reduces demand (b) attracts more drivers from neighboring areas. Implemented via geofenced zones with a multiplier updated every minute based on (active requests / nearby drivers) ratio.`,
    flow: `Driver location update (every 5s):
1. Driver app sends (lat, lng) to location service
2. Location service updates Redis Geo: GEOADD drivers
3. Also writes to Cassandra for trip-route history

Match flow:
1. Rider taps "Request Ride" at (lat=37.78, lng=-122.41)
2. Trip service creates trip, state = REQUESTED
3. Matching service: GEORADIUS drivers 37.78 -122.41 2km
4. Returns 5 nearest available drivers
5. Send push notification to driver_1 → has 15s to accept
6. driver_1 accepts → trip state = MATCHED
7. (If declines or times out → try driver_2, etc.)
8. Both rider and driver subscribe to trip WebSocket channel

During trip:
1. Driver location streams via WebSocket to rider's app
2. ETA recalculated using maps API
3. On trip completion: 
   - Calculate fare (distance + time + surge)
   - Charge rider's saved card via payment service
   - Pay out driver (with fee deducted)
   - Save trip record in DB`,
    tradeoffs: [
      `<strong>Storage:</strong> PostgreSQL (or MySQL) for trips/users (ACID). Cassandra for time-series location history. Redis Geo for real-time location index.`,
      `<strong>Matching algorithm:</strong> Nearest driver vs best driver (rating, ETA, vehicle type). Trade simplicity for quality.`,
      `<strong>Privacy:</strong> Don't expose precise driver location to all riders — only to matched rider after pickup.`,
      `<strong>Geographic partitioning:</strong> Different cities are independent — partition data by city for scaling.`,
    ],
    tags: ["Geo-indexing","Redis Geo","WebSocket","State Machine","Cassandra"],
  },
];
