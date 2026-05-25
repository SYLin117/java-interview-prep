// Paraphrased problem descriptions keyed by leetcode.js `num`. Kept concise
// (2-4 sentences) so the user gets the gist without leaving the page.
// Loaded as a classic script before the inline renderer.

const leetcodeDescriptions = {
  // ── Arrays & Hashing ──
  1: 'Given an integer array <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers that add up to <code>target</code>. Exactly one solution exists; you may not use the same element twice.',
  2: 'Given an array <code>prices</code> where <code>prices[i]</code> is the stock price on day <em>i</em>, return the maximum profit from a single buy/sell transaction (buy on one day, sell on a later day). Return 0 if no profit is possible.',
  3: 'Given an integer array <code>nums</code>, return <code>true</code> if any value appears at least twice, or <code>false</code> if every element is distinct.',
  4: 'Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code> — uses exactly the same characters with the same counts.',
  5: 'Given an array of strings <code>strs</code>, group all anagrams together. Return the answer as a list of lists in any order.',
  6: 'Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements. Answer may be in any order.',
  7: 'Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> equals the product of all elements of <code>nums</code> except <code>nums[i]</code>. Solve without division and in O(n) time.',
  8: 'Given a partially-filled 9×9 Sudoku board, determine if it is valid. Only filled cells need to be validated against the standard rules (no duplicates in any row, column, or 3×3 sub-grid).',
  9: 'Given an unsorted integer array <code>nums</code>, return the length of the longest sequence of consecutive integers. Algorithm must run in O(n) time.',
  10: 'Design an algorithm to encode a list of strings into a single string, and decode it back to the original list. Strings may contain any characters.',
  11: 'Given an integer array <code>nums</code>, find the contiguous subarray with the largest sum and return that sum.',
  12: 'Given an integer array <code>nums</code>, find a contiguous non-empty subarray with the largest product and return that product.',
  13: 'Given an integer array <code>nums</code>, move all 0s to the end while keeping the relative order of the non-zero elements. Must be done in-place.',
  14: 'Given an array <code>nums</code> with <code>n</code> objects colored red (0), white (1), or blue (2), sort them in-place so colors are in order. Do it in a single pass.',
  15: 'Given an unsorted integer array <code>nums</code>, return the smallest positive integer not present. Must run in O(n) time and O(1) extra space.',
  16: 'Given an array of intervals where <code>intervals[i] = [start, end]</code>, merge all overlapping intervals and return the result.',
  17: 'Given an m×n matrix, return all elements of the matrix in spiral order (clockwise, starting from the top-left).',
  18: 'Given an n×n 2D matrix representing an image, rotate it by 90 degrees clockwise in-place.',

  // ── Two Pointers ──
  19: 'Given a string <code>s</code>, return <code>true</code> if it reads the same forward and backward, ignoring non-alphanumeric characters and case.',
  20: 'Given a 1-indexed sorted array <code>numbers</code> and a <code>target</code>, return the 1-based indices of the two numbers that sum to <code>target</code>. Use only constant extra space.',
  21: 'Given an integer array <code>nums</code>, return all unique triplets <code>[a, b, c]</code> such that <code>a + b + c == 0</code>. The result must not contain duplicate triplets.',
  22: 'Given an integer array <code>height</code> where each value is a vertical line height, find two lines that together with the x-axis form a container holding the most water. Return the maximum water area.',
  23: 'Given <code>n</code> non-negative integers representing an elevation map (each bar has width 1), compute how much rainwater can be trapped after raining.',
  24: 'Given a sorted integer array <code>nums</code>, remove duplicates in-place so each element appears once, and return the new length. The first <code>k</code> elements must reflect the result.',

  // ── Sliding Window ──
  25: 'Given a string <code>s</code>, return the length of the longest substring without repeating characters.',
  26: 'Given a string <code>s</code> and an integer <code>k</code>, you can replace up to <code>k</code> characters with any letter. Return the length of the longest resulting substring containing the same letter.',
  27: 'Given strings <code>s</code> and <code>t</code>, return the smallest window in <code>s</code> containing every character of <code>t</code> (counts included). Return empty string if no such window exists.',
  28: 'Given an array <code>prices</code>, you may complete as many transactions as you want (buy then sell), holding at most one share at a time. Return the maximum total profit.',
  29: 'Given two strings <code>s1</code> and <code>s2</code>, return <code>true</code> if <code>s2</code> contains any permutation of <code>s1</code> as a substring.',
  30: 'Given an integer array <code>nums</code> and an integer <code>k</code>, return the number of contiguous subarrays whose sum equals <code>k</code>.',
  31: 'Given an integer array <code>nums</code> and a window size <code>k</code>, return an array of the maximum value within each sliding window of size <code>k</code>.',

  // ── Stack ──
  32: 'Given a string containing only <code>()[]{}</code>, return <code>true</code> if every opener has a matching closer in the right order.',
  33: 'Design a stack supporting <code>push</code>, <code>pop</code>, <code>top</code>, and <code>getMin</code>, each in O(1) time.',
  34: 'Given an array of tokens representing an arithmetic expression in Reverse Polish (postfix) notation, evaluate the expression and return its integer value.',
  35: 'Given an integer array <code>temperatures</code>, return an array <code>answer</code> where <code>answer[i]</code> is the number of days until a warmer temperature, or 0 if no future day is warmer.',
  36: 'Given an encoded string of the form <code>k[encoded_string]</code> (the inner string repeated <em>k</em> times), return the decoded string. The encoding can be nested.',
  37: 'Given an integer array <code>heights</code> representing histogram bar heights (width 1 each), return the area of the largest rectangle that fits inside.',

  // ── Binary Search ──
  38: 'Given a sorted integer array <code>nums</code> and a <code>target</code>, return the index of <code>target</code> or -1 if absent. O(log n) required.',
  39: 'A sorted array was rotated at an unknown pivot. Given the rotated array <code>nums</code> and a <code>target</code>, return the index of <code>target</code> or -1. O(log n) required.',
  40: 'Given a sorted-then-rotated array <code>nums</code> of distinct values, return the minimum element. O(log n) required.',
  41: 'Given <code>n</code> versions and an API <code>isBadVersion(v)</code>, find the first bad version. Minimize the number of API calls.',
  42: 'Given two sorted arrays <code>nums1</code> and <code>nums2</code>, return the median of the merged sorted array. Required time complexity: O(log(m+n)).',
  43: 'Implement <code>pow(x, n)</code> — compute <code>x</code> raised to the power <code>n</code> — for any double <code>x</code> and any integer <code>n</code>.',

  // ── Linked List ──
  44: 'Given the head of a singly linked list, reverse the list and return the new head.',
  45: 'Merge two sorted linked lists into one sorted list by splicing nodes from the inputs. Return the head of the merged list.',
  46: 'Given the head of a linked list, determine if it contains a cycle.',
  47: 'Given the head of a linked list, remove the <em>n</em>-th node from the end and return the head.',
  48: 'Given an array of <code>k</code> sorted linked lists, merge them into one sorted linked list and return the head.',
  49: 'Two non-negative integers are represented as linked lists with one digit per node, stored in <strong>reverse</strong> order. Add them and return the sum as a linked list in the same format.',
  50: 'Given a linked list where each node has a <code>next</code> pointer and a <code>random</code> pointer (to any node or null), return a deep copy of the list.',
  51: 'Given the head of a singly linked list <code>L0→L1→...→Ln</code>, reorder it in-place to <code>L0→Ln→L1→Ln-1→L2→Ln-2→...</code>.',
  52: 'Given an array <code>nums</code> of <code>n+1</code> integers each in [1, n], find the one duplicate. Do not modify the array; use O(1) extra space.',
  53: 'Design an LRU (Least Recently Used) cache supporting <code>get(key)</code> and <code>put(key, value)</code> in O(1) average time.',
  54: 'Given the head of a linked list, sort it in ascending order. Aim for O(n log n) time and ideally constant extra space.',

  // ── Trees ──
  55: 'Given the root of a binary tree, invert it (mirror its structure) and return the root.',
  56: 'Given the root of a binary tree, return its maximum depth (root to deepest leaf).',
  57: 'Given the roots of two binary trees, return <code>true</code> if they are structurally identical with equal node values.',
  58: 'Given two binary trees <code>root</code> and <code>subRoot</code>, return <code>true</code> if <code>subRoot</code> appears as an identical subtree somewhere in <code>root</code>.',
  59: 'Given the root of a binary tree and a target sum, return <code>true</code> if there is a root-to-leaf path whose values sum to the target.',
  60: 'Given a binary tree, return <code>true</code> if it is height-balanced — every node\'s left and right subtree heights differ by at most 1.',
  61: 'Given the root of a binary tree, return <code>true</code> if it is symmetric (the left subtree is a mirror of the right).',
  62: 'Given the root of a binary tree, return its level-order traversal (each level as its own list, top-down).',
  63: 'Given the root of a binary tree, return the values of nodes visible from the right side, top to bottom.',
  64: 'Given the root of a binary tree, determine if it is a valid BST: every left descendant strictly less than its node, every right descendant strictly greater.',
  65: 'Given the root of a BST and an integer <code>k</code>, return the <em>k</em>-th smallest value (1-indexed).',
  66: 'Given a BST and two nodes <code>p</code> and <code>q</code>, return their lowest common ancestor.',
  67: 'Given the preorder and inorder traversals of a binary tree (all values distinct), reconstruct and return the tree.',
  68: 'Given the root of a binary tree, return the maximum sum of any path. A path is any sequence of nodes connected by edges; it need not pass through the root.',
  69: 'Design an algorithm to serialize a binary tree to a string and deserialize it back. The encoding may use any reasonable format.',
  70: 'Given the root of a binary tree and two nodes <code>p</code> and <code>q</code>, return their lowest common ancestor. A node may be its own descendant.',
  71: 'Given the root of a binary tree, return the length of the longest path between any two nodes (in edges). The path may not pass through the root.',

  // ── Tries ──
  72: 'Implement a Trie supporting <code>insert(word)</code>, <code>search(word)</code> (exact match), and <code>startsWith(prefix)</code>.',
  73: 'Design a data structure that supports adding words and searching for them, where <code>.</code> in a search matches any single letter.',

  // ── Heap / Priority Queue ──
  74: 'Given an integer array <code>nums</code> and an integer <code>k</code>, return the <em>k</em>-th largest element. Note: this is the <em>k</em>-th largest in sorted order, not the <em>k</em>-th distinct.',
  75: 'Design a data structure supporting <code>addNum(num)</code> and <code>findMedian()</code> for a streaming sequence of integers.',
  76: 'Given an n×n matrix where each row and column is sorted ascending, return the <em>k</em>-th smallest element of the whole matrix.',
  77: 'Given a string <code>s</code>, rearrange its characters so no two adjacent characters are the same. Return any valid arrangement, or empty string if impossible.',

  // ── Backtracking ──
  78: 'Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set). Order doesn\'t matter.',
  79: 'Given an array <code>nums</code> of distinct integers, return all possible permutations.',
  80: 'Given an array <code>candidates</code> of distinct positive integers and a <code>target</code>, return all unique combinations that sum to <code>target</code>. The same number may be used unlimited times.',
  81: 'Given a string of digits 2-9, return all possible letter combinations the number could represent (using the standard phone-keypad mapping).',
  82: 'Given <code>n</code>, return all combinations of <code>n</code> pairs of well-formed parentheses.',
  83: 'Place <code>n</code> queens on an n×n chessboard so that no two attack each other. Return all distinct solutions as board configurations.',

  // ── Graphs ──
  84: 'Given an m×n binary grid where <code>1</code> is land and <code>0</code> is water, count the number of islands (4-directional connectivity).',
  85: 'Given a reference to a node in a connected undirected graph, return a deep copy of the graph.',
  86: 'There are <code>numCourses</code> courses with prerequisite pairs. Return <code>true</code> if it is possible to finish all courses (no cyclic dependency).',
  87: 'Given an m×n matrix of heights with the Pacific touching the top/left edges and the Atlantic the bottom/right, return all cells from which water can flow to BOTH oceans.',
  88: 'In a grid each cell is empty (0), fresh (1), or rotten (2). Each minute, fresh oranges adjacent to a rotten one become rotten. Return the minimum minutes until none are fresh, or -1 if impossible.',
  89: 'Given an m×n grid of characters and a word, return <code>true</code> if the word exists in the grid — constructed from horizontally/vertically adjacent cells with no cell reused.',
  90: 'Given an m×n grid where -1 is a wall, 0 is a gate, and INF is an empty room, fill each empty room with the distance to its nearest gate. Modify the grid in-place.',
  91: 'Given an m×n board of <code>X</code> and <code>O</code>, flip any <code>O</code> region fully surrounded by <code>X</code> into <code>X</code>. <code>O</code> regions touching the border are NOT flipped.',

  // ── Advanced Graphs ──
  92: 'Given a directed weighted graph and a source node <code>k</code>, return the minimum time for a signal sent from <code>k</code> to reach all <code>n</code> nodes, or -1 if any node is unreachable.',
  93: 'Given a list of airline tickets <code>[from, to]</code>, reconstruct an itinerary starting from "JFK" that uses every ticket exactly once. If multiple are valid, return the lexicographically smallest.',
  94: 'Given <code>beginWord</code>, <code>endWord</code>, and a dictionary <code>wordList</code>, return the length of the shortest transformation sequence (each step changes one letter; intermediates must be in the dict), or 0 if no path exists.',

  // ── DP 1D ──
  95: 'You can climb 1 or 2 steps at a time. Given <code>n</code> total steps, return the number of distinct ways to climb to the top.',
  96: 'Given an array <code>nums</code> where each value is the loot at a house, return the maximum you can rob without robbing two adjacent houses.',
  97: 'Same as House Robber but houses are in a circle — the first and last houses are adjacent. Return the maximum loot.',
  98: 'Given coin denominations <code>coins</code> and an <code>amount</code>, return the fewest coins needed to make <code>amount</code>, or -1 if impossible. Each coin can be used unlimited times.',
  99: 'Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence. Aim for O(n log n).',
  100: 'Given a string <code>s</code> and a dictionary <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a sequence of dictionary words. Each word may be reused.',
  101: 'A message of digits is encoded with the mapping <code>A=1</code>, <code>B=2</code>, …, <code>Z=26</code>. Given a digit string <code>s</code>, return the number of ways to decode it.',
  102: 'Given an integer array <code>nums</code> where <code>nums[i]</code> is the max jump length at position <em>i</em> (starting at 0), return <code>true</code> if you can reach the last index.',
  103: 'Same as Jump Game but assume you can always reach the last index — return the <strong>minimum</strong> number of jumps required.',
  104: 'Given a string <code>s</code>, return the longest palindromic substring it contains.',

  // ── DP 2D ──
  105: 'A robot starts at the top-left of an m×n grid and wants to reach the bottom-right, moving only down or right. Return the number of unique paths.',
  106: 'Given two strings <code>text1</code> and <code>text2</code>, return the length of their longest common subsequence (no contiguity required).',
  107: 'Given two strings <code>word1</code> and <code>word2</code>, return the minimum number of operations (insert, delete, replace) to convert one into the other.',
  108: 'Given an integer array <code>nums</code>, return <code>true</code> if it can be partitioned into two subsets with equal sums.',
  109: 'Given an m×n binary matrix of <code>0</code> and <code>1</code>, find the largest square containing only <code>1</code>s and return its area.',

  // ── Greedy ──
  110: 'At <code>n</code> gas stations along a circular route, <code>gas[i]</code> is the gas at station <em>i</em> and <code>cost[i]</code> is the gas needed to reach station <em>i+1</em>. Return the starting station\'s index from which you can complete the circuit, or -1 if impossible.',
};
