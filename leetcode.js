// Top 100 popular LeetCode interview questions with idiomatic Java solutions.
// Loaded as a classic <script src="leetcode.js"></script> — `leetcode` becomes
// available to the inline renderer in index.html.
//
// Each entry has a `bucket` field for the high-level grouping (used to render
// section headers in the table) and a `category` field for the per-row tag.
// Entries are pre-sorted by bucket in display order; `num` is the display
// number (1..100) in that order.
//
// Shared node definitions assumed by the tree/linked-list/graph solutions:
//   class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }
//   class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }
//   class Node     { int val; Node next; Node random; List<Node> neighbors; ... }

const leetcode = [
  // ─── Arrays & Hashing (15) ───
  {
    num: 1, title: 'Two Sum', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Map',
    url: 'https://leetcode.com/problems/two-sum/',
    approach: 'One-pass hash map: for each element, check if its complement (target - num) is already in the map. If yes, return both indices; otherwise, store this index.',
    complexity: 'O(n) time · O(n) space',
    code: `public int[] twoSum(int[] nums, int target) {
  Map<Integer, Integer> seen = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) {
      return new int[]{ seen.get(complement), i };
    }
    seen.put(nums[i], i);
  }
  return new int[0];
}`
  },
  {
    num: 2, title: 'Best Time to Buy and Sell Stock', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Array · Greedy',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    approach: 'Track the minimum price seen so far. For each day, update the best profit as price minus that min.',
    complexity: 'O(n) time · O(1) space',
    code: `public int maxProfit(int[] prices) {
  int minPrice = Integer.MAX_VALUE, best = 0;
  for (int p : prices) {
    if (p < minPrice) minPrice = p;
    else best = Math.max(best, p - minPrice);
  }
  return best;
}`
  },
  {
    num: 3, title: 'Contains Duplicate', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Set',
    url: 'https://leetcode.com/problems/contains-duplicate/',
    approach: 'Hash set: add as you go; if .add() returns false, you have a duplicate.',
    complexity: 'O(n) time · O(n) space',
    code: `public boolean containsDuplicate(int[] nums) {
  Set<Integer> seen = new HashSet<>();
  for (int n : nums) {
    if (!seen.add(n)) return true;
  }
  return false;
}`
  },
  {
    num: 4, title: 'Valid Anagram', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'String · Hash Map',
    url: 'https://leetcode.com/problems/valid-anagram/',
    approach: 'Count characters in one string, decrement in the other, check all counts are zero. For ASCII-only inputs an int[26] is faster than a HashMap.',
    complexity: 'O(n) time · O(1) space (fixed alphabet)',
    code: `public boolean isAnagram(String s, String t) {
  if (s.length() != t.length()) return false;
  int[] count = new int[26];
  for (int i = 0; i < s.length(); i++) {
    count[s.charAt(i) - 'a']++;
    count[t.charAt(i) - 'a']--;
  }
  for (int c : count) if (c != 0) return false;
  return true;
}`
  },
  {
    num: 5, title: 'Group Anagrams', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'String · Hash Map',
    url: 'https://leetcode.com/problems/group-anagrams/',
    approach: 'Group by a canonical key — either the sorted string or a 26-char count signature.',
    complexity: 'O(n · k log k) time · O(n · k) space',
    code: `public List<List<String>> groupAnagrams(String[] strs) {
  Map<String, List<String>> groups = new HashMap<>();
  for (String s : strs) {
    char[] chars = s.toCharArray();
    Arrays.sort(chars);
    String key = new String(chars);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
  }
  return new ArrayList<>(groups.values());
}`
  },
  {
    num: 6, title: 'Top K Frequent Elements', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Bucket Sort',
    url: 'https://leetcode.com/problems/top-k-frequent-elements/',
    approach: 'Count frequencies, then bucket-sort: index = frequency. Walk buckets from high to low. O(n) — beats the O(n log k) heap solution.',
    complexity: 'O(n) time · O(n) space',
    code: `public int[] topKFrequent(int[] nums, int k) {
  Map<Integer, Integer> freq = new HashMap<>();
  for (int n : nums) freq.merge(n, 1, Integer::sum);

  List<Integer>[] buckets = new List[nums.length + 1];
  for (var e : freq.entrySet()) {
    int f = e.getValue();
    if (buckets[f] == null) buckets[f] = new ArrayList<>();
    buckets[f].add(e.getKey());
  }

  int[] out = new int[k];
  int idx = 0;
  for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
    if (buckets[i] == null) continue;
    for (int n : buckets[i]) { out[idx++] = n; if (idx == k) break; }
  }
  return out;
}`
  },
  {
    num: 7, title: 'Product of Array Except Self', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Prefix Product',
    url: 'https://leetcode.com/problems/product-of-array-except-self/',
    approach: 'Two passes without division. First pass: result[i] = product of all elements to the LEFT. Second pass: multiply by product of elements to the RIGHT.',
    complexity: 'O(n) time · O(1) extra space (output not counted)',
    code: `public int[] productExceptSelf(int[] nums) {
  int n = nums.length;
  int[] out = new int[n];
  out[0] = 1;
  for (int i = 1; i < n; i++) out[i] = out[i-1] * nums[i-1];

  int right = 1;
  for (int i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}`
  },
  {
    num: 8, title: 'Valid Sudoku', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Set',
    url: 'https://leetcode.com/problems/valid-sudoku/',
    approach: 'Single pass. Build a key per row/column/3x3-box that includes the value, store in a single set; duplicate insertion means invalid.',
    complexity: 'O(1) time · O(1) space (fixed 9×9 board)',
    code: `public boolean isValidSudoku(char[][] board) {
  Set<String> seen = new HashSet<>();
  for (int r = 0; r < 9; r++) {
    for (int c = 0; c < 9; c++) {
      char v = board[r][c];
      if (v == '.') continue;
      String box = (r / 3) + "-" + (c / 3);
      if (!seen.add(v + " row " + r) ||
          !seen.add(v + " col " + c) ||
          !seen.add(v + " box " + box)) return false;
    }
  }
  return true;
}`
  },
  {
    num: 9, title: 'Longest Consecutive Sequence', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Hash Set',
    url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    approach: 'Put all numbers in a set. Only start counting from a number that has no predecessor (n-1 not in set). This makes the inner while loop amortized O(1) per element.',
    complexity: 'O(n) time · O(n) space',
    code: `public int longestConsecutive(int[] nums) {
  Set<Integer> set = new HashSet<>();
  for (int n : nums) set.add(n);

  int best = 0;
  for (int n : set) {
    if (!set.contains(n - 1)) {              // n is a sequence start
      int len = 1;
      while (set.contains(n + len)) len++;
      best = Math.max(best, len);
    }
  }
  return best;
}`
  },
  {
    num: 10, title: 'Encode and Decode Strings', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'String · Design',
    url: 'https://leetcode.com/problems/encode-and-decode-strings/',
    approach: 'Length-prefix encoding: emit "<len>#<string>" for each. Decoder reads digits up to "#", then the next <len> chars are the string.',
    complexity: 'O(n) encode / decode · O(n) space',
    code: `public String encode(List<String> strs) {
  StringBuilder sb = new StringBuilder();
  for (String s : strs) sb.append(s.length()).append('#').append(s);
  return sb.toString();
}

public List<String> decode(String s) {
  List<String> out = new ArrayList<>();
  int i = 0;
  while (i < s.length()) {
    int j = i;
    while (s.charAt(j) != '#') j++;
    int len = Integer.parseInt(s.substring(i, j));
    out.add(s.substring(j + 1, j + 1 + len));
    i = j + 1 + len;
  }
  return out;
}`
  },
  {
    num: 11, title: 'Maximum Subarray', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · DP (Kadane)',
    url: 'https://leetcode.com/problems/maximum-subarray/',
    approach: "Kadane's algorithm: at each step, either extend the current run or restart at the current element. Track the best run seen.",
    complexity: 'O(n) time · O(1) space',
    code: `public int maxSubArray(int[] nums) {
  int current = nums[0], best = nums[0];
  for (int i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}`
  },
  {
    num: 12, title: 'Maximum Product Subarray', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · DP',
    url: 'https://leetcode.com/problems/maximum-product-subarray/',
    approach: 'Track both the max AND min product ending at i — multiplying a big negative by a new negative becomes a big positive. Swap them when nums[i] is negative.',
    complexity: 'O(n) time · O(1) space',
    code: `public int maxProduct(int[] nums) {
  int max = nums[0], min = nums[0], best = nums[0];
  for (int i = 1; i < nums.length; i++) {
    int n = nums[i];
    if (n < 0) { int t = max; max = min; min = t; }
    max = Math.max(n, max * n);
    min = Math.min(n, min * n);
    best = Math.max(best, max);
  }
  return best;
}`
  },
  {
    num: 13, title: 'Move Zeroes', d: 'easy',
    bucket: 'Arrays & Hashing', category: 'Array · Two Pointers',
    url: 'https://leetcode.com/problems/move-zeroes/',
    approach: 'Two pointers: a write index that only advances on non-zero. After one pass, fill the tail with zeros.',
    complexity: 'O(n) time · O(1) space',
    code: `public void moveZeroes(int[] nums) {
  int write = 0;
  for (int n : nums) {
    if (n != 0) nums[write++] = n;
  }
  while (write < nums.length) nums[write++] = 0;
}`
  },
  {
    num: 14, title: 'Sort Colors', d: 'medium',
    bucket: 'Arrays & Hashing', category: 'Array · Dutch National Flag',
    url: 'https://leetcode.com/problems/sort-colors/',
    approach: "Dutch National Flag (Dijkstra): three pointers lo, mid, hi. Mid scans; swap 0 with lo and advance both; swap 2 with hi and only decrement hi (don't advance mid because the swapped-in value is unknown).",
    complexity: 'O(n) time · O(1) space',
    code: `public void sortColors(int[] nums) {
  int lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] == 0)      { int t = nums[lo]; nums[lo++] = nums[mid]; nums[mid++] = t; }
    else if (nums[mid] == 2) { int t = nums[hi]; nums[hi--] = nums[mid]; nums[mid] = t; }
    else                       mid++;
  }
}`
  },
  {
    num: 15, title: 'First Missing Positive', d: 'hard',
    bucket: 'Arrays & Hashing', category: 'Array · Cyclic Sort',
    url: 'https://leetcode.com/problems/first-missing-positive/',
    approach: 'In-place cyclic sort: place each positive ≤ n at index (val - 1). After one pass, the first index where nums[i] != i + 1 is the answer.',
    complexity: 'O(n) time · O(1) extra space',
    code: `public int firstMissingPositive(int[] nums) {
  int n = nums.length;
  for (int i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
      int t = nums[nums[i] - 1];
      nums[nums[i] - 1] = nums[i];
      nums[i] = t;
    }
  }
  for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
  return n + 1;
}`
  },

  // ─── Two Pointers (6) ───
  {
    num: 16, title: 'Valid Palindrome', d: 'easy',
    bucket: 'Two Pointers', category: 'String',
    url: 'https://leetcode.com/problems/valid-palindrome/',
    approach: 'Two pointers from each end. Skip non-alphanumeric chars. Compare lowercased.',
    complexity: 'O(n) time · O(1) space',
    code: `public boolean isPalindrome(String s) {
  int l = 0, r = s.length() - 1;
  while (l < r) {
    while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
    while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
    if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
      return false;
    }
    l++; r--;
  }
  return true;
}`
  },
  {
    num: 17, title: 'Two Sum II - Input Array Is Sorted', d: 'medium',
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    approach: 'Two pointers from each end. Sum too small → advance left; too large → retreat right. O(1) extra space because the array is already sorted.',
    complexity: 'O(n) time · O(1) space',
    code: `public int[] twoSum(int[] numbers, int target) {
  int l = 0, r = numbers.length - 1;
  while (l < r) {
    int sum = numbers[l] + numbers[r];
    if (sum == target) return new int[]{ l + 1, r + 1 };
    if (sum < target) l++; else r--;
  }
  return new int[0];
}`
  },
  {
    num: 18, title: '3Sum', d: 'medium',
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/3sum/',
    approach: 'Sort. Fix one number, then use two pointers on the rest to find pairs summing to its negation. Skip duplicates carefully on all three positions.',
    complexity: 'O(n²) time · O(1) extra (sorting in place)',
    code: `public List<List<Integer>> threeSum(int[] nums) {
  Arrays.sort(nums);
  List<List<Integer>> result = new ArrayList<>();
  for (int i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i-1]) continue;        // skip dup
    int l = i + 1, r = nums.length - 1;
    while (l < r) {
      int sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        result.add(List.of(nums[i], nums[l], nums[r]));
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
    num: 19, title: 'Container With Most Water', d: 'medium',
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    approach: 'Two pointers from ends. Area is (r - l) * min(height). Move the SHORTER side inward — moving the taller side can only ever lower the area.',
    complexity: 'O(n) time · O(1) space',
    code: `public int maxArea(int[] height) {
  int l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    int h = Math.min(height[l], height[r]);
    best = Math.max(best, h * (r - l));
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`
  },
  {
    num: 20, title: 'Trapping Rain Water', d: 'hard',
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/trapping-rain-water/',
    approach: 'Two pointers + running maxes. Always advance from the shorter side. Water at a position = (sideMax - height) once you know the side max bounds it.',
    complexity: 'O(n) time · O(1) space',
    code: `public int trap(int[] height) {
  int l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= lMax) lMax = height[l];
      else water += lMax - height[l];
      l++;
    } else {
      if (height[r] >= rMax) rMax = height[r];
      else water += rMax - height[r];
      r--;
    }
  }
  return water;
}`
  },
  {
    num: 21, title: 'Remove Duplicates from Sorted Array', d: 'easy',
    bucket: 'Two Pointers', category: 'Array',
    url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
    approach: 'Two pointers: a write index that only advances when the current element differs from the previous one.',
    complexity: 'O(n) time · O(1) space',
    code: `public int removeDuplicates(int[] nums) {
  if (nums.length == 0) return 0;
  int write = 1;
  for (int i = 1; i < nums.length; i++) {
    if (nums[i] != nums[i - 1]) nums[write++] = nums[i];
  }
  return write;
}`
  },

  // ─── Sliding Window (5) ───
  {
    num: 22, title: 'Longest Substring Without Repeating Characters', d: 'medium',
    bucket: 'Sliding Window', category: 'String',
    url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    approach: 'Sliding window with a map of char → last index. When we hit a repeat inside the window, jump the left edge past its previous occurrence.',
    complexity: 'O(n) time · O(min(n, alphabet)) space',
    code: `public int lengthOfLongestSubstring(String s) {
  Map<Character, Integer> lastIdx = new HashMap<>();
  int best = 0, left = 0;
  for (int r = 0; r < s.length(); r++) {
    char c = s.charAt(r);
    if (lastIdx.containsKey(c) && lastIdx.get(c) >= left) {
      left = lastIdx.get(c) + 1;
    }
    lastIdx.put(c, r);
    best = Math.max(best, r - left + 1);
  }
  return best;
}`
  },
  {
    num: 23, title: 'Longest Repeating Character Replacement', d: 'medium',
    bucket: 'Sliding Window', category: 'String',
    url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
    approach: 'Window is valid if (windowLen - maxFreq) <= k (we can flip the rest to match). Shrink when invalid; track max length.',
    complexity: 'O(n) time · O(1) space',
    code: `public int characterReplacement(String s, int k) {
  int[] count = new int[26];
  int left = 0, maxFreq = 0, best = 0;
  for (int r = 0; r < s.length(); r++) {
    maxFreq = Math.max(maxFreq, ++count[s.charAt(r) - 'A']);
    if ((r - left + 1) - maxFreq > k) {
      count[s.charAt(left++) - 'A']--;
    }
    best = Math.max(best, r - left + 1);
  }
  return best;
}`
  },
  {
    num: 24, title: 'Minimum Window Substring', d: 'hard',
    bucket: 'Sliding Window', category: 'String',
    url: 'https://leetcode.com/problems/minimum-window-substring/',
    approach: 'Expand right until window contains all needed chars (track via "have == need" matched-count). Then shrink left while still valid, updating the best.',
    complexity: 'O(n + m) time · O(alphabet) space',
    code: `public String minWindow(String s, String t) {
  if (t.length() > s.length()) return "";
  int[] need = new int[128];
  for (char c : t.toCharArray()) need[c]++;
  int required = t.length(), left = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;

  for (int r = 0; r < s.length(); r++) {
    if (need[s.charAt(r)]-- > 0) required--;
    while (required == 0) {
      if (r - left + 1 < bestLen) { bestLen = r - left + 1; bestStart = left; }
      if (++need[s.charAt(left++)] > 0) required++;
    }
  }
  return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}`
  },
  {
    num: 25, title: 'Best Time to Buy and Sell Stock II', d: 'medium',
    bucket: 'Sliding Window', category: 'Array · Greedy',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/',
    approach: 'Capture every up-move. The sum of all positive day-to-day differences equals the max profit from unlimited transactions.',
    complexity: 'O(n) time · O(1) space',
    code: `public int maxProfit(int[] prices) {
  int profit = 0;
  for (int i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  }
  return profit;
}`
  },
  {
    num: 26, title: 'Permutation in String', d: 'medium',
    bucket: 'Sliding Window', category: 'String',
    url: 'https://leetcode.com/problems/permutation-in-string/',
    approach: 'Fixed-size sliding window over s2 of length s1. Track two 26-int frequency counts; on each shift, compare them with Arrays.equals.',
    complexity: 'O(n) time · O(1) space',
    code: `public boolean checkInclusion(String s1, String s2) {
  if (s1.length() > s2.length()) return false;
  int[] need = new int[26], have = new int[26];
  for (int i = 0; i < s1.length(); i++) {
    need[s1.charAt(i) - 'a']++;
    have[s2.charAt(i) - 'a']++;
  }
  if (Arrays.equals(need, have)) return true;
  for (int i = s1.length(); i < s2.length(); i++) {
    have[s2.charAt(i) - 'a']++;
    have[s2.charAt(i - s1.length()) - 'a']--;
    if (Arrays.equals(need, have)) return true;
  }
  return false;
}`
  },

  // ─── Stack (5) ───
  {
    num: 27, title: 'Valid Parentheses', d: 'easy',
    bucket: 'Stack', category: 'String',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    approach: 'Push openers onto a stack. On a closer, pop and check it matches. Empty stack at end == valid.',
    complexity: 'O(n) time · O(n) space',
    code: `public boolean isValid(String s) {
  Deque<Character> stack = new ArrayDeque<>();
  for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') stack.push(c);
    else {
      if (stack.isEmpty()) return false;
      char open = stack.pop();
      if (c == ')' && open != '(') return false;
      if (c == ']' && open != '[') return false;
      if (c == '}' && open != '{') return false;
    }
  }
  return stack.isEmpty();
}`
  },
  {
    num: 28, title: 'Min Stack', d: 'medium',
    bucket: 'Stack', category: 'Design',
    url: 'https://leetcode.com/problems/min-stack/',
    approach: 'Keep a parallel "min stack" — push the current min on every push, pop on every pop. top() of min stack is always the running minimum.',
    complexity: 'O(1) per op · O(n) space',
    code: `class MinStack {
  private final Deque<Integer> stack = new ArrayDeque<>();
  private final Deque<Integer> mins  = new ArrayDeque<>();

  public void push(int val) {
    stack.push(val);
    mins.push(mins.isEmpty() ? val : Math.min(mins.peek(), val));
  }
  public void pop()    { stack.pop(); mins.pop(); }
  public int top()     { return stack.peek(); }
  public int getMin()  { return mins.peek(); }
}`
  },
  {
    num: 29, title: 'Evaluate Reverse Polish Notation', d: 'medium',
    bucket: 'Stack', category: 'Stack',
    url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    approach: 'Standard RPN evaluation: push numbers; on an operator pop two, apply, push result. Watch operand order for non-commutative ops (- and /).',
    complexity: 'O(n) time · O(n) space',
    code: `public int evalRPN(String[] tokens) {
  Deque<Integer> stack = new ArrayDeque<>();
  for (String t : tokens) {
    switch (t) {
      case "+": stack.push(stack.pop() + stack.pop()); break;
      case "*": stack.push(stack.pop() * stack.pop()); break;
      case "-": { int b = stack.pop(), a = stack.pop(); stack.push(a - b); break; }
      case "/": { int b = stack.pop(), a = stack.pop(); stack.push(a / b); break; }
      default:  stack.push(Integer.parseInt(t));
    }
  }
  return stack.pop();
}`
  },
  {
    num: 30, title: 'Daily Temperatures', d: 'medium',
    bucket: 'Stack', category: 'Monotonic Stack',
    url: 'https://leetcode.com/problems/daily-temperatures/',
    approach: 'Monotonic decreasing stack of indices. When a warmer day appears, pop all colder indices and record (i - poppedIdx) as their answer.',
    complexity: 'O(n) time · O(n) space',
    code: `public int[] dailyTemperatures(int[] temps) {
  int[] out = new int[temps.length];
  Deque<Integer> stack = new ArrayDeque<>();
  for (int i = 0; i < temps.length; i++) {
    while (!stack.isEmpty() && temps[i] > temps[stack.peek()]) {
      int j = stack.pop();
      out[j] = i - j;
    }
    stack.push(i);
  }
  return out;
}`
  },
  {
    num: 31, title: 'Largest Rectangle in Histogram', d: 'hard',
    bucket: 'Stack', category: 'Monotonic Stack',
    url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    approach: 'Monotonic increasing stack of indices. When a shorter bar arrives, pop and compute the rectangle anchored by the popped bar — width spans from one past the new stack top to i-1.',
    complexity: 'O(n) time · O(n) space',
    code: `public int largestRectangleArea(int[] heights) {
  Deque<Integer> stack = new ArrayDeque<>();
  int best = 0;
  for (int i = 0; i <= heights.length; i++) {
    int h = (i == heights.length) ? 0 : heights[i];
    while (!stack.isEmpty() && heights[stack.peek()] > h) {
      int top = stack.pop();
      int width = stack.isEmpty() ? i : i - stack.peek() - 1;
      best = Math.max(best, heights[top] * width);
    }
    stack.push(i);
  }
  return best;
}`
  },

  // ─── Binary Search (5) ───
  {
    num: 32, title: 'Binary Search', d: 'easy',
    bucket: 'Binary Search', category: 'Array',
    url: 'https://leetcode.com/problems/binary-search/',
    approach: 'Classic iterative binary search. Use (lo + hi) >>> 1 to avoid integer overflow when lo + hi could exceed MAX_VALUE.',
    complexity: 'O(log n) time · O(1) space',
    code: `public int search(int[] nums, int target) {
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`
  },
  {
    num: 33, title: 'Search in Rotated Sorted Array', d: 'medium',
    bucket: 'Binary Search', category: 'Array',
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    approach: 'Modified binary search. One half is always sorted. Decide which half by comparing nums[lo] to nums[mid]; check whether target lies in the sorted half.',
    complexity: 'O(log n) time · O(1) space',
    code: `public int search(int[] nums, int target) {
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (nums[mid] == target) return mid;
    if (nums[lo] <= nums[mid]) {            // left half sorted
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                 // right half sorted
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`
  },
  {
    num: 34, title: 'Find Minimum in Rotated Sorted Array', d: 'medium',
    bucket: 'Binary Search', category: 'Array',
    url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    approach: 'Binary search comparing mid to the RIGHT end. If nums[mid] > nums[hi], the min is to the right of mid; else it is at mid or to the left.',
    complexity: 'O(log n) time · O(1) space',
    code: `public int findMin(int[] nums) {
  int lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    int mid = (lo + hi) >>> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`
  },
  {
    num: 35, title: 'First Bad Version', d: 'easy',
    bucket: 'Binary Search', category: 'Array · API',
    url: 'https://leetcode.com/problems/first-bad-version/',
    approach: 'Binary search for the smallest n with isBadVersion(n) == true. Use lo + (hi - lo) / 2 to avoid overflow (Integer.MAX_VALUE input).',
    complexity: 'O(log n) time · O(1) space',
    code: `public int firstBadVersion(int n) {
  int lo = 1, hi = n;
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (isBadVersion(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`
  },
  {
    num: 36, title: 'Median of Two Sorted Arrays', d: 'hard',
    bucket: 'Binary Search', category: 'Array',
    url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    approach: 'Binary search on the partition position of the shorter array. The correct partition makes both left halves total to (m+n+1)/2 and have aLeft <= bRight && bLeft <= aRight.',
    complexity: 'O(log min(m, n)) time · O(1) space',
    code: `public double findMedianSortedArrays(int[] a, int[] b) {
  if (a.length > b.length) return findMedianSortedArrays(b, a);
  int m = a.length, n = b.length, total = m + n, half = (total + 1) / 2;
  int lo = 0, hi = m;
  while (lo <= hi) {
    int i = (lo + hi) / 2;
    int j = half - i;
    int aLeft  = i == 0 ? Integer.MIN_VALUE : a[i - 1];
    int aRight = i == m ? Integer.MAX_VALUE : a[i];
    int bLeft  = j == 0 ? Integer.MIN_VALUE : b[j - 1];
    int bRight = j == n ? Integer.MAX_VALUE : b[j];
    if (aLeft <= bRight && bLeft <= aRight) {
      if ((total & 1) == 1) return Math.max(aLeft, bLeft);
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2.0;
    } else if (aLeft > bRight) hi = i - 1;
    else lo = i + 1;
  }
  return 0.0;
}`
  },

  // ─── Linked List (10) ───
  {
    num: 37, title: 'Reverse Linked List', d: 'easy',
    bucket: 'Linked List', category: 'Two Pointers',
    url: 'https://leetcode.com/problems/reverse-linked-list/',
    approach: 'Iterative three-pointer reverse: prev, curr, next. Reassign next pointers as you walk.',
    complexity: 'O(n) time · O(1) space',
    code: `public ListNode reverseList(ListNode head) {
  ListNode prev = null, curr = head;
  while (curr != null) {
    ListNode next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`
  },
  {
    num: 38, title: 'Merge Two Sorted Lists', d: 'easy',
    bucket: 'Linked List', category: 'Two Pointers',
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    approach: 'Dummy head + tail pointer. Pick the smaller of the two heads each step.',
    complexity: 'O(n + m) time · O(1) space',
    code: `public ListNode mergeTwoLists(ListNode a, ListNode b) {
  ListNode dummy = new ListNode(0), tail = dummy;
  while (a != null && b != null) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else                { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = (a != null) ? a : b;
  return dummy.next;
}`
  },
  {
    num: 39, title: 'Linked List Cycle', d: 'easy',
    bucket: 'Linked List', category: 'Two Pointers (Floyd)',
    url: 'https://leetcode.com/problems/linked-list-cycle/',
    approach: "Floyd's tortoise and hare. Slow moves 1, fast moves 2. They meet iff there's a cycle.",
    complexity: 'O(n) time · O(1) space',
    code: `public boolean hasCycle(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
  }
  return false;
}`
  },
  {
    num: 40, title: 'Remove Nth Node From End of List', d: 'medium',
    bucket: 'Linked List', category: 'Two Pointers',
    url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    approach: 'Two-pointer gap of n+1. Use a dummy head so removing the first node is uniform.',
    complexity: 'O(n) time · O(1) space',
    code: `public ListNode removeNthFromEnd(ListNode head, int n) {
  ListNode dummy = new ListNode(0); dummy.next = head;
  ListNode slow = dummy, fast = dummy;
  for (int i = 0; i <= n; i++) fast = fast.next;
  while (fast != null) { slow = slow.next; fast = fast.next; }
  slow.next = slow.next.next;
  return dummy.next;
}`
  },
  {
    num: 41, title: 'Merge K Sorted Lists', d: 'hard',
    bucket: 'Linked List', category: 'Heap',
    url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    approach: 'Min-heap of all current heads. Pop the smallest, append, push its successor. O(N log k) where N is total nodes and k is list count.',
    complexity: 'O(N log k) time · O(k) space',
    code: `public ListNode mergeKLists(ListNode[] lists) {
  PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);
  for (ListNode l : lists) if (l != null) heap.offer(l);

  ListNode dummy = new ListNode(0), tail = dummy;
  while (!heap.isEmpty()) {
    ListNode node = heap.poll();
    tail.next = node;
    tail = node;
    if (node.next != null) heap.offer(node.next);
  }
  return dummy.next;
}`
  },
  {
    num: 42, title: 'Add Two Numbers', d: 'medium',
    bucket: 'Linked List', category: 'Math',
    url: 'https://leetcode.com/problems/add-two-numbers/',
    approach: 'Walk both lists, carrying like in grade-school addition. Continue while either has nodes or carry > 0.',
    complexity: 'O(max(m, n)) time · O(max(m, n)) space',
    code: `public ListNode addTwoNumbers(ListNode a, ListNode b) {
  ListNode dummy = new ListNode(0), tail = dummy;
  int carry = 0;
  while (a != null || b != null || carry > 0) {
    int sum = carry;
    if (a != null) { sum += a.val; a = a.next; }
    if (b != null) { sum += b.val; b = b.next; }
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = sum / 10;
  }
  return dummy.next;
}`
  },
  {
    num: 43, title: 'Copy List with Random Pointer', d: 'medium',
    bucket: 'Linked List', category: 'Hash Map',
    url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
    approach: 'Two passes with a hash map old → new. First pass clones nodes; second pass wires up next/random using the map. O(n) space; the in-place interleaving trick gets O(1) space but is fiddly.',
    complexity: 'O(n) time · O(n) space',
    code: `public Node copyRandomList(Node head) {
  Map<Node, Node> map = new HashMap<>();
  for (Node cur = head; cur != null; cur = cur.next) {
    map.put(cur, new Node(cur.val));
  }
  for (Node cur = head; cur != null; cur = cur.next) {
    map.get(cur).next   = map.get(cur.next);
    map.get(cur).random = map.get(cur.random);
  }
  return map.get(head);
}`
  },
  {
    num: 44, title: 'Reorder List', d: 'medium',
    bucket: 'Linked List', category: 'Two Pointers',
    url: 'https://leetcode.com/problems/reorder-list/',
    approach: 'Three steps: (1) find the middle via slow/fast; (2) reverse the second half; (3) merge the two halves alternately.',
    complexity: 'O(n) time · O(1) space',
    code: `public void reorderList(ListNode head) {
  // 1. Find middle (slow ends at middle for odd length, just-before for even)
  ListNode slow = head, fast = head;
  while (fast.next != null && fast.next.next != null) {
    slow = slow.next; fast = fast.next.next;
  }
  // 2. Reverse second half
  ListNode prev = null, curr = slow.next;
  slow.next = null;
  while (curr != null) {
    ListNode next = curr.next;
    curr.next = prev; prev = curr; curr = next;
  }
  // 3. Merge alternately
  ListNode l1 = head, l2 = prev;
  while (l2 != null) {
    ListNode n1 = l1.next, n2 = l2.next;
    l1.next = l2; l2.next = n1;
    l1 = n1; l2 = n2;
  }
}`
  },
  {
    num: 45, title: 'Find the Duplicate Number', d: 'medium',
    bucket: 'Linked List', category: 'Two Pointers (Floyd)',
    url: 'https://leetcode.com/problems/find-the-duplicate-number/',
    approach: "Treat array as a function i → nums[i]. The duplicate creates a cycle. Use Floyd's: find a meeting point, then reset slow to start and walk both at speed 1.",
    complexity: 'O(n) time · O(1) space',
    code: `public int findDuplicate(int[] nums) {
  int slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow != fast);

  int finder = nums[0];
  while (finder != slow) {
    finder = nums[finder];
    slow = nums[slow];
  }
  return finder;
}`
  },
  {
    num: 46, title: 'LRU Cache', d: 'medium',
    bucket: 'Linked List', category: 'Design',
    url: 'https://leetcode.com/problems/lru-cache/',
    approach: 'Quickest Java solution: extend LinkedHashMap in access-order mode and override removeEldestEntry. Behind the scenes it\'s a hash map + doubly-linked list, the same structure you\'d build by hand.',
    complexity: 'O(1) per get / put · O(capacity) space',
    code: `class LRUCache extends LinkedHashMap<Integer, Integer> {
  private final int capacity;
  public LRUCache(int capacity) {
    super(capacity, 0.75f, true);    // accessOrder = true
    this.capacity = capacity;
  }
  public int get(int key) { return super.getOrDefault(key, -1); }
  public void put(int key, int value) { super.put(key, value); }
  @Override
  protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
    return size() > capacity;
  }
}`
  },

  // ─── Trees (15) ───
  {
    num: 47, title: 'Invert Binary Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/invert-binary-tree/',
    approach: 'Recurse: swap children, then recurse on each.',
    complexity: 'O(n) time · O(h) recursion space',
    code: `public TreeNode invertTree(TreeNode root) {
  if (root == null) return null;
  TreeNode tmp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(tmp);
  return root;
}`
  },
  {
    num: 48, title: 'Maximum Depth of Binary Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    approach: '1 + max(depth(left), depth(right)). Base case: null = 0.',
    complexity: 'O(n) time · O(h) space',
    code: `public int maxDepth(TreeNode root) {
  if (root == null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`
  },
  {
    num: 49, title: 'Same Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/same-tree/',
    approach: 'Both null → true. One null → false. Else values match and recurse on both subtrees.',
    complexity: 'O(n) time · O(h) space',
    code: `public boolean isSameTree(TreeNode p, TreeNode q) {
  if (p == null && q == null) return true;
  if (p == null || q == null) return false;
  return p.val == q.val
      && isSameTree(p.left, q.left)
      && isSameTree(p.right, q.right);
}`
  },
  {
    num: 50, title: 'Subtree of Another Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/subtree-of-another-tree/',
    approach: 'For each node in root, check sameTree against subRoot.',
    complexity: 'O(m · n) time · O(h) space',
    code: `public boolean isSubtree(TreeNode root, TreeNode subRoot) {
  if (root == null) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
private boolean isSameTree(TreeNode a, TreeNode b) {
  if (a == null && b == null) return true;
  if (a == null || b == null || a.val != b.val) return false;
  return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}`
  },
  {
    num: 51, title: 'Path Sum', d: 'easy',
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/path-sum/',
    approach: 'DFS subtracting node.val from the running target. A leaf with remainder == 0 wins.',
    complexity: 'O(n) time · O(h) space',
    code: `public boolean hasPathSum(TreeNode root, int targetSum) {
  if (root == null) return false;
  if (root.left == null && root.right == null) return targetSum == root.val;
  return hasPathSum(root.left,  targetSum - root.val)
      || hasPathSum(root.right, targetSum - root.val);
}`
  },
  {
    num: 52, title: 'Balanced Binary Tree', d: 'easy',
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/balanced-binary-tree/',
    approach: 'Bottom-up DFS returning height; sentinel -1 propagates "unbalanced" upward without recomputing heights.',
    complexity: 'O(n) time · O(h) space',
    code: `public boolean isBalanced(TreeNode root) {
  return height(root) != -1;
}
private int height(TreeNode node) {
  if (node == null) return 0;
  int l = height(node.left);
  if (l == -1) return -1;
  int r = height(node.right);
  if (r == -1 || Math.abs(l - r) > 1) return -1;
  return 1 + Math.max(l, r);
}`
  },
  {
    num: 53, title: 'Symmetric Tree', d: 'easy',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/symmetric-tree/',
    approach: 'Recurse on mirrored pairs: (left.left, right.right) and (left.right, right.left).',
    complexity: 'O(n) time · O(h) space',
    code: `public boolean isSymmetric(TreeNode root) {
  return root == null || mirror(root.left, root.right);
}
private boolean mirror(TreeNode a, TreeNode b) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return a.val == b.val
      && mirror(a.left,  b.right)
      && mirror(a.right, b.left);
}`
  },
  {
    num: 54, title: 'Binary Tree Level Order Traversal', d: 'medium',
    bucket: 'Trees', category: 'BFS',
    url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    approach: 'BFS with a queue. For each level, pop exactly the current size, process them as one level.',
    complexity: 'O(n) time · O(n) space',
    code: `public List<List<Integer>> levelOrder(TreeNode root) {
  List<List<Integer>> result = new ArrayList<>();
  if (root == null) return result;
  Queue<TreeNode> q = new ArrayDeque<>();
  q.offer(root);
  while (!q.isEmpty()) {
    int size = q.size();
    List<Integer> level = new ArrayList<>(size);
    for (int i = 0; i < size; i++) {
      TreeNode node = q.poll();
      level.add(node.val);
      if (node.left != null)  q.offer(node.left);
      if (node.right != null) q.offer(node.right);
    }
    result.add(level);
  }
  return result;
}`
  },
  {
    num: 55, title: 'Binary Tree Right Side View', d: 'medium',
    bucket: 'Trees', category: 'BFS',
    url: 'https://leetcode.com/problems/binary-tree-right-side-view/',
    approach: 'Level-order BFS. The last node popped at each level is the visible-from-right one.',
    complexity: 'O(n) time · O(n) space',
    code: `public List<Integer> rightSideView(TreeNode root) {
  List<Integer> out = new ArrayList<>();
  if (root == null) return out;
  Queue<TreeNode> q = new ArrayDeque<>();
  q.offer(root);
  while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i < size; i++) {
      TreeNode node = q.poll();
      if (i == size - 1) out.add(node.val);
      if (node.left  != null) q.offer(node.left);
      if (node.right != null) q.offer(node.right);
    }
  }
  return out;
}`
  },
  {
    num: 56, title: 'Validate Binary Search Tree', d: 'medium',
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/validate-binary-search-tree/',
    approach: 'Recurse with (min, max) bounds. Each node\'s value must be strictly inside its bounds; pass tightened bounds to children.',
    complexity: 'O(n) time · O(h) space',
    code: `public boolean isValidBST(TreeNode root) {
  return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
private boolean validate(TreeNode node, long lo, long hi) {
  if (node == null) return true;
  if (node.val <= lo || node.val >= hi) return false;
  return validate(node.left, lo, node.val)
      && validate(node.right, node.val, hi);
}`
  },
  {
    num: 57, title: 'Kth Smallest Element in a BST', d: 'medium',
    bucket: 'Trees', category: 'In-order traversal',
    url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
    approach: 'Iterative in-order traversal with a stack — gives nodes in ascending order. Count down to k and return.',
    complexity: 'O(h + k) time · O(h) space',
    code: `public int kthSmallest(TreeNode root, int k) {
  Deque<TreeNode> stack = new ArrayDeque<>();
  TreeNode cur = root;
  while (cur != null || !stack.isEmpty()) {
    while (cur != null) { stack.push(cur); cur = cur.left; }
    cur = stack.pop();
    if (--k == 0) return cur.val;
    cur = cur.right;
  }
  return -1;
}`
  },
  {
    num: 58, title: 'Lowest Common Ancestor of BST', d: 'easy',
    bucket: 'Trees', category: 'BST',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    approach: 'Walk down: if both p,q < current → go left; both > → go right; else current is the split point = LCA.',
    complexity: 'O(h) time · O(1) space',
    code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
  while (root != null) {
    if      (p.val < root.val && q.val < root.val) root = root.left;
    else if (p.val > root.val && q.val > root.val) root = root.right;
    else return root;
  }
  return null;
}`
  },
  {
    num: 59, title: 'Construct Binary Tree from Preorder and Inorder', d: 'medium',
    bucket: 'Trees', category: 'Recursion',
    url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
    approach: 'Preorder[0] is the root. Find its index in inorder to split left/right subtrees, recurse. Cache inorder indices in a HashMap for O(1) lookup.',
    complexity: 'O(n) time · O(n) space',
    code: `private int preIdx = 0;
private Map<Integer, Integer> inMap;

public TreeNode buildTree(int[] preorder, int[] inorder) {
  inMap = new HashMap<>();
  for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
  return build(preorder, 0, inorder.length - 1);
}
private TreeNode build(int[] pre, int lo, int hi) {
  if (lo > hi) return null;
  int val = pre[preIdx++];
  TreeNode node = new TreeNode(val);
  int mid = inMap.get(val);
  node.left  = build(pre, lo, mid - 1);
  node.right = build(pre, mid + 1, hi);
  return node;
}`
  },
  {
    num: 60, title: 'Binary Tree Maximum Path Sum', d: 'hard',
    bucket: 'Trees', category: 'DFS',
    url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    approach: 'Bottom-up DFS. At each node, the answer-candidate is left + node + right (the U-shape through it). The return value (gain you can extend upward) is node + max(left, right). Clamp left/right to 0 to skip negative subtrees.',
    complexity: 'O(n) time · O(h) space',
    code: `private int best;

public int maxPathSum(TreeNode root) {
  best = Integer.MIN_VALUE;
  gain(root);
  return best;
}
private int gain(TreeNode node) {
  if (node == null) return 0;
  int left  = Math.max(0, gain(node.left));
  int right = Math.max(0, gain(node.right));
  best = Math.max(best, node.val + left + right);
  return node.val + Math.max(left, right);
}`
  },
  {
    num: 61, title: 'Serialize and Deserialize Binary Tree', d: 'hard',
    bucket: 'Trees', category: 'Design · DFS',
    url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    approach: 'Pre-order DFS, writing "#" for null. Deserialize by consuming tokens left-to-right via a queue.',
    complexity: 'O(n) time · O(n) space',
    code: `private static final String NULL = "#";
private static final String SEP  = ",";

public String serialize(TreeNode root) {
  StringBuilder sb = new StringBuilder();
  serializeHelper(root, sb);
  return sb.toString();
}
private void serializeHelper(TreeNode node, StringBuilder sb) {
  if (node == null) { sb.append(NULL).append(SEP); return; }
  sb.append(node.val).append(SEP);
  serializeHelper(node.left,  sb);
  serializeHelper(node.right, sb);
}

public TreeNode deserialize(String data) {
  return deserializeHelper(new ArrayDeque<>(Arrays.asList(data.split(SEP))));
}
private TreeNode deserializeHelper(Deque<String> tokens) {
  String t = tokens.poll();
  if (NULL.equals(t)) return null;
  TreeNode node = new TreeNode(Integer.parseInt(t));
  node.left  = deserializeHelper(tokens);
  node.right = deserializeHelper(tokens);
  return node;
}`
  },

  // ─── Tries (2) ───
  {
    num: 62, title: 'Implement Trie (Prefix Tree)', d: 'medium',
    bucket: 'Tries', category: 'Design',
    url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    approach: 'Each node has 26 children + an "end of word" flag. insert/search/startsWith all walk character by character.',
    complexity: 'O(L) per op (L = word length) · O(L · N) total space',
    code: `class Trie {
  private static class Node {
    Node[] children = new Node[26];
    boolean end;
  }
  private final Node root = new Node();

  public void insert(String word) {
    Node cur = root;
    for (char c : word.toCharArray()) {
      int i = c - 'a';
      if (cur.children[i] == null) cur.children[i] = new Node();
      cur = cur.children[i];
    }
    cur.end = true;
  }
  public boolean search(String word)     { Node n = find(word); return n != null && n.end; }
  public boolean startsWith(String pref) { return find(pref) != null; }

  private Node find(String s) {
    Node cur = root;
    for (char c : s.toCharArray()) {
      cur = cur.children[c - 'a'];
      if (cur == null) return null;
    }
    return cur;
  }
}`
  },
  {
    num: 63, title: 'Design Add and Search Words Data Structure', d: 'medium',
    bucket: 'Tries', category: 'Design · DFS',
    url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
    approach: 'Trie + DFS search. Wildcard "." branches into all 26 children at that level.',
    complexity: 'O(L) add · O(L · 26ⁿ) worst-case search (n = wildcards)',
    code: `class WordDictionary {
  static class Node {
    Node[] children = new Node[26];
    boolean end;
  }
  private final Node root = new Node();

  public void addWord(String word) {
    Node cur = root;
    for (char c : word.toCharArray()) {
      int i = c - 'a';
      if (cur.children[i] == null) cur.children[i] = new Node();
      cur = cur.children[i];
    }
    cur.end = true;
  }
  public boolean search(String word) { return dfs(root, word, 0); }
  private boolean dfs(Node node, String w, int i) {
    if (node == null) return false;
    if (i == w.length()) return node.end;
    char c = w.charAt(i);
    if (c == '.') {
      for (Node child : node.children)
        if (dfs(child, w, i + 1)) return true;
      return false;
    }
    return dfs(node.children[c - 'a'], w, i + 1);
  }
}`
  },

  // ─── Heap / Priority Queue (4) ───
  {
    num: 64, title: 'Kth Largest Element in an Array', d: 'medium',
    bucket: 'Heap / Priority Queue', category: 'Heap',
    url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    approach: 'Min-heap of size k. After processing all elements, the heap holds the k largest; its top is the answer. Quickselect achieves O(n) average but is trickier.',
    complexity: 'O(n log k) time · O(k) space',
    code: `public int findKthLargest(int[] nums, int k) {
  PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);
  for (int n : nums) {
    minHeap.offer(n);
    if (minHeap.size() > k) minHeap.poll();
  }
  return minHeap.peek();
}`
  },
  {
    num: 65, title: 'Find Median from Data Stream', d: 'hard',
    bucket: 'Heap / Priority Queue', category: 'Design',
    url: 'https://leetcode.com/problems/find-median-from-data-stream/',
    approach: 'Two heaps: a max-heap for the lower half, a min-heap for the upper half. Keep their sizes balanced within 1. Median is from the larger one, or the average of both tops.',
    complexity: 'O(log n) per add · O(1) per median',
    code: `class MedianFinder {
  private final PriorityQueue<Integer> low  = new PriorityQueue<>(Comparator.reverseOrder());
  private final PriorityQueue<Integer> high = new PriorityQueue<>();

  public void addNum(int num) {
    low.offer(num);
    high.offer(low.poll());
    if (high.size() > low.size()) low.offer(high.poll());
  }
  public double findMedian() {
    return low.size() > high.size()
      ? low.peek()
      : (low.peek() + high.peek()) / 2.0;
  }
}`
  },
  {
    num: 66, title: 'Kth Smallest Element in a Sorted Matrix', d: 'medium',
    bucket: 'Heap / Priority Queue', category: 'Heap',
    url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',
    approach: 'Seed a min-heap with the first column. Each pop pushes the next element in its row. Stop after k pops.',
    complexity: 'O(k log n) time · O(n) space',
    code: `public int kthSmallest(int[][] matrix, int k) {
  int n = matrix.length;
  PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
  for (int r = 0; r < Math.min(n, k); r++) heap.offer(new int[]{ matrix[r][0], r, 0 });

  while (--k > 0) {
    int[] top = heap.poll();
    if (top[2] + 1 < n) {
      heap.offer(new int[]{ matrix[top[1]][top[2] + 1], top[1], top[2] + 1 });
    }
  }
  return heap.peek()[0];
}`
  },
  {
    num: 67, title: 'Reorganize String', d: 'medium',
    bucket: 'Heap / Priority Queue', category: 'Greedy · Heap',
    url: 'https://leetcode.com/problems/reorganize-string/',
    approach: 'Greedy: always pick the highest-count remaining char that isn\'t the previous one. Use a max-heap; hold the previous char aside until the next char is appended.',
    complexity: 'O(n log alphabet) time · O(alphabet) space',
    code: `public String reorganizeString(String s) {
  int[] count = new int[26];
  for (char c : s.toCharArray()) count[c - 'a']++;
  PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[1] - a[1]);
  for (int i = 0; i < 26; i++) if (count[i] > 0) heap.offer(new int[]{ i, count[i] });

  StringBuilder sb = new StringBuilder();
  int[] prev = null;
  while (!heap.isEmpty()) {
    int[] top = heap.poll();
    sb.append((char) ('a' + top[0]));
    if (prev != null && prev[1] > 0) heap.offer(prev);
    top[1]--;
    prev = top;
  }
  return sb.length() == s.length() ? sb.toString() : "";
}`
  },

  // ─── Backtracking (6) ───
  {
    num: 68, title: 'Subsets', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/subsets/',
    approach: 'Backtrack: for each index, choose to include or skip. Add current path at every recursive call.',
    complexity: 'O(n · 2ⁿ) time · O(n) recursion',
    code: `public List<List<Integer>> subsets(int[] nums) {
  List<List<Integer>> result = new ArrayList<>();
  dfs(nums, 0, new ArrayList<>(), result);
  return result;
}
private void dfs(int[] nums, int i, List<Integer> path, List<List<Integer>> out) {
  out.add(new ArrayList<>(path));
  for (int j = i; j < nums.length; j++) {
    path.add(nums[j]);
    dfs(nums, j + 1, path, out);
    path.remove(path.size() - 1);
  }
}`
  },
  {
    num: 69, title: 'Permutations', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/permutations/',
    approach: 'Backtrack with a "used" array. At each level, try every unused element; recurse; undo.',
    complexity: 'O(n · n!) time · O(n) recursion',
    code: `public List<List<Integer>> permute(int[] nums) {
  List<List<Integer>> out = new ArrayList<>();
  dfs(nums, new boolean[nums.length], new ArrayList<>(), out);
  return out;
}
private void dfs(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> out) {
  if (path.size() == nums.length) { out.add(new ArrayList<>(path)); return; }
  for (int i = 0; i < nums.length; i++) {
    if (used[i]) continue;
    used[i] = true; path.add(nums[i]);
    dfs(nums, used, path, out);
    path.remove(path.size() - 1); used[i] = false;
  }
}`
  },
  {
    num: 70, title: 'Combination Sum', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/combination-sum/',
    approach: 'Backtrack with a start index (lets us reuse the same element). Stop branches where the running sum exceeds target.',
    complexity: 'O(2^target) worst case · O(target) recursion',
    code: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
  List<List<Integer>> out = new ArrayList<>();
  dfs(candidates, 0, target, new ArrayList<>(), out);
  return out;
}
private void dfs(int[] nums, int start, int remain, List<Integer> path, List<List<Integer>> out) {
  if (remain == 0) { out.add(new ArrayList<>(path)); return; }
  if (remain < 0) return;
  for (int i = start; i < nums.length; i++) {
    path.add(nums[i]);
    dfs(nums, i, remain - nums[i], path, out);   // i (not i+1) allows reuse
    path.remove(path.size() - 1);
  }
}`
  },
  {
    num: 71, title: 'Letter Combinations of a Phone Number', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
    approach: 'For each digit, append each of its letters and recurse on the next digit. Cap path at digits.length.',
    complexity: 'O(4ⁿ · n) time · O(n) recursion',
    code: `private static final String[] DIGITS = {
  "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
};

public List<String> letterCombinations(String digits) {
  List<String> out = new ArrayList<>();
  if (digits.isEmpty()) return out;
  dfs(digits, 0, new StringBuilder(), out);
  return out;
}
private void dfs(String digits, int i, StringBuilder path, List<String> out) {
  if (i == digits.length()) { out.add(path.toString()); return; }
  for (char c : DIGITS[digits.charAt(i) - '0'].toCharArray()) {
    path.append(c);
    dfs(digits, i + 1, path, out);
    path.deleteCharAt(path.length() - 1);
  }
}`
  },
  {
    num: 72, title: 'Generate Parentheses', d: 'medium',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/generate-parentheses/',
    approach: 'Track running open and close counts. Add "(" while open < n; add ")" while close < open. Done when length == 2n.',
    complexity: 'O(4ⁿ / √n) (Catalan) · O(n) recursion',
    code: `public List<String> generateParenthesis(int n) {
  List<String> out = new ArrayList<>();
  dfs(n, 0, 0, new StringBuilder(), out);
  return out;
}
private void dfs(int n, int open, int close, StringBuilder sb, List<String> out) {
  if (sb.length() == 2 * n) { out.add(sb.toString()); return; }
  if (open < n) {
    sb.append('(');
    dfs(n, open + 1, close, sb, out);
    sb.deleteCharAt(sb.length() - 1);
  }
  if (close < open) {
    sb.append(')');
    dfs(n, open, close + 1, sb, out);
    sb.deleteCharAt(sb.length() - 1);
  }
}`
  },
  {
    num: 73, title: 'N-Queens', d: 'hard',
    bucket: 'Backtracking', category: 'Backtracking',
    url: 'https://leetcode.com/problems/n-queens/',
    approach: 'Row-by-row backtracking with three sets of constraints: occupied columns, "/" diagonals (r + c), and "\\" diagonals (r - c + n).',
    complexity: 'O(n!) time · O(n²) space',
    code: `public List<List<String>> solveNQueens(int n) {
  List<List<String>> out = new ArrayList<>();
  int[] queens = new int[n];
  dfs(0, n, queens, new boolean[n], new boolean[2*n], new boolean[2*n], out);
  return out;
}
private void dfs(int r, int n, int[] q,
                 boolean[] col, boolean[] diag, boolean[] anti,
                 List<List<String>> out) {
  if (r == n) { out.add(build(q, n)); return; }
  for (int c = 0; c < n; c++) {
    int d = r - c + n, a = r + c;
    if (col[c] || diag[d] || anti[a]) continue;
    q[r] = c;
    col[c] = diag[d] = anti[a] = true;
    dfs(r + 1, n, q, col, diag, anti, out);
    col[c] = diag[d] = anti[a] = false;
  }
}
private List<String> build(int[] q, int n) {
  List<String> board = new ArrayList<>();
  for (int r = 0; r < n; r++) {
    char[] row = new char[n];
    Arrays.fill(row, '.');
    row[q[r]] = 'Q';
    board.add(new String(row));
  }
  return board;
}`
  },

  // ─── Graphs (8) ───
  {
    num: 74, title: 'Number of Islands', d: 'medium',
    bucket: 'Graphs', category: 'DFS / BFS',
    url: 'https://leetcode.com/problems/number-of-islands/',
    approach: 'Walk the grid. On a 1, increment count and flood-fill (DFS) to mark the whole island as visited (overwrite to 0).',
    complexity: 'O(R · C) time · O(R · C) recursion worst case',
    code: `public int numIslands(char[][] grid) {
  int count = 0;
  for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[0].length; c++) {
      if (grid[r][c] == '1') { dfs(grid, r, c); count++; }
    }
  }
  return count;
}
private void dfs(char[][] g, int r, int c) {
  if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;
  g[r][c] = '0';
  dfs(g, r + 1, c); dfs(g, r - 1, c);
  dfs(g, r, c + 1); dfs(g, r, c - 1);
}`
  },
  {
    num: 75, title: 'Clone Graph', d: 'medium',
    bucket: 'Graphs', category: 'DFS · Hash Map',
    url: 'https://leetcode.com/problems/clone-graph/',
    approach: 'DFS with a map from original node → cloned node. On revisit, return the existing clone — that handles cycles.',
    complexity: 'O(V + E) time · O(V) space',
    code: `// class Node { int val; List<Node> neighbors; ... }
private Map<Node, Node> map = new HashMap<>();

public Node cloneGraph(Node node) {
  if (node == null) return null;
  if (map.containsKey(node)) return map.get(node);
  Node clone = new Node(node.val, new ArrayList<>());
  map.put(node, clone);
  for (Node n : node.neighbors) clone.neighbors.add(cloneGraph(n));
  return clone;
}`
  },
  {
    num: 76, title: 'Course Schedule', d: 'medium',
    bucket: 'Graphs', category: 'Topological Sort',
    url: 'https://leetcode.com/problems/course-schedule/',
    approach: "Cycle detection. Use Kahn's algorithm (BFS on in-degrees): if you can process all N courses, there's no cycle.",
    complexity: 'O(V + E) time · O(V + E) space',
    code: `public boolean canFinish(int n, int[][] prereqs) {
  List<List<Integer>> graph = new ArrayList<>();
  for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
  int[] indeg = new int[n];
  for (int[] p : prereqs) { graph.get(p[1]).add(p[0]); indeg[p[0]]++; }

  Queue<Integer> q = new ArrayDeque<>();
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);

  int taken = 0;
  while (!q.isEmpty()) {
    int c = q.poll(); taken++;
    for (int next : graph.get(c)) if (--indeg[next] == 0) q.offer(next);
  }
  return taken == n;
}`
  },
  {
    num: 77, title: 'Pacific Atlantic Water Flow', d: 'medium',
    bucket: 'Graphs', category: 'DFS',
    url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
    approach: 'DFS *inward* from each ocean (reversing flow direction). A cell reachable from both ocean sets is the answer.',
    complexity: 'O(R · C) time · O(R · C) space',
    code: `public List<List<Integer>> pacificAtlantic(int[][] h) {
  int R = h.length, C = h[0].length;
  boolean[][] pac = new boolean[R][C], atl = new boolean[R][C];
  for (int r = 0; r < R; r++) { dfs(h, r, 0, pac, 0);     dfs(h, r, C-1, atl, 0); }
  for (int c = 0; c < C; c++) { dfs(h, 0, c, pac, 0);     dfs(h, R-1, c, atl, 0); }

  List<List<Integer>> out = new ArrayList<>();
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
      if (pac[r][c] && atl[r][c]) out.add(List.of(r, c));
  return out;
}
private void dfs(int[][] h, int r, int c, boolean[][] seen, int prev) {
  if (r < 0 || c < 0 || r >= h.length || c >= h[0].length || seen[r][c] || h[r][c] < prev) return;
  seen[r][c] = true;
  dfs(h, r+1, c, seen, h[r][c]); dfs(h, r-1, c, seen, h[r][c]);
  dfs(h, r, c+1, seen, h[r][c]); dfs(h, r, c-1, seen, h[r][c]);
}`
  },
  {
    num: 78, title: 'Rotting Oranges', d: 'medium',
    bucket: 'Graphs', category: 'BFS',
    url: 'https://leetcode.com/problems/rotting-oranges/',
    approach: 'Multi-source BFS from every initially rotten orange. Each BFS level corresponds to one minute; track fresh count and stop when zero.',
    complexity: 'O(R · C) time · O(R · C) space',
    code: `public int orangesRotting(int[][] grid) {
  int R = grid.length, C = grid[0].length, fresh = 0;
  Queue<int[]> q = new ArrayDeque<>();
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++) {
      if (grid[r][c] == 2) q.offer(new int[]{ r, c });
      else if (grid[r][c] == 1) fresh++;
    }
  int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
  int minutes = 0;
  while (!q.isEmpty() && fresh > 0) {
    int size = q.size();
    for (int i = 0; i < size; i++) {
      int[] p = q.poll();
      for (int[] d : dirs) {
        int nr = p[0] + d[0], nc = p[1] + d[1];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc] != 1) continue;
        grid[nr][nc] = 2; fresh--;
        q.offer(new int[]{ nr, nc });
      }
    }
    minutes++;
  }
  return fresh == 0 ? minutes : -1;
}`
  },
  {
    num: 79, title: 'Word Search', d: 'medium',
    bucket: 'Graphs', category: 'DFS · Backtracking',
    url: 'https://leetcode.com/problems/word-search/',
    approach: 'DFS from each cell. Mark visited by overwriting with a sentinel char; restore on backtrack to allow other paths.',
    complexity: 'O(R · C · 4^L) time · O(L) recursion',
    code: `public boolean exist(char[][] board, String word) {
  for (int r = 0; r < board.length; r++)
    for (int c = 0; c < board[0].length; c++)
      if (dfs(board, r, c, word, 0)) return true;
  return false;
}
private boolean dfs(char[][] b, int r, int c, String w, int i) {
  if (i == w.length()) return true;
  if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != w.charAt(i)) return false;
  char save = b[r][c];
  b[r][c] = '#';
  boolean found = dfs(b, r+1, c, w, i+1) || dfs(b, r-1, c, w, i+1)
               || dfs(b, r, c+1, w, i+1) || dfs(b, r, c-1, w, i+1);
  b[r][c] = save;
  return found;
}`
  },
  {
    num: 80, title: 'Walls and Gates', d: 'medium',
    bucket: 'Graphs', category: 'BFS',
    url: 'https://leetcode.com/problems/walls-and-gates/',
    approach: 'Multi-source BFS from every gate (cell == 0) simultaneously. Each cell\'s distance is its BFS depth — only update if currently INF.',
    complexity: 'O(R · C) time · O(R · C) space',
    code: `public void wallsAndGates(int[][] rooms) {
  int R = rooms.length, C = rooms[0].length;
  Queue<int[]> q = new ArrayDeque<>();
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
      if (rooms[r][c] == 0) q.offer(new int[]{ r, c });
  int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
  while (!q.isEmpty()) {
    int[] p = q.poll();
    for (int[] d : dirs) {
      int nr = p[0] + d[0], nc = p[1] + d[1];
      if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
      if (rooms[nr][nc] != Integer.MAX_VALUE) continue;
      rooms[nr][nc] = rooms[p[0]][p[1]] + 1;
      q.offer(new int[]{ nr, nc });
    }
  }
}`
  },
  {
    num: 81, title: 'Surrounded Regions', d: 'medium',
    bucket: 'Graphs', category: 'DFS',
    url: 'https://leetcode.com/problems/surrounded-regions/',
    approach: 'Inverse trick: DFS from border O\'s and mark them with a temp char "#" (they survive). Then sweep: O → X (surrounded), # → O (saved).',
    complexity: 'O(R · C) time · O(R · C) recursion',
    code: `public void solve(char[][] board) {
  int R = board.length, C = board[0].length;
  for (int r = 0; r < R; r++) { dfs(board, r, 0); dfs(board, r, C-1); }
  for (int c = 0; c < C; c++) { dfs(board, 0, c); dfs(board, R-1, c); }
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
      board[r][c] = (board[r][c] == 'O') ? 'X'
                   : (board[r][c] == '#') ? 'O'
                   : board[r][c];
}
private void dfs(char[][] b, int r, int c) {
  if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != 'O') return;
  b[r][c] = '#';
  dfs(b, r+1, c); dfs(b, r-1, c); dfs(b, r, c+1); dfs(b, r, c-1);
}`
  },

  // ─── Advanced Graphs (3) ───
  {
    num: 82, title: 'Network Delay Time', d: 'medium',
    bucket: 'Advanced Graphs', category: 'Dijkstra',
    url: 'https://leetcode.com/problems/network-delay-time/',
    approach: "Dijkstra's from node k. Answer is the max final distance — or -1 if any node is unreachable.",
    complexity: 'O(E log V) time · O(V + E) space',
    code: `public int networkDelayTime(int[][] times, int n, int k) {
  Map<Integer, List<int[]>> graph = new HashMap<>();
  for (int[] t : times)
    graph.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{ t[1], t[2] });

  int[] dist = new int[n + 1];
  Arrays.fill(dist, Integer.MAX_VALUE);
  dist[k] = 0;
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
  pq.offer(new int[]{ k, 0 });

  while (!pq.isEmpty()) {
    int[] top = pq.poll();
    int u = top[0], d = top[1];
    if (d > dist[u]) continue;
    for (int[] e : graph.getOrDefault(u, List.of())) {
      int v = e[0], w = e[1];
      if (d + w < dist[v]) { dist[v] = d + w; pq.offer(new int[]{ v, d + w }); }
    }
  }
  int max = 0;
  for (int i = 1; i <= n; i++) {
    if (dist[i] == Integer.MAX_VALUE) return -1;
    max = Math.max(max, dist[i]);
  }
  return max;
}`
  },
  {
    num: 83, title: 'Reconstruct Itinerary', d: 'hard',
    bucket: 'Advanced Graphs', category: 'Eulerian Path (Hierholzer)',
    url: 'https://leetcode.com/problems/reconstruct-itinerary/',
    approach: "Hierholzer's algorithm for Eulerian paths. Store outgoing edges in min-heaps so we always pick the lexicographically smallest. Reverse-add to the result.",
    complexity: 'O(E log E) time · O(E) space',
    code: `public List<String> findItinerary(List<List<String>> tickets) {
  Map<String, PriorityQueue<String>> graph = new HashMap<>();
  for (List<String> t : tickets)
    graph.computeIfAbsent(t.get(0), k -> new PriorityQueue<>()).offer(t.get(1));

  LinkedList<String> route = new LinkedList<>();
  Deque<String> stack = new ArrayDeque<>();
  stack.push("JFK");
  while (!stack.isEmpty()) {
    String at = stack.peek();
    PriorityQueue<String> dst = graph.get(at);
    if (dst == null || dst.isEmpty()) route.addFirst(stack.pop());
    else stack.push(dst.poll());
  }
  return route;
}`
  },
  {
    num: 84, title: 'Word Ladder', d: 'hard',
    bucket: 'Advanced Graphs', category: 'BFS',
    url: 'https://leetcode.com/problems/word-ladder/',
    approach: 'BFS over words. For each level, mutate each position to every letter; enqueue any word still in the unused-set. Remove on enqueue to avoid re-visits.',
    complexity: 'O(L² · N) time · O(L · N) space (L = word length, N = dict size)',
    code: `public int ladderLength(String beginWord, String endWord, List<String> wordList) {
  Set<String> words = new HashSet<>(wordList);
  if (!words.contains(endWord)) return 0;
  Queue<String> q = new ArrayDeque<>();
  q.offer(beginWord);
  int steps = 1;
  while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i < size; i++) {
      char[] cur = q.poll().toCharArray();
      for (int j = 0; j < cur.length; j++) {
        char orig = cur[j];
        for (char c = 'a'; c <= 'z'; c++) {
          cur[j] = c;
          String next = new String(cur);
          if (next.equals(endWord)) return steps + 1;
          if (words.remove(next)) q.offer(next);
        }
        cur[j] = orig;
      }
    }
    steps++;
  }
  return 0;
}`
  },

  // ─── Dynamic Programming - 1D (10) ───
  {
    num: 85, title: 'Climbing Stairs', d: 'easy',
    bucket: 'Dynamic Programming - 1D', category: 'Fibonacci',
    url: 'https://leetcode.com/problems/climbing-stairs/',
    approach: 'ways(n) = ways(n-1) + ways(n-2). Iterate with two variables — O(1) space.',
    complexity: 'O(n) time · O(1) space',
    code: `public int climbStairs(int n) {
  if (n <= 2) return n;
  int prev2 = 1, prev1 = 2;
  for (int i = 3; i <= n; i++) {
    int curr = prev1 + prev2;
    prev2 = prev1; prev1 = curr;
  }
  return prev1;
}`
  },
  {
    num: 86, title: 'House Robber', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP',
    url: 'https://leetcode.com/problems/house-robber/',
    approach: 'At each house: either rob it (skip the previous) or skip it. dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Roll with two variables.',
    complexity: 'O(n) time · O(1) space',
    code: `public int rob(int[] nums) {
  int prev2 = 0, prev1 = 0;
  for (int n : nums) {
    int curr = Math.max(prev1, prev2 + n);
    prev2 = prev1; prev1 = curr;
  }
  return prev1;
}`
  },
  {
    num: 87, title: 'House Robber II', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · Circular',
    url: 'https://leetcode.com/problems/house-robber-ii/',
    approach: 'Houses are in a circle — first and last are adjacent. Solve House Robber twice: once excluding the first house, once excluding the last; take the max.',
    complexity: 'O(n) time · O(1) space',
    code: `public int rob(int[] nums) {
  int n = nums.length;
  if (n == 1) return nums[0];
  return Math.max(robRange(nums, 0, n - 2), robRange(nums, 1, n - 1));
}
private int robRange(int[] nums, int lo, int hi) {
  int prev2 = 0, prev1 = 0;
  for (int i = lo; i <= hi; i++) {
    int curr = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1; prev1 = curr;
  }
  return prev1;
}`
  },
  {
    num: 88, title: 'Coin Change', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'Unbounded Knapsack',
    url: 'https://leetcode.com/problems/coin-change/',
    approach: 'dp[i] = fewest coins to make amount i. For each amount, try every coin and take 1 + dp[i - coin]. Unreachable amounts stay at +infinity.',
    complexity: 'O(amount · coins) time · O(amount) space',
    code: `public int coinChange(int[] coins, int amount) {
  int[] dp = new int[amount + 1];
  Arrays.fill(dp, amount + 1);
  dp[0] = 0;
  for (int i = 1; i <= amount; i++) {
    for (int c : coins) {
      if (i - c >= 0) dp[i] = Math.min(dp[i], 1 + dp[i - c]);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}`
  },
  {
    num: 89, title: 'Longest Increasing Subsequence', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · Binary Search',
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    approach: 'Patience sort: maintain "tails" — tails[k] is the smallest possible tail of an increasing subsequence of length k+1. Binary-search to place each element.',
    complexity: 'O(n log n) time · O(n) space',
    code: `public int lengthOfLIS(int[] nums) {
  List<Integer> tails = new ArrayList<>();
  for (int n : nums) {
    int i = Collections.binarySearch(tails, n);
    if (i < 0) i = -i - 1;
    if (i == tails.size()) tails.add(n);
    else tails.set(i, n);
  }
  return tails.size();
}`
  },
  {
    num: 90, title: 'Word Break', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · String',
    url: 'https://leetcode.com/problems/word-break/',
    approach: 'dp[i] = can s[0..i] be segmented? dp[i] is true if some dp[j] is true AND s[j..i] is in the dictionary.',
    complexity: 'O(n² · L) time · O(n) space',
    code: `public boolean wordBreak(String s, List<String> wordDict) {
  Set<String> words = new HashSet<>(wordDict);
  boolean[] dp = new boolean[s.length() + 1];
  dp[0] = true;
  for (int i = 1; i <= s.length(); i++) {
    for (int j = 0; j < i; j++) {
      if (dp[j] && words.contains(s.substring(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length()];
}`
  },
  {
    num: 91, title: 'Decode Ways', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'DP · String',
    url: 'https://leetcode.com/problems/decode-ways/',
    approach: 'dp[i] = decodings of s[0..i]. Add dp[i-1] if s[i] is 1-9; add dp[i-2] if the two-digit chunk s[i-1..i] is 10-26.',
    complexity: 'O(n) time · O(1) space',
    code: `public int numDecodings(String s) {
  if (s.charAt(0) == '0') return 0;
  int prev2 = 1, prev1 = 1;
  for (int i = 1; i < s.length(); i++) {
    int curr = 0;
    if (s.charAt(i) != '0') curr += prev1;
    int two = Integer.parseInt(s.substring(i - 1, i + 1));
    if (two >= 10 && two <= 26) curr += prev2;
    prev2 = prev1; prev1 = curr;
  }
  return prev1;
}`
  },
  {
    num: 92, title: 'Jump Game', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'Greedy',
    url: 'https://leetcode.com/problems/jump-game/',
    approach: 'Greedy: track the furthest reachable index. If i ever exceeds reach, we\'re stuck.',
    complexity: 'O(n) time · O(1) space',
    code: `public boolean canJump(int[] nums) {
  int reach = 0;
  for (int i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}`
  },
  {
    num: 93, title: 'Jump Game II', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'Greedy · BFS-like',
    url: 'https://leetcode.com/problems/jump-game-ii/',
    approach: 'BFS-by-jumps: extend the "current jump end". Whenever i hits end, we must jump; new end becomes farthest seen so far.',
    complexity: 'O(n) time · O(1) space',
    code: `public int jump(int[] nums) {
  int jumps = 0, end = 0, farthest = 0;
  for (int i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i == end) { jumps++; end = farthest; }
  }
  return jumps;
}`
  },
  {
    num: 94, title: 'Longest Palindromic Substring', d: 'medium',
    bucket: 'Dynamic Programming - 1D', category: 'Expand Around Center',
    url: 'https://leetcode.com/problems/longest-palindromic-substring/',
    approach: 'Expand around each center (both odd and even centers). O(n²); the classic DP table is the same complexity but uses O(n²) space.',
    complexity: 'O(n²) time · O(1) space',
    code: `public String longestPalindrome(String s) {
  int start = 0, end = 0;
  for (int i = 0; i < s.length(); i++) {
    int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
    if (len > end - start) {
      start = i - (len - 1) / 2;
      end   = i + len / 2;
    }
  }
  return s.substring(start, end + 1);
}
private int expand(String s, int l, int r) {
  while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
  return r - l - 1;
}`
  },

  // ─── Dynamic Programming - 2D (5) ───
  {
    num: 95, title: 'Unique Paths', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'Grid',
    url: 'https://leetcode.com/problems/unique-paths/',
    approach: 'dp[r][c] = ways to reach (r,c) = dp[r-1][c] + dp[r][c-1]. Compress to O(C) space with a rolling row.',
    complexity: 'O(m · n) time · O(n) space',
    code: `public int uniquePaths(int m, int n) {
  int[] row = new int[n];
  Arrays.fill(row, 1);
  for (int r = 1; r < m; r++) {
    for (int c = 1; c < n; c++) {
      row[c] += row[c - 1];
    }
  }
  return row[n - 1];
}`
  },
  {
    num: 96, title: 'Longest Common Subsequence', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'String',
    url: 'https://leetcode.com/problems/longest-common-subsequence/',
    approach: 'dp[i][j] = LCS length of text1[0..i] and text2[0..j]. If chars match: dp[i-1][j-1] + 1; else max(dp[i-1][j], dp[i][j-1]).',
    complexity: 'O(m · n) time · O(m · n) space',
    code: `public int longestCommonSubsequence(String a, String b) {
  int m = a.length(), n = b.length();
  int[][] dp = new int[m + 1][n + 1];
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (a.charAt(i - 1) == b.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`
  },
  {
    num: 97, title: 'Edit Distance', d: 'hard',
    bucket: 'Dynamic Programming - 2D', category: 'String',
    url: 'https://leetcode.com/problems/edit-distance/',
    approach: 'dp[i][j] = edits to turn word1[0..i] into word2[0..j]. If chars equal: inherit dp[i-1][j-1]. Else 1 + min(replace, delete, insert).',
    complexity: 'O(m · n) time · O(m · n) space',
    code: `public int minDistance(String word1, String word2) {
  int m = word1.length(), n = word2.length();
  int[][] dp = new int[m + 1][n + 1];
  for (int i = 0; i <= m; i++) dp[i][0] = i;
  for (int j = 0; j <= n; j++) dp[0][j] = j;
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
      }
    }
  }
  return dp[m][n];
}`
  },
  {
    num: 98, title: 'Partition Equal Subset Sum', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: '0/1 Knapsack',
    url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
    approach: 'Classic 0/1 knapsack rolled to 1D. Total sum must be even; target = sum / 2. dp[t] = can we make sum t? Walk amounts in reverse so each number is used at most once.',
    complexity: 'O(n · sum) time · O(sum) space',
    code: `public boolean canPartition(int[] nums) {
  int sum = 0;
  for (int n : nums) sum += n;
  if ((sum & 1) == 1) return false;
  int target = sum / 2;
  boolean[] dp = new boolean[target + 1];
  dp[0] = true;
  for (int n : nums) {
    for (int t = target; t >= n; t--) dp[t] = dp[t] || dp[t - n];
  }
  return dp[target];
}`
  },
  {
    num: 99, title: 'Maximal Square', d: 'medium',
    bucket: 'Dynamic Programming - 2D', category: 'Grid',
    url: 'https://leetcode.com/problems/maximal-square/',
    approach: 'dp[r][c] = side length of the largest all-1 square whose bottom-right is (r,c). If cell is 1: 1 + min(top, left, top-left). Track max side.',
    complexity: 'O(R · C) time · O(C) space (rolling row)',
    code: `public int maximalSquare(char[][] matrix) {
  int R = matrix.length, C = matrix[0].length, best = 0;
  int[] dp = new int[C + 1];
  int prev = 0;
  for (int r = 1; r <= R; r++) {
    for (int c = 1; c <= C; c++) {
      int tmp = dp[c];
      if (matrix[r - 1][c - 1] == '1') {
        dp[c] = 1 + Math.min(prev, Math.min(dp[c], dp[c - 1]));
        best = Math.max(best, dp[c]);
      } else {
        dp[c] = 0;
      }
      prev = tmp;
    }
  }
  return best * best;
}`
  },

  // ─── Greedy (2) ───
  {
    num: 100, title: 'Gas Station', d: 'medium',
    bucket: 'Greedy', category: 'Array',
    url: 'https://leetcode.com/problems/gas-station/',
    approach: 'If total gas - total cost < 0, impossible. Otherwise, the answer is the first index from which the running tank never goes negative — restart whenever it does.',
    complexity: 'O(n) time · O(1) space',
    code: `public int canCompleteCircuit(int[] gas, int[] cost) {
  int total = 0, tank = 0, start = 0;
  for (int i = 0; i < gas.length; i++) {
    int diff = gas[i] - cost[i];
    total += diff;
    tank  += diff;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total < 0 ? -1 : start;
}`
  }
];
