// Named-algorithm explanations + a mapping from LeetCode problem `num` to
// the algorithms each solution uses. Loaded as a classic script before the
// inline renderer in index.html. The renderer surfaces an "Algorithm" section
// in the expanded detail panel for any problem with an entry below.
//
// Only algorithms with a NAME an interviewer would recognize are listed —
// generic techniques like "DFS" or "two pointers" are intentionally skipped.

const namedAlgorithms = {
  'kadane': {
    name: "Kadane's Algorithm",
    explanation: "A linear-time algorithm for finding the maximum-sum contiguous subarray. Walks the array once, maintaining the best sum ending at the current index — either extend the current run or restart at the current element — plus the global best seen so far. Discovered independently by Joseph Born Kadane in the 1980s.",
  },
  'dutch-national-flag': {
    name: 'Dutch National Flag Algorithm',
    explanation: 'A 3-way partitioning technique invented by Edsger Dijkstra. Uses three pointers (low, mid, high) to sort an array of three distinct values in a single in-place pass — without comparisons against each other. Named after the flag\'s three horizontal stripes (red, white, blue).',
  },
  'cyclic-sort': {
    name: 'Cyclic Sort',
    explanation: 'An in-place O(n) sorting pattern for arrays whose values come from a known range (typically 1..n). For each index, swap the current value into its "home" slot (value <em>v</em> belongs at index <em>v-1</em>) until no more swaps apply. After one pass, any index where the value doesn\'t match reveals a missing/duplicate value.',
  },
  'floyd-cycle': {
    name: "Floyd's Tortoise and Hare",
    explanation: 'A cycle-detection algorithm using two pointers moving at different speeds — slow advances 1 step, fast advances 2. If a cycle exists they are guaranteed to meet inside it (the gap closes by 1 each step). A second phase (reset slow to the start, both move at speed 1) finds the cycle\'s entry point. Works on linked lists and any "functional graph" where <code>i → f(i)</code>.',
  },
  'kahn-toposort': {
    name: "Kahn's Algorithm (BFS Topological Sort)",
    explanation: 'Computes a topological ordering of a DAG in O(V + E). Start by enqueueing every node with in-degree 0. Repeatedly pop a node, output it, and decrement the in-degrees of its neighbors — any neighbor that hits 0 joins the queue. If you process every node, no cycle exists; otherwise the graph contains a cycle blocking some nodes from ever reaching in-degree 0.',
  },
  'dijkstra': {
    name: "Dijkstra's Algorithm",
    explanation: 'Finds the shortest paths from a source to all nodes in a graph with <strong>non-negative</strong> edge weights. Uses a min-heap to repeatedly extract the closest unvisited node and "relax" its outgoing edges (update the neighbor\'s distance if going through this node is shorter). Each node is finalized the first time it\'s popped. O(E log V) with a binary heap.',
  },
  'hierholzer': {
    name: "Hierholzer's Algorithm",
    explanation: 'Constructs an Eulerian path or circuit (a walk that uses every edge exactly once) in O(E). Uses a stack: push the start; while the top has unused outgoing edges, follow one (push the next node); when none remain, pop the top and prepend it to the route. The final route, built in reverse, is the Eulerian path.',
  },
  'merge-sort': {
    name: 'Merge Sort',
    explanation: 'Classic O(n log n) divide-and-conquer sort. Recursively split the input into halves until each piece is trivially sorted, then merge two sorted halves by repeatedly picking the smaller front element. <strong>Stable</strong>. O(n) extra space for arrays; only O(log n) recursion-stack space for linked lists (no auxiliary array needed).',
  },
  'fast-exponentiation': {
    name: 'Fast Exponentiation by Squaring',
    explanation: 'Computes <code>x^n</code> in O(log n) by walking the binary representation of <em>n</em>. Each iteration squares <em>x</em>; if the current low bit is 1, multiply <em>x</em> into the result. Generalizes to matrix exponentiation (Fibonacci in O(log n)) and modular exponentiation (RSA, primality tests).',
  },
  'patience-sort': {
    name: 'Patience Sort (for LIS)',
    explanation: 'A card-game-inspired algorithm for finding the longest increasing subsequence in O(n log n). Maintain "piles" of cards where only the top matters: for each new card, place it on the leftmost pile whose top is ≥ it (binary search), or start a new rightmost pile. The number of piles at the end equals the LIS length. Doesn\'t reconstruct the LIS itself without extra bookkeeping — just its length.',
  },
  '0-1-knapsack': {
    name: '0/1 Knapsack DP',
    explanation: 'A DP pattern where each item is either fully included or excluded — no fractions, no reuse. Fill a table <code>dp[i][w]</code> = best value using the first <em>i</em> items with total weight ≤ <em>w</em>. Compressing to a 1D array works if you iterate weights in <strong>reverse</strong> — this ensures each item contributes to <code>dp[w]</code> at most once per pass.',
  },
  'unbounded-knapsack': {
    name: 'Unbounded Knapsack DP',
    explanation: 'Variant of knapsack where items can be reused unlimited times. The recurrence <code>dp[w] = min/max</code> over each item of <code>(1 + dp[w - cost])</code>. Iterate the inner loop over weights in <strong>forward</strong> order — that lets the same item contribute multiple times within one outer pass.',
  },
  'levenshtein': {
    name: 'Levenshtein Distance',
    explanation: 'The classic O(m × n) DP for the minimum number of single-character edits (insert, delete, replace) to convert one string into another. <code>dp[i][j]</code> = edit distance for the first <em>i</em> chars of word1 to the first <em>j</em> chars of word2. Matching chars inherit the diagonal value; mismatches add 1 to the min of the three predecessor cells (replace, delete, insert).',
  },
  'quickselect': {
    name: 'Quickselect',
    explanation: 'Variant of quicksort that finds the <em>k</em>-th smallest element in O(n) <strong>average</strong> time without fully sorting. Pick a pivot, partition into &lt;, =, &gt;, then recurse only into the partition that contains the <em>k</em>-th position. Worst case is O(n²) but extremely fast in practice; randomizing the pivot makes the worst case unlikely.',
  },
  'bucket-sort': {
    name: 'Bucket Sort',
    explanation: 'A non-comparison sort that distributes elements into buckets keyed by some property (frequency, value range, etc.). Each bucket is then either sorted individually or read out directly. When the key range is bounded by <em>n</em>, total cost is O(n) — beating any comparison-based sort, which has an O(n log n) lower bound.',
  },
  'binary-search-partition': {
    name: 'Binary Search on Partition',
    explanation: 'A binary-search variant used when the answer is not an array element but a <strong>position</strong> that satisfies some predicate. For "Median of Two Sorted Arrays" the predicate is: at partition (i, j), every element in the left halves is ≤ every element in the right halves. Binary-search on <em>i</em> in the shorter array; derive <em>j</em> from the median condition.',
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
};
