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

export async function seedCppCourse() {
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

export const CPP_COURSE_ID = CPP_COURSE.id;
