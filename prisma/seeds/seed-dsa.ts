import prisma from "../../src/lib/prisma";

type TestCase = {
  input: string;
  expectedOutput: string;
  description: string;
};

type SeedExercise = {
  id: string;
  title: string;
  description: string;
  theory: string;
  problemStatement: string;
  inputExample: string;
  outputExample: string;
  hints: string[];
  constraints: string[];
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  language: "cpp" | "html" | "css" | "javascript";
  order: number;
};

type SeedChapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: SeedExercise[];
};

const DSA_COURSE = {
  id: "dsa-cpp-mastery",
  title: "Data Structures & Algorithms (C++)",
  shortDescription:
    "Master core DSA patterns through chapter-wise theory and interview-style practice.",
  description:
    "Build problem-solving confidence with a structured DSA path: Arrays, Sorting, Searching, Linked List, Trees, and Graphs. Every exercise includes theory, constraints, examples, and multiple test cases so beginners can learn concepts first, then solve problems like coding interview platforms.",
  category: "Programming",
  difficulty: "intermediate" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 60,
  enrolledCount: 0,
  rating: 4.9,
  tags: ["DSA", "Algorithms", "Data Structures", "C++", "Interview"],
};

const chapters: SeedChapter[] = [
  {
    id: "dsa-cpp-ch-arrays",
    title: "Arrays",
    description:
      "Learn traversal, prefix sums, rotations, and subarray optimization techniques.",
    order: 1,
    exercises: [
      {
        id: "dsa-cpp-ex-arrays-max-element",
        title: "Maximum Element in an Array",
        description: "Find the largest value in a list using one linear pass.",
        theory:
          "### Idea\nA linear scan is optimal for finding maximum in an unsorted array.\n\n### Why it works\nMaintain a variable `best` as the largest value seen so far. For each element, update `best = max(best, element)`.\n\n### Complexity\n- Time: O(n)\n- Space: O(1)",
        problemStatement:
          "Given an integer array, return the maximum element. Array size is at least 1.",
        inputExample: "5\n3 9 2 17 4",
        outputExample: "17",
        hints: [
          "Initialize answer with the first element.",
          "Compare every next element with current best.",
          "Handle negative-only arrays correctly.",
        ],
        constraints: ["1 <= n <= 2*10^5", "-10^9 <= arr[i] <= 10^9"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint findMax(const vector<int>& arr) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  int n; cin >> n;\n  vector<int> arr(n);\n  for (int i = 0; i < n; i++) cin >> arr[i];\n  cout << findMax(arr);\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint findMax(const vector<int>& arr) {\n  int best = arr[0];\n  for (int i = 1; i < (int)arr.size(); i++) best = max(best, arr[i]);\n  return best;\n}\n\nint main() {\n  int n; cin >> n;\n  vector<int> arr(n);\n  for (int i = 0; i < n; i++) cin >> arr[i];\n  cout << findMax(arr);\n}\n",
        testCases: [
          {
            input: "5\n3 9 2 17 4",
            expectedOutput: "17",
            description: "normal array",
          },
          {
            input: "4\n-7 -2 -11 -4",
            expectedOutput: "-2",
            description: "all negatives",
          },
          {
            input: "1\n42",
            expectedOutput: "42",
            description: "single element",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "dsa-cpp-ex-arrays-prefix-sum-range",
        title: "Range Sum Query using Prefix Sum",
        description:
          "Answer multiple sum queries quickly using precomputation.",
        theory:
          "### Idea\nPrefix sum array stores cumulative sum up to index i.\n\n### Query Formula\nSum(l..r) = pref[r] - pref[l-1] (when l > 0).\n\n### Complexity\n- Build: O(n)\n- Each query: O(1)",
        problemStatement:
          "Given an array and q queries (l, r), output sum of elements from l to r inclusive (0-indexed).",
        inputExample: "5\n1 2 3 4 5\n3\n0 2\n1 3\n2 4",
        outputExample: "6\n9\n12",
        hints: [
          "Build prefix array where pref[i] = pref[i-1] + arr[i].",
          "Careful when l = 0.",
          "Use long long for large sums.",
        ],
        constraints: ["1 <= n, q <= 2*10^5", "-10^6 <= arr[i] <= 10^6"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n; cin >> n;\n  vector<long long> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  int q; cin >> q;\n\n  // TODO: build prefix and answer queries\n\n  return 0;\n}\n",
        solution:
          '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n; cin >> n;\n  vector<long long> a(n), pref(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n\n  pref[0] = a[0];\n  for (int i = 1; i < n; i++) pref[i] = pref[i - 1] + a[i];\n\n  int q; cin >> q;\n  while (q--) {\n    int l, r; cin >> l >> r;\n    long long ans = pref[r] - (l > 0 ? pref[l - 1] : 0LL);\n    cout << ans << "\\n";\n  }\n}\n',
        testCases: [
          {
            input: "5\n1 2 3 4 5\n3\n0 2\n1 3\n2 4",
            expectedOutput: "6\n9\n12",
            description: "sample queries",
          },
          {
            input: "4\n10 -2 7 3\n2\n0 3\n2 2",
            expectedOutput: "18\n7",
            description: "mixed numbers",
          },
          {
            input: "3\n5 5 5\n1\n0 0",
            expectedOutput: "5",
            description: "single index query",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "cpp",
        order: 2,
      },
      {
        id: "dsa-cpp-ex-arrays-rotate-by-k",
        title: "Rotate Array by K",
        description: "Rotate elements to the right by k positions.",
        theory:
          "### Idea\nRight rotation by k can be done by reverse operations: reverse whole array, reverse first k, reverse remaining n-k.\n\n### Why this method\nIn-place and avoids extra O(n) array.\n\n### Complexity\n- Time: O(n)\n- Space: O(1)",
        problemStatement:
          "Given n integers and integer k, rotate the array to the right by k steps and print the resulting array.",
        inputExample: "7 3\n1 2 3 4 5 6 7",
        outputExample: "5 6 7 1 2 3 4",
        hints: [
          "Reduce k with k %= n.",
          "Use reverse on ranges.",
          "Check edge case k = 0.",
        ],
        constraints: ["1 <= n <= 2*10^5", "0 <= k <= 10^9"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, k; cin >> n >> k;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n\n  // TODO: rotate right by k\n\n  for (int x : a) cout << x << ' ';\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, k; cin >> n >> k;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n\n  k %= n;\n  reverse(a.begin(), a.end());\n  reverse(a.begin(), a.begin() + k);\n  reverse(a.begin() + k, a.end());\n\n  for (int i = 0; i < n; i++) {\n    if (i) cout << ' ';\n    cout << a[i];\n  }\n}\n",
        testCases: [
          {
            input: "7 3\n1 2 3 4 5 6 7",
            expectedOutput: "5 6 7 1 2 3 4",
            description: "basic rotate",
          },
          {
            input: "5 8\n10 20 30 40 50",
            expectedOutput: "30 40 50 10 20",
            description: "k greater than n",
          },
          {
            input: "4 0\n9 8 7 6",
            expectedOutput: "9 8 7 6",
            description: "no rotation",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "dsa-cpp-ex-arrays-kadane-max-subarray",
        title: "Maximum Subarray Sum (Kadane)",
        description: "Compute the maximum sum of any contiguous subarray.",
        theory:
          "### Idea\nKadane keeps best sum ending at current index. At each step, either extend previous subarray or start fresh.\n\n### Transition\ncurrent = max(arr[i], current + arr[i])\nbest = max(best, current)\n\n### Complexity\n- Time: O(n)\n- Space: O(1)",
        problemStatement:
          "Given an array, find the largest possible sum over all contiguous subarrays.",
        inputExample: "8\n-2 1 -3 4 -1 2 1 -5",
        outputExample: "6",
        hints: [
          "Track two values: current and global best.",
          "Handle all-negative arrays by initializing with first element.",
          "Do not sort the array.",
        ],
        constraints: ["1 <= n <= 2*10^5", "-10^9 <= arr[i] <= 10^9"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long maxSubarray(const vector<long long>& a) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  int n; cin >> n;\n  vector<long long> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << maxSubarray(a);\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long maxSubarray(const vector<long long>& a) {\n  long long current = a[0], best = a[0];\n  for (int i = 1; i < (int)a.size(); i++) {\n    current = max(a[i], current + a[i]);\n    best = max(best, current);\n  }\n  return best;\n}\n\nint main() {\n  int n; cin >> n;\n  vector<long long> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << maxSubarray(a);\n}\n",
        testCases: [
          {
            input: "8\n-2 1 -3 4 -1 2 1 -5",
            expectedOutput: "6",
            description: "standard sample",
          },
          {
            input: "5\n-8 -3 -6 -2 -5",
            expectedOutput: "-2",
            description: "all negative",
          },
          {
            input: "6\n1 2 3 4 5 6",
            expectedOutput: "21",
            description: "all positive",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "dsa-cpp-ch-sorting",
    title: "Sorting",
    description:
      "Practice comparison and partition-based techniques for ordering data efficiently.",
    order: 2,
    exercises: [
      {
        id: "dsa-cpp-ex-sorting-bubble-sort",
        title: "Bubble Sort Basics",
        description: "Implement bubble sort and print sorted output.",
        theory:
          "### Idea\nBubble sort repeatedly swaps adjacent out-of-order elements.\n\n### Learning goal\nUnderstand stable comparison-based sorting and nested loop behavior.\n\n### Complexity\n- Time: O(n^2)\n- Space: O(1)",
        problemStatement:
          "Sort an integer array in non-decreasing order using bubble sort.",
        inputExample: "5\n5 1 4 2 8",
        outputExample: "1 2 4 5 8",
        hints: [
          "Outer loop decides passes.",
          "Inner loop compares j and j+1.",
          "Optional optimization: stop if no swap in a pass.",
        ],
        constraints: ["1 <= n <= 2000", "-10^5 <= arr[i] <= 10^5"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n; cin >> n;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n\n  // TODO: bubble sort\n\n  for (int i = 0; i < n; i++) {\n    if (i) cout << ' ';\n    cout << a[i];\n  }\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n; cin >> n;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n\n  for (int i = 0; i < n - 1; i++) {\n    bool swapped = false;\n    for (int j = 0; j < n - 1 - i; j++) {\n      if (a[j] > a[j + 1]) {\n        swap(a[j], a[j + 1]);\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n\n  for (int i = 0; i < n; i++) {\n    if (i) cout << ' ';\n    cout << a[i];\n  }\n}\n",
        testCases: [
          {
            input: "5\n5 1 4 2 8",
            expectedOutput: "1 2 4 5 8",
            description: "sample",
          },
          {
            input: "4\n1 2 3 4",
            expectedOutput: "1 2 3 4",
            description: "already sorted",
          },
          {
            input: "6\n3 3 2 1 2 1",
            expectedOutput: "1 1 2 2 3 3",
            description: "duplicates",
          },
        ],
        xpReward: 70,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "dsa-cpp-ex-sorting-merge-two-sorted",
        title: "Merge Two Sorted Arrays",
        description:
          "Merge two sorted arrays into one sorted sequence using two pointers.",
        theory:
          "### Idea\nWhen both arrays are sorted, compare front elements and take smaller one.\n\n### Pattern\nTwo pointers is foundational for merge sort and interval problems.\n\n### Complexity\n- Time: O(n + m)\n- Space: O(n + m)",
        problemStatement:
          "Given sorted arrays A and B, output a single sorted array containing all elements.",
        inputExample: "4 3\n1 4 7 10\n2 5 8",
        outputExample: "1 2 4 5 7 8 10",
        hints: [
          "Use i for A and j for B.",
          "Append leftovers after one pointer ends.",
          "Print in one line separated by spaces.",
        ],
        constraints: ["1 <= n, m <= 2*10^5", "-10^9 <= value <= 10^9"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, m; cin >> n >> m;\n  vector<long long> a(n), b(m);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  for (int j = 0; j < m; j++) cin >> b[j];\n\n  // TODO: merge and print\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, m; cin >> n >> m;\n  vector<long long> a(n), b(m), ans;\n  for (int i = 0; i < n; i++) cin >> a[i];\n  for (int j = 0; j < m; j++) cin >> b[j];\n\n  int i = 0, j = 0;\n  while (i < n && j < m) {\n    if (a[i] <= b[j]) ans.push_back(a[i++]);\n    else ans.push_back(b[j++]);\n  }\n  while (i < n) ans.push_back(a[i++]);\n  while (j < m) ans.push_back(b[j++]);\n\n  for (int k = 0; k < (int)ans.size(); k++) {\n    if (k) cout << ' ';\n    cout << ans[k];\n  }\n}\n",
        testCases: [
          {
            input: "4 3\n1 4 7 10\n2 5 8",
            expectedOutput: "1 2 4 5 7 8 10",
            description: "interleaving arrays",
          },
          {
            input: "3 2\n1 2 3\n4 5",
            expectedOutput: "1 2 3 4 5",
            description: "all from first then second",
          },
          {
            input: "2 4\n10 20\n1 2 3 4",
            expectedOutput: "1 2 3 4 10 20",
            description: "all from second then first",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "cpp",
        order: 2,
      },
      {
        id: "dsa-cpp-ex-sorting-quick-sort-partition",
        title: "Quick Sort Partition",
        description: "Implement Lomuto partition and return pivot final index.",
        theory:
          "### Idea\nPartition places pivot in final sorted position with smaller elements left and larger right.\n\n### Why important\nPartition is the core primitive behind quick sort and selection algorithms.\n\n### Complexity\n- Time: O(n) for one partition\n- Space: O(1)",
        problemStatement:
          "Given array and pivot as last element, perform Lomuto partition on full array and print pivot index after partition.",
        inputExample: "7\n9 3 4 8 2 7 5",
        outputExample: "3",
        hints: [
          "Keep i as boundary of <= pivot region.",
          "Iterate j from 0 to n-2.",
          "Swap pivot with a[i+1] at end.",
        ],
        constraints: ["1 <= n <= 2*10^5", "-10^9 <= arr[i] <= 10^9"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint partitionLomuto(vector<int>& a) {\n  // TODO\n  return -1;\n}\n\nint main() {\n  int n; cin >> n;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << partitionLomuto(a);\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint partitionLomuto(vector<int>& a) {\n  int pivot = a.back();\n  int i = -1;\n  for (int j = 0; j < (int)a.size() - 1; j++) {\n    if (a[j] <= pivot) {\n      i++;\n      swap(a[i], a[j]);\n    }\n  }\n  swap(a[i + 1], a.back());\n  return i + 1;\n}\n\nint main() {\n  int n; cin >> n;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << partitionLomuto(a);\n}\n",
        testCases: [
          {
            input: "7\n9 3 4 8 2 7 5",
            expectedOutput: "3",
            description: "mixed values",
          },
          {
            input: "5\n1 2 3 4 5",
            expectedOutput: "4",
            description: "pivot largest",
          },
          {
            input: "5\n5 4 3 2 1",
            expectedOutput: "0",
            description: "pivot smallest",
          },
        ],
        xpReward: 140,
        difficulty: "hard",
        language: "cpp",
        order: 3,
      },
      {
        id: "dsa-cpp-ex-sorting-sort-colors",
        title: "Sort Colors (Dutch National Flag)",
        description: "Sort array of 0,1,2 in one pass with three pointers.",
        theory:
          "### Idea\nMaintain regions: [0..low-1]=0s, [low..mid-1]=1s, [high+1..n-1]=2s.\n\n### Decision\n- if a[mid]==0: swap(low,mid), low++, mid++\n- if a[mid]==1: mid++\n- if a[mid]==2: swap(mid,high), high--\n\n### Complexity\n- Time: O(n)\n- Space: O(1)",
        problemStatement:
          "Given array containing only 0, 1, 2, sort it in-place without counting sort.",
        inputExample: "6\n2 0 2 1 1 0",
        outputExample: "0 0 1 1 2 2",
        hints: [
          "Use low, mid, high pointers.",
          "Do not increment mid when swapping with high.",
          "Single traversal is enough.",
        ],
        constraints: ["1 <= n <= 2*10^5", "arr[i] in {0,1,2}"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n; cin >> n;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n\n  // TODO: dutch national flag\n\n  for (int i = 0; i < n; i++) {\n    if (i) cout << ' ';\n    cout << a[i];\n  }\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n; cin >> n;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n\n  int low = 0, mid = 0, high = n - 1;\n  while (mid <= high) {\n    if (a[mid] == 0) swap(a[low++], a[mid++]);\n    else if (a[mid] == 1) mid++;\n    else swap(a[mid], a[high--]);\n  }\n\n  for (int i = 0; i < n; i++) {\n    if (i) cout << ' ';\n    cout << a[i];\n  }\n}\n",
        testCases: [
          {
            input: "6\n2 0 2 1 1 0",
            expectedOutput: "0 0 1 1 2 2",
            description: "sample",
          },
          {
            input: "4\n0 0 0 0",
            expectedOutput: "0 0 0 0",
            description: "already uniform",
          },
          {
            input: "5\n2 2 1 0 1",
            expectedOutput: "0 1 1 2 2",
            description: "mixed",
          },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "dsa-cpp-ch-searching",
    title: "Searching",
    description:
      "Cover linear and binary search families with boundary and rotated-array variants.",
    order: 3,
    exercises: [
      {
        id: "dsa-cpp-ex-searching-linear-search",
        title: "Linear Search",
        description:
          "Scan array left to right and return first index of target.",
        theory:
          "### Idea\nLinear search checks every element until target is found.\n\n### Use case\nBest for unsorted arrays or very small datasets.\n\n### Complexity\n- Time: O(n)\n- Space: O(1)",
        problemStatement:
          "Given array and target x, print first index of x. If not found, print -1.",
        inputExample: "6 14\n7 3 14 2 9 14",
        outputExample: "2",
        hints: [
          "Start from index 0.",
          "Return immediately on first match.",
          "If loop ends, answer is -1.",
        ],
        constraints: ["1 <= n <= 2*10^5", "-10^9 <= arr[i], x <= 10^9"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint firstIndex(const vector<long long>& a, long long x) {\n  // TODO\n  return -1;\n}\n\nint main() {\n  int n; long long x; cin >> n >> x;\n  vector<long long> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << firstIndex(a, x);\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint firstIndex(const vector<long long>& a, long long x) {\n  for (int i = 0; i < (int)a.size(); i++) {\n    if (a[i] == x) return i;\n  }\n  return -1;\n}\n\nint main() {\n  int n; long long x; cin >> n >> x;\n  vector<long long> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << firstIndex(a, x);\n}\n",
        testCases: [
          {
            input: "6 14\n7 3 14 2 9 14",
            expectedOutput: "2",
            description: "first occurrence",
          },
          {
            input: "5 8\n1 2 3 4 5",
            expectedOutput: "-1",
            description: "not present",
          },
          {
            input: "1 10\n10",
            expectedOutput: "0",
            description: "single element",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "dsa-cpp-ex-searching-binary-search",
        title: "Binary Search",
        description: "Find target in sorted array using divide-and-conquer.",
        theory:
          "### Idea\nBinary search halves search space each step based on middle comparison.\n\n### Preconditions\nArray must be sorted in non-decreasing order.\n\n### Complexity\n- Time: O(log n)\n- Space: O(1)",
        problemStatement:
          "Given sorted array and target x, return index of x if found; otherwise return -1.",
        inputExample: "7 11\n2 5 7 11 14 19 25",
        outputExample: "3",
        hints: [
          "Use low/high pointers.",
          "Compute mid as low + (high-low)/2.",
          "Move to right half when a[mid] < x.",
        ],
        constraints: [
          "1 <= n <= 2*10^5",
          "Array is sorted",
          "-10^9 <= value <= 10^9",
        ],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint binarySearch(const vector<long long>& a, long long x) {\n  // TODO\n  return -1;\n}\n\nint main() {\n  int n; long long x; cin >> n >> x;\n  vector<long long> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << binarySearch(a, x);\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint binarySearch(const vector<long long>& a, long long x) {\n  int low = 0, high = (int)a.size() - 1;\n  while (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (a[mid] == x) return mid;\n    if (a[mid] < x) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}\n\nint main() {\n  int n; long long x; cin >> n >> x;\n  vector<long long> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << binarySearch(a, x);\n}\n",
        testCases: [
          {
            input: "7 11\n2 5 7 11 14 19 25",
            expectedOutput: "3",
            description: "found in middle",
          },
          {
            input: "5 1\n1 4 8 10 12",
            expectedOutput: "0",
            description: "first index",
          },
          {
            input: "5 9\n1 4 8 10 12",
            expectedOutput: "-1",
            description: "not found",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "dsa-cpp-ex-searching-first-last-position",
        title: "First and Last Position of Target",
        description:
          "Use modified binary search to find occurrence boundaries.",
        theory:
          "### Idea\nRun two binary searches: one biased left for first position, one biased right for last position.\n\n### Pattern\nThis boundary-search pattern appears in frequency queries and range-based problems.\n\n### Complexity\n- Time: O(log n)\n- Space: O(1)",
        problemStatement:
          "Given sorted array and x, output first and last index of x as `l r`; print `-1 -1` if absent.",
        inputExample: "8 4\n1 2 4 4 4 6 7 9",
        outputExample: "2 4",
        hints: [
          "Create lowerBound and upperBound style functions.",
          "Store candidate answer when equal and continue searching.",
          "If first remains -1, last is also -1.",
        ],
        constraints: ["1 <= n <= 2*10^5", "Array sorted"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\npair<int,int> findRange(const vector<int>& a, int x) {\n  // TODO\n  return {-1, -1};\n}\n\nint main() {\n  int n, x; cin >> n >> x;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  auto [l, r] = findRange(a, x);\n  cout << l << ' ' << r;\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint firstPos(const vector<int>& a, int x) {\n  int low = 0, high = (int)a.size() - 1, ans = -1;\n  while (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (a[mid] >= x) high = mid - 1;\n    else low = mid + 1;\n    if (a[mid] == x) ans = mid;\n  }\n  return ans;\n}\n\nint lastPos(const vector<int>& a, int x) {\n  int low = 0, high = (int)a.size() - 1, ans = -1;\n  while (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (a[mid] <= x) low = mid + 1;\n    else high = mid - 1;\n    if (a[mid] == x) ans = mid;\n  }\n  return ans;\n}\n\npair<int,int> findRange(const vector<int>& a, int x) {\n  int l = firstPos(a, x);\n  if (l == -1) return {-1, -1};\n  return {l, lastPos(a, x)};\n}\n\nint main() {\n  int n, x; cin >> n >> x;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  auto [l, r] = findRange(a, x);\n  cout << l << ' ' << r;\n}\n",
        testCases: [
          {
            input: "8 4\n1 2 4 4 4 6 7 9",
            expectedOutput: "2 4",
            description: "multiple occurrences",
          },
          {
            input: "5 3\n1 2 4 5 6",
            expectedOutput: "-1 -1",
            description: "absent target",
          },
          {
            input: "6 7\n7 7 7 7 7 7",
            expectedOutput: "0 5",
            description: "all same",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "dsa-cpp-ex-searching-rotated-array",
        title: "Search in Rotated Sorted Array",
        description: "Apply binary-search logic on rotated monotonic segments.",
        theory:
          "### Idea\nAt any mid, one half is always sorted. Determine sorted half, then check if target belongs there.\n\n### Key observation\nIf a[low] <= a[mid], left side is sorted; otherwise right side is sorted.\n\n### Complexity\n- Time: O(log n)\n- Space: O(1)",
        problemStatement:
          "Given a rotated sorted array with distinct values and target x, print index of x or -1.",
        inputExample: "7 0\n4 5 6 7 0 1 2",
        outputExample: "4",
        hints: [
          "Decide which half is sorted first.",
          "Then decide if target lies in that half.",
          "Narrow range accordingly.",
        ],
        constraints: ["1 <= n <= 2*10^5", "All elements distinct"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint searchRotated(const vector<int>& a, int x) {\n  // TODO\n  return -1;\n}\n\nint main() {\n  int n, x; cin >> n >> x;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << searchRotated(a, x);\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint searchRotated(const vector<int>& a, int x) {\n  int low = 0, high = (int)a.size() - 1;\n  while (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (a[mid] == x) return mid;\n\n    if (a[low] <= a[mid]) {\n      if (a[low] <= x && x < a[mid]) high = mid - 1;\n      else low = mid + 1;\n    } else {\n      if (a[mid] < x && x <= a[high]) low = mid + 1;\n      else high = mid - 1;\n    }\n  }\n  return -1;\n}\n\nint main() {\n  int n, x; cin >> n >> x;\n  vector<int> a(n);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  cout << searchRotated(a, x);\n}\n",
        testCases: [
          {
            input: "7 0\n4 5 6 7 0 1 2",
            expectedOutput: "4",
            description: "found in rotated part",
          },
          {
            input: "7 3\n4 5 6 7 0 1 2",
            expectedOutput: "-1",
            description: "absent target",
          },
          {
            input: "5 1\n1 2 3 4 5",
            expectedOutput: "0",
            description: "not rotated",
          },
        ],
        xpReward: 150,
        difficulty: "hard",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "dsa-cpp-ch-linked-list",
    title: "Linked List",
    description:
      "Develop pointer manipulation skills with classic linked-list interview patterns.",
    order: 4,
    exercises: [
      {
        id: "dsa-cpp-ex-ll-reverse-linked-list",
        title: "Reverse Linked List",
        description: "Reverse a singly linked list iteratively.",
        theory:
          "### Idea\nUse three pointers: prev, curr, next. Rewire curr->next to prev while moving forward.\n\n### Why it matters\nPointer reversal appears in many list transformations.\n\n### Complexity\n- Time: O(n)\n- Space: O(1)",
        problemStatement:
          "Given list values, reverse the list and print values from new head to tail.",
        inputExample: "5\n1 2 3 4 5",
        outputExample: "5 4 3 2 1",
        hints: [
          "Track next before changing pointers.",
          "Move prev and curr one step each loop.",
          "Return prev at end.",
        ],
        constraints: ["1 <= n <= 2*10^5", "-10^9 <= node value <= 10^9"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* next;\n  Node(int v) : val(v), next(nullptr) {}\n};\n\nNode* reverseList(Node* head) {\n  // TODO\n  return head;\n}\n\nint main() {\n  int n; cin >> n;\n  Node* head = nullptr; Node* tail = nullptr;\n  for (int i = 0; i < n; i++) {\n    int x; cin >> x;\n    Node* node = new Node(x);\n    if (!head) head = tail = node; else { tail->next = node; tail = node; }\n  }\n  head = reverseList(head);\n  for (Node* cur = head; cur; cur = cur->next) {\n    if (cur != head) cout << ' ';\n    cout << cur->val;\n  }\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* next;\n  Node(int v) : val(v), next(nullptr) {}\n};\n\nNode* reverseList(Node* head) {\n  Node* prev = nullptr;\n  Node* curr = head;\n  while (curr) {\n    Node* nextNode = curr->next;\n    curr->next = prev;\n    prev = curr;\n    curr = nextNode;\n  }\n  return prev;\n}\n\nint main() {\n  int n; cin >> n;\n  Node* head = nullptr; Node* tail = nullptr;\n  for (int i = 0; i < n; i++) {\n    int x; cin >> x;\n    Node* node = new Node(x);\n    if (!head) head = tail = node; else { tail->next = node; tail = node; }\n  }\n  head = reverseList(head);\n  for (Node* cur = head; cur; cur = cur->next) {\n    if (cur != head) cout << ' ';\n    cout << cur->val;\n  }\n}\n",
        testCases: [
          {
            input: "5\n1 2 3 4 5",
            expectedOutput: "5 4 3 2 1",
            description: "normal list",
          },
          { input: "1\n9", expectedOutput: "9", description: "single node" },
          {
            input: "4\n7 7 7 7",
            expectedOutput: "7 7 7 7",
            description: "same values",
          },
        ],
        xpReward: 90,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "dsa-cpp-ex-ll-detect-cycle",
        title: "Detect Cycle in Linked List",
        description: "Use Floyd's two-pointer method to detect loop.",
        theory:
          "### Idea\nSlow pointer moves 1 step, fast pointer moves 2. If cycle exists, they meet.\n\n### Why this works\nRelative speed guarantees collision inside cycle.\n\n### Complexity\n- Time: O(n)\n- Space: O(1)",
        problemStatement:
          "Given list values and position `pos` where tail connects (-1 means no cycle), print `true` if cycle exists else `false`.",
        inputExample: "4\n3 2 0 -4\n1",
        outputExample: "true",
        hints: [
          "Initialize both pointers at head.",
          "Check fast and fast->next before moving.",
          "Meeting point implies cycle.",
        ],
        constraints: ["0 <= n <= 2*10^5", "-1 <= pos < n"],
        starterCode:
          '#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* next;\n  Node(int v) : val(v), next(nullptr) {}\n};\n\nbool hasCycle(Node* head) {\n  // TODO\n  return false;\n}\n\nint main() {\n  int n; cin >> n;\n  vector<Node*> nodes;\n  for (int i = 0; i < n; i++) {\n    int x; cin >> x;\n    nodes.push_back(new Node(x));\n    if (i > 0) nodes[i - 1]->next = nodes[i];\n  }\n  int pos; cin >> pos;\n  if (n > 0 && pos >= 0) nodes[n - 1]->next = nodes[pos];\n  cout << (hasCycle(n ? nodes[0] : nullptr) ? "true" : "false");\n}\n',
        solution:
          '#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* next;\n  Node(int v) : val(v), next(nullptr) {}\n};\n\nbool hasCycle(Node* head) {\n  Node* slow = head;\n  Node* fast = head;\n  while (fast && fast->next) {\n    slow = slow->next;\n    fast = fast->next->next;\n    if (slow == fast) return true;\n  }\n  return false;\n}\n\nint main() {\n  int n; cin >> n;\n  vector<Node*> nodes;\n  for (int i = 0; i < n; i++) {\n    int x; cin >> x;\n    nodes.push_back(new Node(x));\n    if (i > 0) nodes[i - 1]->next = nodes[i];\n  }\n  int pos; cin >> pos;\n  if (n > 0 && pos >= 0) nodes[n - 1]->next = nodes[pos];\n  cout << (hasCycle(n ? nodes[0] : nullptr) ? "true" : "false");\n}\n',
        testCases: [
          {
            input: "4\n3 2 0 -4\n1",
            expectedOutput: "true",
            description: "cycle exists",
          },
          {
            input: "3\n1 2 3\n-1",
            expectedOutput: "false",
            description: "no cycle",
          },
          {
            input: "1\n5\n0",
            expectedOutput: "true",
            description: "single node self-loop",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "cpp",
        order: 2,
      },
      {
        id: "dsa-cpp-ex-ll-merge-sorted-lists",
        title: "Merge Two Sorted Linked Lists",
        description: "Merge two sorted linked lists into one sorted list.",
        theory:
          "### Idea\nUse a dummy head and repeatedly attach smaller current node from list1/list2.\n\n### Pattern\nDummy node simplifies edge handling in linked-list merges.\n\n### Complexity\n- Time: O(n + m)\n- Space: O(1) extra",
        problemStatement:
          "Given two sorted linked lists, merge and print resulting list.",
        inputExample: "3 3\n1 2 4\n1 3 4",
        outputExample: "1 1 2 3 4 4",
        hints: [
          "Use dummy node and tail pointer.",
          "Move pointer from list whose value you take.",
          "Attach remaining nodes at end.",
        ],
        constraints: ["0 <= n, m <= 2*10^5"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, m; cin >> n >> m;\n  vector<int> a(n), b(m);\n  for (int i = 0; i < n; i++) cin >> a[i];\n  for (int j = 0; j < m; j++) cin >> b[j];\n\n  // TODO: merge sorted sequences and print\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, m; cin >> n >> m;\n  vector<int> a(n), b(m), ans;\n  for (int i = 0; i < n; i++) cin >> a[i];\n  for (int j = 0; j < m; j++) cin >> b[j];\n\n  int i = 0, j = 0;\n  while (i < n && j < m) {\n    if (a[i] <= b[j]) ans.push_back(a[i++]);\n    else ans.push_back(b[j++]);\n  }\n  while (i < n) ans.push_back(a[i++]);\n  while (j < m) ans.push_back(b[j++]);\n\n  for (int k = 0; k < (int)ans.size(); k++) {\n    if (k) cout << ' ';\n    cout << ans[k];\n  }\n}\n",
        testCases: [
          {
            input: "3 3\n1 2 4\n1 3 4",
            expectedOutput: "1 1 2 3 4 4",
            description: "sample",
          },
          {
            input: "0 2\n\n5 6",
            expectedOutput: "5 6",
            description: "first empty",
          },
          {
            input: "2 0\n7 8\n",
            expectedOutput: "7 8",
            description: "second empty",
          },
        ],
        xpReward: 90,
        difficulty: "easy",
        language: "cpp",
        order: 3,
      },
      {
        id: "dsa-cpp-ex-ll-remove-nth-end",
        title: "Remove Nth Node From End",
        description: "Remove the nth node from end using two-pointer gap.",
        theory:
          "### Idea\nMove fast pointer n steps ahead, then move fast and slow together until fast reaches end. Slow lands before target node.\n\n### Technique\nDummy head avoids special-case when deleting original head.\n\n### Complexity\n- Time: O(n)\n- Space: O(1)",
        problemStatement:
          "Given list and n, delete nth node from end and print updated list.",
        inputExample: "5 2\n1 2 3 4 5",
        outputExample: "1 2 3 5",
        hints: [
          "Use dummy node before head.",
          "Advance fast by n first.",
          "Then move both until fast->next is null.",
        ],
        constraints: ["1 <= n <= list length", "1 <= length <= 2*10^5"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int len, n; cin >> len >> n;\n  vector<int> a(len);\n  for (int i = 0; i < len; i++) cin >> a[i];\n\n  // TODO: remove nth from end and print\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int len, n; cin >> len >> n;\n  vector<int> a(len);\n  for (int i = 0; i < len; i++) cin >> a[i];\n\n  int removeIdx = len - n;\n  vector<int> ans;\n  for (int i = 0; i < len; i++) if (i != removeIdx) ans.push_back(a[i]);\n\n  for (int i = 0; i < (int)ans.size(); i++) {\n    if (i) cout << ' ';\n    cout << ans[i];\n  }\n}\n",
        testCases: [
          {
            input: "5 2\n1 2 3 4 5",
            expectedOutput: "1 2 3 5",
            description: "remove internal node",
          },
          {
            input: "1 1\n9",
            expectedOutput: "",
            description: "remove only node",
          },
          {
            input: "4 4\n8 7 6 5",
            expectedOutput: "7 6 5",
            description: "remove head",
          },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "dsa-cpp-ch-trees",
    title: "Trees",
    description:
      "Learn recursive and level-order thinking on binary trees and BST properties.",
    order: 5,
    exercises: [
      {
        id: "dsa-cpp-ex-trees-inorder-traversal",
        title: "Inorder Traversal",
        description: "Traverse binary tree in left-root-right order.",
        theory:
          "### Idea\nInorder traversal recursively visits left subtree, then node, then right subtree.\n\n### BST property\nFor BST, inorder gives sorted sequence.\n\n### Complexity\n- Time: O(n)\n- Space: O(h) recursion stack",
        problemStatement:
          "Given node values of a BST inserted in order, print inorder traversal.",
        inputExample: "5\n4 2 5 1 3",
        outputExample: "1 2 3 4 5",
        hints: [
          "Build BST by insertion.",
          "Recursive traversal order matters.",
          "Append values to output in visit step.",
        ],
        constraints: ["1 <= n <= 2*10^5", "Values are distinct"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* left;\n  Node* right;\n  Node(int v): val(v), left(nullptr), right(nullptr) {}\n};\n\nNode* insertNode(Node* root, int x) {\n  if (!root) return new Node(x);\n  if (x < root->val) root->left = insertNode(root->left, x);\n  else root->right = insertNode(root->right, x);\n  return root;\n}\n\nvoid inorder(Node* root, vector<int>& out) {\n  // TODO\n}\n\nint main() {\n  int n; cin >> n;\n  Node* root = nullptr;\n  for (int i = 0; i < n; i++) { int x; cin >> x; root = insertNode(root, x); }\n  vector<int> out;\n  inorder(root, out);\n  for (int i = 0; i < (int)out.size(); i++) { if (i) cout << ' '; cout << out[i]; }\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* left;\n  Node* right;\n  Node(int v): val(v), left(nullptr), right(nullptr) {}\n};\n\nNode* insertNode(Node* root, int x) {\n  if (!root) return new Node(x);\n  if (x < root->val) root->left = insertNode(root->left, x);\n  else root->right = insertNode(root->right, x);\n  return root;\n}\n\nvoid inorder(Node* root, vector<int>& out) {\n  if (!root) return;\n  inorder(root->left, out);\n  out.push_back(root->val);\n  inorder(root->right, out);\n}\n\nint main() {\n  int n; cin >> n;\n  Node* root = nullptr;\n  for (int i = 0; i < n; i++) { int x; cin >> x; root = insertNode(root, x); }\n  vector<int> out;\n  inorder(root, out);\n  for (int i = 0; i < (int)out.size(); i++) { if (i) cout << ' '; cout << out[i]; }\n}\n",
        testCases: [
          {
            input: "5\n4 2 5 1 3",
            expectedOutput: "1 2 3 4 5",
            description: "balanced style",
          },
          {
            input: "4\n1 2 3 4",
            expectedOutput: "1 2 3 4",
            description: "right skewed",
          },
          {
            input: "3\n3 2 1",
            expectedOutput: "1 2 3",
            description: "left skewed",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "dsa-cpp-ex-trees-height",
        title: "Height of Binary Tree",
        description: "Compute maximum depth of a binary tree.",
        theory:
          "### Idea\nHeight at node = 1 + max(height(left), height(right)).\n\n### Base case\nEmpty subtree has height 0.\n\n### Complexity\n- Time: O(n)\n- Space: O(h)",
        problemStatement:
          "Given edges of a rooted binary tree (root 1), output its height (number of nodes on longest path from root to leaf).",
        inputExample: "5\n1 2 L\n1 3 R\n2 4 L\n2 5 R",
        outputExample: "3",
        hints: [
          "Use DFS recursion.",
          "Height of null child is 0.",
          "Take max of child heights.",
        ],
        constraints: ["1 <= n <= 2*10^5"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // Input is abstracted for this exercise in platform execution.\n  // TODO: implement recursive height function in your own structure.\n  cout << 0;\n}\n",
        solution:
          '#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* left;\n  Node* right;\n  Node(int v): val(v), left(nullptr), right(nullptr) {}\n};\n\nint height(Node* root) {\n  if (!root) return 0;\n  return 1 + max(height(root->left), height(root->right));\n}\n\nint main() {\n  cout << "Use height(root) on your constructed tree";\n}\n',
        testCases: [
          {
            input: "5\n1 2 L\n1 3 R\n2 4 L\n2 5 R",
            expectedOutput: "3",
            description: "balanced tree",
          },
          { input: "1", expectedOutput: "1", description: "single node" },
          {
            input: "4\n1 2 L\n2 3 L\n3 4 L",
            expectedOutput: "4",
            description: "skewed",
          },
        ],
        xpReward: 90,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "dsa-cpp-ex-trees-level-order",
        title: "Level Order Traversal",
        description: "Traverse tree level by level using queue (BFS).",
        theory:
          "### Idea\nUse queue for breadth-first traversal. Pop node, print it, then push children.\n\n### Use cases\nNearest node problems, shortest path in unweighted tree, level statistics.\n\n### Complexity\n- Time: O(n)\n- Space: O(w) where w is max width",
        problemStatement:
          "Given a binary tree, print node values in level-order from top to bottom.",
        inputExample: "7\n1 2 3 4 5 6 7",
        outputExample: "1 2 3 4 5 6 7",
        hints: [
          "Queue starts with root.",
          "For each pop, push left then right if present.",
          "Continue until queue is empty.",
        ],
        constraints: ["1 <= n <= 2*10^5"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // TODO: build tree and print level order using queue\n  return 0;\n}\n",
        solution:
          '#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* left;\n  Node* right;\n  Node(int v): val(v), left(nullptr), right(nullptr) {}\n};\n\nvector<int> levelOrder(Node* root) {\n  vector<int> out;\n  if (!root) return out;\n  queue<Node*> q;\n  q.push(root);\n  while (!q.empty()) {\n    Node* cur = q.front(); q.pop();\n    out.push_back(cur->val);\n    if (cur->left) q.push(cur->left);\n    if (cur->right) q.push(cur->right);\n  }\n  return out;\n}\n\nint main() {\n  cout << "Implement levelOrder(root) with your constructed tree";\n}\n',
        testCases: [
          {
            input: "7\n1 2 3 4 5 6 7",
            expectedOutput: "1 2 3 4 5 6 7",
            description: "perfect tree",
          },
          {
            input: "3\n1 2 -1",
            expectedOutput: "1 2",
            description: "missing child",
          },
          { input: "1\n9", expectedOutput: "9", description: "single node" },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "dsa-cpp-ex-trees-lca-bst",
        title: "Lowest Common Ancestor in BST",
        description: "Find lowest common ancestor of two nodes in a BST.",
        theory:
          "### Idea\nIn BST, if both targets < root go left; if both > root go right; else root is LCA.\n\n### Benefit\nUses BST ordering, avoids full path storage.\n\n### Complexity\n- Time: O(h)\n- Space: O(1)",
        problemStatement:
          "Given BST and values p, q, print value of their lowest common ancestor.",
        inputExample: "7\n6 2 8 0 4 7 9\n2 8",
        outputExample: "6",
        hints: [
          "Start from root.",
          "If both smaller, move left.",
          "If both larger, move right.",
        ],
        constraints: ["All node values distinct", "p and q exist in BST"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // TODO: implement LCA in BST\n  return 0;\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n  int val;\n  Node* left;\n  Node* right;\n  Node(int v): val(v), left(nullptr), right(nullptr) {}\n};\n\nNode* insertNode(Node* root, int x) {\n  if (!root) return new Node(x);\n  if (x < root->val) root->left = insertNode(root->left, x);\n  else root->right = insertNode(root->right, x);\n  return root;\n}\n\nint lcaBST(Node* root, int p, int q) {\n  while (root) {\n    if (p < root->val && q < root->val) root = root->left;\n    else if (p > root->val && q > root->val) root = root->right;\n    else return root->val;\n  }\n  return -1;\n}\n\nint main() {\n  int n; cin >> n;\n  Node* root = nullptr;\n  for (int i = 0; i < n; i++) { int x; cin >> x; root = insertNode(root, x); }\n  int p, q; cin >> p >> q;\n  cout << lcaBST(root, p, q);\n}\n",
        testCases: [
          {
            input: "7\n6 2 8 0 4 7 9\n2 8",
            expectedOutput: "6",
            description: "split across root",
          },
          {
            input: "7\n6 2 8 0 4 7 9\n2 4",
            expectedOutput: "2",
            description: "ancestor is one node",
          },
          {
            input: "5\n5 3 8 2 4\n2 4",
            expectedOutput: "3",
            description: "left subtree",
          },
        ],
        xpReward: 130,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "dsa-cpp-ch-graphs",
    title: "Graphs",
    description:
      "Master traversal and shortest-path fundamentals for graph problem solving.",
    order: 6,
    exercises: [
      {
        id: "dsa-cpp-ex-graphs-bfs-traversal",
        title: "BFS Traversal",
        description:
          "Traverse an unweighted graph in breadth-first order from source.",
        theory:
          "### Idea\nBFS explores neighbors level by level using queue.\n\n### Typical use\nShortest path in unweighted graph, connected components, bipartite checks.\n\n### Complexity\n- Time: O(V + E)\n- Space: O(V)",
        problemStatement:
          "Given undirected graph and source s, print BFS traversal order.",
        inputExample: "5 4 0\n0 1\n0 2\n1 3\n2 4",
        outputExample: "0 1 2 3 4",
        hints: [
          "Use adjacency list.",
          "Mark visited when pushing into queue.",
          "Pop, print, then visit neighbors.",
        ],
        constraints: ["1 <= V <= 2*10^5", "0 <= E <= 2*10^5"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, m, s; cin >> n >> m >> s;\n  vector<vector<int>> g(n);\n  for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; g[u].push_back(v); g[v].push_back(u); }\n\n  // TODO: BFS from s and print order\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, m, s; cin >> n >> m >> s;\n  vector<vector<int>> g(n);\n  for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; g[u].push_back(v); g[v].push_back(u); }\n  for (auto& adj : g) sort(adj.begin(), adj.end());\n\n  vector<int> vis(n, 0), order;\n  queue<int> q;\n  q.push(s); vis[s] = 1;\n  while (!q.empty()) {\n    int u = q.front(); q.pop();\n    order.push_back(u);\n    for (int v : g[u]) {\n      if (!vis[v]) {\n        vis[v] = 1;\n        q.push(v);\n      }\n    }\n  }\n\n  for (int i = 0; i < (int)order.size(); i++) {\n    if (i) cout << ' ';\n    cout << order[i];\n  }\n}\n",
        testCases: [
          {
            input: "5 4 0\n0 1\n0 2\n1 3\n2 4",
            expectedOutput: "0 1 2 3 4",
            description: "simple graph",
          },
          {
            input: "4 2 1\n1 2\n2 3",
            expectedOutput: "1 2 3",
            description: "disconnected node",
          },
          { input: "1 0 0", expectedOutput: "0", description: "single vertex" },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "cpp",
        order: 1,
      },
      {
        id: "dsa-cpp-ex-graphs-dfs-traversal",
        title: "DFS Traversal",
        description: "Traverse graph depth-first using recursion.",
        theory:
          "### Idea\nDFS goes as deep as possible before backtracking.\n\n### Use cases\nTopological sort prep, cycle detection, connected components.\n\n### Complexity\n- Time: O(V + E)\n- Space: O(V)",
        problemStatement:
          "Given undirected graph and source s, print DFS traversal order.",
        inputExample: "5 4 0\n0 1\n0 2\n1 3\n2 4",
        outputExample: "0 1 3 2 4",
        hints: [
          "Use visited array to avoid loops.",
          "Recursive helper function is clean.",
          "Sort adjacency if deterministic order needed.",
        ],
        constraints: ["1 <= V <= 2*10^5", "0 <= E <= 2*10^5"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid dfs(int u, const vector<vector<int>>& g, vector<int>& vis, vector<int>& order) {\n  // TODO\n}\n\nint main() {\n  int n, m, s; cin >> n >> m >> s;\n  vector<vector<int>> g(n);\n  for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; g[u].push_back(v); g[v].push_back(u); }\n\n  // TODO\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid dfs(int u, const vector<vector<int>>& g, vector<int>& vis, vector<int>& order) {\n  vis[u] = 1;\n  order.push_back(u);\n  for (int v : g[u]) {\n    if (!vis[v]) dfs(v, g, vis, order);\n  }\n}\n\nint main() {\n  int n, m, s; cin >> n >> m >> s;\n  vector<vector<int>> g(n);\n  for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; g[u].push_back(v); g[v].push_back(u); }\n  for (auto& adj : g) sort(adj.begin(), adj.end());\n\n  vector<int> vis(n, 0), order;\n  dfs(s, g, vis, order);\n\n  for (int i = 0; i < (int)order.size(); i++) {\n    if (i) cout << ' ';\n    cout << order[i];\n  }\n}\n",
        testCases: [
          {
            input: "5 4 0\n0 1\n0 2\n1 3\n2 4",
            expectedOutput: "0 1 3 2 4",
            description: "deterministic DFS",
          },
          {
            input: "4 2 0\n0 1\n1 2",
            expectedOutput: "0 1 2",
            description: "simple chain",
          },
          { input: "1 0 0", expectedOutput: "0", description: "single node" },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "cpp",
        order: 2,
      },
      {
        id: "dsa-cpp-ex-graphs-number-of-islands",
        title: "Number of Islands",
        description:
          "Count connected components of 1s in 2D grid using DFS/BFS.",
        theory:
          "### Idea\nTreat each land cell as node and connect 4-direction neighbors. Number of connected components is answer.\n\n### Strategy\nOn each unvisited land cell, run DFS/BFS and mark all reachable land.\n\n### Complexity\n- Time: O(R*C)\n- Space: O(R*C) worst-case recursion/queue",
        problemStatement:
          "Given binary grid, count islands where connected lands are adjacent horizontally/vertically.",
        inputExample: "4 5\n1 1 0 0 0\n1 1 0 0 1\n0 0 1 0 1\n0 0 0 1 1",
        outputExample: "3",
        hints: [
          "Loop every cell.",
          "Start DFS when cell is 1 and unvisited.",
          "Increment count once per DFS start.",
        ],
        constraints: ["1 <= R, C <= 500", "grid[i][j] in {0,1}"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int r, c; cin >> r >> c;\n  vector<vector<int>> g(r, vector<int>(c));\n  for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) cin >> g[i][j];\n\n  // TODO: count islands\n  cout << 0;\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int r, c; cin >> r >> c;\n  vector<vector<int>> g(r, vector<int>(c));\n  for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) cin >> g[i][j];\n\n  vector<vector<int>> vis(r, vector<int>(c, 0));\n  vector<pair<int,int>> dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n\n  function<void(int,int)> dfs = [&](int x, int y) {\n    vis[x][y] = 1;\n    for (auto [dx, dy] : dirs) {\n      int nx = x + dx, ny = y + dy;\n      if (nx < 0 || ny < 0 || nx >= r || ny >= c) continue;\n      if (!vis[nx][ny] && g[nx][ny] == 1) dfs(nx, ny);\n    }\n  };\n\n  int islands = 0;\n  for (int i = 0; i < r; i++) {\n    for (int j = 0; j < c; j++) {\n      if (g[i][j] == 1 && !vis[i][j]) {\n        islands++;\n        dfs(i, j);\n      }\n    }\n  }\n\n  cout << islands;\n}\n",
        testCases: [
          {
            input: "4 5\n1 1 0 0 0\n1 1 0 0 1\n0 0 1 0 1\n0 0 0 1 1",
            expectedOutput: "3",
            description: "three components",
          },
          {
            input: "2 2\n0 0\n0 0",
            expectedOutput: "0",
            description: "all water",
          },
          {
            input: "3 3\n1 1 1\n1 1 1\n1 1 1",
            expectedOutput: "1",
            description: "single island",
          },
        ],
        xpReward: 130,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "dsa-cpp-ex-graphs-dijkstra-shortest-path",
        title: "Dijkstra Shortest Path",
        description:
          "Find shortest distance from source to all nodes in weighted graph.",
        theory:
          "### Idea\nUse min-priority queue to always expand node with smallest known distance.\n\n### Requirement\nEdge weights must be non-negative.\n\n### Complexity\n- Time: O((V+E) log V)\n- Space: O(V+E)",
        problemStatement:
          "Given weighted undirected graph and source s, print shortest distance from s to every node (space-separated).",
        inputExample: "5 6 0\n0 1 2\n0 2 4\n1 2 1\n1 3 7\n2 4 3\n3 4 1",
        outputExample: "0 2 3 7 6",
        hints: [
          "Initialize distances with large value.",
          "Use priority_queue with (dist,node) and greater comparator.",
          "Skip stale queue entries when dist > best[node].",
        ],
        constraints: ["1 <= V <= 2*10^5", "0 <= E <= 2*10^5", "0 <= w <= 10^9"],
        starterCode:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, m, s; cin >> n >> m >> s;\n  vector<vector<pair<int,int>>> g(n);\n  for (int i = 0; i < m; i++) {\n    int u, v, w; cin >> u >> v >> w;\n    g[u].push_back({v, w});\n    g[v].push_back({u, w});\n  }\n\n  // TODO: dijkstra\n}\n",
        solution:
          "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int n, m, s; cin >> n >> m >> s;\n  vector<vector<pair<int,int>>> g(n);\n  for (int i = 0; i < m; i++) {\n    int u, v, w; cin >> u >> v >> w;\n    g[u].push_back({v, w});\n    g[v].push_back({u, w});\n  }\n\n  const long long INF = (long long)4e18;\n  vector<long long> dist(n, INF);\n  priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<pair<long long,int>>> pq;\n\n  dist[s] = 0;\n  pq.push({0, s});\n\n  while (!pq.empty()) {\n    auto [d, u] = pq.top();\n    pq.pop();\n    if (d != dist[u]) continue;\n\n    for (auto [v, w] : g[u]) {\n      if (dist[v] > d + w) {\n        dist[v] = d + w;\n        pq.push({dist[v], v});\n      }\n    }\n  }\n\n  for (int i = 0; i < n; i++) {\n    if (i) cout << ' ';\n    if (dist[i] >= INF / 2) cout << -1;\n    else cout << dist[i];\n  }\n}\n",
        testCases: [
          {
            input: "5 6 0\n0 1 2\n0 2 4\n1 2 1\n1 3 7\n2 4 3\n3 4 1",
            expectedOutput: "0 2 3 7 6",
            description: "weighted graph sample",
          },
          {
            input: "3 1 0\n0 1 5",
            expectedOutput: "0 5 -1",
            description: "unreachable node",
          },
          {
            input: "4 4 2\n2 0 1\n2 1 2\n0 3 4\n1 3 1",
            expectedOutput: "1 2 0 3",
            description: "different source",
          },
        ],
        xpReward: 170,
        difficulty: "hard",
        language: "cpp",
        order: 4,
      },
    ],
  },
];

export async function seedDsaCourse() {
  const totalXP = chapters
    .flatMap((chapter) => chapter.exercises)
    .reduce((sum, exercise) => sum + exercise.xpReward, 0);

  const course = await prisma.course.upsert({
    where: { id: DSA_COURSE.id },
    create: {
      ...DSA_COURSE,
      totalXP,
    },
    update: {
      title: DSA_COURSE.title,
      shortDescription: DSA_COURSE.shortDescription,
      description: DSA_COURSE.description,
      category: DSA_COURSE.category,
      difficulty: DSA_COURSE.difficulty,
      thumbnail: DSA_COURSE.thumbnail,
      isPremium: DSA_COURSE.isPremium,
      estimatedHours: DSA_COURSE.estimatedHours,
      enrolledCount: DSA_COURSE.enrolledCount,
      rating: DSA_COURSE.rating,
      tags: DSA_COURSE.tags,
      totalXP,
    },
  });

  const chapterIds = chapters.map((chapter) => chapter.id);

  await prisma.chapter.deleteMany({
    where: {
      courseId: course.id,
      id: { notIn: chapterIds },
    },
  });

  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: { id: chapter.id },
      create: {
        id: chapter.id,
        courseId: course.id,
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        isPremium: false,
      },
      update: {
        courseId: course.id,
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        isPremium: false,
      },
    });

    const exerciseIds = chapter.exercises.map((exercise) => exercise.id);

    await prisma.exercise.deleteMany({
      where: {
        chapterId: chapter.id,
        id: { notIn: exerciseIds },
      },
    });

    for (const exercise of chapter.exercises) {
      await prisma.exercise.upsert({
        where: { id: exercise.id },
        create: {
          id: exercise.id,
          chapterId: chapter.id,
          courseId: course.id,
          title: exercise.title,
          description: exercise.description,
          theory: exercise.theory,
          problemStatement: exercise.problemStatement,
          inputExample: exercise.inputExample,
          outputExample: exercise.outputExample,
          hints: exercise.hints,
          constraints: exercise.constraints,
          starterCode: exercise.starterCode,
          solution: exercise.solution,
          testCases: exercise.testCases,
          xpReward: exercise.xpReward,
          difficulty: exercise.difficulty,
          language: exercise.language,
          order: exercise.order,
        },
        update: {
          chapterId: chapter.id,
          courseId: course.id,
          title: exercise.title,
          description: exercise.description,
          theory: exercise.theory,
          problemStatement: exercise.problemStatement,
          inputExample: exercise.inputExample,
          outputExample: exercise.outputExample,
          hints: exercise.hints,
          constraints: exercise.constraints,
          starterCode: exercise.starterCode,
          solution: exercise.solution,
          testCases: exercise.testCases,
          xpReward: exercise.xpReward,
          difficulty: exercise.difficulty,
          language: exercise.language,
          order: exercise.order,
        },
      });
    }
  }

  console.log(
    `Seeded ${course.title}: ${chapters.length} chapters, ${chapters.flatMap((c) => c.exercises).length} exercises`,
  );
}

export const DSA_COURSE_ID = DSA_COURSE.id;
