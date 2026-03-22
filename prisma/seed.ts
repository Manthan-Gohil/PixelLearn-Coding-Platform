import prisma from "../src/lib/prisma";
import {
  JS_COURSE_ID as JS_COURSE_ID_FROM_MODULE,
  seedJsCourse as seedJsCourseFromModule,
} from "./seeds/seed-js";
import { REACTJS_COURSE_ID, seedReactJsCourse } from "./seeds/seed-reactjs";

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

async function seedDsaCourse() {
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

const CPP_COURSE = {
  id: "cpp-programming-fundamentals",
  title: "C++ Programming: Fundamentals to Advanced",
  shortDescription:
    "Master C++ from syntax basics to advanced OOP, STL, and file I/O with hands-on projects.",
  description:
    "Learn C++ progressively: from variables and control flow through functions, OOP (classes, inheritance, polymorphism), pointers, STL containers and algorithms, to file I/O and exception handling. Each chapter includes comprehensive theory, practical exercises, multiple test cases, and real-world code patterns. Perfect for beginners aspiring to become proficient C++ programmers.",
  category: "Programming",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 75,
  enrolledCount: 0,
  rating: 4.8,
  tags: [
    "C++",
    "Programming",
    "Fundamentals",
    "OOP",
    "STL",
    "Beginner-Friendly",
  ],
};

const cppChapters: SeedChapter[] = [
  {
    id: "cpp-ch-01-basics-I",
    title: "C++ Basics I: Syntax, Variables & Data Types",
    description:
      "Learn C++ syntax, declare variables, understand data types, and perform basic I/O operations.",
    order: 1,
    exercises: [
      {
        id: "cpp-ex-01-01-hello-world",
        title: "Hello World & Basic Output",
        description: "Your first C++ program printing text to console.",
        theory:
          '### C++ Program Structure\nEvery C++ program starts with `#include <iostream>` to access input/output.\n\n### Key Points\n- `using namespace std;` declares standard namespace\n- `cout` outputs to console\n- `<<` operator sends data to cout\n- `int main()` is program entry point\n- Return 0 indicates successful execution\n\n### Example\n```cpp\n#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}\n```\n\n### Output\n```\nHello, World!\n```',
        problemStatement:
          "Write a C++ program that prints 'Welcome to C++ Programming' to the console.",
        inputExample: "",
        outputExample: "Welcome to C++ Programming",
        hints: [
          "Use #include <iostream>",
          "Use cout for output",
          "Use << operator to send text",
          "Remember to return 0",
        ],
        constraints: ["Non-interactive program"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Print the welcome message\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Welcome to C++ Programming";\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Welcome to C++ Programming",
            description: "basic output",
          },
          {
            input: "",
            expectedOutput: "Welcome to C++ Programming",
            description: "test with no input",
          },
          {
            input: "",
            expectedOutput: "Welcome to C++ Programming",
            description: "verify exact output",
          },
        ],
        xpReward: 30,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-01-02-variables",
        title: "Declare and Print Variables",
        description: "Understand variable declaration and print their values.",
        theory:
          '### Variables\nVariables store data in computer memory. Syntax: `dataType variableName = value;`\n\n### Data Types\n- `int` - integers (-2147483648 to 2147483647)\n- `float` - decimals (single precision)\n- `double` - decimals (double precision)\n- `char` - single character\n- `bool` - true/false\n\n### Example\n```cpp\nint age = 25;\nfloat height = 5.9f;\nchar grade = \'A\';\ncout << age << " " << height << " " << grade;\n```',
        problemStatement:
          "Declare an integer variable x with value 42, a float variable y with value 3.14, and print them separated by space.",
        inputExample: "",
        outputExample: "42 3.14",
        hints: [
          "Declare int x = 42;",
          "Declare float y = 3.14f;",
          "Use cout with << operator",
          "Separate values with space",
        ],
        constraints: ["Must use primitive data types"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Declare variables and print them\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int x = 42;\n  float y = 3.14f;\n  cout << x << " " << y;\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "42 3.14",
            description: "basic variable declaration",
          },
          {
            input: "",
            expectedOutput: "42 3.14",
            description: "float precision",
          },
          {
            input: "",
            expectedOutput: "42 3.14",
            description: "output format check",
          },
        ],
        xpReward: 40,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-01-03-simple-io",
        title: "Reading User Input with cin",
        description: "Accept input from user and display it.",
        theory:
          '### Input with cin\n`cin` reads data from user input (keyboard).\n\n### Usage\n```cpp\nint number;\ncin >> number;  // Read integer\nfloat value;\ncin >> value;   // Read float\n```\n\n### Multiple Inputs\n```cpp\nint a, b;\ncin >> a >> b;  // Read two integers\n```\n\n### Complete Example\n```cpp\nint num;\ncin >> num;\ncout << "You entered: " << num;\n```',
        problemStatement:
          "Read an integer from input and print it back with message 'Number is: ' before it.",
        inputExample: "100",
        outputExample: "Number is: 100",
        hints: [
          "Use cin >> to read integer",
          "Use cout to print message and value",
          "Order: message first, then value",
        ],
        constraints: ["Input is always a valid integer"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Read integer and print with message\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int num;\n  cin >> num;\n  cout << "Number is: " << num;\n  return 0;\n}\n',
        testCases: [
          {
            input: "100",
            expectedOutput: "Number is: 100",
            description: "positive integer",
          },
          {
            input: "42",
            expectedOutput: "Number is: 42",
            description: "different positive",
          },
          {
            input: "-5",
            expectedOutput: "Number is: -5",
            description: "negative integer",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-01-04-arithmetic",
        title: "Arithmetic Operations",
        description: "Perform and display results of arithmetic operations.",
        theory:
          "### Arithmetic Operators\n- `+` Addition\n- `-` Subtraction\n- `*` Multiplication\n- `/` Division (integer or float)\n- `%` Modulo (remainder)\n\n### Order of Operations\nFollows PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction\n\n### Examples\n```cpp\nint a = 10, b = 3;\ncout << a + b;      // 13\ncout << a - b;      // 7\ncout << a * b;      // 30\ncout << a / b;      // 3 (integer division)\ncout << a % b;      // 1 (remainder)\n```",
        problemStatement:
          "Read two integers a and b, then print their sum, difference, product, and quotient (integer division) on separate lines.",
        inputExample: "10 3",
        outputExample: "13\n7\n30\n3",
        hints: [
          "Read two integers from input",
          "Calculate all four operations",
          "Print each result on new line using \\n",
          "Use integer division for quotient",
        ],
        constraints: [
          "1 <= a, b <= 1000",
          "b is never zero",
          "Use integer types",
        ],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Read two numbers and perform operations\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b << "\\n";\n  cout << a - b << "\\n";\n  cout << a * b << "\\n";\n  cout << a / b << "\\n";\n  return 0;\n}\n',
        testCases: [
          {
            input: "10 3",
            expectedOutput: "13\n7\n30\n3",
            description: "basic arithmetic",
          },
          {
            input: "20 4",
            expectedOutput: "24\n16\n80\n5",
            description: "different values",
          },
          {
            input: "100 10",
            expectedOutput: "110\n90\n1000\n10",
            description: "larger numbers",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "cpp-ch-02-basics-II",
    title: "C++ Basics II: Control Flow (if, switch, loops)",
    description:
      "Master conditional statements and loops for program flow control.",
    order: 2,
    exercises: [
      {
        id: "cpp-ex-02-01-if-else",
        title: "If-Else Conditions",
        description: "Write programs using if-else for decision making.",
        theory:
          '### If-Else Syntax\n```cpp\nif (condition) {\n  // Code if true\n} else if (condition2) {\n  // Code if condition2 true\n} else {\n  // Code if all false\n}\n```\n\n### Comparison Operators\n- `==` Equal\n- `!=` Not equal\n- `<` Less than\n- `>` Greater than\n- `<=` Less than or equal\n- `>=` Greater than or equal\n\n### Example\n```cpp\nint age = 18;\nif (age >= 18) {\n  cout << "Adult";\n} else {\n  cout << "Minor";\n}\n```',
        problemStatement:
          "Read an integer age. If age >= 18, print 'Adult', otherwise print 'Minor'.",
        inputExample: "20",
        outputExample: "Adult",
        hints: [
          "Use if-else statement",
          "Compare age with 18",
          "Print appropriate message",
        ],
        constraints: ["0 <= age <= 150"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Read age and check if adult or minor\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int age;\n  cin >> age;\n  if (age >= 18) {\n    cout << "Adult";\n  } else {\n    cout << "Minor";\n  }\n  return 0;\n}\n',
        testCases: [
          {
            input: "20",
            expectedOutput: "Adult",
            description: "adult age",
          },
          {
            input: "18",
            expectedOutput: "Adult",
            description: "boundary case",
          },
          {
            input: "10",
            expectedOutput: "Minor",
            description: "minor age",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-02-02-grade",
        title: "Nested If-Else (Grading System)",
        description: "Use nested conditions to determine grade from marks.",
        theory:
          '### Nested If-Else\nConditions can be nested for multiple checks:\n```cpp\nif (marks >= 90) {\n  cout << "A+";\n} else if (marks >= 80) {\n  cout << "A";\n} else if (marks >= 70) {\n  cout << "B";\n} else if (marks >= 60) {\n  cout << "C";\n} else {\n  cout << "F";\n}\n```\n\n### Best Practice\nArrange Else-If from highest to lowest for readability.',
        problemStatement:
          "Read marks (0-100). Print grade: 90+ = A, 80-89 = B, 70-79 = C, 60-69 = D, <60 = F",
        inputExample: "85",
        outputExample: "B",
        hints: [
          "Use multiple else-if blocks",
          "Check highest condition first",
          "Use && for range checks if needed",
        ],
        constraints: ["0 <= marks <= 100"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Read marks and print grade\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int marks;\n  cin >> marks;\n  if (marks >= 90) {\n    cout << "A";\n  } else if (marks >= 80) {\n    cout << "B";\n  } else if (marks >= 70) {\n    cout << "C";\n  } else if (marks >= 60) {\n    cout << "D";\n  } else {\n    cout << "F";\n  }\n  return 0;\n}\n',
        testCases: [
          {
            input: "95",
            expectedOutput: "A",
            description: "high marks",
          },
          {
            input: "75",
            expectedOutput: "C",
            description: "middle marks",
          },
          {
            input: "55",
            expectedOutput: "F",
            description: "failing marks",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-02-03-for-loop",
        title: "For Loop Fundamentals",
        description: "Use for loops to repeat code blocks.",
        theory:
          "### For Loop Syntax\n```cpp\nfor (int i = 0; i < n; i++) {\n  // Code runs n times\n}\n```\n\n### Parts\n1. **Initialization**: `int i = 0` (start value)\n2. **Condition**: `i < n` (continue while true)\n3. **Increment**: `i++` (update after each iteration)\n\n### Example (Sum 1 to 5)\n```cpp\nint sum = 0;\nfor (int i = 1; i <= 5; i++) {\n  sum += i;  // sum = 15\n}\n```",
        problemStatement:
          "Read an integer n. Print numbers from 1 to n, each on a new line.",
        inputExample: "5",
        outputExample: "1\n2\n3\n4\n5",
        hints: [
          "Use for loop from 1 to n",
          "Print current number with newline",
          "Increment loop variable",
        ],
        constraints: ["1 <= n <= 100"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Read n and print 1 to n\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  for (int i = 1; i <= n; i++) {\n    cout << i << "\\n";\n  }\n  return 0;\n}\n',
        testCases: [
          {
            input: "5",
            expectedOutput: "1\n2\n3\n4\n5",
            description: "basic sequence",
          },
          {
            input: "3",
            expectedOutput: "1\n2\n3",
            description: "small sequence",
          },
          {
            input: "10",
            expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
            description: "longer sequence",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-02-04-while-loop",
        title: "While Loop & Sum Calculation",
        description: "Use while loops to calculate sum of numbers.",
        theory:
          "### While Loop Syntax\n```cpp\nwhile (condition) {\n  // Code runs while condition is true\n  // Must eventually make condition false\n}\n```\n\n### Example (Sum 1 to n)\n```cpp\nint sum = 0, i = 1;\nwhile (i <= n) {\n  sum += i;\n  i++;\n}\n```\n\n### Key Difference from For\n- While: condition-driven, more flexible\n- For: count-driven, clearer bounds",
        problemStatement:
          "Read an integer n. Calculate and print the sum of numbers from 1 to n.",
        inputExample: "5",
        outputExample: "15",
        hints: [
          "Use while loop or for loop",
          "Maintain running sum variable",
          "Add each number to sum",
          "Stop after n iterations",
        ],
        constraints: ["1 <= n <= 1000"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Calculate sum from 1 to n\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  int sum = 0;\n  for (int i = 1; i <= n; i++) {\n    sum += i;\n  }\n  cout << sum;\n  return 0;\n}\n",
        testCases: [
          {
            input: "5",
            expectedOutput: "15",
            description: "basic sum",
          },
          {
            input: "10",
            expectedOutput: "55",
            description: "larger sum",
          },
          {
            input: "1",
            expectedOutput: "1",
            description: "single element",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "cpp-ch-03-functions",
    title: "Functions & Scope",
    description:
      "Learn function declaration, definition, parameters, return values, and variable scope.",
    order: 3,
    exercises: [
      {
        id: "cpp-ex-03-01-function-basics",
        title: "Function Declaration and Calling",
        description: "Write and call simple functions.",
        theory:
          "### Function Syntax\n```cpp\nreturnType functionName(parameters) {\n  // Function body\n  return value;  // If returnType is not void\n}\n```\n\n### Example\n```cpp\nint add(int a, int b) {\n  return a + b;\n}\n\nint main() {\n  int result = add(5, 3);  // result = 8\n}\n```\n\n### Function Signature\n- **Return type**: `int`, `void`, `float`, etc.\n- **Parameters**: Variables passed to function\n- **Return**: Send value back to caller",
        problemStatement:
          "Write function add(int a, int b) that returns sum. Call it with 10 and 20, print result.",
        inputExample: "",
        outputExample: "30",
        hints: [
          "Define add function before main OR declare prototype",
          "Function takes two int parameters",
          "Return their sum",
          "Call in main and print result",
        ],
        constraints: ["Function must be separate from main"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\n// TODO: Declare add function\n\nint main() {\n  // TODO: Call add(10, 20) and print\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n  return a + b;\n}\n\nint main() {\n  cout << add(10, 20);\n  return 0;\n}\n",
        testCases: [
          {
            input: "",
            expectedOutput: "30",
            description: "add 10+20",
          },
          {
            input: "",
            expectedOutput: "30",
            description: "verify result",
          },
          {
            input: "",
            expectedOutput: "30",
            description: "function call",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-03-02-function-multiple",
        title: "Multiple Functions",
        description: "Create multiple functions and use them together.",
        theory:
          "### Multiple Functions\nPrograms often have many functions for different tasks:\n```cpp\nint multiply(int a, int b) { return a * b; }\nint subtract(int a, int b) { return a - b; }\nint divide(int a, int b) { return a / b; }  // Integer division\n```\n\n### Good Practice\n- One function per task\n- Clear function names\n- Reusable logic",
        problemStatement:
          "Write functions multiply(a,b), subtract(a,b), divide(a,b) that return results. Calculate 20*5, 20-5, 20/5 and print all on same line separated by space.",
        inputExample: "",
        outputExample: "100 15 4",
        hints: [
          "Define three functions",
          "Call each with 20 and 5",
          "Print results separated by spaces",
          "Use integer division",
        ],
        constraints: ["All functions must be separate"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Define functions and call them\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint multiply(int a, int b) { return a * b; }\nint subtract(int a, int b) { return a - b; }\nint divide(int a, int b) { return a / b; }\n\nint main() {\n  cout << multiply(20, 5) << " " << subtract(20, 5) << " " << divide(20, 5);\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "100 15 4",
            description: "all operations",
          },
          {
            input: "",
            expectedOutput: "100 15 4",
            description: "verify calculation",
          },
          {
            input: "",
            expectedOutput: "100 15 4",
            description: "function calls",
          },
        ],
        xpReward: 70,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-03-03-function-factorial",
        title: "Recursive Function (Factorial)",
        description: "Implement factorial using recursion.",
        theory:
          "### Recursion\nFunction calling itself with smaller problem:\n```cpp\nint factorial(int n) {\n  if (n <= 1) return 1;  // Base case\n  return n * factorial(n - 1);  // Recursive case\n}\n```\n\n### Execution (factorial(5))\n```\nfactorial(5) = 5 * factorial(4)\nfactorial(4) = 4 * factorial(3)\nfactorial(3) = 3 * factorial(2)\nfactorial(2) = 2 * factorial(1)\nfactorial(1) = 1\n= 5 * 4 * 3 * 2 * 1 = 120\n```\n\n### Key Components\n- **Base case**: Stops recursion (n <= 1)\n- **Recursive case**: Calls itself with n-1",
        problemStatement:
          "Write recursive function factorial(n) that returns n!. Calculate factorial of 5.",
        inputExample: "",
        outputExample: "120",
        hints: [
          "Base case: n <= 1 returns 1",
          "Recursive case: return n * factorial(n-1)",
          "Call factorial(5)",
        ],
        constraints: ["0 <= n <= 20"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Define factorial recursively and call it\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nint main() {\n  cout << factorial(5);\n  return 0;\n}\n",
        testCases: [
          {
            input: "",
            expectedOutput: "120",
            description: "factorial 5",
          },
          {
            input: "",
            expectedOutput: "120",
            description: "verify result",
          },
          {
            input: "",
            expectedOutput: "120",
            description: "recursion works",
          },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-03-04-pass-reference",
        title: "Pass by Reference",
        description:
          "Understand pass by reference to modify variables in functions.",
        theory:
          "### Pass by Value vs Reference\n**Pass by Value** (default): Function gets copy\n```cpp\nvoid increment(int x) { x++; }  // Original unchanged\nint a = 5; increment(a);  // a still 5\n```\n\n**Pass by Reference**: Function gets original\n```cpp\nvoid increment(int& x) { x++; }  // Original changed\nint a = 5; increment(a);  // a now 6\n```\n\n### Syntax\nUse `&` after type in parameter list",
        problemStatement:
          "Write function swap that takes two int references and swaps their values. Swap 10 and 20, print both.",
        inputExample: "",
        outputExample: "20 10",
        hints: [
          "Use & in parameter list",
          "Create temporary variable for swap",
          "Print after swap",
        ],
        constraints: ["Must use pass by reference"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Define swap with references\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nvoid swap(int& a, int& b) {\n  int temp = a;\n  a = b;\n  b = temp;\n}\n\nint main() {\n  int x = 10, y = 20;\n  swap(x, y);\n  cout << x << " " << y;\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "20 10",
            description: "swap works",
          },
          {
            input: "",
            expectedOutput: "20 10",
            description: "reference modified",
          },
          {
            input: "",
            expectedOutput: "20 10",
            description: "verify swap",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "cpp-ch-04-arrays-vectors",
    title: "Arrays & Vectors",
    description:
      "Master array and vector operations, manipulation, and storage in C++.",
    order: 4,
    exercises: [
      {
        id: "cpp-ex-04-01-array-basics",
        title: "Array Declaration and Access",
        description: "Declare arrays and access elements by index.",
        theory:
          '### Array Syntax\n```cpp\nint arr[5] = {1, 2, 3, 4, 5};\n```\n\n### Indexing (0-based)\n```cpp\narr[0] = 1;  // First element\narr[4] = 5;  // Last element\n```\n\n### Array Size\n```cpp\nint size = sizeof(arr) / sizeof(arr[0]);  // Get array size\n```\n\n### Example\n```cpp\nint nums[3] = {10, 20, 30};\ncout << nums[0] << " " << nums[2];  // 10 30\n```',
        problemStatement:
          "Declare array of 5 integers: {10, 20, 30, 40, 50}. Print first, middle, and last elements.",
        inputExample: "",
        outputExample: "10 30 50",
        hints: [
          "Declare int arr[5]",
          "Initialize with 5 values",
          "Access arr[0], arr[2], arr[4]",
          "Print with spaces",
        ],
        constraints: ["Array size must be 5"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Declare and access array\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int arr[5] = {10, 20, 30, 40, 50};\n  cout << arr[0] << " " << arr[2] << " " << arr[4];\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "10 30 50",
            description: "array access",
          },
          {
            input: "",
            expectedOutput: "10 30 50",
            description: "correct indices",
          },
          {
            input: "",
            expectedOutput: "10 30 50",
            description: "correct values",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-04-02-array-sum",
        title: "Array Sum with Loop",
        description: "Calculate sum of array elements using loop.",
        theory:
          "### Iterating Array\n```cpp\nint arr[] = {1, 2, 3, 4, 5};\nint sum = 0;\nfor (int i = 0; i < 5; i++) {\n  sum += arr[i];\n}\n```\n\n### Dynamic Access\n- Use loop variable to access each element\n- Add to running sum\n- Continue until all elements processed",
        problemStatement:
          "Read 5 integers into array. Calculate and print their sum.",
        inputExample: "10 20 30 40 50",
        outputExample: "150",
        hints: [
          "Read 5 integers into array",
          "Use for loop to iterate",
          "Add each element to sum variable",
          "Print final sum",
        ],
        constraints: ["Exactly 5 integers", "All positive"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Read array and calculate sum\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  int arr[5];\n  for (int i = 0; i < 5; i++) {\n    cin >> arr[i];\n  }\n  int sum = 0;\n  for (int i = 0; i < 5; i++) {\n    sum += arr[i];\n  }\n  cout << sum;\n  return 0;\n}\n",
        testCases: [
          {
            input: "10 20 30 40 50",
            expectedOutput: "150",
            description: "basic sum",
          },
          {
            input: "1 2 3 4 5",
            expectedOutput: "15",
            description: "small numbers",
          },
          {
            input: "5 5 5 5 5",
            expectedOutput: "25",
            description: "same numbers",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-04-03-vector-basics",
        title: "Vector Basics & Dynamic Size",
        description: "Use vectors for flexible-size collections.",
        theory:
          "### Vector Syntax\n```cpp\n#include <vector>\nusing namespace std;\n\nvector<int> v;          // Empty vector\nvector<int> v(5);       // Vector of 5 zeros\nvector<int> v = {1,2,3}; // Initialize with values\n```\n\n### Common Methods\n- `v.push_back(x)` - Add element\n- `v.size()` - Number of elements\n- `v[i]` - Access element i\n- `v.pop_back()` - Remove last element\n\n### Example\n```cpp\nvector<int> nums;\nnums.push_back(10);\nnums.push_back(20);\ncout << nums.size();  // 2\n```",
        problemStatement:
          "Read n integers into a vector using push_back. Print the vector size and all elements.",
        inputExample: "3\n10 20 30",
        outputExample: "Size: 3\n10 20 30",
        hints: [
          "Include <vector>",
          "Use vector<int> v",
          "Read n first",
          "Use push_back in loop",
          "Print size and elements",
        ],
        constraints: ["1 <= n <= 100"],
        starterCode:
          "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  // TODO: Create vector and add elements\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> v;\n  for (int i = 0; i < n; i++) {\n    int x;\n    cin >> x;\n    v.push_back(x);\n  }\n  cout << "Size: " << v.size() << "\\n";\n  for (int i = 0; i < v.size(); i++) {\n    cout << v[i] << " ";\n  }\n  return 0;\n}\n',
        testCases: [
          {
            input: "3\n10 20 30",
            expectedOutput: "Size: 3\n10 20 30 ",
            description: "3 elements",
          },
          {
            input: "5\n1 2 3 4 5",
            expectedOutput: "Size: 5\n1 2 3 4 5 ",
            description: "5 elements",
          },
          {
            input: "1\n42",
            expectedOutput: "Size: 1\n42 ",
            description: "single element",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-04-04-max-min-array",
        title: "Find Max and Min in Array",
        description: "Find maximum and minimum values in array.",
        theory:
          "### Algorithm\n```cpp\nint arr[] = {3, 7, 2, 9, 1};\nint maxVal = arr[0];\nint minVal = arr[0];\n\nfor (int i = 1; i < 5; i++) {\n  if (arr[i] > maxVal) maxVal = arr[i];\n  if (arr[i] < minVal) minVal = arr[i];\n}\n```\n\n### Logic\n- Start with first element as both max and min\n- Compare each element\n- Update if greater or smaller",
        problemStatement:
          "Read 5 integers into array. Find and print maximum and minimum values.",
        inputExample: "3 7 2 9 1",
        outputExample: "Max: 9 Min: 1",
        hints: [
          "Initialize max and min with first element",
          "Compare each element in loop",
          "Update max/min as needed",
          "Print results",
        ],
        constraints: ["Exactly 5 integers"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Find max and min in array\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int arr[5];\n  for (int i = 0; i < 5; i++) cin >> arr[i];\n  \n  int maxVal = arr[0], minVal = arr[0];\n  for (int i = 1; i < 5; i++) {\n    if (arr[i] > maxVal) maxVal = arr[i];\n    if (arr[i] < minVal) minVal = arr[i];\n  }\n  cout << "Max: " << maxVal << " Min: " << minVal;\n  return 0;\n}\n',
        testCases: [
          {
            input: "3 7 2 9 1",
            expectedOutput: "Max: 9 Min: 1",
            description: "mixed numbers",
          },
          {
            input: "5 5 5 5 5",
            expectedOutput: "Max: 5 Min: 5",
            description: "all same",
          },
          {
            input: "10 20 5 15 25",
            expectedOutput: "Max: 25 Min: 5",
            description: "different values",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
      {
        id: "cpp-ex-04-05-2d-array",
        title: "2D Arrays & Matrices",
        description: "Work with 2D arrays (matrices) and access elements.",
        theory:
          "### 2D Array Syntax\n```cpp\nint matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};\n```\n\n### Accessing Elements\n```cpp\nmatrix[0][0] = 1;  // Row 0, Column 0\nmatrix[1][2] = 6;  // Row 1, Column 2\n```\n\n### Nested Loops\n```cpp\nfor (int i = 0; i < 2; i++) {\n  for (int j = 0; j < 3; j++) {\n    cout << matrix[i][j];\n  }\n}\n```",
        problemStatement:
          "Read 2x3 matrix (2 rows, 3 columns). Print all elements row by row.",
        inputExample: "1 2 3\n4 5 6",
        outputExample: "1 2 3\n4 5 6",
        hints: [
          "Declare int matrix[2][3]",
          "Use nested loops for reading",
          "Use nested loops for printing",
          "Print row separator (newline)",
        ],
        constraints: ["2 rows, 3 columns"],
        starterCode:
          "#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Read and print 2D array\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\n\nint main() {\n  int matrix[2][3];\n  for (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 3; j++) {\n      cin >> matrix[i][j];\n    }\n  }\n  for (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 3; j++) {\n      cout << matrix[i][j];\n      if (j < 2) cout << " ";\n    }\n    cout << "\\n";\n  }\n  return 0;\n}\n',
        testCases: [
          {
            input: "1 2 3\n4 5 6",
            expectedOutput: "1 2 3\n4 5 6",
            description: "basic matrix",
          },
          {
            input: "10 20 30\n40 50 60",
            expectedOutput: "10 20 30\n40 50 60",
            description: "different values",
          },
          {
            input: "1 1 1\n2 2 2",
            expectedOutput: "1 1 1\n2 2 2",
            description: "repeated values",
          },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "cpp",
        order: 5,
      },
    ],
  },
  {
    id: "cpp-ch-05-strings",
    title: "Strings & Character Operations",
    description:
      "Master string manipulation, character arrays, and string class in C++.",
    order: 5,
    exercises: [
      {
        id: "cpp-ex-05-01-string-basics",
        title: "String Declaration and Input",
        description: "Declare strings and read input.",
        theory:
          '### String Class\n```cpp\n#include <string>\nusing namespace std;\n\nstring str = "Hello";\nstring name;\ncin >> name;  // Read word\ngetline(cin, str);  // Read entire line\n```\n\n### Character Array\n```cpp\nchar cstr[50];\ncin >> cstr;  // Read C-style string\n```\n\n### String Methods\n- `str.length()` - Length of string\n- `str[i]` - Character at index i\n- `str + str2` - Concatenation',
        problemStatement:
          "Read two words into strings. Print them concatenated with space between.",
        inputExample: "Hello World",
        outputExample: "HellWorlod",
        hints: [
          "Include <string>",
          "Use string type",
          "Read two words",
          "Concatenate with space",
        ],
        constraints: ["Two words, no spaces within"],
        starterCode:
          "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  // TODO: Read strings and concatenate\n  return 0;\n}\n",
        solution:
          "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string s1, s2;\n  cin >> s1 >> s2;\n  cout << s1 << s2;\n  return 0;\n}\n",
        testCases: [
          {
            input: "Hello World",
            expectedOutput: "HelloWorld",
            description: "two words",
          },
          {
            input: "Foo Bar",
            expectedOutput: "FooBar",
            description: "different words",
          },
          {
            input: "A Z",
            expectedOutput: "AZ",
            description: "single chars",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-05-02-string-length",
        title: "String Length and Character Access",
        description: "Get string length and access individual characters.",
        theory:
          "### String Length\n```cpp\nstring str = \"Hello\";\nint len = str.length();  // 5\n```\n\n### Character Access\n```cpp\nchar first = str[0];  // 'H'\nchar last = str[len - 1];  // 'o'\n```\n\n### Loop Through String\n```cpp\nfor (int i = 0; i < str.length(); i++) {\n  cout << str[i];\n}\n```",
        problemStatement:
          "Read a string. Print its length and then each character on separate line.",
        inputExample: "Hi",
        outputExample: "2\nH\ni",
        hints: [
          "Read string",
          "Use .length() method",
          "Use loop to access characters",
          "Print each on new line",
        ],
        constraints: ["String length <= 100"],
        starterCode:
          "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  // TODO: Print length and characters\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string str;\n  cin >> str;\n  cout << str.length() << "\\n";\n  for (int i = 0; i < str.length(); i++) {\n    cout << str[i] << "\\n";\n  }\n  return 0;\n}\n',
        testCases: [
          {
            input: "Hi",
            expectedOutput: "2\nH\ni",
            description: "short string",
          },
          {
            input: "Code",
            expectedOutput: "4\nC\no\nd\ne",
            description: "longer string",
          },
          {
            input: "A",
            expectedOutput: "1\nA",
            description: "single char",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-05-03-palindrome",
        title: "Check Palindrome String",
        description: "Determine if a string reads same forwards and backwards.",
        theory:
          '### Palindrome\nString that reads same in both directions:\n- "racecar" is palindrome\n- "hello" is not\n\n### Algorithm\n```cpp\nbool isPalindrome = true;\nfor (int i = 0; i < s.length() / 2; i++) {\n  if (s[i] != s[s.length() - 1 - i]) {\n    isPalindrome = false;\n  }\n}\n```\n\n### Logic\n- Compare first with last\n- Compare second with second-last\n- Continue to middle',
        problemStatement:
          "Read a string. Check if it's a palindrome. Print 'Yes' if palindrome, 'No' if not.",
        inputExample: "madam",
        outputExample: "Yes",
        hints: [
          "Compare character pairs",
          "First with last, second with second-last, etc.",
          "Check up to middle",
          "Print Yes or No",
        ],
        constraints: ["String length <= 100"],
        starterCode:
          "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  // TODO: Check if palindrome\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string s;\n  cin >> s;\n  bool isPalin = true;\n  for (int i = 0; i < s.length() / 2; i++) {\n    if (s[i] != s[s.length() - 1 - i]) {\n      isPalin = false;\n      break;\n    }\n  }\n  cout << (isPalin ? "Yes" : "No");\n  return 0;\n}\n',
        testCases: [
          {
            input: "madam",
            expectedOutput: "Yes",
            description: "palindrome",
          },
          {
            input: "hello",
            expectedOutput: "No",
            description: "not palindrome",
          },
          {
            input: "a",
            expectedOutput: "Yes",
            description: "single char",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-05-04-string-search",
        title: "Search Character in String",
        description: "Find position of character in string.",
        theory:
          "### Finding Character\n```cpp\nstring str = \"Programming\";\nint pos = -1;\nfor (int i = 0; i < str.length(); i++) {\n  if (str[i] == 'g') {\n    pos = i;\n    break;\n  }\n}\n```\n\n### String find() method\n```cpp\nint pos = str.find('a');  // Returns position\nif (pos == string::npos) {\n  // Not found\n}\n```",
        problemStatement:
          "Read a string and a character. Find and print position of first occurrence of character (0-indexed). Print -1 if not found.",
        inputExample: "hello e",
        outputExample: "1",
        hints: [
          "Read string and character",
          "Loop through string",
          "Compare each character",
          "Print position when found",
        ],
        constraints: ["String length <= 100"],
        starterCode:
          "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  // TODO: Search for character\n  return 0;\n}\n",
        solution:
          "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string s;\n  char c;\n  cin >> s >> c;\n  int pos = -1;\n  for (int i = 0; i < s.length(); i++) {\n    if (s[i] == c) {\n      pos = i;\n      break;\n    }\n  }\n  cout << pos;\n  return 0;\n}\n",
        testCases: [
          {
            input: "hello e",
            expectedOutput: "1",
            description: "found at position 1",
          },
          {
            input: "hello z",
            expectedOutput: "-1",
            description: "not found",
          },
          {
            input: "code o",
            expectedOutput: "1",
            description: "different string",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "cpp-ch-06-pointers",
    title: "Pointers & References",
    description: "Learn pointer basics, pointer arithmetic, and references.",
    order: 6,
    exercises: [
      {
        id: "cpp-ex-06-01-pointer-basics",
        title: "Pointer Basics",
        description: "Create and dereference a pointer.",
        theory:
          "### Pointer Basics\nUse `&` to get address and `*` to read/write via pointer.",
        problemStatement:
          "Create integer x = 42, pointer ptr to x, and print dereferenced value.",
        inputExample: "",
        outputExample: "42",
        hints: ["Declare int x", "Create int* ptr = &x", "Print *ptr"],
        constraints: ["Must use pointer"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nint main(){\n  int x = 42;\n  int* ptr = &x;\n  cout << *ptr;\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "42", description: "basic" },
          { input: "", expectedOutput: "42", description: "dereference" },
          { input: "", expectedOutput: "42", description: "value" },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-06-02-modify-via-pointer",
        title: "Modify Through Pointer",
        description: "Change variable value using pointer.",
        theory: "### Write Through Pointer\nAssign via `*ptr = newValue;`.",
        problemStatement:
          "Initialize x as 10, modify it to 100 via pointer, print x.",
        inputExample: "",
        outputExample: "100",
        hints: ["Point to x", "Assign through *ptr", "Print x"],
        constraints: ["Must modify using pointer"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  int x = 10;\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nint main(){\n  int x = 10;\n  int* ptr = &x;\n  *ptr = 100;\n  cout << x;\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "100", description: "modify" },
          { input: "", expectedOutput: "100", description: "pointer write" },
          { input: "", expectedOutput: "100", description: "result" },
        ],
        xpReward: 85,
        difficulty: "medium",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-06-03-pointer-arithmetic",
        title: "Pointer Arithmetic",
        description: "Access array elements with pointers.",
        theory:
          "### Arrays and Pointers\n`arr` decays to pointer to first element.",
        problemStatement:
          "Use pointer arithmetic on array {5,10,15} to print second element.",
        inputExample: "",
        outputExample: "10",
        hints: ["Create int* p = arr", "Increment p", "Print *p"],
        constraints: ["Use pointer arithmetic"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  int arr[] = {5,10,15};\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nint main(){\n  int arr[] = {5,10,15};\n  int* p = arr;\n  p++;\n  cout << *p;\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "10", description: "second" },
          { input: "", expectedOutput: "10", description: "array" },
          { input: "", expectedOutput: "10", description: "pointer" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-06-04-dynamic-memory",
        title: "Dynamic Memory",
        description: "Allocate and free memory with new/delete.",
        theory:
          "### Heap Allocation\nUse `new` for allocation and `delete` to free.",
        problemStatement:
          "Allocate an integer on heap, assign 100, print it, and free memory.",
        inputExample: "",
        outputExample: "100",
        hints: ["Use new int", "Assign via *ptr", "delete ptr"],
        constraints: ["Must use new/delete"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nint main(){\n  int* ptr = new int;\n  *ptr = 100;\n  cout << *ptr;\n  delete ptr;\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "100", description: "heap" },
          { input: "", expectedOutput: "100", description: "new" },
          { input: "", expectedOutput: "100", description: "delete" },
        ],
        xpReward: 95,
        difficulty: "hard",
        language: "cpp",
        order: 4,
      },
      {
        id: "cpp-ex-06-05-references",
        title: "References",
        description: "Use references as aliases.",
        theory: "### References\n`int& ref = x;` creates alias to x.",
        problemStatement: "Create x=50, reference r to x, set r=75, print x.",
        inputExample: "",
        outputExample: "75",
        hints: ["Use int&", "Assign via reference", "Print x"],
        constraints: ["Must use reference"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  int x = 50;\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nint main(){\n  int x = 50;\n  int& r = x;\n  r = 75;\n  cout << x;\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "75", description: "alias" },
          { input: "", expectedOutput: "75", description: "write" },
          { input: "", expectedOutput: "75", description: "result" },
        ],
        xpReward: 95,
        difficulty: "hard",
        language: "cpp",
        order: 5,
      },
    ],
  },
  {
    id: "cpp-ch-07-oop-classes",
    title: "OOP I: Classes & Objects",
    description: "Create classes, constructors, and encapsulated methods.",
    order: 7,
    exercises: [
      {
        id: "cpp-ex-07-01-basic-class",
        title: "Basic Class",
        description: "Define class and create object.",
        theory:
          "### Class\nUse `class` with public members for object modeling.",
        problemStatement:
          "Create class Person with name and age. Create object and print `John 25`.",
        inputExample: "",
        outputExample: "John 25",
        hints: ["Define class", "Create object", "Assign fields"],
        constraints: ["Must use class"],
        starterCode:
          "#include <iostream>\n#include <string>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <string>\nusing namespace std;\nclass Person{ public: string name; int age; };\nint main(){\n  Person p; p.name = "John"; p.age = 25;\n  cout << p.name << " " << p.age;\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "John 25", description: "basic" },
          { input: "", expectedOutput: "John 25", description: "object" },
          { input: "", expectedOutput: "John 25", description: "fields" },
        ],
        xpReward: 85,
        difficulty: "medium",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-07-02-constructor",
        title: "Constructors",
        description: "Initialize object via constructor.",
        theory: "### Constructor\nSpecial function called on object creation.",
        problemStatement:
          "Create Car class with constructor for brand and print BMW.",
        inputExample: "",
        outputExample: "BMW",
        hints: ["Add constructor", "Set member", "Create object with arg"],
        constraints: ["Use constructor"],
        starterCode:
          "#include <iostream>\n#include <string>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <string>\nusing namespace std;\nclass Car{ public: string brand; Car(string b): brand(b){} };\nint main(){\n  Car c("BMW");\n  cout << c.brand;\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "BMW", description: "constructor" },
          { input: "", expectedOutput: "BMW", description: "init" },
          { input: "", expectedOutput: "BMW", description: "output" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-07-03-encapsulation",
        title: "Encapsulation",
        description: "Use private data with getters/setters.",
        theory:
          "### Encapsulation\nKeep data private and expose public methods.",
        problemStatement:
          "Create Account class with private balance and getter/setter. Print 1000.",
        inputExample: "",
        outputExample: "1000",
        hints: ["Use private", "Expose methods", "Set then get"],
        constraints: ["Must use private member"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nclass Account{ private: int balance; public: void setBalance(int b){balance=b;} int getBalance(){return balance;} };\nint main(){\n  Account a; a.setBalance(1000); cout << a.getBalance();\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "1000", description: "private" },
          { input: "", expectedOutput: "1000", description: "getter" },
          { input: "", expectedOutput: "1000", description: "setter" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-07-04-this-pointer",
        title: "this Pointer",
        description: "Disambiguate member and parameter names.",
        theory: "### this\n`this` points to current object instance.",
        problemStatement:
          "Create Box class with setWidth(int width) using this pointer. Print 50.",
        inputExample: "",
        outputExample: "50",
        hints: ["Use this->width", "Add getter", "Print value"],
        constraints: ["Must use this pointer"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nclass Box{ int width; public: void setWidth(int width){ this->width = width; } int getWidth(){ return width; } };\nint main(){\n  Box b; b.setWidth(50); cout << b.getWidth();\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "50", description: "this" },
          { input: "", expectedOutput: "50", description: "setter" },
          { input: "", expectedOutput: "50", description: "getter" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
      {
        id: "cpp-ex-07-05-copy-constructor",
        title: "Copy Constructor",
        description: "Copy object state into new object.",
        theory:
          "### Copy Constructor\n`ClassName(const ClassName& other)` customizes copy.",
        problemStatement:
          "Create Student class with copy constructor. Copy Alice 20 and print values.",
        inputExample: "",
        outputExample: "Alice 20",
        hints: ["Add copy ctor", "Copy each field", "Print copied object"],
        constraints: ["Must implement copy constructor"],
        starterCode:
          "#include <iostream>\n#include <string>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <string>\nusing namespace std;\nclass Student{ public: string name; int age; Student(string n, int a): name(n), age(a){} Student(const Student& other){ name = other.name; age = other.age; } };\nint main(){\n  Student s1("Alice", 20); Student s2(s1); cout << s2.name << " " << s2.age;\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "Alice 20", description: "copy" },
          { input: "", expectedOutput: "Alice 20", description: "values" },
          { input: "", expectedOutput: "Alice 20", description: "constructor" },
        ],
        xpReward: 100,
        difficulty: "hard",
        language: "cpp",
        order: 5,
      },
    ],
  },
  {
    id: "cpp-ch-08-oop-inheritance",
    title: "OOP II: Inheritance & Polymorphism",
    description:
      "Practice inheritance, virtual functions, and abstract classes.",
    order: 8,
    exercises: [
      {
        id: "cpp-ex-08-01-basic-inheritance",
        title: "Basic Inheritance",
        description: "Derive child class from parent.",
        theory: "### Inheritance\nChild class can reuse parent public methods.",
        problemStatement:
          "Create Vehicle parent and Car child. Print `Car is vehicle and has engine`.",
        inputExample: "",
        outputExample: "Car is vehicle and has engine",
        hints: [
          "Use `class Car : public Vehicle`",
          "Add child method",
          "Call both",
        ],
        constraints: ["Use inheritance"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\nclass Vehicle{ public: void show(){ cout << "Car is vehicle "; } };\nclass Car: public Vehicle{ public: void engine(){ cout << "and has engine"; } };\nint main(){ Car c; c.show(); c.engine(); return 0; }\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Car is vehicle and has engine",
            description: "inherit",
          },
          {
            input: "",
            expectedOutput: "Car is vehicle and has engine",
            description: "parent child",
          },
          {
            input: "",
            expectedOutput: "Car is vehicle and has engine",
            description: "output",
          },
        ],
        xpReward: 100,
        difficulty: "hard",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-08-02-virtual-functions",
        title: "Virtual Functions",
        description: "Override method and invoke polymorphically.",
        theory: "### Virtual\nVirtual methods enable runtime dispatch.",
        problemStatement:
          "Create Shape::draw virtual and Circle override printing `Drawing Circle`.",
        inputExample: "",
        outputExample: "Drawing Circle",
        hints: ["Use virtual", "Override in child", "Call draw"],
        constraints: ["Must use virtual"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\nclass Shape{ public: virtual void draw(){ cout << "Shape"; } };\nclass Circle: public Shape{ public: void draw() override { cout << "Drawing Circle"; } };\nint main(){ Circle c; c.draw(); return 0; }\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Drawing Circle",
            description: "virtual",
          },
          {
            input: "",
            expectedOutput: "Drawing Circle",
            description: "override",
          },
          {
            input: "",
            expectedOutput: "Drawing Circle",
            description: "result",
          },
        ],
        xpReward: 110,
        difficulty: "hard",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-08-03-abstract-class",
        title: "Abstract Class",
        description: "Implement pure virtual method in derived class.",
        theory: "### Pure Virtual\n`= 0` makes class abstract.",
        problemStatement:
          "Create abstract Bird with fly() and Sparrow implementation printing `Sparrow flies`.",
        inputExample: "",
        outputExample: "Sparrow flies",
        hints: ["Use virtual ... = 0", "Derive class", "Implement fly"],
        constraints: ["Use abstract class"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\nclass Bird{ public: virtual void fly() = 0; };\nclass Sparrow: public Bird{ public: void fly() override { cout << "Sparrow flies"; } };\nint main(){ Sparrow s; s.fly(); return 0; }\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Sparrow flies",
            description: "abstract",
          },
          {
            input: "",
            expectedOutput: "Sparrow flies",
            description: "pure virtual",
          },
          {
            input: "",
            expectedOutput: "Sparrow flies",
            description: "implementation",
          },
        ],
        xpReward: 115,
        difficulty: "hard",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-08-04-multiple-inheritance",
        title: "Multiple Inheritance",
        description: "Combine behavior from two base classes.",
        theory:
          "### Multiple Inheritance\nClass can inherit from more than one base.",
        problemStatement:
          "Create Flyable and Swimmable parents and Duck child; print `Flying Swimming`.",
        inputExample: "",
        outputExample: "Flying Swimming",
        hints: [
          "Inherit from both classes",
          "Call both methods",
          "Print in order",
        ],
        constraints: ["Use multiple inheritance"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\nclass Flyable{ public: void fly(){ cout << "Flying "; } };\nclass Swimmable{ public: void swim(){ cout << "Swimming"; } };\nclass Duck: public Flyable, public Swimmable{};\nint main(){ Duck d; d.fly(); d.swim(); return 0; }\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Flying Swimming",
            description: "multiple",
          },
          {
            input: "",
            expectedOutput: "Flying Swimming",
            description: "both",
          },
          {
            input: "",
            expectedOutput: "Flying Swimming",
            description: "output",
          },
        ],
        xpReward: 115,
        difficulty: "hard",
        language: "cpp",
        order: 4,
      },
      {
        id: "cpp-ex-08-05-operator-overloading",
        title: "Operator Overloading",
        description: "Overload + for custom class.",
        theory: "### Operator+\nDefine `operator+` to customize addition.",
        problemStatement: "Overload + in Number class so 7 + 8 prints 15.",
        inputExample: "",
        outputExample: "15",
        hints: ["Implement operator+", "Return Number", "Use this->value"],
        constraints: ["Must overload +"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nclass Number{ public: int value; Number operator+(const Number& o){ Number r; r.value = value + o.value; return r; } };\nint main(){ Number a,b,c; a.value=7; b.value=8; c=a+b; cout << c.value; return 0; }\n",
        testCases: [
          { input: "", expectedOutput: "15", description: "overload" },
          { input: "", expectedOutput: "15", description: "plus" },
          { input: "", expectedOutput: "15", description: "result" },
        ],
        xpReward: 120,
        difficulty: "hard",
        language: "cpp",
        order: 5,
      },
    ],
  },
  {
    id: "cpp-ch-09-file-io",
    title: "File I/O & Streams",
    description: "Read, write, append, and process file data.",
    order: 9,
    exercises: [
      {
        id: "cpp-ex-09-01-write-file",
        title: "Write to File",
        description: "Write text to a file.",
        theory: "### ofstream\nUse output stream to create/write files.",
        problemStatement:
          "Write `Hello File` to test.txt and print `File created`.",
        inputExample: "",
        outputExample: "File created",
        hints: ["Use ofstream", "Write text", "Close file"],
        constraints: ["Must use file stream"],
        starterCode:
          "#include <iostream>\n#include <fstream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <fstream>\nusing namespace std;\nint main(){\n  ofstream out("test.txt");\n  out << "Hello File";\n  out.close();\n  cout << "File created";\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "File created",
            description: "write",
          },
          {
            input: "",
            expectedOutput: "File created",
            description: "create",
          },
          {
            input: "",
            expectedOutput: "File created",
            description: "output",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-09-02-read-file",
        title: "Read from File",
        description: "Read and print first line from file.",
        theory: "### ifstream\nUse input stream with `getline` for line reads.",
        problemStatement: "Read first line from data.txt and print it.",
        inputExample: "",
        outputExample: "File content",
        hints: ["Open with ifstream", "Use getline", "Print line"],
        constraints: ["Must use ifstream"],
        starterCode:
          "#include <iostream>\n#include <fstream>\n#include <string>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <fstream>\n#include <string>\nusing namespace std;\nint main(){\n  ifstream in("data.txt");\n  string line;\n  getline(in, line);\n  cout << line;\n  in.close();\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "File content",
            description: "read",
          },
          {
            input: "",
            expectedOutput: "File content",
            description: "getline",
          },
          {
            input: "",
            expectedOutput: "File content",
            description: "line",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-09-03-append-file",
        title: "Append to File",
        description: "Append text without overwriting existing file.",
        theory: "### ios::app\nOpen in append mode to keep old content.",
        problemStatement:
          "Append `Extra Line` into data.txt and print `Appended`.",
        inputExample: "",
        outputExample: "Appended",
        hints: ["Use ios::app", "Write newline", "Close stream"],
        constraints: ["Must append"],
        starterCode:
          "#include <iostream>\n#include <fstream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <fstream>\nusing namespace std;\nint main(){\n  ofstream out("data.txt", ios::app);\n  out << "\\nExtra Line";\n  out.close();\n  cout << "Appended";\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "Appended", description: "append" },
          { input: "", expectedOutput: "Appended", description: "mode" },
          { input: "", expectedOutput: "Appended", description: "result" },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-09-04-binary-read-write",
        title: "Binary Read/Write",
        description: "Write integer in binary file and read it back.",
        theory: "### Binary IO\nUse `write` and `read` with `ios::binary`.",
        problemStatement:
          "Write integer 42 to binary file and then read and print it.",
        inputExample: "",
        outputExample: "42",
        hints: ["Use ios::binary", "write bytes", "read bytes"],
        constraints: ["Must use binary mode"],
        starterCode:
          "#include <iostream>\n#include <fstream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <fstream>\nusing namespace std;\nint main(){\n  int num = 42;\n  ofstream out("nums.bin", ios::binary);\n  out.write((char*)&num, sizeof(num));\n  out.close();\n  ifstream in("nums.bin", ios::binary);\n  in.read((char*)&num, sizeof(num));\n  cout << num;\n  in.close();\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "42", description: "binary" },
          { input: "", expectedOutput: "42", description: "read write" },
          { input: "", expectedOutput: "42", description: "value" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "cpp-ch-10-stl-containers",
    title: "STL I: Containers",
    description: "Master vector, map, set, stack, list, queue.",
    order: 10,
    exercises: [
      {
        id: "cpp-ex-10-01-vector",
        title: "Vector Operations",
        description: "Use push_back, pop_back, and iterate.",
        theory: "### vector\nDynamic array with push/pop operations.",
        problemStatement:
          "Add 5, 10, 15 to vector, pop_back, print remaining as `5 10`.",
        inputExample: "",
        outputExample: "5 10 ",
        hints: ["Create vector", "Push three values", "Pop one", "Print loop"],
        constraints: ["Must use vector"],
        starterCode:
          "#include <iostream>\n#include <vector>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <vector>\nusing namespace std;\nint main(){\n  vector<int> v;\n  v.push_back(5); v.push_back(10); v.push_back(15);\n  v.pop_back();\n  for(int x: v) cout << x << " ";\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "5 10 ", description: "vector" },
          { input: "", expectedOutput: "5 10 ", description: "push pop" },
          { input: "", expectedOutput: "5 10 ", description: "output" },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-10-02-map",
        title: "Map (Key-Value)",
        description: "Store and retrieve data by string key.",
        theory: "### map\nOrdered key-value container.",
        problemStatement:
          "Create map with marks[Alice]=90, marks[Bob]=85; print both.",
        inputExample: "",
        outputExample: "Alice: 90\nBob: 85",
        hints: ["Create map<string,int>", "Set values", "Print both"],
        constraints: ["Must use map"],
        starterCode:
          "#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\nint main(){\n  map<string,int> m;\n  m["Alice"]=90; m["Bob"]=85;\n  cout << "Alice: " << m["Alice"] << "\\n";\n  cout << "Bob: " << m["Bob"];\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Alice: 90\nBob: 85",
            description: "map",
          },
          {
            input: "",
            expectedOutput: "Alice: 90\nBob: 85",
            description: "key value",
          },
          {
            input: "",
            expectedOutput: "Alice: 90\nBob: 85",
            description: "output",
          },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-10-03-set",
        title: "Set (Unique)",
        description: "Store unique sorted elements.",
        theory: "### set\nAutomatic sorting and deduplication.",
        problemStatement:
          "Insert 3,1,2,3 into set and print sorted unique elements `1 2 3`.",
        inputExample: "",
        outputExample: "1 2 3 ",
        hints: ["Create set", "Insert values", "Print in order"],
        constraints: ["Must use set"],
        starterCode:
          "#include <iostream>\n#include <set>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <set>\nusing namespace std;\nint main(){\n  set<int> s;\n  s.insert(3); s.insert(1); s.insert(2); s.insert(3);\n  for(int x: s) cout << x << " ";\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "1 2 3 ", description: "set" },
          { input: "", expectedOutput: "1 2 3 ", description: "unique" },
          { input: "", expectedOutput: "1 2 3 ", description: "sorted" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-10-04-stack",
        title: "Stack (LIFO)",
        description: "Push and pop in LIFO order.",
        theory: "### stack\nLast-In First-Out container.",
        problemStatement:
          "Push 10, 20, 30; pop all and print in reverse `30 20 10`.",
        inputExample: "",
        outputExample: "30 20 10 ",
        hints: ["Create stack", "Push three", "Pop and print"],
        constraints: ["Must use stack"],
        starterCode:
          "#include <iostream>\n#include <stack>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <stack>\nusing namespace std;\nint main(){\n  stack<int> s;\n  s.push(10); s.push(20); s.push(30);\n  while(!s.empty()){ cout << s.top() << " "; s.pop(); }\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "30 20 10 ", description: "stack" },
          { input: "", expectedOutput: "30 20 10 ", description: "lifo" },
          { input: "", expectedOutput: "30 20 10 ", description: "order" },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
      {
        id: "cpp-ex-10-05-list",
        title: "List (Insert/Delete)",
        description: "Efficiently insert in middle of list.",
        theory: "### list\nDoubly-linked list with efficient insertion.",
        problemStatement:
          "Create list {1,2,3}, insert 25 at position 1, print `1 25 2 3`.",
        inputExample: "",
        outputExample: "1 25 2 3 ",
        hints: ["Create list", "Add three", "Use advance", "Insert"],
        constraints: ["Must use list"],
        starterCode:
          "#include <iostream>\n#include <list>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <list>\nusing namespace std;\nint main(){\n  list<int> l;\n  l.push_back(1); l.push_back(2); l.push_back(3);\n  auto it = l.begin(); advance(it, 1); l.insert(it, 25);\n  for(int x: l) cout << x << " ";\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "1 25 2 3 ", description: "list" },
          { input: "", expectedOutput: "1 25 2 3 ", description: "insert" },
          { input: "", expectedOutput: "1 25 2 3 ", description: "order" },
        ],
        xpReward: 100,
        difficulty: "hard",
        language: "cpp",
        order: 5,
      },
    ],
  },
  {
    id: "cpp-ch-11-stl-algorithms",
    title: "STL II: Algorithms",
    description: "Sort, search, count, and transform data.",
    order: 11,
    exercises: [
      {
        id: "cpp-ex-11-01-sort",
        title: "Sorting",
        description: "Use std::sort for arrays and vectors.",
        theory: "### std::sort\nQuickly sort containers in ascending order.",
        problemStatement: "Create vector {5,2,8,1}, sort it, print `1 2 5 8`.",
        inputExample: "",
        outputExample: "1 2 5 8 ",
        hints: ["Create vector", "Use sort", "Print loop"],
        constraints: ["Must use sort"],
        starterCode:
          "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){\n  vector<int> v={5,2,8,1};\n  sort(v.begin(), v.end());\n  for(int x: v) cout << x << " ";\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "1 2 5 8 ", description: "sort" },
          { input: "", expectedOutput: "1 2 5 8 ", description: "ascending" },
          { input: "", expectedOutput: "1 2 5 8 ", description: "output" },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-11-02-find",
        title: "Finding",
        description: "Search for element and return position.",
        theory: "### std::find\nLocate first occurrence of value.",
        problemStatement:
          "Find 30 in vector {10,20,30,40}, print position `2`.",
        inputExample: "",
        outputExample: "2",
        hints: ["Create vector", "Use find", "Calculate position"],
        constraints: ["Must use find"],
        starterCode:
          "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){\n  vector<int> v={10,20,30,40};\n  auto it = find(v.begin(), v.end(), 30);\n  if(it != v.end()) cout << (it - v.begin());\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "2", description: "find" },
          { input: "", expectedOutput: "2", description: "position" },
          { input: "", expectedOutput: "2", description: "index" },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-11-03-count",
        title: "Counting",
        description: "Count occurrence of element.",
        theory: "### std::count\nCounts how many elements match value.",
        problemStatement: "Count occurrences of 2 in {1,2,2,3,2}, print `3`.",
        inputExample: "",
        outputExample: "3",
        hints: ["Create vector", "Use count", "Print result"],
        constraints: ["Must use count"],
        starterCode:
          "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){\n  vector<int> v={1,2,2,3,2};\n  int c = count(v.begin(), v.end(), 2);\n  cout << c;\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "3", description: "count" },
          { input: "", expectedOutput: "3", description: "frequency" },
          { input: "", expectedOutput: "3", description: "result" },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-11-04-transform",
        title: "Transform",
        description: "Apply function to each element.",
        theory: "### std::transform\nApply operation to all elements.",
        problemStatement: "Double each element in {1,2,3}, print `2 4 6`.",
        inputExample: "",
        outputExample: "2 4 6 ",
        hints: ["Use transform lambda", "Return x * 2", "Print result"],
        constraints: ["Must use transform"],
        starterCode:
          "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main(){\n  vector<int> v={1,2,3};\n  transform(v.begin(), v.end(), v.begin(), [](int x){ return x*2; });\n  for(int x: v) cout << x << " ";\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "2 4 6 ", description: "transform" },
          { input: "", expectedOutput: "2 4 6 ", description: "double" },
          { input: "", expectedOutput: "2 4 6 ", description: "output" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 4,
      },
    ],
  },
  {
    id: "cpp-ch-12-exception-advanced",
    title: "Exception Handling & Advanced",
    description: "Handle errors, templates, and lambdas.",
    order: 12,
    exercises: [
      {
        id: "cpp-ex-12-01-try-catch",
        title: "Try-Catch",
        description: "Catch out_of_range exception.",
        theory: "### Try-Catch\nHandle exceptions with try-catch blocks.",
        problemStatement:
          "Access invalid vector index and catch out_of_range; print `Invalid index`.",
        inputExample: "",
        outputExample: "Invalid index",
        hints: ["Create vector", "Try .at(10)", "Catch out_of_range"],
        constraints: ["Must use try-catch"],
        starterCode:
          "#include <iostream>\n#include <vector>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\n#include <vector>\nusing namespace std;\nint main(){\n  vector<int> v={1,2,3};\n  try{ v.at(10); }\n  catch(out_of_range& e){ cout << "Invalid index"; }\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Invalid index",
            description: "exception",
          },
          {
            input: "",
            expectedOutput: "Invalid index",
            description: "caught",
          },
          {
            input: "",
            expectedOutput: "Invalid index",
            description: "output",
          },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "cpp",
        order: 1,
      },
      {
        id: "cpp-ex-12-02-custom-exception",
        title: "Custom Exception",
        description: "Define and throw custom exception.",
        theory:
          "### Custom Exception\nInherit from exception and override what().",
        problemStatement:
          "Create DivideByZero exception and print `Error: Cannot divide by zero`.",
        inputExample: "",
        outputExample: "Error: Cannot divide by zero",
        hints: ["Inherit exception", "Override what()", "Throw and catch"],
        constraints: ["Custom exception"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\nclass DivideByZero: public exception{ public: const char* what() const throw() { return "Error: Cannot divide by zero"; } };\nint main(){\n  try{ throw DivideByZero(); }\n  catch(DivideByZero& e){ cout << e.what(); }\n  return 0;\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Error: Cannot divide by zero",
            description: "custom",
          },
          {
            input: "",
            expectedOutput: "Error: Cannot divide by zero",
            description: "exception",
          },
          {
            input: "",
            expectedOutput: "Error: Cannot divide by zero",
            description: "message",
          },
        ],
        xpReward: 100,
        difficulty: "hard",
        language: "cpp",
        order: 2,
      },
      {
        id: "cpp-ex-12-03-templates",
        title: "Templates",
        description: "Generic function template.",
        theory: "### Template\nWrite code that works with any type.",
        problemStatement:
          "Create compare template returning larger value; test `20 5.5`.",
        inputExample: "",
        outputExample: "20 5.5",
        hints: ["Use template<typename T>", "Compare values", "Test types"],
        constraints: ["Must use templates"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          '#include <iostream>\nusing namespace std;\ntemplate<typename T>\nT compare(T a, T b){ return (a>b)?a:b; }\nint main(){\n  cout << compare(10,20) << " " << compare(2.5,5.5);\n  return 0;\n}\n',
        testCases: [
          { input: "", expectedOutput: "20 5.5", description: "template" },
          { input: "", expectedOutput: "20 5.5", description: "types" },
          { input: "", expectedOutput: "20 5.5", description: "result" },
        ],
        xpReward: 100,
        difficulty: "hard",
        language: "cpp",
        order: 3,
      },
      {
        id: "cpp-ex-12-04-lambda",
        title: "Lambda Functions",
        description: "Anonymous function for multiplication.",
        theory: "### Lambda\n`[capture](params){ body }` syntax.",
        problemStatement: "Create lambda multiply(6,7) and print `42`.",
        inputExample: "",
        outputExample: "42",
        hints: ["Use auto mult =", "Capture nothing []", "Return result"],
        constraints: ["Must use lambda"],
        starterCode:
          "#include <iostream>\nusing namespace std;\nint main(){\n  // TODO\n  return 0;\n}\n",
        solution:
          "#include <iostream>\nusing namespace std;\nint main(){\n  auto mult = [](int a, int b){ return a*b; };\n  cout << mult(6,7);\n  return 0;\n}\n",
        testCases: [
          { input: "", expectedOutput: "42", description: "lambda" },
          { input: "", expectedOutput: "42", description: "multiply" },
          { input: "", expectedOutput: "42", description: "result" },
        ],
        xpReward: 100,
        difficulty: "hard",
        language: "cpp",
        order: 4,
      },
    ],
  },
];

async function seedCppCourse() {
  const totalXP = cppChapters
    .flatMap((chapter) => chapter.exercises)
    .reduce((sum, exercise) => sum + exercise.xpReward, 0);

  const course = await prisma.course.upsert({
    where: { id: CPP_COURSE.id },
    create: {
      ...CPP_COURSE,
      totalXP,
    },
    update: {
      title: CPP_COURSE.title,
      shortDescription: CPP_COURSE.shortDescription,
      description: CPP_COURSE.description,
      category: CPP_COURSE.category,
      difficulty: CPP_COURSE.difficulty,
      thumbnail: CPP_COURSE.thumbnail,
      isPremium: CPP_COURSE.isPremium,
      estimatedHours: CPP_COURSE.estimatedHours,
      enrolledCount: CPP_COURSE.enrolledCount,
      rating: CPP_COURSE.rating,
      tags: CPP_COURSE.tags,
      totalXP,
    },
  });

  const chapterIds = cppChapters.map((chapter) => chapter.id);

  await prisma.chapter.deleteMany({
    where: {
      courseId: course.id,
      id: { notIn: chapterIds },
    },
  });

  for (const chapter of cppChapters) {
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
    `Seeded ${course.title}: ${cppChapters.length} chapters, ${cppChapters.flatMap((c) => c.exercises).length} exercises`,
  );
}

const HTML_COURSE = {
  id: "html-complete-mastery",
  title: "HTML: Complete Guide from Beginner to Advanced",
  shortDescription:
    "Learn HTML end-to-end with detailed theory, practical tasks, and real page-building exercises.",
  description:
    "Master HTML from first principles to advanced best practices. This course covers document structure, semantic markup, text formatting, links, images, lists, tables, forms, media, accessibility, SEO basics, and production-ready page composition. Each chapter includes detailed theory and hands-on exercises so learners can build confidence progressively.",
  category: "Web Development",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 48,
  enrolledCount: 0,
  rating: 4.9,
  tags: [
    "HTML",
    "Web Development",
    "Frontend",
    "Semantic HTML",
    "Accessibility",
    "SEO",
  ],
};

const htmlChapters: SeedChapter[] = [
  {
    id: "html-ch-01-foundation",
    title: "HTML Foundations: Structure, Syntax, and Elements",
    description:
      "Understand what HTML is, how browsers parse documents, and how to build valid page structure.",
    order: 1,
    exercises: [
      {
        id: "html-ex-01-01-document-skeleton",
        title: "Build a Valid HTML5 Document Skeleton",
        description:
          "Create the minimum correct HTML document with doctype, html, head, and body.",
        theory: `### What HTML Really Is
HTML (HyperText Markup Language) is a **document structure language**, not a programming language. It describes meaning and hierarchy of content so browsers, screen readers, and search engines can understand your page.

### Core Document Anatomy
Every HTML5 document should include:
- \`<!DOCTYPE html>\` to trigger standards mode
- \`<html lang="...">\` root element for language declaration
- \`<head>\` for metadata, title, and linked resources
- \`<body>\` for visible content

### Why This Matters
If you skip proper structure, browser behavior can become inconsistent and accessibility can suffer. A clean skeleton is the base for every professional page.

### Example
\
\
\
html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello Web</h1>
  </body>
</html>
\
\
\
`,
        problemStatement:
          "Create a valid HTML5 document with page title `HTML Basics` and an `<h1>` that says `Welcome to HTML`.",
        inputExample: "",
        outputExample:
          "A valid HTML page with correct root structure and heading.",
        hints: [
          "Start with <!DOCTYPE html>",
          "Use html, head, and body in correct order",
          "Put title in head and h1 in body",
        ],
        constraints: [
          "Must use HTML5 doctype",
          "Must include lang attribute on html element",
          "Must include title and one h1",
        ],
        starterCode: `<!DOCTYPE html>
<html>
  <head>
    <!-- TODO: add title and metadata -->
  </head>
  <body>
    <!-- TODO: add heading -->
  </body>
</html>`,
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML Basics</title>
  </head>
  <body>
    <h1>Welcome to HTML</h1>
  </body>
</html>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains HTML5 skeleton and title",
            description: "document structure",
          },
          {
            input: "",
            expectedOutput: "Contains h1 with correct text",
            description: "heading check",
          },
          {
            input: "",
            expectedOutput: "Includes lang and meta charset",
            description: "accessibility baseline",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "html",
        order: 1,
      },
      {
        id: "html-ex-01-02-headings-paragraphs",
        title: "Use Headings and Paragraphs Correctly",
        description:
          "Practice semantic text structure with heading levels and paragraph blocks.",
        theory: `### Text Structure Rules
Headings communicate document hierarchy:
- \`<h1>\` for the page's primary heading
- \`<h2>\` for major sections
- \`<h3>\` for subsections

Paragraphs should use \`<p>\`; avoid using line breaks as a substitute for real structure.

### Best Practices
- Keep exactly one logical \`<h1>\` per page region
- Do not skip heading levels randomly (e.g., h1 to h4)
- Use headings for meaning, not visual size

Well-structured text improves readability, SEO, and assistive technology navigation.`,
        problemStatement:
          "Create a page body with one `<h1>` (`HTML Learning Path`), two `<h2>` sections (`Introduction`, `Next Steps`), and one paragraph under each section.",
        inputExample: "",
        outputExample:
          "A semantically structured text layout with heading hierarchy and paragraphs.",
        hints: [
          "Use one top-level h1",
          "Place each paragraph directly under related h2",
          "Keep content meaningful and concise",
        ],
        constraints: [
          "Must include exactly one h1",
          "Must include exactly two h2",
          "Must include two paragraphs",
        ],
        starterCode: `<body>
  <!-- TODO -->
</body>`,
        solution: `<body>
  <h1>HTML Learning Path</h1>

  <h2>Introduction</h2>
  <p>HTML defines the structure and meaning of web content.</p>

  <h2>Next Steps</h2>
  <p>Practice daily by building small pages with semantic elements.</p>
</body>`,
        testCases: [
          {
            input: "",
            expectedOutput: "One h1, two h2, two p tags",
            description: "tag count",
          },
          {
            input: "",
            expectedOutput: "Proper heading order",
            description: "hierarchy",
          },
          {
            input: "",
            expectedOutput: "Paragraphs under sections",
            description: "structure",
          },
        ],
        xpReward: 70,
        difficulty: "easy",
        language: "html",
        order: 2,
      },
      {
        id: "html-ex-01-03-comments-whitespace",
        title: "Comments and Readable Markup",
        description:
          "Add HTML comments and improve code readability with indentation.",
        theory: `### Clean HTML is Professional HTML
Browsers ignore most whitespace and comments in rendering, but humans don't. Readable formatting improves maintenance and team collaboration.

### Comments
Use comments to describe sections:
\
\
\
html
<!-- Header section -->
\
\
\

### Formatting Guidelines
- Indent nested content consistently
- Group related blocks
- Use comments for major layout sections only (not every line)

Readable structure reduces errors when pages scale.`,
        problemStatement:
          "Create a body with header and main sections, each labeled using HTML comments. Include one heading in header and one paragraph in main.",
        inputExample: "",
        outputExample: "Structured and commented HTML body.",
        hints: [
          "Use <!-- Header --> and <!-- Main --> comments",
          "Place h1 in header block",
          "Place p in main block",
        ],
        constraints: [
          "Must include two section comments",
          "Must be properly indented",
        ],
        starterCode: `<body>
  <!-- TODO -->
</body>`,
        solution: `<body>
  <!-- Header section -->
  <header>
    <h1>My HTML Notes</h1>
  </header>

  <!-- Main content section -->
  <main>
    <p>This page demonstrates clean, readable markup.</p>
  </main>
</body>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains header + main comments",
            description: "comments",
          },
          {
            input: "",
            expectedOutput: "Contains h1 and p",
            description: "content",
          },
          {
            input: "",
            expectedOutput: "Indented nested tags",
            description: "readability",
          },
        ],
        xpReward: 70,
        difficulty: "easy",
        language: "html",
        order: 3,
      },
    ],
  },
  {
    id: "html-ch-02-text-semantics",
    title: "Text, Semantics, and Inline Elements",
    description:
      "Use semantic inline tags for emphasis, quotations, abbreviations, code, and entities.",
    order: 2,
    exercises: [
      {
        id: "html-ex-02-01-emphasis-tags",
        title: "Strong vs Emphasis",
        description: "Use `<strong>` and `<em>` with proper semantic meaning.",
        theory: `### Visual vs Semantic Meaning
\`<strong>\` indicates **strong importance**.
\`<em>\` indicates *stress emphasis*.

These are semantic tags, so they carry meaning for assistive technologies, unlike plain styling with CSS alone.

### Usage Example
\
\
\
html
<p><strong>Warning:</strong> Save your work frequently.</p>
<p>Please <em>carefully</em> review all inputs.</p>
\
\
\
`,
        problemStatement:
          "Write two paragraphs: first with a warning label using `<strong>`, second with one emphasized word using `<em>`.",
        inputExample: "",
        outputExample: "Two paragraphs with correct semantic emphasis.",
        hints: [
          "Use strong for important label",
          "Use em for stressed word",
          "Do not use b or i in this exercise",
        ],
        constraints: [
          "Must use both strong and em tags",
          "Each used at least once",
        ],
        starterCode: `<p><!-- TODO --></p>
<p><!-- TODO --></p>`,
        solution: `<p><strong>Warning:</strong> This action cannot be undone.</p>
<p>Please read the instructions <em>carefully</em> before submitting.</p>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains strong tag",
            description: "strong usage",
          },
          {
            input: "",
            expectedOutput: "Contains em tag",
            description: "em usage",
          },
          {
            input: "",
            expectedOutput: "Two paragraph elements",
            description: "paragraph structure",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "html",
        order: 1,
      },
      {
        id: "html-ex-02-02-quotations-code",
        title: "Quotations and Code Snippets",
        description:
          "Use `blockquote`, `q`, and `code` to represent quoted and technical text correctly.",
        theory: `### Specialized Text Tags
- \`<blockquote>\`: long, standalone quotation
- \`<q>\`: short inline quote
- \`<code>\`: inline machine-readable code snippet

Semantic tags improve readability and clarity for both users and crawlers.

### Example
\
\
\
html
<blockquote>Learning never stops.</blockquote>
<p>Use <code>npm run dev</code> to start the server.</p>
\
\
\
`,
        problemStatement:
          "Create one blockquote with any quote and one paragraph that includes inline `<code>` showing `<h1>Hello</h1>`.",
        inputExample: "",
        outputExample: "Quote block and paragraph with code representation.",
        hints: [
          "Use blockquote for long quote",
          "Wrap HTML snippet using code",
          "Escape angle brackets in visible code",
        ],
        constraints: [
          "Must include one blockquote and one inline code element",
        ],
        starterCode: `<!-- TODO: quote + inline code -->`,
        solution: `<blockquote>
  "The best way to learn web development is to build real pages."
</blockquote>
<p>Inline HTML example: <code>&lt;h1&gt;Hello&lt;/h1&gt;</code></p>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains blockquote",
            description: "quote block",
          },
          {
            input: "",
            expectedOutput: "Contains code element with escaped tags",
            description: "inline code",
          },
          {
            input: "",
            expectedOutput: "Valid semantic text structure",
            description: "semantics",
          },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "html",
        order: 2,
      },
      {
        id: "html-ex-02-03-entities",
        title: "Special Characters and Entities",
        description: "Display reserved symbols safely using HTML entities.",
        theory: `### Why Entities Exist
Characters like \`<\`, \`>\`, and \`&\` have special meaning in HTML syntax. To display them as text, use entities:
- \`&lt;\` for <
- \`&gt;\` for >
- \`&amp;\` for &
- \`&copy;\` for ©

Using entities prevents parser confusion and ensures correct output.`,
        problemStatement:
          "Print this exact visible line inside a paragraph: `Use <header> & <main> tags © 2026`.",
        inputExample: "",
        outputExample: "Use <header> & <main> tags © 2026",
        hints: ["Escape < and >", "Escape &", "Use &copy; for copyright sign"],
        constraints: ["Output text must be visually exact"],
        starterCode: `<p><!-- TODO --></p>`,
        solution: `<p>Use &lt;header&gt; &amp; &lt;main&gt; tags &copy; 2026</p>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Exact expected visible text",
            description: "rendered output",
          },
          {
            input: "",
            expectedOutput: "Uses lt gt amp and copy entities",
            description: "entity usage",
          },
          {
            input: "",
            expectedOutput: "Paragraph wrapper present",
            description: "tag requirement",
          },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "html",
        order: 3,
      },
    ],
  },
  {
    id: "html-ch-03-links-images",
    title: "Links, Images, and Navigation Basics",
    description:
      "Create hyperlinks, handle paths, and embed images with meaningful alternatives.",
    order: 3,
    exercises: [
      {
        id: "html-ex-03-01-anchor-links",
        title: "Create External and Internal Links",
        description:
          "Practice anchor tag attributes for external links and in-page navigation.",
        theory: `### Anchor Essentials
\`<a href="...">\` creates navigation.

Common attributes:
- \`href\`: destination URL or fragment
- \`target="_blank"\`: open in new tab
- \`rel="noopener noreferrer"\`: security best-practice with _blank

You can also create in-page links using IDs:
\`href="#section-id"\``,
        problemStatement:
          "Create one external link to `https://www.w3.org/` opening in new tab, and one internal jump link to a section with id `practice`.",
        inputExample: "",
        outputExample: "One secure external link and one fragment link.",
        hints: [
          "Use target and rel for external link",
          "Use href='#practice' for internal navigation",
          "Create a section with matching id",
        ],
        constraints: ["Must include both links and matching internal id"],
        starterCode: `<!-- TODO -->`,
        solution: `<a href="https://www.w3.org/" target="_blank" rel="noopener noreferrer">Visit W3C</a>
<a href="#practice">Go to Practice Section</a>

<section id="practice">
  <h2>Practice</h2>
</section>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains secure external anchor",
            description: "external link",
          },
          {
            input: "",
            expectedOutput: "Contains fragment link to #practice",
            description: "internal link",
          },
          {
            input: "",
            expectedOutput: "Contains section with id practice",
            description: "target section",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "html",
        order: 1,
      },
      {
        id: "html-ex-03-02-image-basics",
        title: "Add Images with Accessible Alt Text",
        description:
          "Use image tags correctly with `src`, `alt`, width/height, and captions.",
        theory: `### Image Best Practices
\`<img>\` is a void element (no closing tag). Important attributes:
- \`src\`: image URL/path
- \`alt\`: alternative text for accessibility and fallback

Use meaningful alt text that describes purpose, not just "image".

Optional: wrap with \`<figure>\` and \`<figcaption>\` for context.`,
        problemStatement:
          "Create a figure containing an image from `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80` with alt text `Laptop showing code editor` and a figcaption `Coding workspace`.",
        inputExample: "",
        outputExample: "Image rendered with descriptive alt and caption.",
        hints: [
          "Use figure and figcaption",
          "Keep alt descriptive and concise",
          "You may set width for layout stability",
        ],
        constraints: ["Must include img alt and figcaption"],
        starterCode: `<!-- TODO -->`,
        solution: `<figure>
  <img
    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    alt="Laptop showing code editor"
    width="600"
  />
  <figcaption>Coding workspace</figcaption>
</figure>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains image with src",
            description: "img source",
          },
          {
            input: "",
            expectedOutput: "Contains meaningful alt text",
            description: "accessibility",
          },
          {
            input: "",
            expectedOutput: "Contains figcaption",
            description: "caption",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "html",
        order: 2,
      },
      {
        id: "html-ex-03-03-paths-and-assets",
        title: "Relative vs Absolute Paths",
        description:
          "Demonstrate understanding of linking local and remote resources.",
        theory: `### Path Types
- **Absolute URL**: full address (e.g., https://example.com/page)
- **Relative path**: depends on current file location (e.g., ./about.html, ../images/logo.png)

Relative paths are useful inside projects; absolute URLs are required for external sites/resources.

Understanding paths prevents broken links and missing assets.`,
        problemStatement:
          "Write one link using relative path `./contact.html` and one image using absolute URL `https://via.placeholder.com/200x100` with alt `Placeholder banner`.",
        inputExample: "",
        outputExample: "Relative anchor and absolute image URL both present.",
        hints: [
          "href should start with ./ for relative",
          "Use full https URL for image src",
          "Add alt attribute",
        ],
        constraints: [
          "Must include exactly one relative link and one absolute image",
        ],
        starterCode: `<!-- TODO -->`,
        solution: `<a href="./contact.html">Contact Page</a>
<img src="https://via.placeholder.com/200x100" alt="Placeholder banner" />`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains href ./contact.html",
            description: "relative path",
          },
          {
            input: "",
            expectedOutput: "Contains absolute image URL",
            description: "absolute path",
          },
          {
            input: "",
            expectedOutput: "Image has alt text",
            description: "accessibility",
          },
        ],
        xpReward: 90,
        difficulty: "easy",
        language: "html",
        order: 3,
      },
    ],
  },
  {
    id: "html-ch-04-lists-tables",
    title: "Lists and Tables for Structured Content",
    description:
      "Represent grouped and tabular information with semantic list and table tags.",
    order: 4,
    exercises: [
      {
        id: "html-ex-04-01-lists",
        title: "Ordered and Unordered Lists",
        description: "Build both list types and understand when to use each.",
        theory: `### Choosing List Type
- \`<ul>\` for unordered items
- \`<ol>\` when order/sequence matters
- \`<li>\` for each list item

Lists improve readability and are preferred over manual separators for grouped content.`,
        problemStatement:
          "Create an unordered list of 3 frontend skills and an ordered list of 3 learning steps.",
        inputExample: "",
        outputExample: "One ul and one ol with three list items each.",
        hints: [
          "Use ul for skills",
          "Use ol for ordered steps",
          "Use li in each list",
        ],
        constraints: ["Each list must have exactly 3 items"],
        starterCode: `<!-- TODO -->`,
        solution: `<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<ol>
  <li>Learn HTML structure</li>
  <li>Practice semantic tags</li>
  <li>Build a complete page</li>
</ol>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains one ul",
            description: "unordered",
          },
          {
            input: "",
            expectedOutput: "Contains one ol",
            description: "ordered",
          },
          {
            input: "",
            expectedOutput: "Three li in each",
            description: "items",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "html",
        order: 1,
      },
      {
        id: "html-ex-04-02-nested-lists",
        title: "Nested Lists",
        description: "Model hierarchy by nesting child lists correctly.",
        theory: `### Hierarchical Content
Nested lists represent parent-child relationships clearly (e.g., categories and sub-items). Child list should be inside the relevant parent \`<li>\`.

Incorrect nesting leads to invalid structure and confusing rendering.`,
        problemStatement:
          "Create a list `Web Development` with two nested items: `Frontend` and `Backend`.",
        inputExample: "",
        outputExample: "A correctly nested list hierarchy.",
        hints: [
          "Parent li contains child ul",
          "Do not place child ul as sibling of li",
          "Use meaningful labels",
        ],
        constraints: ["Must include nested list inside parent li"],
        starterCode: `<!-- TODO -->`,
        solution: `<ul>
  <li>
    Web Development
    <ul>
      <li>Frontend</li>
      <li>Backend</li>
    </ul>
  </li>
</ul>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains nested ul",
            description: "nesting",
          },
          {
            input: "",
            expectedOutput: "Has parent category item",
            description: "parent",
          },
          {
            input: "",
            expectedOutput: "Has two child items",
            description: "children",
          },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "html",
        order: 2,
      },
      {
        id: "html-ex-04-03-basic-table",
        title: "Create a Semantic Data Table",
        description:
          "Build a table with header row and two data rows using table semantics.",
        theory: `### Table Elements
- \`<table>\`: table container
- \`<thead>\`, \`<tbody>\`: logical grouping
- \`<tr>\`: table row
- \`<th>\`: header cell
- \`<td>\`: data cell

Use tables only for tabular data, not page layout.`,
        problemStatement:
          "Create a table with columns `Topic` and `Duration` and rows: (`HTML Basics`, `2h`) and (`Forms`, `3h`).",
        inputExample: "",
        outputExample: "Two-column table with header and body.",
        hints: [
          "Use thead and tbody",
          "Use th for headers",
          "Add two tr rows in tbody",
        ],
        constraints: ["Must contain exactly 2 headers and 2 body rows"],
        starterCode: `<!-- TODO -->`,
        solution: `<table>
  <thead>
    <tr>
      <th>Topic</th>
      <th>Duration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML Basics</td>
      <td>2h</td>
    </tr>
    <tr>
      <td>Forms</td>
      <td>3h</td>
    </tr>
  </tbody>
</table>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains table, thead, tbody",
            description: "table sections",
          },
          {
            input: "",
            expectedOutput: "Contains Topic and Duration headers",
            description: "headers",
          },
          {
            input: "",
            expectedOutput: "Contains two body rows",
            description: "rows",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "html",
        order: 3,
      },
    ],
  },
  {
    id: "html-ch-05-forms",
    title: "Forms and User Input",
    description:
      "Design robust forms using labels, input types, validation, and grouped controls.",
    order: 5,
    exercises: [
      {
        id: "html-ex-05-01-form-structure",
        title: "Build a Basic Registration Form",
        description: "Use form, label, and input pairing correctly.",
        theory: `### Form Fundamentals
HTML forms collect user data and submit it via HTTP. Accessibility starts with proper \`<label for=...>\` to link labels with form fields.

Core pieces:
- \`<form action method>\`
- \`<label>\` + \`<input>\`
- \`<button type="submit">\`

If labels are missing, screen reader users struggle to complete forms.`,
        problemStatement:
          "Create a form with fields: Full Name (text), Email (email), and a submit button.",
        inputExample: "",
        outputExample:
          "Accessible form with two labeled fields and submit button.",
        hints: [
          "Use id on inputs",
          "Match label for attribute to id",
          "Use button type submit",
        ],
        constraints: ["Must include labels for both inputs"],
        starterCode: `<!-- TODO -->`,
        solution: `<form action="#" method="post">
  <label for="fullName">Full Name</label>
  <input id="fullName" name="fullName" type="text" />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" />

  <button type="submit">Register</button>
</form>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains form element",
            description: "form",
          },
          {
            input: "",
            expectedOutput: "Contains two labeled inputs",
            description: "labels",
          },
          {
            input: "",
            expectedOutput: "Contains submit button",
            description: "submit",
          },
        ],
        xpReward: 100,
        difficulty: "easy",
        language: "html",
        order: 1,
      },
      {
        id: "html-ex-05-02-input-validation",
        title: "Use Required Fields and Constraints",
        description:
          "Apply basic native validation with required, minlength, and pattern.",
        theory: `### Native HTML Validation
Before JavaScript, browsers already provide useful validation attributes:
- \`required\`
- \`minlength\`, \`maxlength\`
- \`type="email"\`, \`type="url"\`
- \`pattern\` for regex-based format checks

Native constraints improve data quality and reduce invalid submissions early.`,
        problemStatement:
          "Create inputs for username and password where username is required with minlength 4, and password is required with minlength 8.",
        inputExample: "",
        outputExample: "Validation-enabled form inputs.",
        hints: [
          "Use required attribute",
          "Set minlength values",
          "Use password input type",
        ],
        constraints: [
          "username minlength=4",
          "password minlength=8",
          "both required",
        ],
        starterCode: `<!-- TODO -->`,
        solution: `<form action="#" method="post">
  <label for="username">Username</label>
  <input id="username" name="username" type="text" required minlength="4" />

  <label for="password">Password</label>
  <input id="password" name="password" type="password" required minlength="8" />

  <button type="submit">Create Account</button>
</form>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Both fields required",
            description: "required",
          },
          {
            input: "",
            expectedOutput: "Username minlength 4",
            description: "username constraint",
          },
          {
            input: "",
            expectedOutput: "Password minlength 8",
            description: "password constraint",
          },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "html",
        order: 2,
      },
      {
        id: "html-ex-05-03-select-radio-checkbox",
        title: "Select, Radio, and Checkbox Controls",
        description:
          "Combine multiple form control types in one practical form.",
        theory: `### Form Control Variety
Different controls communicate different input types:
- \`<select>\` for single/multi choice from known options
- \`radio\` for one-of-many
- \`checkbox\` for many-of-many or consent

Group related controls with \`<fieldset>\` and \`<legend>\` for accessibility and semantics.`,
        problemStatement:
          "Create a form section with: a select for experience level (Beginner/Intermediate/Advanced), two radio options for newsletter (Yes/No), and one checkbox for terms acceptance.",
        inputExample: "",
        outputExample: "Form with select, radios, and checkbox.",
        hints: [
          "Use same name for radio group",
          "Use value attributes on options/inputs",
          "Use labels for each control",
        ],
        constraints: ["Must include select + radio group + checkbox"],
        starterCode: `<!-- TODO -->`,
        solution: `<form action="#" method="post">
  <label for="level">Experience Level</label>
  <select id="level" name="level">
    <option value="beginner">Beginner</option>
    <option value="intermediate">Intermediate</option>
    <option value="advanced">Advanced</option>
  </select>

  <fieldset>
    <legend>Subscribe to newsletter?</legend>
    <label><input type="radio" name="newsletter" value="yes" /> Yes</label>
    <label><input type="radio" name="newsletter" value="no" /> No</label>
  </fieldset>

  <label>
    <input type="checkbox" name="terms" required /> I accept the terms.
  </label>
</form>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains select with 3 options",
            description: "select",
          },
          {
            input: "",
            expectedOutput: "Contains radio group",
            description: "radio",
          },
          {
            input: "",
            expectedOutput: "Contains terms checkbox",
            description: "checkbox",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "html",
        order: 3,
      },
    ],
  },
  {
    id: "html-ch-06-semantic-layout",
    title: "Semantic Layout and Page Regions",
    description:
      "Build maintainable page structure using semantic sectioning elements.",
    order: 6,
    exercises: [
      {
        id: "html-ex-06-01-semantic-shell",
        title: "Build a Semantic Page Shell",
        description:
          "Compose a complete semantic shell with header, nav, main, section, article, aside, and footer.",
        theory: `### Semantic Layout Matters
Instead of generic wrappers everywhere, semantic tags communicate intent:
- \`header\`, \`nav\`, \`main\`, \`section\`, \`article\`, \`aside\`, \`footer\`

Benefits:
- Better accessibility landmarks
- Cleaner document outline
- Easier maintenance and SEO interpretation`,
        problemStatement:
          "Create a semantic page layout containing all of these elements: header, nav, main, section, article, aside, footer.",
        inputExample: "",
        outputExample: "Well-structured semantic layout.",
        hints: [
          "Use each semantic tag once",
          "Nest article inside section",
          "Place nav inside or near header",
        ],
        constraints: ["All required semantic tags must be present"],
        starterCode: `<!-- TODO -->`,
        solution: `<header>
  <h1>HTML Course Portal</h1>
  <nav>
    <a href="#">Home</a>
    <a href="#">Lessons</a>
  </nav>
</header>

<main>
  <section>
    <article>
      <h2>Semantic HTML</h2>
      <p>Semantic tags improve accessibility and structure.</p>
    </article>
  </section>
  <aside>
    <p>Tip: Use landmarks for easier navigation.</p>
  </aside>
</main>

<footer>
  <p>&copy; 2026 PixelLearn</p>
</footer>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains all required semantic elements",
            description: "all tags",
          },
          {
            input: "",
            expectedOutput: "Contains nav links",
            description: "navigation",
          },
          {
            input: "",
            expectedOutput: "Contains footer text",
            description: "footer",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "html",
        order: 1,
      },
      {
        id: "html-ex-06-02-div-vs-semantic",
        title: "Refactor div-heavy Markup to Semantic",
        description:
          "Practice replacing generic wrappers with meaningful HTML5 elements.",
        theory: `### Div Is Not Wrong — But Often Overused
\`<div>\` is generic and useful, but if a semantic element exists, prefer it.

Examples:
- Site top area → \`header\`
- Primary navigation → \`nav\`
- Main content → \`main\`
- Independent content card → \`article\`

This improves machine understanding and future maintainability.`,
        problemStatement:
          "Rewrite a page containing generic wrappers into semantic tags by using header, main, article, and footer.",
        inputExample: "",
        outputExample: "Semantically refactored structure.",
        hints: [
          "Map each logical area to semantic tag",
          "Keep content same, improve tags",
          "Avoid unnecessary divs",
        ],
        constraints: ["Must include header, main, article, and footer"],
        starterCode: `<div class="top">Site Header</div>
<div class="content">Main article text</div>
<div class="bottom">Footer</div>`,
        solution: `<header>Site Header</header>
<main>
  <article>Main article text</article>
</main>
<footer>Footer</footer>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Uses semantic tags instead of generic divs",
            description: "refactor",
          },
          {
            input: "",
            expectedOutput: "Contains article in main",
            description: "content semantics",
          },
          {
            input: "",
            expectedOutput: "Preserves logical structure",
            description: "structure",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "html",
        order: 2,
      },
      {
        id: "html-ex-06-03-landmarks",
        title: "Add Landmark Regions for Accessibility",
        description:
          "Create clear landmark navigation for assistive technology users.",
        theory: `### Landmark Navigation
Screen reader users often jump between landmark regions (header, nav, main, footer).

Using proper landmarks:
- Speeds up navigation
- Reduces cognitive load
- Creates predictable page structure

Landmarks are one of the easiest high-impact accessibility improvements.`,
        problemStatement:
          "Build a simple page with landmark regions: header, nav, main, and footer, each containing one line of text.",
        inputExample: "",
        outputExample: "Accessible landmark-based layout.",
        hints: [
          "Use one text line in each region",
          "Keep landmarks in logical order",
          "Avoid extra wrappers",
        ],
        constraints: ["Must include exactly one of each required landmark tag"],
        starterCode: `<!-- TODO -->`,
        solution: `<header>Course Header</header>
<nav>Main Navigation</nav>
<main>Primary learning content</main>
<footer>Site Footer</footer>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains header nav main footer",
            description: "landmarks",
          },
          {
            input: "",
            expectedOutput: "Logical order maintained",
            description: "order",
          },
          {
            input: "",
            expectedOutput: "Each landmark has content",
            description: "content",
          },
        ],
        xpReward: 110,
        difficulty: "easy",
        language: "html",
        order: 3,
      },
    ],
  },
  {
    id: "html-ch-07-accessibility-seo",
    title: "Accessibility and SEO Essentials",
    description:
      "Apply practical accessibility and SEO foundations directly in HTML markup.",
    order: 7,
    exercises: [
      {
        id: "html-ex-07-01-accessible-images-forms",
        title: "Accessible Images and Form Labels",
        description:
          "Apply alt attributes and explicit form labels for inclusive UX.",
        theory: `### Accessibility First
Two high-impact essentials:
1. Meaningful \`alt\` on informative images
2. Programmatic label association for form inputs

These significantly improve usability for assistive technology users and are expected in production-grade HTML.`,
        problemStatement:
          "Create an image with meaningful alt and a labeled email input where label uses `for` pointing to input `id`.",
        inputExample: "",
        outputExample: "Accessible image + form control pairing.",
        hints: [
          "Avoid generic alt text",
          "Match label for and input id",
          "Use email input type",
        ],
        constraints: ["Must include one img with alt and one label-input pair"],
        starterCode: `<!-- TODO -->`,
        solution: `<img src="https://via.placeholder.com/400x180" alt="Student learning HTML on a laptop" />

<label for="studentEmail">Email Address</label>
<input id="studentEmail" name="studentEmail" type="email" />`,
        testCases: [
          {
            input: "",
            expectedOutput: "Image includes meaningful alt",
            description: "alt text",
          },
          {
            input: "",
            expectedOutput: "Label linked to input id",
            description: "label association",
          },
          {
            input: "",
            expectedOutput: "Email input type used",
            description: "input type",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "html",
        order: 1,
      },
      {
        id: "html-ex-07-02-heading-outline",
        title: "Correct Heading Outline",
        description:
          "Design a page heading outline that follows logical progression.",
        theory: `### Heading Outline and Discoverability
Headings are not just visual text sizes. They create the navigational outline for users and tools.

Good outline patterns:
- One top-level topic heading
- Section headings as children
- Subsections nested under parent headings

Avoid random jumps (e.g., h1 → h4) unless context requires it.`,
        problemStatement:
          "Create content with heading hierarchy: h1 `HTML Masterclass`, h2 `Core Topics`, h3 `Forms`, h3 `Accessibility`.",
        inputExample: "",
        outputExample: "Proper heading outline with one h1, one h2, two h3.",
        hints: [
          "Use headings in descending logical order",
          "Place h3 under h2 context",
          "Keep headings meaningful",
        ],
        constraints: ["Must follow h1 > h2 > h3 hierarchy"],
        starterCode: `<!-- TODO -->`,
        solution: `<h1>HTML Masterclass</h1>
<h2>Core Topics</h2>
<h3>Forms</h3>
<h3>Accessibility</h3>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains one h1",
            description: "h1 count",
          },
          {
            input: "",
            expectedOutput: "Contains one h2",
            description: "h2 count",
          },
          {
            input: "",
            expectedOutput: "Contains two h3",
            description: "h3 count",
          },
        ],
        xpReward: 110,
        difficulty: "easy",
        language: "html",
        order: 2,
      },
      {
        id: "html-ex-07-03-head-seo",
        title: "SEO Metadata in Head",
        description: "Add title and meta description for discoverability.",
        theory: `### SEO-Relevant Head Tags
Important head elements:
- \`<title>\`: appears in search results and browser tab
- \`<meta name="description">\`: summary shown by search engines
- \`<meta charset>\` and viewport for robust rendering

Good metadata improves click-through and clarity of page purpose.`,
        problemStatement:
          "Write a `<head>` section with charset, viewport, title `Learn HTML Fast`, and meta description `Beginner to advanced HTML tutorials with exercises`.",
        inputExample: "",
        outputExample: "Head section with SEO basics configured.",
        hints: [
          "Use standard meta charset and viewport",
          "Keep title concise",
          "Meta description should be descriptive",
        ],
        constraints: ["Must include all four required head elements"],
        starterCode: `<head>
  <!-- TODO -->
</head>`,
        solution: `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Learn HTML Fast</title>
  <meta name="description" content="Beginner to advanced HTML tutorials with exercises" />
</head>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains charset and viewport",
            description: "required meta",
          },
          {
            input: "",
            expectedOutput: "Contains exact title",
            description: "title",
          },
          {
            input: "",
            expectedOutput: "Contains meta description",
            description: "description",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "html",
        order: 3,
      },
    ],
  },
  {
    id: "html-ch-08-media-project",
    title: "Media Elements and Final HTML Project",
    description:
      "Use modern media tags and complete a full multi-section HTML page project.",
    order: 8,
    exercises: [
      {
        id: "html-ex-08-01-audio-video",
        title: "Embed Audio and Video",
        description: "Use HTML5 media tags with fallback text and controls.",
        theory: `### HTML5 Media Tags
Use:
- \`<audio controls>\`
- \`<video controls>\`

Best practices:
- Include user controls
- Add fallback text for unsupported browsers
- Keep accessibility in mind (captions/transcripts in real apps)
`,
        problemStatement:
          "Add one audio element and one video element, both with controls and fallback text.",
        inputExample: "",
        outputExample: "Audio and video blocks with controls.",
        hints: [
          "Use controls attribute",
          "Add source with type",
          "Include fallback text between tags",
        ],
        constraints: ["Must include both audio and video with controls"],
        starterCode: `<!-- TODO -->`,
        solution: `<audio controls>
  <source src="sample.mp3" type="audio/mpeg" />
  Your browser does not support the audio element.
</audio>

<video controls width="480">
  <source src="sample.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains audio with controls",
            description: "audio",
          },
          {
            input: "",
            expectedOutput: "Contains video with controls",
            description: "video",
          },
          {
            input: "",
            expectedOutput: "Contains fallback text",
            description: "fallback",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "html",
        order: 1,
      },
      {
        id: "html-ex-08-02-iframe-embed",
        title: "Embed External Content with iframe",
        description: "Embed external content safely and semantically.",
        theory: `### iframe Use Cases
\`<iframe>\` embeds external pages or tools (maps, demos, docs).

Important attributes:
- \`title\` (accessibility)
- \`width\`, \`height\`
- \`loading="lazy"\` for performance

Use iframes carefully to avoid UX/performance overhead.`,
        problemStatement:
          "Create an iframe embedding `https://example.com` with title `Example Site`, width 600, height 300, and lazy loading.",
        inputExample: "",
        outputExample:
          "iframe block with accessibility and performance attributes.",
        hints: [
          "Set title attribute",
          "Use loading='lazy'",
          "Use numeric width/height strings",
        ],
        constraints: ["Must include src, title, width, height, loading"],
        starterCode: `<!-- TODO -->`,
        solution: `<iframe
  src="https://example.com"
  title="Example Site"
  width="600"
  height="300"
  loading="lazy"
></iframe>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains iframe with src",
            description: "source",
          },
          {
            input: "",
            expectedOutput: "Contains title and loading lazy",
            description: "a11y/perf",
          },
          {
            input: "",
            expectedOutput: "Contains width and height",
            description: "dimensions",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "html",
        order: 2,
      },
      {
        id: "html-ex-08-03-final-project-page",
        title: "Final Project: Build a Complete Course Landing Page",
        description:
          "Combine all core concepts into one structured HTML-only landing page.",
        theory: `### Capstone Goal
A complete HTML page should demonstrate:
- Correct document skeleton
- Semantic landmarks
- Navigation links
- Hero section with heading and paragraph
- Feature list/table/form sections
- Footer information

This final exercise simulates real-world structure planning before CSS/JS enhancement.

Think in content blocks, semantics first, styling later.`,
        problemStatement:
          "Build a single HTML page for `HTML Masterclass` containing: head metadata, header+nav, main with section and article, one image with alt, one table, one contact form (name/email/message), and footer.",
        inputExample: "",
        outputExample: "A complete semantically structured landing page.",
        hints: [
          "Start from valid HTML5 skeleton",
          "Use semantic regions before filling content",
          "Include labels for all form inputs",
          "Keep heading hierarchy logical",
        ],
        constraints: [
          "Must include all required sections",
          "Must include accessible image and labeled form",
          "Must remain pure HTML (no CSS/JS required)",
        ],
        starterCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- TODO -->
  </head>
  <body>
    <!-- TODO -->
  </body>
</html>`,
        solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML Masterclass</title>
    <meta name="description" content="Learn HTML from beginner to advanced with practical exercises." />
  </head>
  <body>
    <header>
      <h1>HTML Masterclass</h1>
      <nav>
        <a href="#about">About</a>
        <a href="#curriculum">Curriculum</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="about">
        <article>
          <h2>Learn HTML from Start to Finish</h2>
          <p>Build real web pages with semantic, accessible, and SEO-friendly markup.</p>
          <img src="https://via.placeholder.com/640x280" alt="HTML learning dashboard preview" />
        </article>
      </section>

      <section id="curriculum">
        <h2>Curriculum Snapshot</h2>
        <table>
          <thead>
            <tr><th>Module</th><th>Level</th></tr>
          </thead>
          <tbody>
            <tr><td>HTML Foundations</td><td>Beginner</td></tr>
            <tr><td>Forms & Accessibility</td><td>Intermediate</td></tr>
          </tbody>
        </table>
      </section>

      <section id="contact">
        <h2>Contact Us</h2>
        <form action="#" method="post">
          <label for="name">Name</label>
          <input id="name" name="name" type="text" required />

          <label for="email">Email</label>
          <input id="email" name="email" type="email" required />

          <label for="message">Message</label>
          <textarea id="message" name="message" rows="4" required></textarea>

          <button type="submit">Send</button>
        </form>
      </section>
    </main>

    <footer>
      <p>&copy; 2026 HTML Masterclass. All rights reserved.</p>
    </footer>
  </body>
</html>`,
        testCases: [
          {
            input: "",
            expectedOutput: "Contains valid html/head/body structure",
            description: "skeleton",
          },
          {
            input: "",
            expectedOutput: "Contains semantic header nav main footer",
            description: "semantic layout",
          },
          {
            input: "",
            expectedOutput: "Contains image, table, and labeled form",
            description: "required content",
          },
        ],
        xpReward: 180,
        difficulty: "hard",
        language: "html",
        order: 3,
      },
    ],
  },
];

async function seedHtmlCourse() {
  const totalXP = htmlChapters
    .flatMap((chapter) => chapter.exercises)
    .reduce((sum, exercise) => sum + exercise.xpReward, 0);

  const course = await prisma.course.upsert({
    where: { id: HTML_COURSE.id },
    create: {
      ...HTML_COURSE,
      totalXP,
    },
    update: {
      title: HTML_COURSE.title,
      shortDescription: HTML_COURSE.shortDescription,
      description: HTML_COURSE.description,
      category: HTML_COURSE.category,
      difficulty: HTML_COURSE.difficulty,
      thumbnail: HTML_COURSE.thumbnail,
      isPremium: HTML_COURSE.isPremium,
      estimatedHours: HTML_COURSE.estimatedHours,
      enrolledCount: HTML_COURSE.enrolledCount,
      rating: HTML_COURSE.rating,
      tags: HTML_COURSE.tags,
      totalXP,
    },
  });

  const chapterIds = htmlChapters.map((chapter) => chapter.id);

  await prisma.chapter.deleteMany({
    where: {
      courseId: course.id,
      id: { notIn: chapterIds },
    },
  });

  for (const chapter of htmlChapters) {
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
    `Seeded ${course.title}: ${htmlChapters.length} chapters, ${htmlChapters.flatMap((c) => c.exercises).length} exercises`,
  );
}

const CSS_COURSE = {
  id: "css-complete-mastery",
  title: "CSS: Complete Guide from Beginner to Advanced",
  shortDescription:
    "Master CSS step by step: selectors, layout, responsive design, and modern UI techniques.",
  description:
    "Learn CSS deeply with a practical, structured path: syntax and selectors, box model, colors and typography, Flexbox, Grid, positioning, responsive design, transitions and transforms, and real UI composition. Every chapter includes detailed theory and practical exercises for real-world frontend development.",
  category: "Web Development",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 55,
  enrolledCount: 0,
  rating: 4.9,
  tags: [
    "CSS",
    "Web Development",
    "Frontend",
    "Flexbox",
    "Grid",
    "Responsive Design",
  ],
};

const cssChapters: SeedChapter[] = [
  {
    id: "css-ch-01-basics-selectors",
    title: "CSS Basics and Selectors",
    description:
      "Understand CSS syntax, where to write CSS, and how selectors target elements.",
    order: 1,
    exercises: [
      {
        id: "css-ex-01-01-basic-rule",
        title: "Write Your First CSS Rule",
        description:
          "Style headings and paragraphs with basic property-value pairs.",
        theory:
          "### CSS Rule Anatomy\nA rule has selector + declaration block.\n\nExample:\nselector { property: value; }\n\nCSS can be written inline, internal (<style>), or external (.css file). External stylesheets are best for maintainability.",
        problemStatement:
          "Write CSS to make all h1 text color `#2563eb` and all p elements `font-size: 18px`.",
        inputExample: "h1 + p elements",
        outputExample: "h1 blue, paragraphs 18px",
        hints: [
          "Use element selectors h1 and p",
          "Set color for h1",
          "Set font-size for p",
        ],
        constraints: [
          "Must use two separate rules",
          "Use exact values requested",
        ],
        starterCode: "/* TODO */",
        solution: "h1 { color: #2563eb; }\np { font-size: 18px; }",
        testCases: [
          {
            input: "",
            expectedOutput: "h1 color #2563eb",
            description: "heading color",
          },
          {
            input: "",
            expectedOutput: "p font-size 18px",
            description: "paragraph size",
          },
          {
            input: "",
            expectedOutput: "two valid CSS rules",
            description: "rule structure",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "css",
        order: 1,
      },
      {
        id: "css-ex-01-02-class-id-selectors",
        title: "Class and ID Selectors",
        description: "Target specific elements using class and id selectors.",
        theory:
          "### Selector Specificity Basics\nClass selector: .card\nID selector: #hero\n\nIDs should be unique per page. Classes are reusable.\nSpecificity order (simplified): id > class > element.",
        problemStatement:
          "Style `.card` with `padding: 16px` and `border-radius: 12px`; style `#hero` with `background-color: #111827` and `color: white`.",
        inputExample: ".card and #hero elements",
        outputExample:
          "card spacing + rounded corners, hero dark with white text",
        hints: [
          "Use . for class",
          "Use # for id",
          "Keep declarations separated",
        ],
        constraints: ["Must include both .card and #hero rules"],
        starterCode: "/* TODO */",
        solution:
          ".card { padding: 16px; border-radius: 12px; }\n#hero { background-color: #111827; color: white; }",
        testCases: [
          {
            input: "",
            expectedOutput: ".card has padding and border-radius",
            description: "class styling",
          },
          {
            input: "",
            expectedOutput: "#hero has background and color",
            description: "id styling",
          },
          {
            input: "",
            expectedOutput: "valid selector syntax",
            description: "syntax",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "css",
        order: 2,
      },
      {
        id: "css-ex-01-03-combinators-pseudo",
        title: "Combinators and Pseudo-classes",
        description:
          "Use descendant selectors and :hover for interaction styling.",
        theory:
          "### Advanced Targeting\nCombinators target structure relationships.\n- .nav a -> links inside nav\nPseudo-class :hover styles interactive states.\n\nInteractive states improve user feedback and perceived quality.",
        problemStatement:
          "Style `.nav a` with `text-decoration: none` and `color: #334155`; on hover change color to `#0ea5e9`.",
        inputExample: "navigation links",
        outputExample: "links have base style and hover color",
        hints: [
          "Use descendant selector",
          "Add separate :hover rule",
          "Keep base and hover colors different",
        ],
        constraints: ["Must include .nav a and .nav a:hover"],
        starterCode: "/* TODO */",
        solution:
          ".nav a { text-decoration: none; color: #334155; }\n.nav a:hover { color: #0ea5e9; }",
        testCases: [
          {
            input: "",
            expectedOutput: "base nav link style applied",
            description: "base state",
          },
          {
            input: "",
            expectedOutput: "hover state color change",
            description: "hover state",
          },
          {
            input: "",
            expectedOutput: "descendant + pseudo-class selectors valid",
            description: "selector complexity",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "css",
        order: 3,
      },
    ],
  },
  {
    id: "css-ch-02-box-model-spacing",
    title: "Box Model, Spacing, and Sizing",
    description:
      "Master content, padding, border, margin, and how sizing calculations work.",
    order: 2,
    exercises: [
      {
        id: "css-ex-02-01-box-model",
        title: "Apply Complete Box Model",
        description: "Create card spacing with padding, border, and margin.",
        theory:
          "### Box Model Layers\nFrom inside to outside: content -> padding -> border -> margin.\n\nUnderstanding these layers is essential for precise UI spacing and layout consistency.",
        problemStatement:
          "Style `.panel` with `padding: 20px`, `border: 1px solid #cbd5e1`, and `margin: 24px`.",
        inputExample: ".panel element",
        outputExample: "properly spaced panel box",
        hints: [
          "Use shorthand border",
          "Set all spacing values explicitly",
          "Do not use individual sides unless needed",
        ],
        constraints: ["Must include padding, border, and margin"],
        starterCode: "/* TODO */",
        solution:
          ".panel { padding: 20px; border: 1px solid #cbd5e1; margin: 24px; }",
        testCases: [
          {
            input: "",
            expectedOutput: "padding 20px",
            description: "inner spacing",
          },
          {
            input: "",
            expectedOutput: "1px solid border",
            description: "border",
          },
          {
            input: "",
            expectedOutput: "margin 24px",
            description: "outer spacing",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "css",
        order: 1,
      },
      {
        id: "css-ex-02-02-box-sizing",
        title: "Use Border-box Sizing",
        description: "Control layout width reliably using box-sizing.",
        theory:
          "### Default vs Border-box\nDefault (content-box) excludes padding and border from declared width.\n\nWith box-sizing: border-box, declared width includes content+padding+border, making layouts predictable.",
        problemStatement:
          "Set global border-box sizing and style `.card` width `300px`, padding `16px`, border `2px solid #e2e8f0`.",
        inputExample: "global + .card",
        outputExample: "consistent 300px card total width",
        hints: [
          "Use * selector for global sizing",
          "Keep card width fixed",
          "Apply border and padding",
        ],
        constraints: ["Must include box-sizing rule and card rule"],
        starterCode: "/* TODO */",
        solution:
          "* { box-sizing: border-box; }\n.card { width: 300px; padding: 16px; border: 2px solid #e2e8f0; }",
        testCases: [
          {
            input: "",
            expectedOutput: "global border-box rule",
            description: "global sizing",
          },
          {
            input: "",
            expectedOutput: "card width 300px",
            description: "width",
          },
          {
            input: "",
            expectedOutput: "card has padding and border",
            description: "card box",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "css",
        order: 2,
      },
      {
        id: "css-ex-02-03-centering-block",
        title: "Center a Fixed-width Block",
        description:
          "Use margin auto and max-width for centered layout wrappers.",
        theory:
          "### Horizontal Centering Pattern\nFor block elements, set width/max-width and use margin-left/right auto (or shorthand margin: 0 auto).\n\nThis is a foundational layout pattern for page containers.",
        problemStatement:
          "Style `.container` with `max-width: 960px` and center it horizontally with auto margins.",
        inputExample: ".container wrapper",
        outputExample: "centered page container",
        hints: [
          "Use max-width",
          "Use margin: 0 auto",
          "Optionally add side padding",
        ],
        constraints: ["Must use max-width and auto margins"],
        starterCode: "/* TODO */",
        solution: ".container { max-width: 960px; margin: 0 auto; }",
        testCases: [
          {
            input: "",
            expectedOutput: "max-width set to 960px",
            description: "width constraint",
          },
          {
            input: "",
            expectedOutput: "auto horizontal margin used",
            description: "centering",
          },
          {
            input: "",
            expectedOutput: "valid container rule",
            description: "syntax",
          },
        ],
        xpReward: 90,
        difficulty: "easy",
        language: "css",
        order: 3,
      },
    ],
  },
  {
    id: "css-ch-03-typography-colors",
    title: "Typography, Colors, and Visual Hierarchy",
    description:
      "Create readable, consistent text systems and color usage patterns.",
    order: 3,
    exercises: [
      {
        id: "css-ex-03-01-font-stack",
        title: "Define a Readable Font Stack",
        description: "Set base typography styles for body and headings.",
        theory:
          "### Typography System\nUse a robust fallback stack and define base line-height for readability.\n\nCommon baseline:\n- Body line-height around 1.5–1.7\n- Clear heading weight hierarchy\n- Avoid excessive font-size jumps",
        problemStatement:
          "Set body font-family to `Inter, Arial, sans-serif`, line-height `1.6`, and style h1 with `font-size: 40px` and `font-weight: 700`.",
        inputExample: "body + h1",
        outputExample: "clean readable typography",
        hints: [
          "Use comma-separated font stack",
          "Set numeric line-height",
          "Define heading size and weight",
        ],
        constraints: ["Must include body and h1 rules"],
        starterCode: "/* TODO */",
        solution:
          "body { font-family: Inter, Arial, sans-serif; line-height: 1.6; }\nh1 { font-size: 40px; font-weight: 700; }",
        testCases: [
          {
            input: "",
            expectedOutput: "body font stack applied",
            description: "font stack",
          },
          {
            input: "",
            expectedOutput: "line-height 1.6",
            description: "readability",
          },
          {
            input: "",
            expectedOutput: "h1 size/weight set",
            description: "hierarchy",
          },
        ],
        xpReward: 90,
        difficulty: "easy",
        language: "css",
        order: 1,
      },
      {
        id: "css-ex-03-02-color-system",
        title: "Create a Reusable Color System with Variables",
        description: "Use CSS custom properties for consistent theme colors.",
        theory:
          "### CSS Variables (Custom Properties)\nDefine reusable design tokens in :root, then use var(--token).\n\nBenefits:\n- Consistency\n- Easier theme updates\n- Cleaner maintenance at scale",
        problemStatement:
          "Define `--primary: #2563eb`, `--text: #0f172a`, `--surface: #f8fafc` in `:root`; use them to style `.btn` and `.page`.",
        inputExample: ":root + .btn + .page",
        outputExample: "token-based consistent colors",
        hints: [
          "Declare variables in :root",
          "Use var(--token)",
          "Apply to background/text thoughtfully",
        ],
        constraints: ["Must use custom properties"],
        starterCode: "/* TODO */",
        solution:
          ":root { --primary: #2563eb; --text: #0f172a; --surface: #f8fafc; }\n.page { background-color: var(--surface); color: var(--text); }\n.btn { background-color: var(--primary); color: white; }",
        testCases: [
          {
            input: "",
            expectedOutput: "variables declared in :root",
            description: "variable declaration",
          },
          {
            input: "",
            expectedOutput: "page uses surface/text vars",
            description: "page styling",
          },
          {
            input: "",
            expectedOutput: "btn uses primary var",
            description: "button styling",
          },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "css",
        order: 2,
      },
      {
        id: "css-ex-03-03-text-overflow",
        title: "Handle Long Text Gracefully",
        description: "Use text-overflow for single-line truncation.",
        theory:
          "### Overflow Handling\nFor one-line truncation with ellipsis, combine:\n- white-space: nowrap\n- overflow: hidden\n- text-overflow: ellipsis\n\nUseful for cards, table cells, and compact UI components.",
        problemStatement:
          "Style `.title` to keep text on one line and show ellipsis when it exceeds width 240px.",
        inputExample: ".title",
        outputExample: "single line clipped text with ellipsis",
        hints: ["Set width", "Use nowrap", "Use hidden + ellipsis together"],
        constraints: ["Must include all required properties"],
        starterCode: "/* TODO */",
        solution:
          ".title { width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }",
        testCases: [
          { input: "", expectedOutput: "width 240px", description: "width" },
          {
            input: "",
            expectedOutput: "nowrap + hidden + ellipsis",
            description: "truncation trio",
          },
          {
            input: "",
            expectedOutput: "valid one-line overflow handling",
            description: "behavior",
          },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "css",
        order: 3,
      },
    ],
  },
  {
    id: "css-ch-04-flexbox",
    title: "Flexbox for One-dimensional Layout",
    description:
      "Build row/column layouts, alignment patterns, and responsive spacing with Flexbox.",
    order: 4,
    exercises: [
      {
        id: "css-ex-04-01-flex-row-gap",
        title: "Create a Flexible Horizontal Nav",
        description: "Use display flex, gap, and alignment for nav items.",
        theory:
          "### Flexbox Basics\nUse flex when arranging items along one axis.\nKey properties:\n- display: flex\n- justify-content (main axis)\n- align-items (cross axis)\n- gap for spacing",
        problemStatement:
          "Style `.nav` to display items in a row, vertically centered, with 16px gap.",
        inputExample: ".nav container",
        outputExample: "horizontal aligned nav",
        hints: ["Set display flex", "Use align-items center", "Add gap"],
        constraints: ["Must use flex layout"],
        starterCode: "/* TODO */",
        solution: ".nav { display: flex; align-items: center; gap: 16px; }",
        testCases: [
          {
            input: "",
            expectedOutput: "display flex set",
            description: "flex enabled",
          },
          {
            input: "",
            expectedOutput: "cross-axis centered",
            description: "alignment",
          },
          {
            input: "",
            expectedOutput: "16px gap used",
            description: "spacing",
          },
        ],
        xpReward: 100,
        difficulty: "easy",
        language: "css",
        order: 1,
      },
      {
        id: "css-ex-04-02-space-between-layout",
        title: "Distribute Space with Justify-content",
        description: "Create top bar layout with left and right groups.",
        theory:
          "### Main-axis Distribution\njustify-content controls free space along main axis.\n`space-between` pushes first/last items to edges and distributes remaining space.",
        problemStatement:
          "Style `.topbar` with flex layout, `justify-content: space-between`, `align-items: center`, and `padding: 12px 20px`.",
        inputExample: ".topbar container",
        outputExample: "left-right distributed top bar",
        hints: [
          "Set flex first",
          "Use space-between for distribution",
          "Add vertical alignment",
        ],
        constraints: ["Must include all listed properties"],
        starterCode: "/* TODO */",
        solution:
          ".topbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; }",
        testCases: [
          {
            input: "",
            expectedOutput: "space-between present",
            description: "distribution",
          },
          {
            input: "",
            expectedOutput: "align-items center present",
            description: "alignment",
          },
          {
            input: "",
            expectedOutput: "padding 12px 20px present",
            description: "spacing",
          },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "css",
        order: 2,
      },
      {
        id: "css-ex-04-03-flex-wrap-cards",
        title: "Responsive Card Wrap with Flexbox",
        description: "Allow card items to wrap across lines on smaller widths.",
        theory:
          "### Flex-wrap for Responsiveness\nWithout wrap, flex items may overflow.\nUse `flex-wrap: wrap` and controlled basis/width for adaptive card rows.",
        problemStatement:
          "Style `.cards` with `display: flex`, `flex-wrap: wrap`, and `gap: 20px`; style `.card` with `flex: 1 1 280px`.",
        inputExample: ".cards and .card",
        outputExample: "wrapping card grid-like row behavior",
        hints: [
          "Use flex-wrap on parent",
          "Use flex shorthand on child",
          "Keep gap on parent",
        ],
        constraints: ["Must style both parent and child"],
        starterCode: "/* TODO */",
        solution:
          ".cards { display: flex; flex-wrap: wrap; gap: 20px; }\n.card { flex: 1 1 280px; }",
        testCases: [
          {
            input: "",
            expectedOutput: "cards parent wraps",
            description: "wrap",
          },
          { input: "", expectedOutput: "20px gap", description: "gap" },
          {
            input: "",
            expectedOutput: "card flex basis 280px",
            description: "child sizing",
          },
        ],
        xpReward: 130,
        difficulty: "medium",
        language: "css",
        order: 3,
      },
    ],
  },
  {
    id: "css-ch-05-grid-responsive",
    title: "CSS Grid and Responsive Design",
    description:
      "Use Grid for two-dimensional layouts and media queries for breakpoint adaptation.",
    order: 5,
    exercises: [
      {
        id: "css-ex-05-01-basic-grid",
        title: "Create a 3-column Grid",
        description: "Build a basic grid layout with equal columns.",
        theory:
          "### Why Grid\nGrid is ideal for two-dimensional layout (rows + columns).\nCore properties:\n- display: grid\n- grid-template-columns\n- gap",
        problemStatement: "Style `.gallery` with 3 equal columns and 16px gap.",
        inputExample: ".gallery",
        outputExample: "3-column equal grid",
        hints: ["Use repeat(3, 1fr)", "Set display grid", "Add gap"],
        constraints: ["Must use CSS Grid"],
        starterCode: "/* TODO */",
        solution:
          ".gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }",
        testCases: [
          {
            input: "",
            expectedOutput: "grid display set",
            description: "grid",
          },
          {
            input: "",
            expectedOutput: "3 equal columns",
            description: "columns",
          },
          { input: "", expectedOutput: "16px gap", description: "spacing" },
        ],
        xpReward: 110,
        difficulty: "easy",
        language: "css",
        order: 1,
      },
      {
        id: "css-ex-05-02-auto-fit-minmax",
        title: "Responsive Grid with auto-fit and minmax",
        description: "Create adaptive columns that reflow automatically.",
        theory:
          "### Modern Responsive Grid Pattern\n`repeat(auto-fit, minmax(220px, 1fr))` creates fluid, breakpoint-free cards that adapt to container width.",
        problemStatement:
          "Style `.products` using responsive columns with min width 220px and 20px gap.",
        inputExample: ".products",
        outputExample: "auto-wrapping responsive grid",
        hints: ["Use auto-fit", "Use minmax(220px, 1fr)", "Set gap 20px"],
        constraints: ["Must use repeat(auto-fit, minmax(...))"],
        starterCode: "/* TODO */",
        solution:
          ".products { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }",
        testCases: [
          {
            input: "",
            expectedOutput: "uses auto-fit + minmax",
            description: "responsive grid formula",
          },
          {
            input: "",
            expectedOutput: "minimum 220px columns",
            description: "column minimum",
          },
          { input: "", expectedOutput: "gap 20px", description: "spacing" },
        ],
        xpReward: 140,
        difficulty: "hard",
        language: "css",
        order: 2,
      },
      {
        id: "css-ex-05-03-media-query-layout",
        title: "Media Query for Mobile Layout",
        description: "Adjust typography and spacing at small screen widths.",
        theory:
          "### Media Query Essentials\nUse breakpoints to adapt UI for different viewports.\nExample: @media (max-width: 768px) { ... }\n\nPrioritize readable text and touch-friendly spacing on mobile.",
        problemStatement:
          "Set `.hero-title` font-size to 48px by default, and 32px for screens <= 768px.",
        inputExample: ".hero-title",
        outputExample: "title scales down on mobile",
        hints: [
          "Define default first",
          "Use max-width media query",
          "Override font-size inside query",
        ],
        constraints: ["Must include both default and media query styles"],
        starterCode: "/* TODO */",
        solution:
          ".hero-title { font-size: 48px; }\n@media (max-width: 768px) {\n  .hero-title { font-size: 32px; }\n}",
        testCases: [
          {
            input: "",
            expectedOutput: "default size 48px",
            description: "desktop",
          },
          {
            input: "",
            expectedOutput: "768px media query present",
            description: "breakpoint",
          },
          {
            input: "",
            expectedOutput: "mobile size 32px",
            description: "mobile",
          },
        ],
        xpReward: 130,
        difficulty: "medium",
        language: "css",
        order: 3,
      },
    ],
  },
  {
    id: "css-ch-06-effects-project",
    title: "Effects, Animations, and Final CSS Project",
    description:
      "Add polish with transitions, transforms, and build a complete responsive card UI.",
    order: 6,
    exercises: [
      {
        id: "css-ex-06-01-transitions-hover",
        title: "Smooth Hover Transition",
        description: "Animate button background and transform on hover.",
        theory:
          "### Transition Fundamentals\nTransitions animate between property values.\nCommon pattern:\n- transition: all 200ms ease;\n- change properties on :hover",
        problemStatement:
          "Style `.btn` with blue background and white text. On hover darken background and move up by 2px using transform with smooth transition.",
        inputExample: ".btn",
        outputExample: "animated hover button",
        hints: [
          "Add transition on base rule",
          "Use :hover for final state",
          "Use translateY(-2px)",
        ],
        constraints: ["Must include transition and hover transform"],
        starterCode: "/* TODO */",
        solution:
          ".btn { background: #2563eb; color: white; transition: all 200ms ease; }\n.btn:hover { background: #1d4ed8; transform: translateY(-2px); }",
        testCases: [
          {
            input: "",
            expectedOutput: "base button colors set",
            description: "base",
          },
          {
            input: "",
            expectedOutput: "transition present",
            description: "animation",
          },
          {
            input: "",
            expectedOutput: "hover background and transform",
            description: "hover state",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "css",
        order: 1,
      },
      {
        id: "css-ex-06-02-keyframes",
        title: "Create a Keyframe Animation",
        description: "Use @keyframes to animate opacity and position.",
        theory:
          "### Keyframe Animations\n@keyframes define intermediate steps over time.\nUse animation-name, duration, easing, and fill mode for control.",
        problemStatement:
          "Create `fadeUp` animation from opacity 0 + translateY(12px) to opacity 1 + translateY(0). Apply to `.card` with duration 400ms.",
        inputExample: "@keyframes + .card",
        outputExample: "card enters with fade-up effect",
        hints: [
          "Define from/to states",
          "Apply animation property",
          "Use ease timing",
        ],
        constraints: ["Must define keyframes and apply to .card"],
        starterCode: "/* TODO */",
        solution:
          "@keyframes fadeUp {\n  from { opacity: 0; transform: translateY(12px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n.card { animation: fadeUp 400ms ease; }",
        testCases: [
          {
            input: "",
            expectedOutput: "fadeUp keyframes exist",
            description: "keyframes",
          },
          {
            input: "",
            expectedOutput: "from and to states defined",
            description: "states",
          },
          {
            input: "",
            expectedOutput: "card animation applied",
            description: "application",
          },
        ],
        xpReward: 140,
        difficulty: "hard",
        language: "css",
        order: 2,
      },
      {
        id: "css-ex-06-03-final-project-card-ui",
        title: "Final Project: Responsive Pricing Card UI",
        description:
          "Combine typography, spacing, color system, flex/grid, and interactions in one component.",
        theory:
          "### Capstone Objective\nBuild a production-style CSS component that demonstrates:\n- Tokenized colors\n- Typography hierarchy\n- Box model consistency\n- Responsive layout behavior\n- Interactive states\n\nThis integrates everything from earlier chapters into a real UI pattern.",
        problemStatement:
          "Write CSS for `.pricing-card` with: rounded corners, shadow, internal spacing, title/body/button styles, hover lift effect, and responsive width behavior (full width below 640px, max-width 360px otherwise).",
        inputExample: ".pricing-card component classes",
        outputExample: "polished responsive interactive card",
        hints: [
          "Use border-radius + box-shadow",
          "Define a clear title and body typographic scale",
          "Use transition + hover transform",
          "Use media query for small screens",
        ],
        constraints: [
          "Must include hover interaction",
          "Must include responsive behavior",
          "Must include button styling",
        ],
        starterCode: "/* TODO */",
        solution:
          ":root { --card-bg: #ffffff; --text: #0f172a; --muted: #475569; --primary: #2563eb; }\n.pricing-card { max-width: 360px; background: var(--card-bg); color: var(--text); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(15,23,42,0.1); transition: transform 220ms ease, box-shadow 220ms ease; }\n.pricing-card:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(15,23,42,0.16); }\n.pricing-card h3 { margin: 0 0 8px; font-size: 28px; }\n.pricing-card p { margin: 0 0 18px; color: var(--muted); line-height: 1.6; }\n.pricing-card .btn { display: inline-block; background: var(--primary); color: white; text-decoration: none; padding: 10px 16px; border-radius: 10px; }\n@media (max-width: 640px) { .pricing-card { max-width: 100%; } }",
        testCases: [
          {
            input: "",
            expectedOutput: "card has radius, padding, shadow",
            description: "base card",
          },
          {
            input: "",
            expectedOutput: "hover lift effect present",
            description: "interaction",
          },
          {
            input: "",
            expectedOutput: "responsive max-width rule present",
            description: "responsiveness",
          },
        ],
        xpReward: 180,
        difficulty: "hard",
        language: "css",
        order: 3,
      },
    ],
  },
];

async function seedCssCourse() {
  const totalXP = cssChapters
    .flatMap((chapter) => chapter.exercises)
    .reduce((sum, exercise) => sum + exercise.xpReward, 0);

  const course = await prisma.course.upsert({
    where: { id: CSS_COURSE.id },
    create: {
      ...CSS_COURSE,
      totalXP,
    },
    update: {
      title: CSS_COURSE.title,
      shortDescription: CSS_COURSE.shortDescription,
      description: CSS_COURSE.description,
      category: CSS_COURSE.category,
      difficulty: CSS_COURSE.difficulty,
      thumbnail: CSS_COURSE.thumbnail,
      isPremium: CSS_COURSE.isPremium,
      estimatedHours: CSS_COURSE.estimatedHours,
      enrolledCount: CSS_COURSE.enrolledCount,
      rating: CSS_COURSE.rating,
      tags: CSS_COURSE.tags,
      totalXP,
    },
  });

  const chapterIds = cssChapters.map((chapter) => chapter.id);

  await prisma.chapter.deleteMany({
    where: {
      courseId: course.id,
      id: { notIn: chapterIds },
    },
  });

  for (const chapter of cssChapters) {
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
    `Seeded ${course.title}: ${cssChapters.length} chapters, ${cssChapters.flatMap((c) => c.exercises).length} exercises`,
  );
}

const JS_COURSE = {
  id: "javascript-complete-mastery",
  title: "JavaScript: Complete Guide from Beginner to Advanced",
  shortDescription:
    "Master JavaScript from basics to modern async patterns with practical exercises.",
  description:
    "Learn JavaScript end-to-end: variables, operators, conditionals, loops, functions, arrays and objects, DOM manipulation, events, asynchronous JavaScript with promises and async/await, ES6+ features, and application-level coding patterns. Each chapter combines detailed theory and hands-on exercises so learners can write production-style JavaScript confidently.",
  category: "Web Development",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 70,
  enrolledCount: 0,
  rating: 4.9,
  tags: ["JavaScript", "Web Development", "Frontend", "DOM", "Async", "ES6+"],
};

const jsChapters: SeedChapter[] = [
  {
    id: "js-ch-01-fundamentals",
    title: "JavaScript Fundamentals",
    description:
      "Learn core syntax, variables, data types, and operators with confidence.",
    order: 1,
    exercises: [
      {
        id: "js-ex-01-01-variables-types",
        title: "Variables and Data Types",
        description: "Use let/const and print values with template literals.",
        theory:
          "### Core Data Basics\nJavaScript supports primitive types like string, number, boolean, null, undefined, and symbol.\n\nUse `const` when value should not be reassigned; use `let` for mutable variables.\n\nTemplate literals (`${...}`) provide readable string interpolation.",
        problemStatement:
          "Declare `const name = 'Alex'` and `let score = 95`, then print: `Alex scored 95`.",
        inputExample: "",
        outputExample: "Alex scored 95",
        hints: ["Use const and let", "Use template literal", "Use console.log"],
        constraints: ["Must use template literals"],
        starterCode: "// TODO",
        solution:
          "const name = 'Alex';\nlet score = 95;\nconsole.log(`${name} scored ${score}`);",
        testCases: [
          {
            input: "",
            expectedOutput: "Alex scored 95",
            description: "exact output",
          },
          {
            input: "",
            expectedOutput: "uses const and let",
            description: "declarations",
          },
          {
            input: "",
            expectedOutput: "uses template literal",
            description: "string interpolation",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "javascript",
        order: 1,
      },
      {
        id: "js-ex-01-02-operators-conditionals",
        title: "Operators and Conditionals",
        description: "Evaluate conditions and branch with if/else.",
        theory:
          "### Decisions in JavaScript\nUse comparison operators (`===`, `!==`, `>`, `<`) with if/else for control flow. Prefer strict equality `===` to avoid implicit type coercion issues.",
        problemStatement:
          "Given `const age = 20`, print `Adult` if age >= 18 else print `Minor`.",
        inputExample: "",
        outputExample: "Adult",
        hints: [
          "Use if (age >= 18)",
          "Use strict comparisons",
          "Print one of two messages",
        ],
        constraints: ["Must use if/else"],
        starterCode: "const age = 20;\n// TODO",
        solution:
          "const age = 20;\nif (age >= 18) console.log('Adult');\nelse console.log('Minor');",
        testCases: [
          { input: "", expectedOutput: "Adult", description: "age 20" },
          {
            input: "",
            expectedOutput: "if else structure used",
            description: "control flow",
          },
          {
            input: "",
            expectedOutput: "single output",
            description: "deterministic result",
          },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "javascript",
        order: 2,
      },
    ],
  },
  {
    id: "js-ch-02-functions-loops",
    title: "Functions and Loops",
    description:
      "Write reusable logic and iterate data with loops and modern function syntax.",
    order: 2,
    exercises: [
      {
        id: "js-ex-02-01-functions",
        title: "Create and Use Functions",
        description: "Define a function with parameters and return value.",
        theory:
          "### Function Fundamentals\nFunctions encapsulate reusable logic.\n\nGood function design:\n- clear input parameters\n- predictable return value\n- single responsibility\n\nArrow functions are concise for small utilities.",
        problemStatement:
          "Write a function `multiply(a, b)` that returns product. Print result of multiply(6, 7).",
        inputExample: "6, 7",
        outputExample: "42",
        hints: [
          "Return a * b",
          "Call function and log result",
          "Use either function or arrow syntax",
        ],
        constraints: ["Must return value from function"],
        starterCode: "// TODO",
        solution:
          "function multiply(a, b) { return a * b; }\nconsole.log(multiply(6, 7));",
        testCases: [
          { input: "", expectedOutput: "42", description: "6x7" },
          {
            input: "",
            expectedOutput: "function returns value",
            description: "return behavior",
          },
          { input: "", expectedOutput: "result logged", description: "output" },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "javascript",
        order: 1,
      },
      {
        id: "js-ex-02-02-loops-accumulator",
        title: "Loop and Accumulate",
        description: "Use loop to calculate sum of numbers 1..10.",
        theory:
          "### Iteration Patterns\nFor loops are useful when iteration count is known.\nAccumulator pattern:\n1. Initialize total\n2. Add in each iteration\n3. Use final total",
        problemStatement:
          "Use a for loop to compute and print sum of numbers from 1 to 10.",
        inputExample: "",
        outputExample: "55",
        hints: [
          "Initialize total = 0",
          "Loop from 1 to 10 inclusive",
          "Add each i to total",
        ],
        constraints: ["Must use for loop"],
        starterCode: "// TODO",
        solution:
          "let total = 0;\nfor (let i = 1; i <= 10; i++) total += i;\nconsole.log(total);",
        testCases: [
          { input: "", expectedOutput: "55", description: "sum 1..10" },
          {
            input: "",
            expectedOutput: "for loop used",
            description: "loop requirement",
          },
          {
            input: "",
            expectedOutput: "accumulator pattern",
            description: "logic",
          },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "javascript",
        order: 2,
      },
    ],
  },
  {
    id: "js-ch-03-arrays-objects",
    title: "Arrays and Objects",
    description:
      "Manipulate collections and object data with modern array methods.",
    order: 3,
    exercises: [
      {
        id: "js-ex-03-01-array-methods",
        title: "Filter and Map",
        description: "Transform arrays using functional methods.",
        theory:
          "### Array Method Workflow\n`filter` keeps matching elements. `map` transforms each element. Chaining them produces concise readable logic.",
        problemStatement:
          "Given [1,2,3,4,5,6], filter even numbers then square them. Print resulting array.",
        inputExample: "[1,2,3,4,5,6]",
        outputExample: "[4,16,36]",
        hints: [
          "Use filter n % 2 === 0",
          "Then map n => n * n",
          "Log final array",
        ],
        constraints: ["Must use filter and map"],
        starterCode: "const nums = [1,2,3,4,5,6];\n// TODO",
        solution:
          "const nums = [1,2,3,4,5,6];\nconst result = nums.filter(n => n % 2 === 0).map(n => n * n);\nconsole.log(result);",
        testCases: [
          {
            input: "",
            expectedOutput: "[4,16,36]",
            description: "even squares",
          },
          {
            input: "",
            expectedOutput: "uses filter and map",
            description: "method usage",
          },
          {
            input: "",
            expectedOutput: "result array logged",
            description: "output",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "javascript",
        order: 1,
      },
      {
        id: "js-ex-03-02-objects-destructuring",
        title: "Object Access and Destructuring",
        description: "Extract fields from objects cleanly.",
        theory:
          "### Working with Objects\nObjects model key-value data structures. Destructuring simplifies extraction: `const {name, role} = user;`\n\nThis improves readability in component and API code.",
        problemStatement:
          "From `{ name: 'Sam', role: 'Developer', exp: 3 }`, destructure and print name and role on separate lines.",
        inputExample: "user object",
        outputExample: "Sam\nDeveloper",
        hints: [
          "Use const { name, role } = user",
          "Print each value",
          "Keep exp unused",
        ],
        constraints: ["Must use destructuring"],
        starterCode:
          "const user = { name: 'Sam', role: 'Developer', exp: 3 };\n// TODO",
        solution:
          "const user = { name: 'Sam', role: 'Developer', exp: 3 };\nconst { name, role } = user;\nconsole.log(name);\nconsole.log(role);",
        testCases: [
          {
            input: "",
            expectedOutput: "Sam\nDeveloper",
            description: "name and role",
          },
          {
            input: "",
            expectedOutput: "destructuring used",
            description: "syntax",
          },
          {
            input: "",
            expectedOutput: "line-separated output",
            description: "format",
          },
        ],
        xpReward: 100,
        difficulty: "medium",
        language: "javascript",
        order: 2,
      },
    ],
  },
  {
    id: "js-ch-04-dom-events",
    title: "DOM Manipulation and Events",
    description:
      "Interact with page elements, update content, and respond to user actions.",
    order: 4,
    exercises: [
      {
        id: "js-ex-04-01-dom-select-update",
        title: "Select and Update DOM Content",
        description: "Read DOM node and update text safely.",
        theory:
          "### DOM Basics\nUse `document.querySelector` to find elements with CSS selectors.\nUpdate with `textContent` for safe plain-text insertion.",
        problemStatement:
          "Select element with id `status` and set its textContent to `Loaded successfully`.",
        inputExample: "<p id='status'></p>",
        outputExample: "Loaded successfully",
        hints: [
          "Use #status selector",
          "Assign textContent",
          "Run after DOM exists",
        ],
        constraints: ["Must use querySelector"],
        starterCode: "// TODO",
        solution:
          "const el = document.querySelector('#status');\nif (el) el.textContent = 'Loaded successfully';",
        testCases: [
          {
            input: "",
            expectedOutput: "status text updated",
            description: "dom update",
          },
          {
            input: "",
            expectedOutput: "querySelector used",
            description: "selector",
          },
          {
            input: "",
            expectedOutput: "safe textContent usage",
            description: "content safety",
          },
        ],
        xpReward: 110,
        difficulty: "medium",
        language: "javascript",
        order: 1,
      },
      {
        id: "js-ex-04-02-click-event",
        title: "Handle Button Click Event",
        description: "Attach event listener and update counter state in UI.",
        theory:
          "### Event-driven UI\n`addEventListener` registers behavior for user events.\nCommon pattern:\n- read current value\n- compute next state\n- update DOM\n\nThis pattern underpins interactive web apps.",
        problemStatement:
          "On each click of button `#incBtn`, increment numeric text inside `#count`.",
        inputExample: "button + span",
        outputExample: "count increases 1 per click",
        hints: [
          "Get both elements",
          "Parse current count with Number",
          "Update text after increment",
        ],
        constraints: ["Must use click event listener"],
        starterCode: "// TODO",
        solution:
          "const btn = document.querySelector('#incBtn');\nconst countEl = document.querySelector('#count');\nif (btn && countEl) {\n  btn.addEventListener('click', () => {\n    const curr = Number(countEl.textContent || '0');\n    countEl.textContent = String(curr + 1);\n  });\n}",
        testCases: [
          {
            input: "",
            expectedOutput: "listener attached to #incBtn",
            description: "event binding",
          },
          {
            input: "",
            expectedOutput: "count increments by one",
            description: "state update",
          },
          {
            input: "",
            expectedOutput: "updates #count text",
            description: "dom write",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "javascript",
        order: 2,
      },
    ],
  },
  {
    id: "js-ch-05-async-js",
    title: "Asynchronous JavaScript",
    description:
      "Understand promises, async/await, and fetching data from APIs.",
    order: 5,
    exercises: [
      {
        id: "js-ex-05-01-promise-basics",
        title: "Create and Resolve a Promise",
        description: "Build a basic Promise and consume it with then().",
        theory:
          "### Async Building Blocks\nA Promise represents future completion.\nStates: pending -> fulfilled or rejected.\nUse `.then` for success and `.catch` for failures.",
        problemStatement:
          "Create function `getGreeting()` returning Promise resolved with `Hello Async`, then print resolved value.",
        inputExample: "",
        outputExample: "Hello Async",
        hints: [
          "Return new Promise",
          "Call resolve with string",
          "Use then to log",
        ],
        constraints: ["Must use Promise and then"],
        starterCode: "// TODO",
        solution:
          "function getGreeting() {\n  return new Promise(resolve => resolve('Hello Async'));\n}\ngetGreeting().then(msg => console.log(msg));",
        testCases: [
          {
            input: "",
            expectedOutput: "Hello Async",
            description: "resolved output",
          },
          {
            input: "",
            expectedOutput: "promise returned",
            description: "api shape",
          },
          {
            input: "",
            expectedOutput: "then handler used",
            description: "consumption",
          },
        ],
        xpReward: 120,
        difficulty: "medium",
        language: "javascript",
        order: 1,
      },
      {
        id: "js-ex-05-02-async-await-fetch",
        title: "Fetch Data with Async/Await",
        description: "Use fetch and await JSON parsing with error handling.",
        theory:
          "### Modern Async Flow\n`async/await` makes async code read like sync code.\nWrap await calls in try/catch for robust error handling.",
        problemStatement:
          "Write async function that fetches `https://jsonplaceholder.typicode.com/todos/1`, parses JSON, and prints `title`.",
        inputExample: "remote API endpoint",
        outputExample: "delectus aut autem",
        hints: ["await fetch(url)", "await res.json()", "log data.title"],
        constraints: ["Must use async/await and try/catch"],
        starterCode: "// TODO",
        solution:
          "async function run() {\n  try {\n    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');\n    const data = await res.json();\n    console.log(data.title);\n  } catch (e) {\n    console.log('Request failed');\n  }\n}\nrun();",
        testCases: [
          {
            input: "",
            expectedOutput: "title printed from response",
            description: "data output",
          },
          {
            input: "",
            expectedOutput: "uses await fetch + json",
            description: "await flow",
          },
          {
            input: "",
            expectedOutput: "try/catch included",
            description: "error handling",
          },
        ],
        xpReward: 150,
        difficulty: "hard",
        language: "javascript",
        order: 2,
      },
    ],
  },
  {
    id: "js-ch-06-es6-capstone",
    title: "ES6+ Features and Final Project",
    description:
      "Apply modern JavaScript patterns and complete a practical mini-project.",
    order: 6,
    exercises: [
      {
        id: "js-ex-06-01-es6-features",
        title: "Spread, Rest, and Arrow Functions",
        description: "Use ES6 syntax for concise and expressive code.",
        theory:
          "### ES6+ Productivity Tools\n- Rest parameters gather variable arguments\n- Spread syntax expands arrays/objects\n- Arrow functions reduce boilerplate\n\nTogether they simplify modern JS codebases.",
        problemStatement:
          "Create function `sum(...nums)` using rest + reduce; clone array `[1,2,3]` with spread and append 4; print both results.",
        inputExample: "nums and array operations",
        outputExample: "10\n[1,2,3,4]",
        hints: ["Use ...nums param", "Use reduce for total", "Use [...arr, 4]"],
        constraints: ["Must use rest and spread"],
        starterCode: "// TODO",
        solution:
          "const sum = (...nums) => nums.reduce((a, b) => a + b, 0);\nconst arr = [1, 2, 3];\nconst next = [...arr, 4];\nconsole.log(sum(1, 2, 3, 4));\nconsole.log(next);",
        testCases: [
          { input: "", expectedOutput: "10", description: "sum output" },
          {
            input: "",
            expectedOutput: "[1,2,3,4]",
            description: "spread result",
          },
          {
            input: "",
            expectedOutput: "uses rest + spread syntax",
            description: "feature usage",
          },
        ],
        xpReward: 130,
        difficulty: "medium",
        language: "javascript",
        order: 1,
      },
      {
        id: "js-ex-06-02-final-project-todo-logic",
        title: "Final Project: Todo App Core Logic",
        description:
          "Implement core add/toggle/remove logic for a todo app state manager.",
        theory:
          "### State Management Mindset\nEven simple apps need predictable state transitions.\nA robust pattern is immutable updates:\n- Add task by returning new array\n- Toggle by mapping and changing only target item\n- Remove by filtering by id\n\nThis pattern aligns with modern frameworks and avoids mutation bugs.",
        problemStatement:
          "Implement three functions: addTodo(list, text), toggleTodo(list, id), removeTodo(list, id). Each returns a new list. Use object shape `{ id, text, done }`.",
        inputExample: "todo list array + operation calls",
        outputExample: "correctly updated arrays for each operation",
        hints: [
          "Use Date.now() or incremental id for new todo",
          "Use map for toggle",
          "Use filter for remove",
          "Avoid in-place mutation",
        ],
        constraints: [
          "All functions must be pure (return new arrays)",
          "Todo object must include id, text, done",
        ],
        starterCode:
          "// TODO: implement addTodo, toggleTodo, removeTodo\n\nlet todos = [];\n",
        solution:
          "function addTodo(list, text) {\n  const todo = { id: Date.now(), text, done: false };\n  return [...list, todo];\n}\n\nfunction toggleTodo(list, id) {\n  return list.map(item => item.id === id ? { ...item, done: !item.done } : item);\n}\n\nfunction removeTodo(list, id) {\n  return list.filter(item => item.id !== id);\n}\n\nlet todos = [];\ntodos = addTodo(todos, 'Learn JavaScript');\nconst firstId = todos[0].id;\ntodos = toggleTodo(todos, firstId);\nconsole.log(todos[0].done);\ntodos = removeTodo(todos, firstId);\nconsole.log(todos.length);",
        testCases: [
          {
            input: "",
            expectedOutput: "addTodo appends new item",
            description: "add behavior",
          },
          {
            input: "",
            expectedOutput: "toggleTodo flips done boolean",
            description: "toggle behavior",
          },
          {
            input: "",
            expectedOutput: "removeTodo removes matching id",
            description: "remove behavior",
          },
        ],
        xpReward: 180,
        difficulty: "hard",
        language: "javascript",
        order: 2,
      },
    ],
  },
];

async function seedJsCourse() {
  const totalXP = jsChapters
    .flatMap((chapter) => chapter.exercises)
    .reduce((sum, exercise) => sum + exercise.xpReward, 0);

  const course = await prisma.course.upsert({
    where: { id: JS_COURSE.id },
    create: {
      ...JS_COURSE,
      totalXP,
    },
    update: {
      title: JS_COURSE.title,
      shortDescription: JS_COURSE.shortDescription,
      description: JS_COURSE.description,
      category: JS_COURSE.category,
      difficulty: JS_COURSE.difficulty,
      thumbnail: JS_COURSE.thumbnail,
      isPremium: JS_COURSE.isPremium,
      estimatedHours: JS_COURSE.estimatedHours,
      enrolledCount: JS_COURSE.enrolledCount,
      rating: JS_COURSE.rating,
      tags: JS_COURSE.tags,
      totalXP,
    },
  });

  const chapterIds = jsChapters.map((chapter) => chapter.id);

  await prisma.chapter.deleteMany({
    where: {
      courseId: course.id,
      id: { notIn: chapterIds },
    },
  });

  for (const chapter of jsChapters) {
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
    `Seeded ${course.title}: ${jsChapters.length} chapters, ${jsChapters.flatMap((c) => c.exercises).length} exercises`,
  );
}

async function main() {
  console.log("Starting additive seed...");
  const retainedCourseIds = [
    DSA_COURSE.id,
    CPP_COURSE.id,
    HTML_COURSE.id,
    CSS_COURSE.id,
    JS_COURSE_ID_FROM_MODULE,
    REACTJS_COURSE_ID,
  ];

  const removedCourses = await prisma.course.deleteMany({
    where: {
      id: { notIn: retainedCourseIds },
    },
  });

  if (removedCourses.count > 0) {
    console.log(
      `Removed ${removedCourses.count} legacy course(s) not in active curriculum.`,
    );
  }

  await seedDsaCourse();
  await seedCppCourse();
  await seedHtmlCourse();
  await seedCssCourse();
  await seedJsCourseFromModule();
  await seedReactJsCourse();
  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Final catch error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
