// Top 200 popular LeetCode interview questions with idiomatic Java solutions.
// Loaded as a classic <script src="leetcode.js"></script> — 'leetcode' becomes
// available to the inline renderer in index.html.
//
// Each entry has a 'bucket' field for the high-level grouping (used to render
// section headers in the table) and a 'category' field for the per-row tag.
// Entries are pre-sorted by bucket in display order; 'num' is a stable internal
// key (1..200, NOT in array order) that keys user-overrides.js,
// descriptions.js and algorithms.js. Problems Garmin is known to ask carry
// companies: ['Garmin']. Temu tags also include matching questions reported
// for Pinduoduo, Temu's sister platform under PDD Holdings. Additional company
// tags are applied from the dated public reported-question snapshot below.
//
// Shared node definitions assumed by the tree/linked-list/graph solutions:
//   class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }
//   class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }
//   class Node     { int val; Node next; Node random; List<Node> neighbors; ... }

const leetcode = [
  // ─── Arrays & Hashing (37) ───
  {
    num: 111, lc: 14, title: 'Longest Common Prefix', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Scan',
    url: 'https://leetcode.com/problems/longest-common-prefix/',
    approach: 'Horizontal scanning: seed the candidate prefix with the entire first string, then fold each remaining string into it. For string i, chop the candidate from the right until strs[i].startsWith(prefix) holds — that loop discards exactly the diverging characters. Since the answer must be a prefix of strs[0] it can only shrink, so seeding there is safe, and exiting early once it empties prunes work. Each character is inspected at most once, giving O(S) time (S = total characters) and O(1) space. Vertical column-by-column scanning or divide-and-conquer pairwise merging are equivalent alternatives.',
    complexity: 'O(S) time (S = total chars) · O(1) space',
    code: `// Worked trace for strs = ["flower", "flow", "flight"]:
//
//   i  strs[i]   prefix before   startsWith?  action / prefix after
//   ──────────────────────────────────────────────────────────────────
//   -  "flower"  "flower"        (seed)       prefix = "flower"
//   1  "flow"    "flower"        no           trim → "flowe","flow" ok
//   2  "flight"  "flow"          no           trim → "flo","fl" ok
//
// Returns "fl"

public String longestCommonPrefix(String[] strs) {
  // Guard the degenerate inputs so strs[0] below is always safe to read
  if (strs == null || strs.length == 0) return "";
  // Assume the whole first string is the prefix, then chip it down as others disagree.
  // The answer must be a prefix of strs[0], so starting here can only over-estimate.
  String prefix = strs[0];
  for (int i = 1; i < strs.length; i++) {
    // Shorten from the right until strs[i] starts with it; empty means no common prefix.
    // Each drop removes one diverging char, so the loop runs only as far as needed.
    while (!strs[i].startsWith(prefix)) {
      // Drop the last character of the current candidate
      prefix = prefix.substring(0, prefix.length() - 1);
      // Nothing left in common — no point scanning the rest, bail out now
      if (prefix.isEmpty()) return "";
    }
  }
  // Survived every string — this is the longest shared prefix
  return prefix;
}`
  },
  {
    num: 115, lc: 412, title: 'FizzBuzz', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Math · Simulation',
    url: 'https://leetcode.com/problems/fizz-buzz/',
    approach: 'Straight simulation with a divisibility ladder. Loop i from 1 to n and append one string per number. The crucial ordering insight: test i % 15 == 0 FIRST, because any multiple of 15 is simultaneously a multiple of 3 and of 5 — checking %3 or %5 first would let an earlier branch steal the combined FizzBuzz case so it never fires. After 15 the %3 and %5 tests are mutually exclusive, so order stops mattering; 15 is the LCM of 3 and 5, keeping the common path to one modulo. Runs in O(n) time and O(n) space. A divisor-free variant uses two flags instead.',
    complexity: 'O(n) time · O(n) space (output)',
    code: `// Worked trace for n = 5:
//
//   i   i%15  i%3  i%5   chosen branch     appended
//   ───────────────────────────────────────────────────
//   1    1     1    1    else              "1"
//   2    2     2    2    else              "2"
//   3    3     0    3    i % 3 == 0        "Fizz"
//   4    4     1    4    else              "4"
//   5    5     2    0    i % 5 == 0        "Buzz"
//
// Returns ["1", "2", "Fizz", "4", "Buzz"]

public List<String> fizzBuzz(int n) {
  // One output string per number 1..n
  List<String> result = new ArrayList<>();
  for (int i = 1; i <= n; i++) {
    // Order matters: test 15 first, or a multiple of both 3 and 5 gets grabbed early.
    // 15 is the LCM of 3 and 5, so this single check covers the combined case.
    if (i % 15 == 0)      result.add("FizzBuzz");
    // Divisible by 3 only (15 already ruled out above)
    else if (i % 3 == 0)  result.add("Fizz");
    // Divisible by 5 only
    else if (i % 5 == 0)  result.add("Buzz");
    // Divisible by neither — emit the number itself as text
    else                  result.add(String.valueOf(i));
  }
  return result;
}`
  },
  {
    num: 1, lc: 1, title: 'Two Sum', d: 'easy', companies: ['Temu', 'Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · Hash Map',
    url: 'https://leetcode.com/problems/two-sum/',
    approach: 'Complement hashing in a single pass. As you scan each element nums[i], the partner you need is complement = target - nums[i]; if that complement is already in a value→index hash map you have the pair and return both indices. Otherwise record this value and index so a LATER element can discover it as its own complement. Checking before inserting keeps the two indices distinct, so nothing pairs with itself; storing the index (not mere presence) lets it return positions. Each lookup and insert is amortized O(1), turning the O(n²) double loop into O(n) time, O(n) space.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for nums = [2, 7, 11, 15], target = 9:
//
//   i  nums[i]  complement  seen (before)        hit?  action
//   ──────────────────────────────────────────────────────────────────
//   0    2         7        {}                   no    put 2 -> 0
//   1    7         2        {2:0}                yes   return {0, 1}
//
// Returns [0, 1]

public int[] twoSum(int[] nums, int target) {
  // Map: value seen so far → its index. Lets us look up a needed partner in O(1).
  Map<Integer, Integer> seen = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    // The exact value that, added to nums[i], would reach the target
    int complement = target - nums[i];
    // If the complement was seen earlier, we have our pair — return both indices.
    // Checking BEFORE inserting guarantees the two indices are different.
    if (seen.containsKey(complement)) {
      return new int[]{ seen.get(complement), i };
    }
    // Otherwise remember this number so a future element can find it as its complement
    seen.put(nums[i], i);
  }
  return new int[0];   // problem guarantees a solution; defensive default
}`
  },
  {
    num: 2, lc: 121, title: 'Best Time to Buy and Sell Stock', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · Greedy',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    approach: 'Single-pass greedy tracking of the running minimum (a 1-D cousin of Kadane\'s idea). Sweep left to right keeping minPrice = cheapest buy day so far and best = largest profit so far. For each price p, a new low becomes the best future buy point; otherwise selling today yields p - minPrice, compared against best. The insight is that any optimal sell day only needs the minimum price occurring BEFORE it, so you never look back past the running minimum — one variable replaces a nested scan. This turns the naive O(n²) all-pairs check to O(n) time and O(1) space, returning 0 for non-increasing prices.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for prices = [7, 1, 5, 3, 6, 4]:
//
//   p   p < minPrice?   minPrice   p - minPrice   best
//   ──────────────────────────────────────────────────────
//   7   yes              7          -              0
//   1   yes              1          -              0
//   5   no               1          4              4
//   3   no               1          2              4
//   6   no               1          5              5
//   4   no               1          3              5
//
// Returns 5

public int maxProfit(int[] prices) {
  // minPrice = cheapest buy day so far; best = max profit so far.
  // Start minPrice at +infinity so the first price always becomes the low.
  int minPrice = Integer.MAX_VALUE, best = 0;
  for (int p : prices) {
    // Lower price → potential better buy day; never look further back than this
    if (p < minPrice) minPrice = p;
    // Otherwise, today as a sell day may beat the best profit so far.
    // Only valid because minPrice came from an EARLIER day than p.
    else best = Math.max(best, p - minPrice);
  }
  // No profitable pair leaves best at its initial 0
  return best;
}`
  },
  {
    num: 3, lc: 217, title: 'Contains Duplicate', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · Hash Set',
    url: 'https://leetcode.com/problems/contains-duplicate/',
    approach: 'Hash-set membership in one pass. Stream through the array inserting each value into a HashSet; Set.add returns false exactly when the element was already present, so the first false signals a duplicate and you return true immediately, no need to finish the scan. The set gives amortized O(1) insert and lookup, yielding O(n) time and O(n) space. This beats the O(n²) brute-force pairwise comparison and is simpler than the O(n log n) sort-then-check-neighbors variant. The key detail is the early exit on the first collision, which skips the rest of the input.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for nums = [1, 2, 3, 1]:
//
//   n   seen before add   add() returns   seen after     result
//   ──────────────────────────────────────────────────────────────
//   1   {}                 true            {1}            continue
//   2   {1}                true            {1,2}          continue
//   3   {1,2}              true            {1,2,3}        continue
//   1   {1,2,3}            false           {1,2,3}        return true
//
// Returns true

public boolean containsDuplicate(int[] nums) {
  // Tracks every distinct value encountered so far
  Set<Integer> seen = new HashSet<>();
  for (int n : nums) {
    // Set.add() returns false when the value was already present — that's our duplicate.
    // Returning here short-circuits the rest of the scan.
    if (!seen.add(n)) return true;
  }
  // Reached the end with no collision — all elements were distinct
  return false;
}`
  },
  {
    num: 4, lc: 242, title: 'Valid Anagram', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Hash Map',
    url: 'https://leetcode.com/problems/valid-anagram/',
    approach: 'Fixed-alphabet frequency counting with one signed counter array. First reject the case where lengths differ — anagrams must be equal length, a cheap early-out. Then walk both strings in lockstep over one int[26], incrementing for each char of s and decrementing for each char of t. They are anagrams precisely when every bucket nets back to zero, since each letter from s must be cancelled by an identical letter in t. Indexing via (c - \'a\') makes lookups O(1), giving O(n) time and O(1) space (array size is a constant 26), beating O(n log n) sort-and-compare; use a HashMap for Unicode inputs.',
    complexity: 'O(n) time · O(1) space (fixed alphabet)',
    code: `// Worked trace for s = "anagram", t = "nagaram" (showing nonzero buckets):
//
//   step              count[a] count[n] count[g] count[r] count[m]
//   ────────────────────────────────────────────────────────────────
//   after s 'a'..'m'    +3       +1       +1       +1       +1
//   after t 'n'..'m'     0        0        0        0        0
//
//   final scan: every bucket is 0  →  strings are anagrams
//
// Returns true

public boolean isAnagram(String s, String t) {
  // Different lengths can't be anagrams — cheap early-out
  if (s.length() != t.length()) return false;
  // Single counter array: +1 for s, -1 for t; anagram iff all counts return to 0.
  // Index = letter offset from 'a', so 26 slots cover the whole lowercase alphabet.
  int[] count = new int[26];
  for (int i = 0; i < s.length(); i++) {
    // s contributes a letter (+1), t removes the same-position letter (-1)
    count[s.charAt(i) - 'a']++;
    count[t.charAt(i) - 'a']--;
  }
  // Any leftover nonzero bucket means a letter mismatch in count
  for (int c : count) if (c != 0) return false;
  // All balanced — t is a rearrangement of s
  return true;
}`
  },
  {
    num: 5, lc: 49, title: 'Group Anagrams', d: 'medium', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Hash Map',
    url: 'https://leetcode.com/problems/group-anagrams/',
    approach: 'Canonical-key hashing. Anagrams of a word collapse to one normalized form, so derive a key that is identical for every permutation and bucket the originals under it in a HashMap. Here the key is the word with characters sorted, making eat, tea, and ate all become aet. computeIfAbsent lazily creates the list on first sight of a key, then appends the original unsorted string; the map\'s values are the groups. Sorting each length-k word costs O(k log k), so total is O(n · k log k) time and O(n · k) space. A faster variant uses a 26-char frequency signature key, cutting total time to O(n · k).',
    complexity: 'O(n · k log k) time · O(n · k) space',
    code: `// Worked trace for strs = ["eat", "tea", "tan", "ate", "nat", "bat"]:
//
//   s      sorted key   groups after this step
//   ────────────────────────────────────────────────────────────────
//   eat    "aet"        {aet:[eat]}
//   tea    "aet"        {aet:[eat,tea]}
//   tan    "ant"        {aet:[eat,tea], ant:[tan]}
//   ate    "aet"        {aet:[eat,tea,ate], ant:[tan]}
//   nat    "ant"        {aet:[eat,tea,ate], ant:[tan,nat]}
//   bat    "abt"        {aet:[eat,tea,ate], ant:[tan,nat], abt:[bat]}
//
// Returns [[eat,tea,ate], [tan,nat], [bat]]  (group order may vary)

public List<List<String>> groupAnagrams(String[] strs) {
  // Map: canonical key (sorted chars) → list of strings sharing that key
  Map<String, List<String>> groups = new HashMap<>();
  for (String s : strs) {
    // Sorting normalizes — every anagram of a word produces the same sorted form,
    // so all members of a group hash to one bucket.
    char[] chars = s.toCharArray();
    Arrays.sort(chars);
    String key = new String(chars);
    // computeIfAbsent lazily creates the bucket if first time seeing this key,
    // then we add the ORIGINAL (unsorted) string to it.
    // LAMBDA (mapping Function): k -> new ArrayList<>() is the factory
    // computeIfAbsent invokes ONLY when 'key' is absent; its return value becomes
    // the new bucket. Without the lambda:
    //   if (!groups.containsKey(key)) groups.put(key, new ArrayList<>());
    //   groups.get(key).add(s);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
  }
  // The buckets themselves are the answer; keys are no longer needed
  return new ArrayList<>(groups.values());
}`
  },
  {
    num: 6, lc: 347, title: 'Top K Frequent Elements', d: 'medium', companies: ['Temu'],
    bucket: 'Arrays & Hashing', category: 'Array · Bucket Sort',
    url: 'https://leetcode.com/problems/top-k-frequent-elements/',
    approach: 'Bucket sort by frequency for linear time. First tally counts in a HashMap. The key insight is that any element\'s frequency lies between 1 and nums.length, so make an array of buckets indexed by frequency and drop each distinct value into buckets[its count]. Then walk the buckets from the highest index down, collecting values until you have k — they emerge in descending frequency order for free, no comparisons needed. This is O(n) time and O(n) space, beating the classic O(n log k) min-heap and the trivial O(n log n) sort-by-count. The bounded frequency range (≤ n) enables the bucket pass.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for nums = [1, 1, 1, 2, 2, 3], k = 2:
//
//   Step 1 freq:    {1:3, 2:2, 3:1}
//   Step 2 buckets: index = frequency (length n+1 = 7)
//        buckets[1] = [3]
//        buckets[2] = [2]
//        buckets[3] = [1]
//   Step 3 scan high→low: i=6..4 empty; i=3 take 1 (idx 1); i=2 take 2 (idx 2 == k) stop
//
// Returns [1, 2]

public int[] topKFrequent(int[] nums, int k) {
  // Step 1: count frequencies — how many times each value appears
  Map<Integer, Integer> freq = new HashMap<>();
  // METHOD REFERENCE (lambda shorthand): Integer::sum means (a, b) -> a + b — the
  // remap function merge() applies when the key already exists (else it stores 1).
  // Without it:
  //   freq.put(n, freq.getOrDefault(n, 0) + 1);
  for (int n : nums) freq.merge(n, 1, Integer::sum);

  // Step 2: bucket-sort by frequency. buckets[f] holds all numbers occurring f times.
  // Max possible frequency is nums.length, so the array is bounded — this is what lets
  // us avoid any sorting or heap and stay linear.
  List<Integer>[] buckets = new List[nums.length + 1];
  for (var e : freq.entrySet()) {
    int f = e.getValue();
    // Lazily allocate the bucket the first time a frequency is used
    if (buckets[f] == null) buckets[f] = new ArrayList<>();
    buckets[f].add(e.getKey());
  }

  // Step 3: walk buckets from highest frequency downward, picking the first k.
  // Descending index order means most-frequent values come out first.
  int[] out = new int[k];
  int idx = 0;
  for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
    // Most frequencies have no elements — skip the empty slots
    if (buckets[i] == null) continue;
    for (int n : buckets[i]) {
      out[idx++] = n;
      // Collected k elements — done
      if (idx == k) break;
    }
  }
  return out;
}`
  },
  {
    num: 7, lc: 238, title: 'Product of Array Except Self', d: 'medium', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · Prefix Product',
    url: 'https://leetcode.com/problems/product-of-array-except-self/',
    approach: 'Prefix-and-suffix products, no division. Insight: answer[i] = (product of everything left of i) × (product of everything right of i). First pass walks left-to-right filling out[i] with the running product of all earlier elements (out[0]=1 since nothing is to its left). Second pass walks right-to-left keeping a single \'right\' running product and multiplies it into out[i]; this folds the suffix product into the prefix product already stored. Division would be O(n) too but breaks when any element is 0, so this is strictly safer. Time O(n) for two linear passes; space O(1) extra since the output array is not counted and \'right\' is one scalar.',
    complexity: 'O(n) time · O(1) extra space (output not counted)',
    code: `// Worked trace for input nums = [1,2,3,4]:
//
//   PASS 1 (prefix: out[i] = product of everything strictly LEFT of i)
//     i   out before        out[i] = out[i-1]*nums[i-1]
//     ─────────────────────────────────────────────────────
//     0   [1, _, _, _]       out[0] = 1   (seed: nothing to the left)
//     1   [1, 1, _, _]       out[1] = 1*1 = 1
//     2   [1, 1, 2, _]       out[2] = 1*2 = 2
//     3   [1, 1, 2, 6]       out[3] = 2*3 = 6
//
//   PASS 2 (suffix: fold in product of everything strictly RIGHT, via scalar 'right')
//     i   right (before)   out[i] *= right        right *= nums[i]
//     ─────────────────────────────────────────────────────────────
//     3   1                out[3] = 6*1  = 6      right = 1*4 = 4
//     2   4                out[2] = 2*4  = 8      right = 4*3 = 12
//     1   12               out[1] = 1*12 = 12     right = 12*2 = 24
//     0   24               out[0] = 1*24 = 24     right = 24*1 = 24
//
// Returns [24, 12, 8, 6]

public int[] productExceptSelf(int[] nums) {
  int n = nums.length;
  int[] out = new int[n];
  // First pass: out[i] = product of everything strictly LEFT of i
  // Seed out[0] = 1 because index 0 has no elements to its left
  out[0] = 1;
  for (int i = 1; i < n; i++) out[i] = out[i-1] * nums[i-1];

  // Second pass: multiply in the product of everything strictly RIGHT of i
  // We track that running product in a single variable — no extra array needed
  int right = 1;
  for (int i = n - 1; i >= 0; i--) {
    out[i] *= right;          // combine left-product (already stored) with right-product
    right *= nums[i];         // extend the right-product to include nums[i] for the next i
  }
  return out;
}`
  },
  {
    num: 8, lc: 36, title: 'Valid Sudoku', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Set',
    url: 'https://leetcode.com/problems/valid-sudoku/',
    approach: 'Single-pass hashing with encoded keys. Insight: a digit is invalid only if it collides on one of three axes — its row, its column, or its 3×3 box. Instead of three separate structures, build a string key that bundles the value with which constraint it occupies (e.g. \'5 row 0\', \'5 col 4\', \'5 box 0-1\') and drop all three into one shared HashSet. HashSet.add returns false when the element is already present, so the first false flags a duplicate and we return immediately. The box is identified by integer-dividing row and column by 3. Because the board is a fixed 9×9 = 81 cells, both time and space are O(1); the keys just avoid index-juggling bugs.',
    complexity: 'O(1) time · O(1) space (fixed 9×9 board)',
    code: `// Worked trace for the top-left region (cells shown row,col with their value):
//
//   r c  v   keys add()ed                       seen.add results
//   ──────────────────────────────────────────────────────────────────
//   0 0  5   "5 row 0","5 col 0","5 box 0-0"    all true  → ok
//   0 1  3   "3 row 0","3 col 1","3 box 0-0"    all true  → ok
//   0 2  .   (skipped — empty cell)             —
//   1 0  6   "6 row 1","6 col 0","6 box 0-0"    all true  → ok
//   ...                                          ...
//   (if a 5 reappeared in row 0) "5 row 0"      add() → false → return false
//
// Returns true when no add() ever fails across all 81 cells

public boolean isValidSudoku(char[][] board) {
  // One shared set; each entry encodes WHICH constraint (row/col/box) the digit lives in
  // so a single structure enforces all three rules at once
  Set<String> seen = new HashSet<>();
  for (int r = 0; r < 9; r++) {
    for (int c = 0; c < 9; c++) {
      char v = board[r][c];
      if (v == '.') continue;               // empty cells impose no constraint
      // 3×3 box index uniquely identifies which sub-grid this cell belongs to
      String box = (r / 3) + "-" + (c / 3);
      // Any of these three add() calls returning false means the digit was already present
      // in that row/col/box — short-circuit out as invalid
      if (!seen.add(v + " row " + r) ||
          !seen.add(v + " col " + c) ||
          !seen.add(v + " box " + box)) return false;
    }
  }
  return true;                               // no collision anywhere → board is valid
}`
  },
  {
    num: 9, lc: 128, title: 'Longest Consecutive Sequence', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Set',
    url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    approach: 'Hash-set with sequence-start anchoring. Dump every value into a HashSet for O(1) membership tests, then iterate the set. The key trick: only begin a count from a number n that is a true start of a run, i.e. n-1 is NOT in the set. From such a start, walk n+1, n+2, ... while each successor exists, measuring the run length. Why O(n): each value is visited by an inner while-loop at most once across the entire outer loop, because the inner walk only ever fires from a unique starting point, so the total inner work is amortized linear. Skipping non-starts is what avoids the naive O(n·len) of re-walking every run. Time O(n); space O(n) for the set.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for input nums = [100,4,200,1,3,2]:
//
//   set = {1,2,3,4,100,200}
//
//   n     n-1 in set?   start?   inner while walk         best
//   ──────────────────────────────────────────────────────────────
//   1     0 → no        yes      2,3,4 present → len=4    best=4
//   2     1 → yes       no       (skip, not a start)      4
//   3     2 → yes       no       (skip)                   4
//   4     3 → yes       no       (skip)                   4
//   100   99 → no       yes      101 absent → len=1       4
//   200   199 → no      yes      201 absent → len=1       4
//
// Returns 4

public int longestConsecutive(int[] nums) {
  // Hash set gives O(1) "does this value exist?" lookups
  Set<Integer> set = new HashSet<>();
  for (int n : nums) set.add(n);             // dedup happens for free

  int best = 0;
  for (int n : set) {
    // KEY TRICK: only start counting from a true "sequence start" (no predecessor).
    // This ensures each sequence is walked exactly once across the whole loop → O(n)
    if (!set.contains(n - 1)) {
      int len = 1;
      // Extend the run upward as long as the next consecutive value is present
      while (set.contains(n + len)) len++;
      best = Math.max(best, len);            // remember the longest run seen
    }
  }
  return best;
}`
  },
  {
    num: 10, lc: 271, title: 'Encode and Decode Strings', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'String · Design',
    url: 'https://leetcode.com/problems/encode-and-decode-strings/',
    approach: 'Length-prefix (netstring-style) framing. The insight is that no single delimiter character is safe because the payload can contain it, so instead each string is encoded as its length, a \'#\' separator, then the literal string: \'5#hello\'. The decoder reads digits until the \'#\', parses them as a count, then blindly copies exactly that many characters — so \'#\' or digits inside the payload are never misread as structure. This handles empty strings (\'0#\') and any character set unambiguously, which a plain split-on-delimiter approach cannot. Encoding and decoding are each one linear scan, O(n) time over the total character count, with O(n) space for the produced output.',
    complexity: 'O(n) encode / decode · O(n) space',
    code: `// Worked trace for encode/decode of ["abc","","de#f"]:
//
//   ENCODE: append len + '#' + s for each string
//     s="abc"  → "3#abc"
//     s=""     → "0#"
//     s="de#f" → "5#de#f"
//     result = "3#abc0#5#de#f"
//
//   DECODE of "3#abc0#5#de#f":
//     i   scan to '#'   len   substring(j+1, j+1+len)   out                 next i
//     ─────────────────────────────────────────────────────────────────────────────
//     0   j=1           3     "abc"                     ["abc"]             5
//     5   j=6           0     ""                        ["abc",""]          7
//     7   j=8           5     "de#f"                    ["abc","","de#f"]   13
//
// Returns ["abc", "", "de#f"]

public String encode(List<String> strs) {
  // Length-prefix format avoids any ambiguity around special characters in payload:
  // the count tells the decoder exactly how many chars to read, so '#' inside a
  // string can never be mistaken for a delimiter
  StringBuilder sb = new StringBuilder();
  for (String s : strs) sb.append(s.length()).append('#').append(s);
  return sb.toString();
}

public List<String> decode(String s) {
  List<String> out = new ArrayList<>();
  int i = 0;
  while (i < s.length()) {
    // Find the '#' that ends this string's length prefix
    int j = i;
    while (s.charAt(j) != '#') j++;
    // Read the prefix as the length of the upcoming string
    int len = Integer.parseInt(s.substring(i, j));
    // Extract exactly 'len' chars; the '#' is at j, payload starts at j+1
    out.add(s.substring(j + 1, j + 1 + len));
    // Advance past the delimiter (1) and the payload (len) to the next frame
    i = j + 1 + len;
  }
  return out;
}`
  },
  {
    num: 11, lc: 53, title: 'Maximum Subarray', d: 'medium', companies: ['Temu', 'Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · DP (Kadane)',
    url: 'https://leetcode.com/problems/maximum-subarray/',
    approach: 'Kadane\'s algorithm — a one-pass dynamic program. Define current = the max sum of a subarray that must END at index i. The recurrence is current = max(nums[i], current + nums[i]): extending the previous run is worthwhile only while that run\'s sum stays positive; the moment it would drag nums[i] down, we discard it and restart fresh at nums[i]. \'best\' tracks the largest current ever seen, the global answer. Correct because any optimal subarray ends at some index, and current holds the best subarray ending there. Seeding both with nums[0] handles all-negative inputs (returns the least-negative element). Time O(n) one pass; space O(1), beating the O(n²) brute force.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for input nums = [-2,1,-3,4,-1,2,1,-5,4]:
//
//   i  nums[i]  current = max(nums[i], current+nums[i])   best
//   ──────────────────────────────────────────────────────────
//   0   -2      current = -2          (seed)              -2
//   1    1      max(1, -2+1=-1)  = 1                       1
//   2   -3      max(-3, 1-3=-2)  = -2                      1
//   3    4      max(4, -2+4=2)   = 4                       4
//   4   -1      max(-1, 4-1=3)   = 3                       4
//   5    2      max(2, 3+2=5)    = 5                       5
//   6    1      max(1, 5+1=6)    = 6                       6   ← subarray [4,-1,2,1]
//   7   -5      max(-5, 6-5=1)   = 1                       6
//   8    4      max(4, 1+4=5)    = 5                       6
//
// Returns 6

public int maxSubArray(int[] nums) {
  // current = best sum of a subarray ending exactly at index i
  // best    = best sum seen anywhere so far
  // Seeding both with nums[0] correctly handles all-negative arrays
  int current = nums[0], best = nums[0];
  for (int i = 1; i < nums.length; i++) {
    // KADANE: extending current is worth it only if the running sum is still net-positive.
    // Otherwise the prior run only hurts, so start fresh from nums[i]
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);          // global answer is the max over all endpoints
  }
  return best;
}`
  },
  {
    num: 12, lc: 152, title: 'Maximum Product Subarray', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · DP',
    url: 'https://leetcode.com/problems/maximum-product-subarray/',
    approach: 'Kadane-style DP tracking BOTH the max and the min product ending at i. The core insight: multiplication by a negative number swaps extremes — the largest product can become the smallest and vice versa — so a big negative min is a candidate future maximum once another negative arrives. When nums[i] is negative we swap max and min before updating. Each then becomes either a fresh start at nums[i] or an extension of the running product (max*n or min*n), which also naturally resets at zeros since 0 makes both products 0. \'best\' records the running maximum. Tracking only the max would fail on inputs like [-2,3,-4]. Time O(n) one pass; space O(1) with three scalars.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for input nums = [2,3,-2,4]:
//
//   i  n   swap? (n<0)   max = max(n, max*n)   min = min(n, min*n)   best
//   ───────────────────────────────────────────────────────────────────────
//   0  2   (seed)        max=2                 min=2                 2
//   1  3   no            max(3, 2*3=6)   = 6   min(3, 2*3=6)   = 3   6
//   2 -2   yes→swap      pre-swap max=6,min=3; after swap max=3,min=6
//          then          max(-2, 3*-2=-6)= -2  min(-2, 6*-2=-12)=-12 6
//   3  4   no            max(4, -2*4=-8) = 4   min(4, -12*4=-48)=-48 6
//
// Returns 6  (subarray [2,3])

public int maxProduct(int[] nums) {
  // We need BOTH max and min ending at i: a big negative becomes a big positive
  // after multiplying by another negative, so the min is a future-max candidate
  int max = nums[0], min = nums[0], best = nums[0];
  for (int i = 1; i < nums.length; i++) {
    int n = nums[i];
    // Negative n flips the roles — what was max becomes min and vice versa
    if (n < 0) {
      int t = max;
      max = min;
      min = t;
    }
    // Either start fresh at n (handles zeros / sign breaks) or extend the running product
    max = Math.max(n, max * n);
    min = Math.min(n, min * n);
    best = Math.max(best, max);              // only the max can be the global answer
  }
  return best;
}`
  },
  {
    num: 13, lc: 283, title: 'Move Zeroes', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · Two Pointers',
    url: 'https://leetcode.com/problems/move-zeroes/',
    approach: 'Two-pointer stable partition. Keep a \'write\' index marking the next slot that should receive a non-zero value. Scan the array once; for each non-zero element, copy it to nums[write] and advance write. Because we read in order and only place non-zeros, their relative order is preserved automatically, and write never overtakes the read pointer so no needed value is clobbered. After the scan, every index from write to the end belonged to a zero, so a short second loop fills that tail with 0s. This is in-place, O(n) time, O(1) extra space, avoiding any auxiliary array; a swap-based variant also works but this minimizes total writes when zeros are dense.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for input nums = [0,1,0,3,12]:
//
//   PASS 1 (pack non-zeros to the front):
//     read n   n!=0?   action                       array          write
//     ────────────────────────────────────────────────────────────────────
//     0        no      skip                         [0,1,0,3,12]   0
//     1        yes     nums[0]=1, write→1           [1,1,0,3,12]   1
//     0        no      skip                         [1,1,0,3,12]   1
//     3        yes     nums[1]=3, write→2           [1,3,0,3,12]   2
//     12       yes     nums[2]=12, write→3          [1,3,12,3,12]  3
//
//   PASS 2 (zero-fill the tail from write..end):
//     nums[3]=0, nums[4]=0                          [1,3,12,0,0]
//
// Result (in place): [1,3,12,0,0]

public void moveZeroes(int[] nums) {
  // write = next slot to receive a non-zero value (always ≤ current read index,
  // so we never overwrite a value we still need to read)
  int write = 0;
  for (int n : nums) {
    // Pack non-zeros to the front in their original order (stable)
    if (n != 0) nums[write++] = n;
  }
  // Anything from 'write' onward held values already copied earlier — set them to zero
  while (write < nums.length) nums[write++] = 0;
}`
  },
  {
    num: 14, lc: 75, title: 'Sort Colors', d: 'medium', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · Dutch National Flag',
    url: 'https://leetcode.com/problems/sort-colors/',
    approach: 'Dutch National Flag algorithm (Dijkstra), a three-way one-pass partition. Maintain three pointers: lo (boundary after the 0-zone), hi (boundary before the 2-zone), and mid (the scanner). Invariant: everything before lo is 0, everything in [lo, mid) is 1, everything after hi is 2, and [mid, hi] is unprocessed. When nums[mid] is 0, swap it to lo and advance both lo and mid (the swapped-in value was already a processed 1). When it\'s 2, swap it to hi and decrement hi only — do NOT advance mid, since the value swapped in from hi is unexamined. When it\'s 1, just advance mid. The loop ends when mid passes hi. Time O(n) one pass; space O(1), beating a two-pass count sort.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for input nums = [2,0,2,1,1,0]:
//
//   lo mid hi  nums[mid]  action                              array
//   ──────────────────────────────────────────────────────────────────────
//   0   0   5    2        ==2: swap mid,hi; hi-- (mid stays)  [0,0,2,1,1,2]
//   0   0   4    0        ==0: swap mid,lo; lo++,mid++        [0,0,2,1,1,2]
//   1   1   4    0        ==0: swap mid,lo; lo++,mid++        [0,0,2,1,1,2]
//   2   2   4    2        ==2: swap mid,hi; hi-- (mid stays)  [0,0,1,1,2,2]
//   2   2   3    1        ==1: mid++                          [0,0,1,1,2,2]
//   2   3   3    1        ==1: mid++                          [0,0,1,1,2,2]
//   2   4   3             mid>hi → stop
//
// Result (in place): [0,0,1,1,2,2]

public void sortColors(int[] nums) {
  // Invariants kept throughout the scan:
  //   nums[0..lo-1]   are all 0
  //   nums[lo..mid-1] are all 1
  //   nums[hi+1..]    are all 2
  //   nums[mid..hi]   are still unprocessed
  int lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] == 0) {
      // Send 0 to the left zone; the value swapped in is a known 1, so both lo and mid advance
      int t = nums[lo]; nums[lo++] = nums[mid]; nums[mid++] = t;
    } else if (nums[mid] == 2) {
      // Send 2 to the right zone; the swapped-in value from hi is unknown, so DON'T advance mid
      int t = nums[hi]; nums[hi--] = nums[mid]; nums[mid] = t;
    } else {
      mid++;   // a 1 — already in the correct middle zone, just move on
    }
  }
}`
  },
  {
    num: 15, lc: 41, title: 'First Missing Positive', d: 'hard',
    bucket: 'Arrays & Hashing', category: 'Array · Cyclic Sort',
    url: 'https://leetcode.com/problems/first-missing-positive/',
    approach: 'In-place cyclic sort. The trick: the answer must lie in 1..n+1, so values outside that range are irrelevant. We route each in-range positive value v to its home slot index v-1 by swapping; we keep swapping the current slot until its value is out of range or already parked correctly, so each value moves at most once and the pass is O(n) total. After sorting, the first index i where nums[i] != i+1 exposes the missing positive i+1; if all slots match, every value 1..n is present so the answer is n+1. This beats the obvious hash-set scan, which needs O(n) extra space and is disallowed here. Pitfall: use a while-loop (not if) and compare target slots before swapping to avoid infinite swaps on duplicates.',
    complexity: 'O(n) time · O(1) extra space',
    code: `// Worked trace for input nums = [3, 4, -1, 1]   (n = 4):
//
//   i  action                                   array after
//   ───────────────────────────────────────────────────────────────
//   0  3 in range, slot[2]=-1 != 3 → swap       [-1, 4, 3, 1]
//      -1 out of range → stop                   [-1, 4, 3, 1]
//   1  4 in range, slot[3]=1 != 4 → swap        [-1, 1, 3, 4]
//      1 in range, slot[0]=-1 != 1 → swap       [1, -1, 3, 4]
//      -1 out of range → stop                   [1, -1, 3, 4]
//   2  3 already at slot[2] (3==3) → stop        [1, -1, 3, 4]
//   3  4 already at slot[3] (4==4) → stop        [1, -1, 3, 4]
//
//   scan: i=0 → 1==1 ok; i=1 → -1 != 2 → return 2
//
// Returns 2

public int firstMissingPositive(int[] nums) {
  int n = nums.length;
  // Cyclic sort: route each positive ≤ n to its "home" slot (value v → index v-1)
  for (int i = 0; i < nums.length; i++) {
    // Keep swapping until nums[i] is out of range OR already in its correct slot.
    // The "target != current" guard stops infinite swapping when duplicates collide.
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
      // Send nums[i] to where it belongs, pulling that slot's old value back to i
      int t = nums[nums[i] - 1];
      nums[nums[i] - 1] = nums[i];
      nums[i] = t;
    }
  }
  // The first slot where the value doesn't match its index+1 reveals the missing positive
  for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
  // Every slot 1..n is correct → the whole prefix is present, so answer is n+1
  return n + 1;
}`
  },
  {
    num: 16, lc: 56, title: 'Merge Intervals', d: 'medium', companies: ['Temu', 'Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · Intervals',
    url: 'https://leetcode.com/problems/merge-intervals/',
    approach: 'Sort-and-sweep (greedy interval merging). Sort all intervals by start time so that any intervals which could overlap become adjacent; this is the key insight, because once sorted, a new interval can only overlap the most recently merged group, never an earlier one. Sweep left to right keeping a result list: if the current interval\'s start is beyond the last group\'s end there is no overlap, so append it as a new group; otherwise extend that group\'s end to max(lastEnd, curEnd) to absorb nested or partial overlaps. Sorting costs O(n log n) which dominates the single O(n) sweep; output uses O(n) space. Pitfall: take the max when extending, since a fully nested interval like [2,3] inside [1,10] must not shrink the end to 3.',
    complexity: 'O(n log n) time · O(n) space',
    code: `// Worked trace for intervals = [[1,3], [2,6], [8,10], [15,18]]:
//
//   after sort: [[1,3], [2,6], [8,10], [15,18]]  (already sorted by start)
//
//   cur       lastEnd  overlap?            merged
//   ─────────────────────────────────────────────────────────────
//   [1,3]     (empty)  start new           [[1,3]]
//   [2,6]     3        2 ≤ 3 → extend end   [[1,6]]
//   [8,10]    6        8 > 6 → start new    [[1,6],[8,10]]
//   [15,18]   10       15 > 10 → start new  [[1,6],[8,10],[15,18]]
//
// Returns [[1,6], [8,10], [15,18]]

public int[][] merge(int[][] intervals) {
  // Sort by start time — overlapping intervals will be adjacent afterward
  // LAMBDA (Comparator): (a, b) -> a[0] - b[0] IS the compare(a, b) body — a
  // negative result means a comes before b, so this sorts by start ascending.
  // Without the lambda you'd pass an anonymous class:
  //   Arrays.sort(intervals, new Comparator<int[]>() {
  //     public int compare(int[] a, int[] b) { return a[0] - b[0]; }
  //   });
  Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
  List<int[]> merged = new ArrayList<>();
  for (int[] cur : intervals) {
    // No overlap with the last group (or nothing merged yet) → start a new group
    if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < cur[0]) {
      merged.add(cur);
    } else {
      // Overlap → extend the last group's END. Use max so a nested interval
      // (e.g. [2,3] inside [1,10]) doesn't accidentally shrink the end.
      merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], cur[1]);
    }
  }
  // Collapse the list back into a 2D array for the return type
  return merged.toArray(new int[0][]);
}`
  },
  {
    num: 17, lc: 54, title: 'Spiral Matrix', d: 'medium', companies: ['Temu'],
    bucket: 'Arrays & Hashing', category: 'Matrix',
    url: 'https://leetcode.com/problems/spiral-matrix/',
    approach: 'Boundary-shrinking simulation. Maintain four boundaries top, bottom, left, right that fence off the unvisited region. Each loop iteration peels one full ring: walk the top row left to right then increment top, walk the right column top to bottom then decrement right, walk the bottom row right to left then decrement bottom, walk the left column bottom to top then increment left. The two guards top ≤ bottom and left ≤ right before the bottom-row and left-column passes are essential, otherwise a single remaining row or column would be traversed twice in non-square matrices. Every cell is added exactly once, giving O(m·n) time and O(1) extra space beyond the output. It cleanly handles single-row and single-column inputs without special cases thanks to those mid-loop boundary checks.',
    complexity: 'O(R · C) time · O(1) extra space',
    code: `// Worked trace for matrix = [[1,2,3],[4,5,6],[7,8,9]]:
//
//   top bottom left right  action                    out so far
//   ─────────────────────────────────────────────────────────────────────
//   0   2      0    2      top row L→R: 1,2,3          1,2,3
//   1   2      0    2      right col T→B: 6,9          1,2,3,6,9
//   1   2      0    2      bottom row R→L: 8,7         1,2,3,6,9,8,7
//   1   1      0    2      left col B→T: 4             1,2,3,6,9,8,7,4
//   1   1      1    1      top row L→R: 5              1,2,3,6,9,8,7,4,5
//   2   1      ...         top > bottom → loop ends
//
// Returns [1,2,3,6,9,8,7,4,5]

public List<Integer> spiralOrder(int[][] matrix) {
  List<Integer> out = new ArrayList<>();
  // Four boundaries that shrink inward as we peel off layers
  int top = 0, bottom = matrix.length - 1;
  int left = 0, right = matrix[0].length - 1;
  // Stop once the boundaries cross — nothing left to visit
  while (top <= bottom && left <= right) {
    // Top row, left → right, then that row is done
    for (int c = left; c <= right; c++) out.add(matrix[top][c]);
    top++;
    // Right column, top → bottom, then that column is done
    for (int r = top; r <= bottom; r++) out.add(matrix[r][right]);
    right--;
    // Bottom row — guard so a lone remaining row isn't traversed twice
    if (top <= bottom) {
      for (int c = right; c >= left; c--) out.add(matrix[bottom][c]);
      bottom--;
    }
    // Left column — guard so a lone remaining column isn't traversed twice
    if (left <= right) {
      for (int r = bottom; r >= top; r--) out.add(matrix[r][left]);
      left++;
    }
  }
  return out;
}`
  },
  {
    num: 18, lc: 48, title: 'Rotate Image', d: 'medium', companies: ['Temu'],
    bucket: 'Arrays & Hashing', category: 'Matrix',
    url: 'https://leetcode.com/problems/rotate-image/',
    approach: 'Transpose-then-reverse, an in-place two-step rotation. The insight is that a 90° clockwise rotation decomposes into two simple operations: first transpose the matrix (swap element [i][j] with [j][i], which reflects across the main diagonal), then reverse each row (which mirrors left-right). Composing a diagonal reflection with a horizontal reflection yields exactly a 90° clockwise turn. The transpose only swaps the upper triangle (j starts at i+1) so no swap is undone, and the row reversals are independent, so both steps run in O(n²) time using O(1) extra space — no second matrix needed. Pitfall: looping j over the full row instead of just j > i would swap each pair twice and leave the matrix unchanged.',
    complexity: 'O(n²) time · O(1) space',
    code: `// Worked trace for matrix = [[1,2,3],[4,5,6],[7,8,9]]:
//
//   step                      matrix
//   ───────────────────────────────────────────────
//   start          [[1,2,3],[4,5,6],[7,8,9]]
//   transpose      [[1,4,7],[2,5,8],[3,6,9]]   (swap across main diagonal)
//   reverse rows   [[7,4,1],[8,5,2],[9,6,3]]   (each row flipped L↔R)
//
// Returns (in place) [[7,4,1],[8,5,2],[9,6,3]]

public void rotate(int[][] matrix) {
  int n = matrix.length;
  // Step 1: transpose — swap matrix[i][j] with matrix[j][i] for j > i only,
  // so each off-diagonal pair is swapped exactly once (not undone)
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int tmp = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = tmp;
    }
  }
  // Step 2: reverse each row in place — combined with the transpose this is a 90° clockwise rotation
  for (int[] row : matrix) {
    int l = 0, r = n - 1;
    // Swap ends moving inward until the pointers meet
    while (l < r) {
      int tmp = row[l]; row[l++] = row[r]; row[r--] = tmp;
    }
  }
}`
  },

  {
    num: 116, lc: 13, title: 'Roman to Integer', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'String · Hash Map',
    url: 'https://leetcode.com/problems/roman-to-integer/',
    approach: 'One pass with a symbol→value map and one-token lookahead. Roman numerals are mostly additive — you just sum the symbol values — but six subtractive pairs (IV, IX, XL, XC, CD, CM) break the rule: a smaller symbol written before a strictly larger one is subtracted instead of added. The key insight is that this exception has a single uniform signature, value(s[i]) < value(s[i+1]), so comparing each symbol against its successor decides the sign without pattern-matching any pair explicitly; the last symbol has no successor and is always added. The naive alternative — hard-coding all six two-character combos and jumping the index by two on a match — works but triples the branching and invites off-by-one bugs in the index bookkeeping. The problem guarantees a valid numeral in [1, 3999], so no validation is needed. The map holds a fixed seven entries, giving O(n) time and O(1) space. An equivalent alternative scans right-to-left, adding each value but negating it whenever it is smaller than the value of the symbol just processed to its right.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = "MCMXCIV" (1994):
//
//   i  c   val    next    val<next?  action  total
//   ────────────────────────────────────────────────
//   0  M   1000   C=100     no       +1000    1000
//   1  C    100   M=1000    yes      -100      900
//   2  M   1000   X=10      no       +1000    1900
//   3  X     10   C=100     yes      -10      1890
//   4  C    100   I=1       no       +100     1990
//   5  I      1   V=5       yes      -1       1989
//   6  V      5   (none)    no       +5       1994
//
// Returns 1994

public int romanToInt(String s) {
  // Fixed 7-symbol alphabet — the values never change, so the map is O(1) space by definition
  Map<Character, Integer> value = new HashMap<>();
  value.put('I', 1);    value.put('V', 5);
  value.put('X', 10);   value.put('L', 50);
  value.put('C', 100);  value.put('D', 500);
  value.put('M', 1000);
  int total = 0;
  for (int i = 0; i < s.length(); i++) {
    // Value of the current symbol; validity is guaranteed, so get() never returns null
    int cur = value.get(s.charAt(i));
    // Subtractive rule: a smaller symbol BEFORE a strictly larger one is negated (I in IV).
    // This one comparison covers all six pairs (IV IX XL XC CD CM) — no per-pair cases.
    // The i + 1 bound check keeps the last symbol out, which has no successor and must add.
    if (i + 1 < s.length() && cur < value.get(s.charAt(i + 1))) {
      // Contribute the negative now; the larger successor adds its full value next turn,
      // so IV nets -1 + 5 = 4 without ever skipping the index ahead by two
      total -= cur;
    } else {
      // Equal or larger than what follows (or final symbol) — the plain additive case.
      // Equal matters: III must take this branch, since 1 < 1 is false
      total += cur;
    }
  }
  // Every symbol contributed exactly once with the right sign — total is the numeral
  return total;
}`
  },
  {
    num: 117, lc: 8, title: 'String to Integer (atoi)', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'String · Parsing',
    url: 'https://leetcode.com/problems/string-to-integer-atoi/',
    approach: 'Deterministic left-to-right scan with three strictly ordered phases: skip leading spaces, consume at most one sign, then accumulate digits via result = result * 10 + digit until the first non-digit. The key insight is the overflow guard checked BEFORE the multiply — if result > (Integer.MAX_VALUE - digit) / 10, appending this digit would exceed 32 bits, so clamp to MAX_VALUE or MIN_VALUE by sign right there; after the multiply the damage is already done and undetectable in an int. Accumulating a positive magnitude and applying the sign only at the end stays correct even for -2147483648, whose magnitude is one past MAX_VALUE, because the clamp fires on its last digit and returns MIN_VALUE exactly. The phase ordering makes the tricky inputs fall out for free: "+-12" consumes one sign then stops at the second, and "words and 987" never enters the digit loop, so both return 0. Naive alternatives are worse: parsing into a long merely defers the overflow question (interviewers then ask what you\'d do if long could overflow too), and Integer.parseInt throws on trailing garbage like "4193 with words" that must legally parse to 4193. An equivalent alternative is an explicit DFA with start/sign/digits/done states — the same logic drawn as a state machine, which generalizes to Valid Number (LC 65).',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = "   -42":
//
//   phase       i  char  action                       sign  result
//   ─────────────────────────────────────────────────────────────────
//   skip space  0  ' '   leading blank, advance        +1      0
//   skip space  1  ' '   leading blank, advance        +1      0
//   skip space  2  ' '   leading blank, advance        +1      0
//   sign        3  '-'   record negative, advance      -1      0
//   digit       4  '4'   result = 0*10 + 4             -1      4
//   digit       5  '2'   result = 4*10 + 2             -1     42
//   end         6  -     i == length, stop             -1     42
//
// Returns sign * result = -42

public int myAtoi(String s) {
  int i = 0, n = s.length();
  // 1) Whitespace is legal ONLY at the very front, so consume it before anything else.
  //    The i < n guard keeps charAt safe on empty or all-space input.
  while (i < n && s.charAt(i) == ' ') i++;
  // 2) At most ONE sign, and only immediately after the spaces. Consuming it here
  //    means a second sign ("+-12") is later seen as a non-digit and correctly yields 0.
  int sign = 1;
  if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) {
    sign = s.charAt(i) == '-' ? -1 : 1;
    i++;
  }
  // Accumulate the POSITIVE magnitude; the sign is applied exactly once at the end
  int result = 0;
  // 3) Digits run until the first non-digit — trailing garbage ("4193 with words")
  //    just terminates the loop instead of invalidating the whole parse.
  while (i < n && Character.isDigit(s.charAt(i))) {
    int digit = s.charAt(i) - '0';
    // Overflow guard BEFORE the multiply: once result * 10 wraps, an int can't tell.
    // Integer division makes the test exact: result > (MAX - digit) / 10
    // holds if and only if result * 10 + digit would exceed Integer.MAX_VALUE.
    if (result > (Integer.MAX_VALUE - digit) / 10) {
      // MIN_VALUE's magnitude is one past MAX_VALUE's, so "-2147483648" trips this
      // clamp on its final digit and still returns the exact right answer
      return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
    }
    // Shift left one decimal place and append the new digit
    result = result * 10 + digit;
    i++;
  }
  // No digits at all ("words and 987", "", "+") leaves result at 0 — the required default
  return sign * result;
}`
  },
  {
    num: 118, lc: 28, title: 'Find the Index of the First Occurrence in a String', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Scan',
    url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
    approach: 'Sliding-window comparison with early exit. Anchor a window of needle\'s length at every start index i and compare it against needle character by character, bailing at the first mismatch. The key insight is the loop bound i + m <= n: any anchor past n - m cannot fit the whole needle, so those windows are skipped outright — and a needle longer than the haystack makes the loop body never run, falling straight through to -1 with no special-case code. Scanning anchors left to right guarantees the first window that fully matches is the leftmost occurrence, exactly what the problem asks for. The early mismatch exit means most windows die on their opening character in practice, though an adversarial input like haystack = "aaaa...ab" with needle = "aab" still drives it to O(n·m) worst case. The substring-slicing variant (haystack.substring(i, i + m).equals(needle)) does the same comparisons but allocates a fresh string per window, so direct charAt access is strictly better. For guaranteed linear time, the KMP algorithm precomputes a failure table over needle so a mismatch skips the anchor ahead instead of restarting, achieving O(n + m).',
    complexity: 'O(n·m) time · O(1) space',
    code: `// Worked trace for haystack = "hello", needle = "ll" (n = 5, m = 2):
//
//   i  window  char-by-char comparison         j after  full match?
//   ─────────────────────────────────────────────────────────────────
//   0  "he"    'h' vs 'l' → mismatch at once   0        no
//   1  "el"    'e' vs 'l' → mismatch at once   0        no
//   2  "ll"    'l'='l' ok, 'l'='l' ok          2        yes → return 2
//
// (last anchor tried would be i = 3 = n - m; never reached here)
// Returns 2

public int strStr(String haystack, String needle) {
  int n = haystack.length(), m = needle.length();
  // Only anchors 0..n-m can fit the whole needle. If m > n the condition is
  // false immediately and we fall through to -1 — no separate length guard.
  for (int i = 0; i + m <= n; i++) {
    // How many needle chars have matched at this anchor so far
    int j = 0;
    // Walk forward while the chars agree; stopping at the FIRST mismatch is
    // what keeps typical inputs fast — most windows die on their opening char.
    while (j < m && haystack.charAt(i + j) == needle.charAt(j)) {
      j++;
    }
    // j == m means every needle char matched. Anchors are tried left to
    // right, so this is guaranteed to be the FIRST occurrence — return now.
    if (j == m) return i;
  }
  // Every anchor failed — needle never occurs in haystack
  return -1;
}`
  },
  {
    num: 119, lc: 151, title: 'Reverse Words in a String', d: 'medium', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Parsing',
    url: 'https://leetcode.com/problems/reverse-words-in-a-string/',
    approach: 'Backward two-pointer scan that emits words in reverse order in a single pass. Walk a cursor from the end of the string toward the front: first skip any run of spaces, then mark the word\'s last character, then keep walking left until just past its first character — the slice between those two bounds is one complete word, appended to a StringBuilder with a single separating space. The key insight is that reading right-to-left makes the LAST word come out first, so no separate reversal step is ever needed, and skipping the space-run before each word normalizes leading, trailing, and repeated interior spaces with one uniform loop. Reversing the raw character sequence instead would scramble the letters inside each word, and the one-liner of trim() plus a regex split on whitespace runs works but allocates a token array and regex machinery — exactly what interviewers ask you to avoid. Appending each word by index range (not char-by-char through temporaries) keeps it to one copy per character. Runs in O(n) time and O(n) space for the output; an equivalent alternative — the O(1)-extra-space trick for mutable strings — reverses the whole char array, then re-reverses each word and compacts the spaces in place.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for s = "  hello world  "   (indices 0..14):
//
//   step  action                  i moves    word slice        builder after
//   ─────────────────────────────────────────────────────────────────────────
//   1     skip trailing spaces    14 -> 12   -                 ""
//   2     scan word right->left   12 -> 7    s[8..12] "world"  "world"
//   3     skip gap spaces         7  -> 6    -                 "world"
//   4     scan word right->left   6  -> 1    s[2..6]  "hello"  "world hello"
//   5     skip leading spaces     1  -> -1   -                 "world hello"
//   6     i < 0 -> loop ends
//
// Returns "world hello"

public String reverseWords(String s) {
  // Build the answer front-to-back while reading the input back-to-front —
  // that single direction flip is what reverses the word order for free.
  StringBuilder sb = new StringBuilder();
  int i = s.length() - 1;
  while (i >= 0) {
    // Skip the space run sitting to the right of the next word. This ONE loop
    // handles trailing, repeated-interior, and leading spaces uniformly.
    while (i >= 0 && s.charAt(i) == ' ') i--;
    // Only spaces remained — every word has been consumed, stop cleanly
    if (i < 0) break;
    // i now sits on the LAST character of a word; pin that boundary
    int end = i;
    // Walk left through the word; the loop exits one position BEFORE its first char
    while (i >= 0 && s.charAt(i) != ' ') i--;
    // Separator only BETWEEN words, never before the first — this guarantee is
    // what keeps the output free of leading/trailing spaces.
    if (sb.length() > 0) sb.append(' ');
    // The word spans s[i+1 .. end]; append(CharSequence, from, toExclusive)
    // copies it straight into the builder with no intermediate substring object.
    sb.append(s, i + 1, end + 1);
  }
  return sb.toString();
}`
  },
  {
    num: 120, lc: 169, title: 'Majority Element', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Array · Voting',
    url: 'https://leetcode.com/problems/majority-element/',
    approach: 'Boyer-Moore majority vote: keep a single candidate and a counter, scanning once. When the counter is zero, adopt the current element as the candidate; otherwise add 1 on a match and subtract 1 on a mismatch. The insight that makes this correct is pairing-off: every decrement cancels one candidate copy against one non-candidate copy, and because the true majority owns strictly more than half the slots, it can never be fully paired away — whatever candidate survives the scan must be it. When the counter hits zero the prefix just consumed had no net winner, so the majority of the remaining suffix equals the global majority and restarting there is safe. Since the problem guarantees a majority exists, the survivor needs no verification; drop that guarantee and you would add one extra pass to re-count it. A HashMap frequency table also runs in O(n) but spends O(n) extra space, and sorting costs O(n log n) — both lose to the voting scan. An equivalent alternative: sort and return nums[n/2], because an element occupying more than half the array must cover the middle index.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [2, 2, 1, 1, 1, 2, 2]:
//
//   i  num  count before  candidate before  action              cand/count after
//   ─────────────────────────────────────────────────────────────────────────────
//   0   2        0               -          count==0 → adopt 2      2 / 1
//   1   2        1               2          match    → count+1      2 / 2
//   2   1        2               2          mismatch → count-1      2 / 1
//   3   1        1               2          mismatch → count-1      2 / 0
//   4   1        0               2          count==0 → adopt 1      1 / 1
//   5   2        1               1          mismatch → count-1      1 / 0
//   6   2        0               1          count==0 → adopt 2      2 / 1
//
// Returns 2  (2 holds 4 of the 7 slots — the guaranteed majority)

public int majorityElement(int[] nums) {
  // The current pairing-off survivor; any initial value is safe because
  // count == 0 forces an adoption on the very first element.
  int candidate = 0;
  // Net vote balance: candidate copies seen minus rivals seen since adoption
  int count = 0;
  for (int num : nums) {
    // Balance exhausted — the consumed prefix split evenly into cancelled pairs,
    // so the global majority still rules the remaining suffix: adopt afresh here.
    if (count == 0) candidate = num;
    // Match strengthens the candidate; mismatch burns one candidate vote against
    // one rival. The majority holds MORE than half the slots, so it can never be
    // burned away completely — it must be the candidate left standing at the end.
    count += (num == candidate) ? 1 : -1;
  }
  // A majority is guaranteed to exist, so no second verification pass is needed;
  // without that guarantee we would re-scan and count candidate's occurrences.
  return candidate;
}`
  },
  {
    num: 121, lc: 268, title: 'Missing Number', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Array · Math/XOR',
    url: 'https://leetcode.com/problems/missing-number/',
    approach: 'XOR cancellation over indices and values. XOR has two gifts: a ^ a = 0 and full commutativity/associativity, so pairing order never matters. XOR together every loop index 0..n-1, every value nums[i], and the number n itself; each value that actually appears in the array meets its identical index somewhere in the stream and annihilates to zero. The lone survivor is the missing number, because it enters from the index side but has no partner on the value side. Seeding the accumulator with n is the subtle step — values span 0..n while indices stop at n-1, so without the seed n could never cancel, nor be reported when it is the answer. Naive alternatives are strictly worse: sorting then scanning costs O(n log n), and a HashSet membership check costs O(n) extra space, while this is one pass with a single int of state. The Gauss-sum variant — expected sum n(n+1)/2 minus the actual array sum — is an equivalent O(n)/O(1) alternative, with a mild overflow caveat for larger ranges.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [3, 0, 1] (n = 3, range is 0..3, 2 is absent):
//
//   step   i   nums[i]   XOR folded in      missing after
//   ─────────────────────────────────────────────────────
//   seed   -     -       start with n = 3       3
//   0      0     3       ^ 0 ^ 3            3^0^3 = 0
//   1      1     0       ^ 1 ^ 0            0^1^0 = 1
//   2      2     1       ^ 2 ^ 1            1^2^1 = 2
//
// Returns 2

public int missingNumber(int[] nums) {
  int n = nums.length;
  // Seed with n itself: values span 0..n but loop indices only span 0..n-1,
  // so without this n would never enter the XOR — it could neither cancel
  // when present in nums nor survive as the answer when absent.
  int missing = n;
  for (int i = 0; i < n; i++) {
    // Fold in both the index and the value sitting at it. Every value that
    // exists in nums equals some index in 0..n (a ^ a = 0, and XOR order is
    // irrelevant by commutativity), so all matched pairs annihilate. Only
    // the missing number — present on the index side, partnerless on the
    // value side — is left standing at the end.
    missing ^= i ^ nums[i];
  }
  // Everything paired has cancelled to 0, and 0 ^ x = x
  return missing;
}`
  },
  {
    num: 122, lc: 202, title: 'Happy Number', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Math · Fast & Slow',
    url: 'https://leetcode.com/problems/happy-number/',
    approach: 'Floyd\'s tortoise-and-hare cycle detection run on an implicit linked list: each number "points" to the sum of the squares of its digits, so the question becomes whether that hidden chain terminates at the fixed point 1 or loops forever. The key fact that makes a decision possible is that the chain can never wander off to infinity — any value with 4 or more digits strictly shrinks under the operation (even 9,999,999,999 maps to just 810), so every chain is squeezed below 243 within a few steps and, by pigeonhole, must eventually revisit a value. A forced repeat is exactly a cycle, so advance slow one step and fast two steps per iteration: if fast reaches 1 the number is happy, and if fast catches slow the pointers are trapped in a non-1 loop and the answer is false. Seeding fast one step ahead of slow keeps the meeting test from firing before either pointer has moved, and testing fast (the leader) against 1 detects happiness as early as possible. The naive loop with no cycle check simply never terminates on unhappy inputs like 2. The standard alternative — record every value seen in a HashSet and return false on the first repeat — is equally correct but pays extra space for the set, while the two pointers use none. An equivalent (if less general) shortcut is hard-coding the single known unhappy cycle and checking whether the chain ever hits 4.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for n = 19  (digit-square-sum chain: 19 → 82 → 68 → 100 → 1):
//
//   step   slow   fast   how fast advanced           loop check
//   ─────────────────────────────────────────────────────────────────────
//   init    19     82    fast = next(19)             fast != 1, slow != fast → run
//   1       82    100    next(82)=68, next(68)=100   fast != 1, slow != fast → run
//   2       68      1    next(100)=1, next(1)=1      fast == 1 → stop
//
// Returns true (fast reached the fixed point 1, so 19 is happy)

public boolean isHappy(int n) {
  // Two pointers walking the implicit list n → next(n) → next(next(n)) → ...
  // fast starts one step AHEAD: if both started at n, slow == fast would end the
  // loop before any movement and every n != 1 would be misreported as unhappy.
  int slow = n;
  int fast = next(n);
  // Happy chains end at the fixed point 1 (next(1) = 1, it never leaves).
  // Unhappy chains are provably trapped in a cycle: one step drives any input
  // below 243, and a bounded sequence must repeat — so this loop always exits.
  while (fast != 1 && slow != fast) {
    // Tortoise: one digit-square-sum step per iteration
    slow = next(slow);
    // Hare: two steps. It gains exactly one position on slow each iteration,
    // so inside a cycle it cannot skip over slow — a meeting is guaranteed.
    fast = next(next(fast));
  }
  // Either fast hit 1 (happy) or the pointers met inside a non-1 cycle (not happy).
  // n = 1 never enters the loop at all: fast = next(1) = 1 from the start.
  return fast == 1;
}

// The "next node" of the implicit list: sum of the squares of the digits of n
private int next(int n) {
  int sum = 0;
  while (n > 0) {
    // Peel off the lowest digit and square it (max sum for a 10-digit int is
    // 10 * 81 = 810, so no overflow anywhere near Integer.MAX_VALUE)
    int d = n % 10;
    sum += d * d;
    // Drop the processed digit — n strictly shrinks, so this loop terminates
    n /= 10;
  }
  return sum;
}`
  },
  {
    num: 123, lc: 383, title: 'Ransom Note', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'String · Counting',
    url: 'https://leetcode.com/problems/ransom-note/',
    approach: 'Letter-frequency counting with a fixed 26-slot int array. First bank the magazine: one pass increments counts[c - \'a\'] for every character, recording how many copies of each letter are available to cut out. Then spend for the note: decrement the matching slot for each ransom-note character, and the instant any count dips below zero the magazine has run out of that letter — return false immediately, no need to look further. The key insight is that only multiplicities matter, not order or position, so two counting passes fully enforce the rule that each magazine letter is used at most once. Because the alphabet is fixed at 26 lowercase letters, the array is genuinely O(1) space and beats a HashMap on constant factors (no hashing, no Integer boxing). A cheap length pre-check — a note longer than the magazine can never be built — short-circuits obvious failures before any counting. Naive alternatives, like rescanning the magazine for every note character or deleting matched characters from a mutable copy, degrade to O(m·n). Building a HashMap<Character, Integer> of counts is the equivalent alternative, and the right reach when the alphabet is unbounded.',
    complexity: 'O(m + n) time (note + magazine) · O(1) space',
    code: `// Worked trace for ransomNote = "aab", magazine = "abb":
//
// Bank phase — count every magazine letter:
//   c    counts after
//   ─────────────────
//   'a'  a:1
//   'b'  a:1 b:1
//   'b'  a:1 b:2
//
// Spend phase — decrement per note letter, fail on any negative:
//   c    before  after  negative?
//   ──────────────────────────────
//   'a'    1       0    no
//   'a'    0      -1    YES → return false
//
// Returns false ("aab" needs two a's; "abb" supplies only one)

public boolean canConstruct(String ransomNote, String magazine) {
  // A note longer than the magazine is impossible by pigeonhole — bail before counting
  if (ransomNote.length() > magazine.length()) return false;
  // Fixed 26-slot table: the problem guarantees lowercase a-z only, so this is O(1)
  // space and avoids the hashing + Integer-boxing overhead of a HashMap
  int[] counts = new int[26];
  // Bank phase: counts[x] = how many unspent copies of letter x the magazine offers
  for (char c : magazine.toCharArray()) {
    counts[c - 'a']++;
  }
  // Spend phase: each note character consumes one banked copy — "used at most once"
  for (char c : ransomNote.toCharArray()) {
    // Dropping below zero means the note demands more copies of c than were banked.
    // Without this check a later surplus of other letters would wrongly mask the deficit.
    if (--counts[c - 'a'] < 0) return false;
  }
  // Every note letter was covered with copies to spare
  return true;
}`
  },
  {
    num: 124, lc: 73, title: 'Set Matrix Zeroes', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Matrix · In-place',
    url: 'https://leetcode.com/problems/set-matrix-zeroes/',
    approach: 'In-place marking that reuses the matrix\'s own first row and first column as the flag arrays. First record in two booleans whether the first row or first column themselves contain a zero — their cells are about to be overloaded as flags, so that information must be captured before it is destroyed. Then scan the interior: every zero at (r, c) stamps a 0 into its row head matrix[r][0] and its column head matrix[0][c]. A second interior pass wipes any cell whose row head or column head is stamped, and finally the two saved booleans decide whether the first row and column themselves get wiped. The key insight making this correct is that a stamped flag is self-consistent — matrix[0][c] == 0 as a flag means column c genuinely must become all zeros, so the flag cell needs no restoring afterward. The truly naive approach of zeroing a row the moment you see a 0 is outright wrong (the freshly written zeros cascade and can wipe the whole matrix), and the safe naive version needs O(m + n) extra boolean arrays just to remember which rows and columns to clear; borrowing the border achieves the same bookkeeping in O(1) extra space. Keeping those explicit O(m + n) marker arrays is the equivalent alternative — same time bound, easier to reason about, and a fine first answer before the constant-space follow-up.',
    complexity: 'O(m·n) time · O(1) space',
    code: `// Worked trace for matrix = [[1,1,1],
//                            [1,0,1],
//                            [1,1,1]]:
//
//   phase             event                        matrix after
//   ─────────────────────────────────────────────────────────────────────────
//   scan first row    no 0 found                   firstRowZero = false
//   scan first col    no 0 found                   firstColZero = false
//   mark (1,1)==0     stamp [1][0]=0, [0][1]=0     [[1,0,1],[0,0,1],[1,1,1]]
//   wipe (1,1)        row head is 0                already 0, unchanged
//   wipe (1,2)        row head is 0                [[1,0,1],[0,0,0],[1,1,1]]
//   wipe (2,1)        col head is 0                [[1,0,1],[0,0,0],[1,0,1]]
//   wipe (2,2)        both heads are 1             unchanged
//   border flags      both false                   first row/col left as-is
//
// matrix ends as [[1,0,1],[0,0,0],[1,0,1]] — modified in place, returns void

public void setZeroes(int[][] matrix) {
  // Constraints guarantee at least 1x1, so matrix[0] is always safe to read
  int m = matrix.length, n = matrix[0].length;
  // The first row and column are about to double as flag storage, which destroys
  // the answer to "did THEY originally contain a zero?" — capture that first.
  boolean firstRowZero = false, firstColZero = false;
  for (int c = 0; c < n; c++) if (matrix[0][c] == 0) firstRowZero = true;
  for (int r = 0; r < m; r++) if (matrix[r][0] == 0) firstColZero = true;

  // Mark pass over the interior: every zero stamps its row head matrix[r][0]
  // and column head matrix[0][c]. Stamping needs no undo because a head being 0
  // is exactly what the final answer demands anyway — that row/column really
  // does contain a zero, so the head cell must end up 0 regardless.
  for (int r = 1; r < m; r++)
    for (int c = 1; c < n; c++)
      if (matrix[r][c] == 0) { matrix[r][0] = 0; matrix[0][c] = 0; }

  // Wipe pass, driven purely by the heads — never by the cells themselves.
  // Reading only the flags is what stops freshly written zeros from cascading
  // into rows/columns that were originally zero-free.
  for (int r = 1; r < m; r++)
    for (int c = 1; c < n; c++)
      if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;

  // Border last: only after the interior wipe is it safe to overwrite the flag
  // cells. Clearing the first row/col any earlier would corrupt the very heads
  // the wipe pass above depends on.
  if (firstRowZero) for (int c = 0; c < n; c++) matrix[0][c] = 0;
  if (firstColZero) for (int r = 0; r < m; r++) matrix[r][0] = 0;
}`
  },
  {
    num: 125, lc: 944, title: 'Delete Columns to Make Sorted', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Scan',
    url: 'https://leetcode.com/problems/delete-columns-to-make-sorted/',
    approach: 'Independent column checks with early exit. Picture the equal-length strings as a grid and ask, for each column j, whether the characters read top to bottom are non-decreasing — the column survives only if strs[i].charAt(j) >= strs[i-1].charAt(j) for every adjacent pair of rows. The key insight is that deletions never interact: removing one column shifts nothing in any other column, so each can be judged in isolation and the answer is simply the count of unsorted columns, with no global reasoning needed. Comparing only adjacent rows suffices because pairwise non-decreasing order chains transitively into a fully sorted column. The moment one pair violates the order the column is condemned, so break immediately — scanning further down that column can only re-confirm the verdict, and forgetting the break would double-count a column with two inversions. A naive alternative that extracts each column into an array and sorts a copy to compare pays O(n log n) per column for information a linear adjacent-pair scan gets for free. Total work is at most one look per grid character: O(n·m) time and O(1) extra space. An equivalent formulation builds each column as a string and checks it against its sorted self, trading the early exit for extra allocations.',
    complexity: 'O(n·m) time (n strings of length m) · O(1) space',
    code: `// Worked trace for strs = ["cba", "daf", "ghi"] — as a grid:
//
//          col0  col1  col2
//   row0    c     b     a
//   row1    d     a     f
//   row2    g     h     i
//
//   j  column (top→bottom)  adjacent checks            verdict  deletions
//   ─────────────────────────────────────────────────────────────────────
//   0  c, d, g              c<=d ok, d<=g ok           keep     0
//   1  b, a, h              a < b at row 1 → break     delete   1
//   2  a, f, i              a<=f ok, f<=i ok           keep     1
//
// Returns 1

public int minDeletionSize(String[] strs) {
  // All strings are guaranteed the same length, so strs[0] safely defines the column count
  int cols = strs[0].length();
  int deletions = 0;
  // Columns are independent: deleting one never reorders another, so judge each in isolation
  for (int j = 0; j < cols; j++) {
    // Compare adjacent rows only — pairwise non-decreasing chains into a fully sorted column.
    // Starting at i = 1 also makes a single-row grid trivially keep every column.
    for (int i = 1; i < strs.length; i++) {
      // One inversion condemns the whole column — count it and stop scanning
      if (strs[i].charAt(j) < strs[i - 1].charAt(j)) {
        deletions++;
        // break, not continue: without it a column with two inversions would count twice
        break;
      }
    }
  }
  // Every column that survived the scan is already non-decreasing top to bottom
  return deletions;
}`
  },
  {
    num: 126, lc: 706, title: 'Design HashMap', d: 'easy', companies: ['Temu', 'Garmin'],
    bucket: 'Arrays & Hashing', category: 'Design · Hashing',
    url: 'https://leetcode.com/problems/design-hashmap/',
    approach: 'Separate chaining over a fixed array of buckets. Map each key to a slot with key % BUCKETS, where every slot holds a small singly linked chain of (key, value) nodes, so colliding keys simply coexist in the same chain and are told apart by comparing stored keys. put must walk the chain BEFORE inserting and overwrite in place if the key exists — blindly prepending would leave two nodes for one key and get could return a stale value forever; a genuinely new key is prepended in O(1). get and remove walk the same single chain, with remove re-linking either the predecessor or the bucket head around the victim node. The key insight is that hashing confines every operation to one bucket while chaining absorbs collisions, so with 10^4 operations spread over 769 slots the chains stay a few nodes long and each op is O(1) on average. The naive alternatives each fail on one axis: a flat array indexed by key is O(1) but burns 10^6+ slots for a handful of entries, while one unsorted list of pairs is compact but makes every operation O(n). A prime bucket count spreads patterned keys (multiples of a stride) more evenly than a power of two would. Open addressing — one flat array probed linearly, with lazy deletion markers — is the equivalent alternative design.',
    complexity: 'O(1) average per op · O(n + b) space (b = 769 buckets)',
    code: `// Worked trace (BUCKETS = 769, so keys 1 and 770 collide: 770 % 769 = 1):
//
//   op            bucket-1 chain after op        returned
//   ─────────────────────────────────────────────────────
//   put(1, 10)    (1,10)                         -
//   put(770, 20)  (770,20) → (1,10)              -
//   get(1)        walk: 770? no, 1? yes          10
//   put(1, 99)    (770,20) → (1,99)  overwrite   -
//   remove(770)   (1,99)   head unlinked         -
//   get(770)      walk: 1? no, chain ends        -1
//
// Final state: get(1) returns 99, get(770) returns -1

class MyHashMap {
  // Prime bucket count spreads patterned keys (e.g. multiples of a stride) more
  // evenly than a power of two — short chains are the whole speed guarantee
  private static final int BUCKETS = 769;
  // One chain head per slot; null means empty. Sized once, never resized — fine
  // here because at most 10^4 ops keep the average chain a handful of nodes.
  private final Node[] table = new Node[BUCKETS];

  // Chain node must store the KEY too, not just the value: colliding keys share
  // a slot and can only be told apart by comparing keys during the walk
  private static class Node {
    int key, value;
    Node next;
    Node(int key, int value) { this.key = key; this.value = value; }
  }

  // Keys are guaranteed 0..10^6 (never negative), so plain % is a safe index
  private int hash(int key) { return key % BUCKETS; }

  public void put(int key, int value) {
    int h = hash(key);
    // Walk the chain FIRST: an existing key must be overwritten in place.
    // Blindly prepending would leave two nodes for one key, and get() could
    // then keep returning the stale older value.
    for (Node cur = table[h]; cur != null; cur = cur.next) {
      if (cur.key == key) { cur.value = value; return; }
    }
    // Genuinely new key — prepend at the head in O(1); order within a chain
    // never matters because lookups scan the whole chain anyway
    Node node = new Node(key, value);
    node.next = table[h];
    table[h] = node;
  }

  public int get(int key) {
    // Only this one bucket can possibly hold the key — the point of hashing
    for (Node cur = table[hash(key)]; cur != null; cur = cur.next) {
      if (cur.key == key) return cur.value;
    }
    // Miss sentinel demanded by the problem; unambiguous because stored
    // values are constrained to be >= 0, so -1 can never be a real value
    return -1;
  }

  public void remove(int key) {
    int h = hash(key);
    // Track the predecessor so the victim can be spliced out of the chain
    Node prev = null;
    for (Node cur = table[h]; cur != null; prev = cur, cur = cur.next) {
      if (cur.key == key) {
        // Head removal has no predecessor — re-point the bucket slot itself
        if (prev == null) table[h] = cur.next;
        // Interior removal: link the predecessor around the victim
        else prev.next = cur.next;
        return;
      }
    }
    // Key absent — remove() is defined as a silent no-op
  }
}`
  },
  {
    num: 127, lc: 432, title: 'All O`one Data Structure', d: 'hard', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Design · DLL + Hash Map',
    url: 'https://leetcode.com/problems/all-oone-data-structure/',
    approach: 'Doubly-linked list of count buckets plus a hash map. Each bucket stores one distinct count and the set of keys currently at that count, and buckets are kept in strictly increasing count order — so head.next is always the minimum bucket and tail.prev the maximum, turning getMinKey/getMaxKey into O(1) peeks. The hash map points each key at its bucket; because inc and dec change a count by exactly ±1, the destination bucket is always the immediate neighbor (reuse it if its count matches, otherwise splice a fresh one in place), and that adjacency is the key insight that makes every move O(1). Emptied buckets are removed on the spot — leaving one behind would break the neighbors-differ-by-reachable-counts invariant and let stale nodes pollute the min/max ends. A naive key→count map gives O(1) inc/dec but forces an O(n) scan for min and max, and a TreeMap keyed by count fixes the scan only by charging O(log n) on every operation. When a key\'s count drops to 0 it leaves the structure entirely, and ties at either extreme may return any qualifying key. An equivalent alternative is the LFU-cache layout — HashMap of count → LinkedHashSet plus explicitly tracked min/max counts — though keeping max correct on dec is fiddlier there.',
    complexity: 'O(1) per operation · O(k) space (k = live keys)',
    code: `// Worked trace for: inc("a"), inc("a"), inc("b"), getMaxKey(), getMinKey(),
//                   dec("a"), getMinKey()
//
//   op            buckets after (min → max)      bucketOf       returned
//   ─────────────────────────────────────────────────────────────────────
//   inc("a")      {1:[a]}                        a→1            -
//   inc("a")      {2:[a]}     (bucket 1 empt.)   a→2            -
//   inc("b")      {1:[b]} {2:[a]}                a→2, b→1       -
//   getMaxKey()   {1:[b]} {2:[a]}                (unchanged)    "a"
//   getMinKey()   {1:[b]} {2:[a]}                (unchanged)    "b"
//   dec("a")      {1:[a,b]}   (bucket 2 empt.)   a→1, b→1       -
//   getMinKey()   {1:[a,b]}                      (unchanged)    "a" (or "b" — tied at count 1, either is valid)

class AllOne {
  // One node per DISTINCT count; all keys sharing that count live in one set.
  // Grouping by count (not one node per key) is what bounds moves to one hop.
  private static class Bucket {
    int count;
    Set<String> keys = new HashSet<>();
    Bucket prev, next;
    Bucket(int count) { this.count = count; }
  }

  // Sentinels dodge every null check: head.next is ALWAYS the min-count bucket,
  // tail.prev ALWAYS the max — that invariant is the whole O(1) min/max trick.
  private final Bucket head = new Bucket(Integer.MIN_VALUE);
  private final Bucket tail = new Bucket(Integer.MAX_VALUE);
  // key → the bucket currently holding it, so inc/dec find their start in O(1)
  private final Map<String, Bucket> bucketOf = new HashMap<>();

  public AllOne() {
    // Empty list is just the two sentinels linked to each other
    head.next = tail;
    tail.prev = head;
  }

  // Splice a brand-new bucket immediately after node — counts along the list
  // stay strictly increasing because callers only insert at the correct spot.
  private Bucket insertAfter(Bucket node, int count) {
    Bucket b = new Bucket(count);
    b.prev = node;
    b.next = node.next;
    node.next.prev = b;
    node.next = b;
    return b;
  }

  // Unlink a drained bucket right away; a lingering empty node at either end
  // would make getMinKey/getMaxKey report a count no key actually has.
  private void removeIfEmpty(Bucket b) {
    if (!b.keys.isEmpty()) return;
    b.prev.next = b.next;
    b.next.prev = b.prev;
  }

  public void inc(String key) {
    Bucket cur = bucketOf.get(key);
    if (cur == null) {
      // Brand-new key enters at count 1, i.e. at the minimum end of the list.
      // Reuse the first bucket only if it is EXACTLY count 1; otherwise a new
      // count-1 bucket goes right after head so ordering stays intact.
      Bucket first = head.next;
      Bucket target = (first != tail && first.count == 1) ? first : insertAfter(head, 1);
      target.keys.add(key);
      bucketOf.put(key, target);
    } else {
      // count+1 can only live in the immediate next node (counts are strictly
      // increasing), so this is a one-hop move — never a search.
      Bucket next = cur.next;
      Bucket target = (next != tail && next.count == cur.count + 1)
          ? next : insertAfter(cur, cur.count + 1);
      target.keys.add(key);
      bucketOf.put(key, target);
      // Pull the key out of its old bucket AFTER placing it, then reap the
      // old bucket if that was its last occupant.
      cur.keys.remove(key);
      removeIfEmpty(cur);
    }
  }

  public void dec(String key) {
    // Problem guarantees dec is only called on keys that exist
    Bucket cur = bucketOf.get(key);
    if (cur.count == 1) {
      // 1 → 0 means the key leaves the structure entirely, not "count 0"
      bucketOf.remove(key);
    } else {
      // Mirror of inc: count-1 can only be the immediate previous node
      Bucket prev = cur.prev;
      Bucket target = (prev != head && prev.count == cur.count - 1)
          ? prev : insertAfter(cur.prev, cur.count - 1);
      target.keys.add(key);
      bucketOf.put(key, target);
    }
    cur.keys.remove(key);
    removeIfEmpty(cur);
  }

  public String getMaxKey() {
    // tail.prev IS the max bucket by invariant; only the empty structure
    // (sentinels adjacent) needs the "" fallback
    return tail.prev == head ? "" : tail.prev.keys.iterator().next();
  }

  public String getMinKey() {
    // Symmetric: head.next is the min bucket, any member of it qualifies
    return head.next == tail ? "" : head.next.keys.iterator().next();
  }
}`
  },
  {
    num: 128, lc: 1455, title: 'Check If a Word Occurs As a Prefix of Any Word in a Sentence', d: 'easy', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Scan',
    url: 'https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence/',
    approach: 'Split the sentence on single spaces and linearly scan the words, returning the 1-indexed position of the first word where words[i].startsWith(searchWord) holds. The key insight is that a prefix match must be ANCHORED at a word start — the naive sentence.indexOf(searchWord) is outright wrong, not just slow, because it happily matches in the middle of a word (e.g. finding \'ell\' inside \'hello\'), which is exactly the trap the problem sets. startsWith already returns false when searchWord is longer than the word, so no explicit length guard is needed, and full equality counts as a prefix too. Returning on the first hit guarantees the minimal index the problem demands. Splitting is safe because the input promises exactly one space between words and no leading or trailing spaces, so no empty tokens appear. An equivalent split-free variant walks the raw sentence tracking word starts with indexOf(\' \') and compares characters in place for O(1) extra space; a regex match on (^| ) + searchWord is another equivalent formulation.',
    complexity: 'O(n) time · O(n) space (split array)',
    code: `// Worked trace for sentence = "i love eating burger", searchWord = "burg":
//
//   i  words[i]   startsWith("burg")?   action
//   ────────────────────────────────────────────────────
//   0  "i"        no                    keep scanning
//   1  "love"     no                    keep scanning
//   2  "eating"   no                    keep scanning
//   3  "burger"   yes                   return 3 + 1 = 4
//
// Returns 4

public int isPrefixOfWord(String sentence, String searchWord) {
  // The problem guarantees single spaces between words and none at the ends,
  // so a plain split(" ") yields exactly the word list — no empty tokens to filter.
  String[] words = sentence.split(" ");
  for (int i = 0; i < words.length; i++) {
    // startsWith anchors the match to the word START — a raw indexOf over the whole
    // sentence would falsely match searchWord buried mid-word ("ell" in "hello").
    // It also returns false when searchWord is longer than the word, so no length guard.
    if (words[i].startsWith(searchWord)) {
      // First hit wins, satisfying the "minimal index" rule; convert the 0-indexed
      // loop counter to the 1-indexed position the problem asks for.
      return i + 1;
    }
  }
  // Scanned every word and none had searchWord as a prefix
  return -1;
}`
  },
  {
    num: 129, lc: 2109, title: 'Adding Spaces to a String', d: 'medium', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Two Pointers',
    url: 'https://leetcode.com/problems/adding-spaces-to-a-string/',
    approach: 'Merge-style two pointers over the string and the spaces array. Walk i across s while a second pointer j watches the next pending space index; whenever spaces[j] == i, append a space before appending s.charAt(i) and advance j. The key insight is that spaces is guaranteed strictly increasing, so both pointers only ever move forward and one left-to-right sweep consumes everything — no searching, sorting, or lookup structure needed. Build into a StringBuilder pre-sized to s.length() + spaces.length so the buffer never reallocates mid-append. The naive alternative — calling insert() at each index on a mutable string — shifts everything after the cut right on every insertion, an O(n) cost per space that turns the whole job quadratic and times out at 3·10^5 characters with 3·10^5 spaces; looped String concatenation dies the same way. Checking the space BEFORE appending the character is what makes spaces[j] == 0 (a space in front of the very first character) fall out naturally instead of needing a special case. An equivalent alternative is to allocate a char[n + m] up front and arraycopy the segments between consecutive space indices, dropping a space after each — same linear cost, just more index arithmetic.',
    complexity: 'O(n + m) time · O(n + m) space (output)',
    code: `// Worked trace for s = "abcde", spaces = [0, 2]:
//
//   i  s[i]  j  spaces[j]  space first?   sb after
//   ────────────────────────────────────────────────
//   0  'a'   0     0       yes  (j→1)     " a"
//   1  'b'   1     2       no             " ab"
//   2  'c'   1     2       yes  (j→2)     " ab c"
//   3  'd'   2     —       no (j done)    " ab cd"
//   4  'e'   2     —       no (j done)    " ab cde"
//
// Returns " ab cde"   (leading space because spaces[0] = 0)

public String addSpaces(String s, int[] spaces) {
  // Pre-size to the exact final length: every original char plus one space per
  // entry in spaces. Skipping this forces repeated grow-and-copy on huge inputs.
  StringBuilder sb = new StringBuilder(s.length() + spaces.length);
  // j = the next unconsumed space position. spaces is strictly increasing, so a
  // single forward-only pointer is enough — the two scans merge in one pass.
  int j = 0;
  for (int i = 0; i < s.length(); i++) {
    // A space belongs BEFORE the char at index i, so test before appending the
    // char — that ordering is what makes spaces[j] == 0 (leading space) just work.
    // The j < spaces.length guard prevents overrun once all spaces are placed.
    if (j < spaces.length && spaces[j] == i) {
      sb.append(' ');
      j++;
    }
    // The original character always comes through unchanged, space or not
    sb.append(s.charAt(i));
  }
  // Constraint spaces[k] <= s.length() - 1 guarantees every space was consumed
  return sb.toString();
}`
  },
  {
    num: 130, lc: 2825, title: 'Make String a Subsequence Using Cyclic Increments', d: 'medium', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'String · Two Pointers',
    url: 'https://leetcode.com/problems/make-string-a-subsequence-using-cyclic-increments/',
    approach: 'Two pointers in one greedy pass. The operation reads "at most once", but it applies to any SET of indices simultaneously, so it collapses to a per-position choice: every character of str1 independently offers exactly two letters — itself or its cyclic successor (\'z\' wraps to \'a\'). Walk str1 with pointer i and str2 with pointer j; whenever str1.charAt(i) equals str2.charAt(j) either directly or after one cyclic bump, consume str2[j] by advancing j, and advance i regardless. Matching at the earliest eligible position is safe by the standard subsequence exchange argument: deferring a match only shrinks the suffix of str1 left for the remaining characters of str2, so greed can never turn a winnable case into a loss. If j reaches the end of str2, every character found an in-order partner and the answer is true. Naive alternatives are hopeless or wasteful — enumerating the 2^n index subsets is exponential, and a DP over (i, j) states spends O(n·m) work on a decision the greedy resolves locally in O(1); note also that no "operation used?" flag is needed, since selecting the empty set covers the do-nothing case. An equivalent alternative is a memoized recursive subsequence check over (i, j) with the same two-letter matching rule — identical logic, just with the exchange argument replaced by explicit state exploration.',
    complexity: 'O(n + m) time · O(1) space',
    code: `// Worked trace for str1 = "zc", str2 = "ad":
//
//   i  str1[i]  cyclic +1  str2[j]  match?             j after
//   ────────────────────────────────────────────────────────────
//   0    'z'      'a'        'a'    yes (wrap z → a)     1
//   1    'c'      'd'        'd'    yes (increment)      2
//
// j == str2.length() == 2, all of str2 matched — Returns true

public boolean canMakeSubsequence(String str1, String str2) {
  // j = next unmatched char of str2; driving it to m is the whole goal
  int j = 0, m = str2.length();
  // Single left-to-right pass over str1; bail early once str2 is fully consumed
  for (int i = 0; i < str1.length() && j < m; i++) {
    char c = str1.charAt(i);
    // The ONLY two letters this position can ever offer: itself, or one cyclic
    // step up. The % 26 is what wraps 'z' to 'a' — drop it and "zc" vs "ad" fails.
    char bumped = (char) ('a' + (c - 'a' + 1) % 26);
    // Greedy: take the earliest position able to match str2[j]. Waiting for a
    // later match only shrinks the str1 suffix left for the rest of str2
    // (exchange argument), so this can never miss a valid selection of indices.
    if (c == str2.charAt(j) || bumped == str2.charAt(j)) {
      j++;   // str2[j] matched — hunt for the next character
    }
    // No match: i still advances — a subsequence may skip str1 chars freely
  }
  // True iff every str2 char found an in-order partner. No used-operation flag:
  // the one operation covers ANY set of indices (empty set = no-op), so each
  // match independently chose raw vs +1 above.
  return j == m;
}`
  },
  {
    num: 131, lc: 1072, title: 'Flip Columns For Maximum Number of Equal Rows', d: 'medium', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Matrix · Hash Map',
    url: 'https://leetcode.com/problems/flip-columns-for-maximum-number-of-equal-rows/',
    approach: 'Canonical-form hashing. A column flip toggles the same position in every row at once, so the relative pattern between two rows is frozen — two rows can end up all-equal under the same flip set exactly when they are already identical or exact bit-complements of each other. That collapses the problem to counting: normalize each row into a canonical key by XOR-ing every cell with the row\'s first element (rows starting with 1 get fully complemented, so every key begins with 0), tally the keys in a hash map, and the answer is the largest bucket. Rows sharing a key really are jointly fixable: flip precisely the columns where the canonical pattern holds a 1 and each of them becomes all-0s or all-1s. Brute force over column subsets is exponential (2^n choices), and even comparing every pair of rows costs O(m² · n) — the canonical hash needs just one O(m·n) sweep. The always-≥-1 edge case falls out for free, since any single row is equalizable by flipping its own 1-columns. An equivalent alternative keys each row on min(pattern, complement) as a string or bitset — same complement-classes, different normalization.',
    complexity: 'O(m·n) time · O(m·n) space',
    code: `// Worked trace for matrix = [[0,0,0],[0,0,1],[1,1,0]]:
//
//   row       row[0]  canonical key   count after       best
//   ──────────────────────────────────────────────────────────
//   [0,0,0]     0        "000"        {000:1}            1
//   [0,0,1]     0        "001"        {000:1, 001:1}     1
//   [1,1,0]     1        "001"        {000:1, 001:2}     2
//
// [0,0,1] and [1,1,0] are exact complements — flipping column 2 turns
// them into [0,0,0] and [1,1,1], both uniform.
//
// Returns 2

public int maxEqualRowsAfterFlips(int[][] matrix) {
  // Bucket counter: canonical pattern → how many rows share it.
  // Every row in one bucket can be made uniform by the SAME flip set.
  Map<String, Integer> count = new HashMap<>();
  int best = 0;
  for (int[] row : matrix) {
    // XOR mask taken from the row's own first cell: rows starting with 1 get
    // fully complemented. This maps a row and its exact complement to the same
    // key — and complement-or-identical is precisely "equalizable together".
    int flip = row[0];
    // String key keeps the map hashable and cheap; n <= 300 so length is tiny
    StringBuilder key = new StringBuilder(row.length);
    for (int cell : row) {
      // cell ^ flip leaves the row untouched when it starts with 0 and inverts
      // it otherwise, so every canonical key begins with 0 by construction
      key.append(cell ^ flip);
    }
    // merge returns the bucket's new size, so the running max updates inline —
    // no second pass over the map needed at the end
    // METHOD REFERENCE (lambda shorthand): Integer::sum means (a, b) -> a + b — the
    // remap function merge() applies when the key exists (else it inserts 1).
    // Without it:
    //   int v = count.getOrDefault(key.toString(), 0) + 1;
    //   count.put(key.toString(), v);
    //   best = Math.max(best, v);
    best = Math.max(best, count.merge(key.toString(), 1, Integer::sum));
  }
  // Largest complement-class wins; always >= 1 because a lone row is trivially
  // fixable by flipping exactly its 1-columns
  return best;
}`
  },
  {
    num: 132, lc: 3356, title: 'Zero Array Transformation II', d: 'medium', companies: ['Garmin'],
    bucket: 'Arrays & Hashing', category: 'Difference Array · Binary Search',
    url: 'https://leetcode.com/problems/zero-array-transformation-ii/',
    approach: 'Binary search on the answer k, with a difference array powering each feasibility check. The key observation is that a query decrements each covered index by AT MOST val, chosen independently per index — so the first k queries can zero the array iff, for every i, the summed val of the queries covering i is at least nums[i]; ordering and interaction between queries are irrelevant. That coverage test is monotone: an extra query never shrinks any index\'s budget, so if k queries suffice then k+1 do too — exactly the structure binary search needs. To test one k, replay the first k queries into a difference array (+val at l, -val at r+1), prefix-sum it into per-index budgets, and compare against nums, costing O(n + k) instead of touching every element of every range. Naively simulating queries one at a time and rescanning the array after each is O(q · n), hopeless at 10^5 × 10^5; the diff array kills the per-range cost and the binary search kills the linear scan over k. Check first that ALL q queries are enough, returning -1 immediately if not, so the search always has a feasible right endpoint. An equivalent alternative is a single left-to-right sweep that lazily consumes queries in order only when the running budget at index i falls short of nums[i], which is O(n + q) with the same difference array.',
    complexity: 'O((n + q) log q) time · O(n) space',
    code: `// Worked trace for nums = [2, 0, 2], queries = [[0,2,1], [0,2,1], [1,1,3]]:
//
// canZero(k): build diff from the first k queries, prefix-sum into avail[i]
// (total decrement budget at i), require avail[i] >= nums[i] at every i.
//
//   k   diff[0..3]        avail      vs nums [2,0,2]     feasible?
//   ─────────────────────────────────────────────────────────────────
//   3   [+2, +3, -3, -2]  [2, 5, 2]  2>=2, 5>=0, 2>=2    yes → search runs
//   1   [+1,  0,  0, -1]  [1, 1, 1]  1 < 2 at i = 0      no  → lo = 2
//   2   [+2,  0,  0, -2]  [2, 2, 2]  all covered         yes → hi = 2
//
//   Binary search: lo=0, hi=3 → mid=1 infeasible → lo=2;
//                  mid=2 feasible → hi=2; lo == hi, stop.
//
// Returns 2

public int minZeroArray(int[] nums, int[][] queries) {
  // If even ALL q queries can't cover nums, no prefix can either — bail now
  // so the binary search's invariant "hi is always feasible" holds from the start.
  if (!canZero(nums, queries, queries.length)) return -1;
  // Smallest-feasible-k search. lo starts at 0 on purpose: an already-all-zero
  // nums needs no queries, and the problem asks for the minimum NON-NEGATIVE k.
  int lo = 0, hi = queries.length;
  while (lo < hi) {
    // Overflow-safe midpoint (harmless here, but the idiomatic habit)
    int mid = lo + (hi - lo) / 2;
    // Monotonicity makes halving valid: extra queries only ADD budget, so
    // feasible(mid) implies the answer is mid or to its left; infeasible
    // implies it is strictly to the right.
    if (canZero(nums, queries, mid)) hi = mid;
    else lo = mid + 1;
  }
  // lo == hi is the first k where feasibility flips to true
  return lo;
}

// Can the first k queries zero out nums? Since each query decrements covered
// indices by AT MOST val (amount chosen per index), order never matters —
// index i is fixable iff its total available budget >= nums[i].
private boolean canZero(int[] nums, int[][] queries, int k) {
  int n = nums.length;
  // Difference array: +val at l, -val at r+1 marks an entire range in O(1)
  // instead of O(r-l+1). Size n+1 so the r+1 write never needs a bounds check.
  int[] diff = new int[n + 1];
  for (int j = 0; j < k; j++) {
    diff[queries[j][0]] += queries[j][2];
    diff[queries[j][1] + 1] -= queries[j][2];
  }
  // Prefix-sum the diff: budget = total decrement available at index i.
  // Max possible is 10^5 queries × val <= 5 = 5·10^5, so int can't overflow.
  int budget = 0;
  for (int i = 0; i < n; i++) {
    budget += diff[i];
    // Index i can drop by at most budget; if that's short of nums[i] it can
    // never reach 0, and one stuck index sinks this whole prefix of queries.
    if (budget < nums[i]) return false;
  }
  return true;
}`
  },
  // ─── Two Pointers (11) ───
  {
    num: 201, lc: 58, title: 'Length of Last Word', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'String · Scan',
    url: 'https://leetcode.com/problems/length-of-last-word/',
    approach: 'Scan backwards from the end of the string with two short loops and no allocation. The first loop skips trailing spaces, because the input is allowed to end in whitespace and the "last word" is the last run of non-space characters, not whatever sits at the final index. Once a non-space is found, record that position as the word\'s end and run a second loop backwards until the next space or the start of the string; the pointer now rests one slot before the word, so end - i is exactly the length. The reverse direction is the whole trick — a forward scan would have to keep resetting a counter at every boundary and remember the last completed run, which is more state and more edge cases. The obvious one-liner s.trim().split(" ") is correct but allocates a trimmed copy plus an array of every word just to read the last one, which is O(n) extra space against this solution\'s O(1). No guard for an all-space string is needed here (the constraints promise at least one non-space character), but the same code degrades gracefully anyway: i would fall to -1, end would stay -1, and the result would be 0.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = "   fly me   to   the moon  "
//
//   phase                     i lands on            value
//   ──────────────────────────────────────────────────────
//   skip trailing spaces      index 25 ('n')        end = 25
//   walk back over the word   index 21 (' ')        i = 21
//   return end - i                                  25 - 21 = 4
//
// Returns 4 ("moon")

public int lengthOfLastWord(String s) {
  int i = s.length() - 1;
  // The input may end in spaces, so slide past them first. Without this the
  // "last word" would be measured as an empty run sitting at the final index.
  while (i >= 0 && s.charAt(i) == ' ') {
    i--;
  }
  // i is now the last character OF the word — remember it before we move on
  int end = i;
  // Walk left until we fall off the front of the word (a space or the string
  // start). i stops one slot BEFORE the word, which is what makes the
  // subtraction below come out to the length with no +1 correction.
  while (i >= 0 && s.charAt(i) != ' ') {
    i--;
  }
  return end - i;
}`
  },
  {
    num: 202, lc: 523, title: 'Continuous Subarray Sum', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Prefix Sum + Hash Map',
    url: 'https://leetcode.com/problems/continuous-subarray-sum/',
    approach: 'Prefix sums taken modulo k, with a hash map remembering where each remainder was first seen. The identity doing the work is that the sum of nums[j+1..i] is prefix[i] - prefix[j], so that slice is a multiple of k exactly when prefix[i] and prefix[j] leave the same remainder mod k. That converts "find a subarray summing to a multiple of k" into "find two prefix positions sharing a remainder" — one pass, no nested loop. Two details carry the whole solution. First, only the FIRST index of each remainder is stored and never overwritten: keeping the earliest sighting maximises the span to any later match, which matters because the problem demands a subarray of length at least two. Second, the map is seeded with remainder 0 at index -1, standing for the empty prefix, so a subarray starting at index 0 that is itself a multiple of k is found without a special case. The length check i - seen >= 2 is what rejects a single element that happens to be divisible by k. The brute-force alternative — every start paired with every end — is O(n^2) and times out at the 10^5 input ceiling.',
    complexity: 'O(n) time · O(min(n, k)) space',
    code: `// Worked trace for nums = [23, 2, 4, 6, 7], k = 6
//
//   i   nums[i]   running sum   sum % 6   map before        action
//   ────────────────────────────────────────────────────────────────────
//   -    -         -            0         {}                seed 0 -> -1
//   0    23        23           5         {0:-1}            store 5 -> 0
//   1    2         25           1         {0:-1, 5:0}       store 1 -> 1
//   2    4         29           5         {0:-1, 5:0, 1:1}  5 seen at 0,
//                                                           2 - 0 = 2 >= 2 -> true
//
// Returns true (the slice [2, 4] sums to 6)

public boolean checkSubarraySum(int[] nums, int k) {
  // remainder -> the EARLIEST index whose prefix sum left that remainder.
  // Earliest, never overwritten, so any later match spans as far as possible.
  Map<Integer, Integer> firstIndex = new HashMap<>();
  // Seed the empty prefix: before consuming anything the running sum is 0.
  // Index -1 makes a qualifying subarray that starts at index 0 come out with
  // length i - (-1) = i + 1, with no special-casing.
  firstIndex.put(0, -1);

  int running = 0;
  for (int i = 0; i < nums.length; i++) {
    // Only the remainder matters, so reduce as we go and keep the value small
    running = (running + nums[i]) % k;
    Integer seen = firstIndex.get(running);
    if (seen != null) {
      // Same remainder twice means the slice between them cancels to a
      // multiple of k. Length must be at least 2, which is what rules out a
      // lone element that happens to be divisible by k.
      if (i - seen >= 2) {
        return true;
      }
      // Deliberately NOT updating the map here — the earlier index is
      // strictly more useful, since it can only produce longer spans.
    } else {
      firstIndex.put(running, i);
    }
  }
  return false;
}`
  },
  {
    num: 203, lc: 249, title: 'Group Shifted Strings', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'String · Hash Map',
    url: 'https://leetcode.com/problems/group-shifted-strings/',
    approach: 'Bucket the strings by a canonical key that is invariant under shifting. Shifting advances every character by the same amount, so while the letters change, the GAP between consecutive letters does not — "abc" and "xyz" both have the gap sequence (1, 1). Building that gap sequence and using it as a hash-map key groups every member of a shift family together in one pass. The subtlety is wrap-around: "az" has gaps (25) going forward, while "ba" computes 1 - 2 = -1, and those two really are in the same family ("az" shifted by one is "ba"). Adding 26 to any negative difference folds the alphabet into a ring and makes both keys read 25. Gaps must also be separated by a delimiter in the key string — without it (1, 12) and (11, 2) would both flatten to "112" and collide into a false group. Single-character strings produce an empty key and therefore all land in one bucket, which is correct: any letter can be shifted into any other. Comparing every pair of strings directly would be O(n^2 · L); keying is O(n · L).',
    complexity: 'O(n · L) time · O(n · L) space',
    code: `// Worked trace for strings = ["abc", "bcd", "az", "ba", "acef"]
//
//   string   consecutive gaps (mod 26)   key      bucket
//   ─────────────────────────────────────────────────────────
//   "abc"    b-a=1, c-b=1                "1,1,"   A
//   "bcd"    c-b=1, d-c=1                "1,1,"   A
//   "az"     z-a=25                      "25,"    B
//   "ba"     a-b=-1 -> +26 = 25          "25,"    B   <- wrap-around
//   "acef"   c-a=2, e-c=2, f-e=1         "2,2,1," C
//
// Returns [["abc","bcd"], ["az","ba"], ["acef"]] (group order is arbitrary)

public List<List<String>> groupStrings(String[] strings) {
  Map<String, List<String>> groups = new HashMap<>();
  for (String s : strings) {
    groups.computeIfAbsent(shiftKey(s), k -> new ArrayList<>()).add(s);
  }
  return new ArrayList<>(groups.values());
}

/**
 * Canonical form of a shift family: the gaps between consecutive letters,
 * which shifting leaves untouched. A one-character string yields "", so all
 * single letters group together — correct, since any letter shifts to any other.
 */
private String shiftKey(String s) {
  StringBuilder key = new StringBuilder();
  for (int i = 1; i < s.length(); i++) {
    int diff = s.charAt(i) - s.charAt(i - 1);
    // Fold the alphabet into a ring so "az" (gap 25) and "ba" (gap -1) agree
    if (diff < 0) {
      diff += 26;
    }
    // The comma is load-bearing: without it gaps (1,12) and (11,2) would both
    // render as "112" and be wrongly merged into the same group.
    key.append(diff).append(',');
  }
  return key.toString();
}`
  },
  {
    num: 204, lc: 1583, title: 'Count Unhappy Friends', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Simulation',
    url: 'https://leetcode.com/problems/count-unhappy-friends/',
    approach: 'Flip the preference LISTS into a preference RANK table, then check the unhappiness condition directly. As given, preferences[x] is an ordered list, so asking "does x prefer u to y?" means scanning that list for both names — O(n) per question, and the definition asks it a quadratic number of times. Inverting once up front into rank[x][u] = position of u in x\'s list turns every such question into a single array comparison, since a smaller rank means more preferred. With that table the definition transcribes literally: x is unhappy if some u exists with rank[x][u] < rank[x][partner[x]] (x would rather have u) and rank[u][x] < rank[u][partner[u]] (u would rather have x). The pairing array is likewise flattened from the pairs list into partner[], so a friend\'s current match is an O(1) lookup instead of a search. Breaking out of the inner loop on the first witness matters for correctness of the COUNT, not just speed — the problem counts unhappy people, not unhappy pairings, so a friend with three willing defectors must still be counted once.',
    complexity: 'O(n^2) time · O(n^2) space',
    code: `// Worked trace for n = 4,
//   preferences = [[1,2,3], [3,2,0], [3,1,0], [1,2,0]],
//   pairs = [[0,1], [2,3]]
//
//   rank table (lower = liked more)      partner[]
//     rank[0] = {1:0, 2:1, 3:2}            0 <-> 1
//     rank[1] = {3:0, 2:1, 0:2}            2 <-> 3
//     rank[2] = {3:0, 1:1, 0:2}
//     rank[3] = {1:0, 2:1, 0:2}
//
//   x=1 (paired with 0): try u=3 -> rank[1][3]=0 < rank[1][0]=2 yes,
//                        and rank[3][1]=0 < rank[3][2]=1 yes  -> 1 is unhappy
//   x=3 (paired with 2): try u=1 -> rank[3][1]=0 < rank[3][2]=1 yes,
//                        and rank[1][3]=0 < rank[1][0]=2 yes  -> 3 is unhappy
//   x=0, x=2: no witness found
//
// Returns 2

public int unhappyFriends(int n, int[][] preferences, int[][] pairs) {
  // Invert each preference LIST into a rank LOOKUP: rank[i][j] is how far down
  // i's list friend j sits, so "i prefers a to b" is just rank[i][a] < rank[i][b].
  // Paying O(n^2) once here removes an O(n) scan from every later comparison.
  int[][] rank = new int[n][n];
  for (int i = 0; i < n; i++) {
    for (int p = 0; p < preferences[i].length; p++) {
      rank[i][preferences[i][p]] = p;
    }
  }

  // Flatten the pair list so a friend's current match is an O(1) lookup
  int[] partner = new int[n];
  for (int[] pair : pairs) {
    partner[pair[0]] = pair[1];
    partner[pair[1]] = pair[0];
  }

  int unhappy = 0;
  for (int x = 0; x < n; x++) {
    int y = partner[x];
    for (int u = 0; u < n; u++) {
      // x can't defect to itself or to the partner it already has
      if (u == x || u == y) {
        continue;
      }
      int v = partner[u];
      // Mutual regret: x ranks u above its own partner, AND u ranks x above its own
      if (rank[x][u] < rank[x][y] && rank[u][x] < rank[u][v]) {
        unhappy++;
        // Stop at the first witness — the problem counts unhappy PEOPLE, so a
        // friend with several willing defectors must still only add one.
        break;
      }
    }
  }
  return unhappy;
}`
  },
  {
    num: 205, lc: 3355, title: 'Zero Array Transformation I', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Difference Array',
    url: 'https://leetcode.com/problems/zero-array-transformation-i/',
    approach: 'The freedom hidden in the problem statement collapses it to a counting question. Each query [l, r] lets you decrement ANY subset of the indices in that range by one, so a query is best read as handing one optional decrement to every index it covers. Index i can therefore be driven to zero exactly when the number of queries covering it is at least nums[i], and because the subsets are chosen independently per index there is no interaction between positions — the whole array is zeroable iff that inequality holds everywhere. What remains is computing coverage counts, and a difference array does it in O(n + q) instead of the O(n · q) of literally walking each range: record +1 at l and -1 at r+1, then a running prefix sum over that array reconstructs the count at every index. The extra slot in diff exists purely so r + 1 = n is a legal write rather than an out-of-bounds crash. Sorting or heaps are unnecessary here; the counts are all the information the decision needs.',
    complexity: 'O(n + q) time · O(n) space',
    code: `// Worked trace for nums = [4, 3, 2, 1], queries = [[1,3], [0,2]]
//
//   diff after both queries:  [+1, +1, 0, -1, -1]
//                               0   1  2   3   4
//
//   i   diff[i]   running coverage   nums[i]   coverage >= nums[i]?
//   ──────────────────────────────────────────────────────────────
//   0    +1              1              4       1 >= 4  -> NO
//
// Returns false (index 0 needs 4 decrements but only 1 query covers it)

public boolean isZeroArray(int[] nums, int[][] queries) {
  int n = nums.length;
  // One extra slot so a query ending at the last index can safely write its
  // closing -1 at r + 1 == n without a bounds check.
  int[] diff = new int[n + 1];

  // Mark range boundaries only — O(1) per query instead of walking the range.
  for (int[] query : queries) {
    diff[query[0]]++;
    diff[query[1] + 1]--;
  }

  int cover = 0;
  for (int i = 0; i < n; i++) {
    // Prefix-summing the difference array reconstructs how many queries cover i
    cover += diff[i];
    // Each covering query offers index i at most one decrement, and the subsets
    // are chosen independently per index — so i is zeroable iff it is covered
    // at least nums[i] times. One failure anywhere sinks the whole array.
    if (cover < nums[i]) {
      return false;
    }
  }
  return true;
}`
  },
  {
    num: 206, lc: 3380, title: 'Maximum Area Rectangle With Point Constraints I', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Geometry · Hash Set',
    url: 'https://leetcode.com/problems/maximum-area-rectangle-with-point-constraints-i/',
    approach: 'With at most ten points the input size licenses honest brute force, and the interesting part is getting the geometry predicate exactly right. Every axis-parallel rectangle is pinned down by its bottom-left and top-right corners, so nominating each ordered pair of points as those two corners enumerates all candidates; requiring x1 < x2 and y1 < y2 both fixes the orientation and throws out degenerate zero-area cases in one test. The other two corners are then forced to be (x1, y2) and (x2, y1), and a hash set of packed coordinates confirms in O(1) whether those points actually exist. The validity rule is the part that bites: no other point may lie inside the rectangle OR on its border, so the containment test uses inclusive bounds on all four sides, and the four corners themselves must be explicitly excluded before that test or every rectangle would reject itself. Packing the pair into a single long key avoids allocating boxed objects or relying on a string concat that could confuse (1, 23) with (12, 3). Returning -1 when nothing qualifies is the specified answer for "no valid rectangle".',
    complexity: 'O(n^3) time · O(n) space',
    code: `// Worked trace for points = [[1,1], [1,3], [3,1], [3,3], [2,2]]
//
//   corners (1,1) & (3,3): partners (1,3) and (3,1) both present,
//                          but (2,2) lies strictly inside      -> rejected
//   no other pair forms a complete rectangle
//
// Returns -1
//
// Without the interior point [2,2] the same corners would give area
// (3-1) * (3-1) = 4.

public int maxRectangleArea(int[][] points) {
  int n = points.length;
  int best = -1;

  // Pack each point into one long so membership is an O(1) hash-set probe.
  // A long beats a "x + "," + y" string key: no allocation, and no chance of
  // (1,23) and (12,3) colliding on a sloppy concatenation.
  Set<Long> present = new HashSet<>();
  for (int[] p : points) {
    present.add(key(p[0], p[1]));
  }

  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      int x1 = points[i][0], y1 = points[i][1];
      int x2 = points[j][0], y2 = points[j][1];
      // Fix i as bottom-left and j as top-right. The strict inequalities also
      // discard degenerate pairs that would enclose zero area.
      if (x1 >= x2 || y1 >= y2) {
        continue;
      }
      // The remaining two corners are forced — both must be real points
      if (!present.contains(key(x1, y2)) || !present.contains(key(x2, y1))) {
        continue;
      }

      boolean clean = true;
      for (int[] p : points) {
        // Skip the four corners themselves, or every rectangle would fail the
        // border test below against its own corner points.
        if ((p[0] == x1 || p[0] == x2) && (p[1] == y1 || p[1] == y2)) {
          continue;
        }
        // Inclusive bounds on all four sides: the problem forbids other points
        // ON the border as well as strictly inside.
        if (p[0] >= x1 && p[0] <= x2 && p[1] >= y1 && p[1] <= y2) {
          clean = false;
          break;
        }
      }

      if (clean) {
        best = Math.max(best, (x2 - x1) * (y2 - y1));
      }
    }
  }
  return best;
}

/** Pack two ints into one long: x in the high 32 bits, y in the low 32. */
private long key(int x, int y) {
  return ((long) x << 32) ^ (y & 0xffffffffL);
}`
  },
  {
    num: 207, lc: 1346, title: 'Check If N and Its Double Exist', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Set',
    url: 'https://leetcode.com/problems/check-if-n-and-its-double-exist/',
    approach: 'One pass with a hash set of everything seen so far, checking both directions at each element. The relationship is asymmetric — we need some pair where one value is twice the other — and since we do not know which of the two arrives first, each new value v asks two questions of the set: has 2*v already appeared (v is the smaller half), and has v/2 already appeared (v is the double). Testing both means a single left-to-right pass suffices; checking only one direction would need a second pass in reverse. The v % 2 == 0 guard before the halving test is essential, because integer division silently truncates and would let an odd value like 7 spuriously match a stored 3. Zero deserves a moment\'s thought: it satisfies 0 == 2 * 0, and the definition requires two DISTINCT indices, so a single zero must not trigger. It does not here — the set is probed before v is inserted, so the first zero finds nothing and only a second zero matches. Negative values need no special handling since doubling is sign-preserving and Java\'s % returns 0 for even negatives. Sorting plus binary search is O(n log n); this is O(n).',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for arr = [10, 2, 5, 3]
//
//   v    seen before probe   2*v in seen?   v even & v/2 in seen?   result
//   ───────────────────────────────────────────────────────────────────────
//   10   {}                  20 no          5 no                    continue
//   2    {10}                4  no          1 no                    continue
//   5    {10, 2}             10 YES         -                       -> true
//
// Returns true (10 == 2 * 5)

public boolean checkIfExist(int[] arr) {
  Set<Integer> seen = new HashSet<>();
  for (int v : arr) {
    // Probe BEFORE inserting v. That ordering is what makes a lone 0 fail
    // correctly: 0 == 2 * 0, but the problem demands two distinct indices, so
    // only a second 0 may match the first.
    //
    // Both directions are tested because we don't know whether the smaller or
    // the larger half of the pair shows up first in the array.
    if (seen.contains(v * 2)) {
      return true;
    }
    // The parity guard is not optional: integer division truncates, so without
    // it a value of 7 would probe for 3 and falsely match a stored 3.
    if (v % 2 == 0 && seen.contains(v / 2)) {
      return true;
    }
    seen.add(v);
  }
  return false;
}`
  },
  {
    num: 208, lc: 1200, title: 'Minimum Absolute Difference', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Array · Sorting',
    url: 'https://leetcode.com/problems/minimum-absolute-difference/',
    approach: 'Sort, then read off adjacent gaps. The key observation is that in sorted order the closest pair must be neighbours: if two values are separated by any third value lying between them, that third value is strictly closer to each of them, so a non-adjacent pair can never be the minimum. That single fact reduces the O(n^2) pairwise search to one linear scan after sorting. The scan does discovery and collection at once rather than in two passes: whenever a strictly smaller gap appears, the accumulated answer list is cleared because everything gathered so far is now beaten; whenever the gap equals the running best, the pair is appended. Writing the comparison as separate if statements (rather than if/else) is deliberate — after a clear, the same iteration must still record the pair that caused it. Sorting also gives the required output ordering for free, since pairs are emitted left to right with the smaller element first. Total cost is dominated by the sort.',
    complexity: 'O(n log n) time · O(n) space',
    code: `// Worked trace for arr = [4, 2, 1, 3]  ->  sorted [1, 2, 3, 4]
//
//   i   pair     gap   best before   action
//   ─────────────────────────────────────────────────────────
//   1   (1,2)     1    MAX_VALUE     smaller -> clear, best = 1, add (1,2)
//   2   (2,3)     1    1             equal   -> add (2,3)
//   3   (3,4)     1    1             equal   -> add (3,4)
//
// Returns [[1,2], [2,3], [3,4]]

public List<List<Integer>> minimumAbsDifference(int[] arr) {
  // After sorting, the closest pair is guaranteed to be adjacent: any value
  // sitting between two others is strictly nearer to both, so a non-adjacent
  // pair can never win. That collapses the O(n^2) pair search to one scan.
  Arrays.sort(arr);

  int best = Integer.MAX_VALUE;
  List<List<Integer>> out = new ArrayList<>();

  for (int i = 1; i < arr.length; i++) {
    int gap = arr[i] - arr[i - 1];   // sorted, so this is already non-negative
    if (gap < best) {
      // A new record invalidates everything collected so far
      best = gap;
      out.clear();
    }
    // Separate 'if', not 'else if' — after a clear, the pair that set the new
    // record still has to be recorded on this very iteration.
    if (gap == best) {
      out.add(List.of(arr[i - 1], arr[i]));
    }
  }
  return out;
}`
  },
  {
    num: 209, lc: 325, title: 'Maximum Size Subarray Sum Equals k', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Prefix Sum + Hash Map',
    url: 'https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/',
    approach: 'Running prefix sums plus a hash map from sum to its earliest index. Because sum(j+1..i) = prefix[i] - prefix[j], a subarray ending at i totals k exactly when the value prefix[i] - k has been seen as an earlier prefix; one map probe per position replaces the inner loop of the O(n^2) scan. Two decisions make it correct. The map is seeded with sum 0 at index -1 to represent the empty prefix, so a qualifying subarray that begins at index 0 is found naturally instead of through a special case. And insertion uses putIfAbsent so each prefix value keeps its FIRST index — since we want the LONGEST subarray, the earliest left endpoint is always at least as good, and overwriting would silently shorten answers. Note the contrast with sliding-window techniques: negative numbers are allowed here, so the prefix sums are not monotonic and a two-pointer window would be invalid. The accumulator is a long because up to 10^5 elements of magnitude 10^4 can overflow an int, and the map is keyed by Long to match.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for nums = [1, -1, 5, -2, 3], k = 3
//
//   i   nums[i]   running   need (running-k)   found at   length   best
//   ─────────────────────────────────────────────────────────────────────
//   -    -          0        -                  seed 0 -> -1        0
//   0    1          1        -2                 no                  0
//   1   -1          0        -3                 no (0 kept at -1)   0
//   2    5          5         2                 no                  0
//   3   -2          3         0                 index -1   4        4
//   4    3          6         3                 index 3    1        4
//
// Returns 4 (the subarray [1, -1, 5, -2])

public int maxSubArrayLen(int[] nums, int k) {
  // prefix sum -> EARLIEST index achieving it. Earliest matters because we
  // want the longest span, and an earlier left endpoint can only help.
  Map<Long, Integer> firstIndex = new HashMap<>();
  // The empty prefix: sum 0 "occurs" just before index 0. Without this seed a
  // subarray starting at index 0 would need its own special case.
  firstIndex.put(0L, -1);

  long running = 0;   // long: 10^5 elements of size 10^4 overflows an int
  int best = 0;

  for (int i = 0; i < nums.length; i++) {
    running += nums[i];
    // If some earlier prefix equalled running - k, the slice between them
    // sums to exactly k. Note this works with negative values, where a
    // sliding window would not — prefix sums here are not monotonic.
    Integer start = firstIndex.get(running - k);
    if (start != null) {
      best = Math.max(best, i - start);
    }
    // putIfAbsent, never put: overwriting would move the left endpoint right
    // and quietly shrink every future answer.
    firstIndex.putIfAbsent(running, i);
  }
  return best;
}`
  },
  {
    num: 210, lc: 3371, title: 'Identify the Largest Outlier in an Array', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Map · Enumeration',
    url: 'https://leetcode.com/problems/identify-the-largest-outlier-in-an-array/',
    approach: 'Turn the structure into an equation, then enumerate the one unknown. The array holds n-2 special numbers, one element equal to their sum, and one outlier. Writing S for the total of the specials, the whole array sums to S (specials) + S (the sum element) + outlier, so total = 2S + outlier, and therefore outlier = total - 2S. Since S is exactly the value of the sum element, every distinct array value can be TRIED as that sum element and the corresponding outlier computed in O(1) — no subset search is needed, which is what makes this tractable. The validity check is where care is required: the computed outlier must actually appear in the array at a DIFFERENT position than the element playing the sum role. Frequency counting handles that cleanly — normally one occurrence suffices, but when the outlier and the sum element happen to be equal in value, two separate occurrences are required. Iterating the distinct keys rather than the raw array avoids re-testing duplicates. The answer is guaranteed to exist, so the running maximum is always overwritten at least once.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for nums = [2, 3, 5, 10]
//   total = 20
//
//   try as sum element   outlier = total - 2*sum   present?           best
//   ─────────────────────────────────────────────────────────────────────
//   2                    20 - 4  = 16              no                 -
//   3                    20 - 6  = 14              no                 -
//   5                    20 - 10 = 10              yes (once)         10
//   10                   20 - 20 = 0               no                 10
//
// Returns 10  (specials {2,3}, their sum 5, outlier 10)

public int getLargestOutlier(int[] nums) {
  int total = 0;
  Map<Integer, Integer> count = new HashMap<>();
  for (int v : nums) {
    total += v;
    count.merge(v, 1, Integer::sum);
  }

  int best = Integer.MIN_VALUE;
  // total = (sum of specials) + (the sum element) + outlier, and the sum
  // element IS the sum of the specials — so total = 2 * sumElement + outlier.
  // That lets us test each distinct value as the sum element in O(1) instead
  // of searching subsets. Iterating keys, not the array, skips duplicate work.
  for (int sumElement : count.keySet()) {
    int outlier = total - 2 * sumElement;
    // The outlier must occupy a different index than the sum element. Usually
    // one occurrence is enough — but if the two happen to share a VALUE, the
    // array must contain it twice for them to be distinct elements.
    int needed = (outlier == sumElement) ? 2 : 1;
    if (count.getOrDefault(outlier, 0) >= needed) {
      best = Math.max(best, outlier);
    }
  }
  return best;
}`
  },
  {
    num: 19, lc: 125, title: 'Valid Palindrome', d: 'easy', companies: ['Garmin'],
    bucket: 'Two Pointers', category: 'String',
    url: 'https://leetcode.com/problems/valid-palindrome/',
    approach: 'Two pointers converging from both ends. Place one pointer at the front and one at the back. The insight is that a palindrome requires mirror characters to match, so we compare the outermost relevant pair and walk inward. Before each comparison we skip any non-alphanumeric characters by advancing the appropriate pointer, so punctuation and spaces never participate; comparisons are done after lowercasing to ignore case. If any mirrored pair differs we can return false immediately; if the pointers meet or cross, all pairs matched. Each pointer only ever moves toward the center, so total work is O(n) time with O(1) extra space — strictly better than building a cleaned, reversed copy and comparing, which would cost O(n) extra space.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = "A man, a plan, a canal: Panama":
//
//   l→char  r→char   compare (lowercased)   result
//   ──────────────────────────────────────────────────────
//   'A'     'a'      a == a                  ok, l++ r--
//   ' '     skip     skip space on left      l++
//   'm'     'm'      m == m                  ok, l++ r--
//   'a'     'a'      a == a                  ok ...
//    ... continues; every mirrored pair matches ...
//   pointers meet in the middle → no mismatch found
//
// Returns true

public boolean isPalindrome(String s) {
  int l = 0, r = s.length() - 1;
  while (l < r) {
    // Skip past punctuation/spaces — the problem only cares about alphanumerics
    while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
    while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
    // Case-insensitive comparison of the mirrored pair
    if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
      return false;   // a single mismatch disproves the palindrome
    }
    // Pair matched → step both pointers inward
    l++; r--;
  }
  return true;   // pointers met without any mismatch
}`
  },
  {
    num: 20, lc: 167, title: 'Two Sum II - Input Array Is Sorted', d: 'medium',
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    approach: 'Two pointers from both ends, exploiting the sorted order. Start one pointer at the smallest value and one at the largest and look at their sum. The key insight: because the array is sorted, if the sum is too small the only way to increase it is to advance the left pointer (the right is already the max available), and if the sum is too large the only way to decrease it is to retreat the right pointer; no candidate pair is ever skipped by this monotonic narrowing. When the sum equals the target we have the unique answer and return the 1-based indices. This runs in O(n) time and, crucially, O(1) extra space, whereas the hash-map approach for the unsorted Two Sum would need O(n) space, which the sorted-array constraint here forbids.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for numbers = [2, 7, 11, 15], target = 9:
//
//   l  r  numbers[l]  numbers[r]  sum  vs target  action
//   ──────────────────────────────────────────────────────────
//   0  3  2           15          17   > 9          r-- (too big)
//   0  2  2           11          13   > 9          r-- (too big)
//   0  1  2           7           9    == 9         return {1, 2}
//
// Returns [1, 2]   (1-indexed)

public int[] twoSum(int[] numbers, int target) {
  // Sorted input lets us bisect from both ends instead of using a hash map
  int l = 0, r = numbers.length - 1;
  while (l < r) {
    int sum = numbers[l] + numbers[r];
    // Found it — convert 0-based positions to the 1-based answer the problem wants
    if (sum == target) return new int[]{ l + 1, r + 1 };
    // Too small? Move left up to gain a larger value. Too big? Move right down.
    if (sum < target) l++; else r--;
  }
  // Problem guarantees a solution, so this is only a fallback
  return new int[0];
}`
  },
  {
    num: 21, lc: 15, title: '3Sum', d: 'medium', companies: ['Garmin'],
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/3sum/',
    approach: 'Sort plus two pointers, reducing 3Sum to repeated 2Sum on a sorted array. After sorting, fix the first element nums[i] and search the remaining suffix for a pair summing to -nums[i] using two pointers that converge from both ends: if the running sum is negative move left up for a larger value, if positive move right down for a smaller one, and on a hit record the triplet. Sorting is what makes both the pointer movement and the deduplication possible: we skip a fixed i equal to its predecessor, and after a hit we skip over equal l and r values, so identical triplets are never emitted. The fixed element costs O(n) and each inner two-pointer scan is O(n), giving O(n²) time, dominating the O(n log n) sort; space is O(1) beyond the output since sorting is in place. This beats the O(n³) brute-force triple loop.',
    complexity: 'O(n²) time · O(1) extra (sorting in place)',
    code: `// Worked trace for nums = [-1, 0, 1, 2, -1, -4]:
//
//   after sort: [-4, -1, -1, 0, 1, 2]
//
//   i  nums[i]  l  r  sum            action
//   ──────────────────────────────────────────────────────────────
//   0  -4       1  5  -4-1+2 = -3    sum<0 → l++
//   0  -4       2  5  -4-1+2 = -3    sum<0 → l++ ... none works
//   1  -1       2  5  -1-1+2 =  0    hit! add [-1,-1,2], skip dups
//   1  -1       3  4  -1+0+1 =  0    hit! add [-1,0,1]
//   2  -1       (nums[2]==nums[1]) → skip duplicate i
//   3  0        4  5   0+1+2 =  3    sum>0 → r-- ... none works
//
// Returns [[-1,-1,2], [-1,0,1]]

public List<List<Integer>> threeSum(int[] nums) {
  Arrays.sort(nums);   // sorting unlocks the two-pointer pattern + dedup logic
  List<List<Integer>> result = new ArrayList<>();
  for (int i = 0; i < nums.length - 2; i++) {
    // Skip duplicate "i" — same first element would just produce duplicate triples
    if (i > 0 && nums[i] == nums[i-1]) continue;
    // Two pointers over the suffix, hunting for a pair summing to -nums[i]
    int l = i + 1, r = nums.length - 1;
    while (l < r) {
      int sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;          // need bigger sum → move left up
      else if (sum > 0) r--;     // need smaller sum → move right down
      else {
        // Exact zero → record the triplet
        result.add(List.of(nums[i], nums[l], nums[r]));
        // Skip duplicate "l" and "r" before moving — avoids emitting duplicate triples
        while (l < r && nums[l] == nums[l+1]) l++;
        while (l < r && nums[r] == nums[r-1]) r--;
        l++; r--;
      }
    }
  }
  return result;
}`
  },
  {
    num: 22, lc: 11, title: 'Container With Most Water', d: 'medium', companies: ['Garmin'],
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    approach: 'Two pointers from the two ends, greedily shrinking the width. Start with the widest possible container and compute its area as width times the shorter wall. The crucial insight is which side to move inward: the area is capped by the shorter line, so moving the taller line inward keeps the same height cap while strictly reducing width, which can never help; only moving the shorter line gives a chance at a taller bounding wall that might offset the lost width. Therefore we always advance the pointer at the shorter line, and by discarding it we provably skip no better container that used it (any such pair would be narrower yet still capped by that same short line). A single linear sweep gives O(n) time and O(1) space, replacing the O(n²) brute force over all pairs.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for height = [1, 8, 6, 2, 5, 4, 8, 3, 7]:
//
//   l  r  h[l] h[r]  min  width  area  best  move
//   ──────────────────────────────────────────────────────────
//   0  8  1    7      1    8      8     8     h[l]<h[r] → l++
//   1  8  8    7      7    7      49    49    h[l]≥h[r] → r--
//   1  7  8    3      3    6      18    49    r--
//   1  6  8    8      8    5      40    49    h[l]≥h[r] → r--
//   1  5  8    4      4    4      16    49    r--
//   ... remaining moves never exceed 49 ...
//
// Returns 49

public int maxArea(int[] height) {
  // Widest container first; shrink width only when it might raise the cap
  int l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    // Water height is bounded by the SHORTER wall
    int h = Math.min(height[l], height[r]);
    best = Math.max(best, h * (r - l));
    // KEY: moving the taller side can only make width shorter without lifting the cap.
    // Moving the shorter side is the only way to potentially raise it.
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`
  },
  {
    num: 23, lc: 42, title: 'Trapping Rain Water', d: 'hard',
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/trapping-rain-water/',
    approach: 'Two pointers with running side maxima, computing trapped water in one pass. Water above any bar is bounded by min(maxLeft, maxRight) for that bar; the insight that makes O(1) space possible is that we don\'t need both full prefix arrays simultaneously. We keep lMax and rMax and always advance from the shorter side: if height[l] < height[r] then rMax (whatever it is) already exceeds height[r] > height[l], so lMax alone is the true binding constraint on the left bar and water there is lMax - height[l]; symmetrically on the right. We update the running max when we hit a new local high (it traps nothing itself) and otherwise add the difference. One linear scan gives O(n) time and O(1) space, beating the O(n) space prefix-max-array method and the O(n²) per-bar scan.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for height = [0,1,0,2,1,0,1,3,2,1,2,1]  (answer 6):
//
//   l  r  h[l] h[r]  lMax rMax  add   water
//   ──────────────────────────────────────────────────────────
//   0 11  0    1     0    0     -      0     h[l]<h[r]; h[l]≥lMax → lMax=0, l++
//   1 11  1    1     1    0     -      0     tie→right; h[r]≥rMax → rMax=1, r--
//   1 10  1    2     1    1     -      0     h[l]<h[r]; new lMax? no, 1≥1 lMax=1, l++
//   2 10  0    2     1    1     +1     1     h[l]<h[r]; 0<lMax → water += 1-0
//   ... continues, accumulating the remaining trapped units ...
//
// Returns 6

public int trap(int[] height) {
  // Two pointers; lMax/rMax track the tallest wall seen from each side so far
  int l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    // Always work from the shorter side — its running max is the binding constraint
    if (height[l] < height[r]) {
      // If we found a new local high on the left, it can hold no water itself
      if (height[l] >= lMax) lMax = height[l];
      // Otherwise water above this bar is bounded by lMax (left wall guaranteed
      // and right wall ≥ height[r] ≥ lMax)
      else water += lMax - height[l];
      l++;
    } else {
      // Mirror logic on the right side
      if (height[r] >= rMax) rMax = height[r];
      else water += rMax - height[r];
      r--;
    }
  }
  return water;
}`
  },
  {
    num: 24, lc: 26, title: 'Remove Duplicates from Sorted Array', d: 'easy',
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
    approach: 'Two pointers with a slow write index and a fast read index (in-place compaction). Because the array is sorted, every duplicate of a value sits directly next to it, so a value is new exactly when it differs from the element immediately before it. The slow pointer write marks where the next unique value should land, while the fast pointer i scans every element; whenever nums[i] differs from nums[i-1] we copy it to nums[write] and advance write. This overwrites duplicates with the still-growing unique prefix without any auxiliary array. The first element is always unique, so write starts at 1. One pass yields O(n) time and O(1) extra space, and the final write value is exactly the count k of distinct elements.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]:
//
//   i  nums[i]  nums[i-1]  new?  write  array prefix (0..write-1)
//   ─────────────────────────────────────────────────────────────────
//   1  0        0          no    1      [0]
//   2  1        0          yes   2      [0,1]
//   3  1        1          no    2      [0,1]
//   4  1        1          no    2      [0,1]
//   5  2        1          yes   3      [0,1,2]
//   6  2        2          no    3      [0,1,2]
//   7  3        2          yes   4      [0,1,2,3]
//   8  3        3          no    4      [0,1,2,3]
//   9  4        3          yes   5      [0,1,2,3,4]
//
// Returns 5

public int removeDuplicates(int[] nums) {
  if (nums.length == 0) return 0;   // empty array has zero unique values
  int write = 1;   // first element is always unique, so it stays in place
  for (int i = 1; i < nums.length; i++) {
    // Sorted input → a duplicate is always adjacent to the previous kept value,
    // so a value differing from its predecessor is the next unique element
    if (nums[i] != nums[i - 1]) nums[write++] = nums[i];
  }
  return write;   // write == count of distinct elements (k)
}`
  },

  {
    num: 133, lc: 344, title: 'Reverse String', d: 'easy', companies: ['Garmin'],
    bucket: 'Two Pointers', category: 'String · Two Pointers',
    url: 'https://leetcode.com/problems/reverse-string/',
    approach: 'Two pointers converging from opposite ends of the array. Keep a left index at 0 and a right index at the last position; swap the characters they point at, then move both inward, stopping as soon as they meet or cross. The key insight is that reversing is pure mirroring: position i must end up holding what position n-1-i held, so one swap fixes TWO positions at once and the loop runs only n/2 times. Doing it with swaps means no second array is ever allocated, which matters because the problem explicitly demands in-place modification with O(1) extra memory — building a reversed copy (or leaning on StringBuilder.reverse()) answers a different, easier question. The strict left < right condition also handles odd lengths for free: the middle character is its own mirror image and is correctly left untouched. Single-character arrays never enter the loop, so no special-casing is needed. An equivalent alternative is a single for-loop over i from 0 to n/2 swapping s[i] with s[n-1-i], or a recursive helper that swaps the outermost pair — same idea, but recursion burns O(n) stack and forfeits the O(1)-space guarantee.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = ['h','e','l','l','o']:
//
//   step  left  right  swap                array after
//   ──────────────────────────────────────────────────────
//   1      0     4     'h' <-> 'o'         [o, e, l, l, h]
//   2      1     3     'e' <-> 'l'         [o, l, l, e, h]
//   3      2     2     left < right fails  loop exits
//
// s is now ['o','l','l','e','h'] — reversed in place (method returns void)

public void reverseString(char[] s) {
  // Two pointers pinned to the opposite ends — every element gets touched exactly once
  int left = 0;
  int right = s.length - 1;
  // Strict < is the point: when the pointers meet (odd length) the middle char is its
  // own mirror and needs no swap. It also makes length-1 input a natural no-op, and
  // stopping at the meet is the habit that keeps other in-place problems from
  // double-processing elements once the pointers cross.
  while (left < right) {
    // Classic three-step swap — no new array is allocated, which is exactly what the
    // problem's O(1) extra memory requirement forbids a reversed-copy solution from doing
    char tmp = s[left];
    s[left] = s[right];
    s[right] = tmp;
    // One swap settles BOTH ends, so shrinking the window from both sides at once
    // is why the loop body executes only n/2 times
    left++;
    right--;
  }
  // Nothing to return: the contract is mutating the caller's array in place
}`
  },
  {
    num: 134, lc: 88, title: 'Merge Sorted Array', d: 'easy',
    bucket: 'Two Pointers', category: 'Array · Two Pointers',
    url: 'https://leetcode.com/problems/merge-sorted-array/',
    approach: 'Three pointers merging from the back. Read pointers i and j sit on the last real elements of nums1 and nums2, and a write pointer k sits on the last slot of nums1\'s buffer; each step copies the larger of the two tail values into k and retreats that side. The key insight is that the spare room lives at the END of nums1, so filling largest-first means k always stays ahead of i (k = i + j + 1, and j >= 0 inside the loop), and the write can never clobber a nums1 value that hasn\'t been read yet — that invariant is what makes the merge safe in-place. A front-to-back merge would trample unread nums1 elements unless you first copy them to an O(m) scratch array, and the lazy fix of dumping nums2 in and sorting costs O((m+n) log(m+n)). Looping only while j >= 0 is enough: once nums2 is drained, any leftover nums1 prefix is already sorted and already sitting in its final position. The i >= 0 guard handles m = 0 (or nums1 exhausting early) by draining the rest of nums2 without reading nums1[-1]. An equivalent alternative is to copy nums1\'s first m elements into an auxiliary array and forward-merge into nums1 — same O(m+n) time, but O(m) extra space.',
    complexity: 'O(m + n) time · O(1) space',
    code: `// Worked trace for nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3:
//
//   step  i  nums1[i]  j  nums2[j]  k   bigger tail  write         nums1 after
//   ───────────────────────────────────────────────────────────────────────────
//    1    2     3      2     6      5   nums2        nums1[5] = 6  [1,2,3,0,0,6]
//    2    2     3      1     5      4   nums2        nums1[4] = 5  [1,2,3,0,5,6]
//    3    2     3      0     2      3   nums1        nums1[3] = 3  [1,2,3,3,5,6]
//    4    1     2      0     2      2   tie -> nums2 nums1[2] = 2  [1,2,2,3,5,6]
//    5    j = -1: nums2 drained; leftover [1,2] already sits in place, stop
//
// nums1 ends as [1,2,2,3,5,6] (void method — mutating nums1 IS the answer)

public void merge(int[] nums1, int m, int[] nums2, int n) {
  // Read cursors on the LAST real element of each array — indices m..m+n-1
  // of nums1 are padding zeros, not data, so i must start at m-1, not length-1
  int i = m - 1;
  int j = n - 1;
  // Write cursor on the final slot of the buffer. Filling from the back is the
  // whole trick: the free space is at the tail, so the writer starts in it.
  int k = m + n - 1;
  // Only nums2 running dry ends the work: whatever remains of nums1 is already
  // sorted AND already in its final position, so it never needs to move.
  while (j >= 0) {
    // Guard i >= 0 first: when m = 0 or nums1's reads are exhausted, we must
    // keep draining nums2 without touching nums1[-1]
    if (i >= 0 && nums1[i] > nums2[j]) {
      // nums1's tail is strictly larger — it belongs at slot k. Safe because
      // k = i + j + 1 > i while j >= 0, so we never overwrite an unread value.
      nums1[k--] = nums1[i--];
    } else {
      // nums2's tail wins (ties land here too — equal values, either is fine)
      nums1[k--] = nums2[j--];
    }
  }
  // No return: the problem wants nums1 mutated in place
}`
  },
  {
    num: 135, lc: 27, title: 'Remove Element', d: 'easy',
    bucket: 'Two Pointers', category: 'Array · Two Pointers',
    url: 'https://leetcode.com/problems/remove-element/',
    approach: 'Overwrite-forward two pointers: a read pointer scans every element while a write pointer marks the next slot to fill with a keeper. Whenever nums[read] != val, copy it into nums[write] and advance write; when it equals val, just walk past it — the unwanted value gets overwritten by a later keeper or stranded in the ignored tail. The invariant that makes this correct: at every step nums[0..write-1] holds exactly the non-val elements seen so far, in their original order, so when the scan ends write IS the answer k. Because write can never pass read, each copy lands on a slot the read pointer has already consumed, so no keeper is ever destroyed. The naive alternative — shifting the whole remaining array left on every removal — degrades to O(n²) when val is frequent, and allocating a second array violates the O(1)-extra-space requirement. Copying an element onto itself when no vals have been skipped yet is harmless, so no guard is needed. An equivalent alternative when removals are rare: swap nums[read] with the last unprocessed element and shrink from the right, minimizing writes at the cost of scrambling order.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [3, 2, 2, 3], val = 3:
//
//   read  nums[read]  == val?  action                 write  nums after
//   ─────────────────────────────────────────────────────────────────────
//    0        3        yes     skip                     0    [3,2,2,3]
//    1        2        no      nums[0]=2, write→1       1    [2,2,2,3]
//    2        2        no      nums[1]=2, write→2       2    [2,2,2,3]
//    3        3        yes     skip                     2    [2,2,2,3]
//
// Returns 2 — the first 2 slots hold [2, 2]; the tail is never read by the judge

public int removeElement(int[] nums, int val) {
  // Next slot to fill with a kept element. Invariant: nums[0..write-1] is exactly
  // the non-val elements seen so far, in original order — so at the end, write IS k.
  int write = 0;
  for (int read = 0; read < nums.length; read++) {
    // Only keepers earn a copy; val occurrences are simply walked past, which is
    // what "removes" them — they get overwritten later or left beyond index k-1.
    if (nums[read] != val) {
      // Safe even when write == read (a harmless self-copy): write never passes
      // read, so the target slot has always already been consumed by the scan.
      nums[write] = nums[read];
      // Grow the kept region by one; this counter doubles as the return value
      write++;
    }
  }
  // Falls out naturally for the edge cases: empty array and all-val both return 0
  return write;
}`
  },
  {
    num: 136, lc: 977, title: 'Squares of a Sorted Array', d: 'easy',
    bucket: 'Two Pointers', category: 'Array · Two Pointers',
    url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
    approach: 'Two pointers converging from both ends while the output fills from the back. Squaring breaks the sorted order because negatives flip magnitude — -4 comes before 3 in the input, yet 16 > 9 after squaring. The rescuing insight: in a sorted array the LARGEST square must live at one of the two ends (most-negative left or most-positive right), so compare the end squares, write the bigger into the last unfilled slot, and step that pointer inward. Each round claims the maximum of what remains, so the array fills back-to-front already in ascending order with no sort at all. It must fill from the back because the minimum square hides somewhere in the middle near the sign change, while the maximum is always exposed at an end. The naive square-everything-then-sort works but costs O(n log n) and throws away the sortedness the problem hands you. An equivalent alternative locates the negative/positive boundary first and merges the two halves outward, exactly like the merge step of merge sort.',
    complexity: 'O(n) time · O(n) space (output)',
    code: `// Worked trace for nums = [-4, -1, 0, 3, 10]:
//
//   pos  left  right  leftSq  rightSq  bigger  result after write
//   ──────────────────────────────────────────────────────────────
//    4    0     4       16      100    right   [ _,  _, _,  _, 100]
//    3    0     3       16        9    left    [ _,  _, _, 16, 100]
//    2    1     3        1        9    right   [ _,  _, 9, 16, 100]
//    1    1     2        1        0    left    [ _,  1, 9, 16, 100]
//    0    2     2        0        0    right   [ 0,  1, 9, 16, 100]
//
// Returns [0, 1, 9, 16, 100]

public int[] sortedSquares(int[] nums) {
  int n = nums.length;
  // Separate output array — the answer is built largest-first, so it can't be done
  // in place without clobbering values the pointers still need to read.
  int[] result = new int[n];
  // The input is sorted, so the biggest SQUARE must sit at an end: the most
  // negative value squares huge on the left, the largest positive on the right.
  int left = 0, right = n - 1;
  // Write position walks from the last slot down. Back-to-front is forced: we can
  // always identify the remaining MAXIMUM (it's at an end), never the minimum
  // (the smallest square hides mid-array, near the sign change).
  for (int pos = n - 1; pos >= 0; pos--) {
    // |nums[i]| <= 10^4, so the square <= 10^8 — comfortably fits in an int
    int leftSq = nums[left] * nums[left];
    int rightSq = nums[right] * nums[right];
    if (leftSq > rightSq) {
      // Left end holds the current maximum square — claim it, move inward
      result[pos] = leftSq;
      left++;
    } else {
      // Ties can go either way safely; folding them right keeps one branch.
      // This branch also handles the final step when left == right.
      result[pos] = rightSq;
      right--;
    }
  }
  // Every slot written exactly once, largest to smallest → ascending order
  return result;
}`
  },
  {
    num: 137, lc: 680, title: 'Valid Palindrome II', d: 'easy', companies: ['Garmin'],
    bucket: 'Two Pointers', category: 'String · Two Pointers',
    url: 'https://leetcode.com/problems/valid-palindrome-ii/',
    approach: 'Two pointers with a single forgiveness fork. Walk left and right pointers inward from both ends; while the characters match the string is behaving like a palindrome and there is nothing to decide. At the FIRST mismatch, the one allowed deletion must remove one of the two clashing characters — deleting any other index leaves this mismatched pair intact — so the whole decision space collapses to exactly two candidates: skip s[left] or skip s[right]. Run a plain strict-palindrome scan on each remaining window and return true if either passes. That collapse is what makes the greedy correct: no backtracking, no trying deletions at other positions. The naive alternative — delete every index in turn and re-check the whole string — costs O(n²) and wastes n − 2 attempts that cannot possibly fix the pair already found. Each helper scan covers at most the remaining window once, so the total is O(n) time and O(1) space. A recursive version that threads a remaining-deletions budget k is the equivalent alternative and generalizes directly to Valid Palindrome III.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = "abca":
//
//   left  right  s[left]  s[right]  match?  action
//   ─────────────────────────────────────────────────────────────
//    0      3       a        a      yes     shrink: left=1, right=2
//    1      2       b        c      no      fork on the mismatch
//
//   fork 1: skip s[left]  -> strict check of window 2..2 ("c") -> left >= right, palindrome -> true
//   fork 2: skip s[right] -> never runs, || short-circuits on fork 1
//
// Returns true

public boolean validPalindrome(String s) {
  // Converging pointers, one at each end of the string
  int left = 0, right = s.length() - 1;
  while (left < right) {
    // A mismatch is the only place a deletion can help — and it MUST remove
    // one of these two characters, or the pair would still clash afterwards.
    if (s.charAt(left) != s.charAt(right)) {
      // Exactly two candidates: drop s[left] or drop s[right]. If either
      // leftover window reads as a clean palindrome, one deletion sufficed.
      return isPalindrome(s, left + 1, right) || isPalindrome(s, left, right - 1);
    }
    // Matched pair — locked in on both sides, shrink the window
    left++;
    right--;
  }
  // Pointers met (or crossed) with no mismatch: already a palindrome, zero deletions
  return true;
}

// Strict palindrome check on s[left..right] — the deletion budget is spent,
// so any mismatch here means one removal was not enough.
private boolean isPalindrome(String s, int left, int right) {
  while (left < right) {
    // Second clashing pair overall — a single deletion cannot fix two pairs
    if (s.charAt(left) != s.charAt(right)) return false;
    left++;
    right--;
  }
  return true;
}`
  },
  // ─── Sliding Window (11) ───
  {
    num: 211, lc: 408, title: 'Valid Word Abbreviation', d: 'easy',
    bucket: 'Two Pointers', category: 'String · Two Pointers',
    url: 'https://leetcode.com/problems/valid-word-abbreviation/',
    approach: 'Two independent pointers walking word and abbr, each advancing by whatever the abbreviation says. When abbr shows a letter the comparison is direct and both pointers step by one; when it shows a digit run, the run is parsed into a number and the word pointer jumps that many characters while the abbr pointer skips the digits. Parsing the full run rather than one digit at a time is required — "12" means skip twelve, not skip one then skip two. Two rules decide most wrong answers. A digit run may not begin with 0, since a zero-length skip is meaningless and "01" would offer two spellings of the same abbreviation; rejecting it on sight is simpler than post-validation. And the final check must confirm that BOTH pointers landed exactly at the end: an abbreviation that decodes to a prefix of the word, or that overruns it, is invalid, and testing only one pointer would let one of those through. The overrun case needs no explicit bounds check because a jump past the end simply fails the loop guard and then fails the equality test. No allocation is involved, so the space cost is the two indices.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for word = "internationalization", abbr = "i12iz4n"
//
//   abbr piece   action                          i (word)   j (abbr)
//   ────────────────────────────────────────────────────────────────
//   'i'          matches word[0]                    1          1
//   "12"         skip 12 characters                13          3
//   'i'          matches word[13]                  14          4
//   'z'          matches word[14]                  15          5
//   '4'          skip 4 characters                 19          6
//   'n'          matches word[19]                  20          7
//
//   both pointers ended exactly at their lengths -> valid
//
// Returns true

public boolean validWordAbbreviation(String word, String abbr) {
  int i = 0;   // position in word
  int j = 0;   // position in abbr

  while (i < word.length() && j < abbr.length()) {
    char c = abbr.charAt(j);
    if (Character.isDigit(c)) {
      // A leading zero is invalid by definition — a zero-length skip is
      // meaningless, and allowing it would give "01" and "1" two spellings
      // of the same abbreviation. Reject on sight rather than after parsing.
      if (c == '0') {
        return false;
      }
      // Consume the WHOLE digit run: "12" means skip twelve characters,
      // not skip one and then skip two.
      int skip = 0;
      while (j < abbr.length() && Character.isDigit(abbr.charAt(j))) {
        skip = skip * 10 + (abbr.charAt(j) - '0');
        j++;
      }
      // May shoot past the end of word — that needs no bounds check here,
      // the loop guard stops us and the final equality test rejects it.
      i += skip;
    } else {
      if (word.charAt(i) != c) {
        return false;
      }
      i++;
      j++;
    }
  }

  // BOTH must land exactly at the end. Checking only one would accept an
  // abbreviation that decodes to a mere prefix, or that runs off the end.
  return i == word.length() && j == abbr.length();
}`
  },
  {
    num: 212, lc: 18, title: '4Sum', d: 'medium',
    bucket: 'Two Pointers', category: 'Array · Two Pointers',
    url: 'https://leetcode.com/problems/4sum/',
    approach: 'Sort, fix the outer two indices with nested loops, then collapse the inner two with the classic opposing-pointer sweep. Sorting is what makes the sweep valid: with lo and hi bracketing the remaining range, a sum below target can only be repaired by taking a larger value, so lo advances, and a sum above target sends hi back — each step discards a whole band of pairs that cannot work, giving O(n) for the innermost layer and O(n^3) overall instead of the O(n^4) of four nested loops. Duplicate suppression is the part that actually decides whether a submission passes, and it happens in three places: the two outer loops skip a value identical to the one just processed (guarded by i > 0 and j > i + 1 so the FIRST occurrence is always kept), and after recording a hit both inner pointers slide past their repeated neighbours. Getting this right is what lets the code return distinct quadruplets without a de-duplicating set. The sum is accumulated in a long because four values near the 10^9 bound overflow int arithmetic — a real and commonly missed failure, since the overflow silently flips the comparison and sends the pointers the wrong way.',
    complexity: 'O(n^3) time · O(1) extra space (excluding output)',
    code: `// Worked trace for nums = [1, 0, -1, 0, -2, 2], target = 0
//   sorted -> [-2, -1, 0, 0, 1, 2]
//
//   i (val)   j (val)   lo..hi walk                       recorded
//   ─────────────────────────────────────────────────────────────────────
//   0 (-2)    1 (-1)    (0,2) sum -1 <0, (0,2) sum 0     [-2,-1,1,2]
//   0 (-2)    2 (0)     (0,2) sum 0                      [-2,0,0,2]
//   0 (-2)    3 (0)     skipped — nums[3] == nums[2]
//   1 (-1)    2 (0)     (0,1) sum 0                      [-1,0,0,1]
//
// Returns [[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]

public List<List<Integer>> fourSum(int[] nums, int target) {
  List<List<Integer>> out = new ArrayList<>();
  int n = nums.length;
  // Sorting enables both the two-pointer sweep and the adjacency test that
  // suppresses duplicates without needing a Set of results.
  Arrays.sort(nums);

  for (int i = 0; i < n - 3; i++) {
    // Skip a repeated first value, but keep its first occurrence (i > 0)
    if (i > 0 && nums[i] == nums[i - 1]) {
      continue;
    }
    for (int j = i + 1; j < n - 2; j++) {
      // Same idea one level down — guarded by j > i + 1, not j > 0, so the
      // first candidate after i is never wrongly skipped.
      if (j > i + 1 && nums[j] == nums[j - 1]) {
        continue;
      }

      int lo = j + 1;
      int hi = n - 1;
      while (lo < hi) {
        // long, not int: four values near 10^9 overflow, and the wraparound
        // silently inverts the comparison below and steers the pointers wrong.
        long sum = (long) nums[i] + nums[j] + nums[lo] + nums[hi];
        if (sum < target) {
          lo++;            // too small — only a larger value can help
        } else if (sum > target) {
          hi--;            // too large — shrink from the top
        } else {
          out.add(List.of(nums[i], nums[j], nums[lo], nums[hi]));
          // Slide both pointers past their duplicate neighbours so the same
          // quadruplet is not emitted again on the next iteration.
          while (lo < hi && nums[lo] == nums[lo + 1]) {
            lo++;
          }
          while (lo < hi && nums[hi] == nums[hi - 1]) {
            hi--;
          }
          lo++;
          hi--;
        }
      }
    }
  }
  return out;
}`
  },
  {
    num: 114, lc: 209, title: 'Minimum Size Subarray Sum', d: 'medium', companies: ['Garmin'],
    bucket: 'Sliding Window', category: 'Array · Sliding Window',
    url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
    approach: 'Variable-size sliding window (two pointers). Because all values are positive, the running sum increases as the right edge grows and decreases as the left edge shrinks, so the window is monotone and we never need to re-expand once shrunk. Expand right to add nums[right]; whenever sum reaches target, record the window length and shrink from the left to find the tightest qualifying window, stopping as soon as sum drops below target. Each index is added once and removed once, giving O(n) time and O(1) space, beating the O(n²) brute force over all start/end pairs. Pitfall: this only works while values stay non-negative; with negatives a prefix-sum plus deque is needed instead.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for target = 7, nums = [2,3,1,2,4,3]:
//
//   right  nums[r]  sum  (while sum>=7: shrink)              min
//   ───────────────────────────────────────────────────────────
//    0      2        2   —                                   ∞
//    1      3        5   —                                   ∞
//    2      1        6   —                                   ∞
//    3      2        8   8>=7 → len 4(0..3), sum-2=6, left=1  4
//    4      4       10   10>=7→ len 4(1..4), sum-3=7, left=2
//                        7>=7 → len 3(2..4), sum-1=6, left=3  3
//    5      3        9   9>=7 → len 3(3..5), sum-2=7, left=4
//                        7>=7 → len 2(4..5), sum-4=3, left=5  2
//
// Returns 2

public int minSubArrayLen(int target, int[] nums) {
  // left  = window start; sum = current window sum; min = best length so far
  int left = 0, sum = 0, min = Integer.MAX_VALUE;
  for (int right = 0; right < nums.length; right++) {
    sum += nums[right];            // expand window to the right
    // While the window already meets target, record length and shrink from the left.
    // Values are positive, so shrinking only ever lowers sum — once it drops below
    // target we stop, having captured the tightest window ending at 'right'.
    while (sum >= target) {
      min = Math.min(min, right - left + 1);
      sum -= nums[left++];
    }
  }
  return min == Integer.MAX_VALUE ? 0 : min;   // min unchanged => no qualifying window
}`
  },
  {
    num: 25, lc: 3, title: 'Longest Substring Without Repeating Characters', d: 'medium', companies: ['Temu', 'Garmin'],
    bucket: 'Sliding Window', category: 'String',
    url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    approach: 'Sliding window with a last-seen index map. Keep a window [left, r] guaranteed to hold only distinct characters. For each new char c, if we have seen it before at an index still inside the window (lastIdx[c] >= left), jump left to one past that occurrence so the duplicate is excluded; older occurrences before left are irrelevant. Then update lastIdx[c] and track the best window length. The left pointer never moves backward and each char is visited once, so it is O(n) time; the map holds at most one entry per distinct char, giving O(min(n, alphabet)) space. This beats checking all substrings for uniqueness in O(n²) or O(n³).',
    complexity: 'O(n) time · O(min(n, alphabet)) space',
    code: `// Worked trace for s = "abcabcbb":
//
//   r  c   seen before & >= left?   left  window     best
//   ───────────────────────────────────────────────────────
//   0  a   no                       0     "a"         1
//   1  b   no                       0     "ab"        2
//   2  c   no                       0     "abc"       3
//   3  a   yes(idx0) → left=1       1     "bca"       3
//   4  b   yes(idx1) → left=2       2     "cab"       3
//   5  c   yes(idx2) → left=3       3     "abc"       3
//   6  b   yes(idx4) → left=5       5     "cb"        3
//   7  b   yes(idx6) → left=7       7     "b"         3
//
// Returns 3

public int lengthOfLongestSubstring(String s) {
  // Map: char → most recent index we saw it
  Map<Character, Integer> lastIdx = new HashMap<>();
  // best = longest valid window seen; left = current window start
  int best = 0, left = 0;
  for (int r = 0; r < s.length(); r++) {
    char c = s.charAt(r);
    // If c was seen inside the current window, jump 'left' past that occurrence
    // (older occurrences before 'left' don't affect the current window — ignore)
    if (lastIdx.containsKey(c) && lastIdx.get(c) >= left) {
      left = lastIdx.get(c) + 1;
    }
    lastIdx.put(c, r);                  // record/refresh c's latest position
    best = Math.max(best, r - left + 1);// window [left, r] is now duplicate-free
  }
  return best;
}`
  },
  {
    num: 26, lc: 424, title: 'Longest Repeating Character Replacement', d: 'medium', companies: ['Garmin'],
    bucket: 'Sliding Window', category: 'String',
    url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
    approach: 'Sliding window with a frequency table and a max-frequency counter. A window is achievable if the number of characters that are NOT the dominant (most frequent) one can all be flipped within budget: (windowLen − maxFreq) ≤ k. Expand right, updating the count of the new char and maxFreq. If the window becomes invalid, slide left by one so the window size never shrinks below the best found. A clever detail: maxFreq is never decreased, but that is safe because the answer can only grow when a genuinely larger valid window appears, and a stale maxFreq only ever blocks (never inflates) shorter windows. O(n) time, O(26) = O(1) space.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = "AABABBA", k = 1  (window size only grows or holds):
//
//   r  ch  count(A,B)  maxFreq  len  len-maxFreq>k? shrink  left  best
//   ──────────────────────────────────────────────────────────────────
//   0  A   1,0         1        1    0>1? no                 0     1
//   1  A   2,0         2        2    0>1? no                 0     2
//   2  B   2,1         2        3    1>1? no                 0     3
//   3  A   3,1         3        4    1>1? no                 0     4
//   4  B   3,2         3        5    2>1? yes drop A  left=1  1     4
//   5  B   2,3         3        5    2>1? yes drop A  left=2  2     4
//   6  A   2,3         3        5    2>1? yes drop B  left=3  3     4
//
// Returns 4

public int characterReplacement(String s, int k) {
  // count[x] = frequency of letter x within the current window
  int[] count = new int[26];
  // left = window start; maxFreq = highest single-letter count seen; best = answer
  int left = 0, maxFreq = 0, best = 0;
  for (int r = 0; r < s.length(); r++) {
    // Window is valid if we can flip (windowLen - dominantCount) ≤ k chars
    maxFreq = Math.max(maxFreq, ++count[s.charAt(r) - 'A']);
    if ((r - left + 1) - maxFreq > k) {
      // Too many "non-dominant" chars to flip — shrink window from the left
      // Note: maxFreq isn't reset; the answer only ever grows, so leaving it
      // stale is harmless (best only updates when we find a larger window)
      count[s.charAt(left++) - 'A']--;
    }
    best = Math.max(best, r - left + 1);   // record the widest valid window
  }
  return best;
}`
  },
  {
    num: 27, lc: 76, title: 'Minimum Window Substring', d: 'hard',
    bucket: 'Sliding Window', category: 'String',
    url: 'https://leetcode.com/problems/minimum-window-substring/',
    approach: 'Sliding window driven by a single \'required\' counter instead of repeatedly comparing two maps. need[c] holds how many of c are still missing; it goes negative once we have a surplus. \'required\' tracks how many character slots remain unfilled — it only drops when we consume a char that was genuinely still needed (need[c] was > 0 before the decrement). When required hits 0 the window is valid, so we greedily shrink from the left, recording the smallest valid window, until removing a left char makes some need positive again. Each index enters and leaves the window once, so O(n + m) time; the fixed 128-size table gives O(alphabet) space, avoiding a per-step map comparison.',
    complexity: 'O(n + m) time · O(alphabet) space',
    code: `// Worked trace for s = "ADOBECODEBANC", t = "ABC" (required starts 3):
//
//   r  ch  need[ch]-- >0? required  valid? shrink-left action          best
//   ──────────────────────────────────────────────────────────────────────
//   0  A   yes  required=2          no
//   3  B   yes  required=1          no
//   5  C   yes  required=0          yes → window "ADOBEC" len6; drop A  6
//                                        need[A]>0 → required=1
//   ...continue expanding/shrinking; later "ODEBANC"→"DEBANC"→"BANC"...
//   12 C   ...  required=0          yes → shrink to "BANC" len4         4
//
// Returns "BANC"

public String minWindow(String s, String t) {
  if (t.length() > s.length()) return "";   // t can't fit → impossible
  // need[c] starts at how many of c we still need; goes negative if we have surplus
  int[] need = new int[128];
  for (char c : t.toCharArray()) need[c]++;
  // 'required' = how many DISTINCT needed-positions still to fill
  int required = t.length(), left = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;

  for (int r = 0; r < s.length(); r++) {
    // If this char was needed (need > 0 before decrement), reduce remaining count
    if (need[s.charAt(r)]-- > 0) required--;
    // Window now valid → shrink from left while it stays valid
    while (required == 0) {
      if (r - left + 1 < bestLen) {     // tighter window → remember it
        bestLen = r - left + 1;
        bestStart = left;
      }
      // Removing leftChar: if its count goes positive, we now need it again
      if (++need[s.charAt(left++)] > 0) required++;
    }
  }
  return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}`
  },
  {
    num: 28, lc: 122, title: 'Best Time to Buy and Sell Stock II', d: 'medium',
    bucket: 'Sliding Window', category: 'Array · Greedy',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/',
    approach: 'Greedy capture of every upward step. Any profitable multi-day rise can be decomposed into the sum of its consecutive day-to-day gains, so summing every positive difference prices[i] − prices[i−1] equals the optimum reachable with unlimited transactions; down-days contribute nothing and are simply skipped. This is equivalent to buying just before each rise and selling at its end, never missing a peak. One linear pass gives O(n) time and O(1) space. It matches the more elaborate dynamic-programming hold/cash state machine but with far less bookkeeping; the key correctness insight is that telescoping the gains never overcounts because losing days are excluded.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for prices = [7,1,5,3,6,4]:
//
//   i  prices[i-1]  prices[i]  delta   take? (delta>0)   profit
//   ──────────────────────────────────────────────────────────
//   1   7            1         -6      no                0
//   2   1            5         +4      yes               4
//   3   5            3         -2      no                4
//   4   3            6         +3      yes               7
//   5   6            4         -2      no                7
//
// Returns 7

public int maxProfit(int[] prices) {
  int profit = 0;   // accumulated total over all up-moves
  for (int i = 1; i < prices.length; i++) {
    // Greedy: pocket every positive day-to-day delta.
    // Equivalent to buying yesterday and selling today whenever it's a winner —
    // unlimited transactions mean we never miss a peak.
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  }
  return profit;
}`
  },
  {
    num: 29, lc: 567, title: 'Permutation in String', d: 'medium',
    bucket: 'Sliding Window', category: 'String',
    url: 'https://leetcode.com/problems/permutation-in-string/',
    approach: 'Fixed-size sliding window over s2 of width |s1|. A substring is a permutation of s1 iff the two share the same character multiset, so compare two 26-int frequency vectors: \'need\' for s1 and \'have\' for the current window. Build the first window, then slide one step at a time — increment the entering char and decrement the leaving char — keeping \'have\' current in O(1) per move. After each shift, Arrays.equals checks the multisets in O(26) = O(1). Overall O(n) time and O(1) space. This beats generating all permutations (factorial) or re-counting each window from scratch (O(n·|s1|)); the only subtlety is the early length check returning false when s1 is longer than s2.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s1 = "ab", s2 = "eidbaooo"  (window width 2):
//
//   i   window  add s2[i]  drop s2[i-2]  have(a,b)  equal(need=1,1)?
//   ──────────────────────────────────────────────────────────────
//   -   "ei"    (initial)  —             0,0        no
//   2   "id"    +d         -e            0,0        no
//   3   "db"    +b         -i            0,1        no
//   4   "ba"    +a         -d            1,1        YES → return true
//
// Returns true

public boolean checkInclusion(String s1, String s2) {
  if (s1.length() > s2.length()) return false;   // s1 can't fit → no permutation
  // need = target frequency profile; have = current window's profile
  int[] need = new int[26], have = new int[26];
  for (int i = 0; i < s1.length(); i++) {
    need[s1.charAt(i) - 'a']++;          // tally s1's letters
    have[s2.charAt(i) - 'a']++;          // and the first window of s2
  }
  // Initial window check — same multiset == permutation
  if (Arrays.equals(need, have)) return true;
  // Slide a fixed-size window one char at a time: add new right, drop old left
  for (int i = s1.length(); i < s2.length(); i++) {
    have[s2.charAt(i) - 'a']++;                  // char entering on the right
    have[s2.charAt(i - s1.length()) - 'a']--;    // char leaving on the left
    if (Arrays.equals(need, have)) return true;  // window matches → done
  }
  return false;
}`
  },
  {
    num: 30, lc: 560, title: 'Subarray Sum Equals K', d: 'medium', companies: ['Temu'],
    bucket: 'Sliding Window', category: 'Array · Prefix Sum · Hash Map',
    url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    approach: 'Prefix sums plus a hash map of counts. A subarray (j, i] sums to k exactly when prefix[i] − prefix[j] = k, i.e. prefix[j] = prefix[i] − k. So as we sweep left to right maintaining the running prefix sum, the number of valid subarrays ending at i is how many earlier prefixes equal (sum − k); we look that up in O(1) and add it, then record the current prefix. Seeding the map with {0: 1} accounts for subarrays starting at index 0. One pass gives O(n) time and O(n) space. The hash map is essential because negative numbers break the monotonic sliding window — the two-pointer shrink trick does not apply, whereas this method handles negatives cleanly and beats the O(n²) pair scan.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for nums = [1,2,1,3], k = 3  (map seeded {0:1}):
//
//   n  sum  need=sum-k  count += map[need]  count  then map becomes
//   ─────────────────────────────────────────────────────────────────
//   1  1    -2          map[-2]=0           0      {0:1, 1:1}
//   2  3     0          map[0]=1            1      {0:1, 1:1, 3:1}
//   1  4     1          map[1]=1            2      {0:1, 1:1, 3:1, 4:1}
//   3  7     4          map[4]=0            2      {...,7:1}
//
// Returns 2   (subarrays [1,2] and [2,1])

public int subarraySum(int[] nums, int k) {
  // Map: prefix sum → how many times we've seen it
  Map<Integer, Integer> prefixCount = new HashMap<>();
  prefixCount.put(0, 1);   // the empty prefix has sum 0
  int sum = 0, count = 0;
  for (int n : nums) {
    sum += n;              // running prefix sum up to and including this element
    // Each earlier prefix equal to (sum - k) gives one valid subarray ending at this index
    count += prefixCount.getOrDefault(sum - k, 0);
    // METHOD REFERENCE (lambda shorthand): Integer::sum means (a, b) -> a + b — the
    // remap function merge() applies when 'sum' is already a key (else it stores 1).
    // Without it:
    //   prefixCount.put(sum, prefixCount.getOrDefault(sum, 0) + 1);
    prefixCount.merge(sum, 1, Integer::sum);   // record this prefix for future lookups
  }
  return count;
}`
  },
  {
    num: 31, lc: 239, title: 'Sliding Window Maximum', d: 'hard', companies: ['Temu'],
    bucket: 'Sliding Window', category: 'Monotonic Deque',
    url: 'https://leetcode.com/problems/sliding-window-maximum/',
    approach: 'Monotonic decreasing deque holding INDICES, not values. The invariant is that values at the stored indices strictly decrease from front to back, so the front index is always the maximum of the current window. For each i: first evict the front if it has slid out of the window (index ≤ i − k); then pop from the back every index whose value is less than nums[i], because a newer, larger element makes them irrelevant for all future windows; finally push i. Once the first window is complete (i ≥ k − 1) read the front as that window\'s max. Each index is pushed and popped at most once, so O(n) time and O(k) space — far better than O(n·k) re-scanning or an O(n log k) heap.',
    complexity: 'O(n) time · O(k) space',
    code: `// Worked trace for nums = [1,3,-1,-3,5,3], k = 3  (dq holds indices, values ↓):
//
//   i  nums[i]  evict front?  pop tail (<nums[i])   dq(indices)  out (i>=2)
//   ──────────────────────────────────────────────────────────────────────
//   0   1       —             —                     [0]
//   1   3       —             pop 0(1<3)            [1]
//   2  -1       —             —                     [1,2]        out[0]=3
//   3  -3       front1? no    —                     [1,2,3]      ...wait i=3
//                front=1<=0? no; i=3: front<=0? no  [3 stays]
//   3  -3       —             —                     [1,2,3]      out[1]=3
//   4   5       front1<=1? yes pollFirst            pop 3,2(<5)  [4]   out[2]=5
//   5   3       —             —                     [4,5]        out[3]=5
//
// Returns [3,3,5,5]

public int[] maxSlidingWindow(int[] nums, int k) {
  int n = nums.length;
  int[] out = new int[n - k + 1];   // one max per window position
  // Deque of indices; values at those indices are strictly decreasing from front to back
  Deque<Integer> dq = new ArrayDeque<>();
  for (int i = 0; i < n; i++) {
    // Drop the front if it's now outside the window
    if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
    // Maintain monotonic: pop tail values smaller than nums[i] — they can never be max again
    while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
    dq.offerLast(i);                       // this index is a candidate max
    // Record the window's max once we've filled the first window
    if (i >= k - 1) out[i - k + 1] = nums[dq.peekFirst()];
  }
  return out;
}`
  },

  {
    num: 138, lc: 438, title: 'Find All Anagrams in a String', d: 'medium',
    bucket: 'Sliding Window', category: 'String · Sliding Window',
    url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
    approach: 'Fixed-size sliding window over s with letter-frequency histograms. Build a 26-slot need array from p, then slide a window of exactly p.length() across s: each step increments the count of the entering character and, once the window is full, decrements the one falling off the left edge, so the counts update in O(1) instead of being recounted. Whenever the window\'s histogram equals need, that window is a permutation of p and its start index i - m + 1 is recorded. The key insight is that an anagram is fully characterized by its letter multiset — two matching 26-entry histograms are both necessary and sufficient, so character order never needs to be examined. The naive alternative of sorting or recounting every length-m substring costs O(n·m log m) or O(n·m) and rescans characters the window has already seen; the incremental update touches each character of s exactly twice (once entering, once leaving). Comparing two fixed 26-slot arrays is O(26) per step, effectively constant, keeping the whole scan linear. An equivalent refinement keeps a single running matched counter over the 26 letters so each slide is truly O(1); the same histogram-window idea solves Permutation in String (LC 567), which asks for a boolean instead of all start indices.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = "abab", p = "ab"  (m = 2, need = {a:1, b:1}):
//
//   i  s[i]  window after add  evict s[i-m]  window now   == need?      result
//   ──────────────────────────────────────────────────────────────────────────
//   0  'a'   {a:1}             -             {a:1}        not full yet  []
//   1  'b'   {a:1,b:1}         -             {a:1,b:1}    yes → add 0   [0]
//   2  'a'   {a:2,b:1}         'a'           {a:1,b:1}    yes → add 1   [0,1]
//   3  'b'   {a:1,b:2}         'b'           {a:1,b:1}    yes → add 2   [0,1,2]
//
// Returns [0, 1, 2]

public List<Integer> findAnagrams(String s, String p) {
  List<Integer> result = new ArrayList<>();
  // If p doesn't even fit inside s, no start index can possibly work
  if (s.length() < p.length()) return result;
  // Window length is fixed at m — every candidate substring has exactly this size
  int m = p.length();
  // Target histogram: an anagram of p means "same 26 letter counts", order irrelevant,
  // so this array is the entire definition of a match
  int[] need = new int[26];
  for (int i = 0; i < m; i++) need[p.charAt(i) - 'a']++;
  // Live histogram of the current window of s — maintained incrementally, never recounted
  int[] window = new int[26];
  for (int i = 0; i < s.length(); i++) {
    // Right edge: s[i] enters the window
    window[s.charAt(i) - 'a']++;
    // Once more than m chars would be inside, the leftmost (s[i-m]) must leave.
    // Without this eviction the window keeps growing and can never equal need again.
    if (i >= m) window[s.charAt(i - m) - 'a']--;
    // Only compare once the window is exactly full — the first full window ends at i = m-1.
    // Equal histograms <=> the substring s[i-m+1..i] is a permutation of p.
    if (i >= m - 1 && Arrays.equals(window, need)) {
      // Record the START of the window, not i — the problem asks for left indices
      result.add(i - m + 1);
    }
  }
  return result;
}`
  },
  {
    num: 139, lc: 643, title: 'Maximum Average Subarray I', d: 'easy',
    bucket: 'Sliding Window', category: 'Array · Sliding Window',
    url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
    approach: 'Fixed-size sliding window over running sums. Every length-k window shares the same denominator k, so maximizing the average is exactly maximizing the window SUM — track sums and divide once at the very end. Seed the sum with the first k elements, then slide right one index at a time: the new window differs from the old by one entering element (nums[i]) and one leaving element (nums[i - k]), so each step is an O(1) add-and-subtract rather than an O(k) re-sum. That single observation collapses the naive recompute-every-window approach from O(n·k) to O(n). Initialize the best with the first window\'s sum, not 0 — the array can be all-negative, and a zero seed would silently beat every real window. Accumulating in a long sidesteps the near-int-limit worst case of 10^5 values at magnitude 10^4. A prefix-sum array gives an equivalent O(n) answer at the cost of O(n) extra space.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [1, 12, -5, -6, 50, 3], k = 4:
//
//   i   enters  leaves  windowSum            maxSum
//   ─────────────────────────────────────────────────
//   -   (seed)   -      1+12-5-6 = 2         2
//   4    50      1      2 + 50 - 1  = 51     51
//   5     3     12      51 + 3 - 12 = 42     51
//
// Returns 51 / 4.0 = 12.75

public double findMaxAverage(int[] nums, int k) {
  // Running sum of the current window. long, because 10^5 values of
  // magnitude 10^4 brush the int ceiling (10^9 vs ~2.1x10^9) — long
  // removes the overflow question entirely.
  long windowSum = 0;
  // Seed with the first k elements — the constraint k <= nums.length
  // guarantees this window exists, so no emptiness guard is needed.
  for (int i = 0; i < k; i++) windowSum += nums[i];
  // Best must start at the FIRST window's sum, not 0: with an all-negative
  // array every window sums below zero, and a 0 seed would win incorrectly.
  long maxSum = windowSum;
  // Slide right one step at a time. Consecutive windows differ by exactly
  // one entering and one leaving element, so each move is an O(1) update
  // instead of an O(k) re-sum — that is the whole win over the naive O(n·k).
  for (int i = k; i < nums.length; i++) {
    // nums[i] enters on the right, nums[i - k] falls off the left
    windowSum += nums[i] - nums[i - k];
    // Comparing raw sums is valid because every window has the same
    // length k: the largest sum IS the largest average.
    maxSum = Math.max(maxSum, windowSum);
  }
  // Divide exactly once, in floating point — dividing per-window would
  // just add rounding noise and cost for no benefit. k >= 1 by constraint.
  return maxSum / (double) k;
}`
  },
  {
    num: 140, lc: 219, title: 'Contains Duplicate II', d: 'easy',
    bucket: 'Sliding Window', category: 'Array · Sliding Window',
    url: 'https://leetcode.com/problems/contains-duplicate-ii/',
    approach: 'Slide a HashSet window across the array that holds only the values from the last k indices. At each index i, first evict nums[i - k - 1] once i > k — that element is now more than k positions behind and can never legally pair with anything from here on. Then attempt to add nums[i]: HashSet.add returns false when the value is already present, and since everything in the set is by construction within distance k, a collision immediately proves a valid pair. The key insight is that you never need to compare indices at all — membership in the k-wide window already certifies |i - j| <= k. The naive double loop checks each element against up to k neighbors for O(n·k) time, which blows up when k approaches n; the window instead lets each element enter and leave the set exactly once. The set is capped at k + 1 entries, giving O(n) time and O(min(n, k)) space. An equivalent alternative keeps a HashMap of value → most recent index and tests i - lastSeen <= k on every repeat.',
    complexity: 'O(n) time · O(min(n, k)) space',
    code: `// Worked trace for nums = [1, 0, 1, 1], k = 1:
//
//   i  nums[i]  evict? (i > k)        window after evict  add ok?  window after / action
//   ─────────────────────────────────────────────────────────────────────────────────────
//   0    1      no (0 > 1 false)      {}                  yes      {1}
//   1    0      no (1 > 1 false)      {1}                 yes      {1, 0}
//   2    1      yes, drop nums[0]=1   {0}                 yes      {0, 1}
//   3    1      yes, drop nums[1]=0   {1}                 no       return true
//
// Returns true — nums[2] == nums[3] and |3 - 2| = 1 <= k

public boolean containsNearbyDuplicate(int[] nums, int k) {
  // Invariant: the set holds exactly the values at indices [i-k, i-1] — every value close
  // enough that matching it satisfies |i - j| <= k. Membership alone proves the distance.
  Set<Integer> window = new HashSet<>();
  for (int i = 0; i < nums.length; i++) {
    // Evict the value that just slid out of range: index i-k-1 is now k+1 behind, so it
    // can never legally pair with nums[i] or anything later. Skipping this would let a
    // stale far-away duplicate produce a false positive.
    if (i > k) window.remove(nums[i - k - 1]);
    // add() returns false iff the value is already present — and everything in the set is
    // within k by the invariant above, so a collision IS the answer; no index math needed.
    // (The eviction is safe too: the set never holds a value twice, because we return
    // here the moment a second copy tries to enter.)
    if (!window.add(nums[i])) return true;
  }
  // Every k-wide window held all-distinct values — no qualifying pair exists.
  // Also covers k = 0 (window always emptied) and single-element arrays.
  return false;
}`
  },
  // ─── Stack (10) ───
  {
    num: 213, lc: 1004, title: 'Max Consecutive Ones III', d: 'medium',
    bucket: 'Sliding Window', category: 'Array · Sliding Window',
    url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
    approach: 'Reframe "flip at most k zeros" as "find the longest window containing at most k zeros" and the problem becomes a textbook variable-size sliding window. Nothing needs to be flipped or written; the window itself represents the post-flip run, so only a count of zeros inside it is tracked. The right edge advances unconditionally one step per iteration, incrementing the zero counter when it swallows a 0; whenever the count exceeds the budget, the left edge advances — decrementing the counter as it releases a 0 — until the window is legal again. Each index enters and leaves the window at most once, so the inner while loop does not make this quadratic: the total work is O(n) despite the nesting. The best answer is recorded after the shrink step, at which point the window is guaranteed valid. A subtle and pleasant property of the common variant is that the window never has to shrink below its record size, but recording the maximum explicitly (as here) is clearer and equally fast. Trying every start index and counting zeros forward is the O(n^2) alternative this replaces.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
//
//   right   nums[r]   zeros   shrink?              window     best
//   ──────────────────────────────────────────────────────────────
//   0..2      1         0     no                   [0..2]       3
//   3         0         1     no                   [0..3]       4
//   4         0         2     no                   [0..4]       5
//   5         0         3     yes -> left to 4     [4..5]       5
//   6..9      1         2     no                   [4..9]       6
//   10        0         3     yes -> left to 5     [5..10]      6
//
// Returns 6 (flip the two zeros at indices 4 and 5)

public int longestOnes(int[] nums, int k) {
  int left = 0;
  int zeros = 0;   // how many 0s currently sit inside [left, right]
  int best = 0;

  for (int right = 0; right < nums.length; right++) {
    // Grow unconditionally — the window is repaired below if it goes illegal
    if (nums[right] == 0) {
      zeros++;
    }
    // Too many zeros to flip: pull the left edge in until the budget holds
    // again. Each index is released at most once across the whole run, so
    // this nested loop keeps the algorithm linear, not quadratic.
    while (zeros > k) {
      if (nums[left] == 0) {
        zeros--;
      }
      left++;
    }
    // Measured only after the repair, so the window is known to be valid.
    // No array is ever modified — the window IS the hypothetical flipped run.
    best = Math.max(best, right - left + 1);
  }
  return best;
}`
  },
  {
    num: 32, lc: 20, title: 'Valid Parentheses', d: 'easy', companies: ['Temu'],
    bucket: 'Stack', category: 'String',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    approach: 'Stack matching. Scan left to right pushing every opener onto a stack; on each closer, the most recently opened bracket (the stack top) is the only one it can legally close, so pop it and verify the types pair up. This mirrors the LIFO nesting structure of valid brackets exactly: a closer always resolves the innermost unmatched opener. Two failure modes: a closer with an empty stack (nothing to match) and a type mismatch on pop. After the scan, leftover openers leave the stack non-empty, so validity is simply stack.isEmpty(). Runs in O(n) time and O(n) space for the stack.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for input "([)]":
//
//   char  action                       stack (top→bottom)
//   ───────────────────────────────────────────────────────
//    (    opener → push                 (
//    [    opener → push                 [ (
//    )    closer → pop '['; ')' vs '['  MISMATCH → return false
//
// Returns false (the ')' cannot close a '[')

public boolean isValid(String s) {
  // Stack holds still-unmatched openers; top is the innermost open bracket
  Deque<Character> stack = new ArrayDeque<>();
  for (char c : s.toCharArray()) {
    // Openers go straight onto the stack
    if (c == '(' || c == '[' || c == '{') stack.push(c);
    else {
      // Closer with nothing to match → invalid
      if (stack.isEmpty()) return false;
      // The most recent opener is the only one this closer may close
      char open = stack.pop();
      // Each closer must match the most recent opener
      if (c == ')' && open != '(') return false;
      if (c == ']' && open != '[') return false;
      if (c == '}' && open != '{') return false;
    }
  }
  // Leftover openers → unmatched
  return stack.isEmpty();
}`
  },
  {
    num: 33, lc: 155, title: 'Min Stack', d: 'medium',
    bucket: 'Stack', category: 'Design',
    url: 'https://leetcode.com/problems/min-stack/',
    approach: 'Auxiliary min-stack kept in lockstep with the main stack. The trick: store the running minimum alongside every element, so each main entry has a paired entry recording the smallest value seen at or below that depth. On push, push min(newVal, currentMin); on pop, pop both. Because the two stacks always share the same height, getMin() is just the min-stack top and is correct for whatever subset of elements remains after any pops. Every operation is O(1) and total space is O(n). This beats scanning the stack for the minimum on each query (which would be O(n) per getMin).',
    complexity: 'O(1) per op · O(n) space',
    code: `// Worked trace (main stack 'stack' and parallel 'mins', top shown first):
//
//   op           stack        mins         getMin()
//   ──────────────────────────────────────────────────
//   push(-2)     [-2]         [-2]          -2
//   push(0)      [0,-2]       [-2,-2]       -2   (min(0,-2)=-2)
//   push(-3)     [-3,0,-2]    [-3,-2,-2]    -3   (min(-3,-2)=-3)
//   pop()        [0,-2]       [-2,-2]       -2   (both popped)
//   top() = 0
//   getMin() = -2
//
// 'mins' top always equals the minimum of everything still in 'stack'.

class MinStack {
  // Main stack of values, top = most recently pushed
  private final Deque<Integer> stack = new ArrayDeque<>();
  // Parallel stack of running minimums — same height as the main stack
  private final Deque<Integer> mins  = new ArrayDeque<>();

  public void push(int val) {
    stack.push(val);
    // Push the smaller of (new value, current min). Empty case → val is the min.
    mins.push(mins.isEmpty() ? val : Math.min(mins.peek(), val));
  }
  // Pop must remove from BOTH stacks to keep them in sync
  public void pop()    { stack.pop(); mins.pop(); }
  // Plain top of the value stack
  public int top()     { return stack.peek(); }
  // Min of all current elements is just the top of the min stack → O(1)
  public int getMin()  { return mins.peek(); }
}`
  },
  {
    num: 34, lc: 150, title: 'Evaluate Reverse Polish Notation', d: 'medium',
    bucket: 'Stack', category: 'Stack',
    url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    approach: 'Stack-based postfix evaluation. Postfix needs no parentheses or operator precedence: scan left to right, push every number, and on an operator pop the two most recent results, apply the operator, and push the answer. Those top-two values are exactly the operands the operator binds to, so the stack collapses sub-expressions bottom-up until one value remains. The key pitfall is operand order for the non-commutative minus and divide operators: the FIRST pop is the right operand and the SECOND pop is the left, so you must compute a - b and a / b. Single pass gives O(n) time and O(n) stack space.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for tokens = ["2","1","+","3","*"]:
//
//   token  action                         stack (top→bottom)
//   ──────────────────────────────────────────────────────────
//    2     number → push                  2
//    1     number → push                  1 2
//    +     pop 1, pop 2 → push 3          3
//    3     number → push                  3 3
//    *     pop 3, pop 3 → push 9          9
//
// Returns 9  (final remaining value)

public int evalRPN(String[] tokens) {
  // Operand stack; an operator consumes the top two, pushes its result
  Deque<Integer> stack = new ArrayDeque<>();
  for (String t : tokens) {
    switch (t) {
      // Commutative ops — pop order doesn't matter
      case "+": stack.push(stack.pop() + stack.pop()); break;
      case "*": stack.push(stack.pop() * stack.pop()); break;
      // Non-commutative — second pop is the LEFT operand
      case "-": { int b = stack.pop(), a = stack.pop(); stack.push(a - b); break; }
      case "/": { int b = stack.pop(), a = stack.pop(); stack.push(a / b); break; }
      default:  stack.push(Integer.parseInt(t));   // numeric token
    }
  }
  return stack.pop();   // final remaining value is the answer
}`
  },
  {
    num: 35, lc: 739, title: 'Daily Temperatures', d: 'medium',
    bucket: 'Stack', category: 'Monotonic Stack',
    url: 'https://leetcode.com/problems/daily-temperatures/',
    approach: 'Monotonic decreasing stack of indices. As you scan left to right, keep on a stack the indices of days still waiting for a warmer day, ordered so their temperatures decrease from bottom to top. When day i is warmer than the day at the stack top, that earlier day\'s wait is resolved: pop it and record i - poppedIndex. Repeat while the top is colder, then push i. This works because a warmer day resolves every still-unanswered colder day to its left in one sweep. Each index is pushed and popped at most once, so the total is O(n) time and O(n) space, far better than O(n^2) look-ahead. Unresolved indices keep the default answer 0.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for temps = [73,74,75,71,69,72] (stack holds indices, top→bottom):
//
//   i  temp  stack-before  pops (set out[j]=i-j)     stack-after  out
//   ──────────────────────────────────────────────────────────────────────
//   0  73    []            —                          [0]         [0,0,0,0,0,0]
//   1  74    [0]           74>73 → out[0]=1           [1]         [1,0,0,0,0,0]
//   2  75    [1]           75>74 → out[1]=1           [2]         [1,1,0,0,0,0]
//   3  71    [2]           71<75, no pop              [3,2]       [1,1,0,0,0,0]
//   4  69    [3,2]         69<71, no pop              [4,3,2]     [1,1,0,0,0,0]
//   5  72    [4,3,2]       72>69 out[4]=1; 72>71 out[3]=2; 72<75 stop  [5,2]  [1,1,0,2,1,0]
//
// Leftover indices 5 and 2 never warmed → out stays 0 there. Returns [1,1,0,2,1,0]

public int[] dailyTemperatures(int[] temps) {
  // Default 0 means "no warmer day found" — we overwrite only when one appears
  int[] out = new int[temps.length];
  // Stack holds indices waiting for their "next warmer day". Always decreasing
  // from bottom to top (in terms of temps[index])
  Deque<Integer> stack = new ArrayDeque<>();
  for (int i = 0; i < temps.length; i++) {
    // Any indices on the stack with a cooler temp than today now have their answer
    while (!stack.isEmpty() && temps[i] > temps[stack.peek()]) {
      int j = stack.pop();
      // i is the first warmer day for j, so the wait is exactly i - j
      out[j] = i - j;
    }
    stack.push(i);
  }
  // Indices left on the stack never found a warmer day → out[i] stays 0 (default)
  return out;
}`
  },
  {
    num: 36, lc: 84, title: 'Largest Rectangle in Histogram', d: 'hard',
    bucket: 'Stack', category: 'Monotonic Stack',
    url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    approach: 'Monotonic increasing stack of indices. For each bar, the maximal rectangle using it as the limiting (shortest) height stretches left and right until a strictly shorter bar appears. A stack of increasing heights lets us find those boundaries cheaply: when a bar i is shorter than the stack top, the top bar\'s right boundary is i and its left boundary is the new top after popping, giving width i - newTop - 1 (or i if the stack empties). A sentinel height 0 past the end flushes all remaining bars, avoiding a special-case epilogue. Each index is pushed and popped once, giving O(n) time and O(n) space, beating O(n^2) expansion.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for heights = [2,1,5,6,2] (stack holds indices; sentinel h=0 at i=5):
//
//   i  h  stack-before  pop → area = heights[top] * width        best  stack-after
//   ─────────────────────────────────────────────────────────────────────────────
//   0  2  []            push                                      0     [0]
//   1  1  [0]           pop0: h=2,w=1 → 2                         2     [1]      (then push1)
//   2  5  [1]           push                                      2     [2,1]
//   3  6  [2,1]         push                                      2     [3,2,1]
//   4  2  [3,2,1]       pop3:h=6,w=1→6; pop2:h=5,w=2→10           10    [4,1]    (then push4)
//   5  0  [4,1]         pop4:h=2,w=3→6; pop1:h=1,w=5→5            10    [5]
//
// Returns 10 (the 5×2 block from bars at indices 2 and 3)

public int largestRectangleArea(int[] heights) {
  // Stack of indices whose heights are strictly increasing from bottom to top
  Deque<Integer> stack = new ArrayDeque<>();
  int best = 0;
  // i goes ONE PAST the array — using sentinel height 0 forces all leftover bars
  // to flush at the end (avoids special-casing after the loop)
  for (int i = 0; i <= heights.length; i++) {
    int h = (i == heights.length) ? 0 : heights[i];
    // A shorter bar arrived → every taller bar on top is now fully bounded
    while (!stack.isEmpty() && heights[stack.peek()] > h) {
      int top = stack.pop();
      // After popping, the new stack top is the previous smaller-or-equal bar
      // The popped bar's rectangle stretches from just past that index to i-1
      int width = stack.isEmpty() ? i : i - stack.peek() - 1;
      best = Math.max(best, heights[top] * width);
    }
    // Push current index; its height is now >= everything below it on the stack
    stack.push(i);
  }
  return best;
}`
  },
  {
    num: 37, lc: 394, title: 'Decode String', d: 'medium', companies: ['Temu'],
    bucket: 'Stack', category: 'String',
    url: 'https://leetcode.com/problems/decode-string/',
    approach: 'Two parallel stacks (counts + prefix-strings) plus a running buffer. Walk the input one char at a time: digits build the current count (shift-and-add for multi-digit numbers); "[" snapshots the count + prefix-so-far onto the stacks and resets the inner state to empty; "]" pops the matching count and prefix and appends the inner segment that many times to the prefix; letters extend the current buffer. The dual stacks naturally handle arbitrary nesting because each "[" pushes a frame and each "]" pops back to the parent level. Time is O(n times max_k) for building the output and space is O(depth) for the stack frames.',
    complexity: 'O(n · max_k) time · O(depth) space (one stack frame per nesting level)',
    code: `// Worked trace for input "3[a2[c]]":
//
//   char  k  counts    strs       current      action
//   ─────────────────────────────────────────────────────────────────
//    3    3  []        []         ""           digit → k = k*10 + 3
//    [    0  [3]       [""]       ""           push k & current, reset
//    a    0  [3]       [""]       "a"          letter → current += 'a'
//    2    2  [3]       [""]       "a"          digit → k = 2
//    [    0  [3, 2]    ["", "a"]  ""           push k & current, reset
//    c    0  [3, 2]    ["", "a"]  "c"          letter → current += 'c'
//    ]    0  [3]       [""]       "acc"        pop times=2, prev="a"; prev += current·2
//    ]    0  []        []         "accaccacc"  pop times=3, prev=""; prev += current·3
//
// Returns "accaccacc"

public String decodeString(String s) {
  // Two stacks growing in lockstep — every '[' pushes both, every ']' pops both.
  //   counts: how many times to repeat the segment opened by each '['
  //   strs:   the prefix string that existed BEFORE that '[' opened
  Deque<Integer> counts = new ArrayDeque<>();
  Deque<StringBuilder> strs = new ArrayDeque<>();

  // The string we're actively building at the CURRENT nesting depth
  StringBuilder current = new StringBuilder();
  // Accumulates the digits of the current count; reset after '['
  int k = 0;

  for (char c : s.toCharArray()) {
    if (Character.isDigit(c)) {
      // Multi-digit support: "100" arrives as 1 → 10 → 100 via shift-and-add
      k = k * 10 + (c - '0');
    } else if (c == '[') {
      // Entering a nested segment — snapshot the count + prefix-so-far,
      // then start the inner level fresh
      counts.push(k);
      strs.push(current);
      k = 0;
      current = new StringBuilder();
    } else if (c == ']') {
      // Closing the segment — pop the matching count and prefix, then
      // append the inner segment 'times' times to form the new current
      int times = counts.pop();
      StringBuilder prev = strs.pop();
      for (int i = 0; i < times; i++) prev.append(current);
      current = prev;
    } else {
      // Ordinary letter — extend the current segment in place
      current.append(c);
    }
  }
  return current.toString();
}`
  },

  {
    num: 141, lc: 232, title: 'Implement Queue using Stacks', d: 'easy',
    bucket: 'Stack', category: 'Design · Two Stacks',
    url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
    approach: 'Two stacks with lazy reversal: an in stack that receives every push, and an out stack that serves every pop and peek. The key insight is that draining one stack into another reverses its order, so two LIFO reversals reproduce FIFO — the bottom of in surfaces as the top of out. Transfer lazily: only when out runs completely empty do you drain ALL of in into it; while out still holds elements they are already in correct queue order and must not be disturbed. This makes every operation amortized O(1), because each element is pushed and popped at most twice in its lifetime (once per stack), even though one individual pop can occasionally cost O(n). The naive alternative — shuffling all elements between the stacks on every push so one stack always holds queue order — is correct but pays O(n) on every single insertion instead of only occasionally. empty() must check both stacks, since pending elements can be sitting in either one. An equivalent alternative makes push the expensive side instead (drain out into in, push, drain back), guaranteeing O(1) pops at the cost of O(n) pushes.',
    complexity: 'O(1) amortized time per op · O(n) space',
    code: `// Worked trace for push(1), push(2), peek(), pop(), empty():
//
//   op        what happens                     in (top→bot)   out (top→bot)   returns
//   ──────────────────────────────────────────────────────────────────────────────────
//   push(1)   in.push(1)                       [1]            []              -
//   push(2)   in.push(2)                       [2, 1]         []              -
//   peek()    out empty → drain in into out    []             [1, 2]          1
//   pop()     out non-empty → out.pop()        []             [2]             1
//   empty()   in empty, but out is not         []             [2]             false
//
// FIFO preserved: 1 exits first even though 2 was stacked on top of it in "in"

class MyQueue {
  // "in" absorbs every push; "out" serves pops/peeks in reversed (= FIFO) order.
  // ArrayDeque over java.util.Stack: Stack is a synchronized legacy Vector subclass.
  private final Deque<Integer> in = new ArrayDeque<>();
  private final Deque<Integer> out = new ArrayDeque<>();

  // Nothing to wire up — both stacks start empty, which correctly means "empty queue"
  public MyQueue() {}

  public void push(int x) {
    // Always O(1): new arrivals just pile onto "in" — reversal is deferred until
    // someone actually asks for the front, which is what makes the cost amortized
    in.push(x);
  }

  public int pop() {
    // Make sure the OLDEST element is sitting on top of "out" before removing it
    shift();
    return out.pop();
  }

  public int peek() {
    // Same repositioning as pop, but the element stays where it is
    shift();
    return out.peek();
  }

  public boolean empty() {
    // Elements can be waiting in EITHER stack — checking only one misreports the state
    return in.isEmpty() && out.isEmpty();
  }

  // Refill "out" ONLY when it has run dry. Draining "in" flips LIFO into FIFO once;
  // transferring while "out" still has items would interleave newer elements in front
  // of older ones. Each element moves at most once, so every op is amortized O(1).
  private void shift() {
    if (out.isEmpty()) {
      while (!in.isEmpty()) out.push(in.pop());
    }
  }
}`
  },
  {
    num: 142, lc: 71, title: 'Simplify Path', d: 'medium',
    bucket: 'Stack', category: 'String · Stack',
    url: 'https://leetcode.com/problems/simplify-path/',
    approach: 'Split the path on \'/\' and replay each token against a stack that models the current directory stack. A token of \'.\' or an empty token (produced by repeated slashes) means "stay here" and is simply skipped; \'..\' means "go up one level," which pops the stack if it is non-empty and is silently ignored at the root since you cannot go above it; any other token is a real directory name and gets pushed. The stack is the key insight: it naturally cancels a directory against a later \'..\' the same way the filesystem would, without ever needing to look ahead or backtrack with string surgery. A naive approach that repeatedly searches for and removes "dir/.." substrings is quadratic and fragile around edge cases like trailing slashes or "..." (a valid, non-special directory name); splitting first sidesteps all of that. Once every token is processed, join the surviving stack entries with \'/\' and prefix a leading \'/\' to rebuild the canonical absolute path. Runs in O(n) time and O(n) space for the stack and split tokens. An equivalent alternative walks the string manually with two pointers to extract tokens instead of calling split, avoiding the intermediate array at the cost of fiddlier index bookkeeping.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for path = "/a/./b/../../c/":
// split("/+") on the leading/repeated slashes yields tokens:
//   ["", "a", ".", "b", "..", "..", "c"]   (the trailing '/' produces no token at all)
//
//   token   action                          stack (bottom→top)
//   ─────────────────────────────────────────────────────────────
//   ""      empty (from leading '/') skip   []
//   "a"     real name → push                [a]
//   "."     current dir → skip              [a]
//   "b"     real name → push                [a, b]
//   ".."    up → pop "b"                    [a]
//   ".."    up → pop "a"                    []
//   "c"     real name → push                [c]
//
// Rebuild bottom→top with leading '/' → returns "/c"

public String simplifyPath(String path) {
  // Splitting on one-or-more slashes hands us clean tokens and folds away
  // both "//" runs and any leading/trailing slash into empty strings we skip.
  String[] tokens = path.split("/+");
  // Stack of directory names still "in scope" after resolving every ".." and "."
  Deque<String> stack = new ArrayDeque<>();
  for (String token : tokens) {
    // Empty (from split artifacts) or "." both mean "no-op, stay put"
    if (token.isEmpty() || token.equals(".")) {
      continue;
    } else if (token.equals("..")) {
      // Go up one level — but only if there is a level to go up to.
      // At the root, ".." is a no-op instead of an error.
      if (!stack.isEmpty()) stack.pop();
    } else {
      // Anything else is a legitimate directory/file name, including
      // odd-looking but valid names like "..." or "...."
      stack.push(token);
    }
  }
  // Rebuild the canonical path from the bottom of the stack upward
  StringBuilder sb = new StringBuilder();
  for (String dir : stack) {
    sb.insert(0, "/" + dir);
  }
  // An empty stack means everything canceled out — the canonical root path
  return sb.length() == 0 ? "/" : sb.toString();
}`
  },
  {
    num: 143, lc: 496, title: 'Next Greater Element I', d: 'easy',
    bucket: 'Stack', category: 'Monotonic Stack',
    url: 'https://leetcode.com/problems/next-greater-element-i/',
    approach: 'Monotonic decreasing stack over nums2, plus a value→answer hash map to serve the nums1 queries. Scan nums2 left to right, keeping a stack of values still waiting for their next greater element; the stack stays strictly decreasing from bottom to top. When a new value x arrives, every stacked value smaller than x is popped and recorded in the map with x as its answer — x really is the FIRST greater element to their right, because anything between a popped value and x was smaller (it sat above that value on the stack and popped first). Whatever remains on the stack at the end never met a larger element, so those lookups simply miss and default to -1. Since all nums2 values are unique and nums1 is a subset of nums2, the map resolves each query in O(1). The naive approach — locate each nums1 element in nums2 and scan rightward — costs O(n1 · n2), while the stack pushes and pops each nums2 element exactly once, making the whole pass linear. An equivalent alternative scans nums2 right-to-left, popping smaller values off the stack and recording the surviving top as the answer.',
    complexity: 'O(n1 + n2) time · O(n2) space',
    code: `// Worked trace for nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]:
//
//   x   stack before   pops (value:answer)   stack after   map after
//   (stack shown bottom -> top)
//   ─────────────────────────────────────────────────────────────────
//   1   []             —                     [1]           {}
//   3   [1]            1:3                   [3]           {1:3}
//   4   [3]            3:4                   [4]           {1:3, 3:4}
//   2   [4]            — (4 > 2)             [4, 2]        {1:3, 3:4}
//
//   Leftovers 4 and 2 never met a greater value -> map misses -> -1.
//   nums1 lookups: 4 -> -1, 1 -> 3, 2 -> -1
//
// Returns [-1, 3, -1]

public int[] nextGreaterElement(int[] nums1, int[] nums2) {
  // value -> its next greater element in nums2. Unique values make the value itself a
  // safe key; precomputing turns every nums1 query into an O(1) lookup instead of a rescan.
  Map<Integer, Integer> nextGreater = new HashMap<>();
  // Values still waiting for something bigger to appear on their right.
  // Invariant: strictly decreasing bottom -> top — the moment that would break, we pop.
  Deque<Integer> stack = new ArrayDeque<>();
  for (int x : nums2) {
    // x resolves EVERY waiting value smaller than it, and x is their FIRST greater
    // element: anything between a popped value and x was smaller, or it would have
    // popped that value off the stack already.
    while (!stack.isEmpty() && stack.peek() < x) {
      nextGreater.put(stack.pop(), x);
    }
    // x itself now waits — only a later, larger element can resolve it
    stack.push(x);
  }
  // Values still stacked never saw anything greater. Leaving them OUT of the map is
  // deliberate: the getOrDefault below then yields the required -1 for them.
  int[] ans = new int[nums1.length];
  for (int i = 0; i < nums1.length; i++) {
    // nums1 is a subset of nums2, so a map miss can only mean "no greater element exists"
    ans[i] = nextGreater.getOrDefault(nums1[i], -1);
  }
  return ans;
}`
  },
  {
    num: 144, lc: 1762, title: 'Buildings With an Ocean View', d: 'medium', companies: ['Garmin'],
    bucket: 'Stack', category: 'Monotonic Stack',
    url: 'https://leetcode.com/problems/buildings-with-an-ocean-view/',
    approach: 'Sweep left to right maintaining a monotonic strictly-decreasing stack of building indices. A building sees the ocean (which sits to the right of everything) exactly when every building to its right is strictly shorter, so when building i arrives it permanently blocks every stacked candidate whose height is <= heights[i] — pop them all before pushing i. The <= (rather than <) is the correctness crux: an equal-height building also ruins a view that demands strictly smaller neighbors. Whatever survives on the stack after the full sweep is taller than everything to its own right, and bottom-to-top the stack already lists those indices in increasing order, so it converts straight into the answer. Each index is pushed once and popped at most once, so the sweep is O(n) despite the nested-looking while loop. The naive per-building scan of its entire right side is O(n²) and times out at 10^5 elements. An equivalent alternative is a right-to-left pass carrying the running maximum — keep i whenever heights[i] beats it, then reverse — which uses O(1) auxiliary space, though the stack form also answers the classic follow-up where buildings stream in left to right.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for heights = [4, 2, 3, 1] (ocean is to the right):
//
//   i  h[i]  pops (now blocked)  stack after (idx:h)
//   ──────────────────────────────────────────────────
//   0   4    -                   [0:4]
//   1   2    -                   [0:4, 1:2]
//   2   3    idx 1 (2 <= 3)      [0:4, 2:3]
//   3   1    -                   [0:4, 2:3, 3:1]
//
// Stack bottom→top = surviving indices, already increasing
// Returns [0, 2, 3]

public int[] findBuildings(int[] heights) {
  int n = heights.length;
  // Index stack whose heights are strictly decreasing bottom→top. Sized n because
  // the worst case (strictly decreasing skyline) keeps every single building on it.
  int[] stack = new int[n];
  // Top-of-stack pointer; -1 means empty
  int top = -1;
  for (int i = 0; i < n; i++) {
    // Building i permanently blocks every stacked candidate not strictly taller
    // than it. Must be <= not <: the view demands all buildings to the right be
    // strictly SHORTER, so an equal-height building to the right blocks too.
    while (top >= 0 && heights[stack[top]] <= heights[i]) top--;
    // i can see the ocean so far — a later, taller building may still evict it
    stack[++top] = i;
  }
  // Survivors are taller than everything to their right, and bottom→top the stack
  // is already in increasing index order — slice it off as the answer.
  return Arrays.copyOf(stack, top + 1);
}`
  },
  // ─── Binary Search (11) ───
  {
    num: 214, lc: 716, title: 'Max Stack', d: 'hard',
    bucket: 'Stack', category: 'Design · DLL + TreeMap',
    url: 'https://leetcode.com/problems/max-stack/',
    approach: 'The difficulty is that popMax must delete an element from the MIDDLE of the stack, which the usual "stack plus running-max stack" trick cannot do — that design answers peekMax in O(1) but degenerates to O(n) for popMax because everything above the maximum must be unloaded and reloaded. Replacing the array-backed stack with a doubly linked list makes interior removal O(1) once a node is in hand, and a TreeMap from value to the list of nodes holding it supplies that handle: lastKey() is the current maximum in O(log n), and its bucket\'s last entry is the topmost node with that value. Two invariants keep the pair consistent. Each value\'s node list is maintained in push order, so the last element is always the node nearest the top — which is exactly what popMax must remove when the maximum is tied, and equally what pop removes when the stack top happens to carry that value. And every removal updates both structures, dropping the key entirely once its bucket empties so lastKey() never reports a stale maximum. Head and tail sentinels remove all null handling from the splice and unlink paths.',
    complexity: 'push/pop/top O(1) · peekMax/popMax O(log n) · O(n) space',
    code: `// Worked trace: push(5), push(1), push(5)
//
//   list (bottom -> top): 5, 1, 5
//   byValue: {1: [node@1], 5: [node@0, node@2]}
//
//   top()      -> 5   (tail.prev)
//   popMax()   -> 5   removes node@2, the LAST node in bucket 5 (top-most)
//   top()      -> 1   list is now 5, 1
//   peekMax()  -> 5   bucket 5 still holds node@0
//   pop()      -> 1
//   top()      -> 5

class MaxStack {

  /** One node per pushed value, so an interior element can be unlinked in O(1). */
  private static class Node {
    int val;
    Node prev, next;
    Node(int v) { val = v; }
  }

  // Sentinels: with a permanent head and tail, splice and unlink never need a
  // null check. The end nearest 'tail' is the top of the stack.
  private final Node head = new Node(0);
  private final Node tail = new Node(0);

  // value -> every live node holding it, kept in push order. The LAST entry of
  // a bucket is therefore the top-most node carrying that value, which is what
  // both popMax (ties break toward the top) and pop need to remove.
  private final TreeMap<Integer, List<Node>> byValue = new TreeMap<>();

  public MaxStack() {
    head.next = tail;
    tail.prev = head;
  }

  public void push(int x) {
    Node node = new Node(x);
    // Splice in just before the tail sentinel — that end is the stack top
    node.prev = tail.prev;
    node.next = tail;
    tail.prev.next = node;
    tail.prev = node;
    byValue.computeIfAbsent(x, k -> new ArrayList<>()).add(node);
  }

  public int pop() {
    Node top = tail.prev;
    unlink(top);
    // The stack top is the most recently pushed node overall, so among nodes
    // sharing its value it is the last one in the bucket.
    dropFromIndex(top.val);
    return top.val;
  }

  public int top() {
    return tail.prev.val;
  }

  public int peekMax() {
    // TreeMap keeps keys sorted, so the largest live value is one lookup away
    return byValue.lastKey();
  }

  public int popMax() {
    int max = byValue.lastKey();
    unlink(byValue.get(max).get(byValue.get(max).size() - 1));
    dropFromIndex(max);
    return max;
  }

  /** O(1) removal from the middle of the list — the reason a DLL is used at all. */
  private void unlink(Node node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /**
   * Remove the top-most node of this value from the index, and delete the key
   * outright once its bucket empties — otherwise lastKey() would keep
   * reporting a maximum that no longer exists on the stack.
   */
  private void dropFromIndex(int value) {
    List<Node> nodes = byValue.get(value);
    nodes.remove(nodes.size() - 1);
    if (nodes.isEmpty()) {
      byValue.remove(value);
    }
  }
}`
  },
  {
    num: 38, lc: 704, title: 'Binary Search', d: 'easy',
    bucket: 'Binary Search', category: 'Array',
    url: 'https://leetcode.com/problems/binary-search/',
    approach: 'Classic iterative binary search. Maintain a candidate window [lo, hi] and repeatedly probe its midpoint: if nums[mid] equals target you are done, otherwise the sorted order tells you which half can possibly contain target, so you discard the other half by moving lo or hi past mid. Halving the search space each step gives O(log n) time and O(1) space. The classic pitfall is computing mid as (lo + hi) / 2, which can overflow int when lo + hi exceeds Integer.MAX_VALUE; using an unsigned right shift to halve the sum avoids that. The lo ≤ hi loop with mid plus-or-minus one updates terminates and never rechecks mid.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for nums = [-1,0,3,5,9,12], target = 9:
//
//   lo  hi  mid  nums[mid]  action
//   ──────────────────────────────────────────────
//   0   5   2    3          3 < 9  → lo = mid+1 = 3
//   3   5   4    9          9 == 9 → return 4
//
// Returns 4

public int search(int[] nums, int target) {
  // [lo, hi] is the inclusive window that may still contain target
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    // Unsigned shift avoids overflow on (lo + hi) for very large arrays
    int mid = (lo + hi) >>> 1;
    if (nums[mid] == target) return mid;
    // Discard the half that can't contain target
    if (nums[mid] < target) lo = mid + 1;   // target is in the right half
    else hi = mid - 1;                       // target is in the left half
  }
  // Window collapsed without a hit → not present
  return -1;
}`
  },
  {
    num: 39, lc: 33, title: 'Search in Rotated Sorted Array', d: 'medium',
    bucket: 'Binary Search', category: 'Array',
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    approach: 'Modified binary search exploiting that a rotated sorted array always has at least one sorted half around mid. Compute mid, and compare nums[lo] to nums[mid]: if nums[lo] ≤ nums[mid] the left half [lo..mid] is sorted, otherwise the right half [mid..hi] is sorted. Within the provably sorted half you can test in O(1) whether target falls in its value range; if so search there, else search the other half. This keeps log-time halving even though the array is not globally sorted, giving O(log n) time and O(1) space. The pitfall is boundary comparisons — using ≤ for the sorted check handles the case where lo equals mid.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for nums = [4,5,6,7,0,1,2], target = 0:
//
//   lo hi mid nums[mid] sorted-half        target in it?       move
//   ───────────────────────────────────────────────────────────────────
//   0  6  3   7         left [4..7] sorted  0 in [4,7)? no      lo = mid+1 = 4
//   4  6  5   1         left [0..1] sorted  0 in [0,1)? yes     hi = mid-1 = 4
//   4  4  4   0         nums[mid]==target → return 4
//
// Returns 4

public int search(int[] nums, int target) {
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (nums[mid] == target) return mid;
    // KEY INSIGHT: in a rotated sorted array, AT LEAST ONE half [lo..mid] or
    // [mid..hi] is still sorted. Identify which, then check if target lies inside.
    if (nums[lo] <= nums[mid]) {
      // Left half [lo..mid] is sorted
      // If target lies within its value range, search left; otherwise go right
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half [mid..hi] is sorted
      // If target lies within its value range, search right; otherwise go left
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  // Fell out of the loop without finding target
  return -1;
}`
  },
  {
    num: 40, lc: 153, title: 'Find Minimum in Rotated Sorted Array', d: 'medium',
    bucket: 'Binary Search', category: 'Array',
    url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    approach: 'Binary search for the rotation point by comparing mid to the RIGHT end. The minimum is the unique element smaller than its predecessor, i.e. the start of the second sorted run. If nums[mid] exceeds nums[hi], mid sits in the higher (first) run, so the minimum must lie strictly to the right and lo moves to mid + 1; otherwise mid is in the run containing the min (or is the min itself), so hi = mid keeps it as a candidate. Comparing to the right end (not the left) is essential: a left comparison fails on an already-sorted array. The window shrinks to one element, giving O(log n) time and O(1) space.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for nums = [4,5,6,7,0,1,2]:
//
//   lo hi mid nums[mid] nums[hi] compare         move
//   ───────────────────────────────────────────────────────────
//   0  6  3   7         2        7 > 2 → right     lo = mid+1 = 4
//   4  6  5   1         2        1 < 2 → left/here hi = mid   = 5
//   4  5  4   0         1        0 < 1 → left/here hi = mid   = 4
//   lo == hi == 4 → stop
//
// Returns nums[4] = 0

public int findMin(int[] nums) {
  int lo = 0, hi = nums.length - 1;
  // Loop invariant: minimum is always within [lo..hi]
  while (lo < hi) {
    int mid = (lo + hi) >>> 1;
    // Compare against RIGHT end (not left — that would fail on non-rotated arrays).
    // If mid > hi, the rotation point and thus the min is somewhere in (mid, hi].
    if (nums[mid] > nums[hi]) lo = mid + 1;
    // Otherwise mid itself could be the min, so keep mid in the candidate window
    else hi = mid;
  }
  // Window collapsed to a single index — that is the minimum
  return nums[lo];
}`
  },
  {
    num: 41, lc: 278, title: 'First Bad Version', d: 'easy',
    bucket: 'Binary Search', category: 'Array · API',
    url: 'https://leetcode.com/problems/first-bad-version/',
    approach: 'Binary search for a boundary: the smallest v with isBadVersion(v) == true. Because the sequence is monotone (false... then true... once it flips it never flips back), you can halve the candidate range each step. If mid is bad, the first bad version is at mid or earlier, so hi = mid keeps mid as a candidate; if mid is good, the answer is strictly after mid, so lo = mid + 1. The window converges to the single boundary index in O(log n) calls. Critically, compute mid as lo + (hi - lo) / 2 rather than (lo + hi) / 2, since hi can be Integer.MAX_VALUE and the naive sum would overflow.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for n = 5, first bad version = 4:
//
//   lo hi mid  isBadVersion(mid)  move
//   ──────────────────────────────────────────────
//   1  5  3    false              lo = mid+1 = 4
//   4  5  4    true               hi = mid   = 4
//   lo == hi == 4 → stop
//
// Returns 4

public int firstBadVersion(int n) {
  // [lo, hi] brackets the first bad version; starts as the whole range
  int lo = 1, hi = n;
  while (lo < hi) {
    // lo + (hi - lo) / 2 avoids overflow when hi is near Integer.MAX_VALUE
    int mid = lo + (hi - lo) / 2;
    // Bad → first bad is at mid or earlier; keep mid in the window
    if (isBadVersion(mid)) hi = mid;
    // Good → first bad must be after mid
    else lo = mid + 1;
  }
  // lo and hi met at the boundary — the first bad version
  return lo;
}`
  },
  {
    num: 42, lc: 4, title: 'Median of Two Sorted Arrays', d: 'hard',
    bucket: 'Binary Search', category: 'Array',
    url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    approach: 'Binary search on the partition of the shorter array. Instead of merging, find a cut i in array a (and the complementary cut j = half - i in b) that splits both arrays so the left side holds exactly (m + n + 1) / 2 elements. The cut is correct when aLeft ≤ bRight and bLeft ≤ aRight, meaning every left element is ≤ every right element; sentinels (MIN/MAX_VALUE) handle empty sides. If aLeft exceeds bRight the cut i is too far right (move hi left), otherwise too far left (move lo right). Searching only the shorter array keeps j non-negative and yields O(log min(m, n)) time and O(1) space, beating the O(m + n) merge.',
    complexity: 'O(log min(m, n)) time · O(1) space',
    code: `// Worked trace for a = [1,3], b = [2]  (m=2, n=1, total=3, half=2):
//
//   lo hi i j  aLeft aRight bLeft bRight  test (aLeft<=bRight && bLeft<=aRight)
//   ─────────────────────────────────────────────────────────────────────────
//   0  2  1 1  a[0]=1 a[1]=3 b[0]=2 (none)→MAX  1<=2 && 2<=3 → OK
//   total is odd → median = max(aLeft, bLeft) = max(1, 2) = 2
//
// Returns 2.0

public double findMedianSortedArrays(int[] a, int[] b) {
  // Always binary-search on the SHORTER array so j stays non-negative
  if (a.length > b.length) return findMedianSortedArrays(b, a);
  int m = a.length, n = b.length, total = m + n, half = (total + 1) / 2;
  // Search cut positions 0..m in array a
  int lo = 0, hi = m;
  while (lo <= hi) {
    int i = (lo + hi) / 2;
    int j = half - i;  // partition b so left halves together hold 'half' elements
    // Use sentinels for the edge of each array
    int aLeft  = i == 0 ? Integer.MIN_VALUE : a[i - 1];
    int aRight = i == m ? Integer.MAX_VALUE : a[i];
    int bLeft  = j == 0 ? Integer.MIN_VALUE : b[j - 1];
    int bRight = j == n ? Integer.MAX_VALUE : b[j];
    // Correct partition when each left ≤ the opposite right
    if (aLeft <= bRight && bLeft <= aRight) {
      // Odd total → median is the largest on the left side
      if ((total & 1) == 1) return Math.max(aLeft, bLeft);
      // Even → average the two middle elements
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2.0;
    } else if (aLeft > bRight) hi = i - 1;   // i is too far right
    else lo = i + 1;                          // i is too far left
  }
  // Unreachable for valid sorted inputs
  return 0.0;
}`
  },
  {
    num: 43, lc: 50, title: 'Pow(x, n)', d: 'medium', companies: ['Temu'],
    bucket: 'Binary Search', category: 'Math · Fast Exponentiation',
    url: 'https://leetcode.com/problems/powx-n/',
    approach: 'Fast exponentiation by squaring (binary exponentiation). Writing n in binary, x^n is the product of x^(2^k) over the bit positions k that are set, so you only need log n multiplications instead of n. Iterate over the bits of |n|: each step squares x (advancing x to the next power of two) and, when the current low bit is 1, multiplies it into the result. Negative exponents invert x and negate n. The key pitfall is Integer.MIN_VALUE, whose negation overflows int — promoting n to long before negating avoids that. Total cost is O(log n) time and O(1) space, beating the naive O(n) repeated-multiply loop.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for x = 2.0, n = 10  (binary 1010):
//
//   N (bits)  low bit  result *= x?   x (squared)   result
//   ─────────────────────────────────────────────────────────────
//   1010      0        no             2 → 4          1
//   101       1        yes (*=4)      4 → 16         4
//   10        0        no             16 → 256       4
//   1         1        yes (*=256)    256 → ...       1024
//   0         stop                                    1024
//
// Returns 1024.0  (2^2 · 2^8 = 4 · 256)

public double myPow(double x, int n) {
  // Promote n to long so we can safely negate Integer.MIN_VALUE
  long N = n;
  if (N < 0) {
    // x^(-N) = (1/x)^N — invert the base and work with a positive exponent
    x = 1 / x;
    N = -N;
  }
  // Walk the bits of N. Each iteration: square x, multiply result if the low bit is 1.
  double result = 1.0;
  while (N > 0) {
    // A set low bit means this power-of-two factor of x belongs in the product
    if ((N & 1) == 1) result *= x;
    // Advance x to the next squared power: x, x^2, x^4, x^8, ...
    x *= x;
    // Shift to inspect the next higher bit of the exponent
    N >>= 1;
  }
  return result;
}`
  },

  {
    num: 145, lc: 35, title: 'Search Insert Position', d: 'easy',
    bucket: 'Binary Search', category: 'Binary Search',
    url: 'https://leetcode.com/problems/search-insert-position/',
    approach: 'This is plain binary search repurposed to also answer "where would it go if absent". Maintain window [lo, hi] over the sorted array and probe mid each step: an exact match returns mid immediately, otherwise the comparison against target still tells you which half to keep, exactly like standard binary search. The key insight is what lo equals the moment the loop exits without a match — since every discard step that moves lo does so because nums[mid] < target, lo always advances to sit just past every element smaller than target, and hi always retreats to sit just before every element greater than or equal to it once nums[mid] > target; when the window collapses (lo > hi), lo is precisely the first index whose value is not less than target, i.e. the correct insertion point. A naive linear scan comparing target against every element also works but costs O(n); a separate post-loop scan to "find the insert point" is redundant, since lo already lands there for free. This keeps everything to a single O(log n) pass with O(1) space. A library alternative is Arrays.binarySearch, which returns the same information encoded as -(insertionPoint) - 1 on a miss.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for nums = [1, 3, 5, 6], target = 5 (exact match case):
//
//   lo  hi  mid  nums[mid]  action
//   ──────────────────────────────────────────────
//   0   3   1    3          3 < 5  → lo = mid+1 = 2
//   2   3   2    5          5 == 5 → return 2
//
// Returns 2
//
// Edge case, same array, target = 2 (no match, must insert):
//
//   lo  hi  mid  nums[mid]  action
//   ──────────────────────────────────────────────
//   0   3   1    3          3 > 2  → hi = mid-1 = 0
//   0   0   0    1          1 < 2  → lo = mid+1 = 1
//   1   0   -    -          lo > hi, loop ends → return lo = 1
//
// Returns 1 (insert 2 between index 0 and the old index 1)

public int searchInsert(int[] nums, int target) {
  // [lo, hi] is the inclusive window that may still contain target
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    // Unsigned shift avoids overflow on (lo + hi) for very large arrays
    int mid = (lo + hi) >>> 1;
    // Exact match — this is both the search hit and the insertion index
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) {
      // mid (and everything before it) is too small, so the answer is past mid
      lo = mid + 1;
    } else {
      // mid (and everything from it onward) is too big, keep it as a candidate
      hi = mid - 1;
    }
  }
  // No exact match: the window collapsed with lo just past every element smaller
  // than target and hi just before every element >= target, so lo IS the
  // correct insertion index — no extra pass needed to compute it separately.
  return lo;
}`
  },
  {
    num: 146, lc: 74, title: 'Search a 2D Matrix', d: 'medium', companies: ['Garmin'],
    bucket: 'Binary Search', category: 'Matrix · Binary Search',
    url: 'https://leetcode.com/problems/search-a-2d-matrix/',
    approach: 'Treat the whole m×n grid as one flattened sorted array of length m*n and binary search it directly, without ever materializing the flattened array. Each row is sorted and the first element of every row is greater than the last element of the previous row, so reading the matrix left-to-right, top-to-bottom visits every value in strictly increasing order — exactly the invariant plain binary search needs. A candidate flat index mid maps back to a cell via mid / n (row) and mid % n (column), so the search still only touches O(1) extra memory. This beats the naive approach of binary searching each row individually (O(m log n)) or scanning the whole matrix (O(mn)), collapsing everything into a single O(log(mn)) search. The key insight that makes the flattening valid is the cross-row ordering guarantee in the problem statement — without it you would be forced to binary search each row or use the staircase (start top-right, step left/down) technique instead, which runs in O(m + n) and works even when rows are only individually sorted.',
    complexity: 'O(log(m*n)) time · O(1) space',
    code: `// Worked trace for matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3:
//
//   lo  hi  mid  row=mid/4  col=mid%4  value  action
//   ────────────────────────────────────────────────────────
//   0   11   5    1          1          11     11 > 3  → hi = mid-1 = 4
//   0   4    2    0          2          5      5 > 3   → hi = mid-1 = 1
//   0   1    0    0          0          1      1 < 3   → lo = mid+1 = 1
//   1   1    1    0          1          3      3 == 3  → return true
//
// Returns true

public boolean searchMatrix(int[][] matrix, int target) {
  // Guard the degenerate empty-matrix case before touching matrix[0]
  if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return false;
  int rows = matrix.length, cols = matrix[0].length;
  // Treat the grid as one flattened sorted array of length rows*cols.
  // This is valid ONLY because each row is sorted AND the first element of
  // every row is greater than the last element of the previous row.
  int lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    // Unsigned shift avoids overflow, same as plain binary search
    int mid = (lo + hi) >>> 1;
    // Map the flat index back to its 2D cell: row = mid / cols, col = mid % cols
    int row = mid / cols;
    int col = mid % cols;
    int value = matrix[row][col];
    if (value == target) return true;
    // Discard the half of the flattened array that can't contain target
    if (value < target) lo = mid + 1;   // target is further along the flattened order
    else hi = mid - 1;                  // target is earlier in the flattened order
  }
  // Window collapsed without a hit — target isn't anywhere in the matrix
  return false;
}`
  },
  {
    num: 147, lc: 34, title: 'Find First and Last Position of Element in Sorted Array', d: 'medium',
    bucket: 'Binary Search', category: 'Binary Search',
    url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
    approach: 'Two independent binary searches, each biased toward one edge of the target run instead of stopping at the first match found. To find the left boundary, whenever nums[mid] == target you record mid as the best-so-far answer but still move hi = mid - 1 to keep probing further left, because an earlier occurrence might still exist. To find the right boundary you mirror this: on a match, record mid and move lo = mid + 1 to keep probing further right. The key insight is that a plain "return on first match" binary search gives you AN index inside the run, but not necessarily an edge, and which index you land on depends on array shape — so the two searches must be biased searches for a boundary condition (leftmost/rightmost true value of nums[i] >= target and nums[i] > target), not searches for equality. A naive alternative — linear-scan outward from any found index — is correct but degrades to O(n) when the target run is large, defeating the point of the sorted input. Running two O(log n) searches keeps the whole solution O(log n) time and O(1) space. An equivalent alternative is to implement a single lowerBound(x) helper returning the first index with nums[i] >= x, then call it with target and target + 1 to derive both the start and (one past) the end.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for nums = [5,7,7,8,8,10], target = 8:
//
//   Left-boundary search (bias hi = mid-1 on match):
//   lo  hi  mid  nums[mid]  action                    best
//   ──────────────────────────────────────────────────────
//   0   5   2    7          7<8  → lo = mid+1 = 3      -
//   3   5   4    8          match → best=4, hi=mid-1=3 4
//   3   3   3    8          match → best=3, hi=mid-1=2 3
//   3   2   -    (lo>hi, stop)                         3
//
//   Right-boundary search (bias lo = mid+1 on match):
//   lo  hi  mid  nums[mid]  action                    best
//   ──────────────────────────────────────────────────────
//   0   5   2    7          7<8  → lo = mid+1 = 3      -
//   3   5   4    8          match → best=4, lo=mid+1=5 4
//   5   5   5    10         10>8 → hi = mid-1 = 4      4
//   5   4   -    (lo>hi, stop)                         4
//
// Returns [3, 4]

public int[] searchRange(int[] nums, int target) {
  // Find the leftmost index whose value equals target (or -1 if absent)
  int first = findBound(nums, target, true);
  // No need to run the second search at all if target isn't present
  if (first == -1) return new int[]{ -1, -1 };
  // Find the rightmost index whose value equals target
  int last = findBound(nums, target, false);
  return new int[]{ first, last };
}

// Biased binary search: on a match, record it but keep searching toward
// one edge instead of returning immediately. That bias is what turns an
// equality search into a boundary search.
private int findBound(int[] nums, int target, boolean findFirst) {
  int lo = 0, hi = nums.length - 1;
  int result = -1;
  while (lo <= hi) {
    // Unsigned shift avoids overflow on (lo + hi) for very large arrays
    int mid = (lo + hi) >>> 1;
    if (nums[mid] == target) {
      // Remember this as the best candidate so far...
      result = mid;
      // ...then keep narrowing toward the requested edge instead of stopping,
      // because an earlier (or later) occurrence of target may still exist.
      if (findFirst) hi = mid - 1;   // look further left for an earlier match
      else lo = mid + 1;             // look further right for a later match
    } else if (nums[mid] < target) {
      // Whole left half including mid is too small — discard it
      lo = mid + 1;
    } else {
      // Whole right half including mid is too large — discard it
      hi = mid - 1;
    }
  }
  // -1 if target never matched; otherwise the boundary index found
  return result;
}`
  },
  {
    num: 148, lc: 162, title: 'Find Peak Element', d: 'medium',
    bucket: 'Binary Search', category: 'Binary Search',
    url: 'https://leetcode.com/problems/find-peak-element/',
    approach: 'Binary search that climbs toward a peak using the local slope at mid, exploiting the guarantee that nums[-1] and nums[n] are treated as -infinity so a peak always exists. Compare nums[mid] to its right neighbor nums[mid+1]: if nums[mid] < nums[mid+1] the sequence is still rising, so a peak must exist somewhere to the right (worst case the last element, whose right neighbor is -infinity), and lo moves to mid+1; otherwise nums[mid] > nums[mid+1] (values are distinct, so equality never happens), meaning mid is on a descending slope or is itself a peak, so a peak must exist at mid or to its left, and hi collapses to mid. The key insight is that this local comparison is enough to discard half the array without ever looking at the whole sequence, because at least one direction from any ascending or descending point is guaranteed to lead to a peak. A linear scan comparing every element to both neighbors also works but only in O(n) time, throwing away the sorted-slope structure that binary search exploits; here the window halves each step for O(log n) time and O(1) space. An equivalent recursive divide-and-conquer formulation picks the larger side\'s half and recurses into it.',
    complexity: 'O(log n) time · O(1) space',
    code: `// Worked trace for nums = [1, 2, 1, 3, 5, 6, 4]:
//
//   lo  hi  mid  nums[mid]  nums[mid+1]  compare        action
//   ──────────────────────────────────────────────────────────────────
//   0   6   3    3          5            3 < 5 (rising) lo = mid+1 = 4
//   4   6   5    6          4            6 > 4 (falling) hi = mid = 5
//   4   5   4    5          6            5 < 6 (rising) lo = mid+1 = 5
//   5   5   -    loop ends (lo == hi)    return lo = 5
//
// Returns 5 (nums[5] = 6 is a peak: 6 > 5 and 6 > 4)

public int findPeakElement(int[] nums) {
  // [lo, hi] always contains at least one peak index — true initially because
  // nums[-1] and nums[n] are conceptually -infinity, so the array's global
  // max is always a peak, and it lies somewhere in [0, n-1].
  int lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    // Unsigned shift avoids overflow on (lo + hi) for very large arrays
    int mid = (lo + hi) >>> 1;
    // mid+1 is always valid here since mid < hi <= nums.length - 1
    if (nums[mid] < nums[mid + 1]) {
      // Still climbing: mid itself can't be a peak, but the ascent guarantees
      // a peak exists to its right, so it's safe to drop everything up to mid.
      lo = mid + 1;
    } else {
      // Descending (or nums[mid] is a local max): a peak exists at mid or to
      // its left, so keep mid in the window instead of excluding it like above.
      hi = mid;
    }
  }
  // Window collapsed to a single index — that index must be a peak
  return lo;
}`
  },
  {
    num: 149, lc: 410, title: 'Split Array Largest Sum', d: 'hard', companies: ['Garmin'],
    bucket: 'Binary Search', category: 'Binary Search on Answer',
    url: 'https://leetcode.com/problems/split-array-largest-sum/',
    approach: 'Binary search on the ANSWER rather than on the array itself: the thing being searched for is not an index but the minimum possible value of "the largest subarray sum", call it cap. The search space for cap is [max(nums), sum(nums)] — it can never be smaller than the single biggest element (that element has to live in some subarray) and never needs to exceed the total sum (one subarray holding everything). For a candidate cap, a greedy scan can check feasibility in O(n): walk the array accumulating a running sum, and start a new subarray the moment adding the next element would exceed cap; the number of subarrays produced is the minimum possible for that cap, because delaying a split as long as legally possible can only reduce or match the split count of any other valid partition. If that count is ≤ m, cap is achievable (and everything larger than cap is also achievable, since a looser cap only merges pieces), so search the lower half by shrinking hi; otherwise cap is too tight, so search the upper half. Monotonicity of "pieces needed" as a non-increasing function of cap is exactly what makes binary search valid here. This turns an exponential search over partitions into O(n log(sum − max)) time and O(1) space. Trying to DP directly over "best split of the first i elements into k groups" also works (O(n^2 · m) time) but is asymptotically worse and more code; binary-searching the answer while reusing a simple greedy feasibility check is the standard interview-favored approach.',
    complexity: 'O(n log(sum − max)) time · O(1) space',
    code: `// Worked trace for nums = [7, 2, 5, 10, 8], m = 2:
//
//   lo  hi  mid  pieces(mid)  feasible?  action
//   ───────────────────────────────────────────────────────
//   10  32   21       2          yes     hi = 21 (try smaller)
//   10  21   15       3          no      lo = 16 (need bigger)
//   16  21   18       2          yes     hi = 18 (try smaller)
//   16  18   17       3          no      lo = 18 (loop ends, lo == hi)
//
// Returns 18  (split as [7,2,5] and [10,8], largest sum = 18)

public int splitArray(int[] nums, int m) {
  // The cap can never beat the single largest element — that element
  // must sit alone in whichever subarray contains it.
  int lo = 0;
  // The cap never needs to exceed putting everything in one subarray.
  int hi = 0;
  for (int x : nums) {
    lo = Math.max(lo, x);
    hi += x;
  }
  // Binary search the smallest cap for which m (or fewer) subarrays suffice.
  // Feasibility is monotonic in cap: a looser cap only merges pieces, never splits more.
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (countPiecesWithinCap(nums, mid) <= m) {
      // mid works — it might still be improvable, so keep it as a candidate
      hi = mid;
    } else {
      // mid is too tight to fit in m pieces — need more headroom
      lo = mid + 1;
    }
  }
  // lo == hi: the minimum cap for which the greedy split needs at most m pieces
  return lo;
}

// Greedily packs nums into the fewest subarrays whose sum never exceeds cap.
// Greedy is optimal here: pushing an element into the current run whenever
// it still fits can never require MORE subarrays than stopping earlier would.
private int countPiecesWithinCap(int[] nums, int cap) {
  int pieces = 1;
  long currentSum = 0;
  for (int x : nums) {
    // Adding x would blow the cap — close out the current subarray and start fresh
    if (currentSum + x > cap) {
      pieces++;
      currentSum = x;
    } else {
      currentSum += x;
    }
  }
  return pieces;
}`
  },
  // ─── Linked List (15) ───
  {
    num: 44, lc: 206, title: 'Reverse Linked List', d: 'easy', companies: ['Garmin'],
    bucket: 'Linked List', category: 'Two Pointers',
    url: 'https://leetcode.com/problems/reverse-linked-list/',
    approach: 'Iterative three-pointer reversal. Keep prev (the already-reversed prefix, starting null), curr (the node being processed), and a saved next. On each step you must stash curr.next BEFORE overwriting it, then flip curr.next to point at prev, then slide prev and curr forward by one. The invariant is that everything from prev backward is already reversed, so when curr falls off the end prev is exactly the new head. This runs in O(n) time and O(1) space because it only re-links existing nodes — no recursion stack and no new allocations, unlike the recursive variant which costs O(n) stack space.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for input 1 -> 2 -> 3 -> null:
//
//   step  curr  next  prev      action
//   ──────────────────────────────────────────────────────
//   init   1     -    null      prev starts empty
//    1     1     2    1         1.next = null; prev=1, curr=2
//    2     2     3    2->1      2.next = 1;    prev=2, curr=3
//    3     3    null  3->2->1   3.next = 2;    prev=3, curr=null
//   loop ends (curr == null)
//
// Returns 3 -> 2 -> 1 -> null

public ListNode reverseList(ListNode head) {
  // prev = head of the portion already reversed (empty at the start)
  // curr = the node we are about to flip
  ListNode prev = null, curr = head;
  while (curr != null) {
    // Save the next link BEFORE we overwrite curr.next — otherwise we lose the rest
    ListNode next = curr.next;
    curr.next = prev;   // flip this node's pointer to face backward
    prev = curr;        // advance the trailing pointer onto the node we just reversed
    curr = next;        // advance the leading pointer to the saved successor
  }
  // When curr is null we have consumed every node, so prev is the new head
  return prev;
}`
  },
  {
    num: 45, lc: 21, title: 'Merge Two Sorted Lists', d: 'easy', companies: ['Temu'],
    bucket: 'Linked List', category: 'Two Pointers',
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    approach: 'Two-pointer merge with a dummy head. The dummy sentinel removes the special case of choosing the very first node: a tail pointer always has somewhere to append. Each step compares the two current heads and splices the smaller one onto the tail, advancing only that list — picking with a non-strict ≤ keeps the merge stable when values tie. When one list is exhausted the other is, by assumption, already sorted, so you attach its entire remainder in O(1) instead of walking it. Total work is O(n+m) time and O(1) extra space since nodes are relinked in place; dummy.next skips the sentinel to give the real head.',
    complexity: 'O(n + m) time · O(1) space',
    code: `// Worked trace for a = 1 -> 3, b = 2 -> 4:
//
//   step  a.val  b.val  pick   tail chain
//   ────────────────────────────────────────────────
//    1      1      2      a     dummy -> 1
//    2      3      2      b     dummy -> 1 -> 2
//    3      3      4      a     dummy -> 1 -> 2 -> 3
//    4      -      4      b     dummy -> 1 -> 2 -> 3 (a empty)
//   loop ends; attach remaining b: -> 4
//
// Returns 1 -> 2 -> 3 -> 4

public ListNode mergeTwoLists(ListNode a, ListNode b) {
  // Dummy node lets us treat the first append uniformly with the rest
  ListNode dummy = new ListNode(0), tail = dummy;
  // Walk both lists in lockstep until one runs out of nodes
  while (a != null && b != null) {
    // Splice the smaller head onto the tail (<= preserves stable order on ties)
    if (a.val <= b.val) {
      tail.next = a;    // link a's node into the result
      a = a.next;       // advance only the list we consumed from
    } else {
      tail.next = b;    // link b's node into the result
      b = b.next;
    }
    tail = tail.next;   // move the tail to the node we just appended
  }
  // Whichever list still has nodes is already sorted — attach the whole remainder
  tail.next = (a != null) ? a : b;
  // dummy.next is the real head (dummy itself was just scaffolding)
  return dummy.next;
}`
  },
  {
    num: 46, lc: 141, title: 'Linked List Cycle', d: 'easy',
    bucket: 'Linked List', category: 'Two Pointers (Floyd)',
    url: 'https://leetcode.com/problems/linked-list-cycle/',
    approach: 'Floyd\'s tortoise-and-hare cycle detection. Run a slow pointer one step at a time and a fast pointer two steps at a time. If the list ends, fast reaches null and we report no cycle. If a cycle exists, fast enters the loop first and, since it gains exactly one position on slow every iteration, the gap shrinks by one until they collide — so a meeting is guaranteed and proves a cycle. This is O(n) time and O(1) space, beating the hash-set approach that records visited nodes in O(n) memory. The key pitfall is the null guard: you must check both fast and fast.next before dereferencing fast.next.next.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for 3 -> 2 -> 0 -> -4, where -4.next points back to 2 (cycle):
//
//   iter   slow   fast   meet?
//   ──────────────────────────────────
//    0       3      3     start
//    1       2      0     no
//    2       0     2 *    no   (* fast wrapped through the cycle)
//    3      -4      -4    YES  slow == fast
//
// Returns true

public boolean hasCycle(ListNode head) {
  // Both pointers start at the head; they will diverge in speed
  ListNode slow = head, fast = head;
  // fast must check both its next and next.next — they can be null in an acyclic list
  while (fast != null && fast.next != null) {
    slow = slow.next;          // tortoise advances one node
    fast = fast.next.next;     // hare advances two nodes
    // In a cycle the gap between slow and fast closes by 1 each step → guaranteed meeting
    if (slow == fast) return true;
  }
  // fast hit null → the list has an end, so there is no cycle
  return false;
}`
  },
  {
    num: 47, lc: 19, title: 'Remove Nth Node From End of List', d: 'medium',
    bucket: 'Linked List', category: 'Two Pointers',
    url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    approach: 'Two-pointer gap technique in one pass. A dummy head in front of the list makes deleting the original first node uniform with deleting any other node. Advance a fast pointer n+1 steps ahead of slow, then move both together until fast falls off the end; this fixed gap leaves slow resting on the node just BEFORE the target, so slow.next = slow.next.next splices the target out. The +1 offset is the crucial detail — it puts slow at the predecessor rather than the victim itself. Runtime is O(n) with a single traversal and O(1) space, avoiding the naive two-pass approach that counts length first and then walks again.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for head = 1 -> 2 -> 3 -> 4 -> 5, n = 2:
//
//   phase            slow   fast   note
//   ───────────────────────────────────────────────────────────
//   after n+1=3 hops dummy   3     fast led by 3 nodes
//   advance both      1      4
//   advance both      2      5
//   advance both      3     null   loop stops
//   slow at 3 → 3.next = 5 (node 4 bypassed)
//
// Returns 1 -> 2 -> 3 -> 5

public ListNode removeNthFromEnd(ListNode head, int n) {
  // Dummy head simplifies removing the actual first node (no edge case)
  ListNode dummy = new ListNode(0); dummy.next = head;
  // Both pointers start at the dummy so distances are measured uniformly
  ListNode slow = dummy, fast = dummy;
  // Open a gap of n+1 so when fast hits null, slow is at the node BEFORE the target
  for (int i = 0; i <= n; i++) fast = fast.next;
  // Move in lockstep; the gap stays fixed until fast runs off the end
  while (fast != null) {
    slow = slow.next;
    fast = fast.next;
  }
  // slow now sits just before the target — bypass the target node
  slow.next = slow.next.next;
  // Return dummy.next in case the head itself was the node removed
  return dummy.next;
}`
  },
  {
    num: 48, lc: 23, title: 'Merge K Sorted Lists', d: 'hard', companies: ['Temu'],
    bucket: 'Linked List', category: 'Heap',
    url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    approach: 'Min-heap (priority queue) k-way merge. Because each list is individually sorted, the global minimum among all remaining nodes is always one of the k current heads, so we keep just those heads in a heap ordered by value. Repeatedly poll the smallest, append it to the result tail, and push that node\'s successor to refill its list\'s slot. The heap never exceeds k entries, giving O(k) space, and each of the N total nodes is pushed and popped once at O(log k) cost, for O(N log k) time — far better than merging lists one-by-one which degrades to O(N·k). A comparator of a.val - b.val orders the heap; the dummy head simplifies appending.',
    complexity: 'O(N log k) time · O(k) space',
    code: `// Worked trace for lists = [ 1->4, 1->3, 2 ]:
//
//   heap (vals)   poll   append   push successor
//   ──────────────────────────────────────────────────
//   {1,1,2}        1      1        4   -> heap {1,2,4}
//   {1,2,4}        1      1        3   -> heap {2,3,4}
//   {2,3,4}        2      2        (none, list empty)
//   {3,4}          3      3        (none)
//   {4}            4      4        (none)
//   empty → stop
//
// Returns 1 -> 1 -> 2 -> 3 -> 4

public ListNode mergeKLists(ListNode[] lists) {
  // Heap holds at most k nodes at any time — one current head per list
  // LAMBDA (Comparator): (a, b) -> a.val - b.val IS the compare(a, b) body — a
  // negative result orders a before b, making this a MIN-heap by node value.
  // Without the lambda:
  //   new PriorityQueue<>(new Comparator<ListNode>() {
  //     public int compare(ListNode a, ListNode b) { return a.val - b.val; }
  //   });
  PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);
  // Seed with the head of each non-empty list (skip nulls)
  for (ListNode l : lists) if (l != null) heap.offer(l);

  // Dummy head makes the first append the same as every other
  ListNode dummy = new ListNode(0), tail = dummy;
  while (!heap.isEmpty()) {
    // The smallest unconsumed node is always the heap's root
    ListNode node = heap.poll();
    tail.next = node;   // link it into the merged result
    tail = node;        // advance the tail
    // Refill this list's slot with its successor so the heap stays complete
    if (node.next != null) heap.offer(node.next);
  }
  return dummy.next;
}`
  },
  {
    num: 49, lc: 2, title: 'Add Two Numbers', d: 'medium',
    bucket: 'Linked List', category: 'Math',
    url: 'https://leetcode.com/problems/add-two-numbers/',
    approach: 'Elementary-school column addition over linked lists. Because the digits are stored least-significant-first, walking both lists left-to-right adds matching place values in order, so a single carry variable threads the overflow into the next column. The loop condition continues while EITHER list still has digits OR a nonzero carry remains, which cleanly handles unequal lengths and a final carry-out (e.g. 99 + 1 growing a new most-significant node). Each new digit is sum%10 and the carry is sum/10. A dummy head avoids a first-node special case. Time is O(max(m,n)) and the output list uses O(max(m,n)) space.',
    complexity: 'O(max(m, n)) time · O(max(m, n)) space',
    code: `// Worked trace for a = 2 -> 4 -> 3 (342), b = 5 -> 6 -> 4 (465):
//
//   step  a.val  b.val  carry_in  sum  digit  carry_out
//   ─────────────────────────────────────────────────────────
//    1      2      5       0        7     7        0
//    2      4      6       0       10     0        1
//    3      3      4       1        8     8        0
//   both lists empty, carry 0 → stop
//
// Result digits appended: 7, 0, 8  →  Returns 7 -> 0 -> 8 (807)

public ListNode addTwoNumbers(ListNode a, ListNode b) {
  // Dummy head lets us append the first result digit like any other
  ListNode dummy = new ListNode(0), tail = dummy;
  int carry = 0;
  // Continue while either list has digits OR there's a leftover carry to spend
  while (a != null || b != null || carry > 0) {
    int sum = carry;          // start the column with the carry from the last column
    if (a != null) {
      sum += a.val;           // add a's digit if it still has one
      a = a.next;
    }
    if (b != null) {
      sum += b.val;           // add b's digit if it still has one
      b = b.next;
    }
    // Grade-school add: written digit is sum%10, carry-over into next column is sum/10
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = sum / 10;
  }
  return dummy.next;
}`
  },
  {
    num: 50, lc: 138, title: 'Copy List with Random Pointer', d: 'medium',
    bucket: 'Linked List', category: 'Hash Map',
    url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
    approach: 'Hash-map clone in two passes, keyed old-node to new-node. The random pointers make a single forward pass impossible because a node\'s random target may not have been created yet, so pass one allocates a bare clone of every node and records the old to new mapping. Pass two revisits each original and wires both clone.next and clone.random by looking the originals\' targets up in the map — and since map.get(null) returns null, dangling and null pointers fall out for free. This is O(n) time and O(n) space for the map. The harder in-place interleaving trick (clone nodes between originals) achieves O(1) extra space but is fiddly and error-prone.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for A -> B (A.random = B, B.random = B):
//
//   PASS 1 (clone, no links yet):
//     map = { A: A', B: B' }   // primes are the fresh clones
//
//   PASS 2 (wire next/random via map):
//     cur=A: A'.next = map.get(B) = B';  A'.random = map.get(B) = B'
//     cur=B: B'.next = map.get(null) = null; B'.random = map.get(B) = B'
//
// Returns map.get(A) = A'  (a fully independent copy)

public Node copyRandomList(Node head) {
  // Map old → new so we can resolve next/random in a second pass
  Map<Node, Node> map = new HashMap<>();
  // Pass 1: shallow-clone every node, copying only the value (no pointers yet)
  for (Node cur = head; cur != null; cur = cur.next) {
    map.put(cur, new Node(cur.val));
  }
  // Pass 2: wire up next/random on the clones by translating originals through the map
  for (Node cur = head; cur != null; cur = cur.next) {
    map.get(cur).next   = map.get(cur.next);    // map.get(null) is null → safe at the tail
    map.get(cur).random = map.get(cur.random);  // random may be null or any node — both handled
  }
  // The clone of the original head is the head of the copied list
  return map.get(head);
}`
  },
  {
    num: 51, lc: 143, title: 'Reorder List', d: 'medium', companies: ['Temu'],
    bucket: 'Linked List', category: 'Two Pointers',
    url: 'https://leetcode.com/problems/reorder-list/',
    approach: 'Three-phase in-place transform: find middle, reverse second half, then merge alternately. Phase one uses slow/fast pointers so slow lands at the left-middle on even lengths, keeping the second half no larger than the first. Phase two reverses that second half with the classic prev/curr/next flip after severing it from the first half (slow.next = null) to avoid a cycle. Phase three zips the two halves node by node, taking one from the front list then one from the reversed back list, which produces exactly the L0,Ln,L1,Ln-1 interleaving. All phases are linear and use only pointers, so the whole routine is O(n) time and O(1) space.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for head = 1 -> 2 -> 3 -> 4 -> 5:
//
//   STEP 1 find middle (slow at left-middle):
//     slow stops at 3        first half: 1->2->3 | second: 4->5
//   STEP 2 sever + reverse second half:
//     3.next = null; reverse(4->5) = 5->4   (prev = 5->4)
//   STEP 3 zip front (1->2->3) with back (5->4):
//     l1=1,l2=5 → 1->5->2 ... ; l1=2,l2=4 → 2->4->3
//     l2 becomes null → done
//
// Result: 1 -> 5 -> 2 -> 4 -> 3

public void reorderList(ListNode head) {
  // STEP 1: find the middle. For even length, slow ends at the LEFT middle
  // (so the second half is the smaller piece)
  ListNode slow = head, fast = head;
  while (fast.next != null && fast.next.next != null) {
    slow = slow.next; fast = fast.next.next;   // slow +1, fast +2 per step
  }

  // STEP 2: reverse the second half in place; sever the first half's tail
  ListNode prev = null, curr = slow.next;
  slow.next = null;  // breaks the first half's link to the second half (prevents a cycle)
  while (curr != null) {
    ListNode next = curr.next;     // save successor before relinking
    curr.next = prev; prev = curr; curr = next;   // standard three-pointer reverse
  }

  // STEP 3: zip the two halves alternately (l1 -> l2 -> l1.next -> l2.next -> ...)
  ListNode l1 = head, l2 = prev;   // l2 is the head of the reversed second half
  while (l2 != null) {
    ListNode n1 = l1.next, n2 = l2.next;   // stash both successors before rewiring
    l1.next = l2; l2.next = n1;            // weave one back-node in after the front-node
    l1 = n1; l2 = n2;                      // advance into the saved successors
  }
}`
  },
  {
    num: 52, lc: 287, title: 'Find the Duplicate Number', d: 'medium',
    bucket: 'Linked List', category: 'Two Pointers (Floyd)',
    url: 'https://leetcode.com/problems/find-the-duplicate-number/',
    approach: 'Floyd\'s tortoise & hare cycle detection on an implicit linked list. Read the array as a function i → nums[i]: each index points to another index. Because values lie in [1, n] over n+1 slots, two indices share the same target, and following the pointers must eventually revisit a node, so the chain contains a cycle whose entrance is the duplicate value. Phase 1 advances slow by one and fast by two until they collide inside the cycle. Phase 2 resets a finder pointer to the start and walks it and slow at equal speed; the classic Floyd identity proves they meet exactly at the cycle entrance, which is the duplicate. This is O(n) time and O(1) space and, unlike sorting or a hash set, never mutates the array nor uses extra memory.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [3,1,3,4,2]  (index i -> nums[i]):
//
//   phase 1 (find collision)        slow            fast
//   ───────────────────────────────────────────────────────────
//   start                           nums[0]=3       nums[0]=3
//   step                            nums[3]=4       nums[nums[3]]=nums[4]=2
//   step                            nums[4]=2       nums[nums[2]]=nums[3]=4
//   step                            nums[2]=3       nums[nums[4]]=nums[2]=3  → meet at 3
//
//   phase 2 (find entrance)         finder          slow
//   ───────────────────────────────────────────────────────────
//   start                           nums[0]=3       3 (from phase 1)
//   finder==slow already → entrance = 3
//
// Returns 3

public int findDuplicate(int[] nums) {
  // Treat the array as a linked list: index i "points to" index nums[i].
  // A duplicate means two indices point to the same target → cycle.
  int slow = nums[0], fast = nums[0];   // both pointers start at the list head (index 0)
  do {
    slow = nums[slow];              // one step at a time
    fast = nums[nums[fast]];        // two steps at a time
  } while (slow != fast);           // they meet inside the cycle

  // Phase 2: reset one pointer to the start; both walk at speed 1.
  // Their meeting point IS the cycle entrance — i.e., the duplicate value.
  int finder = nums[0];             // restart from the head while slow stays inside the cycle
  while (finder != slow) {
    finder = nums[finder];          // advance the head-walker one step
    slow = nums[slow];              // advance the cycle-walker one step (equal speed)
  }
  return finder;                    // entrance index == repeated value
}`
  },
  {
    num: 53, lc: 146, title: 'LRU Cache', d: 'medium', companies: ['Temu'],
    bucket: 'Linked List', category: 'Design',
    url: 'https://leetcode.com/problems/lru-cache/',
    approach: 'Hash map plus doubly-linked list ordered by recency, here obtained for free by subclassing LinkedHashMap in access-order mode. The map gives O(1) key lookup while the linked list records usage order; constructing the parent with accessOrder=true makes every get() and put() relink the touched entry to the most-recent end, so the head is always the least-recently-used candidate. Overriding removeEldestEntry to return size() > capacity lets the library evict that head automatically right after each insertion, preserving the size bound. Every operation is O(1) amortized because hashing and list relinking are constant work, and space is O(capacity). The hand-rolled alternative wires the same hash-map-plus-linked-list by hand, which is more code for identical behavior.',
    complexity: 'O(1) per get / put · O(capacity) space',
    code: `// Worked trace, capacity = 2 (eldest listed first → newest last):
//
//   call          map / recency order        returns   note
//   ──────────────────────────────────────────────────────────────────
//   put(1,1)      {1=1}                       -         insert
//   put(2,2)      {1=1, 2=2}                  -         insert
//   get(1)        {2=2, 1=1}                  1         access moves 1 to newest
//   put(3,3)      {1=1, 3=3}                  -         size 3>2 → evict eldest (2)
//   get(2)        {1=1, 3=3}                  -1        2 was evicted
//   put(4,4)      {3=3, 4=4}                  -         evict eldest (1)
//   get(1)        {3=3, 4=4}                  -1        1 was evicted
//
// Returns the sequence above for get() calls.

class LRUCache extends LinkedHashMap<Integer, Integer> {
  private final int capacity;                 // hard size bound that triggers eviction
  public LRUCache(int capacity) {
    // accessOrder=true makes get() also move the entry to the tail (most-recent end).
    // That's the LRU invariant for free.
    super(capacity, 0.75f, true);             // initial cap, default load factor, access-order mode
    this.capacity = capacity;                 // remember the limit for removeEldestEntry
  }
  // get → O(1) lookup; getOrDefault yields -1 for a miss and counts as an access
  public int get(int key) { return super.getOrDefault(key, -1); }
  // put → O(1) insert/update; access-order mode relinks the key to the newest end
  public void put(int key, int value) { super.put(key, value); }

  // Called by LinkedHashMap after each insert — when true is returned,
  // the eldest (least-recently-used) entry is removed automatically
  @Override
  protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
    return size() > capacity;                 // evict only once we exceed capacity
  }
}`
  },
  {
    num: 54, lc: 148, title: 'Sort List', d: 'medium', companies: ['Temu'],
    bucket: 'Linked List', category: 'Merge Sort',
    url: 'https://leetcode.com/problems/sort-list/',
    approach: 'Top-down merge sort adapted to linked lists, which suits them because splitting and merging only require pointer relinking, never random indexing. Each call splits the list into two near-equal halves with the slow/fast (tortoise & hare) technique, severing the link after slow so the two halves become independent lists. It recursively sorts each half, then merges them with a dummy-headed two-pointer walk that always splices the smaller front node, guaranteeing a stable ascending order. The recursion depth is log n and each of those levels does O(n) merge work, giving O(n log n) time; space is O(log n) for the call stack rather than the O(n) buffers an array merge sort needs. A subtle pitfall is forgetting to set prev.next = null, which leaves the halves entangled and loops forever.',
    complexity: 'O(n log n) time · O(log n) recursion',
    code: `// Worked trace for 4 → 2 → 1 → 3:
//
//   sortList(4,2,1,3)
//     split → left=(4,2)        right=(1,3)        (slow stops at node 2, sever)
//       sortList(4,2) → split left=(4) right=(2) → merge → (2,4)
//       sortList(1,3) → split left=(1) right=(3) → merge → (1,3)
//     merge (2,4) with (1,3):
//       compare 2,1 → take 1 ; 2,3 → take 2 ; 4,3 → take 3 ; tail += 4
//       result 1 → 2 → 3 → 4
//
// Returns 1 → 2 → 3 → 4

public ListNode sortList(ListNode head) {
  // 0 or 1 node is already sorted
  if (head == null || head.next == null) return head;
  // Step 1: split into two halves. slow ends at the LAST node of the left half.
  ListNode slow = head, fast = head, prev = null;   // fast moves twice as fast as slow
  while (fast != null && fast.next != null) {
    prev = slow;                  // trail one behind slow so we can cut after it
    slow = slow.next;
    fast = fast.next.next;
  }
  prev.next = null;   // sever — now 'head' and 'slow' are two independent lists
  // Step 2: recursively sort each half
  ListNode left = sortList(head);       // sort the front half
  ListNode right = sortList(slow);      // sort the back half (starts at the midpoint)
  // Step 3: merge the two sorted halves
  return merge(left, right);
}
private ListNode merge(ListNode a, ListNode b) {
  ListNode dummy = new ListNode(0), tail = dummy;   // dummy avoids head-edge cases; tail grows result
  while (a != null && b != null) {
    if (a.val <= b.val) {        // <= keeps the sort stable (equal a wins)
      tail.next = a;             // splice the smaller front node
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;            // advance the output tail
  }
  tail.next = (a != null) ? a : b;   // attach whatever remains (one list is now empty)
  return dummy.next;                 // skip the dummy to get the real head
}`
  },

  {
    num: 150, lc: 234, title: 'Palindrome Linked List', d: 'easy',
    bucket: 'Linked List', category: 'Linked List · Fast & Slow',
    url: 'https://leetcode.com/problems/palindrome-linked-list/',
    approach: 'Find the middle with slow/fast pointers, reverse the second half in place, then compare the two halves from their outer ends inward. Slow advances one node per step and fast advances two, so when fast falls off the end slow is resting at the middle node (on odd lengths) or the start of the true second half (on even lengths); reversing everything from slow onward gives a list that reads back-to-front. Walking the original front half against this reversed back half node-by-node is exactly equivalent to comparing the sequence against its own reverse, which is the definition of a palindrome. Driving the comparison loop off the reversed half\'s length is the key trick: on an odd-length list that half is one node shorter than the front, so it simply runs out first — the loop never needs to know the total length or treat the middle element as a special case, since it plays the role of both halves\' shared border. This runs in O(n) time and O(1) extra space, beating the naive approach of copying every value into an array or stack and checking it against itself, which costs O(n) space. The one thing to watch is that the reversal permanently mutates the list, so a caller who needs the original order back should reverse the tail a second time before returning (optional, and skipped here since the problem only asks for the boolean).',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for head = 1 -> 2 -> 2 -> 1:
//
//   step             slow   fast    note
//   ──────────────────────────────────────────────────
//   start             1(a)   1(a)
//   iter 1            2(b)   2(c)   fast advanced 2 nodes
//   iter 2            2(c)   null   fast.next was null, loop stops
//
//   slow rests on the second "2" (node c). Reverse c -> d:
//     before: c(2) -> d(1) -> null
//     after:  d(1) -> c(2) -> null      (secondHalf head = d)
//
//   compare front (1 -> 2) against reversed back (1 -> 2):
//     1 == 1, advance both
//     2 == 2, advance both
//     secondHalf pointer hits null -> stop, no mismatch found
//
// Returns true

public boolean isPalindrome(ListNode head) {
  // A list of 0 or 1 nodes reads the same forwards and backwards
  if (head == null || head.next == null) return true;

  // Slow/fast to find the middle: fast moves twice as far as slow, so when
  // fast runs out slow is sitting on the middle node (odd length) or the
  // start of the second half (even length).
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Reverse the second half in place starting at slow. Standard three-pointer
  // flip; no dummy node needed since we never touch the front half's links.
  ListNode prev = null, curr = slow;
  while (curr != null) {
    ListNode next = curr.next;   // stash successor before rewiring curr.next
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // prev is now the head of the reversed second half

  // Walk the original front half against the reversed back half. The reversed
  // half is the same length or one shorter, so it always runs out first (or
  // together) — the loop condition on secondHalf alone is enough to stop safely.
  ListNode firstHalf = head, secondHalf = prev;
  while (secondHalf != null) {
    // Any mismatch means the sequence isn't its own reverse
    if (firstHalf.val != secondHalf.val) return false;
    firstHalf = firstHalf.next;
    secondHalf = secondHalf.next;
  }
  // Every paired value matched all the way through — it's a palindrome
  return true;
}`
  },
  {
    num: 151, lc: 160, title: 'Intersection of Two Linked Lists', d: 'easy',
    bucket: 'Linked List', category: 'Linked List · Two Pointers',
    url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
    approach: 'Two-pointer length equalization done implicitly by switching heads. Walk pA down list A and pB down list B one step at a time; when a pointer falls off the end of its own list, redirect it to the HEAD of the other list instead of stopping. The key insight is that this switch makes both pointers travel the exact same total distance before reaching the intersection: pA covers (lenA - c) + c + (lenB - c) and pB covers (lenB - c) + c + (lenA - c), where c is the shared suffix length — the extra c cancels out and both walk lenA + lenB - c nodes overall, landing on the intersection node at the same step. If the lists never intersect, both pointers still traverse lenA + lenB nodes total and hit null simultaneously, so the loop naturally terminates with null instead of looping forever. This avoids the need to first compute both lengths and manually advance the longer list by the difference, which works but takes two extra passes and more bookkeeping. It runs in O(n + m) time and O(1) space, beating a hash-set-of-visited-nodes approach that needs O(n) extra memory.',
    complexity: 'O(n + m) time · O(1) space',
    code: `// Worked trace for A = 4 -> 1 -> 8 -> 4 -> 5,
//                    B = 5 -> 6 -> 1 -> 8 -> 4 -> 5,
// where A and B share the tail starting at the node holding 8:
//
//   step  pA (before)   pB (before)   pA==pB?   action
//   ─────────────────────────────────────────────────────────────
//    0        4              5           no      start at each head
//    1        1              6           no      advance both by 1
//    2        8              1           no      advance both by 1
//    3        4              8           no      advance both by 1
//    4        5              4           no      advance both by 1
//    5      null              5          no      pA fell off A -> jump to B head
//    6        5              null        no      pB fell off B -> jump to A head
//    7        6              4           no      advance both by 1
//    8        1              1           no      advance both by 1
//    9        8              8          yes      pA == pB == node(8) -> stop
//
// Returns the node holding 8 (the true intersection node)

public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
  // Guard the trivial case: no intersection is possible without both lists
  if (headA == null || headB == null) return null;
  // Two pointers, one per list, each starting at its own head
  ListNode pA = headA, pB = headB;
  // They meet either at the true intersection node or at null (no intersection) —
  // never loop forever because each pointer switches lists at most once.
  while (pA != pB) {
    // Walk one step, or jump to the OTHER list's head once this one runs out.
    // Switching heads (not restarting the same list) is what equalizes the
    // total distance each pointer travels, canceling out the length difference.
    pA = (pA == null) ? headB : pA.next;
    pB = (pB == null) ? headA : pB.next;
  }
  // Either the shared node (pA == pB != null) or null if the lists never intersect
  return pA;
}`
  },
  {
    num: 152, lc: 92, title: 'Reverse Linked List II', d: 'medium',
    bucket: 'Linked List', category: 'Linked List · In-place Reversal',
    url: 'https://leetcode.com/problems/reverse-linked-list-ii/',
    approach: 'Dummy head plus head-insertion (bridge-and-rewire) reversal, done in one pass with no extra list. First walk a prev pointer left-1 steps from a dummy node placed before head, so prev always lands on the node just before the sublist regardless of whether left is 1 (the dummy absorbs that edge case). Then repeatedly take the node right after curr and splice it to the front of the sublist, right after prev: save next = curr.next, unlink it with curr.next = next.next, then hook it in with next.next = prev.next and prev.next = next. Doing this right-left times threads each freed node onto the front of the growing reversed segment while curr itself never moves, so it naturally ends up as the tail connecting to the untouched remainder. The key invariant is that prev.next always points at the current head of the (partially) reversed sublist, so each iteration only needs three pointer writes and no values are ever copied. This beats the naive approach of reversing the whole list, or extracting the sublist into a new structure and splicing it back, because it touches each node exactly once and needs O(1) extra space; an equally valid alternative is to reverse the sublist with the classic three-pointer technique first and then rewire both boundary connections afterward.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for head = 1 -> 2 -> 3 -> 4 -> 5, left = 2, right = 4:
//
//   step   prev  curr  next   list after splice
//   ──────────────────────────────────────────────────────────────
//   init    1     2     -     dummy->1->2->3->4->5   (prev walked left-1=1 step)
//    1      1     2     3     dummy->1->3->2->4->5   (3 moved to front of sublist)
//    2      1     2     4     dummy->1->4->3->2->5   (4 moved to front of sublist)
//   loop ran right-left = 2 times, curr never moved
//
// Returns 1 -> 4 -> 3 -> 2 -> 5

public ListNode reverseBetween(ListNode head, int left, int right) {
  // Dummy sits before head so "prev" has somewhere valid to point even when left == 1
  ListNode dummy = new ListNode(0);
  dummy.next = head;
  ListNode prev = dummy;
  // Walk prev to the node immediately BEFORE position left (1-indexed)
  for (int i = 0; i < left - 1; i++) {
    prev = prev.next;
  }
  // curr marks the start of the sublist; it will end up as the sublist's tail
  ListNode curr = prev.next;
  // Reverse by repeatedly moving the node right after curr to the front of the sublist.
  // curr itself never advances, so it slides from head of the sublist to its tail.
  for (int i = 0; i < right - left; i++) {
    // The node we are about to relocate to the front
    ListNode next = curr.next;
    // Unlink it from its current spot, skipping over it
    curr.next = next.next;
    // Hook it in right after prev, ahead of whatever prev currently points to
    next.next = prev.next;
    // prev.next always tracks the current head of the reversed portion
    prev.next = next;
  }
  // dummy.next skips the sentinel and returns the true (possibly unchanged) head
  return dummy.next;
}`
  },
  {
    num: 153, lc: 25, title: 'Reverse Nodes in k-Group', d: 'hard',
    bucket: 'Linked List', category: 'Linked List · In-place Reversal',
    url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/',
    approach: 'Group-wise iterative reversal with a dummy head and a lookahead check. Walk a pointer k steps ahead of each group\'s start to confirm a full group of k nodes actually exists — if the pointer falls off the end early, that final short group must be left untouched, which is the detail that trips up naive recursive solutions that reverse first and patch up second. Once a full group is confirmed, reverse just those k links using the same prev/curr/next three-pointer dance as plain list reversal, then splice the reversed block back between the node before the group (tracked via a groupPrev pointer that starts at the dummy) and the head of the next group (the original first node of this group, which becomes its tail after reversal). Using a dummy node avoids a special case for rewriting the overall head when the very first group gets reversed. Advancing groupPrev to that same original-first-node keeps the loop moving forward by exactly one group each iteration. This runs in O(n) time, since every node is visited a constant number of times, and O(1) extra space, since nodes are relinked in place with no recursion stack or auxiliary buffer — the recursive formulation is equivalent in time but costs O(n/k) stack frames.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for head = 1 -> 2 -> 3 -> 4 -> 5, k = 2:
//
//   group    nodes checked   full?  reversed segment   groupPrev after   list so far
//   ────────────────────────────────────────────────────────────────────────────────
//   1st      1, 2            yes    2 -> 1             node "1"          2 -> 1 -> 3 -> 4 -> 5
//   2nd      3, 4            yes    4 -> 3             node "3"          2 -> 1 -> 4 -> 3 -> 5
//   3rd      5, (null)       no     left as-is         (loop ends)       2 -> 1 -> 4 -> 3 -> 5
//
// Returns 2 -> 1 -> 4 -> 3 -> 5

public ListNode reverseKGroup(ListNode head, int k) {
  // Dummy sentinel avoids a special case when the very first group is reversed
  // and the overall head of the list changes.
  ListNode dummy = new ListNode(0);
  dummy.next = head;
  // groupPrev is the node right before the group currently being reversed —
  // the reversed block gets spliced back in right after it.
  ListNode groupPrev = dummy;

  while (true) {
    // Look k nodes ahead WITHOUT reversing anything yet, so a short final
    // group (fewer than k nodes) can be detected and left untouched.
    ListNode kth = groupPrev;
    for (int i = 0; i < k && kth != null; i++) {
      kth = kth.next;
    }
    // Fewer than k nodes remain — this partial group stays in its original order.
    if (kth == null) break;

    // Reverse exactly this group using the standard three-pointer dance,
    // stopping the moment curr passes the group's last node (groupNext).
    ListNode groupNext = kth.next;   // first node of the NEXT group; reversal must stop here
    ListNode prev = groupNext, curr = groupPrev.next;
    while (curr != groupNext) {
      // Save curr's successor before curr.next gets overwritten below
      ListNode next = curr.next;
      curr.next = prev;   // flip this node's pointer to face backward
      prev = curr;         // advance the trailing pointer onto the node just reversed
      curr = next;         // advance the leading pointer to the saved successor
    }

    // groupPrev.next currently still points at the OLD head of this group,
    // which is now the group's TAIL after reversal — perfect as the new groupPrev.
    ListNode newGroupPrev = groupPrev.next;
    groupPrev.next = kth;        // kth was the group's last node, now its new head
    groupPrev = newGroupPrev;    // move groupPrev forward by exactly one group
  }
  // dummy.next always tracks the true head, even after the first group flips
  return dummy.next;
}`
  },
  // ─── Trees (24) ───
  {
    num: 55, lc: 226, title: 'Invert Binary Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/invert-binary-tree/',
    approach: 'Recursive post/pre-order tree mirroring. The key insight is that inverting a tree means swapping the two children of every node, and a subtree is inverted exactly when both of its children have themselves been inverted and then swapped, so the problem decomposes cleanly into identical subproblems. Each call inverts the right subtree, inverts the left subtree, and assigns them to the opposite sides; the empty tree is the base case and returns null. Saving the original left child in a temporary before overwriting it is essential, otherwise the second recursive call would operate on the already-replaced subtree and corrupt the result. Every node is visited once, giving O(n) time, and the recursion stack uses O(h) space where h is the tree height.',
    complexity: 'O(n) time · O(h) recursion space',
    code: `// Worked trace for tree     4              after invert     4
//                          / \\                            / \\
//                         2   7            →             7   2
//                        / \\ / \\                        / \\ / \\
//                       1  3 6  9                      9  6 3  1
//
//   invert(4): tmp=2; left=invert(7); right=invert(2)
//     invert(7): tmp=6; left=invert(9)=9; right=invert(6)=6  → 7 has children 9,6
//     invert(2): tmp=1; left=invert(3)=3; right=invert(1)=1  → 2 has children 3,1
//   node 4 now has left=7-subtree, right=2-subtree
//
// Returns root of [4,7,2,9,6,3,1]

public TreeNode invertTree(TreeNode root) {
  if (root == null) return null;            // empty subtree is its own mirror
  // Save left BEFORE we overwrite it with the inverted right subtree
  TreeNode tmp = root.left;                 // otherwise the second call sees the new left
  root.left = invertTree(root.right);       // inverted right subtree becomes the new left
  root.right = invertTree(tmp);             // inverted original-left becomes the new right
  return root;                              // hand this (now mirrored) node back up
}`
  },
  {
    num: 56, lc: 104, title: 'Maximum Depth of Binary Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    approach: 'Recursive depth-first height computation. The insight is the simple recurrence that a non-empty tree\'s depth equals one (for the current node) plus the larger of its two subtree depths, while the empty tree contributes zero; this holds because the longest root-to-leaf path must descend through whichever child subtree is deeper. The recursion bottoms out at null leaves returning 0 and the Math.max at each node propagates the winning branch upward, so a single post-order traversal suffices. Every node is visited exactly once, making it O(n) time, and the call stack reaches at most the tree\'s height, so space is O(h) — O(log n) for a balanced tree but O(n) for a degenerate skewed one.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for      3
//                       / \\
//                      9  20
//                        /  \\
//                       15   7
//
//   maxDepth(3) = 1 + max(maxDepth(9), maxDepth(20))
//     maxDepth(9)  = 1 + max(0, 0) = 1          (leaf)
//     maxDepth(20) = 1 + max(maxDepth(15), maxDepth(7))
//       maxDepth(15) = 1 ; maxDepth(7) = 1      (both leaves)
//       → maxDepth(20) = 1 + max(1, 1) = 2
//   → maxDepth(3) = 1 + max(1, 2) = 3
//
// Returns 3

public int maxDepth(TreeNode root) {
  if (root == null) return 0;   // empty subtree contributes no depth
  // This node counts as 1, plus the deeper of its two subtrees
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));   // longest path wins
}`
  },
  {
    num: 57, lc: 100, title: 'Same Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/same-tree/',
    approach: 'Parallel recursive structural comparison of two trees walked in lockstep. The insight is that two trees are identical iff their roots agree and their left subtrees are identical and their right subtrees are identical, which turns the whole-tree question into the same question on smaller paired subtrees. The base cases pin down the structure: two nulls at the same spot are trivially equal, while exactly one null signals a shape mismatch and short-circuits to false. When both nodes exist, the value must match and both child pairs must recurse to true. Short-circuit && stops at the first disagreement. Each pair of corresponding nodes is touched once, so it is O(n) time over the smaller tree and O(h) recursion-stack space.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for p = [1,2,3], q = [1,2,3]:
//
//   isSameTree(1,1): 1==1 ✓ → left && right
//     isSameTree(2,2): 2==2 ✓ → left && right
//       isSameTree(null,null) → true
//       isSameTree(null,null) → true        → returns true
//     isSameTree(3,3): 3==3 ✓ → left && right
//       isSameTree(null,null) → true
//       isSameTree(null,null) → true        → returns true
//   → all true
//
// Returns true

public boolean isSameTree(TreeNode p, TreeNode q) {
  // Both empty → structurally identical at this point
  if (p == null && q == null) return true;
  // Exactly one empty → mismatch
  if (p == null || q == null) return false;     // shapes already diverge here
  // Values must match, and BOTH subtree pairs must also match
  return p.val == q.val                         // current nodes agree
      && isSameTree(p.left, q.left)             // left subtrees identical
      && isSameTree(p.right, q.right);          // right subtrees identical
}`
  },
  {
    num: 58, lc: 572, title: 'Subtree of Another Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/subtree-of-another-tree/',
    approach: 'Brute-force subtree matching: a depth-first scan of root paired with a full same-tree equality test at every node. The insight is that subRoot is a subtree iff some node of root anchors an exact copy of it, so at each visited node we first attempt a complete structural-and-value comparison via the isSameTree helper, and only if that anchor fails do we recurse into the left and right children with short-circuit ||. The helper enforces matching shape and values, treating two nulls as equal and a lone null as a mismatch. With m nodes in root and n in subRoot, the comparison can cost O(n) at each of O(m) anchors, giving O(m·n) time and O(h) stack space. A linear-time alternative serializes both trees and runs KMP, but this direct version is far simpler and fast enough for the given limits.',
    complexity: 'O(m · n) time · O(h) space',
    code: `// Worked trace for root = [3,4,5,1,2], subRoot = [4,1,2]:
//
//   isSubtree(3,...): isSameTree(3,4)? no → recurse children
//     isSubtree(4,...): isSameTree(4,4)?
//        4==4, left isSameTree(1,1)✓, right isSameTree(2,2)✓ → true
//     → returns true (short-circuits the || chain)
//   → propagates true up to the root call
//
// Returns true

public boolean isSubtree(TreeNode root, TreeNode subRoot) {
  if (root == null) return false;             // ran past a leaf without anchoring a match
  // Try matching rooted exactly here, then defer to either subtree
  if (isSameTree(root, subRoot)) return true; // this node anchors an identical copy
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);   // else search deeper
}
private boolean isSameTree(TreeNode a, TreeNode b) {
  // Same logic as problem 49 — extracted as a helper
  if (a == null && b == null) return true;                    // both empty → equal
  if (a == null || b == null || a.val != b.val) return false; // shape or value mismatch
  return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);  // recurse both sides
}`
  },
  {
    num: 59, lc: 112, title: 'Path Sum', d: 'easy',
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/path-sum/',
    approach: 'Depth-first search that threads a shrinking remaining target down each path. Instead of accumulating a running sum and comparing at the end, each call subtracts the current node\'s value from the target it received and passes the residue to its children, so the problem at every node is the identical smaller question on a reduced target. The win condition is reaching a leaf — a node with no children — exactly when the residue equals that leaf\'s value, meaning the full path summed to the original target; a null pointer returns false so missing children never count as paths. The short-circuit || stops as soon as one branch succeeds. Each node is visited once for O(n) time, and the recursion stack uses O(h) space. A pitfall is testing residue == 0 at nulls instead of at leaves, which mishandles negative values and single-child nodes.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for targetSum = 22, path-bearing tree:
//
//          5            hasPathSum(5, 22)  → children get 22-5 = 17
//         / \\           hasPathSum(4, 17)  → child gets 17-4 = 13
//        4   8          hasPathSum(11,13)  → children get 13-11 = 2
//       /                 hasPathSum(7, 2): leaf, 2==7? no
//      11                 hasPathSum(2, 2): leaf, 2==2? YES → true
//     /  \\
//    7    2
//
// Returns true (path 5 → 4 → 11 → 2 sums to 22)

public boolean hasPathSum(TreeNode root, int targetSum) {
  if (root == null) return false;     // a missing child is not a valid path
  // Leaf check: path is complete here
  if (root.left == null && root.right == null) return targetSum == root.val;   // exact remainder?
  // Subtract this node's value from the running target and try both children
  return hasPathSum(root.left,  targetSum - root.val)    // succeed down the left branch...
      || hasPathSum(root.right, targetSum - root.val);   // ...or the right branch
}`
  },
  {
    num: 60, lc: 110, title: 'Balanced Binary Tree', d: 'easy',
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/balanced-binary-tree/',
    approach: 'Bottom-up DFS that returns each subtree\'s height while detecting imbalance in the same pass. The trick is a sentinel: height returns -1 the moment any subtree is unbalanced, and every caller short-circuits on seeing -1, so the failure flag bubbles to the root without recomputing heights. A naive top-down version that calls a separate height() at each node degrades to O(n²) on a skewed tree; folding the check into one height pass keeps it O(n) time, with O(h) recursion-stack space (O(n) for a degenerate chain). The pitfall is forgetting to propagate -1 before doing the abs(l-r) comparison.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for [1,2,2,3,3,null,null,4,4] (left side is deeper):
//
//        1
//       / \\
//      2   2
//     / \\
//    3   3
//   / \\
//  4   4
//
//   node   l    r    abs(l-r)   returns
//   ──────────────────────────────────────────────
//    4      0    0      0         1        leaf
//    3(L)   1    1      0         2        below node 2(L)
//    3(R)   0    0      0         1
//    2(L)   2    1      1         3
//    2(R)   0    0      0         1
//    1      3    1      2 > 1    -1        IMBALANCE → propagates up
//
// height(root) = -1, so isBalanced returns false

public boolean isBalanced(TreeNode root) {
  // -1 is the sentinel for "imbalance detected anywhere in this subtree"
  // so a single height() pass doubles as the balance check
  return height(root) != -1;
}
private int height(TreeNode node) {
  // Empty subtree has height 0 and is balanced by definition
  if (node == null) return 0;
  int l = height(node.left);
  // Short-circuit: once any subtree reports -1, propagate it all the way up
  // without touching the right side or doing more work
  if (l == -1) return -1;
  int r = height(node.right);
  // Right child unbalanced, OR this node itself violates the height-1 rule → fail
  if (r == -1 || Math.abs(l - r) > 1) return -1;
  // Balanced here: report true height = 1 + the taller child
  return 1 + Math.max(l, r);
}`
  },
  {
    num: 61, lc: 101, title: 'Symmetric Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/symmetric-tree/',
    approach: 'Recursive mirror-comparison of two subtrees at once. A tree is symmetric exactly when its left and right subtrees mirror each other, and two subtrees mirror when their roots are equal AND the OUTER pair (left.left vs right.right) mirrors AND the INNER pair (left.right vs right.left) mirrors. That cross-pairing of children is the whole insight: comparing left-with-left would test equality, not reflection. The two null base cases handle ragged shapes — both null means matching gaps, exactly one null means a structural mismatch. Every node is visited once, so O(n) time and O(h) recursion-stack space. An iterative BFS/queue variant that enqueues mirror pairs is an equivalent alternative if recursion depth is a concern.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for [1,2,2,3,4,4,3]:
//
//          1
//        /   \\
//       2     2
//      / \\   / \\
//     3   4 4   3
//
//   mirror(a, b) call        a.val b.val  outer recurse      inner recurse     result
//   ────────────────────────────────────────────────────────────────────────────────
//   mirror(2L, 2R)            2     2     mirror(3, 3)        mirror(4, 4)      true
//     mirror(3, 3)            3     3     mirror(null,null)   mirror(null,null) true
//     mirror(4, 4)            4     4     mirror(null,null)   mirror(null,null) true
//
// Top call mirror(root.left, root.right) = true → isSymmetric returns true

public boolean isSymmetric(TreeNode root) {
  // Empty tree is trivially symmetric; otherwise compare the two halves as mirrors
  return root == null || mirror(root.left, root.right);
}
private boolean mirror(TreeNode a, TreeNode b) {
  // Both gaps line up → this pair is symmetric
  if (a == null && b == null) return true;
  // Exactly one is missing → shapes differ, not a mirror
  if (a == null || b == null) return false;
  // The CROSS structure is the key: outer pair must mirror, inner pair must mirror
  // (a.left vs b.right, a.right vs b.left) — pairing same-side children would be wrong
  return a.val == b.val
      && mirror(a.left,  b.right)
      && mirror(a.right, b.left);
}`
  },
  {
    num: 62, lc: 102, title: 'Binary Tree Level Order Traversal', d: 'medium', companies: ['Temu'],
    bucket: 'Trees', category: 'BFS',
    url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    approach: 'Breadth-first search with a FIFO queue, processing the tree one full level per outer loop. The key device is snapshotting the queue size at the START of each iteration: that count is exactly how many nodes belong to the current level, so popping precisely that many — even while their children are being enqueued behind them — cleanly separates the levels. Because the queue always holds at most one or two adjacent levels, the snapshot boundary is reliable. Each node is enqueued and dequeued once, giving O(n) time; the queue can hold up to a full bottom level, so O(n) space. A DFS with an explicit depth parameter that indexes into the result list is an equivalent alternative.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for [3,9,20,null,null,15,7]:
//
//        3
//       / \\
//      9   20
//         /  \\
//        15   7
//
//   outer iter  size  pops this level   queue after      result so far
//   ─────────────────────────────────────────────────────────────────────────
//    1           1    [3]               [9, 20]          [[3]]
//    2           2    [9, 20]           [15, 7]          [[3],[9,20]]
//    3           2    [15, 7]           []               [[3],[9,20],[15,7]]
//
// Returns [[3],[9,20],[15,7]]

public List<List<Integer>> levelOrder(TreeNode root) {
  List<List<Integer>> result = new ArrayList<>();
  // No nodes → no levels
  if (root == null) return result;
  Queue<TreeNode> q = new ArrayDeque<>();
  q.offer(root);
  while (!q.isEmpty()) {
    // Snapshot the size BEFORE we start adding children — that's this level's count,
    // so we pop exactly these nodes even as their kids pile in behind them
    int size = q.size();
    List<Integer> level = new ArrayList<>(size);
    for (int i = 0; i < size; i++) {
      TreeNode node = q.poll();
      level.add(node.val);
      // Children get queued for the next round (left before right keeps reading order)
      if (node.left != null)  q.offer(node.left);
      if (node.right != null) q.offer(node.right);
    }
    // One full level finished → append it
    result.add(level);
  }
  return result;
}`
  },
  {
    num: 63, lc: 199, title: 'Binary Tree Right Side View', d: 'medium',
    bucket: 'Trees', category: 'BFS',
    url: 'https://leetcode.com/problems/binary-tree-right-side-view/',
    approach: 'Level-order BFS where, for each level, we record only the LAST node dequeued. Snapshotting the queue size at the top of each level lets us iterate that level fully and detect its final node via the index check i == size-1; that node is, by construction, the rightmost on its level and therefore the one visible from the right. Enqueuing left child before right keeps left-to-right order so the genuine rightmost lands last. This visits every node once for O(n) time and O(n) queue space. An equivalent DFS variant traverses right-subtree-first and records the first node seen at each new depth — pick whichever fits; both are O(n).',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for [1,2,3,null,5,null,4]:
//
//        1
//       / \\
//      2   3
//       \\   \\
//        5   4
//
//   level  size  nodes popped (in order)   last (i==size-1)   out so far
//   ───────────────────────────────────────────────────────────────────────
//    0      1     1                          1 (visible)       [1]
//    1      2     2, 3                        3 (visible)       [1,3]
//    2      2     5, 4                        4 (visible)       [1,3,4]
//
// Returns [1,3,4]

public List<Integer> rightSideView(TreeNode root) {
  List<Integer> out = new ArrayList<>();
  if (root == null) return out;
  Queue<TreeNode> q = new ArrayDeque<>();
  q.offer(root);
  while (!q.isEmpty()) {
    // Fix this level's node count before children are appended
    int size = q.size();
    for (int i = 0; i < size; i++) {
      TreeNode node = q.poll();
      // The LAST node we process at each level is the one visible from the right
      if (i == size - 1) out.add(node.val);
      // Left first, then right → the true rightmost node is dequeued last
      if (node.left  != null) q.offer(node.left);
      if (node.right != null) q.offer(node.right);
    }
  }
  return out;
}`
  },
  {
    num: 64, lc: 98, title: 'Validate Binary Search Tree', d: 'medium', companies: ['Temu'],
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/validate-binary-search-tree/',
    approach: 'Recursive range validation: every node must lie strictly inside an open interval (lo, hi) that encodes all ancestor constraints, not just its parent\'s. Descending left tightens the upper bound to the current value; descending right tightens the lower bound. This propagates the global BST invariant downward, so a value trapped in a right subtree but smaller than a higher ancestor is rejected — the flaw a naive parent-only check misses. Long bounds (Long.MIN/MAX) avoid overflow on Integer.MIN/MAX_VALUE nodes, and strict inequalities enforce uniqueness. One visit per node gives O(n) time and O(h) stack space. A strictly increasing in-order traversal check is an equivalent alternative.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for [5,1,4,null,null,3,6] (invalid — 3 is on 5's right side):
//
//        5
//       / \\
//      1   4
//         / \\
//        3   6
//
//   validate(node, lo, hi)        val   in (lo,hi)?        action
//   ────────────────────────────────────────────────────────────────────────
//   validate(5, -INF, +INF)        5    yes                recurse children
//     validate(1, -INF, 5)         1    yes (-INF<1<5)     ok, leaf
//     validate(4, 5, +INF)         4    NO  (4 <= lo=5)    return false  ← caught
//
// Right subtree's lower bound is 5, but 4 < 5 → returns false

public boolean isValidBST(TreeNode root) {
  // Start with the widest possible bounds; long avoids overflow on Integer.MIN/MAX_VALUE nodes
  return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
private boolean validate(TreeNode node, long lo, long hi) {
  // Empty subtree never violates the invariant
  if (node == null) return true;
  // STRICT inequality — equal keys are not allowed in a BST, and this enforces
  // EVERY ancestor's constraint at once via the carried (lo, hi) window
  if (node.val <= lo || node.val >= hi) return false;
  // Left subtree: upper bound tightens to current value. Right: lower bound tightens.
  return validate(node.left, lo, node.val)
      && validate(node.right, node.val, hi);
}`
  },
  {
    num: 65, lc: 230, title: 'Kth Smallest Element in a BST', d: 'medium',
    bucket: 'Trees', category: 'In-order traversal',
    url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
    approach: 'Iterative in-order traversal with an explicit stack. The defining property of a BST is that an in-order walk (left, node, right) visits values in ascending order, so the k-th node popped is exactly the k-th smallest — we simply decrement k on each pop and return when it hits zero. The inner loop dives all the way left while stacking ancestors; each pop then processes a node and pivots to its right subtree. Crucially we can STOP early at the k-th node, so we never need to visit the whole tree: time is O(h + k) and stack space O(h). The stack-based form avoids the recursion overhead and the need for a flag to short-circuit a recursive traversal mid-walk.',
    complexity: 'O(h + k) time · O(h) space',
    code: `// Worked trace for [3,1,4,null,2], k = 3:
//
//        3
//       / \\
//      1   4
//       \\
//        2
//
//   step  cur   stack(top→bottom)   pop   --k    action
//   ──────────────────────────────────────────────────────────────────
//   dive  3→1   [1, 3]               -     -     stack left spine
//   pop   1     [3]                  1     2     visit 1, go right(=2)
//   dive  2     [2, 3]               -     -     push 2 (no left)
//   pop   2     [3]                  2     1     visit 2, right=null
//   pop   3     []                   3     0     visit 3 → k==0, RETURN 3
//
// Returns 3

public int kthSmallest(TreeNode root, int k) {
  // Iterative in-order traversal yields values in ascending order for a BST,
  // so the k-th value we visit is the answer — and we can stop right there
  Deque<TreeNode> stack = new ArrayDeque<>();
  TreeNode cur = root;
  while (cur != null || !stack.isEmpty()) {
    // Dive as far left as possible, stacking ancestors for later return visits
    while (cur != null) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    // This pop is the next smallest value — count toward k; zero means we've arrived
    if (--k == 0) return cur.val;
    // Done with this node and its left subtree — explore its right subtree next
    cur = cur.right;
  }
  return -1; // unreachable when 1 <= k <= n
}`
  },
  {
    num: 66, lc: 235, title: 'Lowest Common Ancestor of BST', d: 'easy',
    bucket: 'Trees', category: 'BST',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    approach: 'Exploit the BST ordering to walk a single root-to-LCA path instead of searching the whole tree. At each node, if both p and q are smaller the LCA lies entirely in the left subtree so go left; if both are larger go right. The first node where p and q fall on opposite sides (or one equals the node) is the SPLIT point — neither subtree contains both, so it is their lowest common ancestor and we return it. Correctness follows from the BST invariant: the two subtrees\' value ranges are disjoint, so a split occurs at exactly one node. The walk descends at most the tree height, giving O(h) time and O(1) space iteratively, beating a generic O(n) tree LCA that ignores the ordering.',
    complexity: 'O(h) time · O(1) space',
    code: `// Worked trace for root = [6,2,8,0,4,7,9], p = 2, q = 8:
//
//          6
//        /   \\
//       2     8
//      / \\   / \\
//     0   4 7   9
//
//   root.val  p.val q.val   p,q both < ?  both > ?   action
//   ────────────────────────────────────────────────────────────────────
//      6        2     8     no (2<6)      no (8>6)   split here → return 6
//
// p and q straddle 6 → LCA is 6

public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
  // BST property lets us pick a direction without exploring both sides
  while (root != null) {
    // Both targets less than root → LCA is in the left subtree
    if      (p.val < root.val && q.val < root.val) root = root.left;
    // Both greater → right subtree
    else if (p.val > root.val && q.val > root.val) root = root.right;
    // Otherwise root is the split point (one is <= and the other is >= root),
    // so it is the lowest node ancestor to both → this is the LCA
    else return root;
  }
  return null; // unreachable when p and q are guaranteed present
}`
  },
  {
    num: 67, lc: 105, title: 'Construct Binary Tree from Preorder and Inorder', d: 'medium', companies: ['Temu'],
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
    approach: 'Recursive divide-and-conquer driven by the two traversal orders. Preorder visits root first, so consuming its entries left to right always hands us the next subtree\'s root; a shared preIdx pointer advances through preorder in exactly that order. Inorder lists left-subtree values, root, then right-subtree values, so locating the root inside inorder splits the remaining range into the left and right spans we recurse into. The one subtlety is order: build the LEFT child first so preIdx consumes preorder\'s left block before the right. A HashMap from value to inorder index makes each root lookup O(1), giving O(n) time and space; without it, scanning inorder each time degrades to O(n²).',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]:
// inMap = {9:0, 3:1, 15:2, 20:3, 7:4}
//
//   call build(lo, hi)  preIdx  val=pre[preIdx]  mid=inMap[val]  builds
//   ────────────────────────────────────────────────────────────────────────
//   build(0,4)           0→1     3                1               node 3
//     build(0,0) left    1→2     9                0               node 9 (leaf)
//     build(2,4) right   2→3     20               3               node 20
//       build(2,2) left  3→4     15               2               node 15 (leaf)
//       build(4,4) right 4→5     7                4               node 7  (leaf)
//
// Reconstructs:    3
//                 / \\
//                9   20
//                   /  \\
//                  15   7

// Shared mutable state: where we are in the preorder walk (always the next root)
private int preIdx = 0;
// Cached lookup: inorder value → its index, for O(1) split-point location
private Map<Integer, Integer> inMap;

public TreeNode buildTree(int[] preorder, int[] inorder) {
  inMap = new HashMap<>();
  // Pre-index inorder so each recursive root lookup is O(1) instead of an O(n) scan
  for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
  return build(preorder, 0, inorder.length - 1);
}
private TreeNode build(int[] pre, int lo, int hi) {
  // Empty inorder range → no subtree here
  if (lo > hi) return null;
  // Preorder always exposes the next root at the front of its remaining sequence;
  // consume it and advance the shared pointer
  int val = pre[preIdx++];
  TreeNode node = new TreeNode(val);
  // Inorder splits left/right subtrees at the root's position
  int mid = inMap.get(val);
  node.left  = build(pre, lo, mid - 1);   // left subtree comes BEFORE root in inorder
  node.right = build(pre, mid + 1, hi);   // right subtree comes AFTER — built second so
                                          // preIdx consumes the left block first
  return node;
}`
  },
  {
    num: 68, lc: 124, title: 'Binary Tree Maximum Path Sum', d: 'hard', companies: ['Garmin'],
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    approach: 'Bottom-up DFS that distinguishes two quantities at every node. The candidate answer pivoting here is left + node.val + right (a U-shape that turns at this node and cannot extend further up). But the value RETURNED to the parent is node.val + max(left, right), because a path passing through the parent may only continue down ONE branch — you cannot fork. The key trick is clamping each subtree gain to 0 with Math.max(0, ...): a negative subtree is simply snipped off rather than dragging the sum down. A global \'best\' is updated at each node so the optimum can sit anywhere in the tree, not just at the root. Each node is visited once, giving O(n) time and O(h) recursion-stack space.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for tree  [-10, 9, 20, null, null, 15, 7]:
//
//          -10
//          /  \\
//         9    20
//             /  \\
//            15    7
//
//   node  left  right  U-shape (l+val+r)   best   returns (val+max(l,r))
//   ──────────────────────────────────────────────────────────────────────
//    9     0     0       9                  9      9
//    15    0     0      15                 15     15
//    7     0     0       7                 15      7
//    20   15     7      42                 42     35   (20 + max(15,7))
//   -10    9    35      34                 42      ...
//
// Returns 42  (the path 15 → 20 → 7)

private int best;

public int maxPathSum(TreeNode root) {
  best = Integer.MIN_VALUE;   // seed below any real sum so a single node can win
  gain(root);
  return best;
}
// Returns the BEST GAIN you can extend upward (= a straight path through this node).
// Side effect: updates 'best' with the best U-shape path that pivots here.
private int gain(TreeNode node) {
  if (node == null) return 0;   // empty subtree contributes nothing
  // Clamp to 0: a negative-gain subtree should be "snipped off" rather than included
  int left  = Math.max(0, gain(node.left));
  int right = Math.max(0, gain(node.right));
  // U-shape candidate: through this node, picking up BOTH subtree gains.
  // This path turns here, so it can never be extended to the parent.
  best = Math.max(best, node.val + left + right);
  // Going upward we can only continue ONE branch (the better of the two),
  // because a path through the parent cannot fork into both children.
  return node.val + Math.max(left, right);
}`
  },
  {
    num: 69, lc: 297, title: 'Serialize and Deserialize Binary Tree', d: 'hard',
    bucket: 'Trees', category: 'Design · DFS',
    url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    approach: 'Pre-order DFS with explicit null markers. The insight is that a plain value list is ambiguous, but if you emit a sentinel \'#\' for every missing child the shape becomes fully recoverable: each \'#\' tells the reader \'stop, this branch ended\'. Serialize writes node, then left subtree, then right subtree, comma-separated. Deserialize loads the tokens into a queue and rebuilds in the SAME pre-order: poll one token — if \'#\' return null, otherwise create the node and recursively build its left then right child. Because both phases agree on order, no index bookkeeping is needed beyond the shared queue cursor. Both directions are O(n) time and O(n) space for the string plus the recursion stack.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for tree  [1, 2, 3, null, null, 4, 5]:
//
//          1
//         / \\
//        2   3
//           / \\
//          4   5
//
// serialize (pre-order, '#' = null):
//   visit 1 → "1,"  visit 2 → "1,2,"  2.left=# → "1,2,#,"  2.right=# → "1,2,#,#,"
//   visit 3 → "1,2,#,#,3,"  visit 4 → "...4,#,#,"  visit 5 → "...5,#,#,"
//   result = "1,2,#,#,3,4,#,#,5,#,#,"
//
// deserialize (poll tokens in order):
//   "1"→node, build left: "2"→node, "#"→null, "#"→null  ⇒ leaf 2
//             build right:"3"→node, "4"→leaf, "5"→leaf   ⇒ subtree 3
//
// Returns the rebuilt tree identical to the input.

// Sentinels: NULL marks a missing child; SEP delimits adjacent tokens
private static final String NULL = "#";
private static final String SEP  = ",";

public String serialize(TreeNode root) {
  StringBuilder sb = new StringBuilder();
  serializeHelper(root, sb);
  return sb.toString();
}
private void serializeHelper(TreeNode node, StringBuilder sb) {
  // Writing "#" for null preserves the tree shape so deserialize is unambiguous
  if (node == null) {
    sb.append(NULL).append(SEP);
    return;
  }
  // Pre-order: emit THIS node before descending, so the root is the first token
  sb.append(node.val).append(SEP);
  serializeHelper(node.left,  sb);   // entire left subtree next
  serializeHelper(node.right, sb);   // then the entire right subtree
}

public TreeNode deserialize(String data) {
  // Queue of tokens consumed in the SAME order serialize wrote them
  return deserializeHelper(new ArrayDeque<>(Arrays.asList(data.split(SEP))));
}
private TreeNode deserializeHelper(Deque<String> tokens) {
  String t = tokens.poll();                 // advance the shared cursor by one token
  if (NULL.equals(t)) return null;          // '#' rebuilds the recorded null child
  TreeNode node = new TreeNode(Integer.parseInt(t));
  // Same pre-order: build left subtree first, then right (matches serialize order)
  node.left  = deserializeHelper(tokens);
  node.right = deserializeHelper(tokens);
  return node;
}`
  },
  {
    num: 70, lc: 236, title: 'Lowest Common Ancestor of a Binary Tree', d: 'medium', companies: ['Temu'],
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
    approach: 'Single post-order DFS that returns a \'found\' signal up the call stack. Base case: a null subtree finds nothing, and hitting p or q returns that node as the signal. For an internal node, recurse into both children. The crux: if the left recursion returns non-null AND the right recursion returns non-null, then p and q were located in DIFFERENT subtrees, so the current node is the lowest node that contains both — return it as the LCA. If only one side is non-null, bubble that result upward; it represents either a single target or an already-found LCA from deeper down. The self-descendant case falls out naturally because matching p or q returns immediately before descending. One pass, O(n) time, O(h) stack.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for tree [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1:
//
//            3
//          /   \\
//         5     1
//        / \\   / \\
//       6   2 0   8
//          / \\
//         7   4
//
//   node  left result  right result  outcome
//   ──────────────────────────────────────────────────────────────
//    5    (== p) → 5    -             returns 5 immediately
//    1    (== q) → 1    -             returns 1 immediately
//    3    left = 5      right = 1     both non-null ⇒ 3 is the LCA
//
// Returns node 3

public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
  // Base: null → no LCA. Finding p or q → return it as a "found" signal up the stack.
  // (This also handles the self-descendant case: p ancestor-of q returns p first.)
  if (root == null || root == p || root == q) return root;
  // Search both subtrees independently
  TreeNode left  = lowestCommonAncestor(root.left,  p, q);
  TreeNode right = lowestCommonAncestor(root.right, p, q);
  // Both sides returned non-null → p and q live in DIFFERENT subtrees,
  // so THIS node is the deepest one containing both ⇒ it is the LCA
  if (left != null && right != null) return root;
  // Otherwise only one side found something — bubble that result upward
  // (it is either a lone target or an LCA discovered deeper down)
  return left != null ? left : right;
}`
  },
  {
    num: 71, lc: 543, title: 'Diameter of Binary Tree', d: 'easy', companies: ['Temu'],
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
    approach: 'Post-order DFS where each call returns the subtree\'s height in edges while a global \'diameter\' is updated as a side effect. The insight is that the longest path bending at any node equals leftDepth + rightDepth (the edge counts down each side meeting at that node), so by testing this U-shape at every node we are guaranteed to consider the true diameter wherever it lies. What we return to the parent is different — 1 + max(left, right) — because the parent can only extend through one branch, not fork into both. Computing height and updating the answer in the same traversal avoids the naive O(n^2) of recomputing depth at each node. One pass gives O(n) time and O(h) recursion-stack space.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for tree [1, 2, 3, 4, 5]:
//
//          1
//         / \\
//        2   3
//       / \\
//      4   5
//
//   node  l (left depth)  r (right depth)  l+r  diameter  returns 1+max(l,r)
//   ──────────────────────────────────────────────────────────────────────
//    4     0               0               0     0         1
//    5     0               0               0     0         1
//    2     1               1               2     2         2
//    3     0               0               0     2         1
//    1     2               1               3     3         3
//
// Returns 3  (path 4 → 2 → 1 → 3)

private int diameter;

public int diameterOfBinaryTree(TreeNode root) {
  diameter = 0;   // a single node / empty tree has diameter 0
  depth(root);
  return diameter;
}
// Returns this subtree's depth; side effect: updates 'diameter' with the longest U-shape through this node
private int depth(TreeNode node) {
  if (node == null) return 0;   // no node → contributes 0 edges
  int l = depth(node.left);     // deepest reach going left
  int r = depth(node.right);    // deepest reach going right
  // Path THROUGH this node bends here and spans l + r edges — candidate for the max
  diameter = Math.max(diameter, l + r);
  // For the parent's computation, return depth (in edges): the parent can only
  // continue down ONE branch, so pick the deeper subtree and add this edge
  return 1 + Math.max(l, r);
}`
  },

  {
    num: 154, lc: 108, title: 'Convert Sorted Array to Binary Search Tree', d: 'easy',
    bucket: 'Trees', category: 'BST · Divide & Conquer',
    url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/',
    approach: 'Recursive divide-and-conquer that turns the sort order directly into tree shape. The array is already sorted, so an in-order traversal of any BST built from it must reproduce that same sequence — the only real decision is which element becomes the root at each level. Picking the MIDDLE element of the current range as the root guarantees the left half (smaller values) becomes the left subtree and the right half (larger values) becomes the right subtree, and recursing on each half keeps splitting the range in two every call. That halving is what bounds the recursion depth to O(log n) and makes the result height-balanced, since neither side can ever hold more than one extra element than the other. A naive approach that always roots at the first or last element degenerates into a plain linked list (a valid BST, but unbalanced, with O(n) height) — choosing the midpoint is the whole trick. When the range has an even count there are two valid middle indices; either produces a correct balanced tree, just a different (equally valid) shape. Building bottom-up from a doubly linked list instead of index math is an equivalent alternative some solutions use to avoid recomputing mid.',
    complexity: 'O(n) time · O(log n) space (recursion stack)',
    code: `// Worked trace for nums = [-10, -3, 0, 5, 9]:
//
//   call build(lo, hi)   mid = (lo+hi)/2   root value   recurses into
//   ──────────────────────────────────────────────────────────────────────
//   build(0, 4)           2                 0            left=build(0,1), right=build(3,4)
//     build(0, 1)          0                -10           left=build(0,-1)=null, right=build(1,1)
//       build(1, 1)        1                -3            leaf
//     build(3, 4)          3                5             left=build(3,2)=null, right=build(4,4)
//       build(4, 4)        4                9              leaf
//
// Reconstructs:        0
//                     /   \\
//                  -10     5
//                     \\      \\
//                    -3       9
//
// In-order of this tree is -10, -3, 0, 5, 9 — matches the input, confirming BST validity

public TreeNode sortedArrayToBST(int[] nums) {
  // Kick off the recursion over the full array range
  return build(nums, 0, nums.length - 1);
}

private TreeNode build(int[] nums, int lo, int hi) {
  // Empty range (lo has crossed past hi) — no subtree here
  if (lo > hi) return null;
  // Middle of the current range becomes this subtree's root. Splitting here — rather
  // than always taking lo or hi — is what keeps both sides within one node of each
  // other in size, so the recursion depth (and resulting tree height) stays O(log n).
  int mid = lo + (hi - lo) / 2;
  TreeNode node = new TreeNode(nums[mid]);
  // Everything left of mid is smaller (array is sorted) — becomes the left subtree
  node.left = build(nums, lo, mid - 1);
  // Everything right of mid is larger — becomes the right subtree
  node.right = build(nums, mid + 1, hi);
  return node;
}`
  },
  {
    num: 155, lc: 103, title: 'Binary Tree Zigzag Level Order Traversal', d: 'medium',
    bucket: 'Trees', category: 'Tree · BFS',
    url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/',
    approach: 'Standard level-order BFS with one twist: alternate the reading direction of every other level. Snapshot the queue size at the top of each outer iteration exactly as in plain level-order traversal — that count isolates the current level even as its children get enqueued behind it. The key insight is that reversing the ORDER a level is emitted in is purely a presentation step; it does not change which nodes belong to that level or how their children get discovered, so the underlying traversal (always enqueue left-then-right, always dequeue in FIFO order) stays identical to #102. A boolean flag toggled once per level decides whether that level\'s values get appended to the end of a list or inserted at the front (or, cheaper, whether the finished level list gets reversed before being added to the result). Naively trying to alternate the traversal itself — swapping enqueue order or using two stacks per level — works but is harder to reason about and more error-prone than just flipping a flag on an already-correct BFS. Each node is still enqueued and dequeued exactly once, so the algorithm remains O(n) time and O(n) space. An equivalent alternative uses two stacks (current level / next level), pushing children in an order that depends on the current direction, which naturally reverses alternate levels without a post-hoc list reversal.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for [3,9,20,null,null,15,7]:
//
//        3
//       / \\
//      9   20
//         /  \\
//        15   7
//
//   outer iter  size  leftToRight  popped (FIFO)   level emitted     result so far
//   ──────────────────────────────────────────────────────────────────────────────
//    1           1     true         [3]             [3]               [[3]]
//    2           2     false        [9, 20]         [20, 9]           [[3],[20,9]]
//    3           2     true         [15, 7]         [15, 7]           [[3],[20,9],[15,7]]
//
// Returns [[3],[20,9],[15,7]]

public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
  List<List<Integer>> result = new ArrayList<>();
  // No nodes → no levels, nothing to traverse
  if (root == null) return result;
  Queue<TreeNode> q = new ArrayDeque<>();
  q.offer(root);
  // Level 0 reads left-to-right; this flips every iteration below
  boolean leftToRight = true;
  while (!q.isEmpty()) {
    // Snapshot the size BEFORE enqueuing children — same trick as plain level-order:
    // it's exactly how many nodes belong to this level, however we choose to emit them
    int size = q.size();
    List<Integer> level = new LinkedList<>();
    for (int i = 0; i < size; i++) {
      TreeNode node = q.poll();
      // The traversal itself never changes direction — always FIFO dequeue,
      // always left-child-then-right-child enqueue. Only the OUTPUT order flips.
      if (leftToRight) {
        level.add(node.val);
      } else {
        // Front-insert reverses this level's order without touching how children
        // are discovered, so the rest of the tree is explored exactly as normal
        level.add(0, node.val);
      }
      if (node.left != null)  q.offer(node.left);
      if (node.right != null) q.offer(node.right);
    }
    result.add(level);
    // Toggle direction for the next level down
    leftToRight = !leftToRight;
  }
  return result;
}`
  },
  {
    num: 156, lc: 113, title: 'Path Sum II', d: 'medium',
    bucket: 'Trees', category: 'Tree · DFS Backtracking',
    url: 'https://leetcode.com/problems/path-sum-ii/',
    approach: 'DFS with backtracking that maintains one mutable path list shared across the whole recursion, instead of copying a new list at every call. Each call appends the current node, subtracts its value from the remaining target, and recurses into both children with that reduced target; when a leaf is reached with residue equal to that leaf\'s value, the shared path is exactly the root-to-leaf sequence that sums to targetSum, so it gets copied into the result. The key discipline is that every append is undone with a matching remove of the last element after both children return, so siblings and ancestors never see stale entries left over from an unrelated branch — this is what makes the shared-list trick safe. Copying the list only at a successful leaf (via new ArrayList<>(path)) rather than at every call keeps the extra work proportional to the number of valid paths, not the number of nodes visited. A naive alternative that passes a brand-new list (or a running sum) into each recursive call is correct too, but allocates a list at every node, doing much more copying for equivalent output. The whole tree is visited once, so this runs in O(n) time overall, plus O(n) extra for copying out valid paths in the worst case (a tree where every path qualifies), and O(h) for the recursion stack, where h is the tree height.',
    complexity: 'O(n) time · O(h) space (excluding the output)',
    code: `// Worked trace for targetSum = 22, path-bearing tree:
//
//          5            path=[5]     remaining after 5  = 17
//         / \\           path=[5,4]   remaining after 4  = 13
//        4   8          path=[5,4,11] remaining after 11 = 2
//       /                  left  7: leaf, 2==7? no        -> backtrack, path=[5,4,11]
//      11                   right 2: leaf, 2==2? YES      -> record [5,4,11,2]
//     /  \\                backtrack path back to [5,4], then to [5], then to []
//    7    2               node 8: path=[5,8], remaining 22-5-8=9, leaf 8==9? no (no such leaf here)
//
// Returns [[5, 4, 11, 2]]

public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
  List<List<Integer>> result = new ArrayList<>();
  // One list reused across the whole recursion; entries are added/removed as we descend/backtrack
  dfs(root, targetSum, new ArrayList<>(), result);
  return result;
}

private void dfs(TreeNode node, int remaining, List<Integer> path, List<List<Integer>> result) {
  // Nothing to add on a null child — mirrors the base case in the single-path version
  if (node == null) return;
  // Commit to this node being part of the current candidate path
  path.add(node.val);
  // Reduce the target by this node's value so children solve the identical smaller problem
  remaining -= node.val;
  // Leaf check: a path can only "complete" at a leaf, never partway through
  if (node.left == null && node.right == null) {
    // Exact match means path (root..this leaf) sums to the original targetSum
    if (remaining == 0) {
      // Copy now, not a reference — path keeps mutating as the recursion continues
      result.add(new ArrayList<>(path));
    }
  } else {
    // Explore both children with the reduced target; each may itself branch further
    dfs(node.left, remaining, path, result);
    dfs(node.right, remaining, path, result);
  }
  // Undo this node's contribution before returning to the parent call.
  // Without this, siblings and later branches would see stale nodes from this branch.
  path.remove(path.size() - 1);
}`
  },
  {
    num: 157, lc: 129, title: 'Sum Root to Leaf Numbers', d: 'medium',
    bucket: 'Trees', category: 'Tree · DFS',
    url: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/',
    approach: 'Depth-first search that carries a running number down from the root instead of assembling and summing strings afterward. At each node, fold the accumulated value one decimal digit to the left and drop in the current node\'s digit: number = number * 10 + node.val — the same trick used to build an integer from a digit stream left-to-right. A leaf is the win condition: with no children left to extend the digit string, whatever number has accumulated by that point IS one full root-to-leaf number, so it gets added straight into a running total. Passing the partial number down as a parameter (rather than storing it on the node or in a shared field) keeps each recursive branch\'s state independent, so sibling subtrees never see each other\'s digits. A null child simply contributes 0 to the total, which lets the two recursive calls be summed unconditionally without special-casing missing children. Each node is visited exactly once, giving O(n) time, and the call stack depth is the tree height, giving O(h) space. Naively converting each path to a String and parsing it back to an int would waste time on string allocation and boxing for no benefit; carrying the running int is strictly cheaper and avoids the risk of leading-zero or overflow surprises. An equivalent alternative is an explicit iterative DFS with a stack of (node, partialNumber) pairs, which avoids recursion but tracks the exact same state.',
    complexity: 'O(n) time · O(h) space',
    code: `// Worked trace for tree [4,9,0,5,1] (root 4, left child 9, right child 0, 9's children 5 and 1):
//
//          4
//         / \\
//        9   0
//       / \\
//      5   1
//
//   call                  number in   number out (node.val folded in)   action
//   ────────────────────────────────────────────────────────────────────────────────
//   dfs(4, 0)              0           0*10+4  = 4                       recurse both children with 4
//   dfs(9, 4)              4           4*10+9  = 49                      recurse both children with 49
//   dfs(5, 49)             49          49*10+5 = 495                     leaf → return 495
//   dfs(1, 49)             49          49*10+1 = 491                     leaf → return 491
//   dfs(9, 4) total                                                      495 + 491 = 986
//   dfs(0, 4)              4           4*10+0  = 40                      leaf → return 40
//   dfs(4, 0) total                                                      986 + 40 = 1026
//
// Returns 1026 (paths 4-9-5=495, 4-9-1=491, 4-0=40; 495+491+40=1026)

public int sumNumbers(TreeNode root) {
  // Kick off the walk with an empty accumulated number
  return dfs(root, 0);
}

private int dfs(TreeNode node, int number) {
  // A null child contributes nothing to the sum — lets the caller add both
  // recursive results unconditionally instead of special-casing missing children.
  if (node == null) return 0;
  // Shift the accumulated digits left one place and append this node's digit,
  // the same left-to-right construction used to parse an integer from text.
  number = number * 10 + node.val;
  // Leaf reached: no more digits to append, so this IS one complete root-to-leaf number.
  if (node.left == null && node.right == null) return number;
  // Not a leaf yet — keep extending the same running number down both subtrees,
  // then combine whatever each branch resolves to (their own completed leaf sums).
  return dfs(node.left, number) + dfs(node.right, number);
}`
  },
  {
    num: 158, lc: 617, title: 'Merge Two Binary Trees', d: 'easy',
    bucket: 'Trees', category: 'Tree · DFS',
    url: 'https://leetcode.com/problems/merge-two-binary-trees/',
    approach: 'Simultaneous pre-order DFS over both trees, building (or mutating into) a merged tree as the recursion unwinds. At each call, if either node is null the merge collapses to just the other tree\'s subtree — that is the base case, and it is what lets the trees be different shapes: a branch present in only one tree is copied over untouched instead of forcing an artificial zero-node. When both nodes exist, their values are summed into the surviving node and the function recurses on the two left children and the two right children independently, wiring the results back as root1.left and root1.right. The key insight is that merging is entirely local and shape-driven: there is no need to know sibling values or tree depth, only whether a node exists on each side, so a single pass suffices with no auxiliary bookkeeping. Reusing root1 as the output node avoids allocating a third tree, though an interview-safe non-mutating variant instead allocates fresh TreeNode(val) objects if the inputs must stay intact. Each node pair is visited once, giving O(min(m, n)) time — nodes beyond the smaller tree\'s structure are never touched, just linked in directly — and O(min(m, n)) space for the recursion stack in the worst case of two skewed trees. An equivalent alternative is an iterative version using an explicit stack (or two synchronized queues for BFS) that pushes pairs of nodes and performs the same null-check-then-sum logic without recursion, useful when stack depth is a concern.',
    complexity: 'O(min(m, n)) time · O(min(m, n)) space',
    code: `// Worked trace for root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]:
//
//   root1:        root2:            merged (root1 reused):
//       1              2                    3
//      / \\            / \\                  / \\
//     3   2          1   3                4   5
//    /                \\   \\              /  \\   \\
//   5                  4    7            5    4    7
//
//   call                          n1    n2   action
//   ──────────────────────────────────────────────────────────
//   mergeTrees(1, 2)              1     2    sum=3, recurse L/R
//   mergeTrees(3, 1)  [left]      3     1    sum=4, recurse L/R
//   mergeTrees(5, null) [L.L]     5     null n1 null → return 5 (copy)
//   mergeTrees(null, 4) [L.R]     null  4    n2 null → return 4 (copy)
//   mergeTrees(2, 3)  [right]     2     3    sum=5, recurse L/R
//   mergeTrees(null,null)[R.L]    null  null both null → return null
//   mergeTrees(null, 7) [R.R]     null  7    n1 null → return 7 (copy)
//
// Returns the merged tree [3,4,5,5,4,null,7]

public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
  // If one side is missing, the merge is just whatever remains on the other side —
  // this is what lets the two trees have completely different shapes.
  if (root1 == null) return root2;
  if (root2 == null) return root1;
  // Both nodes exist: fold root2's value into root1 so no third tree is allocated.
  root1.val += root2.val;
  // Recurse independently down each side; each call only needs its own pair of nodes,
  // never siblings or ancestors, so the merge can be computed in a single top-down pass.
  root1.left = mergeTrees(root1.left, root2.left);
  root1.right = mergeTrees(root1.right, root2.right);
  // root1 now IS the merged subtree rooted here
  return root1;
}`
  },
  {
    num: 159, lc: 114, title: 'Flatten Binary Tree to Linked List', d: 'medium', companies: ['Garmin'],
    bucket: 'Trees', category: 'Tree · Preorder',
    url: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/',
    approach: 'In-place rewiring that threads the tree into a right-leaning list, following preorder order, using O(1) extra space. Walk a cursor down the tree; whenever the cursor has a left child, that left subtree must be spliced in between the cursor and its current right subtree so the final order stays root, left, right. Find the rightmost node of the left subtree (its preorder predecessor of whatever comes after the left subtree finishes) by walking right pointers, attach the cursor\'s original right subtree there, then swing the whole left subtree up into the right pointer and clear left. Advancing the cursor into the (now relinked) right child repeats the process one node at a time until every node has been folded down, without ever recursing or allocating a stack, list, or extra tree nodes. The naive alternative — a recursive preorder traversal into an ArrayList of nodes, then a second pass re-linking left = null, right = next — gets the same result but costs O(n) auxiliary space for the list (or O(h) recursion stack) where this approach spends none. A Morris-traversal mindset is exactly what\'s at play here: use the otherwise-idle right pointers of the predecessor as temporary threads instead of a stack.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for root = [1,2,5,3,4,null,6]:
//
//         1                  1                    1
//        / \\                 \\                    \\
//       2   5      -->        2          -->        2
//      / \\   \\               / \\                   \\
//     3   4   6              3   4                   3
//                                 \\                   \\
//                                  5                    4
//                                   \\                    \\
//                                    6                     5
//                                                           \\
//                                                            6
//
//   cur   cur.left   rightmost of left   predecessor.right = cur.right   cur.right = cur.left   cur.left   next cur
//   ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
//   1     2          4                   4.right = 5                    1.right = 2             null       2
//   2     3          3                   3.right = 4                    2.right = 3              null       3
//   3     null       -                   -                               -                        -          4
//   4     null       -                   -                               -                        -          5
//   5     null       -                   -                               -                        -          6
//   6     null       -                   -                               -                        -          null (done)
//
// Returns the tree rewired in place into 1 -> 2 -> 3 -> 4 -> 5 -> 6 (all via .right, .left == null)

public void flatten(TreeNode root) {
  // Cursor walks the tree top to bottom; each iteration folds one node's left subtree away
  TreeNode cur = root;
  while (cur != null) {
    if (cur.left != null) {
      // The left subtree must end up BEFORE the right subtree in the final list,
      // so find where the left subtree's preorder traversal would finish: its rightmost node
      TreeNode rightmost = cur.left;
      while (rightmost.right != null) {
        rightmost = rightmost.right;
      }
      // Splice cur's original right subtree in after the left subtree finishes —
      // this is what preserves the correct preorder order without a second pass
      rightmost.right = cur.right;
      // Move the entire left subtree up into the right pointer; it now leads the chain
      cur.right = cur.left;
      // Left must be null on every node in the final singly linked shape
      cur.left = null;
    }
    // Whether or not a left subtree existed, advance into the (possibly just-relinked) right child
    cur = cur.right;
  }
}`
  },
  {
    num: 160, lc: 314, title: 'Binary Tree Vertical Order Traversal', d: 'medium', companies: ['Garmin'],
    bucket: 'Trees', category: 'Tree · BFS + Hash Map',
    url: 'https://leetcode.com/problems/binary-tree-vertical-order-traversal/',
    approach: 'Assign every node a column index — the root is column 0, a left child is parent-column minus 1, a right child is parent-column plus 1 — then group node values by that column and read the groups out from leftmost to rightmost column. The technique is a standard level-order BFS (queue holds node+column pairs) that buckets each dequeued value into a TreeMap<Integer, List<Integer>> keyed by column; the sorted TreeMap gives the left-to-right column order for free once traversal finishes. The reason BFS (not DFS) is essential: within a single column, nodes from a shallower level must be listed before nodes from a deeper level, and BFS visits level-by-level so values land in each bucket in exactly that top-to-bottom order; a DFS would reach some deep left-column node before a shallow right-column node lands in the same bucket, corrupting the vertical order. Enqueuing the left child before the right child at every step also resolves the remaining tie — two nodes in the same column on the SAME level — by guaranteeing the left one is appended to the bucket first. Each node is visited once and each column index requires O(1) work to update, so this runs in O(n log n) time overall (the log n comes from TreeMap insertions/iteration; using a HashMap plus tracking min/max column and sorting once at the end gets it down to O(n) time, O(n) space). A DFS with an explicit (row, column) pair recorded per node and a stable sort by (column, row) afterward is an equivalent alternative.',
    complexity: 'O(n log n) time · O(n) space',
    code: `// Worked trace for root = [3,9,20,null,null,15,7]:
//
//         3                columns:  3->0   9->-1   20->1
//        / \\                        15->0   7->2
//       9   20
//          /  \\
//         15   7
//
//   dequeued  col  queue enqueued (child, col)     columns map after
//   ─────────────────────────────────────────────────────────────────────
//   3          0   (9,-1) (20,1)                   {0:[3]}
//   9         -1   (none)                          {-1:[9], 0:[3]}
//   20         1   (15,0) (7,2)                     {-1:[9], 0:[3], 1:[20]}
//   15         0   (none)                          {-1:[9], 0:[3,15], 1:[20]}
//   7          2   (none)                          {-1:[9], 0:[3,15], 1:[20], 2:[7]}
//
// TreeMap iterates keys ascending: -1, 0, 1, 2
// Returns [[9],[3,15],[20],[7]]

public List<List<Integer>> verticalOrder(TreeNode root) {
  List<List<Integer>> result = new ArrayList<>();
  // Nothing to traverse — no columns to report
  if (root == null) return result;
  // Column -> values in that column, top-to-bottom. TreeMap keeps keys sorted
  // ascending so the final iteration already yields leftmost-to-rightmost order.
  Map<Integer, List<Integer>> columns = new TreeMap<>();
  // BFS queue carries the node paired with the column it belongs to,
  // since column is a property of the path taken, not of the node itself.
  Queue<Object[]> queue = new ArrayDeque<>();
  queue.offer(new Object[]{ root, 0 });
  while (!queue.isEmpty()) {
    Object[] entry = queue.poll();
    TreeNode node = (TreeNode) entry[0];
    int col = (int) entry[1];
    // Appending here (not overwriting) is what accumulates every node that
    // shares a column; BFS order guarantees shallower rows are appended first.
    // LAMBDA (mapping Function): k -> new ArrayList<>() is the factory
    // computeIfAbsent invokes ONLY when 'col' is absent; its return becomes the
    // new list. Without the lambda:
    //   if (!columns.containsKey(col)) columns.put(col, new ArrayList<>());
    //   columns.get(col).add(node.val);
    columns.computeIfAbsent(col, k -> new ArrayList<>()).add(node.val);
    // Left shifts the column left, right shifts it right — this is the whole
    // definition of "vertical column" for this problem.
    // Left is enqueued before right so two same-column nodes on the same level
    // still land in left-to-right order within their bucket.
    if (node.left != null)  queue.offer(new Object[]{ node.left, col - 1 });
    if (node.right != null) queue.offer(new Object[]{ node.right, col + 1 });
  }
  // TreeMap.values() walks keys in ascending order — exactly leftmost to rightmost
  result.addAll(columns.values());
  return result;
}`
  },
  // ─── Tries (5) ───
  {
    num: 215, lc: 116, title: 'Populating Next Right Pointers in Each Node', d: 'medium',
    bucket: 'Trees', category: 'Tree · Level Links',
    url: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/',
    approach: 'Use the next pointers already written on one level as the traversal structure for the level below, which removes the queue that a normal BFS would need and brings the space cost down to O(1). The tree is perfect, so every non-leaf has both children, and exactly two kinds of link have to be created for each node on the current level: the internal one, node.left.next = node.right, which is always available locally; and the cross-parent one, node.right.next = node.next.left, which is available precisely because the current level was already threaded on the previous iteration. Walking the current level via next until it runs out wires the entire level below, then the traversal drops to leftmost.left and repeats. The loop stops when leftmost.left is null — that is, on reaching the last level, whose nodes have no children to connect and whose own next pointers were set one iteration earlier. A level-order BFS with a queue is the obvious alternative and is perfectly correct, but it carries up to n/2 nodes in memory; this carries two pointers.',
    complexity: 'O(n) time · O(1) space',
    code: `// Node definition for this problem:
//   class Node { int val; Node left, right, next; }
//
// Worked trace for the perfect tree
//        1
//      /   \\
//     2     3
//    / \\   / \\
//   4   5 6   7
//
//   leftmost = 1: head=1 -> 2.next = 3          (internal)
//                          (1.next is null, no cross link)
//   leftmost = 2: head=2 -> 4.next = 5          (internal)
//                          5.next = 2.next.left = 6   (cross-parent)
//                 head=3 -> 6.next = 7          (internal)
//                          (3.next is null)
//   leftmost = 4: 4.left is null -> stop
//
// Level links: 1 / 2->3 / 4->5->6->7

public Node connect(Node root) {
  Node leftmost = root;

  // Stop once the current level has no children — that last level was already
  // threaded during the previous iteration.
  while (leftmost != null && leftmost.left != null) {
    // Walk the current level using the next pointers written last round.
    // This is what replaces the BFS queue and makes the space O(1).
    Node head = leftmost;
    while (head != null) {
      // Internal link — both children share a parent, always available
      head.left.next = head.right;
      // Cross-parent link — reachable only because THIS level is already
      // threaded, letting us hop to the neighbouring parent's left child.
      if (head.next != null) {
        head.right.next = head.next.left;
      }
      head = head.next;
    }
    // Drop to the level we just wired up. The tree is perfect, so its
    // left-most node is exactly leftmost.left.
    leftmost = leftmost.left;
  }
  return root;
}`
  },
  {
    num: 112, lc: 1268, title: 'Search Suggestions System', d: 'medium', companies: ['Garmin'],
    bucket: 'Tries', category: 'String · Trie',
    url: 'https://leetcode.com/problems/search-suggestions-system/',
    approach: 'Sort-and-scan. Sort the products lexicographically once up front; then for each growing prefix of the search word, scan the sorted list and collect the first three names that start with that prefix. The correctness insight is that in sorted order the FIRST matches encountered are automatically the lexicographically smallest, so no extra ranking is needed — and we can break the scan as soon as three are gathered. Sorting costs O(n log n); each of the m prefixes scans the n products, so queries cost O(m·n) string-prefix comparisons with O(1) extra space beyond the output. A Trie that caches the three smallest words per node, or binary search on the sorted array, optimizes the query phase, but sort-and-scan is clean and usually sufficient.',
    complexity: 'O(n log n + m·n) time · O(1) extra space',
    code: `// Worked trace for products = ["mobile","mouse","moneypot","monitor","mousepad"],
//                  searchWord = "mouse":
//
// After Arrays.sort:
//   ["mobile","moneypot","monitor","mouse","mousepad"]
//
//   prefix   first ≤3 products that startsWith(prefix)
//   ──────────────────────────────────────────────────────────────
//   "m"      mobile, moneypot, monitor
//   "mo"     mobile, moneypot, monitor
//   "mou"    mouse, mousepad
//   "mous"   mouse, mousepad
//   "mouse"  mouse, mousepad
//
// Returns [[mobile,moneypot,monitor],[mobile,moneypot,monitor],
//          [mouse,mousepad],[mouse,mousepad],[mouse,mousepad]]

public List<List<String>> suggestedProducts(String[] products, String searchWord) {
  // Sort alphabetically: for any prefix, the first matches found are the 3 smallest,
  // so we never need an explicit ranking step
  Arrays.sort(products);
  List<List<String>> result = new ArrayList<>();
  StringBuilder prefix = new StringBuilder();
  // One iteration per typed character → one suggestion list per growing prefix
  for (char c : searchWord.toCharArray()) {
    prefix.append(c);                          // prefix typed so far
    List<String> matches = new ArrayList<>();
    for (String p : products) {
      // startsWith respects sorted order: earliest matches are smallest
      if (p.startsWith(prefix.toString())) {
        matches.add(p);
        if (matches.size() == 3) break;        // never need more than 3 suggestions
      }
    }
    result.add(matches);
  }
  return result;
}`
  },
  {
    num: 72, lc: 208, title: 'Implement Trie (Prefix Tree)', d: 'medium',
    bucket: 'Tries', category: 'Design',
    url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    approach: 'A 26-ary tree where each node holds a fixed array of 26 child pointers (one per lowercase letter) plus an \'end\' boolean marking that a complete word terminates there. Insert walks the word character by character, lazily allocating any missing child node, then flags the final node as a word end. A shared find() helper walks a string and returns the node it lands on or null if the path breaks. The crucial distinction: search must reach a node AND have its end flag set (so a stored prefix like \'app\' is not mistaken for the word \'apple\'), whereas startsWith only needs the path to exist regardless of the flag. Every operation is O(L) in the key length, independent of how many words are stored, with total space O(L·N) across all inserted words.',
    complexity: 'O(L) per op (L = word length) · O(L · N) total space',
    code: `// Worked trace: insert("apple"), then the three queries.
//
// Trie after insert("apple")  (end flag shown as *):
//   root -a-> -p-> -p-> -l-> -e(*)
//
//   call                 find() lands on   end flag   result
//   ─────────────────────────────────────────────────────────────
//   search("apple")      node 'e'          true       true
//   search("app")        node 'p' (2nd)    false      false  (path exists, not a word)
//   startsWith("app")    node 'p' (2nd)    n/a        true   (path exists, flag ignored)
//
// Returns true, false, true respectively.

class Trie {
  // 26 children covers lowercase ASCII letters; 'end' marks a complete word
  private static class Node {
    Node[] children = new Node[26];
    boolean end;
  }
  private final Node root = new Node();

  public void insert(String word) {
    Node cur = root;
    for (char c : word.toCharArray()) {
      int i = c - 'a';                              // map letter → slot 0..25
      // Lazily create the path so we only allocate nodes actually used
      if (cur.children[i] == null) cur.children[i] = new Node();
      cur = cur.children[i];
    }
    cur.end = true;   // mark the terminal node as a real word, not just a prefix
  }
  // search: must land on a node AND it must be flagged as a word end
  public boolean search(String word)     { Node n = find(word); return n != null && n.end; }
  // startsWith: just needs the path to exist (no end flag required)
  public boolean startsWith(String pref) { return find(pref) != null; }

  // Shared traversal — returns the node at the end of the given string, or null
  private Node find(String s) {
    Node cur = root;
    for (char c : s.toCharArray()) {
      cur = cur.children[c - 'a'];   // step down one edge
      if (cur == null) return null;  // path breaks → string not present
    }
    return cur;
  }
}`
  },
  {
    num: 73, lc: 211, title: 'Design Add and Search Words Data Structure', d: 'medium',
    bucket: 'Tries', category: 'Design · DFS',
    url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
    approach: 'A Trie for storage combined with backtracking DFS for the wildcard search. addWord is the standard Trie insert: walk the word, allocate missing 26-ary children, flag the last node as a word end. The search insight is that a literal character forces a single branch — follow only that child — but a \'.\' must try EVERY existing child at that level, succeeding if any branch leads to a full match. The DFS carries the current node and string index; it returns at index == length only if that node\'s end flag is set, so the query length matches a stored word exactly. A literal add/lookup is O(L); a query with k wildcards can fan out to O(L·26^k) nodes in the worst case, which is why wildcard queries are the costly path while literal ones stay linear.',
    complexity: 'O(L) add · O(L · 26ⁿ) worst-case search (n = wildcards)',
    code: `// Worked trace: addWord("bad"), addWord("dad"), addWord("mad"); then queries.
//
// Trie (end flag = *):
//   root -b-> -a-> -d(*)
//        -d-> -a-> -d(*)
//        -m-> -a-> -d(*)
//
//   search("pad")  i0 'p' → root.children['p'] is null            → false
//   search("bad")  i0 'b' i1 'a' i2 'd' i3 end & node.end=true    → true
//   search(".ad")  i0 '.' tries b,d,m children → each → "ad" ✓    → true
//   search("b..")  i0 'b' i1 '.' tries 'a' i2 '.' tries 'd' end ✓ → true
//
// Returns false, true, true, true respectively.

class WordDictionary {
  // 26-ary Trie node; 'end' marks where an inserted word terminates
  static class Node {
    Node[] children = new Node[26];
    boolean end;
  }
  private final Node root = new Node();

  public void addWord(String word) {
    Node cur = root;
    for (char c : word.toCharArray()) {
      int i = c - 'a';
      // Lazily build the path, one node per character
      if (cur.children[i] == null) cur.children[i] = new Node();
      cur = cur.children[i];
    }
    cur.end = true;   // flag the final node so exact-length matches succeed
  }
  public boolean search(String word) { return dfs(root, word, 0); }

  // DFS to handle wildcards — "." forks into all current children
  private boolean dfs(Node node, String w, int i) {
    if (node == null) return false;        // path already broke → dead end
    // Reached end of query string — must be sitting exactly on a stored word
    if (i == w.length()) return node.end;
    char c = w.charAt(i);
    if (c == '.') {
      // Wildcard: try every child branch; succeed if ANY sub-search succeeds
      for (Node child : node.children)
        if (dfs(child, w, i + 1)) return true;
      return false;                        // no child completed a match
    }
    // Concrete char: follow only that one branch (linear, no fan-out)
    return dfs(node.children[c - 'a'], w, i + 1);
  }
}`
  },

  {
    num: 161, lc: 212, title: 'Word Search II', d: 'hard',
    bucket: 'Tries', category: 'Trie · DFS',
    url: 'https://leetcode.com/problems/word-search-ii/',
    approach: 'Build one Trie from all target words first, then run a single DFS sweep over the board instead of re-searching the grid once per word. Each Trie node caches the full word at the node where it terminates, so the moment a DFS path lands on a node with a non-null word, that word can be recorded immediately without re-walking or re-joining characters. The key optimization is pruning: after collecting a match, null out that node\'s word so the same word is never added twice, and after a DFS branch returns, if the child node it just visited turned into a leaf with no word of its own, unlink it from the parent so future searches from other cells skip that dead branch entirely. Boards are marked visited by temporarily overwriting the cell with a sentinel character and restoring it on backtrack, avoiding a separate boolean grid. Searching per word with a fresh board DFS (call the existing Word Search I routine once per word) would be O(words · rows · cols · 4^L) and re-walks shared prefixes redundantly; merging the words into a Trie lets overlapping prefixes share work across the single sweep, which is what makes this tractable at up to 3×10^4 words. Overall cost is O(rows · cols · 4^L) for the DFS sweep plus O(sum of word lengths) to build the Trie, where L is the longest word. An equivalent alternative is a Trie keyed by boolean end-flags plus a separate StringBuilder path instead of caching the word string on the node, though that trades a little memory savings for extra string-building work at every match.',
    complexity: 'O(rows · cols · 4^L) time (L = longest word) · O(sum of word lengths) space',
    code: `// Worked trace for board = [["o","a"],["e","t"]], words = ["oat","oath"]:
//
//   Trie built from "oat","oath":
//     root -o-> -a-> -t(word="oat") -h(word="oath")
//
//   DFS from (0,0)='o':
//     step  cell(r,c)  char  trie node reached  node.word   action
//     ────────────────────────────────────────────────────────────────
//     1     (0,0)      'o'   root->o             null        recurse neighbors
//     2     (0,1)      'a'   root->o->a          null        recurse neighbors
//     3     (1,1)      't'   root->o->a->t       "oat"       add "oat", null out word
//     4     (no 'h' neighbor of (1,1) other than visited) -> branch ends, backtrack
//     (DFS also tries (1,0)='e' from step1 but root has no 'e' child -> prunes immediately)
//
// Returns ["oat"]  ("oath" is never found: no 'h' cell is adjacent to the "oat" path)

public List<String> findWords(char[][] board, String[] words) {
  // Build one Trie holding every target word so the board is walked only once
  TrieNode root = new TrieNode();
  for (String w : words) insert(root, w);

  List<String> result = new ArrayList<>();
  int rows = board.length, cols = board[0].length;
  // Try every cell as a potential starting letter of some word
  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      dfs(board, r, c, root, result);
    }
  }
  return result;
}

// Trie node caches the completed word at its terminal node instead of a bare boolean,
// so a match can be reported without rebuilding the string from the path taken
private static class TrieNode {
  TrieNode[] children = new TrieNode[26];
  String word = null;
}

private void insert(TrieNode root, String word) {
  TrieNode cur = root;
  for (char ch : word.toCharArray()) {
    int i = ch - 'a';
    // Lazily create only the nodes actually needed by this word
    if (cur.children[i] == null) cur.children[i] = new TrieNode();
    cur = cur.children[i];
  }
  // Store the word itself at its terminal node — doubles as the "is a word" flag
  cur.word = word;
}

private void dfs(char[][] board, int r, int c, TrieNode parent, List<String> result) {
  // Out of bounds, or this cell was already consumed on the current path
  if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
  char ch = board[r][c];
  if (ch == '#') return;   // '#' marks a cell already used earlier on this path

  TrieNode node = parent.children[ch - 'a'];
  // No word in the Trie continues with this letter — nothing more to explore here
  if (node == null) return;

  // Found a complete word at this node; record it and clear the slot so it can't be added twice
  if (node.word != null) {
    result.add(node.word);
    node.word = null;
  }

  // Mark this cell visited by overwriting it, restoring the original letter on backtrack
  board[r][c] = '#';
  dfs(board, r + 1, c, node, result);
  dfs(board, r - 1, c, node, result);
  dfs(board, r, c + 1, node, result);
  dfs(board, r, c - 1, node, result);
  board[r][c] = ch;

  // Prune: if this child node has no word of its own left and no children of its own,
  // it can never contribute another match, so unlink it to speed up later searches
  boolean hasChildren = false;
  for (TrieNode child : node.children) {
    if (child != null) { hasChildren = true; break; }
  }
  if (!hasChildren && node.word == null) {
    parent.children[ch - 'a'] = null;
  }
}`
  },
  {
    num: 162, lc: 648, title: 'Replace Words', d: 'medium',
    bucket: 'Tries', category: 'Trie · Scan',
    url: 'https://leetcode.com/problems/replace-words/',
    approach: 'Insert every root into a 26-ary Trie, then walk each sentence word one character at a time following the Trie from its root pointer. The key insight: because roots are inserted with no notion of "shortest," you must stop and return the very first end-of-word marker you hit while descending — that is guaranteed to be the shortest matching root, since any longer root sharing the same prefix path would only be reached AFTER passing through the shorter one\'s end flag. If the descent falls off the Trie (a child pointer is null) before hitting any end flag, no root matches and the original word passes through unchanged. Naively checking the word against every root string with startsWith would cost O(words · roots · length) and get worse as the dictionary grows, whereas the Trie walk is bounded purely by the word\'s own length regardless of how many roots exist. Building the Trie costs O(R) where R is total root characters, and processing the sentence costs O(W) where W is total sentence characters, for O(R + W) time and O(R) space. Storing roots in a HashSet and testing each prefix of the word from shortest to longest is an equivalent alternative with the same asymptotic behavior.',
    complexity: 'O(R + W) time (R = root chars, W = sentence chars) · O(R) space',
    code: `// Worked trace for dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery":
//
// Trie after inserting cat, bat, rat (end flag shown as *):
//   root -c-> a -> t(*)
//        -b-> a -> t(*)
//        -r-> a -> t(*)
//
//   word       walk                              first end-flag hit   replacement
//   ──────────────────────────────────────────────────────────────────────────────
//   "the"      't': no child at root               none                "the" (unchanged)
//   "cattle"   c->a->t(*)                          "cat"                "cat"
//   "was"      'w': no child at root                none                "was" (unchanged)
//   "rattled"  r->a->t(*)                           "rat"                "rat"
//   "by"       b->'y': no child under b             none                "by" (unchanged)
//   "the"      (same as above)                      none                "the"
//   "battery"  b->a->t(*)                           "bat"                "bat"
//
// Returns "the cat was rat by the bat"

class TrieNode {
  // Fixed fan-out for lowercase letters keeps lookups O(1) per character
  TrieNode[] children = new TrieNode[26];
  // Marks that a complete root word ends at this node
  boolean isEnd = false;
}

public String replaceWords(List<String> dictionary, String sentence) {
  TrieNode root = new TrieNode();
  // Load every root into the Trie once, up front, so lookups are shared work
  for (String word : dictionary) {
    TrieNode node = root;
    for (char c : word.toCharArray()) {
      int idx = c - 'a';
      // Lazily create the child only when this path hasn't been walked before
      if (node.children[idx] == null) node.children[idx] = new TrieNode();
      node = node.children[idx];
    }
    // Flag the final node so a later walk knows a root terminates exactly here
    node.isEnd = true;
  }

  StringBuilder result = new StringBuilder();
  for (String word : sentence.split(" ")) {
    if (result.length() > 0) result.append(' ');
    result.append(shortestRoot(root, word));
  }
  return result.toString();
}

// Walks the Trie along word's characters and returns the shortest stored root
// that prefixes it, or the original word if no root matches.
private String shortestRoot(TrieNode root, String word) {
  TrieNode node = root;
  for (int i = 0; i < word.length(); i++) {
    int idx = word.charAt(i) - 'a';
    // Path breaks before any root completed — nothing in the dictionary applies
    if (node.children[idx] == null) return word;
    node = node.children[idx];
    // Stop at the FIRST end flag reached: any longer root sharing this prefix
    // would only be found deeper, so this is necessarily the shortest match
    if (node.isEnd) return word.substring(0, i + 1);
  }
  // Walked the entire word inside the Trie without ever hitting an end flag
  return word;
}`
  },
  // ─── Heap / Priority Queue (8) ───
  {
    num: 74, lc: 215, title: 'Kth Largest Element in an Array', d: 'medium', companies: ['Temu'],
    bucket: 'Heap / Priority Queue', category: 'Heap',
    url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    approach: 'Bounded min-heap of size k. Push every element; whenever the heap exceeds size k, poll the smallest. The min-heap therefore always retains exactly the k largest values seen so far, with the kth-largest sitting at its root, so after the full pass peek() is the answer. Correctness: anything smaller than all k survivors gets evicted immediately, and the smallest of the top-k is precisely the kth largest. Each offer/poll is O(log k) and we do n of them → O(n log k) time with only O(k) extra space, beating an O(n log n) full sort. Quickselect can reach O(n) average but the heap is simpler and worst-case stable.',
    complexity: 'O(n log k) time · O(k) space',
    code: `// Worked trace for nums = [3, 2, 1, 5, 6, 4], k = 2 (min-heap keeps the 2 largest):
//
//   n   offer  size>k? poll  minHeap (root = smallest kept)
//   ──────────────────────────────────────────────────────
//   3   [3]    no            [3]
//   2   [2,3]  no            [2,3]
//   1   add 1  yes     poll1 [2,3]
//   5   add 5  yes     poll2 [3,5]
//   6   add 6  yes     poll3 [5,6]
//   4   add 4  yes     poll4 [5,6]
//
// peek() = 5  → Returns 5

public int findKthLargest(int[] nums, int k) {
  // Min-heap so the SMALLEST of our k-largest is at the top, ready to be evicted
  PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);
  for (int n : nums) {
    // Tentatively admit n into the running top-k set
    minHeap.offer(n);
    // Once we exceed k, pop the smallest — heap always holds the top-k largest
    if (minHeap.size() > k) minHeap.poll();
  }
  // After processing all elements, the top is the kth largest
  return minHeap.peek();
}`
  },
  {
    num: 75, lc: 295, title: 'Find Median from Data Stream', d: 'hard',
    bucket: 'Heap / Priority Queue', category: 'Design',
    url: 'https://leetcode.com/problems/find-median-from-data-stream/',
    approach: 'Two balanced heaps split the data at the median. A max-heap \'low\' holds the smaller half (its root is the largest of that half) and a min-heap \'high\' holds the larger half (its root is the smallest of that half). On each add we push into low, immediately move low\'s top into high (guaranteeing every low element ≤ every high element), then if high grew bigger we move its top back so |low| ≥ |high| and they differ by at most one. The median is low\'s root when sizes differ, else the average of both roots. Each add is O(log n) (heap ops), findMedian is O(1). This beats re-sorting (O(n log n) per query) by keeping the split incrementally.',
    complexity: 'O(log n) per add · O(1) per median',
    code: `// Worked trace adding 1, 2, 3 (low = max-heap lower half, high = min-heap upper half):
//
//   addNum  low.offer  high.offer(low.poll)  rebalance       low      high   median
//   ───────────────────────────────────────────────────────────────────────────────
//   1       low=[1]    high=[1] low=[]        low=[1] high=[] [1]      []     1.0
//   2       low=[2,1]  high=[2] low=[1]       (sizes 1,1)     [1]      [2]    1.5
//   3       low=[3,1]  high=[2,3] low=[1]     low=[2,1] hi=[3][2,1]    [3]    2.0
//
// findMedian after {1,2,3}: low.size>high.size → low.peek() = 2  → Returns 2.0

class MedianFinder {
  // low  = max-heap of the SMALLER half (peek = largest of lower half)
  // high = min-heap of the LARGER  half (peek = smallest of upper half)
  private final PriorityQueue<Integer> low  = new PriorityQueue<>(Comparator.reverseOrder());
  private final PriorityQueue<Integer> high = new PriorityQueue<>();

  public void addNum(int num) {
    // Always insert into low first, then siphon its largest into high.
    // This guarantees every element in low ≤ every element in high.
    low.offer(num);
    high.offer(low.poll());
    // Rebalance: enforce |low| - |high| ∈ {0, 1} so low never trails high
    if (high.size() > low.size()) low.offer(high.poll());
  }
  public double findMedian() {
    // Odd count → low has the extra element (it's the median)
    // Even → average the two tops
    return low.size() > high.size()
      ? low.peek()
      : (low.peek() + high.peek()) / 2.0;
  }
}`
  },
  {
    num: 76, lc: 378, title: 'Kth Smallest Element in a Sorted Matrix', d: 'medium',
    bucket: 'Heap / Priority Queue', category: 'Heap',
    url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',
    approach: 'k-way merge with a min-heap, exploiting that each row is already sorted. Seed the heap with the first element of each of the first min(n,k) rows, tagged with [value,row,col]. Repeatedly pop the global minimum; after consuming cell (r,c) push its right neighbour (r,c+1), the next-smallest unseen candidate from that row. The heap always holds the frontier of smallest unexplored cells, so the kth pop is the kth smallest overall. Popping k-1 times then peeking gives the answer in O(k log n) time and O(n) space. Cleaner than flattening-and-sorting O(n² log n); a binary search on value space is the alternative O(n log(max−min)) approach.',
    complexity: 'O(k log n) time · O(n) space',
    code: `// Worked trace for matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8:
//
//   step  k  poll [val,r,c]  push next (r,c+1)   heap values (frontier)
//   ──────────────────────────────────────────────────────────────────
//   seed  8  -               -                   {1, 10, 12}
//   1     7  [1,0,0]         [5,0,1]             {5, 10, 12}
//   2     6  [5,0,1]         [9,0,2]             {9, 10, 12}
//   3     5  [9,0,2]         (c+1 out of range)  {10, 12}
//   4     4  [10,1,0]        [11,1,1]            {11, 12}
//   5     3  [11,1,1]        [13,1,2]            {12, 13}
//   6     2  [12,2,0]        [13,2,1]            {13, 13}
//   7     1  [13,1,2]        (c+1 out of range)  {13}
//
// loop ends (--k == 0); peek = [13,2,1]  → Returns 13

public int kthSmallest(int[][] matrix, int k) {
  int n = matrix.length;
  // Heap entry: [value, row, col]. Sort by value.
  // LAMBDA (Comparator): (a, b) -> a[0] - b[0] IS the compare(a, b) body — a
  // negative result orders a before b, so this is a MIN-heap by entry[0] (value).
  // Without the lambda:
  //   new PriorityQueue<>(new Comparator<int[]>() {
  //     public int compare(int[] a, int[] b) { return a[0] - b[0]; }
  //   });
  PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
  // Seed with the first column — these are the smallest candidate per row
  // (cap at k rows: rows beyond k can never hold the kth smallest)
  for (int r = 0; r < Math.min(n, k); r++) heap.offer(new int[]{ matrix[r][0], r, 0 });

  // Pop k-1 times; the k-th poll-or-peek is the answer
  while (--k > 0) {
    int[] top = heap.poll();
    // After consuming (r, c), the next candidate from that row is (r, c+1)
    if (top[2] + 1 < n) {
      heap.offer(new int[]{ matrix[top[1]][top[2] + 1], top[1], top[2] + 1 });
    }
  }
  // Heap root is now the kth smallest overall
  return heap.peek()[0];
}`
  },
  {
    num: 77, lc: 767, title: 'Reorganize String', d: 'medium',
    bucket: 'Heap / Priority Queue', category: 'Greedy · Heap',
    url: 'https://leetcode.com/problems/reorganize-string/',
    approach: 'Greedy with a max-heap keyed by remaining frequency. Count each letter, push counts into a heap, then repeatedly place the currently most-frequent character — but hold the just-placed character aside for exactly one turn so it can never sit adjacent to itself. After appending, we re-queue the previous character (if it still has count left), then decrement and stash the current one as the new \'previous\'. Always spending the most frequent char first prevents any letter from piling up and becoming unschedulable. If we exhaust the heap before placing all n characters, one letter was too frequent, so return "". Time is O(n log 26) ≈ O(n); space O(26).',
    complexity: 'O(n log alphabet) time · O(alphabet) space',
    code: `// Worked trace for s = "aab" (max-heap by remaining count; prev held one turn):
//
//   poll [ch,cnt]  append  re-queue prev?       cnt--   prev      heap
//   ──────────────────────────────────────────────────────────────────
//   init                                                 null      {[a,2],[b,1]}
//   [a,2]          "a"     prev null, skip      a:1     [a,1]     {[b,1]}
//   [b,1]          "ab"    prev a(1)>0 → offer  b:0     [b,0]     {[a,1]}
//   [a,1]          "aba"   prev b(0), skip      a:0     [a,0]     {}
//
// sb="aba", length 3 == s.length  → Returns "aba"

public String reorganizeString(String s) {
  // Tally how many of each lowercase letter we must place
  int[] count = new int[26];
  for (char c : s.toCharArray()) count[c - 'a']++;
  // Max-heap keyed by remaining count: always serve the most-frequent char first
  // LAMBDA (Comparator): (a, b) -> b[1] - a[1] flips the operands (b before a), so
  // a LARGER count[1] sorts first — that reversal is what makes this a MAX-heap.
  // Without the lambda:
  //   new PriorityQueue<>(new Comparator<int[]>() {
  //     public int compare(int[] a, int[] b) { return b[1] - a[1]; }
  //   });
  PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[1] - a[1]);
  for (int i = 0; i < 26; i++) if (count[i] > 0) heap.offer(new int[]{ i, count[i] });

  StringBuilder sb = new StringBuilder();
  int[] prev = null;   // the char we JUST placed — must not be the next char
  while (!heap.isEmpty()) {
    // Take the most frequent available char that ISN'T the one just placed
    int[] top = heap.poll();
    sb.append((char) ('a' + top[0]));
    // Re-queue the previous char now that this turn passed, if it still has count
    if (prev != null && prev[1] > 0) heap.offer(prev);
    // Spend one occurrence of the char we just placed, then hold it out one turn
    top[1]--;
    prev = top;
  }
  // If we ran out of options before consuming all chars, impossible — return ""
  return sb.length() == s.length() ? sb.toString() : "";
}`
  },

  {
    num: 163, lc: 973, title: 'K Closest Points to Origin', d: 'medium',
    bucket: 'Heap / Priority Queue', category: 'Heap · Top-K',
    url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
    approach: 'Bounded max-heap of size k, mirroring the "kth largest" pattern but flipped for smallest-k. Key every point by its squared Euclidean distance (dist = x*x + y*y) — the square root only preserves ordering, never changes it, so skipping sqrt avoids floating-point work entirely. Push each point into a max-heap ordered by that distance; whenever the heap exceeds size k, poll the farthest point out. The heap therefore always retains exactly the k closest points seen so far, since anything farther than the current worst-of-k gets evicted the moment a closer point arrives. This is strictly better than sorting all n points by distance (O(n log n)) because the heap never grows past k+1 entries, giving O(n log k) time and O(k) space. Quickselect (partition around the kth distance, Hoare-style) is the equivalent O(n) average-case alternative when the order of the returned points does not matter.',
    complexity: 'O(n log k) time · O(k) space',
    code: `// Worked trace for points = [[1,3],[-2,2],[2,-2]], k = 2 (max-heap keeps 2 closest):
//
//   point     dist=x*x+y*y  offer   size>k?  poll (farthest)   maxHeap (root = farthest kept)
//   ──────────────────────────────────────────────────────────────────────────────────────────
//   [1,3]     1+9=10        yes     no                          [(10,[1,3])]
//   [-2,2]    4+4=8         yes     no                          [(10,[1,3]), (8,[-2,2])]
//   [2,-2]    4+4=8         yes     yes      poll (10,[1,3])    [(8,[-2,2]), (8,[2,-2])]
//
// Heap now holds the 2 closest points → Returns [[-2,2],[2,-2]] (order may vary)

public int[][] kClosest(int[][] points, int k) {
  // Max-heap ordered by squared distance, so the FARTHEST of our k-closest sits at the root
  // ready to be evicted the moment a closer point shows up.
  // LAMBDA (Comparator): (a, b) -> distSq(b) - distSq(a) lists the operands b-then-a,
  // so the point with the LARGER squared distance sorts first — a MAX-heap by distance.
  // Without the lambda:
  //   new PriorityQueue<>(new Comparator<int[]>() {
  //     public int compare(int[] a, int[] b) {
  //       return (b[0]*b[0] + b[1]*b[1]) - (a[0]*a[0] + a[1]*a[1]);
  //     }
  //   });
  PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
    (a, b) -> (b[0] * b[0] + b[1] * b[1]) - (a[0] * a[0] + a[1] * a[1])
  );
  for (int[] point : points) {
    // Tentatively admit this point into the running closest-k set
    maxHeap.offer(point);
    // Once we exceed k, evict the farthest — heap always holds the closest k so far.
    // Squared distance (no sqrt) is enough: sqrt is monotonic, so it never changes the ordering.
    if (maxHeap.size() > k) maxHeap.poll();
  }
  // Drain the heap into the result array — whatever remains is the k closest points
  int[][] result = new int[k][2];
  for (int i = 0; i < k; i++) {
    result[i] = maxHeap.poll();
  }
  return result;
}`
  },
  {
    num: 164, lc: 1046, title: 'Last Stone Weight', d: 'easy',
    bucket: 'Heap / Priority Queue', category: 'Heap · Simulation',
    url: 'https://leetcode.com/problems/last-stone-weight/',
    approach: 'Max-heap simulation, since the rule "smash the two heaviest" is really asking for repeated access to the current maximum and its runner-up. Load every stone into a max-heap (Java\'s PriorityQueue is a min-heap by default, so seed it with Comparator.reverseOrder()), then repeatedly poll the two largest, y and x with y >= x, and if they are unequal push the leftover y-x back in as a brand-new stone that must re-enter the same competition. Using a heap avoids re-sorting the whole array after every smash, which is what a naive simulation on a plain sorted list would force; the heap instead pays only O(log n) to restore order per operation. The loop stops once at most one stone remains, since a lone stone has nothing left to smash into. Each of the n-1 smashes costs O(log n) for two polls and at most one offer, giving O(n log n) time and O(n) space overall. A sorted TreeMap/multiset of counts is an equivalent alternative, sometimes chosen to dodge PriorityQueue\'s per-op boxing overhead, but the max-heap is the cleanest and most standard interview solution.',
    complexity: 'O(n log n) time · O(n) space',
    code: `// Worked trace for stones = [2, 7, 4, 1, 8, 1] (max-heap, largest first):
//
//   step  poll y  poll x  y==x?  push y-x   heap after (sorted desc)
//   ─────────────────────────────────────────────────────────────────
//   init    -       -       -        -      {8, 7, 4, 2, 1, 1}
//   1       8       7       no       1      {4, 2, 1, 1, 1}
//   2       4       2       no       2      {2, 1, 1, 1}
//   3       2       1       no       1      {1, 1, 1}
//   4       1       1       yes      -      {1}
//
// size == 1 → Returns heap.peek() = 1

public int lastStoneWeight(int[] stones) {
  // Max-heap: PriorityQueue defaults to min-heap, so flip the comparator to
  // always surface the two heaviest stones at the front.
  PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.reverseOrder());
  for (int s : stones) heap.offer(s);

  // Keep smashing while at least two stones remain to collide;
  // one leftover stone has nothing to smash into, so it stops the loop.
  while (heap.size() > 1) {
    // y is the heaviest, x the second-heaviest (heap guarantees y >= x)
    int y = heap.poll();
    int x = heap.poll();
    // Equal weights annihilate completely — nothing survives to re-enter the heap.
    // Unequal weights leave a new stone of weight y - x that must compete again,
    // so it goes back into the same heap rather than a separate list.
    if (y != x) heap.offer(y - x);
  }
  // Either one stone is left (its weight is the answer) or none (nothing survived → 0)
  return heap.isEmpty() ? 0 : heap.peek();
}`
  },
  {
    num: 165, lc: 703, title: 'Kth Largest Element in a Stream', d: 'easy',
    bucket: 'Heap / Priority Queue', category: 'Design · Min-Heap',
    url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
    approach: 'Maintain a persistent min-heap that is capped at size k across the whole lifetime of the object, not just within one call. The constructor seeds the heap with the initial nums and immediately trims it down to k by polling the smallest survivors away; every later add() offers the new value in and then polls once more if the heap grew past k. Because the heap only ever holds the k largest values seen SO FAR, its root (the minimum of that set) is always exactly the kth largest overall — that invariant is what makes peek() a correct O(1) answer after every single call. The naive alternative, re-sorting (or rescanning) the full running list on every add(), costs O(n log n) or O(n) per call and throws away the work done on previous calls; the heap instead pays only O(log k) per add to keep the invariant intact. Space is bounded at O(k) regardless of how many elements have streamed through, which also beats keeping the entire history around. Each constructor element costs O(log k) to admit, so building from n0 initial values is O(n0 log k) time, and add() is O(log k) amortized thereafter. An equivalent alternative is a self-balancing BST (e.g. a TreeMap of counts) used as an order-statistics structure, trading heap simplicity for O(log k) rank queries you don\'t actually need here.',
    complexity: 'O(log k) per add · O(k) space',
    code: `// Worked trace for k = 3, nums = [4, 5, 8, 2], then add(3):
//
//   step        offer  size  >k?  poll   heap after (root = kth largest)
//   ─────────────────────────────────────────────────────────────────────
//   constructor   4      1   no          [4]
//                 5      2   no          [4,5]
//                 8      3   no          [4,5,8]
//                 2      4   yes   2     [4,5,8]
//   add(3)        3      4   yes   3     [4,5,8]
//
// After construction peek() would be 4 (the 3rd-largest of {4,5,8,2} = {8,5,4,2} sorted desc).
// add(3): heap {3,4,5,8} sheds the smallest (3) right back out, so the 3rd largest
// of {4,5,8,2,3} stays 4 — Returns 4, matching the official LeetCode example.

class KthLargest {
  // Fixed k for this instance — the "kth largest" we're always tracking
  private final int k;
  // Min-heap capped at size k: root is the SMALLEST of the k largest values seen so far,
  // which is by definition the kth largest overall.
  private final PriorityQueue<Integer> minHeap = new PriorityQueue<>();

  public KthLargest(int k, int[] nums) {
    this.k = k;
    // Seed the heap with whatever initial values are given
    for (int n : nums) {
      minHeap.offer(n);
      // Trim eagerly so the heap never holds more than k elements, even mid-construction
      if (minHeap.size() > k) minHeap.poll();
    }
  }

  public int add(int val) {
    // Tentatively admit val into the running top-k set
    minHeap.offer(val);
    // Once size exceeds k, evict the smallest — heap always holds exactly the k largest
    if (minHeap.size() > k) minHeap.poll();
    // Root is the smallest of the k largest, i.e. the kth largest overall.
    // Guaranteed non-empty because the problem guarantees the stream has at
    // least k elements by the time add() is first called.
    return minHeap.peek();
  }
}`
  },
  {
    num: 166, lc: 1086, title: 'High Five', d: 'easy', companies: ['Garmin'],
    bucket: 'Heap / Priority Queue', category: 'Heap · Top-K',
    url: 'https://leetcode.com/problems/high-five/',
    approach: 'Group-then-bound-heap, one student at a time. Route each [id, score] pair into a per-id min-heap capped at size 5: push the score, and whenever the heap exceeds 5 entries poll the smallest away. Because the heap only ever discards the smallest score once a 6th arrives, it always retains exactly that student\'s current top-5 highest scores, regardless of the order scores arrive in. Once every pair has been routed, drain each student\'s heap and average its (exactly five, per the problem\'s guarantee) surviving scores, using integer division since the answer is defined as an int. A TreeMap keyed by id keeps the final output naturally sorted by increasing id, avoiding a separate sort pass at the end. This runs in O(n log 5) = O(n) time to build the heaps plus O(m) to drain them (m = distinct ids), with O(n) space for the heaps — far better than sorting each student\'s full score list (O(n log n) overall) when only the top 5 are ever needed. An equivalent alternative sorts each student\'s score list descending and averages the first five entries directly.',
    complexity: 'O(n) time · O(n) space',
    code: `// Worked trace for items = [[1,91],[1,92],[1,60],[1,58],[1,100],[1,89],[2,93],[2,97],[2,64],[2,80],[2,50]]:
//
//   pair        student-1 minHeap (poll when size>5)      student-2 minHeap
//   ─────────────────────────────────────────────────────────────────────────
//   [1,91]      {91}
//   [1,92]      {91,92}
//   [1,60]      {60,91,92}
//   [1,58]      {58,60,91,92}
//   [1,100]     {58,60,91,92,100}
//   [1,89]      size 6 -> poll 58 -> {60,89,91,92,100}
//   [2,93]                                                 {93}
//   [2,97]                                                 {93,97}
//   [2,64]                                                 {64,93,97}
//   [2,80]                                                 {64,80,93,97}
//   [2,50]                                                 {50,64,80,93,97}
//
// Student 1 sum = 60+89+91+92+100 = 432 -> 432/5 = 86
// Student 2 sum = 50+64+80+93+97 = 384 -> 384/5 = 76
// TreeMap emits ids in increasing order -> Returns [[1, 86], [2, 76]]

public int[][] highFive(int[][] items) {
  // One bounded min-heap per student id; the heap root is always that student's
  // current WORST score among the top-5 kept so far, ready to be evicted.
  Map<Integer, PriorityQueue<Integer>> topFive = new HashMap<>();
  for (int[] item : items) {
    int id = item[0], score = item[1];
    // Lazily create this student's heap on first sight of their id
    // LAMBDA (mapping Function): k -> new PriorityQueue<>() is the factory
    // computeIfAbsent invokes ONLY when 'id' is absent; its return becomes the value.
    // Without the lambda:
    //   PriorityQueue<Integer> heap = topFive.get(id);
    //   if (heap == null) { heap = new PriorityQueue<>(); topFive.put(id, heap); }
    PriorityQueue<Integer> heap = topFive.computeIfAbsent(id, k -> new PriorityQueue<>());
    heap.offer(score);
    // Once a 6th score arrives, drop the smallest — heap always holds the top 5
    if (heap.size() > 5) heap.poll();
  }
  // TreeMap sorts by id automatically, so the result comes out ordered without a manual sort
  Map<Integer, Integer> averages = new TreeMap<>();
  for (Map.Entry<Integer, PriorityQueue<Integer>> entry : topFive.entrySet()) {
    PriorityQueue<Integer> heap = entry.getValue();
    // Problem guarantees every id has at least 5 scores, so each heap is exactly 5 deep here
    int sum = 0;
    for (int score : heap) sum += score;
    // Integer division matches the problem's definition of the rounded-down average
    averages.put(entry.getKey(), sum / 5);
  }
  // Flatten the sorted map into the required [id, average] row format
  int[][] result = new int[averages.size()][2];
  int i = 0;
  for (Map.Entry<Integer, Integer> entry : averages.entrySet()) {
    result[i][0] = entry.getKey();
    result[i][1] = entry.getValue();
    i++;
  }
  return result;
}`
  },
  // ─── Backtracking (9) ───
  {
    num: 216, lc: 2163, title: 'Minimum Difference in Sums After Removal of Elements', d: 'hard',
    bucket: 'Heap / Priority Queue', category: 'Array · Heap · Prefix/Suffix',
    url: 'https://leetcode.com/problems/minimum-difference-in-sums-after-removal-of-elements/',
    approach: 'Every valid removal leaves 2n elements that split at some boundary: the first part draws its n elements from a prefix of the array and the second part from the matching suffix. Enumerating that boundary is what makes the problem tractable — once it is fixed, the two halves are independent, and each wants the extreme choice available to it (the first part wants its n smallest, the second its n largest). Both are computed with a bounded heap in a single sweep. Scanning left to right with a MAX-heap capped at size n keeps the n smallest values seen so far, because whenever the heap overflows the element evicted is the largest, and a running sum tracks their total; the mirrored right-to-left scan with a MIN-heap of size n keeps the n largest of each suffix. Storing the prefix results in an array lets the second sweep pair each boundary against its already-computed partner and take the minimum difference in O(1). The heap-size guard is doing double duty: it also confines the boundary to the only legal range, since fewer than n elements on either side simply never satisfies it. Sums are long — 10^5 elements of magnitude 10^5 overflow int comfortably.',
    complexity: 'O(n log n) time · O(n) space',
    code: `// Worked trace for nums = [7, 9, 5, 8, 1, 3]  (n = 2, so remove 2, keep 4)
//
//   left-to-right, max-heap capped at 2 -> smallest-2 sum of each prefix
//     i=1: {7,9}        minPrefix[2] = 16
//     i=2: {7,5}        minPrefix[3] = 12
//     i=3: {7,5}        minPrefix[4] = 12
//
//   right-to-left, min-heap capped at 2 -> largest-2 sum of each suffix
//     i=4: {1,3}  sum 4    vs minPrefix[4] = 12  ->  8
//     i=3: {8,3}  sum 11   vs minPrefix[3] = 12  ->  1
//     i=2: {8,5}  sum 13   vs minPrefix[2] = 16  ->  3
//
// Returns 1  (keep [7,5] and [8,3]: 12 - 11 = 1)

public long minimumDifference(int[] nums) {
  int n = nums.length / 3;

  // minPrefix[i] = smallest achievable sum of n elements drawn from nums[0..i-1].
  // Indexed by COUNT of consumed elements so it lines up with the suffix sweep.
  long[] minPrefix = new long[nums.length + 1];

  // A max-heap capped at n retains the n SMALLEST values seen: every overflow
  // evicts the current largest, which is exactly the one we least want to keep.
  PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
  long sum = 0;
  for (int i = 0; i < 2 * n; i++) {
    maxHeap.add(nums[i]);
    sum += nums[i];
    if (maxHeap.size() > n) {
      sum -= maxHeap.poll();
    }
    if (maxHeap.size() == n) {
      minPrefix[i + 1] = sum;
    }
  }

  // Mirror image: a min-heap capped at n retains the n LARGEST of each suffix.
  long best = Long.MAX_VALUE;
  PriorityQueue<Integer> minHeap = new PriorityQueue<>();
  sum = 0;
  for (int i = nums.length - 1; i >= n; i--) {
    minHeap.add(nums[i]);
    sum += nums[i];
    if (minHeap.size() > n) {
      sum -= minHeap.poll();
    }
    // The size guard also pins the split to its only legal range: with fewer
    // than n elements to the right it never fires, so minPrefix[i] is only
    // ever read at indices where it was actually filled in above.
    if (minHeap.size() == n) {
      best = Math.min(best, minPrefix[i] - sum);
    }
  }
  return best;
}`
  },
  {
    num: 78, lc: 78, title: 'Subsets', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/subsets/',
    approach: 'Backtracking / DFS that builds subsets incrementally. Every node of the recursion tree is itself a valid subset, so we record a copy of the current path on entry to each call (including the empty path at the root). To avoid generating the same subset twice, each recursive branch only considers indices j ≥ i — choices strictly to the right of the last one taken — which fixes a canonical increasing order per subset. We add nums[j], recurse from j+1, then remove it to restore state for the sibling branch. There are 2ⁿ subsets and copying each costs O(n), giving O(n·2ⁿ) time and O(n) recursion depth (output excluded).',
    complexity: 'O(n · 2ⁿ) time · O(n) recursion',
    code: `// Worked trace for nums = [1, 2, 3] (record path on every call entry):
//
//   call (i, path)  record       loop j      action
//   ─────────────────────────────────────────────────────────────
//   (0, [])         add []       j=0 add 1   → recurse (1,[1])
//   (1, [1])        add [1]      j=1 add 2   → recurse (2,[1,2])
//   (2, [1,2])      add [1,2]    j=2 add 3   → recurse (3,[1,2,3])
//   (3, [1,2,3])    add [1,2,3]  (none)      backtrack...
//   (1, [1])        ...          j=2 add 3   → add [1,3]
//   (0, [])         ...          j=1 add 2   → add [2], [2,3]; j=2 → add [3]
//
// Returns [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]

public List<List<Integer>> subsets(int[] nums) {
  List<List<Integer>> result = new ArrayList<>();
  // Kick off DFS from index 0 with an empty running path
  dfs(nums, 0, new ArrayList<>(), result);
  return result;
}
private void dfs(int[] nums, int i, List<Integer> path, List<List<Integer>> out) {
  // Add a COPY of the current path — including the empty subset on the very first call
  out.add(new ArrayList<>(path));
  // Try extending with every choice from j ≥ i (avoids generating duplicate subsets)
  for (int j = i; j < nums.length; j++) {
    path.add(nums[j]);              // choose nums[j]
    dfs(nums, j + 1, path, out);    // explore subsets that also include nums[j]
    path.remove(path.size() - 1);   // undo for the next branch
  }
}`
  },
  {
    num: 79, lc: 46, title: 'Permutations', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/permutations/',
    approach: 'Backtracking with a boolean \'used\' array. We grow a path one element at a time; at each depth we try every index not yet used, mark it used, recurse, then unmark it so the next sibling can pick it instead. When the path reaches full length we have a complete ordering and snapshot a copy. Because every index can appear at any open position (subject only to not repeating within one permutation), all n! orderings are generated, each exactly once since the used flags forbid reusing an element. Time is O(n·n!) — n! leaves, O(n) to copy each — and recursion depth is O(n). The key discipline is undoing BOTH the path append and the used flag on the way back up.',
    complexity: 'O(n · n!) time · O(n) recursion',
    code: `// Worked trace for nums = [1, 2, 3] (used flags shown as booleans):
//
//   depth  used        path     action
//   ────────────────────────────────────────────────────────
//   0      [F,F,F]     []       try i=0 → use 1
//   1      [T,F,F]     [1]      try i=1 → use 2
//   2      [T,T,F]     [1,2]    try i=2 → use 3
//   3      [T,T,T]     [1,2,3]  size==3 → record, return
//   2      [T,F,F]     [1]      undo 2, try i=2 → [1,3] then [1,3,2]
//   0      [F,F,F]     []       undo 1, try i=1 (2 first), i=2 (3 first)...
//
// Returns [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

public List<List<Integer>> permute(int[] nums) {
  List<List<Integer>> out = new ArrayList<>();
  // Start DFS with nothing used and an empty path
  dfs(nums, new boolean[nums.length], new ArrayList<>(), out);
  return out;
}
private void dfs(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> out) {
  // Full-length permutation → snapshot it
  if (path.size() == nums.length) {
    out.add(new ArrayList<>(path));
    return;
  }
  for (int i = 0; i < nums.length; i++) {
    if (used[i]) continue;   // skip elements already in the current permutation
    used[i] = true; path.add(nums[i]);   // choose nums[i] for this position
    dfs(nums, used, path, out);          // fill the remaining positions
    // Undo BOTH state changes for the next branch
    path.remove(path.size() - 1); used[i] = false;
  }
}`
  },
  {
    num: 80, lc: 39, title: 'Combination Sum', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/combination-sum/',
    approach: 'Backtracking on a shrinking remaining target. We track \'remain\' (target minus what\'s chosen): reaching exactly 0 records the current combination, while going negative prunes the branch. To allow unlimited reuse yet avoid counting permutations of the same multiset twice, each recursive call starts its loop at index \'start\' and passes i (not i+1) when it recurses — so the same element can be picked again, but we never revisit earlier indices, enforcing a non-decreasing canonical order per combination. Choose nums[i], recurse, then pop it to backtrack. Worst-case branching gives O(2^target)-ish time with O(target) recursion depth; the remain<0 cutoff prunes hopeless paths early.',
    complexity: 'O(2^target) worst case · O(target) recursion',
    code: `// Worked trace for candidates = [2, 3, 6, 7], target = 7:
//
//   call (start, remain, path)  action
//   ───────────────────────────────────────────────────────────
//   (0, 7, [])                  i=0 pick 2 → (0,5,[2])
//   (0, 5, [2])                 i=0 pick 2 → (0,3,[2,2])
//   (0, 3, [2,2])               i=0 pick 2 → remain -1 < 0, prune
//                               i=1 pick 3 → (1,0,[2,2,3]) remain==0 RECORD
//   (0, 5, [2])                 i=1 pick 3 → (1,2,[2,3]) → 2 not reachable, dead
//   (0, 7, [])                  i=3 pick 7 → (3,0,[7]) remain==0 RECORD
//
// Returns [[2,2,3],[7]]

public List<List<Integer>> combinationSum(int[] candidates, int target) {
  List<List<Integer>> out = new ArrayList<>();
  // Begin DFS at index 0 with the full target remaining and an empty path
  dfs(candidates, 0, target, new ArrayList<>(), out);
  return out;
}
private void dfs(int[] nums, int start, int remain, List<Integer> path, List<List<Integer>> out) {
  // Hit the target exactly — save this combination
  if (remain == 0) {
    out.add(new ArrayList<>(path));
    return;
  }
  // Overshot — abandon this branch
  if (remain < 0) return;
  // Start from 'start' (not 0) to avoid generating permutations of the same combination
  for (int i = start; i < nums.length; i++) {
    path.add(nums[i]);   // choose nums[i]
    // Pass i (NOT i+1) → allows reusing the same element multiple times
    dfs(nums, i, remain - nums[i], path, out);
    path.remove(path.size() - 1);   // undo for the next candidate
  }
}`
  },
  {
    num: 81, lc: 17, title: 'Letter Combinations of a Phone Number', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
    approach: 'Backtracking over the Cartesian product of the per-digit letter sets. A static table maps each digit to its keypad letters (indices 0 and 1 are empty). The DFS index i tracks which digit we\'re choosing a letter for; we loop over every letter mapped to digits[i], append it to a shared StringBuilder, recurse to the next digit, then delete it to backtrack. When i reaches the end we\'ve chosen one letter per digit and emit a snapshot. Every leaf is a distinct combination, so we produce exactly the product of the set sizes (≤ 4ⁿ since each digit has 3 or 4 letters). Time is O(4ⁿ·n) to build n-length strings; depth is O(n). The empty-input guard avoids returning a spurious [""].',
    complexity: 'O(4ⁿ · n) time · O(n) recursion',
    code: `// Worked trace for digits = "23" (DFS picks one letter per digit):
//
//   i  digit  letters  append  path   action
//   ────────────────────────────────────────────────────
//   0  '2'    abc      'a'     "a"    recurse i=1
//   1  '3'    def      'd'     "ad"   recurse i=2 → emit "ad"
//   1  '3'    def      'e'     "ae"   emit "ae"; then "af"
//   0  '2'    abc      'b'     "b"    → "bd","be","bf"
//   0  '2'    abc      'c'     "c"    → "cd","ce","cf"
//
// Returns [ad, ae, af, bd, be, bf, cd, ce, cf]

// Phone keypad mapping; indices 0/1 are unused (no letters)
private static final String[] DIGITS = {
  "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
};

public List<String> letterCombinations(String digits) {
  List<String> out = new ArrayList<>();
  // No digits → no combinations (avoid emitting a spurious empty string)
  if (digits.isEmpty()) return out;
  dfs(digits, 0, new StringBuilder(), out);
  return out;
}
private void dfs(String digits, int i, StringBuilder path, List<String> out) {
  // Built a full-length combination — emit a snapshot
  if (i == digits.length()) {
    out.add(path.toString());
    return;
  }
  // Try every letter mapped to the current digit
  for (char c : DIGITS[digits.charAt(i) - '0'].toCharArray()) {
    path.append(c);                          // choose letter c for digit i
    dfs(digits, i + 1, path, out);           // pick letters for the rest
    path.deleteCharAt(path.length() - 1);   // undo
  }
}`
  },
  {
    num: 82, lc: 22, title: 'Generate Parentheses', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/generate-parentheses/',
    approach: 'Backtracking that maintains validity by construction using two counters: open (number of \'(\' placed) and close (number of \')\' placed). We may add a \'(\' whenever open < n, and may add a \')\' only when close < open — i.e. there is an unmatched \'(\' to close — which guarantees we never form an invalid prefix and never need to validate at the end. When the string reaches length 2n it is necessarily balanced, so we emit it. Pruning invalid branches early means we only ever walk the valid strings, of which there are the n-th Catalan number C(n) ≈ 4ⁿ/(n^1.5√π); total work is O(4ⁿ/√n) with O(n) recursion depth. The close<open guard is the crucial correctness invariant.',
    complexity: 'O(4ⁿ / √n) (Catalan) · O(n) recursion',
    code: `// Worked trace for n = 2 (open = '(' used, close = ')' used; add '(' if open<n,
// add ')' if close<open):
//
//   sb     open close  next moves
//   ──────────────────────────────────────────────
//   ""     0    0      open<2 → '('
//   "("    1    0      open<2 → '(' ; close<open → ')'
//   "(("   2    0      open==2 ; close<open → ')'
//   "(()"  2    1      close<open → ')'
//   "(())" 2    2      len==4 → emit "(())"
//   "()"   1    1      open<2 → '(' → "()()" emit
//
// Returns ["(())", "()()"]

public List<String> generateParenthesis(int n) {
  List<String> out = new ArrayList<>();
  // Start with an empty builder, zero open and zero close used
  dfs(n, 0, 0, new StringBuilder(), out);
  return out;
}
private void dfs(int n, int open, int close, StringBuilder sb, List<String> out) {
  // Full-length valid string — emit and stop
  if (sb.length() == 2 * n) {
    out.add(sb.toString());
    return;
  }
  // Can add '(' as long as we haven't used all n open-parens
  if (open < n) {
    sb.append('(');
    dfs(n, open + 1, close, sb, out);
    sb.deleteCharAt(sb.length() - 1);   // backtrack
  }
  // Can add ')' only if there's an unmatched '(' to close (close < open)
  if (close < open) {
    sb.append(')');
    dfs(n, open, close + 1, sb, out);
    sb.deleteCharAt(sb.length() - 1);   // backtrack
  }
}`
  },
  {
    num: 83, lc: 51, title: 'N-Queens', d: 'hard',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/n-queens/',
    approach: 'Backtracking row by row with three boolean conflict sets for O(1) safety checks. Since each row holds exactly one queen, we recurse on row index r and try each column c. A column is attacked if col[c] is set; the two diagonals are identified by invariants that stay constant along a diagonal: r−c (offset by n to stay non-negative) for the \'\\\' direction and r+c for the \'/\' direction. If any of col/diag/anti is already marked, (r,c) is threatened, so we skip it; otherwise we place the queen, mark all three sets, recurse to r+1, then unmark to backtrack. Reaching row n yields a full solution rendered into board strings. Time is O(n!) thanks to pruning; space is O(n²) for the boards plus O(n) state.',
    complexity: 'O(n!) time · O(n²) space',
    code: `// Worked trace for n = 4 (place one queen per row; d = r-c+n is '\\' diag, a = r+c is '/'):
//
//   row r  try c  conflict?            place → mark col/diag/anti
//   ──────────────────────────────────────────────────────────────
//   0      0      none                 q[0]=0
//   1      0,1    col0 / diag conflict  skip; c=2 ok → q[1]=2
//   2      all    every c threatened    dead end → backtrack to row 1
//   1      3      ok                    q[1]=3
//   2      1      ok                    q[2]=1
//   3      ...    no safe c             backtrack ... → first solution at q=[1,3,0,2]
//
// Returns the 2 boards, e.g. [".Q..","...Q","Q...","..Q."] and its mirror

public List<List<String>> solveNQueens(int n) {
  List<List<String>> out = new ArrayList<>();
  int[] queens = new int[n];   // queens[r] = column of queen on row r
  // Three boolean arrays track conflict sets for fast O(1) check
  dfs(0, n, queens, new boolean[n], new boolean[2*n], new boolean[2*n], out);
  return out;
}
private void dfs(int r, int n, int[] q,
                 boolean[] col, boolean[] diag, boolean[] anti,
                 List<List<String>> out) {
  // Placed a queen on every row — valid solution
  if (r == n) {
    out.add(build(q, n));
    return;
  }
  for (int c = 0; c < n; c++) {
    // "\\" diagonal: constant value of (row - col + n). "/" diagonal: row + col.
    int d = r - c + n, a = r + c;
    if (col[c] || diag[d] || anti[a]) continue;   // some queen already threatens (r,c)
    q[r] = c;                                      // place queen at (r,c)
    col[c] = diag[d] = anti[a] = true;            // mark its three attack lines
    dfs(r + 1, n, q, col, diag, anti, out);       // solve the next row
    // Undo all three constraints for the next branch
    col[c] = diag[d] = anti[a] = false;
  }
}
// Convert queens-by-row encoding into the required board-string format
private List<String> build(int[] q, int n) {
  List<String> board = new ArrayList<>();
  for (int r = 0; r < n; r++) {
    char[] row = new char[n];
    Arrays.fill(row, '.');
    row[q[r]] = 'Q';          // drop the single queen for this row
    board.add(new String(row));
  }
  return board;
}`
  },

  {
    num: 167, lc: 90, title: 'Subsets II', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking · Dedup',
    url: 'https://leetcode.com/problems/subsets-ii/',
    approach: 'Same incremental-subset backtracking as plain Subsets, plus one extra rule to survive duplicate values: sort nums first so equal values become adjacent, then in the loop at each recursion depth skip an index j > start whenever nums[j] == nums[j-1]. That single guard is the whole trick — it says "don\'t start a new branch with the same value I already tried at this exact depth," which prunes only the sibling branches that would reproduce a subset already emitted, while still allowing a repeated value to be used when it is the FIRST occurrence considered at that depth or when it follows a value that was actually chosen (j == start is never skipped). Without sorting, equal values could sit far apart and the adjacency check would miss them, so a naive dedup would need a HashSet of serialized subsets instead — correct but far more expensive to build and compare. As with Subsets, every recursion-tree node (including the root) is itself a valid subset, so we record a copy of the path on entry to each call. There are still up to 2ⁿ subsets and each copy costs O(n), so time is O(n · 2ⁿ) and recursion depth is O(n); the dedup guard only prunes work, it never adds any. An equivalent alternative is iterative subset-doubling that, for each group of equal values, only extends the subsets generated by the PREVIOUS distinct value rather than all subsets so far.',
    complexity: 'O(n · 2ⁿ) time · O(n) recursion',
    code: `// Worked trace for nums = [1, 2, 2] (already sorted; start = loop lower bound):
//
//   call (start, path)   record        loop j        skip?           action
//   ──────────────────────────────────────────────────────────────────────────
//   (0, [])              add []        j=0 (val 1)   no (j==start)   add 1 → recurse (1,[1])
//   (1, [1])              add [1]       j=1 (val 2)   no (j==start)   add 2 → recurse (2,[1,2])
//   (2, [1,2])            add [1,2]     j=2 (val 2)   no (j==start)   add 2 → recurse (3,[1,2,2])
//   (3, [1,2,2])          add [1,2,2]   (none)                        backtrack...
//   (1, [1])              ...           j=2 (val 2)   YES (2==nums[1])  skipped — would repeat [1,2]
//   (0, [])                ...           j=1 (val 2)   no (j==start)   add 2 → recurse (2,[2])
//   (2, [2])               add [2]       j=2 (val 2)   no (j==start)   add 2 → add [2,2]
//   (0, [])                ...           j=2 (val 2)   YES (2==nums[1])  skipped — would repeat [2]
//
// Returns [[],[1],[1,2],[1,2,2],[2],[2,2]]

public List<List<Integer>> subsetsWithDup(int[] nums) {
  List<List<Integer>> result = new ArrayList<>();
  // Sort so equal values become adjacent -- required for the skip check below to work
  Arrays.sort(nums);
  dfs(nums, 0, new ArrayList<>(), result);
  return result;
}
private void dfs(int[] nums, int start, List<Integer> path, List<List<Integer>> out) {
  // Every node of the recursion tree (including the empty root) is a valid subset
  out.add(new ArrayList<>(path));
  for (int j = start; j < nums.length; j++) {
    // Skip a value that repeats the PREVIOUS sibling tried at this same depth --
    // j == start is never skipped, so the first occurrence at this depth always fires
    if (j > start && nums[j] == nums[j - 1]) continue;
    path.add(nums[j]);              // choose nums[j]
    dfs(nums, j + 1, path, out);    // explore subsets that also include nums[j]
    path.remove(path.size() - 1);   // undo for the next branch
  }
}`
  },
  {
    num: 168, lc: 40, title: 'Combination Sum II', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking · Dedup',
    url: 'https://leetcode.com/problems/combination-sum-ii/',
    approach: 'Same shrinking-target backtracking as Combination Sum, but each candidate may be used at most once and the input can contain duplicate values, so the search needs two extra guards. First, sort the array up front: this groups equal values next to each other (enabling dedup) and lets a branch bail out the instant nums[i] > remain, since everything after i is only larger. Second, recurse with i+1 instead of i, so a given array index is never reused within one combination. The dedup rule is the subtle part: within a single call\'s for-loop, skip nums[i] when i > start and nums[i] == nums[i-1] — that condition only fires for the SECOND-and-later occurrence of a value at the same recursion depth, so the first occurrence still gets explored (and can still be reused later at a deeper level via a different index), but sibling branches that would produce an identical combination are cut. Without that guard, two equal 1s at different indices would each spawn their own identical-looking combination, producing duplicate lists that then need an expensive post-hoc dedup pass (e.g. stuffing results into a Set of sorted lists). The complexity is worst-case exponential in the number of candidates, same shape as Combination Sum, with O(n log n) added up front for the sort.',
    complexity: 'O(2^n) worst case time (n = candidates.length) · O(n) recursion depth',
    code: `// Worked trace for candidates = [10,1,2,7,6,1,5], target = 8
// (sorted first: [1,1,2,5,6,7,10], indices 0..6):
//
//   call (start,remain,path)   i  nums[i]  skip-dup?  action
//   ────────────────────────────────────────────────────────────────────
//   (0,8,[])                   0    1        no       pick → (1,7,[1])
//   (1,7,[1])                  1    1        no       pick → (2,6,[1,1])
//   (2,6,[1,1])                2    2        no       pick → (3,4,[1,1,2])
//   (3,4,[1,1,2])              3    5        no       5 > 4 remain, break (dead)
//   (2,6,[1,1])                3    5        no       pick → (4,1,[1,1,5])
//   (4,1,[1,1,5])              4    6        no       6 > 1 remain, break (dead)
//   (2,6,[1,1])                4    6        no       pick → (5,0,[1,1,6])  remain==0 RECORD
//   (2,6,[1,1])                5    7        no       7 > 6 remain, break
//   (1,7,[1])                  2    2        no       pick → (3,5,[1,2])
//   (3,5,[1,2])                3    5        no       pick → (4,0,[1,2,5])  remain==0 RECORD
//   (3,5,[1,2])                4    6        no       6 > 5 remain, break
//   (1,7,[1])                  3    5        no       pick → (4,2,[1,5])
//   (4,2,[1,5])                4    6        no       6 > 2 remain, break (dead)
//   (1,7,[1])                  4    6        no       pick → (5,1,[1,6])
//   (5,1,[1,6])                5    7        no       7 > 1 remain, break (dead)
//   (1,7,[1])                  5    7        no       pick → (6,0,[1,7])    remain==0 RECORD
//   (1,7,[1])                  6   10        no       10 > 7 remain, break
//   (0,8,[])                   1    1        YES (i>start, ==nums[0])   skipped
//   (0,8,[])                   2    2        no       pick → (3,6,[2])
//   (3,6,[2])                  3    5        no       pick → (4,1,[2,5])
//   (4,1,[2,5])                4    6        no       6 > 1 remain, break (dead)
//   (3,6,[2])                  4    6        no       pick → (5,0,[2,6])    remain==0 RECORD
//   (3,6,[2])                  5    7        no       7 > 6 remain, break
//   (0,8,[])                   3    5        no       pick → (4,3,[5])
//   (4,3,[5])                  4    6        no       6 > 3 remain, break (dead)
//   (0,8,[])                   4    6        no       pick → (5,2,[6])
//   (5,2,[6])                  5    7        no       7 > 2 remain, break (dead)
//   (0,8,[])                   5    7        no       pick → (6,1,[7])
//   (6,1,[7])                  6   10        no       10 > 1 remain, break (dead)
//   (0,8,[])                   6   10        no       10 > 8 remain, break
//
// Returns [[1,1,6],[1,2,5],[1,7],[2,6]]

public List<List<Integer>> combinationSum2(int[] candidates, int target) {
  List<List<Integer>> out = new ArrayList<>();
  // Sorting groups duplicate values together (needed for the dedup check below)
  // and lets the loop break early once a candidate exceeds what's left.
  Arrays.sort(candidates);
  dfs(candidates, 0, target, new ArrayList<>(), out);
  return out;
}
private void dfs(int[] nums, int start, int remain, List<Integer> path, List<List<Integer>> out) {
  // Hit the target exactly — save a copy of the current combination
  if (remain == 0) {
    out.add(new ArrayList<>(path));
    return;
  }
  for (int i = start; i < nums.length; i++) {
    // Sorted array: once one candidate is too big, every later one is too — stop the loop entirely
    if (nums[i] > remain) break;
    // Skip the 2nd+ occurrence of a value AT THIS RECURSION DEPTH (i > start), not globally —
    // the first occurrence (i == start) is still tried, so reuse of the value deeper down is fine.
    // This is what prevents two equal input values from producing duplicate combinations.
    if (i > start && nums[i] == nums[i - 1]) continue;
    path.add(nums[i]);   // choose candidates[i]
    // Pass i + 1 (not i) — each array index can only be used once per combination
    dfs(nums, i + 1, remain - nums[i], path, out);
    path.remove(path.size() - 1);   // undo for the next candidate
  }
}`
  },
  {
    num: 169, lc: 131, title: 'Palindrome Partitioning', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking · Palindromes',
    url: 'https://leetcode.com/problems/palindrome-partitioning/',
    approach: 'Backtracking over the choice of "where does the next cut go". At each recursive call, start marks the beginning of the unpartitioned suffix; try every end from start to s.length()-1, and if s[start..end] is a palindrome, take it as the next piece, recurse on the remainder, then undo the choice before trying a longer piece. The key insight is that any valid partition is fully determined by a sequence of cut positions, and pruning a branch the moment a substring fails the palindrome test avoids ever building a partition that could not possibly work — so the search only descends into states that are still viable. A DP table of isPalindrome[i][j] precomputed bottom-up turns each substring check from O(n) into O(1), which matters because the same substring gets re-tested across many branches; skipping it would blow the naive approach up to roughly O(n^3 · 2^n) instead of O(n · 2^n) for generating and copying the partitions themselves. The alternative approach is to build the palindrome-check memo lazily with recursion (isPal(i,j) = s[i]==s[j] && isPal(i+1,j-1)) instead of a bottom-up table, which is equivalent but requires care to avoid recomputation and stack depth issues.',
    complexity: 'O(n · 2^n) time · O(n^2) space (palindrome table + recursion)',
    code: `// Worked trace for s = "aab":
//
// isPalindrome table (T = true, F = false), built bottom-up by substring length:
//   len=1: [0,0]=T "a"    [1,1]=T "a"    [2,2]=T "b"
//   len=2: [0,1]=T "aa" (s[0]==s[1])     [1,2]=F "ab" (s[1]!=s[2])
//   len=3: [0,2]=F "aab" (s[0]!=s[2])
//
// backtrack(start=0, path=[]):
//   end=0 "a"[0,0]=T   -> path=["a"],   backtrack(start=1)
//     end=1 "a"[1,1]=T -> path=["a","a"], backtrack(start=2)
//       end=2 "b"[2,2]=T -> path=["a","a","b"], start=3==len -> record ["a","a","b"]
//     end=2 "ab"[1,2]=F -> skip
//   end=1 "aa"[0,1]=T  -> path=["aa"],  backtrack(start=2)
//     end=2 "b"[2,2]=T -> path=["aa","b"], start=3==len -> record ["aa","b"]
//   end=2 "aab"[0,2]=F -> skip
//
// Returns [["a","a","b"], ["aa","b"]]

public List<List<String>> partition(String s) {
  int n = s.length();
  // isPal[i][j] == true means s[i..j] (inclusive) reads the same forwards and backwards.
  // Precomputing this bottom-up turns every substring check in the search into O(1),
  // which matters because the same substring is re-tested across many recursive branches.
  boolean[][] isPal = new boolean[n][n];
  for (int len = 1; len <= n; len++) {
    for (int i = 0; i + len - 1 < n; i++) {
      int j = i + len - 1;
      if (len == 1) {
        // Single character is trivially a palindrome
        isPal[i][j] = true;
      } else if (len == 2) {
        // Two characters: palindrome iff they match
        isPal[i][j] = s.charAt(i) == s.charAt(j);
      } else {
        // General case: ends must match AND the strictly-inner substring must itself
        // already be known palindromic (isPal[i+1][j-1] was filled in a shorter, earlier pass).
        isPal[i][j] = s.charAt(i) == s.charAt(j) && isPal[i + 1][j - 1];
      }
    }
  }

  List<List<String>> result = new ArrayList<>();
  // path holds the pieces chosen so far for the current partition attempt
  backtrack(s, 0, isPal, new ArrayList<>(), result);
  return result;
}

private void backtrack(String s, int start, boolean[][] isPal,
                        List<String> path, List<List<String>> result) {
  // Consumed the whole string with valid palindrome pieces — this path is a complete partition
  if (start == s.length()) {
    // Copy path, since the same List<String> object keeps getting mutated as we backtrack
    result.add(new ArrayList<>(path));
    return;
  }
  // Try every possible end for the NEXT piece starting at start; the O(1) lookup below is
  // exactly why the precomputed table exists — without it this line would re-scan characters.
  for (int end = start; end < s.length(); end++) {
    if (isPal[start][end]) {
      // Take s[start..end] as the next piece and recurse on the remainder
      path.add(s.substring(start, end + 1));
      backtrack(s, end + 1, isPal, path, result);
      // Undo the choice so the next iteration of this loop starts from a clean path —
      // without this, later branches would carry pieces from a discarded attempt.
      path.remove(path.size() - 1);
    }
  }
}`
  },
  // ─── Graphs (12) ───
  {
    num: 217, lc: 291, title: 'Word Pattern II', d: 'medium',
    bucket: 'Backtracking', category: 'String · Backtracking',
    url: 'https://leetcode.com/problems/word-pattern-ii/',
    approach: 'Unlike Word Pattern I, the string carries no delimiters, so the split itself is unknown and has to be searched. The recursion advances through pattern and string together, and at each step there are two cases. If the current pattern letter already has a binding, the choice is forced: the string must continue with that exact substring, checked with startsWith at an offset so no substring is allocated, and both cursors jump past it. If the letter is unbound, every prefix of the remaining string is tried as its value, with the binding installed before recursing and removed after — the standard make-move / recurse / undo-move shape. The detail that makes this correct rather than merely plausible is that the mapping must be a BIJECTION: a separate set of already-used substrings blocks two different pattern letters from claiming the same word, which is why the classic wrong answer accepts pattern "ab" against "aa". Both structures are undone on the way back up, or a dead branch would poison its siblings. Success is only declared when the pattern is exhausted AND the string is too; running out of pattern with characters left over is a failure, not a match.',
    complexity: 'O(C(n-1, m-1) · n) time worst case · O(n) space',
    code: `// Worked trace for pattern = "abab", s = "redblueredblue"
//
//   depth  letter  state                      try            outcome
//   ────────────────────────────────────────────────────────────────────
//   0      'a'     unbound                    "r"            recurse
//   1      'b'     unbound                    "e"            recurse
//   2      'a'     bound to "r"               needs "r"      "d..." no -> undo
//   1      'b'     unbound                    "ed"           ... eventually fails
//   ...
//   0      'a'     unbound                    "red"          recurse
//   1      'b'     unbound                    "blue"         recurse
//   2      'a'     bound to "red"             matches        recurse
//   3      'b'     bound to "blue"            matches        pattern done,
//                                                            string done -> true
//
// Returns true  (a = "red", b = "blue")

public boolean wordPatternMatch(String pattern, String s) {
  return backtrack(pattern, 0, s, 0, new HashMap<>(), new HashSet<>());
}

private boolean backtrack(String pattern, int pi, String s, int si,
                          Map<Character, String> bound, Set<String> used) {
  // Both cursors must finish together. Exhausting the pattern with string
  // left over is a failure, not a match — hence the second condition.
  if (pi == pattern.length()) {
    return si == s.length();
  }

  char c = pattern.charAt(pi);
  String word = bound.get(c);
  if (word != null) {
    // Already committed: the choice is forced. startsWith at an offset avoids
    // allocating a substring just to compare it.
    if (!s.startsWith(word, si)) {
      return false;
    }
    return backtrack(pattern, pi + 1, s, si + word.length(), bound, used);
  }

  // Unbound letter: the string has no delimiters, so every prefix of what
  // remains is a candidate value and has to be tried.
  for (int end = si + 1; end <= s.length(); end++) {
    String candidate = s.substring(si, end);
    // The mapping must be a BIJECTION. Without this guard two pattern letters
    // could claim the same word, wrongly matching pattern "ab" against "aa".
    if (used.contains(candidate)) {
      continue;
    }
    bound.put(c, candidate);
    used.add(candidate);
    if (backtrack(pattern, pi + 1, s, end, bound, used)) {
      return true;
    }
    // Undo BOTH structures — a dead branch must leave no trace, or it would
    // corrupt the sibling attempts that follow.
    bound.remove(c);
    used.remove(candidate);
  }
  return false;
}`
  },
  {
    num: 84, lc: 200, title: 'Number of Islands', d: 'medium',
    bucket: 'Graphs', category: 'DFS / BFS',
    url: 'https://leetcode.com/problems/number-of-islands/',
    approach: 'Connected-components on an implicit grid graph via flood-fill DFS. Scan every cell; the first time you hit an unvisited \'1\' you have found a brand-new island, so bump the count, then DFS to all reachable land and sink each visited cell to \'0\'. Overwriting in place is the trick that makes a separate visited set unnecessary and guarantees each land cell is touched exactly once. Every cell is pushed and popped at most once, so the work is O(R·C) time; the only extra space is the recursion stack, O(R·C) in the worst case of one snake-like island. Pitfall: deep recursion can stack-overflow on a 300×300 all-land grid, where an explicit stack or BFS queue is safer.',
    complexity: 'O(R · C) time · O(R · C) recursion worst case',
    code: `// Worked trace for grid = [[1,1,0],
//                          [1,0,0],
//                          [0,0,1]]:
//
//   visit (r,c)  grid[r][c]  action                          count
//   ─────────────────────────────────────────────────────────────────
//    (0,0)        '1'        new island → dfs sinks (0,0),     1
//                            (0,1), (1,0) to '0'
//    (0,1)..(1,2) '0'        already water → skip              1
//    (2,0),(2,1)  '0'        water → skip                      1
//    (2,2)        '1'        new island → dfs sinks (2,2)      2
//
// Returns 2

public int numIslands(char[][] grid) {
  int count = 0;
  // Sweep the whole grid; the scan order doesn't matter because dfs
  // erases each island entirely the moment its first cell is seen.
  for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[0].length; c++) {
      // Each '1' we encounter starts a new island — fill it to 0 so it isn't counted again
      if (grid[r][c] == '1') {
        dfs(grid, r, c);   // flood-fill removes this whole island
        count++;           // ...so it can never be counted twice
      }
    }
  }
  return count;
}
// Flood-fill: mark this cell and recurse into the 4 neighbors
private void dfs(char[][] g, int r, int c) {
  // Bounds check + "is this still land?" guard, all in one line.
  // Returning on g[r][c] != '1' also stops us re-entering sunk cells.
  if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;
  // Sinking the cell to '0' doubles as our "visited" marker — no separate set needed
  g[r][c] = '0';
  // Spread to all four orthogonal neighbors; diagonals are NOT connected here
  dfs(g, r + 1, c); dfs(g, r - 1, c);
  dfs(g, r, c + 1); dfs(g, r, c - 1);
}`
  },
  {
    num: 85, lc: 133, title: 'Clone Graph', d: 'medium',
    bucket: 'Graphs', category: 'DFS · Hash Map',
    url: 'https://leetcode.com/problems/clone-graph/',
    approach: 'DFS clone with a hash map from each original node to its clone. The map does double duty: it is the memo that stops infinite recursion on cycles and the lookup that ensures shared neighbors get cloned once, not duplicated. The decisive detail is creating and registering the clone BEFORE recursing into neighbors — that way, when a cycle leads back to a node already in progress, the map hands back the existing clone instead of spinning forever. Each vertex and edge is processed once, giving O(V+E) time; the map plus recursion stack are O(V) space. A naïve clone without the visited map would loop endlessly on any cycle.',
    complexity: 'O(V + E) time · O(V) space',
    code: `// Worked trace for a 2-node cycle: 1 — 2 (each is the other's neighbor),
// starting cloneGraph(node1):
//
//   call             map state            action
//   ─────────────────────────────────────────────────────────────────
//   clone(1)         {}                   not in map → make 1', put {1:1'}
//     recurse n=2                         iterate node1.neighbors → 2
//   clone(2)         {1:1'}               not in map → make 2', put {1:1',2:2'}
//     recurse n=1                         iterate node2.neighbors → 1
//   clone(1)         {1:1',2:2'}          IN MAP → return 1' (cycle broken!)
//     2'.neighbors += 1'
//   back in clone(1)                      1'.neighbors += 2'
//
// Returns 1', a deep copy of the cycle

// class Node { int val; List<Node> neighbors; ... }
// Map persists across the recursion so every node is cloned exactly once.
private Map<Node, Node> map = new HashMap<>();

public Node cloneGraph(Node node) {
  if (node == null) return null;   // empty graph → nothing to copy
  // If we already cloned this node, return the clone — this is what breaks cycles
  if (map.containsKey(node)) return map.get(node);
  // Create the clone BEFORE recursing into neighbors so cycles see it on revisit
  Node clone = new Node(node.val, new ArrayList<>());
  map.put(node, clone);   // register NOW, while neighbors are still empty
  // Now safely recurse — clones of neighbors fill in once
  for (Node n : node.neighbors) clone.neighbors.add(cloneGraph(n));
  return clone;
}`
  },
  {
    num: 86, lc: 207, title: 'Course Schedule', d: 'medium', companies: ['Temu', 'Garmin'],
    bucket: 'Graphs', category: 'Topological Sort',
    url: 'https://leetcode.com/problems/course-schedule/',
    approach: 'Cycle detection by topological sort using Kahn\'s algorithm (BFS on in-degrees). Build an adjacency list and an in-degree count per course, then repeatedly take any course with zero remaining prerequisites and decrement its dependents. The key invariant: a course can be scheduled only after all its prerequisites have been scheduled, so if the graph is acyclic every course eventually reaches in-degree 0 and gets processed. If a cycle exists, the nodes on it never drop to 0 and stay stuck in the graph. Hence the count of processed courses equals n exactly when there is no cycle. Building the graph and visiting each edge once gives O(V+E) time and O(V+E) space.',
    complexity: 'O(V + E) time · O(V + E) space',
    code: `// Worked trace for n = 3, prereqs = [[1,0],[2,1]]  (0→1→2 chain):
//
//   step  queue   indeg[0,1,2]  taken  action
//   ──────────────────────────────────────────────────────────────
//   init  [0]     [0,1,1]       0      only course 0 has indeg 0
//   poll0 []      [0,0,1]       1      take 0; edge 0→1 drops indeg[1]→0, push 1
//   poll1 [1]→[]  [0,0,0]       2      take 1; edge 1→2 drops indeg[2]→0, push 2
//   poll2 [2]→[]  [0,0,0]       3      take 2; no outgoing edges
//
// taken (3) == n (3) → Returns true

public boolean canFinish(int n, int[][] prereqs) {
  // Build adjacency list + in-degree array
  List<List<Integer>> graph = new ArrayList<>();
  for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
  int[] indeg = new int[n];   // indeg[x] = how many prereqs course x still needs
  // prereqs[i] = [course, prerequisite] → edge prerequisite → course
  for (int[] p : prereqs) {
    graph.get(p[1]).add(p[0]);   // finishing p[1] unlocks p[0]
    indeg[p[0]]++;               // ...so p[0] gains one incoming dependency
  }

  // Kahn's: start with all nodes that have no incoming edges
  Queue<Integer> q = new ArrayDeque<>();
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);

  int taken = 0;   // how many courses we have managed to schedule
  while (!q.isEmpty()) {
    int c = q.poll(); taken++;
    // "Take" this course — its prereqs are met for downstream courses
    for (int next : graph.get(c)) if (--indeg[next] == 0) q.offer(next);
  }
  // If we couldn't process every course, there's a cycle blocking some
  return taken == n;
}`
  },
  {
    num: 87, lc: 417, title: 'Pacific Atlantic Water Flow', d: 'medium',
    bucket: 'Graphs', category: 'DFS',
    url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
    approach: 'Reverse-flow DFS (multi-source) from the ocean borders inward. Instead of simulating downhill flow to an ocean from each cell — which repeats work for every start — flip the rule: starting at an ocean\'s edge cells, move to neighbors of equal-or-greater height, marking exactly the cells that could drain back to that ocean. Run it for the Pacific edges and the Atlantic edges into two boolean grids; the answer is their intersection. This is correct because reachability uphill from the ocean is the exact inverse of reachability downhill to it. Each cell is visited a constant number of times per ocean, so O(R·C) time and O(R·C) space for the visited grids plus recursion.',
    complexity: 'O(R · C) time · O(R · C) space',
    code: `// Worked trace for h = [[1,2],
//                       [4,3]]  (R=2, C=2):
//
//   seed step          pac reachable        atl reachable
//   ──────────────────────────────────────────────────────────────
//   left col → pac     (0,0),(1,0); from
//                      (1,0) uphill→ (1,1)  —
//   top row  → pac     (0,0),(0,1) added    —
//   right col→ atl     —                    (0,1),(1,1); (0,1)≥? (0,0)=1
//                                            so (0,0) added too
//   bottom   → atl     —                    (1,0),(1,1) added
//   intersect: pac={all}, atl={all} → every cell drains to both
//
// Returns [[0,0],[0,1],[1,0],[1,1]]

public List<List<Integer>> pacificAtlantic(int[][] h) {
  int R = h.length, C = h[0].length;
  // Two visited sets: cells reachable from each ocean (working INWARD)
  boolean[][] pac = new boolean[R][C], atl = new boolean[R][C];
  // Seed from each ocean's border row/column
  for (int r = 0; r < R; r++) {
    dfs(h, r, 0, pac, 0);     // left column touches the Pacific
    dfs(h, r, C-1, atl, 0);   // right column touches the Atlantic
  }
  for (int c = 0; c < C; c++) {
    dfs(h, 0, c, pac, 0);     // top row touches the Pacific
    dfs(h, R-1, c, atl, 0);   // bottom row touches the Atlantic
  }

  // Any cell reachable from BOTH oceans is in our answer
  List<List<Integer>> out = new ArrayList<>();
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
      if (pac[r][c] && atl[r][c]) out.add(List.of(r, c));
  return out;
}
// Reversed flow: we can move uphill or stay flat (h[r][c] >= prev)
private void dfs(int[][] h, int r, int c, boolean[][] seen, int prev) {
  // Stop at borders, on revisits, or when the next cell is LOWER than where
  // we came from — water couldn't have flowed up into here.
  if (r < 0 || c < 0 || r >= h.length || c >= h[0].length || seen[r][c] || h[r][c] < prev) return;
  seen[r][c] = true;   // this cell can reach the ocean we seeded from
  // Recurse outward, passing THIS cell's height as the new floor
  dfs(h, r+1, c, seen, h[r][c]); dfs(h, r-1, c, seen, h[r][c]);
  dfs(h, r, c+1, seen, h[r][c]); dfs(h, r, c-1, seen, h[r][c]);
}`
  },
  {
    num: 88, lc: 994, title: 'Rotting Oranges', d: 'medium',
    bucket: 'Graphs', category: 'BFS',
    url: 'https://leetcode.com/problems/rotting-oranges/',
    approach: 'Multi-source BFS where each wave of the search equals one minute of elapsed time. Seed the queue with every initially-rotten orange at once and count the fresh ones up front. Processing the queue one full level at a time handles all oranges that rot in the same minute together, so the number of completed levels is exactly the elapsed minutes — the level structure encodes time, which a single-source BFS could not. Decrement the fresh counter as oranges rot; if it hits 0 the answer is the level count, otherwise a fresh orange was unreachable and you return -1. Every cell enters the queue at most once, giving O(R·C) time and O(R·C) space.',
    complexity: 'O(R · C) time · O(R · C) space',
    code: `// Worked trace for grid = [[2,1],
//                          [1,1]]  (R=2, C=2):
//
//   minute  queue (rotten)  grid snapshot   fresh
//   ──────────────────────────────────────────────────────────────
//   start   [(0,0)]         [[2,1],[1,1]]   3
//   m=1     poll (0,0) →    [[2,2],[2,1]]   1     rots (0,1) & (1,0)
//           push (0,1),(1,0)
//   m=2     poll those →    [[2,2],[2,2]]   0     (1,1) rots from either
//
// fresh == 0 → Returns 2

public int orangesRotting(int[][] grid) {
  int R = grid.length, C = grid[0].length, fresh = 0;
  // Multi-source BFS: queue starts with EVERY initially-rotten orange
  Queue<int[]> q = new ArrayDeque<>();
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++) {
      if (grid[r][c] == 2) q.offer(new int[]{ r, c });
      else if (grid[r][c] == 1) fresh++;   // count fresh oranges to track progress
    }
  int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
  int minutes = 0;
  // Process level by level — each level = one minute of rot spreading
  while (!q.isEmpty() && fresh > 0) {   // stop early once nothing fresh remains
    int size = q.size();   // freeze this minute's frontier before we add to it
    for (int i = 0; i < size; i++) {
      int[] p = q.poll();
      for (int[] d : dirs) {
        int nr = p[0] + d[0], nc = p[1] + d[1];
        // Skip out-of-bounds and any cell that isn't a FRESH orange
        if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc] != 1) continue;
        grid[nr][nc] = 2; fresh--;        // rot it now and shrink the fresh count
        q.offer(new int[]{ nr, nc });     // it spreads on the NEXT minute
      }
    }
    minutes++;   // one full frontier processed = one minute elapsed
  }
  // If any fresh oranges remain, they were unreachable from any rotten one
  return fresh == 0 ? minutes : -1;
}`
  },
  {
    num: 89, lc: 79, title: 'Word Search', d: 'medium',
    bucket: 'Graphs', category: 'DFS · Backtracking',
    url: 'https://leetcode.com/problems/word-search/',
    approach: 'Depth-first search with backtracking from every cell. Treat each cell as a possible start for the word and recurse to neighbors that match the next character. The backtracking trick is to temporarily overwrite the current cell with a sentinel (\'#\') so it can\'t be reused inside the active path, then restore it on the way out so other paths remain free to use it — this gives the no-reuse guarantee without a separate visited matrix. The search short-circuits the instant any path matches the whole word. Worst case explores up to 4 directions at each of L depths from R·C starts, hence O(R·C·4^L) time; recursion depth and the in-place marking keep extra space at O(L).',
    complexity: 'O(R · C · 4^L) time · O(L) recursion',
    code: `// Worked trace for board = [[A,B],
//                          [C,D]], word = "ABD":
//
//   call dfs(r,c,i)  board[r][c]  matches w[i]?  action
//   ──────────────────────────────────────────────────────────────
//   (0,0,0)          A            'A'==w[0] yes  mark '#', recurse i=1
//     (1,0,1) 'C'    no ('A'≠'B') → false
//     (0,1,1) 'B'    'B'==w[1] yes  mark '#', recurse i=2
//        (1,1,2) 'D' 'D'==w[2] yes  mark '#', recurse i=3
//           i==len → return true (whole word matched)
//   restore all '#' on unwind
//
// Returns true

public boolean exist(char[][] board, String word) {
  // Try starting from every cell — DFS will short-circuit on the first match
  for (int r = 0; r < board.length; r++)
    for (int c = 0; c < board[0].length; c++)
      if (dfs(board, r, c, word, 0)) return true;
  return false;   // no starting cell led to a full match
}
private boolean dfs(char[][] b, int r, int c, String w, int i) {
  if (i == w.length()) return true;   // matched every char
  // Out of bounds OR wrong char at this position → dead end
  if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != w.charAt(i)) return false;
  // Temporarily mark cell visited so we don't reuse it within this path
  char save = b[r][c];
  b[r][c] = '#';
  // Try all four neighbors for the NEXT character; OR short-circuits on first hit
  boolean found = dfs(b, r+1, c, w, i+1) || dfs(b, r-1, c, w, i+1)
               || dfs(b, r, c+1, w, i+1) || dfs(b, r, c-1, w, i+1);
  // Restore — other DFS paths from elsewhere may want this cell
  b[r][c] = save;
  return found;
}`
  },
  {
    num: 90, lc: 286, title: 'Walls and Gates', d: 'medium',
    bucket: 'Graphs', category: 'BFS',
    url: 'https://leetcode.com/problems/walls-and-gates/',
    approach: 'Multi-source BFS launched from every gate simultaneously. Because BFS expands in order of increasing distance and all gates start at distance 0 together, the first time any room is reached it is reached along a shortest path from the closest gate — so a single pass assigns every room its correct minimum distance with no relaxation needed. The guard "only write a room still equal to INF" serves as the visited check: walls (-1) and already-filled rooms are skipped, preventing overwrites with a longer distance. Seeding all gates at once is what beats running a separate BFS per gate. Each cell is enqueued at most once, giving O(R·C) time and O(R·C) queue space.',
    complexity: 'O(R · C) time · O(R · C) space',
    code: `// Worked trace for rooms = [[ 0, INF],
//                          [-1, INF]]  (INF = 2147483647):
//
//   step    queue        grid snapshot          note
//   ──────────────────────────────────────────────────────────────
//   seed    [(0,0)]      [[0,INF],[-1,INF]]     only the gate
//   poll00  []           [[0,1],  [-1,INF]]     (0,1)=INF → 0+1; push (0,1)
//                                               (1,0)=-1 wall → skip
//   poll01  [(0,1)]→[]   [[0,1],  [-1,2]]       (1,1)=INF → 1+1; push (1,1)
//   poll11  [(1,1)]→[]   [[0,1],  [-1,2]]       neighbors are wall/filled
//
// Returns (in place) [[0,1],[-1,2]]

public void wallsAndGates(int[][] rooms) {
  int R = rooms.length, C = rooms[0].length;
  Queue<int[]> q = new ArrayDeque<>();
  // Seed queue with EVERY gate — BFS expands from all gates at once
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
      if (rooms[r][c] == 0) q.offer(new int[]{ r, c });
  int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
  while (!q.isEmpty()) {
    int[] p = q.poll();
    for (int[] d : dirs) {
      int nr = p[0] + d[0], nc = p[1] + d[1];
      if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;   // off the grid
      // INF is the only value we update — walls (-1) and already-visited rooms stay
      if (rooms[nr][nc] != Integer.MAX_VALUE) continue;
      // First arrival = shortest path, so this is the final distance
      rooms[nr][nc] = rooms[p[0]][p[1]] + 1;
      q.offer(new int[]{ nr, nc });   // expand outward from this room next
    }
  }
}`
  },
  {
    num: 91, lc: 130, title: 'Surrounded Regions', d: 'medium',
    bucket: 'Graphs', category: 'DFS',
    url: 'https://leetcode.com/problems/surrounded-regions/',
    approach: 'Inverse marking via DFS from the border. Rather than verifying each interior region is surrounded — which is awkward directly — flip the question: an \'O\' survives exactly when it is reachable from a border \'O\'. So DFS from every border \'O\', tagging each reachable cell with a temporary \'#\'. Then a single sweep flips any remaining plain \'O\' (provably surrounded) to \'X\' and restores every \'#\' back to \'O\'. This is correct because connectivity to the border is the precise complement of being surrounded. Each cell is visited a constant number of times, so O(R·C) time; the recursion stack is O(R·C) worst case. Pitfall: forgetting to restore the \'#\' sentinels corrupts the board.',
    complexity: 'O(R · C) time · O(R · C) recursion',
    code: `// Worked trace for board = [[X,O,X],
//                          [X,O,X],
//                          [X,X,X]]:
//
//   phase            board snapshot        note
//   ──────────────────────────────────────────────────────────────
//   border dfs       [[X,#,X],             top (0,1)='O' touches border →
//                     [X,O,X],             mark '#'; its neighbor (1,1)='O'
//                     [X,X,X]]             is NOT border-reachable (no path
//                                          of O's to an edge other than via
//                                          (0,1)) → here (1,1) IS reached
//   (1,1) reached    [[X,#,X],[X,#,X],...] both O's connect to border O
//   final sweep      '#'→'O', stray 'O'→'X'
//
// Returns (in place) the board with surrounded O's flipped, survivors kept

public void solve(char[][] board) {
  int R = board.length, C = board[0].length;
  // INVERSE: instead of finding surrounded O's, mark the ones that touch the border.
  // They (and their connected O's) are the survivors.
  for (int r = 0; r < R; r++) {
    dfs(board, r, 0);     // left edge
    dfs(board, r, C-1);   // right edge
  }
  for (int c = 0; c < C; c++) {
    dfs(board, 0, c);     // top edge
    dfs(board, R-1, c);   // bottom edge
  }
  // Final sweep: real O's left untouched are surrounded → X. Survivors (#) → O.
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
      board[r][c] = (board[r][c] == 'O') ? 'X'      // never reached → captured
                   : (board[r][c] == '#') ? 'O'     // border-connected → restored
                   : board[r][c];                   // 'X' stays 'X'
}
private void dfs(char[][] b, int r, int c) {
  // Bounds guard; also stop on 'X' walls and on '#' we've already marked
  if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != 'O') return;
  b[r][c] = '#';   // mark as "connected to border" (survivor)
  // Spread through the whole border-connected O region
  dfs(b, r+1, c); dfs(b, r-1, c); dfs(b, r, c+1); dfs(b, r, c-1);
}`
  },

  {
    num: 170, lc: 733, title: 'Flood Fill', d: 'easy', companies: ['Garmin'],
    bucket: 'Graphs', category: 'Grid · DFS',
    url: 'https://leetcode.com/problems/flood-fill/',
    approach: 'Treat the grid as an implicit graph where each cell is connected to its 4 orthogonal neighbors, then flood outward from the starting pixel with DFS, repainting every reachable cell that shares the starting color. The key insight that makes this correct (and terminating) is checking image[r][c] == startColor before recursing and BEFORE overwriting it: that comparison is what stops the fill at color boundaries, and painting the cell first is what prevents infinite re-visits once a neighbor is revisited. A classic trap is when startColor equals the fill color — recoloring a cell to the same value it already holds would make the "still matches startColor" check true forever, so the function must short-circuit and return immediately when color == startColor, before touching a single pixel. BFS with an explicit queue is an equivalent alternative and avoids the (usually negligible) call-stack depth of recursive DFS on very large images; either way each of the up to 50 x 50 cells is visited once, giving O(n) time where n is the pixel count, and O(n) space for the recursion stack or queue in the worst fully-connected case.',
    complexity: 'O(n) time (n = pixels) · O(n) space (recursion stack)',
    code: `// Worked trace for image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2:
// (dfs visits neighbors in the order: down, up, right, left)
//
//   dfs(r,c)  image[r][c] before  startColor  action
//   ───────────────────────────────────────────────────────
//   (1,1)          1                 1        paint 2, recurse
//   (2,1)          0                 1        0 != 1, return
//   (0,1)          1                 1        paint 2, recurse
//   (0,2)          1                 1        paint 2, recurse
//   (1,2)          0                 1        0 != 1, return
//   (0,0)          1                 1        paint 2, recurse
//   (1,0)          1                 1        paint 2, recurse
//   (2,0)          1                 1        paint 2, recurse
//   (1,1) revisit  2 (already 2)     1        2 != 1, return
//
// Every remaining neighbor is either out of bounds or already painted/blocked.
// Returns [[2,2,2],[2,2,0],[2,0,1]]

public int[][] floodFill(int[][] image, int sr, int sc, int color) {
  // Remember the color we're flooding FROM, not the target color — needed to
  // detect boundaries and to guard the no-op case below.
  int startColor = image[sr][sc];
  // If the new color is identical to the old one, every recursive call would see
  // "still equals startColor" and never terminate — bail out before painting anything.
  if (startColor == color) return image;
  dfs(image, sr, sc, startColor, color);
  return image;
}

private void dfs(int[][] image, int r, int c, int startColor, int color) {
  // Out-of-bounds neighbors simply aren't part of the region — stop recursing.
  if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;
  // Either a different region entirely, or a cell we already repainted this call
  // (it now holds color, not startColor) — both cases mean stop here.
  if (image[r][c] != startColor) return;
  // Paint BEFORE recursing into neighbors: this is what turns the implicit graph
  // walk into a terminating one, since a repainted cell no longer matches startColor.
  image[r][c] = color;
  // Flood outward to all 4 orthogonal neighbors; diagonals are not connected.
  dfs(image, r + 1, c, startColor, color);
  dfs(image, r - 1, c, startColor, color);
  dfs(image, r, c + 1, startColor, color);
  dfs(image, r, c - 1, startColor, color);
}`
  },
  {
    num: 171, lc: 695, title: 'Max Area of Island', d: 'medium',
    bucket: 'Graphs', category: 'Grid · DFS',
    url: 'https://leetcode.com/problems/max-area-of-island/',
    approach: 'Same flood-fill skeleton as Number of Islands, but each DFS call now returns a count instead of just erasing land. Scan every cell; the first time an unvisited 1 is found, DFS out to the whole connected component, summing 1 for the starting cell plus whatever each of the four neighbor calls reports, and track the running maximum across all components. Sinking each visited cell to 0 as it is counted is what makes a separate visited set unnecessary and guarantees every land cell contributes to exactly one island\'s area. The key insight is that the recursion\'s return value composes additively — area(cell) = 1 + area(up) + area(down) + area(left) + area(right) — so the total area of a component falls out of the same traversal that discovers it, with no second pass needed. A naive approach that DFS-marks components without accumulating a size (e.g., only counting islands) would need a wholly separate area-counting step, doubling the grid scans. Every cell is visited and sunk at most once, giving O(R·C) time; the only extra space is the recursion stack, O(R·C) in the worst case of one giant snake-shaped island. An equivalent alternative swaps the recursive DFS for an explicit stack or a BFS queue, which avoids stack-overflow risk on very large grids.',
    complexity: 'O(R · C) time · O(R · C) recursion worst case',
    code: `// Worked trace for grid = [[1,1,0],
//                          [0,1,0],
//                          [0,0,1]]:
//
//   visit (r,c)  grid[r][c]  action                              area  best
//   ──────────────────────────────────────────────────────────────────────────
//    (0,0)        1          dfs(0,0): sink (0,0)=1,               3     3
//                             + dfs(0,1) sinks (0,1)=1 → +1,
//                             + dfs(1,1) sinks (1,1)=1 → +1
//    (0,1),(1,1)  0          already sunk by the dfs above → skip  -     3
//    (1,0)        0          water → skip                          -     3
//    (2,0),(2,1)  0          water → skip                          -     3
//    (2,2)        1          dfs(2,2): sink (2,2)=1, no land        1     3
//                             neighbors → area 1
//
// Returns 3

public int maxAreaOfIsland(int[][] grid) {
  int best = 0;
  // Sweep every cell; order doesn't matter because dfs consumes (sinks)
  // an entire component the first time any of its cells is reached.
  for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[0].length; c++) {
      // Only unvisited land can start a new component measurement
      if (grid[r][c] == 1) {
        // dfs both measures AND erases this island in one traversal
        best = Math.max(best, dfs(grid, r, c));
      }
    }
  }
  return best;
}
// Returns the area of the connected land component reachable from (r, c),
// sinking every cell it counts so no cell is ever double-counted.
private int dfs(int[][] g, int r, int c) {
  // Bounds check + "is this still unvisited land?" guard in one line.
  // Returning 0 here also correctly excludes water from the running sum.
  if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != 1) return 0;
  // Sink this cell immediately so re-entering it (e.g. from a neighbor) returns 0
  g[r][c] = 0;
  // This cell contributes 1, plus whatever area each neighbor's dfs finds.
  // Diagonals are NOT connected, so only the four orthogonal directions count.
  return 1 + dfs(g, r + 1, c) + dfs(g, r - 1, c)
           + dfs(g, r, c + 1) + dfs(g, r, c - 1);
}`
  },
  {
    num: 172, lc: 210, title: 'Course Schedule II', d: 'medium', companies: ['Temu'],
    bucket: 'Graphs', category: 'Topological Sort',
    url: 'https://leetcode.com/problems/course-schedule-ii/',
    approach: 'Same Kahn\'s-algorithm BFS as Course Schedule, but this time the order in which nodes are polled from the queue IS the answer, not just a count. Build an adjacency list and an in-degree array from the prerequisite pairs, seed the queue with every course whose in-degree is already 0 (no prerequisites), then repeatedly poll a course, append it to the result, and decrement the in-degree of everything it unlocks — pushing any neighbor that drops to 0. The invariant that makes the emitted order valid: a course is only appended once every one of its prerequisites has already been appended and removed, so no course can ever precede a course it depends on. If a cycle exists, the courses on it never reach in-degree 0, so they never enter the queue, and the result list ends up shorter than n — the exact signal to return an empty array instead of a partial ordering. This runs in O(V + E) time and O(V + E) space since each edge and vertex is processed once. DFS with post-order-reversed finish times (detecting back edges via a three-color visited array) is an equivalent alternative that produces a different but equally valid ordering.',
    complexity: 'O(V + E) time · O(V + E) space',
    code: `// Worked trace for n = 4, prereqs = [[1,0],[2,0],[3,1],[3,2]]:
//
//   step   queue after   indeg[0,1,2,3]  order so far   action
//   ────────────────────────────────────────────────────────────────────
//   init   [0]            [0,1,1,2]       []             only course 0 has indeg 0
//   poll0  [1,2]           [0,0,0,2]       [0]            take 0; edges 0->1, 0->2 fire,
//                                                            indeg[1]->0, indeg[2]->0, push both
//   poll1  [2]             [0,0,0,1]       [0,1]          take 1; edge 1->3 drops indeg[3]->1
//   poll2  [3]             [0,0,0,0]       [0,1,2]        take 2; edge 2->3 drops indeg[3]->0, push 3
//   poll3  []              [0,0,0,0]       [0,1,2,3]      take 3; no outgoing edges
//
// order.size() (4) == n (4) -> Returns [0, 1, 2, 3]

public int[] findOrder(int n, int[][] prereqs) {
  // Build adjacency list + in-degree array, same shape as Course Schedule I
  List<List<Integer>> graph = new ArrayList<>();
  for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
  int[] indeg = new int[n];   // indeg[x] = how many prereqs course x still needs
  // prereqs[i] = [course, prerequisite] -> edge prerequisite -> course
  for (int[] p : prereqs) {
    graph.get(p[1]).add(p[0]);   // finishing p[1] unlocks p[0]
    indeg[p[0]]++;               // ...so p[0] gains one incoming dependency
  }

  // Kahn's: start with all nodes that have no incoming edges — safe to take first
  Queue<Integer> q = new ArrayDeque<>();
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);

  // Unlike Course Schedule I we need the actual sequence, not just a count
  int[] order = new int[n];
  int idx = 0;   // how many courses we've appended so far
  while (!q.isEmpty()) {
    int c = q.poll();
    // Record c in the order — every prereq of c is already recorded, by construction
    order[idx++] = c;
    // "Take" this course — its prereqs are met for downstream courses
    for (int next : graph.get(c)) if (--indeg[next] == 0) q.offer(next);
  }
  // If we couldn't order every course, a cycle blocked some — no valid schedule exists
  return idx == n ? order : new int[0];
}`
  },
  {
    num: 173, lc: 684, title: 'Redundant Connection', d: 'medium',
    bucket: 'Graphs', category: 'Union-Find',
    url: 'https://leetcode.com/problems/redundant-connection/',
    approach: 'The input describes a tree of n nodes plus exactly one extra edge, so treat it as union-find cycle detection processed in the given edge order. Walk the edges left to right, and for each edge (u, v) ask whether u and v are already connected through previously-accepted edges; if they are, this edge closes a cycle and — because it is guaranteed to be the last such edge to appear when read in order — it must be the one removed, so return it immediately. Otherwise union the two components and keep going. The key insight is that a tree has exactly n-1 edges and adding any one extra edge creates exactly one cycle, so the very first edge whose endpoints are already unioned is provably the redundant one; there is no need to compare candidates or backtrack. Naively re-running DFS/BFS after removing each edge to check for remaining cycles would cost O(n^2) or worse, whereas union-find with path compression and union by rank answers each connectivity query in near-constant amortized time. This also beats a plain adjacency-list cycle scan because it never has to rebuild or re-traverse the graph. With path compression and union by rank, total time is O(n · alpha(n)) — effectively linear — with O(n) space for the parent/rank arrays. An equivalent alternative is building the graph incrementally and running DFS from each new edge\'s endpoints to check for an existing path between them before adding it.',
    complexity: 'O(n · alpha(n)) time · O(n) space',
    code: `// Worked trace for edges = [[1,2],[1,3],[2,3]]  (n = 3 nodes):
//
//   edge     find(u)  find(v)  same root?  action                  parent[] after
//   ────────────────────────────────────────────────────────────────────────────
//   [1,2]      1        2         no        union → parent[2]=1    [0,1,1,3]
//   [1,3]      1        3         no        union → parent[3]=1    [0,1,1,1]
//   [2,3]      1        1         yes       cycle! return [2,3]    [0,1,1,1]
//
// Returns [2, 3]

public int[] findRedundantConnection(int[][] edges) {
  int n = edges.length;
  // n nodes are labeled 1..n; index 0 is unused but kept for direct 1-based indexing
  int[] parent = new int[n + 1];
  int[] rank = new int[n + 1];
  // Every node starts as its own root — no edges accepted yet
  for (int i = 1; i <= n; i++) parent[i] = i;

  // Process edges in the given order: the guarantee that exactly one extra
  // edge exists means the first cycle-closing edge we hit IS the answer.
  for (int[] edge : edges) {
    int u = edge[0], v = edge[1];
    int rootU = find(parent, u);
    int rootV = find(parent, v);
    // Same root means u and v were already connected by earlier edges —
    // adding this one would close a cycle, so it is the redundant edge.
    if (rootU == rootV) return edge;
    // Union by rank keeps the trees shallow, which keeps find() near O(1)
    if (rank[rootU] < rank[rootV]) {
      parent[rootU] = rootV;
    } else if (rank[rootU] > rank[rootV]) {
      parent[rootV] = rootU;
    } else {
      // Equal rank: pick either as new root, then bump its rank
      parent[rootV] = rootU;
      rank[rootU]++;
    }
  }
  // Problem guarantees an answer exists, so this line is unreachable in practice
  return new int[0];
}

// Path-compressed find: flattens the tree toward the root as a side effect,
// so repeated calls on the same node get progressively cheaper.
private int find(int[] parent, int x) {
  if (parent[x] != x) parent[x] = find(parent, parent[x]);
  return parent[x];
}`
  },
  // ─── Advanced Graphs (8) ───
  {
    num: 218, lc: 3387, title: 'Maximize Amount After Two Days of Conversions', d: 'medium',
    bucket: 'Graphs', category: 'Graph · DFS · Currency',
    url: 'https://leetcode.com/problems/maximize-amount-after-two-days-of-conversions/',
    approach: 'Each day is an undirected weighted graph on currencies — a stated rate gives the forward edge and its reciprocal gives the backward one — and the plan is always the same shape: convert the initial currency into some intermediate on day one, then convert that intermediate back on day two. So the answer is a maximum over intermediates of (amount of c reachable on day 1) times (rate from c back to the initial currency on day 2). The neat part is that the day-2 half needs no separate reverse search. Running the same traversal from the initial currency in the day-2 graph yields how many units of c one unit of initial buys; converting in the other direction is simply the reciprocal, so a single division finishes it. The problem guarantees the rates contain no contradictions, which means every path between two currencies produces the same product — that is why an unweighted-style DFS recording the first amount found is sufficient and no relaxation or shortest-path machinery is needed. The result starts at 1.0 to cover the do-nothing plan, which wins when no profitable round trip exists, and intermediates unreachable on day 2 are skipped since there is no way back.',
    complexity: 'O(V + E) time · O(V + E) space',
    code: `// Worked trace for initialCurrency = "EUR"
//   day 1: EUR -> USD at 2.0, USD -> JPY at 3.0
//   day 2: JPY -> USD at 4.0, USD -> CHF at 5.0, CHF -> EUR at 6.0
//
//   day1 amounts from 1 EUR:   EUR 1.0,  USD 2.0,  JPY 6.0
//   day2 amounts from 1 EUR:   EUR 1.0,  CHF 1/6, USD 1/30, JPY 1/120
//
//   intermediate   day1[c]   day2[c]    day1 / day2   -> EUR obtained
//   ─────────────────────────────────────────────────────────────────
//   EUR             1.0       1.0        1.0
//   USD             2.0       1/30       60.0
//   JPY             6.0       1/120      720.0        <- best
//
// Returns 720.0

public double maxAmount(String initialCurrency,
                        List<List<String>> pairs1, double[] rates1,
                        List<List<String>> pairs2, double[] rates2) {
  Map<String, Double> day1 = reachable(initialCurrency, pairs1, rates1);
  Map<String, Double> day2 = reachable(initialCurrency, pairs2, rates2);

  // Start at 1.0: doing nothing at all is always a legal plan, and it wins
  // whenever no round trip beats holding the initial currency.
  double best = 1.0;
  for (Map.Entry<String, Double> entry : day1.entrySet()) {
    Double forward = day2.get(entry.getKey());
    // day2 says 1 unit of initial buys 'forward' units of this currency, so
    // one unit of this currency converts BACK to 1 / forward units of initial.
    // A currency missing from day2 has no route home and is skipped.
    if (forward != null) {
      best = Math.max(best, entry.getValue() / forward);
    }
  }
  return best;
}

/** How many units of each reachable currency one unit of 'start' buys that day. */
private Map<String, Double> reachable(String start, List<List<String>> pairs, double[] rates) {
  // Both directions: a quoted rate and its reciprocal
  Map<String, Map<String, Double>> graph = new HashMap<>();
  for (int i = 0; i < pairs.size(); i++) {
    String from = pairs.get(i).get(0);
    String to = pairs.get(i).get(1);
    graph.computeIfAbsent(from, k -> new HashMap<>()).put(to, rates[i]);
    graph.computeIfAbsent(to, k -> new HashMap<>()).put(from, 1.0 / rates[i]);
  }

  Map<String, Double> amount = new HashMap<>();
  amount.put(start, 1.0);
  Deque<String> stack = new ArrayDeque<>();
  stack.push(start);

  while (!stack.isEmpty()) {
    String cur = stack.pop();
    for (Map.Entry<String, Double> edge : graph.getOrDefault(cur, Map.of()).entrySet()) {
      // The problem guarantees the rates are free of contradictions, so every
      // path to a currency yields the same product. That is why simply keeping
      // the FIRST amount found is correct — no relaxation pass is needed.
      if (!amount.containsKey(edge.getKey())) {
        amount.put(edge.getKey(), amount.get(cur) * edge.getValue());
        stack.push(edge.getKey());
      }
    }
  }
  return amount;
}`
  },
  {
    num: 113, lc: 1632, title: 'Rank Transform of a Matrix', d: 'hard', companies: ['Garmin'],
    bucket: 'Advanced Graphs', category: 'Union-Find · Sort',
    url: 'https://leetcode.com/problems/rank-transform-of-a-matrix/',
    approach: 'Greedy by value with union-find. Process distinct values in ascending order so that once a rank is assigned it is never beaten by a larger value. For a fixed value, cells in the same row or column that share that value must get the same rank, so union them: model each of the m rows as a node 0..m-1 and each of the n columns as a node m..m+n-1, then union row i with column j for every cell (i,j) of that value. Each connected group\x27s rank is 1 plus the maximum rank already used on any row or column it touches (tracked by rowRank/colRank high-water arrays). Writing the group rank and raising those marks keeps the < constraint intact. Sorting dominates: O(m·n·log(m·n)) time, O(m·n) space.',
    complexity: 'O(m·n · log(m·n)) time · O(m·n) space',
    code: `// Worked trace for matrix = [[1,2],[3,4]]  (m=2, n=2; col nodes are 2,3):
//
//   value  cells        union          group rank (1 + max touched rowRank/colRank)
//   ───────────────────────────────────────────────────────────────────────────────
//    1     (0,0)        row0 ~ col2     max(0, max(0,0)+1) = 1   → ans[0][0]=1
//    2     (0,1)        row0 ~ col3     max(0, max(1,0)+1) = 2   → ans[0][1]=2   (row0 now 1)
//    3     (1,0)        row1 ~ col2     max(0, max(0,1)+1) = 2   → ans[1][0]=2   (col0 now 1)
//    4     (1,1)        row1 ~ col3     max(0, max(2,2)+1) = 3   → ans[1][1]=3
//
// Returns [[1,2],[2,3]]

public int[][] matrixRankTransform(int[][] matrix) {
  int m = matrix.length, n = matrix[0].length;
  // Bucket every cell by value, ascending, so smallest values get the lower ranks
  TreeMap<Integer, List<int[]>> byValue = new TreeMap<>();
  // LAMBDA (mapping Function): x -> new ArrayList<>() is the factory computeIfAbsent
  // invokes ONLY when this value is absent; its return becomes the new list.
  // Without the lambda:
  //   List<int[]> list = byValue.get(matrix[i][j]);
  //   if (list == null) { list = new ArrayList<>(); byValue.put(matrix[i][j], list); }
  //   list.add(new int[]{i, j});
  for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
      byValue.computeIfAbsent(matrix[i][j], x -> new ArrayList<>()).add(new int[]{i, j});

  int[] rowRank = new int[m], colRank = new int[n];   // high-water rank per row/col
  int[][] answer = new int[m][n];

  // TreeMap iterates values in ascending order — ranks fixed now stay final
  for (List<int[]> cells : byValue.values()) {
    // Union-find over m row-nodes (0..m-1) + n column-nodes (m..m+n-1).
    // Fresh per value: only equal cells sharing a row/col should merge.
    int[] parent = new int[m + n];
    for (int i = 0; i < m + n; i++) parent[i] = i;
    // Link each cell's row to its column → cells transitively in the same
    // row/column chain end up in one connected component
    for (int[] cell : cells) union(parent, cell[0], m + cell[1]);

    // group rank = 1 + largest rank already used in any row/col it touches.
    // Computed per component root so the whole group shares one rank.
    Map<Integer, Integer> groupRank = new HashMap<>();
    for (int[] cell : cells) {
      int root = find(parent, cell[0]);
      int r = Math.max(groupRank.getOrDefault(root, 0),
                       Math.max(rowRank[cell[0]], colRank[cell[1]]) + 1);
      groupRank.put(root, r);
    }
    // write ranks in and raise the row/column high-water marks so the next,
    // strictly-larger value is forced above this one
    for (int[] cell : cells) {
      int r = groupRank.get(find(parent, cell[0]));
      answer[cell[0]][cell[1]] = r;
      rowRank[cell[0]] = r;
      colRank[cell[1]] = r;
    }
  }
  return answer;
}

private int find(int[] p, int x) {            // path-compressed find
  while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
  return x;
}
private void union(int[] p, int a, int b) { p[find(p, a)] = find(p, b); }`
  },
  {
    num: 92, lc: 743, title: 'Network Delay Time', d: 'medium',
    bucket: 'Advanced Graphs', category: 'Dijkstra',
    url: 'https://leetcode.com/problems/network-delay-time/',
    approach: 'Single-source shortest paths with Dijkstra\x27s algorithm. The latest a node hears the signal equals its shortest-path distance from k, so the answer is the maximum of those distances. Use a min-heap keyed by tentative distance: repeatedly pop the closest unsettled node, and because all weights are non-negative the first time a node is popped its distance is final (the greedy invariant). Relax each outgoing edge, pushing improved distances. A lazy-deletion check (skip when the popped distance is staler than dist[u]) avoids a decrease-key structure. If any node stays at infinity it is unreachable, so return −1; otherwise return the max distance. With E edges and V nodes this is O(E log V) time and O(V + E) space.',
    complexity: 'O(E log V) time · O(V + E) space',
    code: `// Worked trace for times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2:
//
//   pop (u,d)   relax                       dist[1..4] after
//   ─────────────────────────────────────────────────────────────
//   (2,0)       1←0+1, 3←0+1                [1, 0, 1, INF]
//   (1,1)       (no out-edges)             [1, 0, 1, INF]
//   (3,1)       4←1+1                       [1, 0, 1, 2]
//   (4,2)       (no out-edges)             [1, 0, 1, 2]
//
// max dist = 2, none INF → returns 2

public int networkDelayTime(int[][] times, int n, int k) {
  // Adjacency list: u → list of {v, weight}
  Map<Integer, List<int[]>> graph = new HashMap<>();
  // LAMBDA (mapping Function): x -> new ArrayList<>() is the factory computeIfAbsent
  // invokes ONLY when t[0] is absent; its return becomes the new adjacency list.
  // Without the lambda:
  //   List<int[]> adj = graph.get(t[0]);
  //   if (adj == null) { adj = new ArrayList<>(); graph.put(t[0], adj); }
  //   adj.add(new int[]{ t[1], t[2] });
  for (int[] t : times)
    graph.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{ t[1], t[2] });

  // Dijkstra: shortest distances from source k. MAX_VALUE = "not yet reached".
  int[] dist = new int[n + 1];
  Arrays.fill(dist, Integer.MAX_VALUE);
  dist[k] = 0;
  // Min-heap keyed by current best distance → always expand the closest node
  // LAMBDA (Comparator): (a, b) -> a[1] - b[1] IS the compare(a, b) body — a
  // negative result orders a before b, so this is a MIN-heap by entry[1] (distance).
  // Without the lambda:
  //   new PriorityQueue<>(new Comparator<int[]>() {
  //     public int compare(int[] a, int[] b) { return a[1] - b[1]; }
  //   });
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
  pq.offer(new int[]{ k, 0 });

  while (!pq.isEmpty()) {
    int[] top = pq.poll();
    int u = top[0], d = top[1];
    // Stale entry (we've already processed u with a smaller distance) — skip.
    // This is lazy deletion: cheaper than a decrease-key operation.
    if (d > dist[u]) continue;
    for (int[] e : graph.getOrDefault(u, List.of())) {
      int v = e[0], w = e[1];
      // Standard relaxation — if going through u improves dist[v], update
      // and push the better distance for v back onto the heap
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.offer(new int[]{ v, d + w });
      }
    }
  }
  // Answer is the latest delivery time across all nodes; -1 if any unreached
  int max = 0;
  for (int i = 1; i <= n; i++) {
    if (dist[i] == Integer.MAX_VALUE) return -1;   // a node never got the signal
    max = Math.max(max, dist[i]);
  }
  return max;
}`
  },
  {
    num: 93, lc: 332, title: 'Reconstruct Itinerary', d: 'hard',
    bucket: 'Advanced Graphs', category: 'Eulerian Path (Hierholzer)',
    url: 'https://leetcode.com/problems/reconstruct-itinerary/',
    approach: 'Eulerian path via Hierholzer\x27s algorithm. Treat airports as nodes and tickets as directed edges; using every ticket once is exactly walking every edge once. Store each airport\x27s destinations in a min-heap so the lexicographically smallest unused flight is always taken first, which yields the smallest valid itinerary. Walk greedily until you hit a dead end (no unused outgoing edge); that airport must be the final stop of the current segment, so add it to the FRONT of the route and backtrack via the stack. Because edges are only consumed once, the route is built in reverse post-order and ends up correctly ordered. The naive backtracking search over all orderings is exponential; this is O(E log E) time (heap ops) and O(E) space.',
    complexity: 'O(E log E) time · O(E) space',
    code: `// Worked trace for tickets = [[JFK,A],[JFK,B],[B,JFK]]  (heaps: JFK→[A,B], B→[JFK]):
//
//   stack (top→)        action                       route (front→back)
//   ──────────────────────────────────────────────────────────────────────
//   [JFK]               JFK→A (A is smaller)          []
//   [JFK,A]             A has no out-edges → pop A     [A]
//   [JFK]               JFK→B                          [A]
//   [JFK,B]             B→JFK                          [A]
//   [JFK,B,JFK]         JFK empty now → pop JFK        [JFK,A]
//   [JFK,B]             B empty → pop B                [B,JFK,A]
//   [JFK]               JFK empty → pop JFK            [JFK,B,JFK,A]
//
// Returns [JFK, B, JFK, A]

public List<String> findItinerary(List<List<String>> tickets) {
  // Per-airport min-heap of destinations → lexicographically smallest pick is free
  Map<String, PriorityQueue<String>> graph = new HashMap<>();
  // LAMBDA (mapping Function): k -> new PriorityQueue<>() is the factory computeIfAbsent
  // invokes ONLY when the source airport is absent; its return becomes the new heap.
  // Without the lambda:
  //   PriorityQueue<String> dests = graph.get(t.get(0));
  //   if (dests == null) { dests = new PriorityQueue<>(); graph.put(t.get(0), dests); }
  //   dests.offer(t.get(1));
  for (List<String> t : tickets)
    graph.computeIfAbsent(t.get(0), k -> new PriorityQueue<>()).offer(t.get(1));

  // Hierholzer's: stack-based traversal; route is built in REVERSE post-order
  LinkedList<String> route = new LinkedList<>();
  Deque<String> stack = new ArrayDeque<>();
  stack.push("JFK");                  // itinerary must start at JFK
  while (!stack.isEmpty()) {
    String at = stack.peek();         // inspect current airport without leaving it
    PriorityQueue<String> dst = graph.get(at);
    if (dst == null || dst.isEmpty()) {
      // Dead end → no unused tickets out of here, so this airport is the next
      // one in the route counting from the BACK; pop and prepend it
      route.addFirst(stack.pop());
    } else {
      // Otherwise, advance to the smallest available next destination,
      // consuming that ticket (poll removes it from the heap)
      stack.push(dst.poll());
    }
  }
  return route;
}`
  },
  {
    num: 94, lc: 127, title: 'Word Ladder', d: 'hard',
    bucket: 'Advanced Graphs', category: 'BFS',
    url: 'https://leetcode.com/problems/word-ladder/',
    approach: 'Breadth-first search over the implicit word graph, where two words are adjacent if they differ in one letter. BFS explores level by level, so the first time endWord is reached the number of levels is the shortest sequence length. Instead of comparing all word pairs (expensive), generate neighbors by mutating each position to all 26 letters and checking membership in a hash set of the dictionary — O(L·26) candidates per word with O(L) build cost. Crucially, remove each word from the set the moment it is enqueued: this marks it visited and prevents re-processing, keeping every word in the queue at most once. With L = word length and N = dictionary size, the work is O(L²·N) time and O(L·N) space. Pitfall: return 0 early if endWord is not even in the dictionary.',
    complexity: 'O(L² · N) time · O(L · N) space (L = word length, N = dict size)',
    code: `// Worked trace for begin="hit", end="cog", dict={hot,dot,dog,lot,log,cog}:
//
//   steps  frontier (level)   newly reached (removed from set)
//   ─────────────────────────────────────────────────────────────
//     1    [hit]              hot
//     2    [hot]              dot, lot
//     3    [dot, lot]         dog, log
//     4    [dog, log]         cog   → next.equals(end) → return steps+1 = 5
//
// Returns 5

public int ladderLength(String beginWord, String endWord, List<String> wordList) {
  Set<String> words = new HashSet<>(wordList);   // O(1) membership + visited-marking
  // If the target isn't in the dictionary, no ladder can ever end at it
  if (!words.contains(endWord)) return 0;
  Queue<String> q = new ArrayDeque<>();
  q.offer(beginWord);
  int steps = 1;                                  // beginWord itself counts as 1
  // Level-by-level BFS — 'steps' is the depth of the current frontier
  while (!q.isEmpty()) {
    int size = q.size();                          // freeze this level's size
    for (int i = 0; i < size; i++) {
      char[] cur = q.poll().toCharArray();
      // Try every single-char mutation at every position
      for (int j = 0; j < cur.length; j++) {
        char orig = cur[j];
        for (char c = 'a'; c <= 'z'; c++) {
          cur[j] = c;
          String next = new String(cur);
          // Found the target one step deeper than the current level
          if (next.equals(endWord)) return steps + 1;
          // Remove on enqueue — marks visited so each dictionary word is used once
          if (words.remove(next)) q.offer(next);
        }
        cur[j] = orig;   // restore so the next position-loop iteration has the original
      }
    }
    steps++;             // whole level processed → advance depth
  }
  return 0;              // queue drained without reaching endWord
}`
  },

  {
    num: 174, lc: 1584, title: 'Min Cost to Connect All Points', d: 'medium',
    bucket: 'Advanced Graphs', category: 'MST · Prim',
    url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/',
    approach: 'This is a minimum spanning tree problem in disguise: treat every point as a graph node with an edge to every other point weighted by Manhattan distance, then find the cheapest set of edges connecting all nodes. Building all O(n^2) edges explicitly and sorting them (Kruskal) works, but Prim\'s algorithm is a cleaner fit here because the graph is dense and complete — no adjacency list is ever needed. Start from an arbitrary point and maintain a minDist array holding, for every not-yet-included point, the cheapest known distance to the growing tree. Repeatedly pick the unvisited point with the smallest minDist, add its cost to the answer, mark it visited, then relax every other unvisited point\'s minDist against the newly added point. Because each relax step is an O(n) scan rather than a heap push, dense-graph Prim\'s runs in O(n^2) time with O(n) space, beating Kruskal\'s O(n^2 log n) sort on this input size. The key correctness insight is the same cut property Prim\'s always relies on: the cheapest edge leaving the current tree is always safe to add. An equivalent alternative is Kruskal\'s algorithm with union-find over the sorted edge list.',
    complexity: 'O(n^2) time · O(n) space',
    code: `// Worked trace for points = [[0,0],[2,2],[3,10],[5,2],[7,0]]  (idx 0..4):
//
//   step  added point  cost added   minDist after relax (idx: 1  2  3  4)
//   ───────────────────────────────────────────────────────────────────────
//   0     (0,0) [0]    0            [4, 13, 7, 7]         (seed from pt0)
//   1     (2,2) [1]    4            [-, 9,  3, 7]         (relax vs pt1)
//   2     (5,2) [3]    3            [-, 9,  -, 4]         (relax vs pt3)
//   3     (7,0) [4]    4            [-, 9,  -, -]         (relax vs pt4)
//   4     (3,10)[2]    9            (all visited)
//
// sum of "cost added" = 0 + 4 + 3 + 4 + 9 = 20
// Returns 20

public int minCostConnectPoints(int[][] points) {
  int n = points.length;
  // Single point needs zero edges to be "fully connected"
  if (n <= 1) return 0;

  // minDist[j] = cheapest known Manhattan distance from j to the tree built so far.
  // Seed everything at "infinity" except the arbitrary start node 0.
  int[] minDist = new int[n];
  Arrays.fill(minDist, Integer.MAX_VALUE);
  boolean[] inTree = new boolean[n];
  minDist[0] = 0;

  int totalCost = 0;
  // Grow the tree by exactly one node per iteration until all n are included
  for (int i = 0; i < n; i++) {
    // Pick the cheapest unvisited node to attach next — the MST cut-property
    // guarantees the globally cheapest crossing edge is always safe to take.
    int u = -1;
    for (int j = 0; j < n; j++) {
      if (!inTree[j] && (u == -1 || minDist[j] < minDist[u])) u = j;
    }
    // Lock this node into the tree and pay for the edge that reached it
    inTree[u] = true;
    totalCost += minDist[u];

    // Relax every remaining node against the point just added — if u is now
    // closer than whatever this node's best-known link was, tighten it.
    for (int v = 0; v < n; v++) {
      if (inTree[v]) continue;
      int dist = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (dist < minDist[v]) minDist[v] = dist;
    }
  }
  return totalCost;
}`
  },
  {
    num: 175, lc: 787, title: 'Cheapest Flights Within K Stops', d: 'medium',
    bucket: 'Advanced Graphs', category: 'Bellman-Ford',
    url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/',
    approach: 'A capped-hop shortest path, which is exactly what a bounded Bellman-Ford relaxation computes. Run at most k+1 rounds of edge relaxation (k stops means k+1 edges), and in each round relax every edge using distances FROZEN from the previous round rather than updating in place. That freeze is the whole trick: relaxing from a live, already-updated array would let a single round silently chain two or more edges together, smuggling in extra hops and violating the k-stop cap. A plain Dijkstra fails here because its greedy "shortest first" order has no notion of a hop budget — a cheaper path that uses more stops than allowed would still win. After k+1 rounds, dist[dst] holds the cheapest cost reachable in at most k+1 edges, or infinity if unreachable. With V nodes and E edges this runs in O(k * E) time and O(V) space. An equivalent alternative is a level-order BFS/Dijkstra variant that tracks (node, stopsUsed) pairs and only relaxes when stopsUsed <= k.',
    complexity: 'O(k * E) time · O(V) space',
    code: `// Worked trace for n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],
// src=0, dst=3, k=1 (so at most k+1 = 2 edges may be used):
//
//   round  dist[0] dist[1] dist[2] dist[3]   notes
//   ─────────────────────────────────────────────────────────────────
//   start    0       INF     INF     INF
//   1        0       100     INF     INF     relax 0→1: dist[1]=0+100=100
//   2        0       100     200     700     relax 1→2: 100+100=200; relax 1→3: 100+600=700
//
// dist[3] = 700 (path 0→1→3, 1 stop) — cheaper 0→1→2→3 needs 2 stops, over budget
// Returns 700

public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
  // dist[i] = cheapest cost to reach i using edges relaxed so far
  int[] dist = new int[n];
  Arrays.fill(dist, Integer.MAX_VALUE);
  dist[src] = 0;

  // k stops allowed means at most k+1 edges in the path — that bounds the rounds
  for (int round = 0; round <= k; round++) {
    // Relax against a SNAPSHOT of the previous round, not the live array.
    // Updating in place would let one round chain multiple edges together,
    // effectively using more hops than this round is allowed to spend.
    int[] next = dist.clone();
    for (int[] f : flights) {
      int u = f[0], v = f[1], price = f[2];
      // Skip edges from a node not yet reachable within the current hop budget
      if (dist[u] == Integer.MAX_VALUE) continue;
      // Standard relaxation, written into the snapshot for THIS round only
      if (dist[u] + price < next[v]) {
        next[v] = dist[u] + price;
      }
    }
    dist = next;
  }

  // Unreachable within k stops — signal with -1 per the problem contract
  return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
}`
  },
  {
    num: 176, lc: 269, title: 'Alien Dictionary', d: 'hard', companies: ['Garmin'],
    bucket: 'Advanced Graphs', category: 'Topological Sort',
    url: 'https://leetcode.com/problems/alien-dictionary/',
    approach: 'Build a letter-ordering graph from adjacent words, then run Kahn\'s BFS topological sort over the alphabet\'s 26 letters. Compare each consecutive pair of words and find their first differing character: that pair reveals exactly one edge, earlierChar -> laterChar, because a dictionary-sorted list only commits to an ordering at the first point two words diverge. A pair that never diverges is only valid if the shorter word comes first (it\'s a prefix of the longer one); if the longer word comes first that is a direct contradiction of dictionary order, so return "" immediately. Once the graph is built, Kahn\'s algorithm greedily emits letters with in-degree 0, and if every discovered letter gets emitted the order is acyclic and unique enough to report; if some letters are never emitted, a cycle exists (mutually contradictory constraints) and no valid alien alphabet exists, so return "". The naive alternative of trying to sort letters by first appearance ignores contradicting pairs entirely and produces wrong or nonsensical orders, whereas comparing only ADJACENT words is what keeps this at O(C) instead of comparing all O(n^2) pairs (C = total characters across all words). An equivalent alternative is DFS-based topological sort with a three-color (white/gray/black) cycle check instead of in-degree counting.',
    complexity: 'O(C) time (C = total characters across all words) · O(1) space (at most 26 letters/edges)',
    code: `// Worked trace for words = ["wrt","wrf","er","ett","rftt"]:
//
//   pair            first diff   edge added   in-degree effect
//   ─────────────────────────────────────────────────────────────
//   wrt , wrf       idx 2: t/f   t -> f       f: 0 -> 1
//   wrf , er        idx 0: w/e   w -> e       e: 0 -> 1
//   er  , ett       idx 1: r/t   r -> t       t: 0 -> 1
//   ett , rftt      idx 0: e/r   e -> r       r: 0 -> 1
//
//   letters seen: w, r, t, f, e   in-degrees: w=0, e=1, r=1, t=1, f=1
//
//   pop   result    neighbor updated      newly-zero enqueued
//   ─────────────────────────────────────────────────────────────
//   w     "w"       e: 1 -> 0             e
//   e     "we"      r: 1 -> 0             r
//   r     "wer"     t: 1 -> 0             t
//   t     "wert"    f: 1 -> 0             f
//   f     "wertf"   (none)                -
//
// result.length == 5 == letters seen -> returns "wertf"

public String alienOrder(String[] words) {
  // Every letter that actually appears must show up in the output (even ones
  // with no edges), so seed the graph and in-degree map for each of them.
  Map<Character, Set<Character>> graph = new HashMap<>();
  Map<Character, Integer> inDegree = new HashMap<>();
  for (String w : words) {
    for (char c : w.toCharArray()) {
      graph.putIfAbsent(c, new HashSet<>());
      inDegree.putIfAbsent(c, 0);
    }
  }

  // Only ADJACENT words in the sorted list constrain letter order — comparing
  // every pair would be redundant, since transitivity is handled by the graph.
  for (int i = 0; i < words.length - 1; i++) {
    String a = words[i], b = words[i + 1];
    int minLen = Math.min(a.length(), b.length());
    boolean foundDiff = false;
    for (int j = 0; j < minLen; j++) {
      char ca = a.charAt(j), cb = b.charAt(j);
      if (ca != cb) {
        // First divergence is the ONLY letter pair this word pair constrains;
        // add the edge only if it's new, or in-degree would be double-counted.
        if (graph.get(ca).add(cb)) {
          inDegree.put(cb, inDegree.get(cb) + 1);
        }
        foundDiff = true;
        break;
      }
    }
    // Words never diverged within minLen: valid only if the shorter word came
    // first (it's a legitimate prefix). "abc" before "ab" breaks dictionary
    // order with no way to fix it via letter ordering, so bail out now.
    if (!foundDiff && a.length() > b.length()) return "";
  }

  // Kahn's BFS: every letter that starts with no unresolved prerequisites
  // can be placed first; order among them doesn't matter for correctness.
  Deque<Character> queue = new ArrayDeque<>();
  for (char c : inDegree.keySet()) {
    if (inDegree.get(c) == 0) queue.offer(c);
  }

  StringBuilder result = new StringBuilder();
  while (!queue.isEmpty()) {
    char c = queue.poll();
    result.append(c);
    // Placing c satisfies one prerequisite for each of its neighbors; a
    // neighbor becomes placeable the instant its last prerequisite clears.
    for (char next : graph.get(c)) {
      inDegree.put(next, inDegree.get(next) - 1);
      if (inDegree.get(next) == 0) queue.offer(next);
    }
  }

  // If not every discovered letter got placed, some remain stuck in a cycle
  // of mutual prerequisites — no valid alien alphabet can satisfy that.
  return result.length() == inDegree.size() ? result.toString() : "";
}`
  },
  {
    num: 177, lc: 3377, title: 'Digit Operations to Make Two Integers Equal', d: 'medium', companies: ['Garmin'],
    bucket: 'Advanced Graphs', category: 'Dijkstra · Primes',
    url: 'https://leetcode.com/problems/digit-operations-to-make-two-integers-equal/',
    approach: 'Model every non-prime integer as a graph node and run Dijkstra with the destination value as the edge weight, because the cost of a transformation is the sum of the numbers n passes through, not the number of steps. From the current number, generate every neighbor reachable by nudging exactly one digit up or down by 1 (skipping a leading digit going to 0, since that would drop the digit count), and only admit a neighbor if it is not prime — a prime number is never allowed to appear mid-transformation, so it is simply never added to the graph at all. A sieve of Eratosthenes up to 10^4 answers "is this candidate prime?" in O(1) so the graph can be built lazily as Dijkstra explores. The greedy invariant still holds: because every edge weight (the neighbor\'s own value) is positive, the first time a node is popped from the min-heap its accumulated cost is final, so popping m ends the search immediately with the answer. Reject up front whenever n or m is prime, or the two have different digit counts, since no valid path can exist either way. A plain BFS would minimize the number of operations, which is the wrong objective here — it ignores that big detours through large numbers are expensive even in few steps. With D digits and 10 digits per position there are at most 20 candidate moves per node, so this runs in O(V log V) time over the ~10^4 reachable values and O(V) space for the sieve and distance map; a bidirectional Dijkstra from both n and m is an equivalent alternative that halves the practical search radius.',
    complexity: 'O(V log V) time (V ≈ 10^4 reachable values) · O(V) space',
    code: `// Worked trace for n = 10, m = 12 (matches the problem's own example):
//
//   pop (value, cost)   relax → neighbor (new cost)      note
//   ──────────────────────────────────────────────────────────────────
//   (10, 10)             → 20 (30)                        digit0 1→2; 11 is prime, digit0↓ leading
//   (20, 30)              → 30 (60), → 21 (51)            digit0 2→3, digit1 0→1
//   (21, 51)              → 22 (73)                       digit1 1→2 (20 is worse, skip)
//   (30, 60)              → 40 (100)                      dead end toward m, stays in heap
//   (22, 73)              → 32 (105), → 12 (85)           digit0 2→3, digit0 2→1
//   (12, 85)              u == m → return 85
//
// Path taken: 10 -> 20 -> 21 -> 22 -> 12, sum = 10+20+21+22+12 = 85. Returns 85.

private static final int LIMIT = 10_000;
private static final boolean[] IS_COMPOSITE = buildSieve();

// Sieve of Eratosthenes once per JVM load — every query below is then an O(1) array read
private static boolean[] buildSieve() {
  boolean[] composite = new boolean[LIMIT];
  composite[0] = composite[1] = true;      // 0 and 1 are not prime, but also not usable digits-wise; mark non-prime path clear
  for (int i = 2; (long) i * i < LIMIT; i++) {
    if (!composite[i]) {
      for (int j = i * i; j < LIMIT; j += i) composite[j] = true;
    }
  }
  return composite;
}
// A number counts as prime only if the sieve says so AND it's >= 2 (0/1 are never prime)
private boolean isPrime(int x) { return x >= 2 && !IS_COMPOSITE[x]; }

public int minOperations(int n, int m) {
  // Either endpoint being prime, or a mismatched digit count, makes every path invalid up front
  if (isPrime(n) || isPrime(m)) return -1;
  if (Integer.toString(n).length() != Integer.toString(m).length()) return -1;
  // n == m needs zero operations, but n itself still counts once toward the cost
  if (n == m) return n;

  // dist[v] = cheapest sum-of-values seen so far to reach v; absent = not yet reached
  Map<Integer, Integer> dist = new HashMap<>();
  dist.put(n, n);
  // Min-heap keyed by accumulated cost so far — Dijkstra's greedy pick of "closest" node
  // LAMBDA (Comparator): (a, b) -> a[0] - b[0] IS the compare(a, b) body — a
  // negative result orders a before b, so this is a MIN-heap by entry[0] (cost).
  // Without the lambda:
  //   new PriorityQueue<>(new Comparator<int[]>() {
  //     public int compare(int[] a, int[] b) { return a[0] - b[0]; }
  //   });
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
  pq.offer(new int[]{ n, n });

  while (!pq.isEmpty()) {
    int[] top = pq.poll();
    int cost = top[0], u = top[1];
    // Reached the target — first pop is guaranteed optimal since all weights are positive
    if (u == m) return cost;
    // Stale heap entry: a cheaper path to u was already finalized, so skip re-expanding it
    if (cost > dist.getOrDefault(u, Integer.MAX_VALUE)) continue;

    char[] digits = Integer.toString(u).toCharArray();
    for (int i = 0; i < digits.length; i++) {
      for (int delta : new int[]{ 1, -1 }) {
        int d = (digits[i] - '0') + delta;
        // A single digit can't overflow past 9 or underflow below 0
        if (d < 0 || d > 9) continue;
        // Bumping the leading digit down to 0 would silently shrink the digit count — disallowed
        if (i == 0 && d == 0) continue;

        char[] next = digits.clone();
        next[i] = (char) ('0' + d);
        int v = Integer.parseInt(new String(next));
        // A prime value may never be visited, not even as a transient state — it never enters the graph
        if (isPrime(v)) continue;

        int newCost = cost + v;
        if (newCost < dist.getOrDefault(v, Integer.MAX_VALUE)) {
          dist.put(v, newCost);
          pq.offer(new int[]{ newCost, v });
        }
      }
    }
  }
  // Heap exhausted without ever popping m — no valid digit-mutation path exists
  return -1;
}`
  },
  // ─── Dynamic Programming - 1D (14) ───
  {
    num: 219, lc: 305, title: 'Number of Islands II', d: 'hard',
    bucket: 'Advanced Graphs', category: 'Union-Find · Matrix',
    url: 'https://leetcode.com/problems/number-of-islands-ii/',
    approach: 'The grid is built up incrementally, so re-running a flood fill after every addition would cost O(m · n) per operation. Union-find turns each addition into near-constant work by maintaining the island count as a single running number rather than recomputing it. Adding land optimistically increments the count by one — the new cell is its own island until proven otherwise — and then each of the four neighbours that is already land triggers a union; every union that actually merges two distinct components decrements the count back down. That optimistic-then-correct pattern is what keeps the bookkeeping honest whether the new cell touches zero, one, or four existing islands. The parent array doubles as the water map: -1 means the cell has not been added yet, which removes the need for a separate boolean grid and gives the duplicate-position check for free — repeated positions appear in real test data and would otherwise inflate the count. Union by size keeps trees shallow and path halving flattens them during find, giving the inverse-Ackermann amortised bound. Cells are addressed by the flattened index r * n + c so the whole structure is two int arrays.',
    complexity: 'O(k · α(m·n)) time · O(m·n) space',
    code: `// Worked trace for m = 3, n = 3, positions = [[0,0], [0,1], [1,2], [2,1]]
//
//   add     new cell id   neighbours already land   unions   islands
//   ──────────────────────────────────────────────────────────────────
//   (0,0)   0             none                      0        1
//   (0,1)   1             (0,0)                     1        1
//   (1,2)   5             none                      0        2
//   (2,1)   7             none                      0        3
//
// Returns [1, 1, 2, 3]

private static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

public List<Integer> numIslands2(int m, int n, int[][] positions) {
  // parent doubles as the water map: -1 means "not land yet". That removes a
  // separate boolean grid AND gives the duplicate-position check for free.
  int[] parent = new int[m * n];
  int[] size = new int[m * n];
  Arrays.fill(parent, -1);

  List<Integer> out = new ArrayList<>();
  int islands = 0;

  for (int[] pos : positions) {
    int r = pos[0], c = pos[1];
    int id = r * n + c;

    // Repeated positions do occur in real test data — adding land twice must
    // not inflate the count.
    if (parent[id] != -1) {
      out.add(islands);
      continue;
    }

    // Optimistic: the new cell is its own island until a neighbour says otherwise
    parent[id] = id;
    size[id] = 1;
    islands++;

    for (int[] d : DIRS) {
      int nr = r + d[0], nc = c + d[1];
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
        continue;
      }
      int nid = nr * n + nc;
      if (parent[nid] == -1) {
        continue;                       // still water
      }
      int a = find(parent, id), b = find(parent, nid);
      if (a == b) {
        continue;                       // already the same island
      }
      // Union by size keeps the trees shallow
      if (size[a] < size[b]) {
        int tmp = a; a = b; b = tmp;
      }
      parent[b] = a;
      size[a] += size[b];
      // Every real merge cancels one of the islands counted so far
      islands--;
    }
    out.add(islands);
  }
  return out;
}

/** Find with path halving — flattens the tree while walking up it. */
private int find(int[] parent, int x) {
  while (parent[x] != x) {
    parent[x] = parent[parent[x]];
    x = parent[x];
  }
  return x;
}`
  },
  {
    num: 95, lc: 70, title: 'Climbing Stairs', d: 'easy',
    bucket: 'Dynamic Programming - 1D', category: 'Fibonacci',
    url: 'https://leetcode.com/problems/climbing-stairs/',
    approach: 'One-dimensional dynamic programming — and the recurrence is exactly the Fibonacci sequence. To reach step i your last move was either a single step from i−1 or a double step from i−2, so ways(i) = ways(i−1) + ways(i−2); these two paths are disjoint and cover all cases, which makes the count correct. Since each state only depends on the previous two, there is no need for a full table: roll two variables forward, giving O(n) time and O(1) space instead of the exponential O(2^n) of naive recursion (which recomputes the same subproblems). The base cases ways(1)=1 and ways(2)=2 seed the loop.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for n = 5:
//
//   i   prev2  prev1  curr = prev1+prev2
//   ────────────────────────────────────
//   3     1      2      3        (prev2←2, prev1←3)
//   4     2      3      5        (prev2←3, prev1←5)
//   5     3      5      8        (prev2←5, prev1←8)
//
// Returns prev1 = 8

public int climbStairs(int n) {
  if (n <= 2) return n;            // ways(1)=1, ways(2)=2 are the base cases
  // Rolling Fibonacci — only the last two values matter, so O(1) space
  int prev2 = 1, prev1 = 2;        // prev2 = ways(i-2), prev1 = ways(i-1)
  for (int i = 3; i <= n; i++) {
    int curr = prev1 + prev2;      // ways(i) = ways(i-1) + ways(i-2)
    prev2 = prev1; prev1 = curr;   // slide the two-value window forward
  }
  return prev1;                    // prev1 now holds ways(n)
}`
  },
  {
    num: 96, lc: 198, title: 'House Robber', d: 'medium', companies: ['Temu'],
    bucket: 'Dynamic Programming - 1D', category: 'DP',
    url: 'https://leetcode.com/problems/house-robber/',
    approach: 'One-dimensional dynamic programming. For each house you make a binary choice: skip it and keep the best total through the previous house, or rob it and add its loot to the best total through the house two positions back (skipping the immediate neighbor to respect the no-adjacent rule). That gives dp[i] = max(dp[i−1], dp[i−2] + nums[i]); the max guarantees optimality because both feasible options are considered at every step. Each state only needs the two prior results, so two rolling variables replace the array — O(n) time, O(1) space. A greedy \x27take every other house\x27 heuristic fails (e.g. [2,1,1,2]), which is why DP is required.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [2,7,9,3,1]:
//
//   n   prev2  prev1  curr = max(prev1, prev2+n)
//   ──────────────────────────────────────────────
//   2     0      0      max(0, 0+2)  = 2
//   7     0      2      max(2, 0+7)  = 7
//   9     2      7      max(7, 2+9)  = 11
//   3     7     11      max(11, 7+3) = 11
//   1    11     11      max(11,11+1) = 12
//
// Returns prev1 = 12

public int rob(int[] nums) {
  // prev2 = best loot for houses [0..i-2], prev1 = best for [0..i-1]
  int prev2 = 0, prev1 = 0;
  for (int n : nums) {
    // Either skip this house (keep prev1) or rob it + best from two-back
    // (prev2 + n) — robbing forbids using the adjacent prev1 total
    int curr = Math.max(prev1, prev2 + n);
    prev2 = prev1; prev1 = curr;   // advance the window by one house
  }
  return prev1;                    // best over the whole street
}`
  },
  {
    num: 97, lc: 213, title: 'House Robber II', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · Circular',
    url: 'https://leetcode.com/problems/house-robber-ii/',
    approach: 'Reduce the circular problem to the linear House Robber by case-splitting on the awkward first/last adjacency. Since houses 0 and n−1 are now neighbors, any valid plan robs at most one of them, so the optimum is the better of two independent linear runs: one over indices [0 .. n−2] (forbidding the last house) and one over [1 .. n−1] (forbidding the first). Each run is the standard O(n) two-variable DP dp[i] = max(dp[i−1], dp[i−2]+nums[i]). Taking the max of the two covers every feasible selection while never robbing both ends. Total is O(n) time, O(1) space. Edge case: a single house has no \x27circle\x27, so return nums[0] directly to avoid an empty range.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [1,2,3,1]  (n=4):
//
//   robRange(nums, 0, 2)  over [1,2,3]:   prev1 sequence → 1, 2, 4   = 4
//   robRange(nums, 1, 3)  over [2,3,1]:   prev1 sequence → 2, 3, 3   = 3
//   max(4, 3) = 4
//
// Returns 4

public int rob(int[] nums) {
  int n = nums.length;
  if (n == 1) return nums[0];     // no circle with one house — just take it
  // Circular constraint: can't include both the first and last houses.
  // Solve linear House Robber twice, each excluding one end, take the better.
  return Math.max(robRange(nums, 0, n - 2),   // skip the LAST house
                  robRange(nums, 1, n - 1));  // skip the FIRST house
}

// Same algorithm as House Robber I, restricted to indices [lo..hi]
private int robRange(int[] nums, int lo, int hi) {
  int prev2 = 0, prev1 = 0;       // best totals two-back and one-back
  for (int i = lo; i <= hi; i++) {
    // Skip house i (prev1) or rob it plus the best from two houses back
    int curr = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1; prev1 = curr;  // slide the window
  }
  return prev1;
}`
  },
  {
    num: 98, lc: 322, title: 'Coin Change', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'Unbounded Knapsack',
    url: 'https://leetcode.com/problems/coin-change/',
    approach: 'Bottom-up dynamic programming — the unbounded knapsack pattern. Let dp[i] be the fewest coins that sum to i. Build it from 0 upward: for each amount i, try every coin c and consider 1 + dp[i−c], because making i can end with a final coin c laid on top of an optimal way to make i−c. Taking the minimum over all coins yields the optimum for i (optimal substructure). Coins may repeat, so unlike 0/1 knapsack every denomination is available at every amount. Initialize entries to a sentinel (amount+1, larger than any real answer) so unreachable amounts stay flagged, with dp[0]=0 as the base. The result is dp[amount], or −1 if still at the sentinel. Runtime is O(amount · |coins|), space O(amount). A greedy \x27largest coin first\x27 approach is wrong (e.g. coins [1,3,4], amount 6).',
    complexity: 'O(amount · coins) time · O(amount) space',
    code: `// Worked trace for coins = [1,2,5], amount = 6   (sentinel = 7):
//
//   i   tried coins → 1+dp[i-c]           dp[i]
//   ──────────────────────────────────────────────
//   0   (base)                            0
//   1   1+dp[0]=1                         1
//   2   1+dp[1]=2, 1+dp[0]=1              1
//   3   1+dp[2]=2, 1+dp[1]=2              2
//   4   1+dp[3]=3, 1+dp[2]=2              2
//   5   1+dp[4]=3, 1+dp[3]=3, 1+dp[0]=1  1
//   6   1+dp[5]=2, 1+dp[4]=3, 1+dp[1]=2  2
//
// dp[6]=2 (5+1) ≤ amount → returns 2

public int coinChange(int[] coins, int amount) {
  // Sentinel: any value > amount works as "unreachable" since the answer can't
  // exceed amount (worst case is all 1-coins, i.e. exactly amount coins)
  int[] dp = new int[amount + 1];
  Arrays.fill(dp, amount + 1);
  dp[0] = 0;   // base case: zero coins make amount 0
  for (int i = 1; i <= amount; i++) {
    for (int c : coins) {
      // Try using coin c — adds 1 to whatever optimally makes (i - c).
      // Guard i-c >= 0 so we don't index below zero with an oversized coin.
      if (i - c >= 0) dp[i] = Math.min(dp[i], 1 + dp[i - c]);
    }
  }
  // Still at sentinel → no combination of coins reaches the amount
  return dp[amount] > amount ? -1 : dp[amount];
}`
  },
  {
    num: 99, lc: 300, title: 'Longest Increasing Subsequence', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · Binary Search',
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    approach: 'Patience-sorting with binary search. Maintain a list \x27tails\x27 where tails[k] is the smallest possible tail value of any increasing subsequence of length k+1. For each number, binary-search for its lower-bound position: if it is larger than every tail it extends the longest run (append), otherwise it overwrites the first tail ≥ it, keeping that length achievable with a smaller, more extensible tail. Because each tail is the minimal possible end value, replacing greedily never reduces the answer and opens better future options. Note tails is NOT the actual subsequence — only its LENGTH is meaningful. Each element costs one O(log n) search, giving O(n log n) time and O(n) space, beating the classic O(n²) dp[i] = 1 + max(dp[j]) formulation.',
    complexity: 'O(n log n) time · O(n) space',
    code: `// Worked trace for nums = [10,9,2,5,3,7]:
//
//   n    binarySearch → insert pos i   action            tails after
//   ────────────────────────────────────────────────────────────────
//   10   empty → i=0                   append            [10]
//   9    i=0 (9<10)                    set(0,9)          [9]
//   2    i=0 (2<9)                     set(0,2)          [2]
//   5    i=1 (>2)                      append            [2,5]
//   3    i=1 (2<3<5)                   set(1,3)          [2,3]
//   7    i=2 (>3)                      append            [2,3,7]
//
// tails.size() = 3 → returns 3

public int lengthOfLIS(int[] nums) {
  // tails[k] = smallest possible tail value of any increasing subsequence of length k+1.
  // Kept sorted automatically by the insert/replace logic below.
  List<Integer> tails = new ArrayList<>();
  for (int n : nums) {
    // Find where n would slot in (first index with tails[i] >= n)
    int i = Collections.binarySearch(tails, n);
    if (i < 0) i = -i - 1;   // binarySearch returns -(insertion point)-1 when absent
    if (i == tails.size()) tails.add(n);   // n beats every tail → extends the LIS
    else tails.set(i, n);                  // replace with a smaller tail → better future options
  }
  // The length of tails IS the LIS length (the list itself is NOT the subsequence!)
  return tails.size();
}`
  },
  {
    num: 100, lc: 139, title: 'Word Break', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · String',
    url: 'https://leetcode.com/problems/word-break/',
    approach: '1D bottom-up DP over prefixes. Define dp[i] = can s[0..i) be segmented into dictionary words. dp[0] is true (the empty prefix). For each end i, scan every split point j < i: if some dp[j] is true AND the slice s[j..i) is a dictionary word, then dp[i] is reachable too, so set it and break. This is correct because a valid segmentation of s[0..i) must place its last word somewhere ending at i, and that word\'s start j must itself be a valid segmentation boundary. A HashSet gives O(1) word lookups. Two nested loops over n positions, each doing an O(L) substring/hash, give O(n²·L) time and O(n) space — beating the exponential naive recursion that re-explores overlapping splits.',
    complexity: 'O(n² · L) time · O(n) space',
    code: `// Worked trace for s = "leetcode", words = {"leet","code"}:
//
//   i  prefix s[0..i)   j scanned (dp[j] && s[j..i) in words?)        dp[i]
//   ───────────────────────────────────────────────────────────────────────
//   0  ""                base case                                    true
//   1  "l"               j=0 "l"? no                                  false
//   2  "le"              j=0 "le"? no                                 false
//   3  "lee"             no split works                               false
//   4  "leet"            j=0 dp[0]&&"leet"? YES                       true
//   5  "leetc"           no split with dp[j] true gives a word        false
//   6  "leetco"          none                                         false
//   7  "leetcod"         none                                         false
//   8  "leetcode"        j=4 dp[4]&&"code"? YES                       true
//
// Returns dp[8] = true

public boolean wordBreak(String s, List<String> wordDict) {
  Set<String> words = new HashSet<>(wordDict);   // O(1) membership tests instead of scanning the list
  // dp[i] = can the prefix s[0..i) be segmented into words?
  boolean[] dp = new boolean[s.length() + 1];
  dp[0] = true;   // empty prefix is trivially segmentable — the recursion's base case
  for (int i = 1; i <= s.length(); i++) {
    for (int j = 0; j < i; j++) {
      // s[0..i) is segmentable if SOME earlier boundary j is reachable (dp[j])
      // AND the remaining slice s[j..i) is itself a dictionary word
      if (dp[j] && words.contains(s.substring(j, i))) {
        dp[i] = true;
        break;   // one valid split is enough — stop scanning this i
      }
    }
  }
  return dp[s.length()];   // can the whole string be segmented?
}`
  },
  {
    num: 101, lc: 91, title: 'Decode Ways', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · String',
    url: 'https://leetcode.com/problems/decode-ways/',
    approach: '1D DP with the Fibonacci-like recurrence, rolled to O(1) space. Let dp[i] = number of decodings of the prefix ending at index i. Two transitions feed it: take s[i] alone (valid when it is 1−9), adding dp[i−1]; or take the pair s[i−1..i] as one letter (valid when 10−26), adding dp[i−2]. The split at the end is independent of earlier splits, so counts simply sum. Only the previous two values are ever needed, so two rolling ints (prev2, prev1) replace the array. A leading \'0\' has no decoding, handled up front. O(n) time, O(1) space. Pitfall: digits like \'0\' or invalid pairs such as \'06\'/\'30\' contribute 0 and silently kill that path.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for s = "226":
//
//   i  s[i]  single? (1-9)  two = s[i-1..i]  pair? (10-26)  prev2 prev1 curr
//   ──────────────────────────────────────────────────────────────────────────
//   -   -     -              -                -             1     1     -     (base)
//   1  '2'   yes +prev1=1   "22"             yes +prev2=1  1->1  1->2  2
//   2  '6'   yes +prev1=2   "26"             yes +prev2=1  1->2  2->3  3
//
// Returns prev1 = 3

public int numDecodings(String s) {
  // A leading zero can never start a valid letter → zero decodings overall
  if (s.charAt(0) == '0') return 0;
  // Rolling DP — only the last two prefix-counts matter (Fibonacci-style recurrence)
  //   prev2 = decodings of s[0..i-2],  prev1 = decodings of s[0..i-1]
  int prev2 = 1, prev1 = 1;   // empty prefix and first char each have exactly 1 way
  for (int i = 1; i < s.length(); i++) {
    int curr = 0;
    // Single-digit decode: any non-zero digit 1-9 stands alone, inheriting prev1's ways
    if (s.charAt(i) != '0') curr += prev1;
    // Two-digit decode: the chunk must be 10..26 (maps to letters J..Z), inheriting prev2's ways
    int two = Integer.parseInt(s.substring(i - 1, i + 1));
    if (two >= 10 && two <= 26) curr += prev2;
    // Slide the window forward by one position
    prev2 = prev1; prev1 = curr;
  }
  return prev1;   // decodings of the full string
}`
  },
  {
    num: 102, lc: 55, title: 'Jump Game', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'Greedy',
    url: 'https://leetcode.com/problems/jump-game/',
    approach: 'Greedy single pass tracking the furthest index reachable so far. Maintain reach = the maximum index we could possibly stand on. Sweep i from left to right: if i ever exceeds reach we have hit an unreachable gap and must return false; otherwise relax reach = max(reach, i + nums[i]). The greedy choice is safe because reachability is monotone — if index i is reachable then every index before it is too, so we only need the single best frontier rather than enumerating concrete jump sequences. O(n) time, O(1) space. This beats the O(n²) DP that asks \'is j reachable\' for every pair, and the exponential backtracking search.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [2,3,1,1,4]:
//
//   i  nums[i]  i > reach?   reach = max(reach, i+nums[i])
//   ──────────────────────────────────────────────────────
//   0   2       0 > 0  no    max(0, 0+2) = 2
//   1   3       1 > 2  no    max(2, 1+3) = 4
//   2   1       2 > 4  no    max(4, 2+1) = 4
//   3   1       3 > 4  no    max(4, 3+1) = 4
//   4   4       4 > 4  no    max(4, 4+4) = 8
//
// Loop never returns false → Returns true (last index 4 was always within reach)

public boolean canJump(int[] nums) {
  int reach = 0;   // furthest index reachable using jumps decided so far
  for (int i = 0; i < nums.length; i++) {
    // If the current index sits beyond everything we can reach, there is a gap → stuck
    if (i > reach) return false;
    // Otherwise we can stand on i, so extend the frontier by i's own jump power
    reach = Math.max(reach, i + nums[i]);
  }
  // Survived the whole array without a gap → the last index is reachable
  return true;
}`
  },
  {
    num: 103, lc: 45, title: 'Jump Game II', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'Greedy · BFS-like',
    url: 'https://leetcode.com/problems/jump-game-ii/',
    approach: 'Greedy BFS-by-layers in O(n). Picture each jump as one BFS level: from the set of indices reachable in k jumps, the next level reaches everything up to the maximum (i + nums[i]) over that window. Track end = the right edge of the current level and farthest = the best index seen while scanning it. When i reaches end we have exhausted the current jump\'s range and must spend one more jump, so increment jumps and move end out to farthest. Stop before the last index — once standing on it no further jump is needed. Each level boundary advances strictly, so it is O(n) time, O(1) space. Pitfall: counting a jump at the final index would over-count.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [2,3,1,1,4]   (loop runs i = 0..n-2 = 0..3):
//
//   i  nums[i]  farthest=max(farthest,i+nums[i])  i==end?  jumps  end
//   ──────────────────────────────────────────────────────────────────
//   0   2       max(0, 0+2) = 2                   0==0 yes  1      2
//   1   3       max(2, 1+3) = 4                   1==2 no   1      2
//   2   1       max(4, 2+1) = 4                   2==2 yes  2      4
//   3   1       max(4, 3+1) = 4                   3==4 no   2      4
//
// Returns jumps = 2

public int jump(int[] nums) {
  // Treat jumps like BFS levels: bump jumps when we run out of the current jump's reach
  int jumps = 0, end = 0, farthest = 0;
  // Stop before the last index — if we are already at it, no extra jump is required
  for (int i = 0; i < nums.length - 1; i++) {
    // While scanning the current level, remember the furthest index its members can reach
    farthest = Math.max(farthest, i + nums[i]);
    // Reached the right edge of the current jump's window — we must commit to one more jump
    if (i == end) {
      jumps++;
      end = farthest;   // the new level spans everything reachable from the old one
    }
  }
  return jumps;
}`
  },
  {
    num: 104, lc: 5, title: 'Longest Palindromic Substring', d: 'medium', companies: ['Garmin'],
    bucket: 'Dynamic Programming - 1D', category: 'Expand Around Center',
    url: 'https://leetcode.com/problems/longest-palindromic-substring/',
    approach: 'Expand-around-center. Every palindrome has a center: either a single character (odd length) or the gap between two characters (even length), giving 2n−1 possible centers. From each center, push two pointers outward while the mirrored characters match; when they stop, the span between them is the longest palindrome centered there. Track the best (start,end) seen. This is correct because it tests every center exactly once and grows each greedily to its maximum. O(n²) time (n centers × up to n expansion) and O(1) extra space — same time as the classic DP table but without its O(n²) memory; Manacher\'s algorithm would reach O(n) if needed.',
    complexity: 'O(n²) time · O(1) space',
    code: `// Worked trace for s = "babad"  (best span tracked as [start, end]):
//
//   center i  expand(i,i) odd len   expand(i,i+1) even len   len  best [start,end]
//   ──────────────────────────────────────────────────────────────────────────────
//   0 'b'     "b"               1   "ba" mismatch        0   1    [0,0]  "b"
//   1 'a'     "bab"             3   "ab" mismatch        0   3    [0,2]  "bab"
//   2 'b'     "aba"             3   "ba" mismatch        0   3    (3 not > 3) keep "bab"
//   3 'a'     "a"               1   "ad" mismatch        0   1    keep "bab"
//   4 'd'     "d"               1   (r out of range)     0   1    keep "bab"
//
// Returns s.substring(0, 3) = "bab"

public String longestPalindrome(String s) {
  int start = 0, end = 0;   // inclusive bounds of the best palindrome found so far
  for (int i = 0; i < s.length(); i++) {
    // Two center kinds: odd length centered ON i, even length centered BETWEEN i and i+1
    int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
    if (len > end - start) {   // strictly longer → adopt this palindrome
      // Recover the inclusive [start, end] indices from the center i and the length
      start = i - (len - 1) / 2;
      end   = i + len / 2;
    }
  }
  return s.substring(start, end + 1);
}
// Push (l, r) outward while in bounds and mirrored chars match; return the matched length
private int expand(String s, int l, int r) {
  while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
    l--;   // walk left edge out
    r++;   // walk right edge out
  }
  // Loop overshoots by one on each side, so the valid length is (r-1) - (l+1) + 1 = r - l - 1
  return r - l - 1;
}`
  },

  {
    num: 178, lc: 746, title: 'Min Cost Climbing Stairs', d: 'easy',
    bucket: 'Dynamic Programming - 1D', category: 'DP · 1D',
    url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
    approach: 'One-dimensional dynamic programming over "cost to reach step i". You can start standing on step 0 or step 1 for free, and from any step you may climb 1 or 2 steps at a time, paying that step\'s cost when you leave it, so the cheapest way to arrive at step i is dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]) — whichever of the two immediate predecessors is cheaper to leave from. The top of the staircase is one step past the last index, so the answer is dp[n] using a virtual cost array of length n+1. Because dp[i] only ever looks back two steps, there is no need to materialize the whole array: two rolling variables suffice, giving O(n) time and O(1) space instead of the O(n) space a naive bottom-up table would use. Top-down memoized recursion computes the same recurrence and is an equivalent alternative, just with extra call-stack overhead.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for cost = [10, 15, 20]:
//
//   i   prev2  prev1  curr = min(prev1+cost[i-1], prev2+cost[i-2])
//   ──────────────────────────────────────────────────────────────
//   2     0      0      min(0+15, 0+10) = 10
//   3     0     10      min(10+20, 0+15) = 15
//
// Returns prev1 = 15  (start on step 1, pay 15, jump straight to the top)

public int minCostClimbingStairs(int[] cost) {
  int n = cost.length;
  // dp[i] = cheapest cost to REACH step i (the top is the virtual step n).
  // Both step 0 and step 1 are free starting points, so both base cases are 0.
  int prev2 = 0, prev1 = 0;
  for (int i = 2; i <= n; i++) {
    // To land on step i you last left either step i-1 or step i-2, paying
    // that step's cost — take whichever predecessor is cheaper overall.
    int curr = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
    prev2 = prev1; prev1 = curr;   // slide the two-value window forward
  }
  // prev1 now holds dp[n], the cost to reach the top from either free start
  return prev1;
}`
  },
  {
    num: 179, lc: 647, title: 'Palindromic Substrings', d: 'medium', companies: ['Garmin'],
    bucket: 'Dynamic Programming - 1D', category: 'DP · Expand Center',
    url: 'https://leetcode.com/problems/palindromic-substrings/',
    approach: 'Expand-around-center, but counting instead of tracking a single best. Every palindromic substring has a unique center: either a single character (odd length) or the gap between two adjacent characters (even length), so there are exactly 2n−1 candidate centers to check. For each center, push two pointers outward one step at a time; every step where the mirrored characters still match is itself a distinct valid palindrome, so tally a hit on every successful expansion rather than only at the final (longest) span. This is correct because it enumerates every palindromic substring exactly once, keyed by its unique center, with no double counting. Naively checking all O(n²) substrings for palindrome-ness would cost O(n³); a bottom-up DP table over all (i,j) pairs also gets the O(n²) time but spends O(n²) extra space, whereas expand-around-center needs only O(1) extra space. Manacher\'s algorithm reaches O(n) time if that becomes a bottleneck.',
    complexity: 'O(n²) time · O(1) space',
    code: `// Worked trace for s = "aaa"  (centers: 0,1,2 odd; (0,1),(1,2) even):
//
//   center        expand steps (l,r matches)        hits added   running total
//   ──────────────────────────────────────────────────────────────────────────
//   i=0 odd       (0,0) ok                            1             1
//   (0,1) even    (0,1) 'a'=='a' ok                   1             2
//   i=1 odd       (1,1) ok; (0,2) 'a'=='a' ok          2             4
//   (1,2) even    (1,2) 'a'=='a' ok                   1             5
//   i=2 odd       (2,2) ok                            1             6
//   (2,3) even    r=3 out of bounds, no expansion      0             6
//
// Returns 6  ("a","a","a","aa","aa","aaa")

public int countSubstrings(String s) {
  int count = 0;
  // Each of the 2n-1 centers (n single-char, n-1 between-char gaps) is checked once
  for (int i = 0; i < s.length(); i++) {
    // Odd-length palindromes centered ON index i
    count += expand(s, i, i);
    // Even-length palindromes centered BETWEEN i and i+1
    count += expand(s, i, i + 1);
  }
  return count;
}
// Push (l, r) outward while in bounds and mirrored chars match.
// Every successful step is itself a palindrome, so count each one, not just the last.
private int expand(String s, int l, int r) {
  int count = 0;
  while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
    // (l, r) span is a palindrome — record it before growing further
    count++;
    l--;   // walk left edge out
    r++;   // walk right edge out
  }
  return count;
}`
  },
  {
    num: 180, lc: 279, title: 'Perfect Squares', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · 1D',
    url: 'https://leetcode.com/problems/perfect-squares/',
    approach: 'Bottom-up dynamic programming — the unbounded knapsack pattern applied to squares instead of coins. Let dp[i] be the fewest perfect squares that sum to i. Build it from 0 upward: for each amount i, try every square j*j (j = 1, 2, ... while j*j <= i) and consider dp[i - j*j] + 1, because a decomposition of i can always end with one square j*j laid on top of an optimal decomposition of the remainder i - j*j. Taking the minimum over all valid j gives the optimum for i (optimal substructure, same as coin change). The squares can repeat, so every j from 1 up to sqrt(i) is tried again at every amount rather than being consumed once. Initialize dp[i] to i itself as a safe upper bound, since i can always be written as i ones (1*1 repeated i times), and dp[0] = 0 is the base case. The result is dp[n]. Runtime is O(n * sqrt(n)) time, O(n) space. A BFS over remainders (each level subtracts one square, shortest path to 0 wins) is an equivalent alternative, and Lagrange\'s four-square theorem gives an O(sqrt(n)) closed-form check but is overkill for an interview.',
    complexity: 'O(n · √n) time · O(n) space',
    code: `// Worked trace for n = 12   (squares tried: 1, 4, 9):
//
//   i    dp[i-1*1]  dp[i-4]  dp[i-9]  best j   dp[i]
//   ────────────────────────────────────────────────
//   1    dp[0]=0       -        -        1       1
//   2    dp[1]=1       -        -        1       2
//   3    dp[2]=2       -        -        1       3
//   4    dp[3]=3    dp[0]=0     -        2       1
//   5    dp[4]=1    dp[1]=1     -        1       2
//   6    dp[5]=2    dp[2]=2     -        1       3
//   7    dp[6]=3    dp[3]=3     -        1       4
//   8    dp[7]=4    dp[4]=1     -        2       2
//   9    dp[8]=2    dp[5]=2  dp[0]=0     3       1
//  10    dp[9]=1    dp[6]=3  dp[1]=1     1       2
//  11    dp[10]=2   dp[7]=4  dp[2]=2     1       3
//  12    dp[11]=3   dp[8]=2  dp[3]=3     2       3
//
// Returns 3 (12 = 4 + 4 + 4)

public int numSquares(int n) {
  // dp[i] = fewest perfect squares summing to i. Seed with the worst case
  // (i ones) so every real combination found later can only improve it.
  int[] dp = new int[n + 1];
  for (int i = 1; i <= n; i++) {
    dp[i] = i;
    // Try every square j*j that fits inside i as the "last" square used.
    // Squares are unbounded (may reuse the same j at different amounts),
    // unlike a 0/1 knapsack where each item is spent once.
    for (int j = 1; j * j <= i; j++) {
      // One square j*j plus an optimal decomposition of the remainder.
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }
  // dp[0] = 0 by construction (loop starts at i = 1), the base case
  // that every dp[i - j*j] eventually bottoms out on.
  return dp[n];
}`
  },
  {
    num: 181, lc: 509, title: 'Fibonacci Number', d: 'easy', companies: ['Garmin'],
    bucket: 'Dynamic Programming - 1D', category: 'DP · 1D',
    url: 'https://leetcode.com/problems/fibonacci-number/',
    approach: 'One-dimensional dynamic programming with the textbook recurrence F(n) = F(n-1) + F(n-2). Naive recursion re-derives the same F(k) exponentially many times — the call tree branches in two at every level — so it blows up to O(2^n) time even though there are only n distinct subproblems. The fix is to notice each state depends solely on its immediately preceding two values, so there is no need to memoize a whole array: roll two variables forward through a single loop from 2 up to n. The base cases F(0)=0 and F(1)=1 seed the roll, and returning n directly for n&lt;2 avoids ever entering the loop for those trivial inputs. This turns the problem into O(n) time and O(1) space. A memoized top-down recursion or a full-array bottom-up table are equivalent alternatives, but they cost O(n) space for no extra benefit once you notice only the last two values ever matter.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for n = 4:
//
//   i   prev2  prev1  curr = prev1+prev2
//   ────────────────────────────────────
//   2     0      1      1        (prev2←1, prev1←1)
//   3     1      1      2        (prev2←1, prev1←2)
//   4     1      2      3        (prev2←2, prev1←3)
//
// Returns prev1 = 3

public int fib(int n) {
  // Base cases F(0)=0, F(1)=1 — also short-circuits so the loop below never
  // needs to handle n < 2, where prev2/prev1 wouldn't both be defined yet.
  if (n < 2) return n;
  // Rolling window over the last two Fibonacci values — only they matter,
  // so an O(n)-space array is never needed.
  int prev2 = 0, prev1 = 1;      // prev2 = F(i-2), prev1 = F(i-1)
  for (int i = 2; i <= n; i++) {
    // F(i) = F(i-1) + F(i-2); this recurrence is exact, not an approximation
    int curr = prev1 + prev2;
    // Slide the two-value window forward one step
    prev2 = prev1;
    prev1 = curr;
  }
  // prev1 now holds F(n) after the loop's last iteration
  return prev1;
}`
  },
  // ─── Dynamic Programming - 2D (8) ───
  {
    num: 105, lc: 62, title: 'Unique Paths', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'Grid',
    url: 'https://leetcode.com/problems/unique-paths/',
    approach: '2D grid DP compressed to a single rolling row. Define dp[r][c] = number of paths from the start to cell (r,c). Since the robot only moves right or down, the only ways into (r,c) are from above and from the left, giving dp[r][c] = dp[r−1][c] + dp[r][c−1]; the top row and left column are all 1 (one straight path). Because each cell needs only the row above and the cell to its left, a 1D array suffices: row[c] += row[c−1] simultaneously folds in the value above (old row[c]) and to the left (already-updated row[c−1]). O(m·n) time, O(n) space. The closed-form binomial C(m+n−2, m−1) also works but risks overflow.',
    complexity: 'O(m · n) time · O(n) space',
    code: `// Worked trace for m = 3, n = 3 (row starts all 1s, updated left-to-right each pass):
//
//   r   action                          row after the pass
//   ──────────────────────────────────────────────────────
//   0   initial top row                 [1, 1, 1]
//   1   c=1: 1+1=2 ; c=2: 1+2=3         [1, 2, 3]
//   2   c=1: 2+1=3 ; c=2: 3+3=6         [1, 3, 6]
//
// Returns row[n-1] = row[2] = 6

public int uniquePaths(int m, int n) {
  // Rolling 1D row instead of a full m×n table. row[c] always represents dp[currentRow][c].
  int[] row = new int[n];
  Arrays.fill(row, 1);   // top row: exactly one way to reach each cell (keep moving right)
  for (int r = 1; r < m; r++) {
    for (int c = 1; c < n; c++) {
      // dp[r][c] = dp[r-1][c] (cell above) + dp[r][c-1] (cell to the left)
      // Before this line row[c] still holds dp[r-1][c]; row[c-1] was just updated to dp[r][c-1]
      row[c] += row[c - 1];
    }
  }
  return row[n - 1];   // paths to the bottom-right cell
}`
  },
  {
    num: 106, lc: 1143, title: 'Longest Common Subsequence', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'String',
    url: 'https://leetcode.com/problems/longest-common-subsequence/',
    approach: 'Classic 2D string DP. Let dp[i][j] = LCS length of the first i characters of a and the first j of b. If the current characters a[i−1] and b[j−1] match, they must both belong to an optimal LCS, so dp[i][j] = dp[i−1][j−1] + 1 (extend the diagonal). If they differ, at least one of them is excluded, so take the better of dropping a\'s last char (dp[i−1][j]) or b\'s last char (dp[i][j−1]). The row 0 and column 0 stay 0 (empty string shares nothing), which seeds the recurrence. Filling the (m+1)×(n+1) table is O(m·n) time and O(m·n) space; the row can be rolled to O(min(m,n)) space if memory is tight.',
    complexity: 'O(m · n) time · O(m · n) space',
    code: `// Worked trace for a = "abcde", b = "ace"  (dp[i][j], rows = a-prefix, cols = b-prefix):
//
//          j:   0(_)  1(a)  2(c)  3(e)
//   i=0 (_)      0     0     0     0
//   i=1 (a)      0     1     1     1     a==a → diag 0 +1
//   i=2 (b)      0     1     1     1     b matches none → carry max
//   i=3 (c)      0     1     2     2     c==c → diag 1 +1
//   i=4 (d)      0     1     2     2     d matches none → carry max
//   i=5 (e)      0     1     2     3     e==e → diag 2 +1
//
// Returns dp[5][3] = 3  (the subsequence "ace")

public int longestCommonSubsequence(String a, String b) {
  int m = a.length(), n = b.length();
  // dp[i][j] = LCS length using the first i chars of a and the first j chars of b
  // (row 0 / col 0 stay 0 since an empty string shares nothing)
  int[][] dp = new int[m + 1][n + 1];
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (a.charAt(i - 1) == b.charAt(j - 1)) {
        // Characters match → both are part of the LCS, so extend the diagonal by 1
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Mismatch → drop the last char of whichever side yields the longer LCS
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];   // LCS length for the full strings
}`
  },
  {
    num: 107, lc: 72, title: 'Edit Distance', d: 'hard',
    bucket: 'Dynamic Programming - 2D', category: 'String',
    url: 'https://leetcode.com/problems/edit-distance/',
    approach: '2D Levenshtein DP. Let dp[i][j] = minimum edits to convert the first i chars of word1 into the first j chars of word2. Base cases: converting i chars to the empty string costs i deletions (dp[i][0]=i) and the empty string to j chars costs j insertions (dp[0][j]=j). For the body, if the last chars match the cost carries over unchanged from dp[i−1][j−1]; otherwise pay 1 plus the cheapest of replace (dp[i−1][j−1]), delete from word1 (dp[i−1][j]), or insert into word1 (dp[i][j−1]). Each subproblem depends only on its three neighbors, so the table fills in O(m·n) time and O(m·n) space (rollable to O(n)).',
    complexity: 'O(m · n) time · O(m · n) space',
    code: `// Worked trace for word1 = "horse", word2 = "ros"  (dp[i][j]):
//
//          j:   0(_)  1(r)  2(o)  3(s)
//   i=0 (_)      0     1     2     3      (insert j chars)
//   i=1 (h)      1     1     2     3
//   i=2 (o)      2     2     1     2      o==o → carry diagonal
//   i=3 (r)      3     2     2     2
//   i=4 (s)      4     3     3     2      s==s → carry diagonal
//   i=5 (e)      5     4     4     3
//
// Returns dp[5][3] = 3

public int minDistance(String word1, String word2) {
  int m = word1.length(), n = word2.length();
  // dp[i][j] = min edits to turn word1[0..i) into word2[0..j)
  int[][] dp = new int[m + 1][n + 1];
  // Base row/column: editing to/from "" costs one op per leftover character
  for (int i = 0; i <= m; i++) dp[i][0] = i;   // i deletions
  for (int j = 0; j <= n; j++) dp[0][j] = j;   // j insertions
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
        // Last chars equal → no edit needed here, inherit the diagonal cost
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // Otherwise pay 1 plus the cheapest fix among the three neighbors:
        //   replace → dp[i-1][j-1] + 1   (swap word1's char for word2's)
        //   delete  → dp[i-1][j]   + 1   (drop word1's char)
        //   insert  → dp[i][j-1]   + 1   (add word2's char into word1)
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
      }
    }
  }
  return dp[m][n];   // edits for the full transformation
}`
  },
  {
    num: 108, lc: 416, title: 'Partition Equal Subset Sum', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: '0/1 Knapsack',
    url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
    approach: 'Reduce to a 0/1 subset-sum (knapsack) decision: an equal partition exists iff some subset sums to total/2, so if the total is odd the answer is immediately false. Define dp[t] = can we form exactly sum t using a subset of the numbers seen so far; dp[0] is true (the empty subset). For each number n, update t from target down to n: dp[t] = dp[t] || dp[t−n]. The reverse iteration is the crucial trick — going high-to-low guarantees each number contributes to dp at most once per item (0/1 semantics); a forward loop would reuse the same number repeatedly (unbounded knapsack). O(n·sum) time, O(sum) space.',
    complexity: 'O(n · sum) time · O(sum) space',
    code: `// Worked trace for nums = [1,5,11,5], sum = 22, target = 11.
// dp[t] = can some subset reach sum t. (showing only indices set true)
//
//   process n   updated dp indices (walking t = target..n, OR in dp[t-n])
//   ────────────────────────────────────────────────────────────────────
//   init        {0}
//   n=1         {0,1}
//   n=5         {0,1,5,6}
//   n=11        {0,1,5,6,11,12,16,17}      ← dp[11] becomes true
//   n=5         {... 11 stays true ...}
//
// Returns dp[11] = true

public boolean canPartition(int[] nums) {
  int sum = 0;
  for (int n : nums) sum += n;   // total of all elements
  // An odd total can never split into two equal integer halves
  if ((sum & 1) == 1) return false;
  int target = sum / 2;   // each half must reach exactly this
  // dp[t] = can we form the sum t using some subset of the numbers processed so far?
  boolean[] dp = new boolean[target + 1];
  dp[0] = true;   // the empty subset always sums to 0
  for (int n : nums) {
    // Walk t in REVERSE so each n folds into dp at most once (true 0/1 knapsack);
    // a forward sweep would let one n be counted multiple times
    for (int t = target; t >= n; t--) dp[t] = dp[t] || dp[t - n];
  }
  return dp[target];   // can one subset hit exactly half the total?
}`
  },
  {
    num: 109, lc: 221, title: 'Maximal Square', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'Grid',
    url: 'https://leetcode.com/problems/maximal-square/',
    approach: '2D DP on square sides, compressed to a rolling row. Define dp[r][c] = side length of the largest all-ones square whose bottom-right corner is (r,c). A \'0\' cell forces dp=0. A \'1\' cell can extend a square only as far as its three neighbors allow, so dp[r][c] = 1 + min(top, left, top-left): the min ensures all three smaller squares overlap into a solid block. Track the running best side; the answer is best². Using a 1D array plus a single \'prev\' scalar to remember the diagonal value before it is overwritten cuts space from O(R·C) to O(C). O(R·C) time. Pitfall: returning the side instead of side² (the area).',
    complexity: 'O(R · C) time · O(C) space (rolling row)',
    code: `// Worked trace (1-indexed dp, dp[c] = best square side ending at this row, col c-1):
// matrix = [['1','1'],
//           ['1','1']]      R=2, C=2
//
//   r c  cell  tmp=dp[c]  dp[c]=1+min(prev,dp[c],dp[c-1])  best  prev(after)
//   ───────────────────────────────────────────────────────────────────────
//   1 1  '1'   0          1+min(0,0,0)=1                   1     0
//   1 2  '1'   0          1+min(0,0,1)=1                   1     0
//   2 1  '1'   0          1+min(0,0,0)=1                   1     0
//   2 2  '1'   1          1+min(0,1,1)=2                   2     1
//
// best = 2 → Returns best*best = 4

public int maximalSquare(char[][] matrix) {
  int R = matrix.length, C = matrix[0].length, best = 0;
  // Rolling 1D DP: dp[c] = largest all-ones square side with bottom-right at (current row, c-1).
  // 'prev' carries the diagonal (top-left) value — dp[c] from the previous row BEFORE we overwrite it.
  int[] dp = new int[C + 1];
  int prev = 0;
  for (int r = 1; r <= R; r++) {
    for (int c = 1; c <= C; c++) {
      int tmp = dp[c];   // stash current dp[c] BEFORE overwrite — it becomes the next cell's diagonal 'prev'
      if (matrix[r - 1][c - 1] == '1') {
        // A square here can be no bigger than 1 + its smallest neighboring square
        // (top = dp[c], left = dp[c-1], top-left = prev) so all three overlap
        dp[c] = 1 + Math.min(prev, Math.min(dp[c], dp[c - 1]));
        best = Math.max(best, dp[c]);   // remember the largest side seen
      } else {
        dp[c] = 0;   // a '0' cell can end no square
      }
      prev = tmp;   // shift the saved diagonal forward for the next column
    }
  }
  // Convert the best side length into an area
  return best * best;
}`
  },

  {
    num: 182, lc: 64, title: 'Minimum Path Sum', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'DP · Grid',
    url: 'https://leetcode.com/problems/minimum-path-sum/',
    approach: '2D grid DP compressed to a single rolling row. Define dp[r][c] = minimum sum to reach cell (r,c) from the top-left; since movement is restricted to right or down, the only ways into (r,c) are from above and from the left, so dp[r][c] = grid[r][c] + min(dp[r−1][c], dp[r][c−1]). The first row and first column have only one possible incoming direction each (straight across or straight down), so they are seeded as running prefix sums before the general recurrence kicks in. Because each cell needs only the value directly above it and the value immediately to its left, the full m×n table collapses to a single reused row: row[c] = grid[r][c] + min(row[c], row[c−1]) simultaneously reads the old row[c] (value from above, not yet overwritten this pass) and the freshly updated row[c−1] (value from the left). Recomputing every path with plain recursion is exponential since paths share overlapping subproblems; DP memoizes each cell exactly once. This runs in O(m·n) time and O(n) space. An equivalent alternative mutates the input grid in place as the DP table, trading the extra array for O(1) space at the cost of destroying the input.',
    complexity: 'O(m · n) time · O(n) space',
    code: `// Worked trace for grid = [[1,3,1],[1,5,1],[4,2,1]] (row reused each pass):
//
//   r   action                                    row after the pass
//   ──────────────────────────────────────────────────────────────────
//   0   seed: running sum across the top row      [1, 4, 5]
//   1   c=0: 1+1=2                                 [2, _, _]
//       c=1: 5+min(4,2)=5+2=7                      [2, 7, _]
//       c=2: 1+min(5,7)=1+5=6                      [2, 7, 6]
//   2   c=0: 4+2=6                                 [6, _, _]
//       c=1: 2+min(7,6)=2+6=8                      [6, 8, _]
//       c=2: 1+min(6,8)=1+6=7                      [6, 8, 7]
//
// Returns row[n-1] = row[2] = 7  (path 1 -> 3 -> 1 -> 1 -> 1)

public int minPathSum(int[][] grid) {
  int m = grid.length, n = grid[0].length;
  // Rolling 1D row instead of a full m×n table. row[c] always represents dp[currentRow][c].
  int[] row = new int[n];
  // Seed the top row as a running prefix sum — moving right is the only way in.
  row[0] = grid[0][0];
  for (int c = 1; c < n; c++) {
    row[c] = row[c - 1] + grid[0][c];
  }
  for (int r = 1; r < m; r++) {
    // First column: only reachable from above, so it's a running sum down the left edge.
    row[0] += grid[r][0];
    for (int c = 1; c < n; c++) {
      // row[c] still holds dp[r-1][c] (from above); row[c-1] was just updated to dp[r][c-1] (from the left).
      // Take the cheaper of the two incoming directions, then pay the cost of the current cell.
      row[c] = grid[r][c] + Math.min(row[c], row[c - 1]);
    }
  }
  return row[n - 1];   // minimum cost path to the bottom-right cell
}`
  },
  {
    num: 183, lc: 518, title: 'Coin Change II', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'DP · Unbounded Knapsack',
    url: 'https://leetcode.com/problems/coin-change-ii/',
    approach: 'Unbounded-knapsack DP counting combinations, not permutations. Define dp[t] = number of distinct ways to make amount t using the coins processed so far, seeded with dp[0] = 1 (the empty combination). Process coins in an OUTER loop and amounts in an INNER forward loop, dp[t] += dp[t - coin] — looping coins on the outside is what makes {1,2} and {2,1} collapse into a single counted combination, since by the time coin=2 runs, dp already reflects every way built purely from smaller-or-equal coins seen earlier, and forward iteration over amounts (unlike the 0/1 knapsack\'s reverse sweep) intentionally lets the same coin be reused any number of times within that pass. Swapping the loop order to amount-outer/coin-inner would instead count ordered sequences, overcounting distinct arrangements of the same multiset as separate answers. Runs in O(coins.length · amount) time and O(amount) space with the rolling 1D array; a full 2D dp[i][t] table is the unrolled equivalent that makes the same recurrence more explicit at the cost of O(coins.length · amount) space.',
    complexity: 'O(coins.length · amount) time · O(amount) space',
    code: `// Worked trace for coins = [1, 2, 5], amount = 5 (dp[t] = ways to make t; outer loop = coin):
//
//   coin   dp[0] dp[1] dp[2] dp[3] dp[4] dp[5]   updates applied (t = coin..amount, forward)
//   ─────────────────────────────────────────────────────────────────────────────────────
//   init     1     0     0     0     0     0
//    1        1     1     1     1     1     1     dp[t] += dp[t-1] for t=1..5
//    2        1     1     2     2     3     3     dp[t] += dp[t-2] for t=2..5
//    5        1     1     2     2     3     4     dp[5] += dp[0]
//
// Returns dp[5] = 4  (the combinations {5}, {1,2,2}, {1,1,1,2}, {1,1,1,1,1})

public int change(int amount, int[] coins) {
  // dp[t] = number of distinct combinations of coins that sum to exactly t
  int[] dp = new int[amount + 1];
  // Base case: exactly one way to make 0 — pick no coins at all
  dp[0] = 1;
  // Coin OUTSIDE, amount INSIDE: this ordering is what makes the count respect
  // combinations (unordered multisets) instead of permutations (ordered sequences).
  for (int coin : coins) {
    // Forward sweep (unlike 0/1 knapsack's reverse sweep) — lets this same coin
    // be reused arbitrarily many times while filling out this one pass
    for (int t = coin; t <= amount; t++) {
      // Every way to make (t - coin) can be extended by one more of this coin
      dp[t] += dp[t - coin];
    }
  }
  // Total ways to build the full amount using any mix of the given coins
  return dp[amount];
}`
  },
  {
    num: 184, lc: 494, title: 'Target Sum', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'DP · 0/1 Knapsack',
    url: 'https://leetcode.com/problems/target-sum/',
    approach: 'Reframe the +/- sign-assignment problem as a subset-sum count. Split nums into a "positive" subset P (numbers assigned +) and the rest, which is implicitly assigned -. Then sum(P) - (total - sum(P)) = target, which rearranges to sum(P) = (total + target) / 2 — a fixed number every valid assignment\'s positive subset must hit. If (total + target) is odd, or target\'s magnitude exceeds total, no subset can ever reach it, so the answer is immediately 0. Otherwise the problem becomes exactly "count subsets of nums that sum to P", a 0/1 knapsack counting DP: dp[s] = number of ways to reach sum s using items processed so far, updated as dp[s] += dp[s - n] for each number n. Iterating s from high to low is essential — it guarantees each number is folded into the count at most once per item, which is what makes this 0/1 (choose or skip) rather than unbounded (reuse freely). This turns an O(2^n) brute-force enumeration of every sign combination into O(n · P) time and O(P) space. A top-down memoized recursion on (index, remaining sum) is an equivalent alternative with the same complexity.',
    complexity: 'O(n · sum) time · O(sum) space',
    code: `// Worked trace for nums = [1,1,1,1,1], target = 3:
// total = 5, (total+target)=8 is even -> P = (5+3)/2 = 4. dp[s] = # subsets summing to s.
//
//   process n=1   dp[0] dp[1] dp[2] dp[3] dp[4]   (t walked 4 -> 1, dp[t] += dp[t-1])
//   ────────────────────────────────────────────────────────────────────────────────
//   init            1     0     0     0     0
//   #1              1     1     0     0     0
//   #2              1     2     1     0     0
//   #3              1     3     3     1     0
//   #4              1     4     6     4     1
//   #5              1     5    10    10     5
//
// Returns dp[4] = 5  (matches the 5 sign assignments LeetCode lists for this input)

public int findTargetSumWays(int[] nums, int target) {
  int total = 0;
  for (int n : nums) total += n;   // sum of all magnitudes, ignoring sign
  // Need sum(positiveSubset) = (total + target) / 2. If that value isn't a whole
  // number, or target is unreachable in magnitude, no assignment can ever work.
  if (Math.abs(target) > total || ((total + target) % 2 != 0)) return 0;
  int P = (total + target) / 2;   // required sum of the "+" subset
  // dp[s] = number of ways to choose a subset (from numbers processed so far) summing to s
  int[] dp = new int[P + 1];
  dp[0] = 1;   // exactly one way to reach sum 0: pick nothing
  for (int n : nums) {
    // Walk s in REVERSE so each n contributes to dp at most once per item (0/1 knapsack);
    // a forward sweep would let the same number be reused, over-counting subsets.
    for (int s = P; s >= n; s--) dp[s] += dp[s - n];
  }
  return dp[P];   // number of subsets whose sum hits the required target P
}`
  },
  // ─── Greedy (6) ───
  {
    num: 220, lc: 10, title: 'Regular Expression Matching', d: 'hard',
    bucket: 'Dynamic Programming - 2D', category: 'String · DP',
    url: 'https://leetcode.com/problems/regular-expression-matching/',
    approach: 'A two-dimensional table where dp[i][j] answers "does the first i characters of s match the first j characters of p?". The recursion has three shapes. A plain character or a dot matches one character and inherits dp[i-1][j-1]. A star is the interesting case, and the crucial realisation is that a star always belongs to the token BEFORE it, so p is really read two characters at a time at those positions: the star can mean zero occurrences, which skips the pair entirely and inherits dp[i][j-2], or — only when the preceding token can match the current character of s — one more occurrence, which consumes s[i-1] but leaves the pattern where it is and inherits dp[i-1][j]. Combining those two with OR is the whole engine. The base row deserves special care: an empty s can still match a non-empty p made of star pairs, so dp[0][j] is seeded by walking j and propagating dp[0][j-2] through every star, and skipping that seeding is the single most common reason a naive attempt fails on inputs like ("", "a*b*"). Greedy scanning cannot solve this because a star must sometimes give characters back; plain recursion without the table is exponential on patterns like "a*a*a*".',
    complexity: 'O(m · n) time · O(m · n) space',
    code: `// Worked trace for s = "aab", p = "c*a*b"
//
//        ""   c    c*   a    a*   b
//   ""    T   F    T    F    T    F
//   a     F   F    F    T    T    F
//   a     F   F    F    F    T    F
//   b     F   F    F    F    F    T
//
//   dp[0][2] = T : "c*" takes zero c's
//   dp[2][4] = T : "a*" takes two a's  (dp[1][4] via the star-repeat branch)
//   dp[3][5] = T : final 'b' matches, inheriting dp[2][4]
//
// Returns true

public boolean isMatch(String s, String p) {
  int m = s.length(), n = p.length();
  // dp[i][j] = do the first i chars of s match the first j chars of p?
  boolean[][] dp = new boolean[m + 1][n + 1];
  dp[0][0] = true;

  // Base row: an EMPTY s can still match a non-empty pattern built from star
  // pairs, e.g. "a*b*". Each star reaches back two cells to erase its own
  // token. Omitting this seeding is the classic reason a first attempt fails.
  for (int j = 1; j <= n; j++) {
    if (p.charAt(j - 1) == '*') {
      dp[0][j] = dp[0][j - 2];
    }
  }

  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      char pc = p.charAt(j - 1);
      if (pc == '*') {
        // A star always binds to the token BEFORE it, so this position really
        // covers the pair (p[j-2], '*').
        //
        // Branch 1 — zero occurrences: drop the pair and carry on.
        dp[i][j] = dp[i][j - 2];
        char prev = p.charAt(j - 2);
        // Branch 2 — one more occurrence: legal only if the repeated token can
        // match the current character. Consumes s[i-1] but leaves p in place,
        // which is what lets one star swallow a whole run.
        if (prev == '.' || prev == s.charAt(i - 1)) {
          dp[i][j] |= dp[i - 1][j];
        }
      } else if (pc == '.' || pc == s.charAt(i - 1)) {
        // Ordinary single-character match — both strings advance together
        dp[i][j] = dp[i - 1][j - 1];
      }
      // else: mismatch, dp[i][j] stays false
    }
  }
  return dp[m][n];
}`
  },
  {
    num: 221, lc: 329, title: 'Longest Increasing Path in a Matrix', d: 'hard',
    bucket: 'Dynamic Programming - 2D', category: 'Matrix · DFS + Memoization',
    url: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/',
    approach: 'Read the grid as a directed graph with an edge from each cell to any strictly larger neighbour. Because values must strictly increase along an edge, that graph is acyclic by construction — no path can ever return to a cell it has left — and this is the fact that makes the whole solution work: no visited set and no cycle detection are needed, which is exactly what a normal grid DFS would require. The longest increasing path starting at a cell then depends only on that cell, so a memo table caches it and every cell is expanded once regardless of how many paths run through it, giving O(m · n) instead of the exponential blowup of the plain recursion. The memo also doubles as the computed flag: a genuine answer is at least 1 (the cell itself), so a stored 0 unambiguously means "not yet computed" and no sentinel value or parallel boolean grid is required. The outer loops start a search at every cell because the best path may begin anywhere, and the memo makes those repeated launches nearly free. A topological-sort or peeling variant using in-degrees is an equivalent O(m · n) alternative; this version is shorter and needs no queue.',
    complexity: 'O(m · n) time · O(m · n) space',
    code: `// Worked trace for matrix = [[9, 9, 4],
//                             [6, 6, 8],
//                             [2, 1, 1]]
//
//   cell   larger neighbours   memo value
//   ──────────────────────────────────────
//   (0,0)=9  none              1
//   (0,2)=4  (1,2)=8           2      via 4 -> 8
//   (1,2)=8  (0,2)? no, 4<8    1
//   (1,0)=6  (0,0)=9           2      via 6 -> 9
//   (2,1)=1  (1,1)=6           3      via 1 -> 6 -> 9
//   (2,0)=2  (1,0)=6           3      via 2 -> 6 -> 9
//
// Returns 4  (1 -> 2 -> 6 -> 9, starting at (2,1) going left then up)

private static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

public int longestIncreasingPath(int[][] matrix) {
  int m = matrix.length, n = matrix[0].length;
  int[][] memo = new int[m][n];

  int best = 0;
  // The optimal path can start anywhere, so launch from every cell. The memo
  // makes all but the first visit to a cell O(1), keeping the total linear.
  for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
      best = Math.max(best, dfs(matrix, i, j, memo));
    }
  }
  return best;
}

/** Longest strictly increasing path that STARTS at (r, c), counting (r, c) itself. */
private int dfs(int[][] matrix, int r, int c, int[][] memo) {
  // A real answer is always >= 1, so 0 unambiguously means "not computed yet" —
  // no sentinel value or separate visited grid needed.
  if (memo[r][c] != 0) {
    return memo[r][c];
  }

  int best = 1;   // the cell alone is already a path of length 1
  for (int[] d : DIRS) {
    int nr = r + d[0], nc = c + d[1];
    if (nr < 0 || nr >= matrix.length || nc < 0 || nc >= matrix[0].length) {
      continue;
    }
    // Strictly increasing only. This is also why no visited set is required:
    // values rise along every edge, so the graph is acyclic and recursion
    // can never revisit a cell on the current path.
    if (matrix[nr][nc] <= matrix[r][c]) {
      continue;
    }
    best = Math.max(best, 1 + dfs(matrix, nr, nc, memo));
  }
  return memo[r][c] = best;
}`
  },
  {
    num: 222, lc: 629, title: 'K Inverse Pairs Array', d: 'hard',
    bucket: 'Dynamic Programming - 2D', category: 'DP · Sliding Window Sum',
    url: 'https://leetcode.com/problems/k-inverse-pairs-array/',
    approach: 'Build the permutations one value at a time and count by how many new inversions each insertion creates. Take any arrangement of 1..i-1 and insert the new largest value i: placing it at the far right adds no inversions, one slot further left adds one, and so on up to i-1 at the very front. That gives the recurrence dp[i][j] = sum over t from 0 to min(j, i-1) of dp[i-1][j-t] — every arrangement of the smaller set contributes to a contiguous BAND of j values. Evaluated literally the inner sum makes this O(n · k · n), too slow at the stated limits, but a band that slides by exactly one as j advances is precisely what a running window sum handles: add the newly entered term prev[j] and subtract the one that just fell out, prev[j-i], for a single O(n · k) pass. The modular arithmetic needs one guard — after subtracting, the running value can go negative, and Java\'s % preserves that sign, so the ((x % MOD) + MOD) % MOD normalisation is required or the answer comes back negative. Only the previous row is ever read, so two rolling arrays replace the full table.',
    complexity: 'O(n · k) time · O(k) space',
    code: `// Worked trace for n = 3, k = 1  (arrangements of 1..3 with exactly 1 inversion)
//
//   row i = 1 (base):  prev = [1, 0]        one empty-ish arrangement, 0 inversions
//
//   row i = 2:  window covers prev[j-1 .. j]
//     j=0: window = prev[0] = 1                      cur[0] = 1
//     j=1: window = prev[0] + prev[1] = 1            cur[1] = 1
//     prev = [1, 1]                                  ([1,2] and [2,1])
//
//   row i = 3:  window covers prev[j-2 .. j]
//     j=0: window = 1                                cur[0] = 1
//     j=1: window = prev[0] + prev[1] = 2            cur[1] = 2
//
// Returns 2  ([1,3,2] and [2,1,3])

public int kInversePairs(int n, int k) {
  final int MOD = 1_000_000_007;

  // prev[j] = arrangements of 1..i-1 with exactly j inverse pairs.
  // Base row i = 1: a single element has exactly one arrangement, 0 inversions.
  int[] prev = new int[k + 1];
  prev[0] = 1;

  for (int i = 2; i <= n; i++) {
    int[] cur = new int[k + 1];
    // Inserting the new largest value i into an arrangement of 1..i-1 adds
    // between 0 and i-1 inversions depending on the slot chosen, so
    //   dp[i][j] = prev[j-i+1] + ... + prev[j]
    // which is a band of width i that slides by one as j advances — exactly
    // what a running window sum computes in O(1) per step.
    long window = 0;
    for (int j = 0; j <= k; j++) {
      window += prev[j];            // term entering the band
      if (j >= i) {
        window -= prev[j - i];      // term leaving it
      }
      // The subtraction can drive the running value negative, and Java's %
      // keeps the sign — without this normalisation the answer comes back
      // negative rather than in [0, MOD).
      window = ((window % MOD) + MOD) % MOD;
      cur[j] = (int) window;
    }
    prev = cur;   // only the previous row is ever read, so roll instead of storing all
  }
  return prev[k];
}`
  },
  {
    num: 110, lc: 134, title: 'Gas Station', d: 'medium',
    bucket: 'Greedy', category: 'Array',
    url: 'https://leetcode.com/problems/gas-station/',
    approach: 'Greedy one-pass with a global feasibility check. First, the loop is completable iff the total gas minus total cost is non-negative — if the whole circuit can\'t break even, no start works, so return −1. Given it is feasible, the unique start is found by scanning a running tank of (gas[i]−cost[i]): whenever the tank dips below zero at index i, no station in start..i could have been the true origin (any sub-start would have dipped too), so reset start to i+1 and zero the tank. The single survivor at the end is the answer. This is correct because feasibility guarantees the reset never overshoots the real start. O(n) time, O(1) space.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for gas = [1,2,3,4,5], cost = [3,4,5,1,2]:
//
//   i  diff=gas-cost  total+=diff  tank+=diff   tank<0? → start=i+1, tank=0
//   ────────────────────────────────────────────────────────────────────────
//   0   1-3 = -2       -2           -2          yes → start=1, tank=0
//   1   2-4 = -2       -4           -2          yes → start=2, tank=0
//   2   3-5 = -2       -6           -2          yes → start=3, tank=0
//   3   4-1 =  3       -3            3          no
//   4   5-2 =  3        0            6          no
//
// total = 0 (>= 0) → Returns start = 3

public int canCompleteCircuit(int[] gas, int[] cost) {
  // 'total' decides whether the loop is possible AT ALL (must end >= 0)
  // 'tank' is the running fuel measured from the current candidate start
  int total = 0, tank = 0, start = 0;
  for (int i = 0; i < gas.length; i++) {
    int diff = gas[i] - cost[i];   // net fuel gained crossing segment i
    total += diff;
    tank  += diff;
    // Tank went negative → no station in start..i can be the origin
    // (any earlier candidate would have already failed before reaching here),
    // so the next viable start is i+1 and we reset the running tank
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  // Feasible overall → 'start' is the unique valid origin; otherwise impossible
  return total < 0 ? -1 : start;
}`
  },
  {
    num: 185, lc: 2144, title: 'Minimum Cost of Buying Candies With Discount', d: 'easy', companies: ['Garmin'],
    bucket: 'Greedy', category: 'Greedy · Sort',
    url: 'https://leetcode.com/problems/minimum-cost-of-buying-candies-with-discount/',
    approach: 'Sort the costs in descending order, then pay for every candy except every third one starting at index 2. The discount rule says buying two candies makes a third one free, and the store always lets you designate the cheapest of the three as the freebie, so to minimize total spend you want the candy given away for free to be as expensive as possible. Sorting descending puts the priciest candies first, so grouping them into consecutive triples (0,1,2), (3,4,5), ... means the third slot in each triple is always the smallest value in that group — exactly the one the greedy strategy wants to hand out for free. Summing every cost except those at indices where i % 3 == 2 gives the minimum total in one linear pass after the sort. A naive approach that tries every possible way to pick which candies are "free" is exponential and unnecessary once you see the exchange-argument: swapping any non-minimal candy into the free slot of a triple can only raise or keep the same total, never lower it. Overall this runs in O(n log n) time for the sort plus O(n) for the scan, O(1) extra space (O(log n)/O(n) if you count sort internals). An equivalent formulation processes the sorted array in triples of three and adds only the first two of each.',
    complexity: 'O(n log n) time · O(1) space',
    code: `// Worked trace for cost = [1, 2, 3]:
//
//   sorted descending: [3, 2, 1]
//
//   i   cost[i]   i % 3   free?   running total
//   ──────────────────────────────────────────────
//   0      3        0      no        3
//   1      2        1      no        5
//   2      1        2      yes       5   (skipped, it's the free candy)
//
// Returns 5

public int minimumCost(int[] cost) {
  // Sort descending so the most expensive candies are paid for first,
  // leaving only the cheapest candy in each group of three to be free.
  Arrays.sort(cost);
  int n = cost.length;
  for (int i = 0, j = n - 1; i < j; i++, j--) {
    int tmp = cost[i];
    cost[i] = cost[j];
    cost[j] = tmp;
  }
  int total = 0;
  for (int i = 0; i < n; i++) {
    // Every third candy (index 2, 5, 8, ...) in the descending order is the
    // smallest of its triple, so it's the one the discount gives away free.
    // Skipping it — instead of any other member of the triple — is what
    // maximizes the value given away, minimizing what's actually paid.
    if (i % 3 == 2) continue;
    total += cost[i];
  }
  // Handles n < 3 automatically: with no full triple, i % 3 == 2 never
  // triggers, so every candy is paid for — correct, since no discount applies.
  return total;
}`
  },
  {
    num: 186, lc: 1353, title: 'Maximum Number of Events That Can Be Attended', d: 'medium', companies: ['Garmin'],
    bucket: 'Greedy', category: 'Greedy · Heap',
    url: 'https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/',
    approach: 'Greedy with a min-heap, walking one calendar day at a time. Sort events by start day, then sweep day from the earliest start to the latest end; on each day push every event that opens today (its end day) onto a min-heap keyed by end day, first popping off any heap entries whose end day has already passed — those events expired unattended and can never be used. If the heap is non-empty after that cleanup, attend the event with the SMALLEST end day: it is the most constrained option left, so saving it for later only risks losing it, while events with a later end day remain safely attendable tomorrow. This exchange argument is what makes the greedy optimal — always burn the most urgent deadline first. Sorting is O(n log n) and each event is pushed and popped from the heap at most once, so the sweep is O((n + D) log n) where D is the day range, O(n) space for the heap. A segment-tree or union-find "next free day" approach solves it without the explicit day-by-day walk but is considerably more code for the same complexity class.',
    complexity: 'O((n + D) log n) time · O(n) space',
    code: `// Worked trace for events = [[1,2],[2,3],[3,4]]:
//
//   day  events opened today   heap after push   expired popped   attend (min end)  count
//   ──────────────────────────────────────────────────────────────────────────────────────
//   1    [1,2]                 {2}               none             pop 2             1
//   2    [2,3]                 {3}               none             pop 3             2
//   3    [3,4]                 {4}               none             pop 4             3
//   4    (none)                {}                none             heap empty        3
//
// Returns 3

public int maxEvents(int[][] events) {
  // Sort by start day so the day-by-day sweep can push events onto the heap
  // exactly when they become attendable, never before.
  // LAMBDA (Comparator): (a, b) -> a[0] - b[0] IS the compare(a, b) body — a
  // negative result means a comes before b, so events sort by start day ascending.
  // Without the lambda:
  //   Arrays.sort(events, new Comparator<int[]>() {
  //     public int compare(int[] a, int[] b) { return a[0] - b[0]; }
  //   });
  Arrays.sort(events, (a, b) -> a[0] - b[0]);
  int n = events.length;
  // Min-heap of end days for every event that is open but not yet attended.
  // Popping the smallest end day first is the greedy choice: it is the
  // event closest to expiring, so it must be used now or never.
  PriorityQueue<Integer> heap = new PriorityQueue<>();
  int day = 1, i = 0, count = 0;
  // The last day any event could possibly still be attended
  int maxDay = 0;
  for (int[] e : events) maxDay = Math.max(maxDay, e[1]);
  // Sweep every candidate day; events starting after maxDay can't matter
  while (day <= maxDay) {
    // Open every event whose start day is today (events are sorted by start)
    while (i < n && events[i][0] == day) {
      heap.offer(events[i][1]);
      i++;
    }
    // Discard events whose end day already passed — they expired unattended
    // because no earlier day picked them, so they can never be used now.
    while (!heap.isEmpty() && heap.peek() < day) {
      heap.poll();
    }
    // Attend the most urgent open event today, if any is available
    if (!heap.isEmpty()) {
      heap.poll();
      count++;
    }
    day++;
  }
  return count;
}`
  },
  {
    num: 187, lc: 763, title: 'Partition Labels', d: 'medium',
    bucket: 'Greedy', category: 'Greedy · Intervals',
    url: 'https://leetcode.com/problems/partition-labels/',
    approach: 'Greedy interval merging driven by last-occurrence indices. First scan the string once to record, for every character, the index of its LAST appearance — that tells you the farthest right a partition must extend once it includes that character. Then sweep left to right maintaining a running end = max of last[c] for every character c seen so far in the current partition; as long as the current index i has not reached end, the partition cannot close yet because some earlier character still has an occurrence waiting further right. The key insight is that end only grows (or stays put) as you scan, so the moment i == end you have proof every character inside [start, end] is fully contained there and never reappears later — cutting there is always safe and always maximal, since closing any earlier would split a character across two partitions. A naive alternative — checking, for every candidate cut, whether any character straddles it by rescanning the suffix — costs O(n²); the running-max trick collapses that to a single O(n) pass. Two linear passes over the string (26-letter alphabet) give O(n) time and O(1) extra space (the last-index table is fixed size 26), and an equivalent formulation greedily grows each partition\'s end via Math.max as new characters are visited instead of precomputing a table upfront.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for S = "ababcbacadefegdehijhklij":
//
//   idx  char  last[char]  end (running max)  i==end?  action
//   ────────────────────────────────────────────────────────────────
//    0    a         8              8            no
//    1    b         5              8            no
//    2    a         8              8            no
//    3    b         5              8            no
//    4    c         7              8            no
//    5    b         5              8            no
//    6    a         8              8            no
//    7    c         7              8            no
//    8    a         8              8            yes   cut: [0,8]  len 9
//    9    d        14             14            no
//   10    e        15             15            no
//   11    f        11             15            no
//   12    e        15             15            no
//   13    g        13             15            no
//   14    d        14             15            no
//   15    e        15             15            yes   cut: [9,15] len 7
//   16    h        19             19            no
//   17    i        22             22            no
//   18    j        23             23            no
//   19    h        19             23            no
//   20    k        20             23            no
//   21    l        21             23            no
//   22    i        22             23            no
//   23    j        23             23            yes   cut: [16,23] len 8
//
// Returns [9, 7, 8]

public List<Integer> partitionLabels(String s) {
  int n = s.length();
  // Fixed-size table (26 lowercase letters) — one pass to learn how far right
  // each character's influence reaches before the partition sweep begins.
  int[] last = new int[26];
  for (int i = 0; i < n; i++) {
    // Overwriting on every sighting means this ends up holding the LAST index,
    // which is exactly the boundary a partition containing this char must reach.
    last[s.charAt(i) - 'a'] = i;
  }

  List<Integer> result = new ArrayList<>();
  // start of the current partition; end is the farthest index it must extend to
  int start = 0, end = 0;
  for (int i = 0; i < n; i++) {
    // Pull the current partition's boundary outward if this char reappears later.
    // end never shrinks, so once i catches up to it nothing earlier can reopen it.
    end = Math.max(end, last[s.charAt(i) - 'a']);
    // i == end proves every character in [start, i] has its last occurrence
    // at or before i — safe to cut here, and cutting sooner would split a char.
    if (i == end) {
      result.add(end - start + 1);
      // Next partition begins right after this one closes
      start = i + 1;
    }
  }
  return result;
}`
  },
  {
    num: 188, lc: 435, title: 'Non-overlapping Intervals', d: 'medium',
    bucket: 'Greedy', category: 'Greedy · Intervals',
    url: 'https://leetcode.com/problems/non-overlapping-intervals/',
    approach: 'Sort intervals by END time, then greedily keep the earliest-ending interval whenever a conflict appears. Walking left to right, track the end of the last KEPT interval; if the next interval\'s start is >= that end there is no overlap, so keep it and advance the boundary. If it starts before that end, the two intervals overlap and one must be removed — always discard the one with the LATER end, since keeping the earlier-ending interval leaves the most room for everything that follows, which can only help (never hurt) future non-overlap decisions. This exchange argument is exactly what makes the greedy choice safe: for any optimal solution that instead kept the later-ending interval, swapping in the earlier-ending one is still valid and no worse. Sorting by start time instead is a common but wrong instinct — it lets a long interval that starts first block out several shorter, non-overlapping ones later, forcing more removals than necessary. The whole pass after sorting is a single linear scan, so the cost is dominated by the sort. Runs in O(n log n) time for the sort plus O(n) for the scan, and O(1) extra space (O(n) or O(log n) if you count sort overhead). An equivalent reframing is to compute the maximum number of NON-overlapping intervals you can keep (classic activity selection, same end-time-greedy logic) and subtract that count from n.',
    complexity: 'O(n log n) time · O(1) space',
    code: `// Worked trace for intervals = [[1,2],[2,3],[3,4],[1,3]]:
//
// Sorted by end time: [1,2], [2,3], [1,3], [3,4]
//
//   interval   prevEnd (before)  start>=prevEnd?  action        prevEnd (after)  removed
//   ─────────────────────────────────────────────────────────────────────────────────────
//   [1,2]      -Infinity         (first, kept)                  2                0
//   [2,3]      2                 yes (2>=2)       keep          3                0
//   [1,3]      3                 no  (1<3)        remove        3 (unchanged)    1
//   [3,4]      3                 yes (3>=3)       keep          4                1
//
// Returns 1

public int eraseOverlapIntervals(int[][] intervals) {
  // No pairs possible with 0 or 1 interval, so nothing to remove
  if (intervals == null || intervals.length == 0) return 0;
  // Sort by END time: keeping the earliest-ending interval on a conflict
  // always leaves the most room for whatever comes next (exchange argument).
  // LAMBDA (Comparator): (a, b) -> Integer.compare(a[1], b[1]) IS the compare(a, b)
  // body — it returns -1/0/1 by end time, so intervals sort by end ascending.
  // (Integer.compare avoids the int-overflow that a[1] - b[1] risks on large ends.)
  // Without the lambda:
  //   Arrays.sort(intervals, new Comparator<int[]>() {
  //     public int compare(int[] a, int[] b) { return Integer.compare(a[1], b[1]); }
  //   });
  Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
  // End time of the last interval we decided to KEEP
  int prevEnd = intervals[0][1];
  int removed = 0;
  for (int i = 1; i < intervals.length; i++) {
    // No overlap: this interval starts at or after the last kept one ends
    if (intervals[i][0] >= prevEnd) {
      // Keep it, and this interval's end becomes the new boundary to beat
      prevEnd = intervals[i][1];
    } else {
      // Overlaps the last kept interval — one must go, so drop this one.
      // Its end is >= prevEnd (sort order), so it can never be a better
      // boundary than the interval we already kept; prevEnd stays put.
      removed++;
    }
  }
  return removed;
}`
  },
  {
    num: 189, lc: 605, title: 'Can Place Flowers', d: 'easy',
    bucket: 'Greedy', category: 'Greedy · Scan',
    url: 'https://leetcode.com/problems/can-place-flowers/',
    approach: 'Single left-to-right greedy scan: at each empty plot, plant a flower there if and only if both neighbors are also empty (or off the end of the array), then immediately decrement the remaining count n. The key insight is that planting as early as possible is never wrong — if plot i qualifies, skipping it can only remove a future option (its right neighbor becomes the next plot\'s left neighbor to worry about) and never creates one, so a locally greedy choice is globally optimal and no backtracking is ever needed. Treating out-of-bounds neighbors as empty cleanly handles the two array-edge cases without special-casing index 0 or the last index separately. Because a planted plot immediately blocks its own right neighbor from being planted on the same pass, no two adjacent plots ever end up both set to 1. The whole array is visited once with O(1) extra state (just the counter), so this beats any approach that rebuilds or re-scans the array per placement. Once n reaches zero further checks are pointless, so the loop can also short-circuit early as a minor constant-factor optimization. An equivalent formulation counts the maximum plantable flowers via runs of consecutive zeros (each run of length L, bounded by 1s or the array ends, holds floor((L+1)/2) flowers with edge runs adjusted) and compares that total against n up front.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for flowerbed = [1,0,0,0,1], n = 1:
//
//   i  bed[i]  leftEmpty  rightEmpty  plant?  bed after        n after
//   ────────────────────────────────────────────────────────────────────
//   0    1        -           -       skip    [1,0,0,0,1]        1
//   1    0      false          -      skip    [1,0,0,0,1]        1
//   2    0      true        true      yes     [1,0,1,0,1]        0
//
// n drops to 0 after i=2, so the loop guard (n > 0) stops the scan right
// there — indices 3 and 4 are never even visited. Returns true (n <= 0).

public boolean canPlaceFlowers(int[] flowerbed, int n) {
  int len = flowerbed.length;
  // Walk every plot once; bail out the moment we've placed enough flowers
  for (int i = 0; i < len && n > 0; i++) {
    // Already occupied — nothing to consider at this index
    if (flowerbed[i] == 1) continue;
    // Treat a missing neighbor (before index 0 or after the last index) as empty,
    // so the boundary plots don't need separate handling from the interior ones
    boolean leftEmpty = (i == 0) || (flowerbed[i - 1] == 0);
    boolean rightEmpty = (i == len - 1) || (flowerbed[i + 1] == 0);
    if (leftEmpty && rightEmpty) {
      // Greedy: plant now. Doing it as early as possible can only help later
      // plots, never hurt, since a later plant here would still block the same neighbor.
      flowerbed[i] = 1;
      n--;
    }
  }
  // All requested flowers were placed somewhere valid
  return n <= 0;
}`
  },

  // ─── Math & Bit Manipulation (11) ───
  {
    num: 190, lc: 7, title: 'Reverse Integer', d: 'medium',
    bucket: 'Math & Bit Manipulation', category: 'Math · Digits',
    url: 'https://leetcode.com/problems/reverse-integer/',
    approach: 'Peel digits off the back of x with % 10 and / 10, and rebuild the reversed number one digit at a time as rev = rev * 10 + digit. This avoids ever materializing the number as a string, so there is no need to worry about string-to-int parsing edge cases or extra space for the character buffer. The real difficulty is that the reversed value can overflow a 32-bit int even though the original x fit in one — e.g. reversing 1534236469 would produce 9646324351, which is far past Integer.MAX_VALUE. The fix is to check for overflow BEFORE each multiply-and-add rather than after: compare the not-yet-updated rev against Integer.MAX_VALUE / 10 (and the mirror bound for negatives), since rev * 10 would already have overflowed by the time you could detect it afterward. Using % and / naturally handles negative x too, because in Java both operators keep the sign of the dividend, so no special-casing of the sign is required. Casting to a wider type such as long and checking against Integer.MAX_VALUE/MIN_VALUE after the fact is an equivalent alternative, trading the pre-check arithmetic for a wider accumulator. The loop runs once per digit, so this is O(log10 x) time and O(1) space.',
    complexity: 'O(log10 x) time · O(1) space',
    code: `// Worked trace for x = 123:
//
//   x (before)   digit   rev (before)   overflow?   rev (after)   x (after)
//   ─────────────────────────────────────────────────────────────────────────
//   123          3       0              no          3             12
//   12           2       3              no          32             1
//   1            1       32             no          321            0
//
// Loop ends (x == 0). Returns 321

public int reverse(int x) {
  int rev = 0;
  // Peel one digit at a time from the back of x until nothing is left
  while (x != 0) {
    // Last digit of x; in Java, % keeps the sign of x, so negatives pop negative digits
    int digit = x % 10;
    // Drop the digit we just read; integer division truncates toward zero, matching %
    x /= 10;
    // Check BEFORE the multiply — by the time rev * 10 + digit overflows, it's too late
    // to detect. Comparing the un-updated rev against MAX/10 catches it one step early.
    if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && digit > 7)) {
      return 0;
    }
    // Mirror check for the negative side; Integer.MIN_VALUE's last digit is -8
    if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && digit < -8)) {
      return 0;
    }
    // Safe to shift rev left one decimal place and drop the new digit into the ones place
    rev = rev * 10 + digit;
  }
  return rev;
}`
  },
  {
    num: 191, lc: 9, title: 'Palindrome Number', d: 'easy', companies: ['Temu', 'Garmin'],
    bucket: 'Math & Bit Manipulation', category: 'Math · Digits',
    url: 'https://leetcode.com/problems/palindrome-number/',
    approach: 'Reverse only half the digits and compare against the half still unread, all through integer math with no string conversion. Peel the last digit off x with x % 10, feed it into a running reversed accumulator (reversed = reversed * 10 + digit), then chop x with x /= 10. Stop once x <= reversed, because at that crossover point reversed holds exactly the digits that used to be the back half of the number, so the two now line up for a direct comparison. Handling the odd-length case just means discarding the single middle digit via reversed / 10 before comparing. Negative numbers can never be palindromes because of the leading minus sign, and any positive multiple of 10 other than 0 has a trailing zero with no matching leading zero, so both are rejected up front. This beats the naive approach of building the full reversed number, which risks overflowing a 32-bit int for inputs near Integer.MAX_VALUE; reversing only half sidesteps that entirely. The equally valid alternative is converting x to a string and checking it with two pointers from both ends, trading the overflow-safety and O(1) space of the math approach for O(log x) extra space.',
    complexity: 'O(log x) time · O(1) space',
    code: `// Worked trace for x = 1221:
//
//   step   x (before)  digit   reversed (after)   x (after /= 10)   x <= reversed?
//   ────────────────────────────────────────────────────────────────────────────
//   1      1221        1       1                  122               no
//   2      122         2       12                 12                yes -> stop
//
// Loop exits with x = 12, reversed = 12 -> equal -> palindrome -> returns true

public boolean isPalindrome(int x) {
  // Negative numbers can never be palindromes: the leading '-' has no mirror digit.
  // A positive multiple of 10 (except 0 itself) has a trailing zero with no
  // matching leading zero, so it can't be a palindrome either — reject both early.
  if (x < 0 || (x % 10 == 0 && x != 0)) return false;

  int reversed = 0;
  // Peel digits off the back of x and build them into reversed from the front.
  // Stop as soon as x has shrunk to (or below) reversed: at that crossover,
  // reversed already holds exactly the digits that made up the back half of x,
  // so there's no need to reverse the whole number and risk overflow.
  while (x > reversed) {
    // Next digit off the end of the remaining number
    int digit = x % 10;
    // Shift reversed left one decimal place and append the new digit
    reversed = reversed * 10 + digit;
    // Drop the digit we just consumed
    x /= 10;
  }

  // Even-length numbers: the two halves must match exactly (x == reversed).
  // Odd-length numbers: reversed has one extra middle digit, so drop it (reversed / 10)
  // before comparing — that middle digit never needs a partner.
  return x == reversed || x == reversed / 10;
}`
  },
  {
    num: 192, lc: 66, title: 'Plus One', d: 'easy',
    bucket: 'Math & Bit Manipulation', category: 'Math · Digits',
    url: 'https://leetcode.com/problems/plus-one/',
    approach: 'Treat the array as a big-endian decimal number and add 1 using grade-school carry propagation, walking from the last digit to the first. At each position, if the digit is less than 9, incrementing it absorbs the carry completely and you can return immediately — no digit to its left is affected. Only a digit that is exactly 9 rolls over to 0 and forces the carry to keep propagating leftward, which is why the loop keeps going only in that case. The key insight is that a carry can ripple through at most a suffix of all-9s, so the loop still runs in O(n) time even though it looks like it could cascade. If the carry survives past the very first digit (the whole number was all 9s, e.g. 999 -> 1000), the digit count grows by one, which is handled as a special case by allocating a new array of length n+1 with a leading 1 and zeros elsewhere — you cannot grow the original array in place. Doing this via BigInteger or string conversion works too but wastes the O(n) space/time of parsing and re-splitting the number when direct array manipulation is already optimal.',
    complexity: 'O(n) time · O(1) extra space (O(n) only in the all-9s overflow case)',
    code: `// Worked trace for digits = [1, 2, 9]:
//
//   i   digits[i]  <9?   action                new digits
//   ────────────────────────────────────────────────────────
//   2      9        no   set 0, carry left      [1, 2, 0]
//   1      2        yes  set 3, return now      [1, 3, 0]
//
// Returns [1, 3, 0]
//
// Edge case digits = [9, 9, 9]:
//   i=2: 9 -> 0 (carry), i=1: 9 -> 0 (carry), i=0: 9 -> 0 (carry)
//   Loop exhausted with carry still pending -> overflow path
//   Allocate new int[4] = [1, 0, 0, 0]

public int[] plusOne(int[] digits) {
  int n = digits.length;
  // Walk from the least-significant digit (rightmost) toward the most-significant.
  for (int i = n - 1; i >= 0; i--) {
    // A digit under 9 simply absorbs the +1 with no further carry — done.
    if (digits[i] < 9) {
      digits[i]++;
      // Nothing left of here changes, so we can stop as soon as the carry is absorbed.
      return digits;
    }
    // digits[i] == 9: it rolls over to 0 and the carry keeps moving left.
    digits[i] = 0;
  }
  // Every digit was 9 (e.g. 999), so the carry ran off the front — the number
  // gained a new leading digit. The original array can't be resized in place,
  // so allocate one that's one slot longer; Java zero-initializes int arrays,
  // so only the leading 1 needs to be set explicitly.
  int[] result = new int[n + 1];
  result[0] = 1;
  return result;
}`
  },
  {
    num: 193, lc: 69, title: 'Sqrt(x)', d: 'easy',
    bucket: 'Math & Bit Manipulation', category: 'Math · Binary Search',
    url: 'https://leetcode.com/problems/sqrtx/',
    approach: 'Binary search over the answer space instead of computing the root directly. The candidate answers 0..x are monotonic with respect to the predicate "mid*mid <= x" — once mid grows past sqrt(x) the predicate flips from true to false and never flips back, which is exactly the shape binary search needs. Narrow the range [0, x] by testing the midpoint: if mid*mid <= x, mid is a valid (possibly non-tight) answer, so record it and move the lower bound up past mid to look for something bigger; otherwise mid overshoots and the search must move left. Tracking the best valid mid as ans and returning it after the loop converges gives the floor of the true square root without ever calling Math.sqrt. Using mid*mid risks overflowing a 32-bit int for large x (up to 2^31-1), so the multiplication is done in long to keep it safe; a linear scan upward from 0 would be correct but O(sqrt(x)) instead of O(log x). Newton\'s method is an equivalent alternative that converges even faster in practice.',
    complexity: 'O(log x) time · O(1) space',
    code: `// Worked trace for x = 8 (answer floor(sqrt(8)) = 2):
//
//   lo   hi   mid   mid*mid   <= x?   action           ans
//   ──────────────────────────────────────────────────────
//   0    8     4       16      no    hi = mid-1 = 3     0
//   0    3     1        1      yes   ans=1, lo=mid+1=2  1
//   2    3     2        4      yes   ans=2, lo=mid+1=3  2
//   3    3     3        9      no    hi = mid-1 = 2      2
//   (lo > hi, loop ends)
//
// Returns 2

public int mySqrt(int x) {
  // 0 and 1 are their own square roots; handling them here avoids an
  // awkward lo/hi setup below and keeps the general loop simple.
  if (x < 2) return x;
  // The true root of x can never exceed x itself (true only for x >= 2,
  // which is guaranteed by the guard above), so search inside [0, x].
  int lo = 0, hi = x;
  // Best candidate found so far whose square does not exceed x.
  int ans = 0;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    // mid*mid can overflow a 32-bit int when x is near Integer.MAX_VALUE,
    // so multiply as long to keep the comparison correct.
    long square = (long) mid * mid;
    if (square <= x) {
      // mid is a valid answer (maybe not the tightest) — remember it and
      // search the upper half for something closer to the true root.
      ans = mid;
      lo = mid + 1;
    } else {
      // mid overshoots x, so the root must live strictly below mid.
      hi = mid - 1;
    }
  }
  // The largest mid whose square stayed <= x is the floor of sqrt(x).
  return ans;
}`
  },
  {
    num: 194, lc: 258, title: 'Add Digits', d: 'easy', companies: ['Garmin'],
    bucket: 'Math & Bit Manipulation', category: 'Math · Digital Root',
    url: 'https://leetcode.com/problems/add-digits/',
    approach: 'The naive approach repeatedly sums the digits of num in a loop until only one digit remains, which already works in O(log n) time since each pass shrinks the number to roughly its digit count. The real insight the problem is nudging toward, though, is that repeated digit-summing computes the digital root of num, and the digital root has a closed-form O(1) formula rooted in modular arithmetic: any number is congruent to the sum of its digits modulo 9 (because 10 ≡ 1 mod 9, so each place value contributes just its digit to the remainder). That means repeating the digit-sum process converges to num mod 9, except the result must land in the range 1-9 instead of 0-8 for any positive multiple of 9, and 0 must map to 0 as a special case. Shifting to a zero-based residue with (num - 1) % 9 and then adding 1 back cleanly produces exactly that 1-9 range while leaving 0 untouched by the guard. This avoids any loop entirely, trading the already-cheap iterative digit-sum for a single arithmetic expression. The iterative "sum digits in a loop until single digit" approach remains a perfectly valid equivalent if the interviewer wants to see the mechanical process rather than the number-theory shortcut.',
    complexity: 'O(1) time · O(1) space',
    code: `// Worked trace for num = 38:
//
//   step            expression            value
//   ──────────────────────────────────────────────
//   guard           num == 0 ?             no
//   zero-based      (num - 1) % 9          (38-1)%9 = 37%9 = 1
//   shift back      1 + 1                  2
//
// Returns 2  (sanity check: 3+8=11, 1+1=2 — matches)

public int addDigits(int num) {
  // 0 is the one input whose digital root is 0, not a value in 1..9 —
  // the formula below would otherwise wrongly map it into that range.
  if (num == 0) return 0;
  // Every integer is congruent to the sum of its digits mod 9, because
  // 10 ≡ 1 (mod 9) makes each decimal place contribute only its digit
  // to the remainder. Repeated digit-summing converges to num mod 9,
  // but that residue is 0..8 while the digital root of a positive
  // number must read 1..9 (multiples of 9 have digital root 9, not 0).
  // Subtracting 1 first shifts the "9 wraps to 0" case out of the way,
  // and adding 1 back restores the correct 1..9 range.
  return 1 + (num - 1) % 9;
}`
  },
  {
    num: 195, lc: 204, title: 'Count Primes', d: 'medium', companies: ['Garmin'],
    bucket: 'Math & Bit Manipulation', category: 'Math · Sieve',
    url: 'https://leetcode.com/problems/count-primes/',
    approach: 'Sieve of Eratosthenes: instead of testing each number for primality individually (which costs O(sqrt(k)) per number and O(n·sqrt(n)) overall), flip the problem around and knock out composites in bulk. Allocate a boolean array isComposite[0..n-1], and for every i from 2 up to sqrt(n), if i itself hasn\'t already been marked composite, mark every multiple of i starting at i*i as composite. Starting the inner sweep at i*i rather than 2*i is the key optimization — any smaller multiple of i (like 2*i, 3*i, ..., (i-1)*i) already has a prime factor smaller than i, so it was already marked when that smaller factor was processed as the outer loop variable. Stopping the outer loop at sqrt(n) is valid because any composite number k < n must have at least one factor &le; sqrt(k) &le; sqrt(n); if it had no factor that small it would have to be prime. This turns the work into a harmonic-series sum (n/2 + n/3 + n/5 + ...) that totals O(n log log n), and a final pass just counts the still-unmarked indices from 2..n-1. A bitset in place of a boolean array (or the Sieve of Sundaram) is an equivalent alternative that trades a bit of code clarity for a smaller memory footprint.',
    complexity: 'O(n log log n) time · O(n) space',
    code: `// Worked trace for n = 10 (count primes strictly less than 10):
//
//   i   i*i   already composite?   multiples marked (step i, start i*i)
//   ────────────────────────────────────────────────────────────────────
//   2    4     no                  4, 6, 8            (composite[4,6,8] = true)
//   3    9     no                  9                   (composite[9] = true)
//   loop ends: i*i = 16 > n (10), outer loop stops
//
//   index:      0  1  2  3  4  5  6  7  8  9
//   composite:  F  F  F  F  T  F  T  F  T  T
//
//   Unmarked (prime) indices in [2, 9]: 2, 3, 5, 7 -> count = 4
//
// Returns 4

public int countPrimes(int n) {
  // No number below 2 is prime, so n = 0, 1, 2 all yield zero primes
  if (n < 2) return 0;
  // isComposite[k] tracks whether k has been proven non-prime; starts all false
  boolean[] isComposite = new boolean[n];
  // Only need to test potential factors up to sqrt(n) — anything larger
  // would have already been caught via its smaller co-factor.
  for (int i = 2; (long) i * i < n; i++) {
    // If i itself was already marked composite, every multiple of i
    // was necessarily marked too (by i's smaller prime factor) — skip it.
    if (isComposite[i]) continue;
    // Start marking at i*i, not 2*i: any multiple of i smaller than i*i
    // has a factor less than i, so it was already marked in an earlier iteration.
    for (int j = i * i; j < n; j += i) {
      isComposite[j] = true;
    }
  }
  // Count every index in [2, n-1] that survived without being marked composite
  int count = 0;
  for (int k = 2; k < n; k++) {
    if (!isComposite[k]) count++;
  }
  return count;
}`
  },
  {
    num: 196, lc: 231, title: 'Power of Two', d: 'easy', companies: ['Garmin'],
    bucket: 'Math & Bit Manipulation', category: 'Bit Manipulation',
    url: 'https://leetcode.com/problems/power-of-two/',
    approach: 'A power of two has exactly one bit set in its binary form (1, 10, 100, 1000, ...), so the whole problem reduces to a single-bit-set test. The classic trick is n & (n - 1): subtracting 1 from n flips the lowest set bit to 0 and turns every bit below it into 1, so ANDing with the original n clears that lowest set bit and leaves every other bit untouched. If n was a power of two, that lowest set bit was its ONLY set bit, so the AND result is 0; if n had any other bits set, the result is nonzero. The subtlety is n must be checked positive first, since n = 0 has no set bits at all (0 & -1 == 0 would wrongly pass) and negative n\'s two\'s-complement bit pattern isn\'t meaningful here. This runs in O(1) time and O(1) space with no loop at all, which beats the naive approach of repeatedly dividing n by 2 and checking the remainder (O(log n) time). An equivalent one-liner exploits that 2^31 is the largest power of two representable in a signed int and checks 1073741824 % n == 0.',
    complexity: 'O(1) time · O(1) space',
    code: `// Worked trace for n = 16:
//
//   step            binary               value
//   ──────────────────────────────────────────────
//   n               1 0000               16
//   n - 1           0 1111               15
//   n & (n - 1)     0 0000               0
//
// n > 0 and n & (n - 1) == 0 → returns true
//
// Worked trace for n = 12 (not a power of two):
//
//   step            binary               value
//   ──────────────────────────────────────────────
//   n               1100                 12
//   n - 1           1011                 11
//   n & (n - 1)     1000                 8
//
// n & (n - 1) != 0 → returns false

public boolean isPowerOfTwo(int n) {
  // Zero and negative numbers can never be a power of two; guard them before
  // the bit trick, since n = 0 would otherwise slip through as 0 & -1 == 0.
  if (n <= 0) return false;
  // n - 1 flips the lowest set bit to 0 and every bit below it to 1.
  // ANDing with n clears exactly that lowest set bit, leaving the rest intact.
  // A power of two has only ONE set bit, so clearing it must yield 0;
  // any other n has a second set bit that survives the AND as a nonzero result.
  return (n & (n - 1)) == 0;
}`
  },
  {
    num: 197, lc: 136, title: 'Single Number', d: 'easy',
    bucket: 'Math & Bit Manipulation', category: 'Bit Manipulation · XOR',
    url: 'https://leetcode.com/problems/single-number/',
    approach: 'XOR every element together in a single pass. XOR is commutative and associative, so the order of operations doesn\'t matter — the whole array reduces to one running value. Two key identities do the work: x ^ x = 0 (a value cancels itself) and x ^ 0 = x (identity element). Since every number except one appears exactly twice, all the duplicate pairs annihilate each other and only the lone value survives in the accumulator. This avoids the O(n) extra space a hash-set frequency count would need, and it beats sorting first (which would cost O(n log n) just to bring duplicates adjacent). Runs in a single O(n) pass with O(1) space and no auxiliary data structure at all. An equivalent alternative is 2 * sum(set(nums)) - sum(nums), which also isolates the singleton but needs a set and risks overflow on large inputs.',
    complexity: 'O(n) time · O(1) space',
    code: `// Worked trace for nums = [4, 1, 2, 1, 2]:
//
//   i  nums[i]  result before  result after (result ^= nums[i])
//   ──────────────────────────────────────────────────────────
//   0     4         0000              0000 ^ 0100 = 0100 (4)
//   1     1         0100              0100 ^ 0001 = 0101 (5)
//   2     2         0101              0101 ^ 0010 = 0111 (7)
//   3     1         0111              0111 ^ 0001 = 0110 (6)
//   4     2         0110              0110 ^ 0010 = 0100 (4)
//
// Returns 4

public int singleNumber(int[] nums) {
  // Start at 0, the XOR identity element (x ^ 0 == x), so it never
  // contaminates the accumulator before the first real value arrives.
  int result = 0;
  // XOR is commutative/associative, so folding left-to-right in any
  // order still lets every duplicate pair cancel itself out.
  for (int num : nums) {
    // x ^ x == 0, so each value that appears exactly twice vanishes
    // completely, leaving only the value that appears once.
    result ^= num;
  }
  // Whatever is left over is the element with no matching pair
  return result;
}`
  },
  {
    num: 198, lc: 191, title: 'Number of 1 Bits', d: 'easy', companies: ['Garmin'],
    bucket: 'Math & Bit Manipulation', category: 'Bit Manipulation',
    url: 'https://leetcode.com/problems/number-of-1-bits/',
    approach: 'Brian Kernighan\'s trick: repeatedly clear the lowest set bit with n = n & (n - 1) and count how many clears it takes until n becomes 0. Subtracting 1 flips every trailing zero to a one and flips the lowest set bit to a zero, so ANDing with the original n zeroes out exactly that one lowest set bit while leaving every higher bit untouched. That means the loop runs exactly once per set bit rather than once per bit position, so a sparse number like 0x80000000 finishes in a single iteration instead of 32. The naive alternative — shifting n right 32 times and checking bit 0 (or masking with 1 << i for each i) — always pays for every bit position even when most are zero, and in Java the arithmetic edge case to watch is that the input arrives as a signed int, so a plain n > 0 loop guard would infinite-loop on a negative (high-bit-set) value; using unsigned semantics via n != 0 with the bitwise AND sidesteps that. An equally valid alternative is Integer.bitCount(n), which the JDK implements with the same kind of bit trick under the hood, or a SWAR (SIMD-within-a-register) parallel popcount for a branch-free O(1)-ish version.',
    complexity: 'O(k) time (k = number of set bits, ≤ 32) · O(1) space',
    code: `// Worked trace for n = 11 (binary 00000000000000000000000000001011):
//
//   step   n (binary, low bits)   n-1 (binary)          n & (n-1)   count
//   ──────────────────────────────────────────────────────────────────────
//   1      ...00001011            ...00001010           ...00001010   1
//   2      ...00001010            ...00001001           ...00001000   2
//   3      ...00001000            ...00000111           ...00000000   3
//   4      ...00000000            (loop ends, n == 0)                 —
//
// Returns 3

public int hammingWeight(int n) {
  // Counts how many times we can clear a set bit before n is exhausted
  int count = 0;
  // n != 0 (not n > 0) is required: n is a signed int, so a value with the
  // sign bit set (e.g. 0x80000000) is negative, and a > 0 guard would skip
  // the loop entirely or never terminate depending on the bit pattern.
  while (n != 0) {
    // n - 1 flips the lowest set bit to 0 and every trailing zero to 1;
    // ANDing with the original n therefore clears ONLY the lowest set bit,
    // leaving all higher bits exactly as they were.
    n = n & (n - 1);
    // Each iteration clears exactly one set bit, so the loop runs
    // once per 1-bit rather than once per bit position — sparse
    // numbers finish fast instead of always costing 32 iterations.
    count++;
  }
  // Every set bit has now been cleared and counted
  return count;
}`
  },
  {
    num: 199, lc: 190, title: 'Reverse Bits', d: 'easy', companies: ['Garmin'],
    bucket: 'Math & Bit Manipulation', category: 'Bit Manipulation',
    url: 'https://leetcode.com/problems/reverse-bits/',
    approach: 'Build the result bit by bit: for each of the 32 positions, shift the accumulator left to make room, then OR in the lowest bit of the input, then shift the input right to expose its next bit. Running this loop exactly 32 times naturally reverses the order — the first bit pulled off the input (its LSB) ends up shifted all the way to the top of the result (its MSB), and the last bit pulled off (the input\'s original MSB) lands untouched at the result\'s bottom. The key insight is that no comparisons or string manipulation are needed at all: pure shifts and masks do the reordering implicitly because each iteration moves one bit exactly one position further toward the opposite end. Treating n as an unsigned 32-bit quantity matters — using >> instead of >>> would sign-extend a negative n and drag in extra 1-bits from the left, corrupting the higher positions once the sign bit is consumed. A naive alternative — converting to a 32-character binary string, reversing the string, and parsing it back — works but is far slower and more memory-heavy for no benefit. Runs in O(1) time (fixed 32 iterations) and O(1) space. An equivalent alternative divides the 32 bits into bytes, reverses each byte via a small lookup table, and reassembles them in swapped byte order — faster in practice for repeated calls but overkill for a single reversal.',
    complexity: 'O(1) time (32 iterations) · O(1) space',
    code: `// Worked trace for n = 00000000000000000000000000001011 (11 in binary, only low bits shown):
//
//   i   n before (low bits)   bit taken (n&1)  result after (low bits)   n after >>>1
//   ────────────────────────────────────────────────────────────────────────────────
//   0   ...01011               1                ...1 (bit 31)             ...0101
//   1   ...0101                1                ...11 (bits 31,30)        ...010
//   2   ...010                 0                ...110                    ...01
//   3   ...01                  1                ...1101                   ...0
//   4   ...0                   0                ...11010                  ...0
//   (bits 5..31 of n are all 0, so result just keeps shifting left with 0s appended)
//
// After all 32 iterations the four bits placed above end up as the TOP four bits
// of the result, in the order 1,1,0,1 read top-to-bottom — i.e. result's high bits
// are 1101... which is 11 reversed into the most-significant end.
// Returns 3489660928 (binary 11010000000000000000000000000000 as an unsigned int)

public int reverseBits(int n) {
    // Accumulates the reversed bits; built up one bit per loop iteration
    int result = 0;
    // Exactly 32 iterations — one per bit of a fixed-width int, no more, no less
    for (int i = 0; i < 32; i++) {
        // Make room at the bottom for the next bit by pushing everything already
        // placed one position closer to the top
        result <<= 1;
        // Pull off n's current lowest bit and drop it into the freed bottom slot.
        // Because result was just shifted, this bit lands one position higher
        // than the previous one did — building the reversal automatically.
        result |= (n & 1);
        // Unsigned right shift: MUST be >>> not >>, since n may be negative
        // (its original sign bit is just an ordinary bit here) — a signed
        // shift would sign-extend and inject spurious 1-bits from the left.
        n >>>= 1;
    }
    // After 32 rounds every original bit has migrated to its mirror position
    return result;
}`
  },
  {
    num: 200, lc: 67, title: 'Add Binary', d: 'easy',
    bucket: 'Math & Bit Manipulation', category: 'String · Binary Math',
    url: 'https://leetcode.com/problems/add-binary/',
    approach: 'Grade-school addition, but base 2 and worked right-to-left over the two input strings instead of two integers. Walk both strings from their last character toward the front with two pointers, at each step pulling out the current bit from each string (or 0 once a pointer has run past its string\'s start, since the two operands can have different lengths), summing those two bits plus the carry-in from the previous position, then emitting sum % 2 as the next output bit and carrying sum / 2 into the next position. The key insight is treating a missing digit as 0 rather than stopping the loop when one string is exhausted — that is what lets operands of unequal length line up correctly by their least-significant bit, exactly like aligning numbers on the right before adding by hand. The loop must also keep running for one extra step after both pointers pass position 0 whenever a carry is still sitting there, or a final 1 + 1 would silently drop a leading digit. Building the result with a StringBuilder and reversing once at the end avoids the O(n^2) cost of repeatedly prepending a character to an immutable String. Converting both strings to BigInteger, adding, and converting back would also work but is heavier than necessary and obscures the actual bit-carry mechanics an interviewer is checking for.',
    complexity: 'O(n) time (n = max length) · O(n) space',
    code: `// Worked trace for a = "11", b = "1":
//
//   i   j   bitA  bitB  carry(in)  sum  digit  carry(out)
//   ────────────────────────────────────────────────────
//   1   0    1     1        0       2     0        1
//   0  -1    1     0        1       2     0        1
//  -1  -2    0     0        1       1     1        0
//
// Digits emitted in order: 0, 0, 1 -> reverse -> "100"
// Returns "100"

public String addBinary(String a, String b) {
  // Build the result back-to-front, then reverse once — avoids O(n^2) String prepends
  StringBuilder result = new StringBuilder();
  // Start both pointers at the last character of each string
  int i = a.length() - 1;
  int j = b.length() - 1;
  // Carry from the previous (less significant) column
  int carry = 0;
  // Keep going while either string still has digits OR a carry is still pending —
  // stopping as soon as one pointer runs out would drop digits from the longer string,
  // and stopping as soon as both run out would drop a final carry like 1 + 1 = 10.
  while (i >= 0 || j >= 0 || carry != 0) {
    // Treat a digit past the start of its string as 0 so unequal-length operands
    // still line up correctly by their least-significant bit.
    int bitA = (i >= 0) ? a.charAt(i) - '0' : 0;
    int bitB = (j >= 0) ? b.charAt(j) - '0' : 0;
    int sum = bitA + bitB + carry;
    // The output bit is the sum mod 2, exactly like decimal addition mod 10
    result.append(sum % 2);
    // Anything beyond one bit rolls into the carry for the next column
    carry = sum / 2;
    // Move both pointers one column to the left (toward more significant bits)
    i--;
    j--;
  }
  // Digits were appended least-significant-first, so reverse to restore normal order
  return result.reverse().toString();
}`
  },
  {
    num: 223, lc: 2235, title: 'Add Two Integers', d: 'easy',
    bucket: 'Math & Bit Manipulation', category: 'Math · Basics',
    url: 'https://leetcode.com/problems/add-two-integers/',
    approach: 'A deliberate warm-up: return the sum. It appears in real screens as the very first question of a session — used to confirm the editor compiles and runs before anything substantive starts — so the only wrong move is over-thinking it. No overflow guard is required because the stated range is -100 to 100 on both operands, which is nowhere near the int limits; adding a long cast or a Math.addExact would be noise. If an interviewer follows it up, the natural extension is the bitwise version: XOR gives the sum of each column ignoring carries, AND shifted left by one gives exactly the carries, and repeating until the carry is zero performs addition without the + operator — that is the shape LeetCode 371 asks for directly. Worth knowing, but not what this problem is testing.',
    complexity: 'O(1) time · O(1) space',
    code: `// num1 = 12, num2 = 5  ->  17
//
// Bitwise variant, if asked to add without '+' (this is LeetCode 371):
//
//   public int add(int a, int b) {
//     while (b != 0) {
//       int carry = (a & b) << 1;   // columns where both bits are set
//       a = a ^ b;                  // sum ignoring carries
//       b = carry;                  // fold the carries back in
//     }
//     return a;
//   }

public int sum(int num1, int num2) {
  // Both operands are constrained to [-100, 100], so int arithmetic cannot
  // overflow here — a long cast or Math.addExact would be pure ceremony.
  return num1 + num2;
}`
  },
  {
    num: 224, lc: 1492, title: 'The kth Factor of n', d: 'medium',
    bucket: 'Math & Bit Manipulation', category: 'Math · Divisors',
    url: 'https://leetcode.com/problems/the-kth-factor-of-n/',
    approach: 'Divisors come in pairs — whenever d divides n, so does n/d — and exactly one member of each pair is at most the square root. Walking d from 1 up to sqrt(n) therefore enumerates the small half of every pair in ascending order, and walking the same range back down while emitting n/d enumerates the large half, also in ascending order. Two phases over a sqrt(n) range thus produce every divisor in sorted order without collecting them, which is the whole point: the naive scan of 1..n is O(n) and the sort-a-list approach costs O(sqrt(n) log n) plus the allocation. The one trap is the perfect square, where d and n/d coincide: the loop must not emit the square root twice, so the descent skips it explicitly. Positioning the descent also needs care — the ascent leaves d one past the boundary, so it is stepped back once before the square check. Returning -1 falls out naturally when the counter never reaches k, meaning n has fewer than k divisors. Using (long) d * d rather than d <= n / d avoids both integer overflow and a division inside the loop condition.',
    complexity: 'O(sqrt(n)) time · O(1) space',
    code: `// Worked trace for n = 12, k = 5   (divisors: 1, 2, 3, 4, 6, 12)
//
//   phase 1 — ascend d while d*d <= 12
//     d=1  divides   count 1
//     d=2  divides   count 2
//     d=3  divides   count 3
//     d=4  16 > 12   stop, loop leaves d = 4
//
//   phase 2 — step back to d = 3 (not a perfect square, no extra skip),
//             descend and emit the partner n/d
//     d=3  emit 12/3 = 4    count 4
//     d=2  emit 12/2 = 6    count 5 == k  -> return 6
//
// Returns 6

public int kthFactor(int n, int k) {
  int count = 0;
  int d = 1;

  // Phase 1 — the small half of every divisor pair, already in ascending order
  for (; (long) d * d <= n; d++) {
    // (long) d * d rather than d <= n / d: no overflow, and no division
    // executed on every iteration of the loop condition.
    if (n % d == 0 && ++count == k) {
      return d;
    }
  }

  // The loop exited one step past the boundary — walk back onto it
  d--;
  // Perfect square: d and n/d are the same number, already counted in phase 1
  if ((long) d * d == n) {
    d--;
  }

  // Phase 2 — descending d emits the large partners n/d in ASCENDING order,
  // continuing the sorted enumeration without ever building a list.
  for (; d >= 1; d--) {
    if (n % d == 0 && ++count == k) {
      return n / d;
    }
  }

  // Fewer than k divisors exist
  return -1;
}`
  },
  {
    num: 225, lc: 273, title: 'Integer to English Words', d: 'hard',
    bucket: 'Math & Bit Manipulation', category: 'String · Recursion',
    url: 'https://leetcode.com/problems/integer-to-english-words/',
    approach: 'English number names repeat every three digits, so the number is chopped into groups of a thousand and each group is spelled with one shared helper, then labelled Thousand / Million / Billion by its position. That decomposition is what keeps a notoriously fiddly problem short: the helper only ever handles 1 to 999, and everything above that is a loop plus a label table. Inside the helper there are three tiers — values below twenty are irregular and must come from a lookup table (there is no rule that produces "twelve" or "fifteen"), values below a hundred are a tens word plus an optional units word, and anything larger is a hundreds word followed by recursion on the remainder. The details that generate wrong answers are all about empty pieces: a group that is entirely zero must contribute no words at all (so 1,000,007 reads "One Million Seven", never "One Million Zero Thousand Seven"), and the trailing units or remainder is only appended when non-zero, or stray spaces appear. Zero itself is handled up front because the main loop never runs for it. Groups are prepended rather than appended since the number is consumed from the least significant end.',
    complexity: 'O(1) time · O(1) space (input is bounded by 2^31 − 1)',
    code: `// Worked trace for num = 1234567
//
//   iteration   chunk   three(chunk)                  label      accumulated
//   ─────────────────────────────────────────────────────────────────────────
//   1           567     "Five Hundred Sixty Seven"    -          "Five Hundred Sixty Seven"
//   2           234     "Two Hundred Thirty Four"     Thousand   "Two Hundred Thirty Four Thousand
//                                                                 Five Hundred Sixty Seven"
//   3           1       "One"                         Million    "One Million Two Hundred Thirty
//                                                                 Four Thousand Five Hundred Sixty Seven"
//
// Returns "One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven"

// Index 0 is unused so the arrays can be addressed by the value itself.
// Everything below twenty is irregular — no rule generates "Twelve" or "Fifteen".
private static final String[] BELOW_20 = {
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
};
private static final String[] TENS = {
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
};
private static final String[] GROUPS = {"", "Thousand", "Million", "Billion"};

public String numberToWords(int num) {
  // The loop below never runs for 0, so it needs its own answer
  if (num == 0) {
    return "Zero";
  }

  StringBuilder out = new StringBuilder();
  int group = 0;
  while (num > 0) {
    int chunk = num % 1000;
    // An all-zero group contributes NOTHING — this is what keeps 1000007 from
    // rendering as "One Million Zero Thousand Seven".
    if (chunk != 0) {
      String words = three(chunk);
      if (!GROUPS[group].isEmpty()) {
        words += " " + GROUPS[group];
      }
      // Digits are consumed least-significant first, so each new group goes
      // in FRONT of what has been built so far.
      out.insert(0, out.length() == 0 ? words : words + " ");
    }
    num /= 1000;
    group++;
  }
  return out.toString();
}

/** Spell a value in 1..999. Returns "" for 0 so callers can concatenate freely. */
private String three(int n) {
  if (n == 0) {
    return "";
  }
  if (n < 20) {
    return BELOW_20[n];
  }
  if (n < 100) {
    // Append the units word only when non-zero, or "Forty" becomes "Forty "
    return TENS[n / 10] + (n % 10 != 0 ? " " + BELOW_20[n % 10] : "");
  }
  // Hundreds, then recurse on whatever is left below 100
  return BELOW_20[n / 100] + " Hundred" + (n % 100 != 0 ? " " + three(n % 100) : "");
}`
  },
];

// Publicly reported/company-tagged interview-question snapshot reviewed
// 2026-07-17; TikTok and ByteDance added 2026-08-06. These are matches against
// this site's existing 200 problems, not official guarantees about any
// company's current interview loop.
//
// TikTok and ByteDance are tagged separately rather than merged: the two
// reported lists overlap on almost nothing, so collapsing them would hide
// which product's loop a problem actually came from. Problems 201-225 were
// added on 2026-08-06 specifically because they appear on those two reported
// lists and had no entry here yet — six of them are LeetCode premium-only, so
// their descriptions.js paraphrases are the only statement the page can show.
//
// Sources:
//   interviewsolver.com/interview-questions/costar-group
//   interviewsolver.com/interview-questions/walmart-labs
//   interviewsolver.com/interview-questions/amazon
//   interviewsolver.com/interview-questions/the-home-depot
//   interviewsolver.com/interview-questions/lowes
//   interviewsolver.com/interview-questions/doordash
//   interviewsolver.com/interview-questions/tiktok
//   interviewsolver.com/interview-questions/bytedance
//
// CATL (宁德时代) entries reviewed 2026-08-01, from Chinese campus-hiring
// reports: a Nowcoder software-engineer report (LC 25 asked as second-round
// live coding) and a CSDN 数智化开发工程师 written-test report dated 2022-08-01
// (LC 70 跳台阶 and LC 64 最小路径和 among its three programming problems) —
// blog.csdn.net/qq_42386788/article/details/126110003
{
  const companyProblemNums = {
    CATL: [95, 153, 182],
    CoStar: [15, 25, 39, 56, 71, 85, 97, 150, 177],
    Walmart: [5, 7, 45, 47, 56, 66, 84, 85, 88, 104, 134, 148, 155, 166],
    Amazon: [
      1, 2, 5, 6, 7, 8, 9, 11, 16, 17, 21, 23, 24, 25, 27, 28, 30, 31, 32,
      36, 39, 42, 43, 45, 47, 48, 49, 50, 53, 56, 63, 70, 74, 75, 77, 80,
      81, 82, 84, 86, 88, 89, 94, 95, 96, 98, 100, 102, 104, 110, 111, 118,
      119, 120, 130, 134, 141, 147, 148, 150, 153, 155, 163, 170, 182, 190,
      191,
    ],
    'Home Depot': [21, 24, 33, 50, 88, 97, 111, 128, 146, 163, 168],
    "Lowe's": [
      4, 5, 9, 11, 13, 14, 27, 36, 56, 66, 79, 80, 88, 110, 116, 123, 126,
      131, 141, 146, 148, 155, 159, 192, 193,
    ],
    DoorDash: [4, 9, 26, 57, 102, 111, 126, 142, 144, 192],
    TikTok: [
      26, 31, 35, 98, 102, 110, 111, 121, 126, 141, 148, 201, 202, 203, 204,
      205, 206, 213, 216, 217, 218, 219, 220, 221, 222, 223, 224,
    ],
    ByteDance: [
      11, 13, 14, 18, 83, 99, 123, 127, 131, 135, 142, 145, 207, 208, 209,
      210, 211, 212, 214, 215, 223, 225,
    ],
  };
  const problemsByNum = new Map(leetcode.map(problem => [problem.num, problem]));

  for (const [company, nums] of Object.entries(companyProblemNums)) {
    for (const num of nums) {
      const problem = problemsByNum.get(num);
      if (!problem) continue;
      problem.companies = [...new Set([...(problem.companies || []), company])];
    }
  }
}
