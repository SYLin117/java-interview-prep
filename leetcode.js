// Top 100 popular LeetCode interview questions with idiomatic Java solutions.
// Loaded as a classic <script src="leetcode.js"></script> — 'leetcode' becomes
// available to the inline renderer in index.html.
//
// Each entry has a 'bucket' field for the high-level grouping (used to render
// section headers in the table) and a 'category' field for the per-row tag.
// Entries are pre-sorted by bucket in display order; 'num' is the display
// number (1..100) in that order.
//
// Shared node definitions assumed by the tree/linked-list/graph solutions:
//   class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }
//   class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }
//   class Node     { int val; Node next; Node random; List<Node> neighbors; ... }

const leetcode = [
  // ─── Arrays & Hashing (20) ───
  {
    num: 111, title: 'Longest Common Prefix', d: 'easy', companies: ['Garmin'],
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
    num: 115, title: 'FizzBuzz', d: 'easy', companies: ['Garmin'],
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
    num: 1, title: 'Two Sum', d: 'easy', companies: ['Temu', 'Garmin'],
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
    num: 2, title: 'Best Time to Buy and Sell Stock', d: 'easy', companies: ['Garmin'],
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
    num: 3, title: 'Contains Duplicate', d: 'easy', companies: ['Garmin'],
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
    num: 4, title: 'Valid Anagram', d: 'easy', companies: ['Garmin'],
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
    num: 5, title: 'Group Anagrams', d: 'medium', companies: ['Garmin'],
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
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
  }
  // The buckets themselves are the answer; keys are no longer needed
  return new ArrayList<>(groups.values());
}`
  },
  {
    num: 6, title: 'Top K Frequent Elements', d: 'medium',
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
    num: 7, title: 'Product of Array Except Self', d: 'medium', companies: ['Garmin'],
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
    num: 8, title: 'Valid Sudoku', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Set',
    url: 'https://leetcode.com/problems/valid-sudoku/',
    approach: 'Single-pass hashing with encoded keys. Insight: a digit is invalid only if it collides on one of three axes &mdash; its row, its column, or its 3×3 box. Instead of three separate structures, build a string key that bundles the value with which constraint it occupies (e.g. \'5 row 0\', \'5 col 4\', \'5 box 0-1\') and drop all three into one shared HashSet. HashSet.add returns false when the element is already present, so the first false flags a duplicate and we return immediately. The box is identified by integer-dividing row and column by 3. Because the board is a fixed 9×9 = 81 cells, both time and space are O(1); the keys just avoid index-juggling bugs.',
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
    num: 9, title: 'Longest Consecutive Sequence', d: 'medium',
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
    num: 10, title: 'Encode and Decode Strings', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'String · Design',
    url: 'https://leetcode.com/problems/encode-and-decode-strings/',
    approach: 'Length-prefix (netstring-style) framing. The insight is that no single delimiter character is safe because the payload can contain it, so instead each string is encoded as its length, a \'#\' separator, then the literal string: \'5#hello\'. The decoder reads digits until the \'#\', parses them as a count, then blindly copies exactly that many characters &mdash; so \'#\' or digits inside the payload are never misread as structure. This handles empty strings (\'0#\') and any character set unambiguously, which a plain split-on-delimiter approach cannot. Encoding and decoding are each one linear scan, O(n) time over the total character count, with O(n) space for the produced output.',
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
    num: 11, title: 'Maximum Subarray', d: 'medium', companies: ['Temu', 'Garmin'],
    bucket: 'Arrays & Hashing', category: 'Array · DP (Kadane)',
    url: 'https://leetcode.com/problems/maximum-subarray/',
    approach: 'Kadane\'s algorithm &mdash; a one-pass dynamic program. Define current = the max sum of a subarray that must END at index i. The recurrence is current = max(nums[i], current + nums[i]): extending the previous run is worthwhile only while that run\'s sum stays positive; the moment it would drag nums[i] down, we discard it and restart fresh at nums[i]. \'best\' tracks the largest current ever seen, the global answer. Correct because any optimal subarray ends at some index, and current holds the best subarray ending there. Seeding both with nums[0] handles all-negative inputs (returns the least-negative element). Time O(n) one pass; space O(1), beating the O(n²) brute force.',
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
    num: 12, title: 'Maximum Product Subarray', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · DP',
    url: 'https://leetcode.com/problems/maximum-product-subarray/',
    approach: 'Kadane-style DP tracking BOTH the max and the min product ending at i. The core insight: multiplication by a negative number swaps extremes &mdash; the largest product can become the smallest and vice versa &mdash; so a big negative min is a candidate future maximum once another negative arrives. When nums[i] is negative we swap max and min before updating. Each then becomes either a fresh start at nums[i] or an extension of the running product (max*n or min*n), which also naturally resets at zeros since 0 makes both products 0. \'best\' records the running maximum. Tracking only the max would fail on inputs like [-2,3,-4]. Time O(n) one pass; space O(1) with three scalars.',
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
    num: 13, title: 'Move Zeroes', d: 'easy', companies: ['Garmin'],
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
    num: 14, title: 'Sort Colors', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Dutch National Flag',
    url: 'https://leetcode.com/problems/sort-colors/',
    approach: 'Dutch National Flag algorithm (Dijkstra), a three-way one-pass partition. Maintain three pointers: lo (boundary after the 0-zone), hi (boundary before the 2-zone), and mid (the scanner). Invariant: everything before lo is 0, everything in [lo, mid) is 1, everything after hi is 2, and [mid, hi] is unprocessed. When nums[mid] is 0, swap it to lo and advance both lo and mid (the swapped-in value was already a processed 1). When it\'s 2, swap it to hi and decrement hi only &mdash; do NOT advance mid, since the value swapped in from hi is unexamined. When it\'s 1, just advance mid. The loop ends when mid passes hi. Time O(n) one pass; space O(1), beating a two-pass count sort.',
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
    num: 15, title: 'First Missing Positive', d: 'hard',
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
    num: 16, title: 'Merge Intervals', d: 'medium', companies: ['Temu', 'Garmin'],
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
    num: 17, title: 'Spiral Matrix', d: 'medium', companies: ['Temu'],
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
    num: 18, title: 'Rotate Image', d: 'medium', companies: ['Temu'],
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

  // ─── Two Pointers (6) ───
  {
    num: 19, title: 'Valid Palindrome', d: 'easy', companies: ['Garmin'],
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
    num: 20, title: 'Two Sum II - Input Array Is Sorted', d: 'medium',
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
    num: 21, title: '3Sum', d: 'medium', companies: ['Garmin'],
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
    num: 22, title: 'Container With Most Water', d: 'medium', companies: ['Garmin'],
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
    num: 23, title: 'Trapping Rain Water', d: 'hard',
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
    num: 24, title: 'Remove Duplicates from Sorted Array', d: 'easy',
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

  // ─── Sliding Window (8) ───
  {
    num: 114, title: 'Minimum Size Subarray Sum', d: 'medium', companies: ['Garmin'],
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
    num: 25, title: 'Longest Substring Without Repeating Characters', d: 'medium', companies: ['Garmin'],
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
    num: 26, title: 'Longest Repeating Character Replacement', d: 'medium', companies: ['Garmin'],
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
    num: 27, title: 'Minimum Window Substring', d: 'hard',
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
    num: 28, title: 'Best Time to Buy and Sell Stock II', d: 'medium',
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
    num: 29, title: 'Permutation in String', d: 'medium',
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
    num: 30, title: 'Subarray Sum Equals K', d: 'medium', companies: ['Temu'],
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
    prefixCount.merge(sum, 1, Integer::sum);   // record this prefix for future lookups
  }
  return count;
}`
  },
  {
    num: 31, title: 'Sliding Window Maximum', d: 'hard', companies: ['Temu'],
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

  // ─── Stack (6) ───
  {
    num: 32, title: 'Valid Parentheses', d: 'easy',
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
    num: 33, title: 'Min Stack', d: 'medium',
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
    num: 34, title: 'Evaluate Reverse Polish Notation', d: 'medium',
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
    num: 35, title: 'Daily Temperatures', d: 'medium',
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
    num: 36, title: 'Largest Rectangle in Histogram', d: 'hard',
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
    num: 37, title: 'Decode String', d: 'medium', companies: ['Temu'],
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

  // ─── Binary Search (6) ───
  {
    num: 38, title: 'Binary Search', d: 'easy',
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
    num: 39, title: 'Search in Rotated Sorted Array', d: 'medium',
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
    num: 40, title: 'Find Minimum in Rotated Sorted Array', d: 'medium',
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
    num: 41, title: 'First Bad Version', d: 'easy',
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
    num: 42, title: 'Median of Two Sorted Arrays', d: 'hard',
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
    num: 43, title: 'Pow(x, n)', d: 'medium', companies: ['Temu'],
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

  // ─── Linked List (11) ───
  {
    num: 44, title: 'Reverse Linked List', d: 'easy', companies: ['Garmin'],
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
    num: 45, title: 'Merge Two Sorted Lists', d: 'easy', companies: ['Temu'],
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
    num: 46, title: 'Linked List Cycle', d: 'easy',
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
    num: 47, title: 'Remove Nth Node From End of List', d: 'medium',
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
    num: 48, title: 'Merge K Sorted Lists', d: 'hard',
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
    num: 49, title: 'Add Two Numbers', d: 'medium',
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
    num: 50, title: 'Copy List with Random Pointer', d: 'medium',
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
    num: 51, title: 'Reorder List', d: 'medium',
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
    num: 52, title: 'Find the Duplicate Number', d: 'medium',
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
    num: 53, title: 'LRU Cache', d: 'medium', companies: ['Temu'],
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
    num: 54, title: 'Sort List', d: 'medium', companies: ['Temu'],
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

  // ─── Trees (17) ───
  {
    num: 55, title: 'Invert Binary Tree', d: 'easy',
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
    num: 56, title: 'Maximum Depth of Binary Tree', d: 'easy',
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
    num: 57, title: 'Same Tree', d: 'easy',
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
    num: 58, title: 'Subtree of Another Tree', d: 'easy',
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
    num: 59, title: 'Path Sum', d: 'easy',
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
    num: 60, title: 'Balanced Binary Tree', d: 'easy',
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
    num: 61, title: 'Symmetric Tree', d: 'easy',
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
    num: 62, title: 'Binary Tree Level Order Traversal', d: 'medium',
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
    num: 63, title: 'Binary Tree Right Side View', d: 'medium',
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
    num: 64, title: 'Validate Binary Search Tree', d: 'medium',
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
    num: 65, title: 'Kth Smallest Element in a BST', d: 'medium',
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
    num: 66, title: 'Lowest Common Ancestor of BST', d: 'easy',
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
    num: 67, title: 'Construct Binary Tree from Preorder and Inorder', d: 'medium', companies: ['Temu'],
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
    num: 68, title: 'Binary Tree Maximum Path Sum', d: 'hard',
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
    num: 69, title: 'Serialize and Deserialize Binary Tree', d: 'hard',
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
    num: 70, title: 'Lowest Common Ancestor of a Binary Tree', d: 'medium', companies: ['Temu'],
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
    num: 71, title: 'Diameter of Binary Tree', d: 'easy', companies: ['Temu'],
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

  // ─── Tries (3) ───
  {
    num: 112, title: 'Search Suggestions System', d: 'medium', companies: ['Garmin'],
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
    num: 72, title: 'Implement Trie (Prefix Tree)', d: 'medium',
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
    num: 73, title: 'Design Add and Search Words Data Structure', d: 'medium',
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

  // ─── Heap / Priority Queue (4) ───
  {
    num: 74, title: 'Kth Largest Element in an Array', d: 'medium',
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
    num: 75, title: 'Find Median from Data Stream', d: 'hard',
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
    num: 76, title: 'Kth Smallest Element in a Sorted Matrix', d: 'medium',
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
    num: 77, title: 'Reorganize String', d: 'medium',
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

  // ─── Backtracking (6) ───
  {
    num: 78, title: 'Subsets', d: 'medium',
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
    num: 79, title: 'Permutations', d: 'medium',
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
    num: 80, title: 'Combination Sum', d: 'medium',
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
    num: 81, title: 'Letter Combinations of a Phone Number', d: 'medium',
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
    num: 82, title: 'Generate Parentheses', d: 'medium',
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
    num: 83, title: 'N-Queens', d: 'hard',
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

  // ─── Graphs (8) ───
  {
    num: 84, title: 'Number of Islands', d: 'medium',
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
    num: 85, title: 'Clone Graph', d: 'medium',
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
    num: 86, title: 'Course Schedule', d: 'medium',
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
    num: 87, title: 'Pacific Atlantic Water Flow', d: 'medium',
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
    num: 88, title: 'Rotting Oranges', d: 'medium',
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
    num: 89, title: 'Word Search', d: 'medium',
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
    num: 90, title: 'Walls and Gates', d: 'medium',
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
    num: 91, title: 'Surrounded Regions', d: 'medium',
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

  // ─── Advanced Graphs (4) ───
  {
    num: 113, title: 'Rank Transform of a Matrix', d: 'hard', companies: ['Garmin'],
    bucket: 'Advanced Graphs', category: 'Union-Find · Sort',
    url: 'https://leetcode.com/problems/rank-transform-of-a-matrix/',
    approach: 'Greedy by value with union-find. Process distinct values in ascending order so that once a rank is assigned it is never beaten by a larger value. For a fixed value, cells in the same row or column that share that value must get the same rank, so union them: model each of the m rows as a node 0..m-1 and each of the n columns as a node m..m+n-1, then union row i with column j for every cell (i,j) of that value. Each connected group&apos;s rank is 1 plus the maximum rank already used on any row or column it touches (tracked by rowRank/colRank high-water arrays). Writing the group rank and raising those marks keeps the < constraint intact. Sorting dominates: O(m·n·log(m·n)) time, O(m·n) space.',
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
    num: 92, title: 'Network Delay Time', d: 'medium',
    bucket: 'Advanced Graphs', category: 'Dijkstra',
    url: 'https://leetcode.com/problems/network-delay-time/',
    approach: 'Single-source shortest paths with Dijkstra&apos;s algorithm. The latest a node hears the signal equals its shortest-path distance from k, so the answer is the maximum of those distances. Use a min-heap keyed by tentative distance: repeatedly pop the closest unsettled node, and because all weights are non-negative the first time a node is popped its distance is final (the greedy invariant). Relax each outgoing edge, pushing improved distances. A lazy-deletion check (skip when the popped distance is staler than dist[u]) avoids a decrease-key structure. If any node stays at infinity it is unreachable, so return −1; otherwise return the max distance. With E edges and V nodes this is O(E log V) time and O(V + E) space.',
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
  for (int[] t : times)
    graph.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{ t[1], t[2] });

  // Dijkstra: shortest distances from source k. MAX_VALUE = "not yet reached".
  int[] dist = new int[n + 1];
  Arrays.fill(dist, Integer.MAX_VALUE);
  dist[k] = 0;
  // Min-heap keyed by current best distance → always expand the closest node
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
    num: 93, title: 'Reconstruct Itinerary', d: 'hard',
    bucket: 'Advanced Graphs', category: 'Eulerian Path (Hierholzer)',
    url: 'https://leetcode.com/problems/reconstruct-itinerary/',
    approach: 'Eulerian path via Hierholzer&apos;s algorithm. Treat airports as nodes and tickets as directed edges; using every ticket once is exactly walking every edge once. Store each airport&apos;s destinations in a min-heap so the lexicographically smallest unused flight is always taken first, which yields the smallest valid itinerary. Walk greedily until you hit a dead end (no unused outgoing edge); that airport must be the final stop of the current segment, so add it to the FRONT of the route and backtrack via the stack. Because edges are only consumed once, the route is built in reverse post-order and ends up correctly ordered. The naive backtracking search over all orderings is exponential; this is O(E log E) time (heap ops) and O(E) space.',
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
    num: 94, title: 'Word Ladder', d: 'hard',
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

  // ─── Dynamic Programming - 1D (10) ───
  {
    num: 95, title: 'Climbing Stairs', d: 'easy',
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
    num: 96, title: 'House Robber', d: 'medium', companies: ['Temu'],
    bucket: 'Dynamic Programming - 1D', category: 'DP',
    url: 'https://leetcode.com/problems/house-robber/',
    approach: 'One-dimensional dynamic programming. For each house you make a binary choice: skip it and keep the best total through the previous house, or rob it and add its loot to the best total through the house two positions back (skipping the immediate neighbor to respect the no-adjacent rule). That gives dp[i] = max(dp[i−1], dp[i−2] + nums[i]); the max guarantees optimality because both feasible options are considered at every step. Each state only needs the two prior results, so two rolling variables replace the array — O(n) time, O(1) space. A greedy &apos;take every other house&apos; heuristic fails (e.g. [2,1,1,2]), which is why DP is required.',
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
    num: 97, title: 'House Robber II', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · Circular',
    url: 'https://leetcode.com/problems/house-robber-ii/',
    approach: 'Reduce the circular problem to the linear House Robber by case-splitting on the awkward first/last adjacency. Since houses 0 and n−1 are now neighbors, any valid plan robs at most one of them, so the optimum is the better of two independent linear runs: one over indices [0 .. n−2] (forbidding the last house) and one over [1 .. n−1] (forbidding the first). Each run is the standard O(n) two-variable DP dp[i] = max(dp[i−1], dp[i−2]+nums[i]). Taking the max of the two covers every feasible selection while never robbing both ends. Total is O(n) time, O(1) space. Edge case: a single house has no &apos;circle&apos;, so return nums[0] directly to avoid an empty range.',
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
    num: 98, title: 'Coin Change', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'Unbounded Knapsack',
    url: 'https://leetcode.com/problems/coin-change/',
    approach: 'Bottom-up dynamic programming — the unbounded knapsack pattern. Let dp[i] be the fewest coins that sum to i. Build it from 0 upward: for each amount i, try every coin c and consider 1 + dp[i−c], because making i can end with a final coin c laid on top of an optimal way to make i−c. Taking the minimum over all coins yields the optimum for i (optimal substructure). Coins may repeat, so unlike 0/1 knapsack every denomination is available at every amount. Initialize entries to a sentinel (amount+1, larger than any real answer) so unreachable amounts stay flagged, with dp[0]=0 as the base. The result is dp[amount], or −1 if still at the sentinel. Runtime is O(amount · |coins|), space O(amount). A greedy &apos;largest coin first&apos; approach is wrong (e.g. coins [1,3,4], amount 6).',
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
    num: 99, title: 'Longest Increasing Subsequence', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · Binary Search',
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    approach: 'Patience-sorting with binary search. Maintain a list &apos;tails&apos; where tails[k] is the smallest possible tail value of any increasing subsequence of length k+1. For each number, binary-search for its lower-bound position: if it is larger than every tail it extends the longest run (append), otherwise it overwrites the first tail ≥ it, keeping that length achievable with a smaller, more extensible tail. Because each tail is the minimal possible end value, replacing greedily never reduces the answer and opens better future options. Note tails is NOT the actual subsequence — only its LENGTH is meaningful. Each element costs one O(log n) search, giving O(n log n) time and O(n) space, beating the classic O(n²) dp[i] = 1 + max(dp[j]) formulation.',
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
    num: 100, title: 'Word Break', d: 'medium',
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
    num: 101, title: 'Decode Ways', d: 'medium',
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
    num: 102, title: 'Jump Game', d: 'medium',
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
    num: 103, title: 'Jump Game II', d: 'medium',
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
    num: 104, title: 'Longest Palindromic Substring', d: 'medium',
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

  // ─── Dynamic Programming - 2D (5) ───
  {
    num: 105, title: 'Unique Paths', d: 'medium',
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
    num: 106, title: 'Longest Common Subsequence', d: 'medium',
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
    num: 107, title: 'Edit Distance', d: 'hard',
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
    num: 108, title: 'Partition Equal Subset Sum', d: 'medium',
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
    num: 109, title: 'Maximal Square', d: 'medium',
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

  // ─── Greedy (1) ───
  {
    num: 110, title: 'Gas Station', d: 'medium',
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
  }
];
