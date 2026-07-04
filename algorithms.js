// Named-algorithm explanations + worked example traces + a mapping from
// LeetCode problem `num` to the algorithms each solution uses. Loaded as a
// classic script before the inline renderer in index.html. The renderer
// surfaces an "Algorithm" section in the expanded detail panel for any
// problem with an entry below.
//
// Only algorithms with a NAME an interviewer would recognize are listed —
// generic techniques like "DFS" or "two pointers" are intentionally skipped.

const namedAlgorithms = {
  'kadane': {
    name: "Kadane's Algorithm",
    explanation: "A linear-time algorithm for finding the maximum-sum contiguous subarray. Walks the array once, maintaining the best sum ending at the current index — either extend the current run or restart at the current element — plus the global best seen so far. Discovered independently by Joseph Born Kadane in the 1980s.",
    example: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i  nums[i]  current  best   note
0   -2       -2       -2
1    1        1        1    restart (1 > -2+1)
2   -3       -2        1
3    4        4        4    restart (4 > -2+4)
4   -1        3        4
5    2        5        5
6    1        6        6
7   -5        1        6
8    4        5        6

answer = 6   (subarray [4, -1, 2, 1])`,
  },
  'dutch-national-flag': {
    name: 'Dutch National Flag Algorithm',
    explanation: 'A 3-way partitioning technique invented by Edsger Dijkstra. Uses three pointers (low, mid, high) to sort an array of three distinct values in a single in-place pass — without comparisons against each other. Named after the flag\'s three horizontal stripes (red, white, blue).',
    example: `nums = [2, 0, 2, 1, 1, 0]
            lo=0, mid=0, hi=5

mid=0, nums[mid]=2 → swap mid↔hi, hi--
  [0, 0, 2, 1, 1, 2]    lo=0 mid=0 hi=4
mid=0, nums[mid]=0 → swap lo↔mid, lo++ mid++
  unchanged              lo=1 mid=1 hi=4
mid=1, nums[mid]=0 → swap lo↔mid, lo++ mid++
  unchanged              lo=2 mid=2 hi=4
mid=2, nums[mid]=2 → swap mid↔hi, hi--
  [0, 0, 1, 1, 2, 2]    lo=2 mid=2 hi=3
mid=2, nums[mid]=1 → mid++
                       lo=2 mid=3 hi=3
mid=3, nums[mid]=1 → mid++ (mid > hi, exit)

result: [0, 0, 1, 1, 2, 2]`,
  },
  'cyclic-sort': {
    name: 'Cyclic Sort',
    explanation: 'An in-place O(n) sorting pattern for arrays whose values come from a known range (typically 1..n). For each index, swap the current value into its "home" slot (value <em>v</em> belongs at index <em>v-1</em>) until no more swaps apply. After one pass, any index where the value doesn\'t match reveals a missing/duplicate value.',
    example: `nums = [3, 4, -1, 1], n = 4

i=0: nums[0]=3, home is slot 2 (nums[2]=-1)
     swap → [-1, 4, 3, 1]
     nums[0]=-1, out of range; stop
i=1: nums[1]=4, home is slot 3 (nums[3]=1)
     swap → [-1, 1, 3, 4]
     nums[1]=1, home is slot 0 (nums[0]=-1)
     swap → [1, -1, 3, 4]
     nums[1]=-1, out of range; stop
i=2: nums[2]=3, slot 2 is correct; skip
i=3: nums[3]=4, slot 3 is correct; skip

scan: nums[0]=1 ✓, nums[1]=-1 ≠ 2
→ answer = 2`,
  },
  'floyd-cycle': {
    name: "Floyd's Tortoise and Hare",
    explanation: 'A cycle-detection algorithm using two pointers moving at different speeds — slow advances 1 step, fast advances 2. If a cycle exists they are guaranteed to meet inside it (the gap closes by 1 each step). A second phase (reset slow to the start, both move at speed 1) finds the cycle\'s entry point. Works on linked lists and any "functional graph" where <code>i → f(i)</code>.',
    example: `list:  1 → 2 → 3 → 4 → 5 → 6
                       ↑           ↓
                       └───────────┘   (cycle: 6 → 3)

Phase 1 — find a meeting point:
  step  slow  fast
   0     1     1
   1     2     3
   2     3     5
   3     4     3
   4     5     5   ← meet at node 5

Phase 2 — find the cycle entry:
  reset finder to head; both walk at speed 1
  step  finder  slow
   0     1       5
   1     2       6
   2     3       3   ← meet at node 3 = cycle entry`,
  },
  'kahn-toposort': {
    name: "Kahn's Algorithm (BFS Topological Sort)",
    explanation: 'Computes a topological ordering of a DAG in O(V + E). Start by enqueueing every node with in-degree 0. Repeatedly pop a node, output it, and decrement the in-degrees of its neighbors — any neighbor that hits 0 joins the queue. If you process every node, no cycle exists; otherwise the graph contains a cycle blocking some nodes from ever reaching in-degree 0.',
    example: `4 courses, prereqs = [[1,0], [2,1], [3,2]]
(course 1 needs 0, course 2 needs 1, course 3 needs 2)

in-degree: [0, 1, 1, 1]
queue:     [0]

pop 0 → taken=1.  dec in-deg of 1 → 0.  queue: [1]
pop 1 → taken=2.  dec in-deg of 2 → 0.  queue: [2]
pop 2 → taken=3.  dec in-deg of 3 → 0.  queue: [3]
pop 3 → taken=4.  queue empty.

taken(4) == numCourses(4) → no cycle, return true`,
  },
  'dijkstra': {
    name: "Dijkstra's Algorithm",
    explanation: 'Finds the shortest paths from a source to all nodes in a graph with <strong>non-negative</strong> edge weights. Uses a min-heap to repeatedly extract the closest unvisited node and "relax" its outgoing edges (update the neighbor\'s distance if going through this node is shorter). Each node is finalized the first time it\'s popped. O(E log V) with a binary heap.',
    example: `Graph (directed, weighted): 1→2 (1), 1→3 (4), 2→3 (1)
Source: k = 1

dist = [_, 0, ∞, ∞]
pq   = [(1, 0)]

pop (1, 0):
  edge 1→2 (1):  dist[2] = 0+1 = 1, push (2, 1)
  edge 1→3 (4):  dist[3] = 0+4 = 4, push (3, 4)
pop (2, 1):
  edge 2→3 (1):  1+1 = 2 < dist[3]=4, update; push (3, 2)
pop (3, 2):  already best
pop (3, 4):  stale (4 > dist[3]=2), skip

dist = [_, 0, 1, 2]   → max = 2 (signal reaches all)`,
  },
  'hierholzer': {
    name: "Hierholzer's Algorithm",
    explanation: 'Constructs an Eulerian path or circuit (a walk that uses every edge exactly once) in O(E). Uses a stack: push the start; while the top has unused outgoing edges, follow one (push the next node); when none remain, pop the top and prepend it to the route. The final route, built in reverse, is the Eulerian path.',
    example: `tickets = [[JFK,A], [A,B], [B,JFK]]
graph:   JFK→[A], A→[B], B→[JFK]

stack: [JFK]            route: []
  top=JFK has A → push A
stack: [JFK, A]
  top=A has B → push B
stack: [JFK, A, B]
  top=B has JFK → push JFK
stack: [JFK, A, B, JFK]
  top=JFK has nothing → pop, prepend
stack: [JFK, A, B]      route: [JFK]
  top=B has nothing → pop
stack: [JFK, A]         route: [B, JFK]
  top=A has nothing → pop
stack: [JFK]            route: [A, B, JFK]
  top=JFK has nothing → pop
stack: []               route: [JFK, A, B, JFK]`,
  },
  'merge-sort': {
    name: 'Merge Sort',
    explanation: 'Classic O(n log n) divide-and-conquer sort. Recursively split the input into halves until each piece is trivially sorted, then merge two sorted halves by repeatedly picking the smaller front element. <strong>Stable</strong>. O(n) extra space for arrays; only O(log n) recursion-stack space for linked lists (no auxiliary array needed).',
    example: `input: [38, 27, 43, 3, 9, 82, 10]

split:
  [38, 27, 43, 3]            [9, 82, 10]
  [38, 27] [43, 3]           [9, 82] [10]
  [38][27] [43][3]           [9][82] [10]

merge (returning up the recursion):
  [27, 38]  [3, 43]          [9, 82]  [10]
  [3, 27, 38, 43]            [9, 10, 82]
  [3, 9, 10, 27, 38, 43, 82]

sorted ✓`,
  },
  'fast-exponentiation': {
    name: 'Fast Exponentiation by Squaring',
    explanation: 'Computes <code>x^n</code> in O(log n) by walking the binary representation of <em>n</em>. Each iteration squares <em>x</em>; if the current low bit is 1, multiply <em>x</em> into the result. Generalizes to matrix exponentiation (Fibonacci in O(log n)) and modular exponentiation (RSA, primality tests).',
    example: `compute 3 ^ 13:
  13 in binary = 1101

iter  low bit  result      x         N
 0       —      1           3         13
 1       1      3           9         6     (result *= x)
 2       0      3           81        3     (low bit 0 → x squared only)
 3       1      243         6561      1
 4       1      1,594,323   …         0

answer = 1,594,323   (3 ^ 13 ✓)`,
  },
  'patience-sort': {
    name: 'Patience Sort (for LIS)',
    explanation: 'A card-game-inspired algorithm for finding the longest increasing subsequence in O(n log n). Maintain "piles" of cards where only the top matters: for each new card, place it on the leftmost pile whose top is ≥ it (binary search), or start a new rightmost pile. The number of piles at the end equals the LIS length. Doesn\'t reconstruct the LIS itself without extra bookkeeping — just its length.',
    example: `nums = [10, 9, 2, 5, 3, 7, 101, 18]

n=10 → new pile         tails = [10]
n=9  → 9 ≤ 10, replace  tails = [9]
n=2  → 2 ≤ 9, replace   tails = [2]
n=5  → 5 > 2, new pile  tails = [2, 5]
n=3  → 3 ≤ 5, replace   tails = [2, 3]
n=7  → 7 > 3, new pile  tails = [2, 3, 7]
n=101 → new pile        tails = [2, 3, 7, 101]
n=18  → 18 ≤ 101, replace tails = [2, 3, 7, 18]

|tails| = 4  → LIS length = 4
(an LIS: 2, 3, 7, 18  or  2, 3, 7, 101)`,
  },
  '0-1-knapsack': {
    name: '0/1 Knapsack DP',
    explanation: 'A DP pattern where each item is either fully included or excluded — no fractions, no reuse. Fill a table <code>dp[i][w]</code> = best value using the first <em>i</em> items with total weight ≤ <em>w</em>. Compressing to a 1D array works if you iterate weights in <strong>reverse</strong> — this ensures each item contributes to <code>dp[w]</code> at most once per pass.',
    example: `Partition Equal Subset Sum
nums = [1, 5, 11, 5], target = 11

dp[0..11] (T = can form this sum):
init:        [T, F, F, F, F, F, F, F, F, F, F, F]

after 1:     [T, T, F, F, F, F, F, F, F, F, F, F]
after 5:     [T, T, F, F, F, T, T, F, F, F, F, F]
after 11:    [T, T, F, F, F, T, T, F, F, F, F, T]
after 5:     [T, T, F, F, F, T, T, F, F, F, T, T]

dp[11] = T  →  can partition (1+5+5 = 11)`,
  },
  'unbounded-knapsack': {
    name: 'Unbounded Knapsack DP',
    explanation: 'Variant of knapsack where items can be reused unlimited times. The recurrence <code>dp[w] = min/max</code> over each item of <code>(1 + dp[w - cost])</code>. Iterate the inner loop over weights in <strong>forward</strong> order — that lets the same item contribute multiple times within one outer pass.',
    example: `Coin Change
coins = [1, 2, 5], amount = 11

dp[0] = 0;  dp[1..11] = ∞ initially

i=1:  try 1 → dp[1] = 1 + dp[0] = 1
i=2:  try 2 → dp[2] = 1
i=3:  try 1,2 → dp[3] = 1 + dp[2] = 2
i=4:  try 2   → dp[4] = 1 + dp[2] = 2
i=5:  try 5   → dp[5] = 1 + dp[0] = 1
i=6:  try 5   → dp[6] = 1 + dp[1] = 2
i=7:  try 5   → dp[7] = 1 + dp[2] = 2
i=8:  try 5   → dp[8] = 1 + dp[3] = 3
i=9:  try 5   → dp[9] = 1 + dp[4] = 3
i=10: try 5   → dp[10] = 1 + dp[5] = 2
i=11: try 5   → dp[11] = 1 + dp[6] = 3

answer = 3   (5 + 5 + 1)`,
  },
  'levenshtein': {
    name: 'Levenshtein Distance',
    explanation: 'The classic O(m × n) DP for the minimum number of single-character edits (insert, delete, replace) to convert one string into another. <code>dp[i][j]</code> = edit distance for the first <em>i</em> chars of word1 to the first <em>j</em> chars of word2. Matching chars inherit the diagonal value; mismatches add 1 to the min of the three predecessor cells (replace, delete, insert).',
    example: `word1 = "horse", word2 = "ros"

       ""  r  o  s
   ""   0  1  2  3
    h   1  1  2  3
    o   2  2  1  2
    r   3  2  2  2
    s   4  3  3  2
    e   5  4  4  3

dp[5][3] = 3
edits:  horse → rorse  (replace h → r)
        rorse → rose   (delete r)
        rose  → ros    (delete e)`,
  },
  'quickselect': {
    name: 'Quickselect',
    explanation: 'Variant of quicksort that finds the <em>k</em>-th smallest element in O(n) <strong>average</strong> time without fully sorting. Pick a pivot, partition into &lt;, =, &gt;, then recurse only into the partition that contains the <em>k</em>-th position. Worst case is O(n²) but extremely fast in practice; randomizing the pivot makes the worst case unlikely.',
    example: `nums = [3, 2, 1, 5, 6, 4],  k = 2 (find 2nd largest)

round 1: pivot = 4
  ≥ pivot: [5, 6, 4]   ← 2nd largest lives here
  < pivot: [3, 2, 1]
  recurse into the ≥ side

round 2: working on [5, 6, 4], pivot = 5
  ≥ pivot: [5, 6]      ← 1st & 2nd largest are here
  < pivot: [4]
  recurse into the ≥ side

round 3: working on [5, 6], pivot = 6
  ≥ pivot: [6]         ← 1st largest
  < pivot: [5]         ← 2nd largest ✓

answer = 5

Each round halves (on average) the search range
→ total work O(n + n/2 + n/4 + …) = O(n) average`,
  },
  'bucket-sort': {
    name: 'Bucket Sort',
    explanation: 'A non-comparison sort that distributes elements into buckets keyed by some property (frequency, value range, etc.). Each bucket is then either sorted individually or read out directly. When the key range is bounded by <em>n</em>, total cost is O(n) — beating any comparison-based sort, which has an O(n log n) lower bound.',
    example: `Top K Frequent Elements
nums = [1, 1, 1, 2, 2, 3],  k = 2

step 1 — count frequencies:
  {1: 3, 2: 2, 3: 1}

step 2 — bucket by frequency (index = freq):
  buckets[0] = []
  buckets[1] = [3]
  buckets[2] = [2]
  buckets[3] = [1]

step 3 — walk high→low, take first k:
  buckets[6..4] = empty, skip
  buckets[3] = [1]  → take 1
  buckets[2] = [2]  → take 2  (k=2 reached, stop)

output = [1, 2]`,
  },
  'binary-search-partition': {
    name: 'Binary Search on Partition',
    explanation: 'A binary-search variant used when the answer is not an array element but a <strong>position</strong> that satisfies some predicate. For "Median of Two Sorted Arrays" the predicate is: at partition (i, j), every element in the left halves is ≤ every element in the right halves. Binary-search on <em>i</em> in the shorter array; derive <em>j</em> from the median condition.',
    example: `a = [1, 3],  b = [2]
m=2, n=1, total=3, half=(3+1)/2 = 2

Try i=1 (mid of [0..2]):
  j = half - i = 2 - 1 = 1
  aLeft  = a[0] = 1     aRight = a[1] = 3
  bLeft  = b[0] = 2     bRight = ∞

  valid?  aLeft(1) ≤ bRight(∞) ✓
           bLeft(2) ≤ aRight(3) ✓
  → correct partition!

total = 3 is odd → median = max(aLeft, bLeft)
                          = max(1, 2)
                          = 2

answer = 2.0`,
  },
  'boyer-moore-vote': {
    name: "Boyer-Moore Voting Algorithm",
    explanation: 'A linear-time, constant-space algorithm for finding the majority element (appears more than n/2 times). Keeps a single candidate and a counter: matching elements increment the count, differing elements decrement it, and when the count hits zero the next element becomes the new candidate. It works by a pairing-off argument — every non-majority element can cancel at most one majority element, so the true majority always survives. Devised by Robert S. Boyer and J Strother Moore in 1981.',
    example: `nums = [2, 2, 1, 1, 1, 2, 2]

i  nums[i]  candidate  count   note
0    2          2        1     count was 0 → adopt 2
1    2          2        2     match → count++
2    1          2        1     differs → count--
3    1          2        0     differs → count--
4    1          1        1     count was 0 → adopt 1
5    2          1        0     differs → count--
6    2          2        1     count was 0 → adopt 2

answer = 2   (appears 4 times out of 7)`,
  },
  'union-find': {
    name: "Union-Find (Disjoint Set Union)",
    explanation: 'A data structure that tracks which elements belong to the same group, supporting two operations: <em>find</em> (which set is this element in?) and <em>union</em> (merge two sets). With path compression (point every visited node straight at the root during find) and union by rank (attach the shorter tree under the taller), both operations run in near-constant amortized time — O(α(n)), the inverse Ackermann function, which is ≤ 4 for any realistic input. It is the standard tool for connectivity queries, cycle detection in undirected graphs, and Kruskal\'s MST.',
    example: `5 nodes (0..4), all ranks 0
edges: (0,1), (1,2), (3,4), (2,3), (0,4)

start:        parent = [0, 1, 2, 3, 4]

union(0,1): roots 0,1 differ, equal rank
            → parent[1]=0, rank[0]=1
              parent = [0, 0, 2, 3, 4]
union(1,2): find(1)=0, find(2)=2, rank 1 > 0
            → parent[2]=0
              parent = [0, 0, 0, 3, 4]
union(3,4): roots 3,4 differ, equal rank
            → parent[4]=3, rank[3]=1
              parent = [0, 0, 0, 3, 3]
union(2,3): find(2)=0, find(3)=3, equal rank
            → parent[3]=0, rank[0]=2
              parent = [0, 0, 0, 0, 3]
union(0,4): find(0)=0, find(4): 4→3→0
            path compression → parent[4]=0
            same root → CYCLE detected
              parent = [0, 0, 0, 0, 0]`,
  },
  'prim': {
    name: "Prim's Algorithm",
    explanation: 'A greedy algorithm for building a minimum spanning tree: start from any seed vertex and repeatedly add the cheapest edge that leaves the current tree, until all vertices are absorbed. A min-heap of candidate edges makes each step O(log V), for O(E log V) overall; edges popped to a vertex already in the tree are simply discarded. First discovered by Vojtěch Jarník in 1930, then independently by Robert C. Prim in 1957 (and again by Dijkstra in 1959).',
    example: `nodes A, B, C, D
edges: A-B 1, A-C 4, B-C 2, B-D 6, C-D 3

start at A, tree = {A}, cost = 0
push edges from A → heap: [(1,A-B), (4,A-C)]

pop (1, A-B): B is new → tree = {A,B}, cost = 1
  push B's edges → heap: [(2,B-C), (4,A-C), (6,B-D)]
pop (2, B-C): C is new → tree = {A,B,C}, cost = 3
  push C's edges → heap: [(3,C-D), (4,A-C), (6,B-D)]
pop (3, C-D): D is new → tree = {A,B,C,D}, cost = 6
pop (4, A-C): C already in tree → skip
pop (6, B-D): D already in tree → skip

MST edges: A-B, B-C, C-D   total cost = 6`,
  },
  'bellman-ford': {
    name: "Bellman-Ford Algorithm",
    explanation: 'A single-source shortest-path algorithm that, unlike Dijkstra, tolerates negative edge weights: it simply relaxes <em>every</em> edge V-1 times, because a shortest path can use at most V-1 edges. If a V-th round still improves some distance, the graph contains a negative cycle. Runs in O(V·E); named after Richard Bellman and Lester Ford Jr., who published it in the late 1950s. The "at most K stops" variant (LC 787) is the same loop capped at K+1 rounds, relaxing against a frozen snapshot of the previous round\'s distances.',
    example: `4 nodes, source = 0
edges (relaxed in this order each round):
  1→3 w=3,  2→1 w=-2,  0→1 w=4,  0→2 w=5

init:     dist = [0, INF, INF, INF]

round 1:
  1→3: dist[1]=INF, skip
  2→1: dist[2]=INF, skip
  0→1: 0+4  → dist[1]=4
  0→2: 0+5  → dist[2]=5
          dist = [0, 4, 5, INF]
round 2:
  1→3: 4+3=7    → dist[3]=7
  2→1: 5-2=3<4  → dist[1]=3
          dist = [0, 3, 5, 7]
round 3:
  1→3: 3+3=6<7  → dist[3]=6
          dist = [0, 3, 5, 6]

extra round: no edge improves anything
→ converged, no negative cycle`,
  },
};

// Which named algorithm(s) each solution uses, keyed by leetcode.js `num`.
// Only entries that use a NAMED algorithm are listed here.
const problemAlgorithms = {
  6:   ['bucket-sort'],
  11:  ['kadane'],
  14:  ['dutch-national-flag'],
  15:  ['cyclic-sort'],
  42:  ['binary-search-partition'],
  43:  ['fast-exponentiation'],
  46:  ['floyd-cycle'],
  52:  ['floyd-cycle'],
  54:  ['merge-sort'],
  74:  ['quickselect'],
  76:  ['kahn-toposort'],
  92:  ['dijkstra'],
  93:  ['hierholzer'],
  98:  ['unbounded-knapsack'],
  99:  ['patience-sort'],
  107: ['levenshtein'],
  108: ['0-1-knapsack'],
  120: ['boyer-moore-vote'],
  122: ['floyd-cycle'],
  149: ['binary-search-partition'],
  172: ['kahn-toposort'],
  173: ['union-find'],
  174: ['prim'],
  175: ['bellman-ford'],
  176: ['kahn-toposort'],
  177: ['dijkstra'],
  183: ['unbounded-knapsack'],
  184: ['0-1-knapsack'],
};
