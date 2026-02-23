import { Course, User, Badge, DailyActivity, SubscriptionPlan } from "@/types";

// ===== Badge Definitions =====
export const BADGES: Badge[] = [
  {
    id: "first-course",
    name: "Pioneer",
    description: "Completed your first course",
    icon: "🏆",
    requirement: { type: "course_complete", value: 1 },
  },
  {
    id: "streak-7",
    name: "Consistent Coder",
    description: "7-day coding streak",
    icon: "🔥",
    requirement: { type: "streak", value: 7 },
  },
  {
    id: "xp-1000",
    name: "XP Master",
    description: "Earned 1000 XP",
    icon: "⚡",
    requirement: { type: "xp", value: 1000 },
  },
  {
    id: "xp-5000",
    name: "Elite Coder",
    description: "Earned 5000 XP",
    icon: "💎",
    requirement: { type: "xp", value: 5000 },
  },
  {
    id: "streak-30",
    name: "Monthly Warrior",
    description: "30-day coding streak",
    icon: "🛡️",
    requirement: { type: "streak", value: 30 },
  },
  {
    id: "exercises-50",
    name: "Problem Solver",
    description: "Complete 50 exercises",
    icon: "🧩",
    requirement: { type: "exercises", value: 50 },
  },
];

// ===== Mock User =====
export const MOCK_USER: User = {
  id: "user_001",
  email: "learner@pixellearn.com",
  name: "Alex Developer",
  avatar: "",
  subscription: "pro",
  xp: 2450,
  streak: 12,
  badges: [
    { ...BADGES[0], unlockedAt: "2026-01-15" },
    { ...BADGES[1], unlockedAt: "2026-02-01" },
    { ...BADGES[2], unlockedAt: "2026-02-10" },
  ],
  enrolledCourses: ["python-fundamentals", "javascript-mastery", "web-dev-bootcamp"],
  completedExercises: [
    "py-ex-1", "py-ex-2", "py-ex-3", "py-ex-4", "py-ex-5",
    "py-ex-6", "py-ex-7", "py-ex-8", "py-ex-9", "py-ex-10",
    "js-ex-1", "js-ex-2", "js-ex-3", "js-ex-4", "js-ex-5",
    "js-ex-6", "js-ex-7",
    "web-ex-1", "web-ex-2", "web-ex-3",
  ],
  referralCode: "ALEX2026",
  referralCount: 3,
  createdAt: "2026-01-01",
  lastActive: "2026-02-22",
};

