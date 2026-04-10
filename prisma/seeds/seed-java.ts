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
  language: "cpp" | "html" | "css" | "javascript" | "java";
  order: number;
};

type SeedChapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: SeedExercise[];
};

export const JAVA_COURSE_ID = "java-programming-fundamentals";

const JAVA_COURSE = {
  id: JAVA_COURSE_ID,
  title: "Java Programming: Fundamentals to Advanced",
  shortDescription:
    "Master Java starting from basics, object-oriented concepts, and arrays. Perfect for students and aspiring software engineers.",
  description:
    "Learn Java progressively: from syntax basics and data types through control flow, methods, arrays, and standard libraries. Built with a structured curriculum mimicking established computer science courses like GeeksForGeeks, each chapter includes comprehensive theory, practical constraints, and multiple test cases to cement your knowledge.",
  category: "Programming",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 60,
  enrolledCount: 0,
  rating: 4.9,
  tags: [
    "Java",
    "Programming",
    "Fundamentals",
    "OOP",
    "Beginner-Friendly",
  ],
};

const javaChapters: SeedChapter[] = [
  {
    id: "java-ch-01-basics",
    title: "Java Basics: Structure & Data Types",
    description:
      "Learn Java syntax, file structures, variables, and how to perform basic Input/Output operations.",
    order: 1,
    exercises: [
      {
        id: "java-ex-01-01-hello",
        title: "Hello World",
        description: "Your first Java program printing to the console.",
        theory:
          '### Java Program Structure\nEvery Java program consists of classes and methods. `public class Main` matches the file name.\n\n### Key Points\n- Execution starts at `public static void main(String[] args)`\n- `System.out.println()` prints text followed by a new line\n- Code must be properly enclosed in `{` and `}`\n\n### Example\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n```',
        problemStatement:
          "Write a Java program that prints exactly 'Welcome to Java!' to the console.",
        inputExample: "",
        outputExample: "Welcome to Java!",
        hints: [
          "Ensure your class is named Main",
          "Include the main method",
          "Use System.out.println()",
        ],
        constraints: ["Case-sensitive output"],
        starterCode:
          "public class Main {\n    public static void main(String[] args) {\n        // TODO: Print the welcome message\n    }\n}\n",
        solution:
          'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Welcome to Java!");\n    }\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "Welcome to Java!",
            description: "basic output",
          },
        ],
        xpReward: 30,
        difficulty: "easy",
        language: "java",
        order: 1,
      },
      {
        id: "java-ex-01-02-variables",
        title: "Variables and Data Types",
        description: "Understand assigning variables and primitive types.",
        theory:
          '### Variables in Java\nJava is strictly typed. You must declare the type of a variable before assigning it.\n\n### Core Types\n- `int` - integers\n- `double` - decimals\n- `char` - single character\n- `boolean` - true/false\n\n### Example\n```java\nint age = 22;\ndouble salary = 1200.50;\nSystem.out.println(age + " - " + salary);\n```',
        problemStatement:
          "Declare an integer `score` with value 100 and a double `gpa` with 3.8. Print them separated by a space.",
        inputExample: "",
        outputExample: "100 3.8",
        hints: [
          "Declare int score = 100;",
          "Declare double gpa = 3.8;",
          "Use String concatenation (+) or System.out.print()",
        ],
        constraints: ["Must print variables accurately"],
        starterCode:
          "public class Main {\n    public static void main(String[] args) {\n        // TODO: Declare variables and print them\n    }\n}\n",
        solution:
          'public class Main {\n    public static void main(String[] args) {\n        int score = 100;\n        double gpa = 3.8;\n        System.out.println(score + " " + gpa);\n    }\n}\n',
        testCases: [
          {
            input: "",
            expectedOutput: "100 3.8",
            description: "check printed assignment",
          },
        ],
        xpReward: 40,
        difficulty: "easy",
        language: "java",
        order: 2,
      },
      {
        id: "java-ex-01-03-scanner",
        title: "Reading User Input",
        description: "Accept input using the Scanner utility class.",
        theory:
          '### Scanner Class\nTo read inputs from the user, Java provides `java.util.Scanner`.\n\n### Usage\n```java\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int num = sc.nextInt();\n        System.out.println("You entered: " + num);\n    }\n}\n```',
        problemStatement:
          "Read two integers from standard input and print their sum.",
        inputExample: "15 25",
        outputExample: "40",
        hints: [
          "Import java.util.Scanner at the top",
          "Initialize Scanner: new Scanner(System.in)",
          "Read two values using nextInt()",
          "Print their aggregate sum",
        ],
        constraints: ["Can deal with any safe 32-bit integer"],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Read two integers and print sum\n    }\n}\n",
        solution:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}\n",
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
          {
            input: "100 200",
            expectedOutput: "300",
            description: "large numbers",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "java",
        order: 3,
      },
    ],
  },
  {
    id: "java-ch-02-control-flow",
    title: "Control Flow: Conditionals and Loops",
    description:
      "Guide program decisions with if-else logic and repeat commands via loops.",
    order: 2,
    exercises: [
      {
        id: "java-ex-02-01-ifelse",
        title: "If-Else Conditions",
        description: "Executing precise code blocks.",
        theory:
          '### Condition Checks\nUse `if` and `else` to perform conditional operations.\n\n### Syntax\n```java\nif (condition) {\n    // Code here\n} else {\n    // Alternative\n}\n```',
        problemStatement:
          "Read an integer determining temperature. If it is < 10, print 'Cold'. Between 10 and 30 inclusive, print 'Moderate'. > 30, print 'Hot'.",
        inputExample: "25",
        outputExample: "Moderate",
        hints: [
          "Use else if for intermediate ranges",
          "Take care of inclusivity for 10 and 30",
        ],
        constraints: ["Valid integer provided"],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Process temperature\n    }\n}\n",
        solution:
          'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int temp = sc.nextInt();\n        if (temp < 10) {\n            System.out.println("Cold");\n        } else if (temp <= 30) {\n            System.out.println("Moderate");\n        } else {\n            System.out.println("Hot");\n        }\n    }\n}\n',
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
        language: "java",
        order: 1,
      },
      {
        id: "java-ex-02-02-forloop",
        title: "For Loops",
        description: "Classic iterative sequence handling.",
        theory:
          '### The For Loop\nLoops help repeat tasks without duplicating code logic.\n\n### Syntax\n```java\nfor (int i = 0; i < N; i++) {\n    // Runs N times\n}\n```',
        problemStatement:
          "Read an integer N. Print the multiplication table for N from 1 to 10 on separate lines. Format: 'N * I = Result'",
        inputExample: "5",
        outputExample: "5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50",
        hints: [
          "Use a for loop running from 1 to 10",
          "Combine strings or use printf()",
        ],
        constraints: ["1 <= N <= 100"],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Table logic\n    }\n}\n",
        solution:
          'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= 10; i++) {\n            System.out.println(n + " * " + i + " = " + (n * i));\n        }\n    }\n}\n',
        testCases: [
          {
            input: "5",
            expectedOutput: "5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50",
            description: "table of 5",
          },
          {
            input: "2",
            expectedOutput: "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18\n2 * 10 = 20",
            description: "table of 2",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "java",
        order: 2,
      },
      {
        id: "java-ex-02-03-whileloop",
        title: "While Loops and Break",
        description: "Controlling loops effectively when bounds are indefinite.",
        theory:
          '### While Statement\nA `while` loop checks the condition before each execution layer.\n```java\nint x = 10;\nwhile (x > 0) {\n   System.out.print(x + " ");\n   x--;\n}\n```\n`break` immediately terminates a loop structure.',
        problemStatement:
          "Read integers continuously from input until you read a 0. Output the sum of all entered non-zero numbers.",
        inputExample: "4 5 10 -2 0",
        outputExample: "17",
        hints: [
          "Use a `while (true)` structure or while condition checking the next int",
          "Read inside the loop and if it is 0, break",
          "Keep an accumulative sum",
        ],
        constraints: ["Can handle negations, stopping at exact 0"],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Read inputs dynamically\n    }\n}\n",
        solution:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int sum = 0;\n        while (sc.hasNextInt()) {\n            int val = sc.nextInt();\n            if (val == 0) break;\n            sum += val;\n        }\n        System.out.println(sum);\n    }\n}\n",
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
          {
            input: "100 200 300 0",
            expectedOutput: "600",
            description: "multiple larger numbers",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "java",
        order: 3,
      },
    ],
  },
  {
    id: "java-ch-03-methods",
    title: "Methods & Overloading",
    description:
      "Modularize code using methods, passing parameters securely.",
    order: 3,
    exercises: [
      {
        id: "java-ex-03-01-basic-method",
        title: "Defining Static Methods",
        description: "Extract logic into distinct reusable functions.",
        theory:
          '### Methods Syntax\nPlace methods inside your `class`.\n```java\npublic static returnType methodName(parameters) {\n    return ...;\n}\n```\nTo call, use `methodName(args)`.',
        problemStatement:
          "Create a static method `multiply(int a, int b)` that returns their multiplication result. Then inside `main()`, read two integers separated by space, pass them into `multiply`, and print the result.",
        inputExample: "12 10",
        outputExample: "120",
        hints: [
          "Declare your multiply method next to the main method",
          "It must return an int",
        ],
        constraints: ["Must use the explicit multiply method definition"],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    // TODO: Create multiply method\n\n    public static void main(String[] args) {\n        // TODO: Obtain input and call method\n    }\n}\n",
        solution:
          "import java.util.Scanner;\n\npublic class Main {\n    public static int multiply(int a, int b) {\n        return a * b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(multiply(a, b));\n    }\n}\n",
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
        language: "java",
        order: 1,
      },
      {
        id: "java-ex-03-02-overloading",
        title: "Method Overloading",
        description: "Write multiple methods spanning the same logical name.",
        theory:
          '### Overloading\nJava allows you to declare multiple methods with the exact same name as long as their parameters differ in type, number, or arrangement.\n\n### Example\n```java\npublic static int add(int a, int b) { ... }\npublic static double add(double a, double b) { ... }\n```',
        problemStatement:
          "Write a `getMax(int a, int b)` method and an overloaded `getMax(double a, double b)` method. Read two integers and a double, print their responses in sequence: First `getMax(int, int)`. Then read two doubles, print `getMax(double, double)`.",
        inputExample: "5 10\n4.5 9.2",
        outputExample: "10\n9.2",
        hints: [
          "Utilize separate nextInt() calls for ints and nextDouble() for doubles.",
          "Overload identically named functions.",
        ],
        constraints: ["Proper signature bindings must match types provided"],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    // TODO: Create overloaded getMax methods\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Read integers, print match.\n        // TODO: Read doubles, print match.\n    }\n}\n",
        solution:
          "import java.util.Scanner;\n\npublic class Main {\n    public static int getMax(int a, int b) {\n        return a > b ? a : b;\n    }\n    public static double getMax(double a, double b) {\n        return a > b ? a : b;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int i1 = sc.nextInt();\n        int i2 = sc.nextInt();\n        System.out.println(getMax(i1, i2));\n        double d1 = sc.nextDouble();\n        double d2 = sc.nextDouble();\n        System.out.println(getMax(d1, d2));\n    }\n}\n",
        testCases: [
          {
            input: "5 10\n4.5 9.2",
            expectedOutput: "10\n9.2",
            description: "standard inputs",
          },
          {
            input: "100 50\n-1.2 -4.3",
            expectedOutput: "100\n-1.2",
            description: "various thresholds",
          },
        ],
        xpReward: 60,
        difficulty: "medium",
        language: "java",
        order: 2,
      },
      {
        id: "java-ex-03-03-recursion",
        title: "Recursive Operations",
        description: "Dive into elegant mathematical recurrences.",
        theory:
          '### Recursion Process\nA method invoking itself.\nEnsuring a foundational **Base Case** is imperative to preventing Infinite loops.\n```java\nint mathSeq(int x) {\n    if (x == 1) return 1;\n    return x + mathSeq(x-1);\n}\n```',
        problemStatement:
          "Using a recursive `fibonacci(int n)` method, find the N-th Fibonacci number. Assume fib(0)=0 and fib(1)=1. Read `N`, output `fib(N)`.",
        inputExample: "6",
        outputExample: "8",
        hints: [
          "Base cases: n <= 0 -> 0; n == 1 -> 1",
          "Returns fibonacci(n-1) + fibonacci(n-2)",
        ],
        constraints: ["Recursion tree limit N < 35 for execution speed"],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    // TODO: factorial method recursion\n\n    public static void main(String[] args) {\n        // Read value, print fib\n    }\n}\n",
        solution:
          "import java.util.Scanner;\n\npublic class Main {\n    public static int fibonacci(int n) {\n        if (n <= 0) return 0;\n        if (n == 1) return 1;\n        return fibonacci(n - 1) + fibonacci(n - 2);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int num = sc.nextInt();\n        System.out.println(fibonacci(num));\n    }\n}\n",
        testCases: [
          {
            input: "6",
            expectedOutput: "8",
            description: "6th number",
          },
          {
            input: "10",
            expectedOutput: "55",
            description: "10th number",
          },
          {
            input: "0",
            expectedOutput: "0",
            description: "Zero handle",
          },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "java",
        order: 3,
      },
    ],
  },
  {
    id: "java-ch-04-arrays",
    title: "Arrays & Strings",
    description:
      "Handle robust, clustered datatypes referencing collections and string sequences.",
    order: 4,
    exercises: [
      {
        id: "java-ex-04-01-array-basics",
        title: "Array Declaration",
        description: "Initiating sequences.",
        theory:
          '### Array Context\nArrays group fixed numbers of identical types.\n```java\nint[] arr = new int[5];  // Five integer zeros\nint[] pre = {1, 2, 3};   // Fast initialization\nSystem.out.println(pre[0]);  // Access first elem\n```',
        problemStatement:
          "Read N, the quantity of items. Then read N integers into an array. Finally, print the items strictly space-separated.",
        inputExample: "3\n15 25 35",
        outputExample: "15 25 35",
        hints: [
          "Instantiate memory: new int[N]",
          "Iterate 0 to N-1 for scanning",
          "Ensure no lagging line-break formats except spaces within",
        ],
        constraints: ["Outputs single line correctly spaced."],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO:\n    }\n}\n",
        solution:
          'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n        }\n        for (int i = 0; i < n; i++) {\n            System.out.print(arr[i]);\n            if (i < n - 1) System.out.print(" ");\n        }\n    }\n}\n',
        testCases: [
          {
            input: "3\n15 25 35",
            expectedOutput: "15 25 35",
            description: "Standard input output",
          },
          {
            input: "5\n100 200 300 400 500",
            expectedOutput: "100 200 300 400 500",
            description: "length 5",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "java",
        order: 1,
      },
      {
        id: "java-ex-04-02-string-methods",
        title: "String Operations",
        description: "Utilize String reference attributes.",
        theory:
          '### Strings Context\nJava Strings possess multiple built-in utilities.\n`str.length()` identifies character quantity.\n`str.charAt(0)` gives the first item.',
        problemStatement:
          "Read a string word from standard input. Output the number of characters in the word, and what the character at the 2nd index point (Index 1) is. Output separated by a space.",
        inputExample: "Elephant",
        outputExample: "8 l",
        hints: [
          "sc.next() brings in words.",
          "Call length() and charAt(1) securely.",
        ],
        constraints: ["Must read correctly and invoke explicit substring methods."],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO:\n    }\n}\n",
        solution:
          'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String text = sc.next();\n        System.out.println(text.length() + " " + text.charAt(1));\n    }\n}\n',
        testCases: [
          {
            input: "Elephant",
            expectedOutput: "8 l",
            description: "standard parsing",
          },
          {
            input: "Java",
            expectedOutput: "4 a",
            description: "short sequence",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "java",
        order: 2,
      },
      {
        id: "java-ex-04-03-array-max",
        title: "Max and Min values in an Array",
        description: "Algorithmically traversing sequences searching for limits.",
        theory:
          '### Seeking limits\nWhen analyzing arrays, establish the base comparative value securely—often anchoring strictly to `arr[0]` is best.\n```java\nint max = arr[0];\nfor (int v : arr) {\n  if (v > max) max = v;\n}\n```',
        problemStatement:
          "Read an integer length N, followed by an N-item array. Print Maximum and Minimum numbers mapped as `Max: {val} Min: {val}`",
        inputExample: "5\n40 10 -5 100 20",
        outputExample: "Max: 100 Min: -5",
        hints: [
          "Initiate array filling logic securely.",
          "Identify running maximum correctly and initialize as the first array member.",
        ],
        constraints: ["Follow mapping syntax exactly."],
        starterCode:
          "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO:\n    }\n}\n",
        solution:
          'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int max = Integer.MIN_VALUE, min = Integer.MAX_VALUE;\n        for (int i = 0; i < n; i++) {\n            int val = sc.nextInt();\n            if (val > max) max = val;\n            if (val < min) min = val;\n        }\n        System.out.println("Max: " + max + " Min: " + min);\n    }\n}\n',
        testCases: [
          {
            input: "5\n40 10 -5 100 20",
            expectedOutput: "Max: 100 Min: -5",
            description: "random variants",
          },
          {
            input: "3\n1 2 3",
            expectedOutput: "Max: 3 Min: 1",
            description: "rising values",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "java",
        order: 3,
      },
    ],
  },
];

export async function seedJavaCourse() {
  console.log("Seeding Java Course...");

  await prisma.course.upsert({
    where: { id: JAVA_COURSE.id },
    update: JAVA_COURSE,
    create: JAVA_COURSE,
  });

  for (const chapter of javaChapters) {
    const createdChapter = await prisma.chapter.upsert({
      where: { id: chapter.id },
      update: {
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        courseId: JAVA_COURSE.id,
      },
      create: {
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        courseId: JAVA_COURSE.id,
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
          courseId: JAVA_COURSE.id,
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
          courseId: JAVA_COURSE.id,
        },
      });
    }
  }

  console.log("Java Course completed processing.");
}
