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
  language: "cpp" | "html" | "css" | "javascript" | "java" | "python";
  order: number;
};

type SeedChapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: SeedExercise[];
};

export const PYTHON_COURSE_ID = "python-programming-fundamentals";

const PYTHON_COURSE = {
  id: PYTHON_COURSE_ID,
  title: "Python Programming: Fundamentals to Advanced",
  shortDescription:
    "Master Python starting from basics, control structures, and data structures. Perfect for beginners and aspiring data scientists.",
  description:
    "Learn Python progressively: from syntax basics and data types through control flow, functions, lists, and dictionaries. Built with a structured curriculum, each chapter includes comprehensive theory, practical constraints, and multiple test cases to cement your knowledge.",
  category: "Programming",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1660616246653-e2c57d1077b9?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  isPremium: false,
  estimatedHours: 50,
  enrolledCount: 0,
  rating: 4.8,
  tags: [
    "Python",
    "Programming",
    "Fundamentals",
    "Beginner-Friendly",
  ],
};

const pythonChapters: SeedChapter[] = [
  {
    id: "python-ch-01-basics",
    title: "Python Basics & Variables",
    description: "Learn Python syntax, variables, and how to perform basic Input/Output operations.",
    order: 1,
    exercises: [
      {
        id: "python-ex-01-01-hello",
        title: "Hello World",
        description: "Your first Python program printing to the console.",
        theory: "### Python Program Structure\nPython is incredibly concise. You don't need boilerplate classes or methods to print text.\n\n### Key Points\n- Use `print()` to output text to the console.\n- Text must be enclosed in quotes (single or double).\n\n### Example\n```python\nprint(\"Hello, World!\")\n```",
        problemStatement: "Write a Python program that prints exactly 'Welcome to Python!' to the console.",
        inputExample: "",
        outputExample: "Welcome to Python!",
        hints: [
          "Use the print() function",
          "Make sure to use quotes around the text",
        ],
        constraints: ["Case-sensitive output"],
        starterCode: "# TODO: Print the welcome message\n",
        solution: "print(\"Welcome to Python!\")\n",
        testCases: [
          {
            input: "",
            expectedOutput: "Welcome to Python!",
            description: "basic output",
          },
        ],
        xpReward: 30,
        difficulty: "easy",
        language: "python",
        order: 1,
      },
      {
        id: "python-ex-01-02-variables",
        title: "Variables and Data Types",
        description: "Understand assigning variables and primitive types.",
        theory: "### Variables in Python\nPython is dynamically typed. You don't need to declare the type of a variable before assigning it.\n\n### Core Types\n- `int` - integers\n- `float` - decimals\n- `str` - strings\n- `bool` - True/False\n\n### Example\n```python\nage = 22\nsalary = 1200.50\nprint(age, salary)\n```",
        problemStatement: "Declare a variable `score` with value 100 and a variable `gpa` with 3.8. Print them separated by a space.",
        inputExample: "",
        outputExample: "100 3.8",
        hints: [
          "Assign values using the = operator",
          "Pass multiple arguments to print() separated by commas",
        ],
        constraints: ["Must print variables accurately"],
        starterCode: "# TODO: Declare variables and print them\n",
        solution: "score = 100\ngpa = 3.8\nprint(score, gpa)\n",
        testCases: [
          {
            input: "",
            expectedOutput: "100 3.8",
            description: "check printed assignment",
          },
        ],
        xpReward: 40,
        difficulty: "easy",
        language: "python",
        order: 2,
      },
      {
        id: "python-ex-01-03-input",
        title: "Reading User Input",
        description: "Accept input using the input() function.",
        theory: "### Input Function\nTo read inputs from the user, Python provides the `input()` function. It reads the input as a string.\n\n### Usage\n```python\nnum = int(input())\nprint(\"You entered:\", num)\n```\nTo read multiple values on a line, use `split()`.",
        problemStatement: "Read two integers on the same line separated by a space and print their sum.",
        inputExample: "15 25",
        outputExample: "40",
        hints: [
          "Use input().split() to get parts",
          "Convert each part to int()",
        ],
        constraints: ["Can deal with any integer"],
        starterCode: "# TODO: Read two integers and print sum\n",
        solution: "a, b = map(int, input().split())\nprint(a + b)\n",
        testCases: [
          {
            input: "15 25",
            expectedOutput: "40",
            description: "standard sum",
          },
          {
            input: "-10 10",
            expectedOutput: "0",
            description: "negative values",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "python",
        order: 3,
      },
    ],
  },
  {
    id: "python-ch-02-control-flow",
    title: "Control Flow: Conditionals and Loops",
    description: "Guide program decisions with if-else logic and repeat commands via loops.",
    order: 2,
    exercises: [
      {
        id: "python-ex-02-01-ifelse",
        title: "If-Else Conditions",
        description: "Executing precise code blocks.",
        theory: "### Condition Checks\nUse `if`, `elif`, and `else` to perform conditional operations.\n\n### Syntax\n```python\nif condition:\n    # Code here\nelif another_condition:\n    # Alternative\nelse:\n    # Fallback\n```\nIndentation is required in Python.",
        problemStatement: "Read an integer determining temperature. If it is < 10, print 'Cold'. Between 10 and 30 inclusive, print 'Moderate'. > 30, print 'Hot'.",
        inputExample: "25",
        outputExample: "Moderate",
        hints: [
          "Use elif for intermediate ranges",
          "Remember to cast input() to int()",
        ],
        constraints: ["Valid integer provided"],
        starterCode: "temp = int(input())\n# TODO: Process temperature\n",
        solution: "temp = int(input())\nif temp < 10:\n    print('Cold')\nelif temp <= 30:\n    print('Moderate')\nelse:\n    print('Hot')\n",
        testCases: [
          {
            input: "5",
            expectedOutput: "Cold",
            description: "cold tier",
          },
          {
            input: "25",
            expectedOutput: "Moderate",
            description: "moderate tier",
          },
          {
            input: "35",
            expectedOutput: "Hot",
            description: "hot tier",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "python",
        order: 1,
      },
      {
        id: "python-ex-02-02-forloop",
        title: "For Loops",
        description: "Classic iterative sequence handling.",
        theory: "### The For Loop\nLoops help repeat tasks. Python uses `for` with `range()` often.\n\n### Syntax\n```python\nfor i in range(1, 6):\n    print(i)\n```\nThis loops from 1 up to 5.",
        problemStatement: "Read an integer N. Print the multiplication table for N from 1 to 10 on separate lines. Format: 'N * I = Result'",
        inputExample: "5",
        outputExample: "5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50",
        hints: [
          "Use a for loop with range(1, 11)",
          "Use f-strings for formatting: f'{N} * {i} = {N * i}'",
        ],
        constraints: ["1 <= N <= 100"],
        starterCode: "n = int(input())\n# TODO: Table logic\n",
        solution: "n = int(input())\nfor i in range(1, 11):\n    print(f'{n} * {i} = {n * i}')\n",
        testCases: [
          {
            input: "5",
            expectedOutput: "5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50",
            description: "table of 5",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "python",
        order: 2,
      },
      {
        id: "python-ex-02-03-whileloop",
        title: "While Loops and Break",
        description: "Controlling loops effectively when bounds are indefinite.",
        theory: "### While Statement\nA `while` loop checks the condition before each execution layer.\n```python\nx = 10\nwhile x > 0:\n    print(x)\n    x -= 1\n```\n`break` immediately terminates a loop.",
        problemStatement: "Read integers separated by space continuously until you encounter a 0. Output the sum of all entered non-zero numbers.",
        inputExample: "4 5 10 -2 0",
        outputExample: "17",
        hints: [
          "Read the entire line and split it",
          "Iterate over the items, cast to int",
          "Break if the item is 0",
        ],
        constraints: ["Values are on a single line space separated"],
        starterCode: "values = input().split()\n# TODO: Read inputs dynamically\n",
        solution: "values = input().split()\ntotal = 0\nfor v in values:\n    val = int(v)\n    if val == 0:\n        break\n    total += val\nprint(total)\n",
        testCases: [
          {
            input: "4 5 10 -2 0",
            expectedOutput: "17",
            description: "mixed values ending in 0",
          },
          {
            input: "0",
            expectedOutput: "0",
            description: "immediate stop",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "python",
        order: 3,
      },
    ],
  },
  {
    id: "python-ch-03-functions",
    title: "Functions & Data Structures",
    description: "Modularize code and handle complex datasets.",
    order: 3,
    exercises: [
      {
        id: "python-ex-03-01-functions",
        title: "Defining Functions",
        description: "Extract logic into distinct reusable functions.",
        theory: "### Functions Syntax\nUse `def` to define functions in Python.\n```python\ndef my_func(a, b):\n    return a + b\n```\nCall it simply by `my_func(1, 2)`.",
        problemStatement: "Create a function `multiply(a, b)` that returns their multiplication result. Read two space-separated integers, pass them into `multiply`, and print the result.",
        inputExample: "12 10",
        outputExample: "120",
        hints: [
          "Use def multiply(a, b):",
          "Read inputs using split() and map",
        ],
        constraints: ["Must use the explicit multiply method definition"],
        starterCode: "# TODO: Create multiply method\n\n# TODO: Obtain input and call method\n",
        solution: "def multiply(a, b):\n    return a * b\n\na, b = map(int, input().split())\nprint(multiply(a, b))\n",
        testCases: [
          {
            input: "12 10",
            expectedOutput: "120",
            description: "basic mul",
          },
          {
            input: "-5 6",
            expectedOutput: "-30",
            description: "neg check",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "python",
        order: 1,
      },
      {
        id: "python-ex-03-02-lists",
        title: "Lists and Operations",
        description: "Work with Python Lists.",
        theory: "### Lists\nLists are ordered, mutable collections.\n```python\narr = [1, 2, 3]\narr.append(4)\nprint(len(arr)) # Prints 4\n```",
        problemStatement: "Read an integer N, followed by N space-separated integers on the next line. Store them in a list. Print the minimum and maximum values in the format 'Max: {val} Min: {val}'.",
        inputExample: "5\n40 10 -5 100 20",
        outputExample: "Max: 100 Min: -5",
        hints: [
          "Use the built-in max() and min() functions on the list",
          "Use an f-string to format the output",
        ],
        constraints: ["Follow mapping syntax exactly."],
        starterCode: "n = int(input())\n# TODO: Create list and print max and min\n",
        solution: "n = int(input())\narr = list(map(int, input().split()))\nprint(f'Max: {max(arr)} Min: {min(arr)}')\n",
        testCases: [
          {
            input: "5\n40 10 -5 100 20",
            expectedOutput: "Max: 100 Min: -5",
            description: "random variants",
          },
        ],
        xpReward: 60,
        difficulty: "medium",
        language: "python",
        order: 2,
      },
      {
        id: "python-ex-03-03-dictionaries",
        title: "Dictionaries",
        description: "Store key-value pairs efficiently.",
        theory: "### Dictionaries\nDictionaries hold key-value associations.\n```python\nstudent = {'name': 'Alice', 'age': 20}\nprint(student['name'])\n```",
        problemStatement: "Read an integer N. Then read N lines, each containing a name and a score separated by space. Store them in a dictionary. Finally, read one more name and print their score. If not found, print 'Not Found'.",
        inputExample: "3\nAlice 90\nBob 85\nCharlie 95\nBob",
        outputExample: "85",
        hints: [
          "Create an empty dict: d = {}",
          "Loop N times to populate it",
          "Use the 'in' keyword to check if a key exists",
        ],
        constraints: ["Must handle absent keys gracefully"],
        starterCode: "n = int(input())\n# TODO: Logic here\n",
        solution: "n = int(input())\nscores = {}\nfor _ in range(n):\n    name, score = input().split()\n    scores[name] = score\nquery = input()\nif query in scores:\n    print(scores[query])\nelse:\n    print('Not Found')\n",
        testCases: [
          {
            input: "3\nAlice 90\nBob 85\nCharlie 95\nBob",
            expectedOutput: "85",
            description: "Found case",
          },
          {
            input: "2\nDave 10\nEve 20\nFrank",
            expectedOutput: "Not Found",
            description: "Not Found case",
          },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "python",
        order: 3,
      },
    ],
  },
];

export async function seedPythonCourse() {
  console.log("Seeding Python Course...");

  await prisma.course.upsert({
    where: { id: PYTHON_COURSE.id },
    update: PYTHON_COURSE,
    create: PYTHON_COURSE,
  });

  for (const chapter of pythonChapters) {
    const createdChapter = await prisma.chapter.upsert({
      where: { id: chapter.id },
      update: {
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        courseId: PYTHON_COURSE.id,
      },
      create: {
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        courseId: PYTHON_COURSE.id,
      },
    });

    for (const ex of chapter.exercises) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        update: {
          title: ex.title,
          description: ex.description,
          theory: ex.theory,
          problemStatement: ex.problemStatement,
          inputExample: ex.inputExample,
          outputExample: ex.outputExample,
          hints: ex.hints,
          constraints: ex.constraints,
          starterCode: ex.starterCode,
          solution: ex.solution,
          testCases: JSON.stringify(ex.testCases),
          xpReward: ex.xpReward,
          difficulty: ex.difficulty,
          language: ex.language,
          order: ex.order,
          chapterId: createdChapter.id,
          courseId: PYTHON_COURSE.id,
        },
        create: {
          id: ex.id,
          title: ex.title,
          description: ex.description,
          theory: ex.theory,
          problemStatement: ex.problemStatement,
          inputExample: ex.inputExample,
          outputExample: ex.outputExample,
          hints: ex.hints,
          constraints: ex.constraints,
          starterCode: ex.starterCode,
          solution: ex.solution,
          testCases: JSON.stringify(ex.testCases),
          xpReward: ex.xpReward,
          difficulty: ex.difficulty,
          language: ex.language,
          order: ex.order,
          chapterId: createdChapter.id,
          courseId: PYTHON_COURSE.id,
        },
      });
    }
  }

  console.log("Python Course completed processing.");
}