// ===== Courses =====
export const COURSES: Course[] = [
  {
    id: "python-fundamentals",
    title: "Python Fundamentals",
    description:
      "Master Python from basics to intermediate concepts. Learn variables, data types, control flow, functions, and object-oriented programming with hands-on exercises.",
    shortDescription: "Build a solid foundation in Python programming",
    category: "Python",
    difficulty: "beginner",
    thumbnail: "/thumbnails/python.svg",
    isPremium: false,
    totalXP: 1500,
    estimatedHours: 20,
    enrolledCount: 12847,
    rating: 4.8,
    tags: ["Python", "Beginner", "Programming Basics"],
    createdAt: "2025-12-01",
    chapters: [
      {
        id: "py-ch-1",
        courseId: "python-fundamentals",
        title: "Getting Started with Python",
        description: "Introduction to Python, setup, and first programs",
        order: 1,
        isPremium: false,
        exercises: [
          {
            id: "py-ex-1",
            chapterId: "py-ch-1",
            courseId: "python-fundamentals",
            title: "Hello World",
            description: "Write your first Python program",
            theory:
              "Python is a high-level, interpreted programming language known for its simplicity and readability. The `print()` function is used to display output to the console.\n\n### Key Concepts:\n- `print()` function outputs text to the console\n- Strings are enclosed in quotes (single or double)\n- Python executes code line by line from top to bottom",
            problemStatement:
              'Write a program that prints "Hello, World!" to the console.',
            inputExample: "None",
            outputExample: "Hello, World!",
            hints: [
              "Use the print() function",
              'Put your text inside quotes within print()',
            ],
            constraints: ["Output must match exactly"],
            starterCode: '# Write your code here\n',
            solution: 'print("Hello, World!")',
            testCases: [
              {
                input: "",
                expectedOutput: "Hello, World!",
                description: "Should print Hello, World!",
              },
            ],
            xpReward: 50,
            difficulty: "easy",
            language: "python",
            order: 1,
          },
          {
            id: "py-ex-2",
            chapterId: "py-ch-1",
            courseId: "python-fundamentals",
            title: "Variables & Data Types",
            description: "Learn to declare variables and understand data types",
            theory:
              "Variables in Python are created when you assign a value to them. Python is dynamically typed, meaning you don't need to declare the variable type.\n\n### Data Types:\n- `int` – Integer numbers (e.g., 42)\n- `float` – Decimal numbers (e.g., 3.14)\n- `str` – Text strings (e.g., 'hello')\n- `bool` – Boolean values (True/False)\n\n### Variable Assignment:\n```python\nname = 'Alice'\nage = 25\nheight = 5.6\nis_student = True\n```",
            problemStatement:
              "Create variables for a person's name (string), age (integer), and height (float). Then print each one on a separate line.",
            inputExample: "None",
            outputExample: "Alice\n25\n5.6",
            hints: [
              "Assign values to variables first",
              "Use print() for each variable",
            ],
            constraints: [
              "Use the exact values: name='Alice', age=25, height=5.6",
            ],
            starterCode:
              "# Create your variables here\nname = \nage = \nheight = \n\n# Print each variable\n",
            solution:
              "name = 'Alice'\nage = 25\nheight = 5.6\n\nprint(name)\nprint(age)\nprint(height)",
            testCases: [
              {
                input: "",
                expectedOutput: "Alice\n25\n5.6",
                description: "Should print name, age, and height",
              },
            ],
            xpReward: 75,
            difficulty: "easy",
            language: "python",
            order: 2,
          },
          {
            id: "py-ex-3",
            chapterId: "py-ch-1",
            courseId: "python-fundamentals",
            title: "String Operations",
            description: "Master string concatenation and formatting",
            theory:
              "Strings can be combined and formatted in several ways:\n\n### Concatenation:\n```python\nfirst = 'Hello'\nsecond = 'World'\nresult = first + ' ' + second\n```\n\n### f-strings (recommended):\n```python\nname = 'Alice'\nage = 25\nmessage = f'My name is {name} and I am {age} years old'\n```\n\n### String Methods:\n- `.upper()` – Convert to uppercase\n- `.lower()` – Convert to lowercase\n- `.strip()` – Remove whitespace\n- `.replace(old, new)` – Replace substring",
            problemStatement:
              'Given name="Python" and version=3, use an f-string to print: "Python version 3 is awesome!"',
            inputExample: "None",
            outputExample: "Python version 3 is awesome!",
            hints: [
              "Use f-string with curly braces for variables",
              'f"text {variable} more text"',
            ],
            constraints: ["Must use f-string formatting"],
            starterCode:
              'name = "Python"\nversion = 3\n\n# Use an f-string to print the required output\n',
            solution:
              'name = "Python"\nversion = 3\n\nprint(f"{name} version {version} is awesome!")',
            testCases: [
              {
                input: "",
                expectedOutput: "Python version 3 is awesome!",
                description: "Should use f-string formatting correctly",
              },
            ],
            xpReward: 75,
            difficulty: "easy",
            language: "python",
            order: 3,
          },
        ],
      },
      {
        id: "py-ch-2",
        courseId: "python-fundamentals",
        title: "Control Flow",
        description: "Learn conditional statements and loops",
        order: 2,
        isPremium: false,
        exercises: [
          {
            id: "py-ex-4",
            chapterId: "py-ch-2",
            courseId: "python-fundamentals",
            title: "If-Else Statements",
            description: "Learn conditional logic",
            theory:
              "Conditional statements allow your program to make decisions.\n\n### Syntax:\n```python\nif condition:\n    # code block\nelif another_condition:\n    # code block\nelse:\n    # code block\n```\n\n### Comparison Operators:\n- `==` Equal to\n- `!=` Not equal to\n- `>` Greater than\n- `<` Less than\n- `>=` Greater than or equal\n- `<=` Less than or equal",
            problemStatement:
              'Write a program that checks if a number is positive, negative, or zero. Given num=15, print "Positive", "Negative", or "Zero".',
            inputExample: "num = 15",
            outputExample: "Positive",
            hints: [
              "Use if, elif, else structure",
              "Check > 0, < 0, or equal to 0",
            ],
            constraints: ["Use if-elif-else structure"],
            starterCode:
              'num = 15\n\n# Check if positive, negative, or zero\n',
            solution:
              'num = 15\n\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")',
            testCases: [
              {
                input: "",
                expectedOutput: "Positive",
                description: "15 should print Positive",
              },
            ],
            xpReward: 100,
            difficulty: "easy",
            language: "python",
            order: 1,
          },
          {
            id: "py-ex-5",
            chapterId: "py-ch-2",
            courseId: "python-fundamentals",
            title: "For Loops",
            description: "Iterate over sequences with for loops",
            theory:
              "For loops iterate over sequences (lists, strings, ranges).\n\n### Syntax:\n```python\nfor item in sequence:\n    # do something\n```\n\n### range() function:\n```python\nfor i in range(5):      # 0, 1, 2, 3, 4\nfor i in range(1, 6):   # 1, 2, 3, 4, 5\nfor i in range(0, 10, 2): # 0, 2, 4, 6, 8\n```",
            problemStatement:
              "Print the sum of numbers from 1 to 10 using a for loop.",
            inputExample: "None",
            outputExample: "55",
            hints: [
              "Use range(1, 11) to get numbers 1-10",
              "Create a sum variable, add each number",
            ],
            constraints: ["Must use a for loop"],
            starterCode:
              "# Calculate and print the sum of 1 to 10\ntotal = 0\n\n# Your loop here\n\nprint(total)",
            solution:
              "total = 0\n\nfor i in range(1, 11):\n    total += i\n\nprint(total)",
            testCases: [
              {
                input: "",
                expectedOutput: "55",
                description: "Sum of 1 to 10 should be 55",
              },
            ],
            xpReward: 100,
            difficulty: "easy",
            language: "python",
            order: 2,
          },
        ],
      },
      {
        id: "py-ch-3",
        courseId: "python-fundamentals",
        title: "Functions & Modules",
        description: "Create reusable code with functions",
        order: 3,
        isPremium: true,
        exercises: [
          {
            id: "py-ex-6",
            chapterId: "py-ch-3",
            courseId: "python-fundamentals",
            title: "Defining Functions",
            description: "Create and call functions",
            theory:
              "Functions are reusable blocks of code.\n\n### Syntax:\n```python\ndef function_name(parameter1, parameter2):\n    # code block\n    return result\n```\n\n### Example:\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\nmessage = greet('Alice')\nprint(message)  # Hello, Alice!\n```",
            problemStatement:
              "Create a function called `calculate_area` that takes `length` and `width` as parameters and returns their product. Call it with length=5 and width=3, and print the result.",
            inputExample: "length=5, width=3",
            outputExample: "15",
            hints: [
              "def calculate_area(length, width):",
              "Return length * width",
            ],
            constraints: ["Must define and call the function"],
            starterCode:
              "# Define your function here\n\n\n# Call the function and print the result\n",
            solution:
              "def calculate_area(length, width):\n    return length * width\n\nresult = calculate_area(5, 3)\nprint(result)",
            testCases: [
              {
                input: "",
                expectedOutput: "15",
                description: "5 * 3 should return 15",
              },
            ],
            xpReward: 125,
            difficulty: "medium",
            language: "python",
            order: 1,
          },
          {
            id: "py-ex-7",
            chapterId: "py-ch-3",
            courseId: "python-fundamentals",
            title: "Lambda Functions",
            description: "Write concise anonymous functions",
            theory:
              "Lambda functions are small anonymous functions.\n\n### Syntax:\n```python\nlambda arguments: expression\n```\n\n### Example:\n```python\nsquare = lambda x: x ** 2\nprint(square(5))  # 25\n\nadd = lambda a, b: a + b\nprint(add(3, 4))  # 7\n```\n\n### Use with built-in functions:\n```python\nnumbers = [3, 1, 4, 1, 5]\nsorted_nums = sorted(numbers, key=lambda x: -x)\n```",
            problemStatement:
              "Create a lambda function called `double` that doubles a number. Use it to print the result of doubling 7.",
            inputExample: "7",
            outputExample: "14",
            hints: [
              "lambda x: x * 2",
              "Assign lambda to variable, then call it",
            ],
            constraints: ["Must use a lambda function"],
            starterCode: "# Create a lambda function\n\n\n# Use it and print\n",
            solution: "double = lambda x: x * 2\n\nprint(double(7))",
            testCases: [
              {
                input: "",
                expectedOutput: "14",
                description: "Doubling 7 should return 14",
              },
            ],
            xpReward: 125,
            difficulty: "medium",
            language: "python",
            order: 2,
          },
        ],
      },
      {
        id: "py-ch-4",
        courseId: "python-fundamentals",
        title: "Data Structures",
        description: "Lists, dictionaries, tuples, and sets",
        order: 4,
        isPremium: true,
        exercises: [
          {
            id: "py-ex-8",
            chapterId: "py-ch-4",
            courseId: "python-fundamentals",
            title: "Working with Lists",
            description: "Create and manipulate Python lists",
            theory:
              "Lists are ordered, mutable collections.\n\n### Creating lists:\n```python\nfruits = ['apple', 'banana', 'cherry']\nnumbers = [1, 2, 3, 4, 5]\n```\n\n### Common operations:\n- `append(item)` – Add to end\n- `insert(index, item)` – Insert at position\n- `remove(item)` – Remove first occurrence\n- `pop(index)` – Remove and return item\n- `sort()` – Sort in place\n- `len(list)` – Get length",
            problemStatement:
              "Create a list of numbers [5, 2, 8, 1, 9]. Sort it and print the sorted list.",
            inputExample: "None",
            outputExample: "[1, 2, 5, 8, 9]",
            hints: [
              "Create the list, then use .sort()",
              "Print the list after sorting",
            ],
            constraints: ["Use the .sort() method"],
            starterCode: "# Create and sort the list\n",
            solution:
              "numbers = [5, 2, 8, 1, 9]\nnumbers.sort()\nprint(numbers)",
            testCases: [
              {
                input: "",
                expectedOutput: "[1, 2, 5, 8, 9]",
                description: "Should print sorted list",
              },
            ],
            xpReward: 100,
            difficulty: "easy",
            language: "python",
            order: 1,
          },
          {
            id: "py-ex-9",
            chapterId: "py-ch-4",
            courseId: "python-fundamentals",
            title: "Dictionary Operations",
            description: "Work with key-value pairs",
            theory:
              "Dictionaries store key-value pairs.\n\n### Creating dictionaries:\n```python\nstudent = {\n    'name': 'Alice',\n    'age': 20,\n    'grade': 'A'\n}\n```\n\n### Accessing values:\n```python\nprint(student['name'])  # Alice\nprint(student.get('age'))  # 20\n```\n\n### Iterating:\n```python\nfor key, value in student.items():\n    print(f'{key}: {value}')\n```",
            problemStatement:
              "Create a dictionary with keys 'name', 'language', and 'experience'. Set values to 'Alice', 'Python', and 3. Print each key-value pair on a new line using format: 'key: value'.",
            inputExample: "None",
            outputExample: "name: Alice\nlanguage: Python\nexperience: 3",
            hints: [
              "Use a for loop with .items()",
              "Use f-string for formatting",
            ],
            constraints: ["Must iterate using .items()"],
            starterCode: "# Create your dictionary and print key-value pairs\n",
            solution:
              "developer = {'name': 'Alice', 'language': 'Python', 'experience': 3}\n\nfor key, value in developer.items():\n    print(f'{key}: {value}')",
            testCases: [
              {
                input: "",
                expectedOutput: "name: Alice\nlanguage: Python\nexperience: 3",
                description: "Should print all key-value pairs",
              },
            ],
            xpReward: 125,
            difficulty: "medium",
            language: "python",
            order: 2,
          },
          {
            id: "py-ex-10",
            chapterId: "py-ch-4",
            courseId: "python-fundamentals",
            title: "List Comprehensions",
            description: "Write concise list transformations",
            theory:
              "List comprehensions provide a concise way to create lists.\n\n### Syntax:\n```python\nnew_list = [expression for item in iterable if condition]\n```\n\n### Examples:\n```python\nsquares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]\nwords = ['Hello', 'World']\nupper = [w.upper() for w in words]\n```",
            problemStatement:
              "Use a list comprehension to create a list of squares of even numbers from 1 to 10. Print the result.",
            inputExample: "None",
            outputExample: "[4, 16, 36, 64, 100]",
            hints: [
              "Filter even numbers with if x % 2 == 0",
              "Square each with x**2",
            ],
            constraints: ["Must use list comprehension"],
            starterCode: "# Create list of squares of even numbers from 1-10\n",
            solution:
              "result = [x**2 for x in range(1, 11) if x % 2 == 0]\nprint(result)",
            testCases: [
              {
                input: "",
                expectedOutput: "[4, 16, 36, 64, 100]",
                description: "Squares of even numbers 2,4,6,8,10",
              },
            ],
            xpReward: 150,
            difficulty: "medium",
            language: "python",
            order: 3,
          },
        ],
      },
    ],
  },
  {
    id: "javascript-mastery",
    title: "JavaScript Mastery",
    description:
      "From zero to hero in JavaScript. Cover ES6+ features, DOM manipulation, async programming, and build real-world projects. Perfect for web development beginners.",
    shortDescription: "Become proficient in modern JavaScript",
    category: "JavaScript",
    difficulty: "intermediate",
    thumbnail: "/thumbnails/javascript.svg",
    isPremium: true,
    totalXP: 2000,
    estimatedHours: 30,
    enrolledCount: 9532,
    rating: 4.7,
    tags: ["JavaScript", "ES6+", "Web Development"],
    createdAt: "2025-12-15",
    chapters: [
      {
        id: "js-ch-1",
        courseId: "javascript-mastery",
        title: "JavaScript Basics",
        description: "Variables, types, and operators in JavaScript",
        order: 1,
        isPremium: false,
        exercises: [
          {
            id: "js-ex-1",
            chapterId: "js-ch-1",
            courseId: "javascript-mastery",
            title: "Variables with let and const",
            description: "Understand modern variable declarations",
            theory:
              "JavaScript has three ways to declare variables:\n\n### `const` – Constant (cannot be reassigned):\n```javascript\nconst PI = 3.14159;\nconst name = 'Alice';\n```\n\n### `let` – Block-scoped variable:\n```javascript\nlet count = 0;\ncount = 1; // OK\n```\n\n### `var` – Function-scoped (avoid in modern JS):\n```javascript\nvar old = 'avoid this';\n```\n\n**Best Practice:** Use `const` by default, `let` when you need to reassign.",
            problemStatement:
              'Declare a constant `GREETING` with value "Hello" and a variable `target` with value "World". Print them combined with a space.',
            inputExample: "None",
            outputExample: "Hello World",
            hints: [
              "Use const for GREETING",
              "Use let for target",
              "Use template literals or concatenation",
            ],
            constraints: ["Must use const and let"],
            starterCode:
              "// Declare your variables\n\n\n// Print the combined greeting\n",
            solution:
              'const GREETING = "Hello";\nlet target = "World";\n\nconsole.log(`${GREETING} ${target}`);',
            testCases: [
              {
                input: "",
                expectedOutput: "Hello World",
                description: "Should print Hello World",
              },
            ],
            xpReward: 50,
            difficulty: "easy",
            language: "javascript",
            order: 1,
          },
          {
            id: "js-ex-2",
            chapterId: "js-ch-1",
            courseId: "javascript-mastery",
            title: "Arrow Functions",
            description: "Modern function syntax in JavaScript",
            theory:
              "Arrow functions provide a shorter syntax for writing functions.\n\n### Traditional:\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n```\n\n### Arrow Function:\n```javascript\nconst add = (a, b) => a + b;\n\nconst greet = (name) => {\n  const message = `Hello, ${name}!`;\n  return message;\n};\n```\n\n### Single parameter (no parens needed):\n```javascript\nconst double = x => x * 2;\n```",
            problemStatement:
              "Create an arrow function called `multiply` that takes two parameters and returns their product. Call it with 6 and 7, and print the result.",
            inputExample: "6, 7",
            outputExample: "42",
            hints: [
              "const multiply = (a, b) => ...",
              "Use console.log to print",
            ],
            constraints: ["Must use arrow function syntax"],
            starterCode:
              "// Create your arrow function\n\n\n// Call and print\n",
            solution:
              "const multiply = (a, b) => a * b;\n\nconsole.log(multiply(6, 7));",
            testCases: [
              {
                input: "",
                expectedOutput: "42",
                description: "6 * 7 should be 42",
              },
            ],
            xpReward: 75,
            difficulty: "easy",
            language: "javascript",
            order: 2,
          },
          {
            id: "js-ex-3",
            chapterId: "js-ch-1",
            courseId: "javascript-mastery",
            title: "Array Methods",
            description: "Map, filter, and reduce",
            theory:
              "JavaScript arrays have powerful built-in methods.\n\n### `.map()` – Transform each element:\n```javascript\nconst nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2); // [2, 4, 6]\n```\n\n### `.filter()` – Keep elements that pass a test:\n```javascript\nconst evens = nums.filter(n => n % 2 === 0); // [2]\n```\n\n### `.reduce()` – Accumulate a single value:\n```javascript\nconst sum = nums.reduce((acc, n) => acc + n, 0); // 6\n```",
            problemStatement:
              "Given an array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], use .filter() to get even numbers, then .map() to square them. Print the result.",
            inputExample: "None",
            outputExample: "[ 4, 16, 36, 64, 100 ]",
            hints: [
              "Chain .filter() and .map()",
              "Filter: n % 2 === 0, Map: n * n",
            ],
            constraints: ["Must use filter and map"],
            starterCode:
              "const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// Filter evens, then square them\n",
            solution:
              "const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\nconst result = numbers.filter(n => n % 2 === 0).map(n => n * n);\nconsole.log(result);",
            testCases: [
              {
                input: "",
                expectedOutput: "[ 4, 16, 36, 64, 100 ]",
                description: "Squares of even numbers",
              },
            ],
            xpReward: 100,
            difficulty: "medium",
            language: "javascript",
            order: 3,
          },
        ],
      },
      {
        id: "js-ch-2",
        courseId: "javascript-mastery",
        title: "Async JavaScript",
        description: "Promises, async/await, and API calls",
        order: 2,
        isPremium: true,
        exercises: [
          {
            id: "js-ex-4",
            chapterId: "js-ch-2",
            courseId: "javascript-mastery",
            title: "Promises",
            description: "Understanding asynchronous operations",
            theory:
              "Promises represent the eventual completion (or failure) of an asynchronous operation.\n\n### Creating a Promise:\n```javascript\nconst myPromise = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve('Success!');\n  }, 1000);\n});\n```\n\n### Using a Promise:\n```javascript\nmyPromise\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n```",
            problemStatement:
              'Create a function `delayedGreeting` that returns a promise. The promise should resolve with "Hello after delay!". Then call the function and print the result using .then().',
            inputExample: "None",
            outputExample: "Hello after delay!",
            hints: [
              "Return new Promise((resolve) => ...)",
              "Use .then() to handle the result",
            ],
            constraints: ["Must use Promise"],
            starterCode:
              "// Create your function that returns a promise\n\n\n// Call it and print the result\n",
            solution:
              'function delayedGreeting() {\n  return new Promise((resolve) => {\n    resolve("Hello after delay!");\n  });\n}\n\ndelayedGreeting().then(msg => console.log(msg));',
            testCases: [
              {
                input: "",
                expectedOutput: "Hello after delay!",
                description: "Should resolve and print greeting",
              },
            ],
            xpReward: 150,
            difficulty: "medium",
            language: "javascript",
            order: 1,
          },
          {
            id: "js-ex-5",
            chapterId: "js-ch-2",
            courseId: "javascript-mastery",
            title: "Async/Await",
            description: "Modern async syntax",
            theory:
              "async/await is syntactic sugar over Promises.\n\n### Syntax:\n```javascript\nasync function fetchData() {\n  try {\n    const result = await someAsyncOperation();\n    console.log(result);\n  } catch (error) {\n    console.error(error);\n  }\n}\n```\n\n### Key Rules:\n- `async` keyword before function declaration\n- `await` can only be used inside `async` functions\n- `await` pauses execution until Promise resolves",
            problemStatement:
              'Create an async function `getData` that awaits a Promise that resolves with "Data loaded!". Print the result.',
            inputExample: "None",
            outputExample: "Data loaded!",
            hints: [
              "Use async function",
              "Create a Promise inside and await it",
            ],
            constraints: ["Must use async/await"],
            starterCode:
              "// Create your async function\n\n\n// Call the function\n",
            solution:
              'async function getData() {\n  const data = await new Promise((resolve) => {\n    resolve("Data loaded!");\n  });\n  console.log(data);\n}\n\ngetData();',
            testCases: [
              {
                input: "",
                expectedOutput: "Data loaded!",
                description: "Should print Data loaded!",
              },
            ],
            xpReward: 150,
            difficulty: "medium",
            language: "javascript",
            order: 2,
          },
          {
            id: "js-ex-6",
            chapterId: "js-ch-2",
            courseId: "javascript-mastery",
            title: "Destructuring",
            description: "Extract values from objects and arrays",
            theory:
              "Destructuring lets you unpack values from arrays and properties from objects.\n\n### Array Destructuring:\n```javascript\nconst [a, b, c] = [1, 2, 3];\n```\n\n### Object Destructuring:\n```javascript\nconst { name, age } = { name: 'Alice', age: 25 };\n```\n\n### Default values:\n```javascript\nconst { name = 'Unknown', age = 0 } = {};\n```",
            problemStatement:
              'Given object `{ name: "Alice", role: "Developer", level: 5 }`, destructure it and print each value on a new line.',
            inputExample: "None",
            outputExample: "Alice\nDeveloper\n5",
            hints: [
              "Use const { name, role, level } = ...",
              "Print each variable",
            ],
            constraints: ["Must use destructuring"],
            starterCode:
              'const person = { name: "Alice", role: "Developer", level: 5 };\n\n// Destructure and print\n',
            solution:
              'const person = { name: "Alice", role: "Developer", level: 5 };\n\nconst { name, role, level } = person;\nconsole.log(name);\nconsole.log(role);\nconsole.log(level);',
            testCases: [
              {
                input: "",
                expectedOutput: "Alice\nDeveloper\n5",
                description: "Should print destructured values",
              },
            ],
            xpReward: 100,
            difficulty: "easy",
            language: "javascript",
            order: 3,
          },
          {
            id: "js-ex-7",
            chapterId: "js-ch-2",
            courseId: "javascript-mastery",
            title: "Spread & Rest Operators",
            description: "Use ... for flexible operations",
            theory:
              "The spread/rest operator (`...`) has two uses:\n\n### Spread (expanding):\n```javascript\nconst arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]\n\nconst obj1 = { a: 1 };\nconst obj2 = { ...obj1, b: 2 }; // { a: 1, b: 2 }\n```\n\n### Rest (collecting):\n```javascript\nfunction sum(...numbers) {\n  return numbers.reduce((a, b) => a + b, 0);\n}\n```",
            problemStatement:
              "Create a function `sum` using rest parameters that accepts any number of arguments and returns their sum. Call it with (1, 2, 3, 4, 5) and print the result.",
            inputExample: "1, 2, 3, 4, 5",
            outputExample: "15",
            hints: [
              "function sum(...numbers)",
              "Use .reduce() to sum all numbers",
            ],
            constraints: ["Must use rest parameters"],
            starterCode:
              "// Create sum function with rest parameters\n\n\n// Call and print\n",
            solution:
              "function sum(...numbers) {\n  return numbers.reduce((a, b) => a + b, 0);\n}\n\nconsole.log(sum(1, 2, 3, 4, 5));",
            testCases: [
              {
                input: "",
                expectedOutput: "15",
                description: "Sum of 1-5 should be 15",
              },
            ],
            xpReward: 125,
            difficulty: "medium",
            language: "javascript",
            order: 4,
          },
        ],
      },
    ],
  },
  {
    id: "web-dev-bootcamp",
    title: "Web Development Bootcamp",
    description:
      "Build modern web applications from scratch. Learn HTML5, CSS3, responsive design, and deploy your first website. A comprehensive guide to frontend development.",
    shortDescription: "Complete guide to modern web development",
    category: "Web Development",
    difficulty: "beginner",
    thumbnail: "/thumbnails/webdev.svg",
    isPremium: false,
    totalXP: 1800,
    estimatedHours: 25,
    enrolledCount: 15234,
    rating: 4.9,
    tags: ["HTML", "CSS", "Web Development", "Frontend"],
    createdAt: "2026-01-01",
    chapters: [
      {
        id: "web-ch-1",
        courseId: "web-dev-bootcamp",
        title: "HTML Foundations",
        description: "Structure web pages with semantic HTML",
        order: 1,
        isPremium: false,
        exercises: [
          {
            id: "web-ex-1",
            chapterId: "web-ch-1",
            courseId: "web-dev-bootcamp",
            title: "Basic HTML Structure",
            description: "Create a proper HTML document",
            theory:
              "Every HTML document follows a basic structure:\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Page Title</title>\n</head>\n<body>\n    <!-- Content goes here -->\n</body>\n</html>\n```\n\n### Key Elements:\n- `<!DOCTYPE html>` – Declares HTML5\n- `<html>` – Root element\n- `<head>` – Metadata, title, links\n- `<body>` – Visible content",
            problemStatement:
              'Create a basic HTML page with the title "My First Page" and a heading (h1) that says "Welcome to Web Dev".',
            inputExample: "None",
            outputExample:
              'HTML page with title "My First Page" and h1 "Welcome to Web Dev"',
            hints: [
              "Start with <!DOCTYPE html>",
              "Add title in <head>",
              "Add h1 in <body>",
            ],
            constraints: ["Must include DOCTYPE, html, head, and body tags"],
            starterCode:
              "<!-- Create your HTML page -->\n<!DOCTYPE html>\n<html>\n\n</html>",
            solution:
              '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Welcome to Web Dev</h1>\n</body>\n</html>',
            testCases: [
              {
                input: "",
                expectedOutput: "Valid HTML with h1",
                description: "Should have proper HTML structure with h1",
              },
            ],
            xpReward: 50,
            difficulty: "easy",
            language: "html",
            order: 1,
          },
          {
            id: "web-ex-2",
            chapterId: "web-ch-1",
            courseId: "web-dev-bootcamp",
            title: "Lists and Links",
            description: "Create ordered, unordered lists and hyperlinks",
            theory:
              "### Unordered List:\n```html\n<ul>\n    <li>Item 1</li>\n    <li>Item 2</li>\n</ul>\n```\n\n### Ordered List:\n```html\n<ol>\n    <li>First</li>\n    <li>Second</li>\n</ol>\n```\n\n### Links:\n```html\n<a href=\"https://example.com\">Click here</a>\n<a href=\"/about\">About Page</a>\n```",
            problemStatement:
              "Create an unordered list with 3 programming languages and make each one a link to its official website.",
            inputExample: "None",
            outputExample:
              "An unordered list with 3 linked programming languages",
            hints: [
              "Nest <a> inside <li>",
              "Use href for links",
            ],
            constraints: ["Must have 3 list items with links"],
            starterCode: "<!-- Create your list with links -->\n<ul>\n\n</ul>",
            solution:
              '<ul>\n    <li><a href="https://python.org">Python</a></li>\n    <li><a href="https://javascript.com">JavaScript</a></li>\n    <li><a href="https://www.rust-lang.org">Rust</a></li>\n</ul>',
            testCases: [
              {
                input: "",
                expectedOutput: "List with linked items",
                description: "Should have ul with 3 linked li items",
              },
            ],
            xpReward: 75,
            difficulty: "easy",
            language: "html",
            order: 2,
          },
          {
            id: "web-ex-3",
            chapterId: "web-ch-1",
            courseId: "web-dev-bootcamp",
            title: "Semantic HTML",
            description: "Use semantic elements for better structure",
            theory:
              "Semantic HTML elements clearly describe their meaning:\n\n```html\n<header>Site header</header>\n<nav>Navigation links</nav>\n<main>\n    <section>A section</section>\n    <article>An article</article>\n    <aside>Sidebar content</aside>\n</main>\n<footer>Site footer</footer>\n```\n\n### Benefits:\n- Better accessibility\n- SEO improvements\n- Clearer code structure",
            problemStatement:
              "Create a semantic HTML page with header (containing nav), main (containing article and aside), and footer.",
            inputExample: "None",
            outputExample: "Semantic HTML structure",
            hints: [
              "Use <header>, <nav>, <main>, <article>, <aside>, <footer>",
              "Nest nav inside header",
            ],
            constraints: ["Must use all semantic elements mentioned"],
            starterCode: "<!-- Build your semantic HTML structure -->\n",
            solution:
              "<header>\n    <nav>\n        <a href=\"/\">Home</a>\n        <a href=\"/about\">About</a>\n    </nav>\n</header>\n<main>\n    <article>\n        <h1>Main Article</h1>\n        <p>Article content here.</p>\n    </article>\n    <aside>\n        <h2>Sidebar</h2>\n        <p>Related links and info.</p>\n    </aside>\n</main>\n<footer>\n    <p>&copy; 2026 PixelLearn</p>\n</footer>",
            testCases: [
              {
                input: "",
                expectedOutput: "Semantic HTML structure",
                description: "Should use proper semantic elements",
              },
            ],
            xpReward: 100,
            difficulty: "easy",
            language: "html",
            order: 3,
          },
        ],
      },
    ],
  },
  {
    id: "react-advanced",
    title: "React Advanced Patterns",
    description:
      "Master advanced React patterns including hooks, context, render props, HOCs, and performance optimization. Build scalable applications.",
    shortDescription: "Advanced React patterns for production apps",
    category: "React",
    difficulty: "advanced",
    thumbnail: "/thumbnails/react.svg",
    isPremium: true,
    totalXP: 2500,
    estimatedHours: 35,
    enrolledCount: 6789,
    rating: 4.6,
    tags: ["React", "Advanced", "Hooks", "Performance"],
    createdAt: "2026-01-15",
    chapters: [
      {
        id: "react-ch-1",
        courseId: "react-advanced",
        title: "Custom Hooks",
        description: "Build reusable logic with custom hooks",
        order: 1,
        isPremium: true,
        exercises: [
          {
            id: "react-ex-1",
            chapterId: "react-ch-1",
            courseId: "react-advanced",
            title: "useToggle Hook",
            description: "Create a reusable toggle hook",
            theory:
              "Custom hooks let you extract component logic into reusable functions.\n\n### Rules:\n1. Name must start with `use`\n2. Can call other hooks\n3. Share logic, not state\n\n### Example:\n```jsx\nfunction useCounter(initial = 0) {\n  const [count, setCount] = useState(initial);\n  const increment = () => setCount(c => c + 1);\n  const decrement = () => setCount(c => c - 1);\n  return { count, increment, decrement };\n}\n```",
            problemStatement:
              "Create a useToggle custom hook that manages a boolean state. It should return the current value and a toggle function.",
            inputExample: "None",
            outputExample: "Toggle hook working correctly",
            hints: [
              "Use useState(false)",
              "Toggle fn: setValue(prev => !prev)",
            ],
            constraints: ["Must return [value, toggle]"],
            starterCode:
              'import { useState } from "react";\n\n// Create your useToggle hook\n',
            solution:
              'import { useState } from "react";\n\nfunction useToggle(initial = false) {\n  const [value, setValue] = useState(initial);\n  const toggle = () => setValue(prev => !prev);\n  return [value, toggle];\n}',
            testCases: [
              {
                input: "",
                expectedOutput: "Hook toggles between true and false",
                description: "Should toggle boolean value",
              },
            ],
            xpReward: 200,
            difficulty: "medium",
            language: "javascript",
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: "dsa-course",
    title: "Data Structures & Algorithms",
    description:
      "Master essential data structures and algorithms. Learn arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming with hands-on coding challenges.",
    shortDescription: "Essential DSA for coding interviews",
    category: "DSA",
    difficulty: "intermediate",
    thumbnail: "/thumbnails/dsa.svg",
    isPremium: true,
    totalXP: 3000,
    estimatedHours: 40,
    enrolledCount: 8901,
    rating: 4.8,
    tags: ["DSA", "Algorithms", "Data Structures", "Interview Prep"],
    createdAt: "2026-02-01",
    chapters: [
      {
        id: "dsa-ch-1",
        courseId: "dsa-course",
        title: "Arrays & Searching",
        description: "Master array operations and search algorithms",
        order: 1,
        isPremium: false,
        exercises: [
          {
            id: "dsa-ex-1",
            chapterId: "dsa-ch-1",
            courseId: "dsa-course",
            title: "Two Sum Problem",
            description: "Find two numbers that add to target",
            theory:
              "The Two Sum problem is a classic interview question.\n\n### Problem:\nGiven an array and a target sum, find two numbers that add up to the target.\n\n### Approach 1: Brute Force O(n²)\nCheck every pair.\n\n### Approach 2: Hash Map O(n)\nFor each number, check if (target - number) exists in map.\n\n```python\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n```",
            problemStatement:
              'Given nums = [2, 7, 11, 15] and target = 9, find the indices of two numbers that add up to the target. Print the result as a list.',
            inputExample: "nums = [2, 7, 11, 15], target = 9",
            outputExample: "[0, 1]",
            hints: [
              "Use a dictionary/hash map",
              "Store number: index pairs",
            ],
            constraints: ["Must be O(n) solution"],
            starterCode:
              "nums = [2, 7, 11, 15]\ntarget = 9\n\n# Find two indices that sum to target\n",
            solution:
              "nums = [2, 7, 11, 15]\ntarget = 9\n\nseen = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in seen:\n        print([seen[complement], i])\n        break\n    seen[num] = i",
            testCases: [
              {
                input: "",
                expectedOutput: "[0, 1]",
                description: "2 + 7 = 9, indices [0, 1]",
              },
            ],
            xpReward: 200,
            difficulty: "medium",
            language: "python",
            order: 1,
          },
        ],
      },
    ],
  },
];

// ===== Weekly Activity Data =====
export const WEEKLY_ACTIVITY: DailyActivity[] = [
  { date: "Mon", exercisesCompleted: 3, xpEarned: 225, minutesActive: 45 },
  { date: "Tue", exercisesCompleted: 5, xpEarned: 400, minutesActive: 72 },
  { date: "Wed", exercisesCompleted: 2, xpEarned: 150, minutesActive: 30 },
  { date: "Thu", exercisesCompleted: 4, xpEarned: 325, minutesActive: 55 },
  { date: "Fri", exercisesCompleted: 6, xpEarned: 500, minutesActive: 90 },
  { date: "Sat", exercisesCompleted: 1, xpEarned: 75, minutesActive: 15 },
  { date: "Sun", exercisesCompleted: 3, xpEarned: 250, minutesActive: 40 },
];

// ===== Subscription Plans =====
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "monthly",
    features: [
      "Access to free courses",
      "Basic coding playground",
      "Community support",
      "Progress tracking",
      "5 exercises per day",
    ],
    isPopular: false,
  },
  {
    id: "pro-monthly",
    name: "Pro",
    price: 19,
    interval: "monthly",
    features: [
      "All courses unlocked",
      "Unlimited exercises",
      "AI Career Q&A",
      "AI Resume Analyzer",
      "AI Roadmap Generator",
      "Priority support",
      "Certificate of completion",
      "Advanced analytics",
    ],
    isPopular: true,
  },
  {
    id: "pro-yearly",
    name: "Pro Annual",
    price: 149,
    interval: "yearly",
    features: [
      "Everything in Pro Monthly",
      "Save 35% annually",
      "Early access to new courses",
      "1-on-1 mentorship session",
      "Exclusive community access",
      "Custom learning path",
      "Resume review by experts",
      "Job referral network",
    ],
    isPopular: false,
  },
];
