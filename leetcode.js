// Top 50 popular LeetCode interview questions with idiomatic Java solutions.
// Loaded as a classic <script src="leetcode.js"></script> — `leetcode` becomes
// available to the inline renderer in index.html.
//
// Shared node definitions assumed by the tree/linked-list solutions:
//   class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }
//   class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

const leetcode = [
  // ─── Arrays & Hashing ───
  {
    num: 1, title: 'Two Sum', d: 'easy',
    category: 'Array · Hash Map',
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
    category: 'Array · Greedy',
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
    category: 'Array · Hash Set',
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
    category: 'String · Hash Map',
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
    category: 'String · Hash Map',
    url: 'https://leetcode.com/problems/group-anagrams/',
    approach: 'Group by a canonical key — either the sorted string or a 26-char count signature. Sort version is shorter; count version is O(n·k) vs O(n·k log k).',
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
    category: 'Array · Heap · Bucket Sort',
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
    category: 'Array · Prefix Product',
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
    num: 8, title: 'Longest Consecutive Sequence', d: 'medium',
    category: 'Array · Hash Set',
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
    num: 9, title: 'Maximum Subarray', d: 'medium',
    category: 'Array · DP (Kadane)',
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
    num: 10, title: 'Maximum Product Subarray', d: 'medium',
    category: 'Array · DP',
    url: 'https://leetcode.com/problems/maximum-product-subarray/',
    approach: 'Track both the max AND min product ending at i — because multiplying a big negative by a new negative becomes a big positive. Swap them when nums[i] is negative.',
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

  // ─── Two Pointers ───
  {
    num: 11, title: 'Valid Palindrome', d: 'easy',
    category: 'Two Pointers · String',
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
    num: 12, title: '3Sum', d: 'medium',
    category: 'Array · Two Pointers',
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
    num: 13, title: 'Container With Most Water', d: 'medium',
    category: 'Two Pointers · Array',
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

  // ─── Sliding Window ───
  {
    num: 14, title: 'Longest Substring Without Repeating Characters', d: 'medium',
    category: 'Sliding Window · String',
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
    num: 15, title: 'Longest Repeating Character Replacement', d: 'medium',
    category: 'Sliding Window · String',
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
    num: 16, title: 'Minimum Window Substring', d: 'hard',
    category: 'Sliding Window · String',
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

  // ─── Stack ───
  {
    num: 17, title: 'Valid Parentheses', d: 'easy',
    category: 'Stack · String',
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
    num: 18, title: 'Min Stack', d: 'medium',
    category: 'Stack · Design',
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
  public void pop()        { stack.pop(); mins.pop(); }
  public int top()         { return stack.peek(); }
  public int getMin()      { return mins.peek(); }
}`
  },

  // ─── Binary Search ───
  {
    num: 19, title: 'Search in Rotated Sorted Array', d: 'medium',
    category: 'Binary Search · Array',
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
    num: 20, title: 'Find Minimum in Rotated Sorted Array', d: 'medium',
    category: 'Binary Search · Array',
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

  // ─── Linked List ───
  {
    num: 21, title: 'Reverse Linked List', d: 'easy',
    category: 'Linked List',
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
    num: 22, title: 'Merge Two Sorted Lists', d: 'easy',
    category: 'Linked List · Two Pointers',
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
    num: 23, title: 'Linked List Cycle', d: 'easy',
    category: 'Linked List · Two Pointers',
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
    num: 24, title: 'Remove Nth Node From End of List', d: 'medium',
    category: 'Linked List · Two Pointers',
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
    num: 25, title: 'Merge K Sorted Lists', d: 'hard',
    category: 'Linked List · Heap',
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

  // ─── Trees ───
  {
    num: 26, title: 'Invert Binary Tree', d: 'easy',
    category: 'Tree · Recursion',
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
    num: 27, title: 'Maximum Depth of Binary Tree', d: 'easy',
    category: 'Tree · Recursion',
    url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    approach: '1 + max(depth(left), depth(right)). Base case: null = 0.',
    complexity: 'O(n) time · O(h) space',
    code: `public int maxDepth(TreeNode root) {
  if (root == null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`
  },
  {
    num: 28, title: 'Same Tree', d: 'easy',
    category: 'Tree · Recursion',
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
    num: 29, title: 'Subtree of Another Tree', d: 'easy',
    category: 'Tree · Recursion',
    url: 'https://leetcode.com/problems/subtree-of-another-tree/',
    approach: 'For each node in root, check sameTree against subRoot. Reuse the helper from Same Tree.',
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
    num: 30, title: 'Binary Tree Level Order Traversal', d: 'medium',
    category: 'Tree · BFS',
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
    num: 31, title: 'Validate Binary Search Tree', d: 'medium',
    category: 'Tree · DFS',
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
    num: 32, title: 'Lowest Common Ancestor of BST', d: 'easy',
    category: 'Tree · BST',
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
    num: 33, title: 'Construct Binary Tree from Preorder and Inorder', d: 'medium',
    category: 'Tree · Recursion',
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

  // ─── Trie ───
  {
    num: 34, title: 'Implement Trie (Prefix Tree)', d: 'medium',
    category: 'Trie · Design',
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

  // ─── Heap / Priority Queue ───
  {
    num: 35, title: 'Kth Largest Element in an Array', d: 'medium',
    category: 'Heap · Quickselect',
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
    num: 36, title: 'Find Median from Data Stream', d: 'hard',
    category: 'Heap · Design',
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

  // ─── Backtracking ───
  {
    num: 37, title: 'Subsets', d: 'medium',
    category: 'Backtracking',
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
    num: 38, title: 'Permutations', d: 'medium',
    category: 'Backtracking',
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
    num: 39, title: 'Combination Sum', d: 'medium',
    category: 'Backtracking',
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

  // ─── Graphs ───
  {
    num: 40, title: 'Number of Islands', d: 'medium',
    category: 'Graph · DFS / BFS',
    url: 'https://leetcode.com/problems/number-of-islands/',
    approach: 'Walk the grid. On a \'1\', increment count and flood-fill (DFS) to mark the whole island as visited (overwrite to \'0\').',
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
    num: 41, title: 'Clone Graph', d: 'medium',
    category: 'Graph · DFS · Hash Map',
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
    num: 42, title: 'Course Schedule', d: 'medium',
    category: 'Graph · Topological Sort',
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
    num: 43, title: 'Pacific Atlantic Water Flow', d: 'medium',
    category: 'Graph · DFS',
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

  // ─── Dynamic Programming - 1D ───
  {
    num: 44, title: 'Climbing Stairs', d: 'easy',
    category: 'DP (1D) · Fibonacci',
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
    num: 45, title: 'House Robber', d: 'medium',
    category: 'DP (1D)',
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
    num: 46, title: 'Coin Change', d: 'medium',
    category: 'DP (1D) · Unbounded Knapsack',
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
    num: 47, title: 'Longest Increasing Subsequence', d: 'medium',
    category: 'DP (1D) · Binary Search',
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
    num: 48, title: 'Word Break', d: 'medium',
    category: 'DP (1D) · String',
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

  // ─── Dynamic Programming - 2D ───
  {
    num: 49, title: 'Unique Paths', d: 'medium',
    category: 'DP (2D) · Grid',
    url: 'https://leetcode.com/problems/unique-paths/',
    approach: 'dp[r][c] = ways to reach cell (r,c) = dp[r-1][c] + dp[r][c-1]. First row and column are all 1. Can compress to O(C) space with a rolling row.',
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
    num: 50, title: 'Longest Common Subsequence', d: 'medium',
    category: 'DP (2D) · String',
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
  }
];
