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
  language: "c";
  order: number;
};

type SeedChapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: SeedExercise[];
};

const C_COURSE = {
  id: "c-programming-fundamentals",
  title: "C Programming: From Basics to Systems",
  shortDescription:
    "Master C from first principles — syntax, control flow, functions, arrays, pointers, memory, structs, and file I/O.",
  description:
    "Learn C the way it is used in the real world: one concept at a time, with runnable exercises. Start with program structure, variables, and formatted I/O, then move through operators, conditions, loops, and functions. Build a solid mental model of arrays, strings, pointers, and dynamic memory with malloc/free, then organize data with structs, enums, and typedef, and finally read and write files and use the preprocessor. Every exercise includes theory, starter code, hints, a reference solution, and multiple test cases, and runs in an isolated Docker container using GCC.",
  category: "Programming",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 60,
  enrolledCount: 0,
  rating: 4.8,
  tags: [
    "C",
    "Programming",
    "Fundamentals",
    "Pointers",
    "Memory Management",
    "Beginner-Friendly",
  ],
};

const cChapters: SeedChapter[] = [
  {
    id: "c-ch-01-basics-I",
    title: "C Basics I: Structure, Variables & Data Types",
    description:
      "Understand how a C program is structured, declare variables, use primitive data types, and print or read values.",
    order: 1,
    exercises: [
      {
        id: "c-ex-01-01-hello-world",
        title: "Hello World & Program Structure",
        description: "Write your first C program and print text to the console.",
        theory: `### Anatomy of a C Program
Every C program is built from functions. Execution always begins in \`main\`.

### Key Points
- \`#include <stdio.h>\` gives access to \`printf\` and \`scanf\`
- \`int main(void)\` is the entry point and returns an \`int\` status code
- Statements end with a semicolon \`;\`
- \`printf\` writes formatted text to standard output
- \`return 0;\` tells the operating system the program succeeded

### Example
#include <stdio.h>

int main(void) {
    printf("Hello, World!");
    return 0;
}

### Output
Hello, World!

### Compilation
C is a compiled language. GCC turns source into a binary in two conceptual steps: compile to object code, then link the standard library. In this platform \`gcc -O2 -o main main.c\` does both for you.`,
        problemStatement:
          "Write a C program that prints exactly: Welcome to C Programming",
        inputExample: "",
        outputExample: "Welcome to C Programming",
        hints: [
          "Start with #include <stdio.h>",
          "Define int main(void)",
          "Use printf with the exact text",
          "End with return 0;",
        ],
        constraints: ["No input", "Output must match exactly", "Use printf"],
        starterCode: `#include <stdio.h>

int main(void) {
    /* TODO: print the welcome message */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    printf("Welcome to C Programming");
    return 0;
}
`,
        testCases: [
          {
            input: "",
            expectedOutput: "Welcome to C Programming",
            description: "basic output",
          },
          {
            input: "",
            expectedOutput: "Welcome to C Programming",
            description: "no input required",
          },
          {
            input: "",
            expectedOutput: "Welcome to C Programming",
            description: "exact text",
          },
        ],
        xpReward: 30,
        difficulty: "easy",
        language: "c",
        order: 1,
      },
      {
        id: "c-ex-01-02-variables",
        title: "Variables & Primitive Data Types",
        description: "Declare int, float, and char variables and print them.",
        theory: `### Variables
A variable is a named region of memory. Declaration syntax:
data_type name = value;

### Primitive Types in C
- \`int\` — whole numbers, usually 4 bytes
- \`float\` — single-precision decimal, usually 4 bytes
- \`double\` — double-precision decimal, usually 8 bytes
- \`char\` — one character / small integer, 1 byte
- \`void\` — "no type", used for functions that return nothing

### Format Specifiers
- \`%d\` for int
- \`%f\` for float (use \`%.2f\` for two decimals)
- \`%c\` for char
- \`%lf\` for double in scanf

### Example
int age = 25;
float height = 5.9f;
char grade = 'A';
printf("%d %.1f %c", age, height, grade);`,
        problemStatement:
          "Declare an int x = 42, a float y = 3.14, and a char c = 'A'. Print them separated by single spaces using the formats %d, %.2f, and %c.",
        inputExample: "",
        outputExample: "42 3.14 A",
        hints: [
          "Use int x = 42;",
          "Use float y = 3.14f;",
          "Use char c = 'A';",
          "printf(\"%d %.2f %c\", x, y, c);",
        ],
        constraints: ["No input", "Use exactly the requested types"],
        starterCode: `#include <stdio.h>

int main(void) {
    /* TODO: declare x, y, c and print them */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int x = 42;
    float y = 3.14f;
    char c = 'A';

    printf("%d %.2f %c", x, y, c);
    return 0;
}
`,
        testCases: [
          {
            input: "",
            expectedOutput: "42 3.14 A",
            description: "all three types",
          },
          {
            input: "",
            expectedOutput: "42 3.14 A",
            description: "float formatting",
          },
          {
            input: "",
            expectedOutput: "42 3.14 A",
            description: "char output",
          },
        ],
        xpReward: 40,
        difficulty: "easy",
        language: "c",
        order: 2,
      },
      {
        id: "c-ex-01-03-read-integer",
        title: "Reading Input with scanf",
        description: "Read an integer from standard input and print it back.",
        theory: `### Reading Input
\`scanf\` reads formatted data. You pass the address of the variable so the function can write into it.

### Syntax
int n;
scanf("%d", &n);

"The & operator takes the address of n."

### Common Mistake
Writing \`scanf("%d", n)\` instead of \`scanf("%d", &n)\` passes a value, not an address, and crashes or corrupts memory.

### Reading Multiple Values
int a, b;
scanf("%d %d", &a, &b);`,
        problemStatement:
          "Read one integer from standard input and print it in the format: Number is: <value>",
        inputExample: "100",
        outputExample: "Number is: 100",
        hints: [
          "Declare an int variable",
          "scanf(\"%d\", &n) reads it",
          "printf(\"Number is: %d\", n);",
        ],
        constraints: ["Input is always a valid integer"],
        starterCode: `#include <stdio.h>

int main(void) {
    /* TODO: read an integer and print it */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    printf("Number is: %d", n);
    return 0;
}
`,
        testCases: [
          {
            input: "100",
            expectedOutput: "Number is: 100",
            description: "positive integer",
          },
          {
            input: "42",
            expectedOutput: "Number is: 42",
            description: "different value",
          },
          {
            input: "-5",
            expectedOutput: "Number is: -5",
            description: "negative integer",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "c",
        order: 3,
      },
      {
        id: "c-ex-01-04-ascii-value",
        title: "Characters, ASCII & sizeof",
        description: "Read a character and print its ASCII code.",
        theory: `### Characters Are Small Integers
In C a \`char\` holds a one-byte integer: the ASCII code of the character. 'A' is 65, 'a' is 97, '0' is 48.

### Printing the Code
char ch = 'A';
printf("%d", ch);   /* prints 65 */
printf("%c", ch);   /* prints A */

### sizeof
The \`sizeof\` operator reports how many bytes a type or value occupies:
- sizeof(char) is 1
- sizeof(int) is typically 4
- sizeof(double) is typically 8

### Reading a Single Character
Use a leading space in \`" %c"\` to skip leftover whitespace/newlines from earlier input:
scanf(" %c", &ch);`,
        problemStatement:
          "Read one character from standard input and print its integer ASCII code.",
        inputExample: "A",
        outputExample: "65",
        hints: [
          "Declare char ch;",
          "Use scanf(\" %c\", &ch) to skip whitespace",
          "Print with %d, not %c",
        ],
        constraints: ["Input is a single printable character"],
        starterCode: `#include <stdio.h>

int main(void) {
    /* TODO: read a character and print its ASCII value */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    char ch;
    scanf(" %c", &ch);
    printf("%d", ch);
    return 0;
}
`,
        testCases: [
          { input: "A", expectedOutput: "65", description: "uppercase A" },
          { input: "a", expectedOutput: "97", description: "lowercase a" },
          { input: "Z", expectedOutput: "90", description: "uppercase Z" },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "c",
        order: 4,
      },
    ],
  },
  {
    id: "c-ch-02-operators-io",
    title: "C Basics II: Operators & Formatted I/O",
    description:
      "Use arithmetic, assignment, and modulus operators, swap values, and format floating-point output.",
    order: 2,
    exercises: [
      {
        id: "c-ex-02-01-arithmetic",
        title: "Arithmetic & Modulus",
        description: "Perform the five core arithmetic operations on two integers.",
        theory: `### Arithmetic Operators
- \`+\` addition
- \`-\` subtraction
- \`*\` multiplication
- \`/\` division
- \`%\` modulus (remainder)

### Integer Division
If both operands are integers, division truncates:
7 / 2 == 3
7 % 2 == 1

To get a decimal result, at least one operand must be floating point: 7 / 2.0 == 3.5.

### Precedence
\`* / %\` bind tighter than \`+ -\`. Use parentheses when in doubt.`,
        problemStatement:
          "Read two integers a and b. Print their sum, difference, product, integer quotient, and remainder — each on its own line, in that order.",
        inputExample: "10 3",
        outputExample: "13\n7\n30\n3\n1",
        hints: [
          "Read two ints with scanf(\"%d %d\", &a, &b);",
          "Use a + b, a - b, a * b, a / b, a % b",
          "Print each result followed by \\n",
        ],
        constraints: [
          "1 <= a, b <= 1000",
          "b is never zero",
          "Use integer division",
        ],
        starterCode: `#include <stdio.h>

int main(void) {
    int a, b;
    /* TODO: read a and b, then print the five results */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);

    printf("%d\\n", a + b);
    printf("%d\\n", a - b);
    printf("%d\\n", a * b);
    printf("%d\\n", a / b);
    printf("%d\\n", a % b);
    return 0;
}
`,
        testCases: [
          {
            input: "10 3",
            expectedOutput: "13\n7\n30\n3\n1",
            description: "basic arithmetic",
          },
          {
            input: "7 2",
            expectedOutput: "9\n5\n14\n3\n1",
            description: "integer division truncates",
          },
          {
            input: "100 10",
            expectedOutput: "110\n90\n1000\n10\n0",
            description: "larger numbers, zero remainder",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 1,
      },
      {
        id: "c-ex-02-02-swap",
        title: "Swapping Two Values",
        description: "Swap two integers using a temporary variable.",
        theory: `### The Classic Swap
To swap two variables you need a third temporary variable, because assigning one destroys the other's original value.

### Algorithm
int temp = a;
a = b;
b = temp;

### Why Not a = b; b = a; ?
After \`a = b\`, the original value of \`a\` is gone, so \`b = a\` just copies b onto itself.

### Alternative
Arithmetic swap without a temp works for small integers but can overflow: a = a + b; b = a - b; a = a - b; Prefer the temporary.`,
        problemStatement:
          "Read two integers a and b, swap their values, and print the swapped values separated by a space.",
        inputExample: "5 9",
        outputExample: "9 5",
        hints: [
          "Read both integers",
          "Use a temporary variable to hold one value",
          "Assign in the right order",
          "Print a then b after swapping",
        ],
        constraints: ["-1000 <= a, b <= 1000"],
        starterCode: `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);

    /* TODO: swap a and b */

    printf("%d %d", a, b);
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);

    int temp = a;
    a = b;
    b = temp;

    printf("%d %d", a, b);
    return 0;
}
`,
        testCases: [
          {
            input: "5 9",
            expectedOutput: "9 5",
            description: "swap positive values",
          },
          {
            input: "1 2",
            expectedOutput: "2 1",
            description: "consecutive values",
          },
          {
            input: "100 250",
            expectedOutput: "250 100",
            description: "larger values",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "c",
        order: 2,
      },
      {
        id: "c-ex-02-03-even-odd",
        title: "Even or Odd with Modulus",
        description: "Use the remainder operator to classify a number.",
        theory: `### Modulus for Parity
A number is even when dividing by 2 leaves no remainder:
n % 2 == 0

It is odd when:
n % 2 != 0

### Negative Numbers
In C, \`-3 % 2\` is \`-1\`, which is still non-zero, so the test works for negatives too.

### Conditional Expression
You can print directly with the ternary operator:
printf("%s", (n % 2 == 0) ? "Even" : "Odd");`,
        problemStatement:
          "Read an integer n and print Even if it is divisible by 2, otherwise print Odd.",
        inputExample: "4",
        outputExample: "Even",
        hints: [
          "Read n",
          "Check n % 2 == 0",
          "Print Even or Odd",
        ],
        constraints: ["-1000000 <= n <= 1000000"],
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: print Even or Odd */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    if (n % 2 == 0) {
        printf("Even");
    } else {
        printf("Odd");
    }
    return 0;
}
`,
        testCases: [
          { input: "4", expectedOutput: "Even", description: "even number" },
          { input: "7", expectedOutput: "Odd", description: "odd number" },
          { input: "0", expectedOutput: "Even", description: "zero is even" },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "c",
        order: 3,
      },
      {
        id: "c-ex-02-04-average",
        title: "Average with Floating-Point Output",
        description: "Compute an average and format it to two decimals.",
        theory: `### Integer vs Floating-Point Division
If \`a\`, \`b\`, and \`c\` are ints, then \`(a + b + c) / 3\` uses integer division and loses the fraction. Divide by \`3.0\` to force floating-point arithmetic.

### Formatting
\`%.2f\` prints a float/double with exactly two digits after the decimal point, rounding as needed.

### Casting
You can also cast explicitly:
double avg = (double)(a + b + c) / 3.0;`,
        problemStatement:
          "Read three integers and print their average formatted with exactly two decimal places.",
        inputExample: "10 20 30",
        outputExample: "20.00",
        hints: [
          "Read three integers",
          "Divide by 3.0, not 3",
          "Use printf(\"%.2f\", average);",
        ],
        constraints: ["0 <= each value <= 1000"],
        starterCode: `#include <stdio.h>

int main(void) {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);

    /* TODO: compute and print the average */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);

    double average = (a + b + c) / 3.0;
    printf("%.2f", average);
    return 0;
}
`,
        testCases: [
          {
            input: "10 20 30",
            expectedOutput: "20.00",
            description: "exact average",
          },
          {
            input: "1 2 4",
            expectedOutput: "2.33",
            description: "rounding to two decimals",
          },
          {
            input: "5 5 5",
            expectedOutput: "5.00",
            description: "all equal",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 4,
      },
    ],
  },
  {
    id: "c-ch-03-control-flow",
    title: "Control Flow: Conditions, switch & Loops",
    description:
      "Drive program flow with if/else, multi-way switch statements, for loops, and while loops.",
    order: 3,
    exercises: [
      {
        id: "c-ex-03-01-if-else",
        title: "If-Else Decisions",
        description: "Use if and else to choose between two outcomes.",
        theory: `### If-Else Syntax
if (condition) {
    /* runs when condition is true */
} else {
    /* runs when condition is false */
}

### Truth in C
C has no boolean type in older standards. Zero is false; any non-zero value is true. Comparisons produce 1 or 0.

### Comparison Operators
- \`==\` equal (do not confuse with \`=\` assignment)
- \`!=\` not equal
- \`<\`, \`>\`, \`<=\`, \`>=\`

### Else-If Chains
if (score >= 90) { ... }
else if (score >= 80) { ... }
else { ... }`,
        problemStatement:
          "Read an integer age. Print Adult if age is 18 or more, otherwise print Minor.",
        inputExample: "20",
        outputExample: "Adult",
        hints: [
          "Read age",
          "Use if (age >= 18)",
          "Print Adult or Minor",
        ],
        constraints: ["0 <= age <= 150"],
        starterCode: `#include <stdio.h>

int main(void) {
    int age;
    scanf("%d", &age);

    /* TODO: classify as Adult or Minor */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int age;
    scanf("%d", &age);

    if (age >= 18) {
        printf("Adult");
    } else {
        printf("Minor");
    }
    return 0;
}
`,
        testCases: [
          { input: "20", expectedOutput: "Adult", description: "adult" },
          { input: "18", expectedOutput: "Adult", description: "boundary" },
          { input: "17", expectedOutput: "Minor", description: "minor" },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "c",
        order: 1,
      },
      {
        id: "c-ex-03-02-grade",
        title: "Grade Classification",
        description: "Use an else-if chain to map marks to a letter grade.",
        theory: `### Else-If Chains
Check the highest threshold first; each later branch only runs if all previous conditions failed.

if (marks >= 90)      printf("A");
else if (marks >= 80) printf("B");
else if (marks >= 70) printf("C");
else if (marks >= 60) printf("D");
else                  printf("F");

### Order Matters
If you checked \`marks >= 60\` first, every score above 60 would stop there. Always order from most restrictive to least.

### Ranges
\`marks >= 80 && marks < 90\` is unnecessary once earlier branches have returned/failed.`,
        problemStatement:
          "Read marks (0-100) and print the grade: 90 or above = A, 80-89 = B, 70-79 = C, 60-69 = D, below 60 = F.",
        inputExample: "85",
        outputExample: "B",
        hints: [
          "Use multiple else-if blocks",
          "Check >= 90 first, then >= 80, and so on",
          "Final else prints F",
        ],
        constraints: ["0 <= marks <= 100"],
        starterCode: `#include <stdio.h>

int main(void) {
    int marks;
    scanf("%d", &marks);

    /* TODO: print the letter grade */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int marks;
    scanf("%d", &marks);

    if (marks >= 90) {
        printf("A");
    } else if (marks >= 80) {
        printf("B");
    } else if (marks >= 70) {
        printf("C");
    } else if (marks >= 60) {
        printf("D");
    } else {
        printf("F");
    }
    return 0;
}
`,
        testCases: [
          { input: "95", expectedOutput: "A", description: "top grade" },
          { input: "85", expectedOutput: "B", description: "second grade" },
          { input: "72", expectedOutput: "C", description: "middle grade" },
          { input: "65", expectedOutput: "D", description: "low pass" },
          { input: "40", expectedOutput: "F", description: "fail" },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 2,
      },
      {
        id: "c-ex-03-03-switch",
        title: "Multi-Way Decisions with switch",
        description: "Map a number to a weekday name using switch.",
        theory: `### switch Syntax
switch (expression) {
    case value1:
        /* code */
        break;
    case value2:
        /* code */
        break;
    default:
        /* fallback */
}

### break Is Essential
Without \`break\`, execution "falls through" into the next case. Sometimes that is intentional (grouping cases), but usually it is a bug.

### When to Use switch
switch is ideal for comparing one integer or char against a fixed set of constants. It cannot use ranges or floating-point values.`,
        problemStatement:
          "Read an integer day (1-7) and print the matching weekday: 1 = Monday, 2 = Tuesday, ..., 7 = Sunday. Print Invalid day for anything else.",
        inputExample: "1",
        outputExample: "Monday",
        hints: [
          "Read day",
          "Use switch (day)",
          "Add break after each case",
          "Use default for invalid values",
        ],
        constraints: ["-100 <= day <= 100"],
        starterCode: `#include <stdio.h>

int main(void) {
    int day;
    scanf("%d", &day);

    /* TODO: print the weekday name */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int day;
    scanf("%d", &day);

    switch (day) {
        case 1: printf("Monday");    break;
        case 2: printf("Tuesday");   break;
        case 3: printf("Wednesday"); break;
        case 4: printf("Thursday");  break;
        case 5: printf("Friday");    break;
        case 6: printf("Saturday");  break;
        case 7: printf("Sunday");    break;
        default: printf("Invalid day");
    }
    return 0;
}
`,
        testCases: [
          { input: "1", expectedOutput: "Monday", description: "first day" },
          { input: "7", expectedOutput: "Sunday", description: "last day" },
          {
            input: "9",
            expectedOutput: "Invalid day",
            description: "out of range",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 3,
      },
      {
        id: "c-ex-03-04-for-loop",
        title: "Counting with a for Loop",
        description: "Print a sequence of numbers using a for loop.",
        theory: `### for Loop Syntax
for (initialization; condition; update) {
    /* loop body */
}

for (int i = 1; i <= n; i++) {
    printf("%d\\n", i);
}

### Three Parts
- Initialization runs once before the loop
- Condition is checked before every iteration
- Update runs after every iteration

### Off-By-One
\`i <= n\` includes n. \`i < n\` stops before n. Choose deliberately.`,
        problemStatement:
          "Read an integer n and print every number from 1 to n inclusive, each on its own line.",
        inputExample: "5",
        outputExample: "1\n2\n3\n4\n5",
        hints: [
          "Read n",
          "Use for (int i = 1; i <= n; i++)",
          "Print i followed by a newline",
        ],
        constraints: ["1 <= n <= 100"],
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: print 1 through n */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    for (int i = 1; i <= n; i++) {
        printf("%d\\n", i);
    }
    return 0;
}
`,
        testCases: [
          {
            input: "5",
            expectedOutput: "1\n2\n3\n4\n5",
            description: "count to five",
          },
          {
            input: "3",
            expectedOutput: "1\n2\n3",
            description: "short sequence",
          },
          {
            input: "10",
            expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
            description: "longer sequence",
          },
        ],
        xpReward: 50,
        difficulty: "easy",
        language: "c",
        order: 4,
      },
      {
        id: "c-ex-03-05-while-sum",
        title: "Accumulating with a while Loop",
        description: "Sum the numbers from 1 to n using a loop.",
        theory: `### while Loop Syntax
while (condition) {
    /* body */
}

The condition is checked first. If it is false initially, the body never runs.

### Accumulator Pattern
int sum = 0;
int i = 1;
while (i <= n) {
    sum += i;
    i++;
}

You must update the loop variable inside the body, or the loop never ends.

### Closed Form
The sum 1 + 2 + ... + n equals n * (n + 1) / 2, but here practice the loop.`,
        problemStatement:
          "Read an integer n and print the sum of all integers from 1 to n.",
        inputExample: "5",
        outputExample: "15",
        hints: [
          "Initialize sum = 0 and i = 1",
          "Loop while i <= n",
          "Add i to sum and increment i",
          "Print sum after the loop",
        ],
        constraints: ["1 <= n <= 10000"],
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: compute and print the sum 1..n */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int sum = 0;
    int i = 1;
    while (i <= n) {
        sum += i;
        i++;
    }
    printf("%d", sum);
    return 0;
}
`,
        testCases: [
          { input: "5", expectedOutput: "15", description: "small sum" },
          { input: "10", expectedOutput: "55", description: "larger sum" },
          { input: "1", expectedOutput: "1", description: "single value" },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 5,
      },
    ],
  },
  {
    id: "c-ch-04-functions",
    title: "Functions & Recursion",
    description:
      "Split programs into reusable functions, pass arguments, return values, and solve problems recursively.",
    order: 4,
    exercises: [
      {
        id: "c-ex-04-01-function-basics",
        title: "Defining and Calling Functions",
        description: "Write a function that adds two numbers.",
        theory: `### Function Definition
return_type name(parameters) {
    /* body */
    return value;
}

int add(int a, int b) {
    return a + b;
}

### Declaring Before Use
C compilers read top to bottom. Either define the function above \`main\`, or declare a prototype first:

int add(int a, int b);   /* prototype */

### Calling
int result = add(10, 20);

### Why Functions
They remove duplication, name a concept, and make testing possible.`,
        problemStatement:
          "Write a function add(int a, int b) that returns the sum. In main, call add(10, 20) and print the result.",
        inputExample: "",
        outputExample: "30",
        hints: [
          "Define int add(int a, int b) above main",
          "Return a + b",
          "Print add(10, 20)",
        ],
        constraints: ["Addition must happen inside the function"],
        starterCode: `#include <stdio.h>

/* TODO: define the add function */

int main(void) {
    /* TODO: call add(10, 20) and print */
    return 0;
}
`,
        solution: `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main(void) {
    printf("%d", add(10, 20));
    return 0;
}
`,
        testCases: [
          { input: "", expectedOutput: "30", description: "10 + 20" },
          { input: "", expectedOutput: "30", description: "function call" },
          { input: "", expectedOutput: "30", description: "return value" },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 1,
      },
      {
        id: "c-ex-04-02-max-function",
        title: "Function Returning the Maximum",
        description: "Write a function that returns the larger of two numbers.",
        theory: `### Comparing and Returning
int max(int a, int b) {
    if (a > b) return a;
    return b;
}

### Early Return
A function stops as soon as it hits a \`return\`, so the second return only runs when the first condition is false.

### Compact Form
int max(int a, int b) {
    return (a > b) ? a : b;
}

### Pass by Value
C passes arguments by value: the function receives copies, so changing \`a\` or \`b\` inside does not affect the caller's variables. (Pointers, later, let you modify the originals.)`,
        problemStatement:
          "Read two integers and print the larger one using a function max(int a, int b).",
        inputExample: "3 7",
        outputExample: "7",
        hints: [
          "Define int max(int a, int b)",
          "Compare a and b",
          "Return the larger value",
          "Read two ints and call max",
        ],
        constraints: ["-1000000 <= a, b <= 1000000"],
        starterCode: `#include <stdio.h>

/* TODO: define the max function */

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);

    /* TODO: print the maximum */
    return 0;
}
`,
        solution: `#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);

    printf("%d", max(a, b));
    return 0;
}
`,
        testCases: [
          { input: "3 7", expectedOutput: "7", description: "second larger" },
          { input: "10 2", expectedOutput: "10", description: "first larger" },
          { input: "5 5", expectedOutput: "5", description: "equal values" },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 2,
      },
      {
        id: "c-ex-04-03-factorial",
        title: "Recursive Factorial",
        description: "Compute n! using a function that calls itself.",
        theory: `### Recursion
A recursive function solves a problem by calling itself on a smaller input.

long long factorial(int n) {
    if (n <= 1) return 1;          /* base case */
    return n * factorial(n - 1);   /* recursive case */
}

### Base Case Is Mandatory
Without a base case the recursion never stops and the stack overflows.

### Growth
Factorial grows extremely fast. Use \`long long\` and print with \`%lld\`:
- 5! = 120
- 10! = 3628800
- 13! overflows 32-bit integers

### Call Stack
Each call waits for the next one, so 5! builds five stack frames before returning.`,
        problemStatement:
          "Read an integer n (0 <= n <= 12) and print n! using a recursive function.",
        inputExample: "5",
        outputExample: "120",
        hints: [
          "Base case: n <= 1 returns 1",
          "Recursive case: n * factorial(n - 1)",
          "Use long long and %lld",
        ],
        constraints: ["0 <= n <= 12"],
        starterCode: `#include <stdio.h>

/* TODO: define recursive factorial */

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: print n! */
    return 0;
}
`,
        solution: `#include <stdio.h>

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main(void) {
    int n;
    scanf("%d", &n);

    printf("%lld", factorial(n));
    return 0;
}
`,
        testCases: [
          { input: "5", expectedOutput: "120", description: "5 factorial" },
          { input: "0", expectedOutput: "1", description: "zero factorial" },
          { input: "10", expectedOutput: "3628800", description: "10 factorial" },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "c",
        order: 3,
      },
      {
        id: "c-ex-04-04-fibonacci",
        title: "Fibonacci Numbers",
        description: "Generate the nth Fibonacci number with a function.",
        theory: `### Fibonacci Sequence
Each term is the sum of the previous two:
1, 1, 2, 3, 5, 8, 13, 21, ...

F(1) = 1, F(2) = 1, F(n) = F(n - 1) + F(n - 2)

### Iterative Version
long long fib(int n) {
    long long a = 1, b = 1;
    for (int i = 3; i <= n; i++) {
        long long next = a + b;
        a = b;
        b = next;
    }
    return b;
}

### Why Iterative Here
The naive recursive version recomputes the same values exponentially many times. Iteration runs in O(n) time and O(1) space.`,
        problemStatement:
          "Read an integer n (1 <= n <= 50) and print the nth Fibonacci number, where F(1) = 1 and F(2) = 1.",
        inputExample: "7",
        outputExample: "13",
        hints: [
          "Handle n = 1 and n = 2 first",
          "Keep the previous two values",
          "Loop from 3 to n",
          "Use long long for large values",
        ],
        constraints: ["1 <= n <= 50"],
        starterCode: `#include <stdio.h>

/* TODO: define fibonacci function */

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: print the nth Fibonacci number */
    return 0;
}
`,
        solution: `#include <stdio.h>

long long fib(int n) {
    if (n <= 2) return 1;

    long long a = 1, b = 1;
    for (int i = 3; i <= n; i++) {
        long long next = a + b;
        a = b;
        b = next;
    }
    return b;
}

int main(void) {
    int n;
    scanf("%d", &n);

    printf("%lld", fib(n));
    return 0;
}
`,
        testCases: [
          { input: "1", expectedOutput: "1", description: "first term" },
          { input: "7", expectedOutput: "13", description: "seventh term" },
          { input: "10", expectedOutput: "55", description: "tenth term" },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "c",
        order: 4,
      },
    ],
  },
  {
    id: "c-ch-05-arrays-strings",
    title: "Arrays & Strings",
    description:
      "Store collections in arrays, iterate with loops, reverse data, and manipulate null-terminated strings.",
    order: 5,
    exercises: [
      {
        id: "c-ex-05-01-array-sum",
        title: "Array Sum",
        description: "Read n integers into an array and sum them.",
        theory: `### Arrays
An array is a contiguous block of same-type elements:
int arr[5];            /* five uninitialized ints */
int arr[3] = {1, 2, 3};

### Indexing
Indices start at 0. The last valid index is size - 1. Reading \`arr[5]\` in a five-element array is undefined behavior.

### Looping
int sum = 0;
for (int i = 0; i < n; i++) {
    scanf("%d", &arr[i]);
    sum += arr[i];
}

### Variable-Length Arrays
C99 allows \`int arr[n];\` where n is a runtime value. For very large or unknown sizes, dynamic allocation with malloc is safer.`,
        problemStatement:
          "Read an integer n, then n integers. Store them in an array and print their sum.",
        inputExample: "5\n10 20 30 40 50",
        outputExample: "150",
        hints: [
          "Read n first",
          "Declare int arr[n] or a fixed large array",
          "Loop i from 0 to n - 1 reading arr[i]",
          "Accumulate a running sum and print it",
        ],
        constraints: ["1 <= n <= 1000", "Each value fits in int"],
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: read the array and print its sum */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int arr[1000];
    int sum = 0;

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }

    printf("%d", sum);
    return 0;
}
`,
        testCases: [
          {
            input: "5\n10 20 30 40 50",
            expectedOutput: "150",
            description: "five values",
          },
          {
            input: "3\n1 2 3",
            expectedOutput: "6",
            description: "three values",
          },
          {
            input: "1\n42",
            expectedOutput: "42",
            description: "single value",
          },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 1,
      },
      {
        id: "c-ex-05-02-max-min",
        title: "Maximum and Minimum in an Array",
        description: "Scan an array to find its largest and smallest values.",
        theory: `### Tracking Extremes
Start with the first element as both max and min, then compare every remaining element:

int max = arr[0];
int min = arr[0];
for (int i = 1; i < n; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
}

### Why Not Zero?
Initializing to 0 fails when every value is negative or every value is positive. Seed with real data.

### One Pass
Both extremes are found in O(n) time with no sorting.`,
        problemStatement:
          "Read n, then n integers. Print the maximum and minimum in the format: Max: X Min: Y",
        inputExample: "5\n3 7 2 9 1",
        outputExample: "Max: 9 Min: 1",
        hints: [
          "Read n and the array",
          "Initialize max and min with arr[0]",
          "Loop from index 1",
          "Update max and min when needed",
        ],
        constraints: ["1 <= n <= 1000"],
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: find and print the maximum and minimum */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int arr[1000];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    int max = arr[0];
    int min = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }

    printf("Max: %d Min: %d", max, min);
    return 0;
}
`,
        testCases: [
          {
            input: "5\n3 7 2 9 1",
            expectedOutput: "Max: 9 Min: 1",
            description: "mixed values",
          },
          {
            input: "3\n5 5 5",
            expectedOutput: "Max: 5 Min: 5",
            description: "all equal",
          },
          {
            input: "4\n10 20 5 15",
            expectedOutput: "Max: 20 Min: 5",
            description: "different values",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "c",
        order: 2,
      },
      {
        id: "c-ex-05-03-reverse",
        title: "Reversing an Array",
        description: "Print the elements of an array in reverse order.",
        theory: `### Traversing Backwards
The simplest reverse for printing is a loop from the last index down to 0:

for (int i = n - 1; i >= 0; i--) {
    printf("%d ", arr[i]);
}

### In-Place Reversal
To actually reverse the array, swap symmetric pairs:
for (int i = 0; i < n / 2; i++) {
    int temp = arr[i];
    arr[i] = arr[n - 1 - i];
    arr[n - 1 - i] = temp;
}

### Complexity
Both approaches are O(n) time; in-place reversal uses O(1) extra space.`,
        problemStatement:
          "Read n, then n integers. Print the array in reverse order, separated by single spaces.",
        inputExample: "5\n1 2 3 4 5",
        outputExample: "5 4 3 2 1",
        hints: [
          "Read n and the values",
          "Loop from n - 1 down to 0",
          "Print each value followed by a space",
        ],
        constraints: ["1 <= n <= 1000"],
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: read the array and print it reversed */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int arr[1000];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    for (int i = n - 1; i >= 0; i--) {
        printf("%d ", arr[i]);
    }
    return 0;
}
`,
        testCases: [
          {
            input: "5\n1 2 3 4 5",
            expectedOutput: "5 4 3 2 1",
            description: "five values",
          },
          {
            input: "3\n10 20 30",
            expectedOutput: "30 20 10",
            description: "three values",
          },
          { input: "1\n7", expectedOutput: "7", description: "single value" },
        ],
        xpReward: 60,
        difficulty: "easy",
        language: "c",
        order: 3,
      },
      {
        id: "c-ex-05-04-string-length",
        title: "String Length (Manual strlen)",
        description: "Count characters in a string without using strlen.",
        theory: `### Strings in C
A string is a \`char\` array terminated by the null character \`'\\0'\`.

char word[6] = "hello";   /* h e l l o \\0 */

### Counting Manually
int len = 0;
while (word[len] != '\\0') {
    len++;
}

### Why the Terminator Matters
Without \`'\\0'\`, functions like printf cannot know where the string ends and will read past the array.

### Reading a Word
scanf("%99s", word);

The \`99\` caps input length so a long word cannot overflow a 100-byte buffer.`,
        problemStatement:
          "Read a single word (no spaces) and print its length without calling strlen.",
        inputExample: "hello",
        outputExample: "5",
        hints: [
          "Declare char word[100]",
          "Read with scanf(\"%99s\", word)",
          "Loop until the character is '\\0'",
          "Increment a counter each step",
        ],
        constraints: ["1 <= word length <= 99", "The word contains no spaces"],
        starterCode: `#include <stdio.h>

int main(void) {
    char word[100];
    scanf("%99s", word);

    /* TODO: count and print the length */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    char word[100];
    scanf("%99s", word);

    int length = 0;
    while (word[length] != '\\0') {
        length++;
    }

    printf("%d", length);
    return 0;
}
`,
        testCases: [
          { input: "hello", expectedOutput: "5", description: "five letters" },
          { input: "C", expectedOutput: "1", description: "single letter" },
          {
            input: "programming",
            expectedOutput: "11",
            description: "longer word",
          },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "c",
        order: 4,
      },
      {
        id: "c-ex-05-05-palindrome",
        title: "Palindrome Check",
        description: "Determine whether a word reads the same backwards.",
        theory: `### Palindrome
A string is a palindrome when it equals its reverse:
madam, racecar, level.

### Two-Pointer Check
Compare the first and last characters, then move inward:

int left = 0;
int right = len - 1;
while (left < right) {
    if (word[left] != word[right]) { isPalindrome = 0; break; }
    left++;
    right--;
}

### Complexity
O(n) time, O(1) extra space. Only half the string needs comparing.`,
        problemStatement:
          "Read a word and print Yes if it is a palindrome, otherwise print No.",
        inputExample: "madam",
        outputExample: "Yes",
        hints: [
          "Find the length first",
          "Compare characters from both ends",
          "Stop early when a mismatch is found",
          "Print Yes or No",
        ],
        constraints: ["1 <= word length <= 99", "Lowercase letters only"],
        starterCode: `#include <stdio.h>

int main(void) {
    char word[100];
    scanf("%99s", word);

    /* TODO: check whether word is a palindrome */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    char word[100];
    scanf("%99s", word);

    int len = 0;
    while (word[len] != '\\0') len++;

    int isPalindrome = 1;
    for (int i = 0; i < len / 2; i++) {
        if (word[i] != word[len - 1 - i]) {
            isPalindrome = 0;
            break;
        }
    }

    printf("%s", isPalindrome ? "Yes" : "No");
    return 0;
}
`,
        testCases: [
          { input: "madam", expectedOutput: "Yes", description: "palindrome" },
          { input: "hello", expectedOutput: "No", description: "not palindrome" },
          { input: "a", expectedOutput: "Yes", description: "single character" },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "c",
        order: 5,
      },
    ],
  },
  {
    id: "c-ch-06-pointers-memory",
    title: "Pointers & Dynamic Memory",
    description:
      "Understand addresses, dereferencing, pointer arithmetic, pass-by-pointer, and heap allocation with malloc/free.",
    order: 6,
    exercises: [
      {
        id: "c-ex-06-01-pointer-basics",
        title: "Pointer Basics",
        description: "Create a pointer and read a value through it.",
        theory: `### Addresses and Pointers
Every variable lives at a memory address. A pointer stores that address.

int x = 42;
int *p = &x;     /* p holds the address of x */
printf("%d", *p); /* 42 — dereference reads through p */

### Operators
- \`&\` address-of
- \`*\` dereference (when used on a pointer)
- \`int *\` is the type "pointer to int"

### Null Pointers
A pointer that points nowhere should be set to \`NULL\`. Dereferencing NULL crashes the program.`,
        problemStatement:
          "Create an integer x = 42 and a pointer p to x. Print the value obtained by dereferencing p.",
        inputExample: "",
        outputExample: "42",
        hints: [
          "Declare int x = 42;",
          "Declare int *p = &x;",
          "Print *p",
        ],
        constraints: ["Must use a pointer and dereference it"],
        starterCode: `#include <stdio.h>

int main(void) {
    int x = 42;
    /* TODO: create a pointer to x and print the dereferenced value */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int x = 42;
    int *p = &x;

    printf("%d", *p);
    return 0;
}
`,
        testCases: [
          { input: "", expectedOutput: "42", description: "dereference" },
          { input: "", expectedOutput: "42", description: "pointer value" },
          { input: "", expectedOutput: "42", description: "basic output" },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "c",
        order: 1,
      },
      {
        id: "c-ex-06-02-swap-pointers",
        title: "Swapping with Pointers",
        description: "Modify caller variables through pointers.",
        theory: `### Pass by Pointer
C passes arguments by value, so a function cannot change the caller's variable directly — unless you pass its address.

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

Call it with addresses:
swap(&x, &y);

### Reading the Function
- \`int *a\` is a pointer parameter
- \`*a\` is the value stored at that address
- Assigning \`*a = ...\` writes back to the caller's variable

This is how many standard-library functions return multiple results.`,
        problemStatement:
          "Read two integers. Write a function swap(int *a, int *b) that swaps them, call it, and print the swapped values separated by a space.",
        inputExample: "5 9",
        outputExample: "9 5",
        hints: [
          "Define void swap(int *a, int *b)",
          "Use *a and *b inside",
          "Call swap(&x, &y)",
          "Print x and y after the call",
        ],
        constraints: ["Must swap using pointers inside a function"],
        starterCode: `#include <stdio.h>

/* TODO: define the swap function */

int main(void) {
    int x, y;
    scanf("%d %d", &x, &y);

    /* TODO: call swap and print the result */
    return 0;
}
`,
        solution: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x, y;
    scanf("%d %d", &x, &y);

    swap(&x, &y);
    printf("%d %d", x, y);
    return 0;
}
`,
        testCases: [
          { input: "5 9", expectedOutput: "9 5", description: "swap values" },
          { input: "1 2", expectedOutput: "2 1", description: "small values" },
          {
            input: "100 200",
            expectedOutput: "200 100",
            description: "larger values",
          },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "c",
        order: 2,
      },
      {
        id: "c-ex-06-03-pointer-arithmetic",
        title: "Pointer Arithmetic over an Array",
        description: "Iterate an array using pointer arithmetic.",
        theory: `### Arrays Decay to Pointers
An array name used in an expression becomes a pointer to its first element:

int arr[3] = {10, 20, 30};
int *p = arr;        /* same as &arr[0] */

### Pointer Arithmetic
- \`p\` points to arr[0]
- \`p + 1\` points to arr[1]
- \`*(p + i)\` is the same as \`arr[i]\`
- \`p++\` advances to the next element (by sizeof(int) bytes)

### Sum with Pointers
int sum = 0;
for (int i = 0; i < n; i++) {
    sum += *(p + i);
}`,
        problemStatement:
          "Read n, then n integers. Use a pointer and pointer arithmetic (not array indexing) to compute and print the sum.",
        inputExample: "5\n1 2 3 4 5",
        outputExample: "15",
        hints: [
          "Read the array first",
          "Set int *p = arr",
          "Access elements with *(p + i)",
          "Print the accumulated sum",
        ],
        constraints: ["1 <= n <= 1000", "Must use pointer arithmetic"],
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: read the array and sum it with pointer arithmetic */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int arr[1000];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    int *p = arr;
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += *(p + i);
    }

    printf("%d", sum);
    return 0;
}
`,
        testCases: [
          {
            input: "5\n1 2 3 4 5",
            expectedOutput: "15",
            description: "five values",
          },
          {
            input: "3\n10 20 30",
            expectedOutput: "60",
            description: "three values",
          },
          { input: "1\n7", expectedOutput: "7", description: "single value" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "c",
        order: 3,
      },
      {
        id: "c-ex-06-04-malloc",
        title: "Dynamic Arrays with malloc",
        description: "Allocate memory at runtime and release it with free.",
        theory: `### Heap vs Stack
Local variables live on the stack and disappear when the function returns. \`malloc\` reserves memory on the heap, which persists until you explicitly free it.

### Allocation
int *arr = (int *)malloc(n * sizeof(int));
if (arr == NULL) {
    return 1;   /* allocation failed */
}

### Using It
for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

### Freeing
free(arr);

Every successful malloc needs exactly one free. Forgetting it leaks memory; freeing twice is undefined behavior.

### calloc and realloc
- \`calloc(n, size)\` allocates and zeroes memory
- \`realloc(ptr, new_size)\` grows or shrinks an existing block`,
        problemStatement:
          "Read n, allocate an integer array of size n with malloc, read n values, print their sum, and free the memory.",
        inputExample: "5\n10 20 30 40 50",
        outputExample: "150",
        hints: [
          "Read n",
          "malloc(n * sizeof(int))",
          "Check the pointer for NULL",
          "Read values, sum them, print",
          "free the allocation",
        ],
        constraints: ["1 <= n <= 10000"],
        starterCode: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: allocate, read, sum, print, and free */
    return 0;
}
`,
        solution: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        return 1;
    }

    int sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }

    printf("%d", sum);
    free(arr);
    return 0;
}
`,
        testCases: [
          {
            input: "5\n10 20 30 40 50",
            expectedOutput: "150",
            description: "five values",
          },
          {
            input: "3\n1 2 3",
            expectedOutput: "6",
            description: "three values",
          },
          {
            input: "4\n2 4 6 8",
            expectedOutput: "20",
            description: "even values",
          },
        ],
        xpReward: 100,
        difficulty: "hard",
        language: "c",
        order: 4,
      },
    ],
  },
  {
    id: "c-ch-07-structs-enums",
    title: "Structures, Enums & typedef",
    description:
      "Group related data with structs, access members through pointers, and name values with enums and typedef.",
    order: 7,
    exercises: [
      {
        id: "c-ex-07-01-struct-basics",
        title: "Defining and Using a struct",
        description: "Group related fields into a single structure.",
        theory: `### Why structs
Real entities have multiple attributes. A struct groups them into one type:

struct Student {
    char name[50];
    int age;
    float marks;
};

### Declaring and Initializing
struct Student s = {"Alice", 20, 85.5f};

### Accessing Members
printf("%s", s.name);   /* dot operator */

### Memory Layout
Members are stored in declaration order, possibly with padding for alignment. \`sizeof(struct Student)\` may be larger than the sum of the fields.`,
        problemStatement:
          "Define a struct Student with fields name (string), age (int), and marks (float). Create one student with the values Alice, 20, 85.5 and print them separated by spaces.",
        inputExample: "",
        outputExample: "Alice 20 85.5",
        hints: [
          "Define struct Student with three fields",
          "Initialize it with {\"Alice\", 20, 85.5f}",
          "Access members with the dot operator",
          "Print with %s %d %.1f",
        ],
        constraints: ["No input", "Must use a struct"],
        starterCode: `#include <stdio.h>

/* TODO: define struct Student */

int main(void) {
    /* TODO: create a student and print its fields */
    return 0;
}
`,
        solution: `#include <stdio.h>

struct Student {
    char name[50];
    int age;
    float marks;
};

int main(void) {
    struct Student s = {"Alice", 20, 85.5f};

    printf("%s %d %.1f", s.name, s.age, s.marks);
    return 0;
}
`,
        testCases: [
          {
            input: "",
            expectedOutput: "Alice 20 85.5",
            description: "all fields",
          },
          {
            input: "",
            expectedOutput: "Alice 20 85.5",
            description: "float formatting",
          },
          { input: "", expectedOutput: "Alice 20 85.5", description: "struct" },
        ],
        xpReward: 80,
        difficulty: "medium",
        language: "c",
        order: 1,
      },
      {
        id: "c-ex-07-02-struct-array",
        title: "Arrays of Structures",
        description: "Store multiple records and find the highest scorer.",
        theory: `### Arrays of structs
A struct is a type, so you can make arrays of it:

struct Student students[3] = {
    {"Alice", 85.5f},
    {"Bob", 92.0f},
    {"Charlie", 78.0f}
};

### Iterating
for (int i = 0; i < 3; i++) {
    if (students[i].marks > best) { ... }
}

### Finding a Record
Track the index of the best element, not a copy, when you need the whole record afterwards.`,
        problemStatement:
          "Define struct Student with name and marks. Create three students: Alice 85.5, Bob 92.0, Charlie 78.0. Print the name and marks of the highest scorer as: <name> <marks with one decimal>",
        inputExample: "",
        outputExample: "Bob 92.0",
        hints: [
          "Declare an array of three structs",
          "Track the index of the best marks",
          "Loop and compare each marks value",
          "Print the winner's name and marks",
        ],
        constraints: ["No input", "Use an array of structs"],
        starterCode: `#include <stdio.h>

/* TODO: define struct Student */

int main(void) {
    /* TODO: create three students and print the top scorer */
    return 0;
}
`,
        solution: `#include <stdio.h>

struct Student {
    char name[50];
    float marks;
};

int main(void) {
    struct Student students[3] = {
        {"Alice", 85.5f},
        {"Bob", 92.0f},
        {"Charlie", 78.0f}
    };

    int best = 0;
    for (int i = 1; i < 3; i++) {
        if (students[i].marks > students[best].marks) {
            best = i;
        }
    }

    printf("%s %.1f", students[best].name, students[best].marks);
    return 0;
}
`,
        testCases: [
          { input: "", expectedOutput: "Bob 92.0", description: "top scorer" },
          { input: "", expectedOutput: "Bob 92.0", description: "marks format" },
          { input: "", expectedOutput: "Bob 92.0", description: "name" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "c",
        order: 2,
      },
      {
        id: "c-ex-07-03-arrow-operator",
        title: "Struct Pointers & the Arrow Operator",
        description: "Modify a struct through a pointer.",
        theory: `### Pointers to Structs
You can take the address of a struct and pass it to functions:

void move(struct Point *p) {
    p->x += 1;     /* same as (*p).x += 1 */
}

### The Arrow Operator
\`p->member\` is shorthand for \`(*p).member\`. It is the standard way to access members through a pointer.

### Why Pass a Pointer
Copying a large struct is expensive. Passing a pointer is cheap and lets the function modify the original.`,
        problemStatement:
          "Define struct Point with x and y. Start with x = 2, y = 3. Write a function movePoint that adds 5 to x and -1 to y through a pointer, then print the updated coordinates as: x y",
        inputExample: "",
        outputExample: "7 2",
        hints: [
          "Define struct Point { int x; int y; };",
          "Function signature: void movePoint(struct Point *p)",
          "Use p->x and p->y",
          "Pass &point from main",
        ],
        constraints: ["Must modify through a struct pointer"],
        starterCode: `#include <stdio.h>

/* TODO: define struct Point and movePoint */

int main(void) {
    /* TODO: create a point, move it, print the result */
    return 0;
}
`,
        solution: `#include <stdio.h>

struct Point {
    int x;
    int y;
};

void movePoint(struct Point *p) {
    p->x += 5;
    p->y += -1;
}

int main(void) {
    struct Point p = {2, 3};
    movePoint(&p);

    printf("%d %d", p.x, p.y);
    return 0;
}
`,
        testCases: [
          { input: "", expectedOutput: "7 2", description: "moved point" },
          { input: "", expectedOutput: "7 2", description: "arrow access" },
          { input: "", expectedOutput: "7 2", description: "pointer" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "c",
        order: 3,
      },
      {
        id: "c-ex-07-04-typedef-enum",
        title: "typedef and enum",
        description: "Create type aliases and named integer constants.",
        theory: `### typedef
\`typedef\` creates a new name for an existing type:

typedef struct {
    int width;
    int height;
} Size;

Now you can write \`Size s;\` instead of \`struct Size s;\`.

### enum
An enum defines named integer constants:

typedef enum { RED, GREEN, BLUE } Color;

- RED is 0
- GREEN is 1
- BLUE is 2

You can assign explicit values: \`enum { OK = 200, NOT_FOUND = 404 };\`

### Why Use Them
Enums replace magic numbers with readable names and let the compiler warn about invalid assignments.`,
        problemStatement:
          "Using typedef, define an enum Color with RED, GREEN, BLUE and a struct Size with width and height. Print the numeric value of GREEN, the numeric value of BLUE, and the area of a 4x5 Size, separated by spaces.",
        inputExample: "",
        outputExample: "1 2 20",
        hints: [
          "typedef enum { RED, GREEN, BLUE } Color;",
          "typedef struct { int width; int height; } Size;",
          "Print GREEN and BLUE as integers",
          "Area is width * height",
        ],
        constraints: ["Must use typedef and enum"],
        starterCode: `#include <stdio.h>

/* TODO: define Color enum and Size struct with typedef */

int main(void) {
    /* TODO: print GREEN, BLUE, and the area */
    return 0;
}
`,
        solution: `#include <stdio.h>

typedef enum { RED, GREEN, BLUE } Color;

typedef struct {
    int width;
    int height;
} Size;

int main(void) {
    Color c = BLUE;
    Size s = {4, 5};

    printf("%d %d %d", GREEN, c, s.width * s.height);
    return 0;
}
`,
        testCases: [
          { input: "", expectedOutput: "1 2 20", description: "enum values" },
          { input: "", expectedOutput: "1 2 20", description: "struct area" },
          { input: "", expectedOutput: "1 2 20", description: "typedef" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "c",
        order: 4,
      },
    ],
  },
  {
    id: "c-ch-08-files-preprocessor",
    title: "File I/O & the Preprocessor",
    description:
      "Persist data to files with fopen/fprintf/fgets and automate code with macros and conditional compilation.",
    order: 8,
    exercises: [
      {
        id: "c-ex-08-01-write-file",
        title: "Writing to a File",
        description: "Create a file and write text into it.",
        theory: `### File Streams
C treats files as streams accessed through a \`FILE *\` pointer.

FILE *out = fopen("test.txt", "w");
if (out == NULL) {
    return 1;   /* could not open */
}
fprintf(out, "Hello File\\n");
fclose(out);

### Modes
- \`"w"\` write (creates or truncates)
- \`"r"\` read (file must exist)
- \`"a"\` append
- add \`"b"\` for binary, e.g. \`"wb"\`

### Always Close
\`fclose\` flushes buffered data and releases the handle.`,
        problemStatement:
          "Create a file named test.txt, write the text Hello File into it, close it, and print File written.",
        inputExample: "",
        outputExample: "File written",
        hints: [
          "fopen(\"test.txt\", \"w\")",
          "Check the FILE pointer for NULL",
          "fprintf to write",
          "fclose before printing the message",
        ],
        constraints: ["Must use file I/O functions"],
        starterCode: `#include <stdio.h>

int main(void) {
    /* TODO: write to test.txt, then print File written */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    FILE *out = fopen("test.txt", "w");
    if (out == NULL) {
        return 1;
    }

    fprintf(out, "Hello File");
    fclose(out);

    printf("File written");
    return 0;
}
`,
        testCases: [
          { input: "", expectedOutput: "File written", description: "write" },
          { input: "", expectedOutput: "File written", description: "create" },
          { input: "", expectedOutput: "File written", description: "close" },
        ],
        xpReward: 80,
        difficulty: "easy",
        language: "c",
        order: 1,
      },
      {
        id: "c-ex-08-02-read-file",
        title: "Writing and Reading a File",
        description: "Write a line to a file, then read it back and print it.",
        theory: `### Writing Then Reading
Open in write mode, write, close. Reopen in read mode, read, close.

### Reading a Line
char line[100];
fgets(line, sizeof(line), in);

\`fgets\` reads at most size - 1 characters or until a newline, and always null-terminates.

### Checking for Failure
fgets returns NULL at end of file or on error:
while (fgets(line, sizeof(line), in) != NULL) {
    printf("%s", line);
}`,
        problemStatement:
          "Write the line Hello File to data.txt, close it, reopen the file, read the first line, print it, and close it.",
        inputExample: "",
        outputExample: "Hello File",
        hints: [
          "Open data.txt with mode \"w\" and write",
          "Close before reopening",
          "Open with mode \"r\"",
          "Read with fgets and print with printf",
        ],
        constraints: ["Must write and read the same file"],
        starterCode: `#include <stdio.h>

int main(void) {
    /* TODO: write, then read back, then print the line */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    FILE *out = fopen("data.txt", "w");
    if (out == NULL) return 1;

    fprintf(out, "Hello File\\n");
    fclose(out);

    FILE *in = fopen("data.txt", "r");
    if (in == NULL) return 1;

    char line[100];
    fgets(line, sizeof(line), in);
    fclose(in);

    printf("%s", line);
    return 0;
}
`,
        testCases: [
          { input: "", expectedOutput: "Hello File", description: "read back" },
          { input: "", expectedOutput: "Hello File", description: "first line" },
          { input: "", expectedOutput: "Hello File", description: "fgets" },
        ],
        xpReward: 90,
        difficulty: "medium",
        language: "c",
        order: 2,
      },
      {
        id: "c-ex-08-03-append-file",
        title: "Appending to a File",
        description: "Preserve existing content while adding a new line.",
        theory: `### Append Mode
Opening with \`"a"\` keeps existing content and writes at the end:

FILE *out = fopen("data.txt", "a");
fprintf(out, "Line2\\n");
fclose(out);

### Write vs Append
- \`"w"\` truncates the file to zero length
- \`"a"\` never truncates

### Reading Everything Back
After appending, reopen in read mode and loop \`fgets\` until it returns NULL to print every line.`,
        problemStatement:
          "Create data.txt containing Line1, append Line2, then read and print both lines, each on its own line.",
        inputExample: "",
        outputExample: "Line1\nLine2",
        hints: [
          "Write Line1 with mode \"w\"",
          "Open again with mode \"a\" and write Line2",
          "Reopen in read mode",
          "Loop fgets until NULL, print each line",
        ],
        constraints: ["Must use append mode for the second line"],
        starterCode: `#include <stdio.h>

int main(void) {
    /* TODO: write Line1, append Line2, then print both */
    return 0;
}
`,
        solution: `#include <stdio.h>

int main(void) {
    FILE *out = fopen("data.txt", "w");
    if (out == NULL) return 1;
    fprintf(out, "Line1\\n");
    fclose(out);

    out = fopen("data.txt", "a");
    if (out == NULL) return 1;
    fprintf(out, "Line2\\n");
    fclose(out);

    FILE *in = fopen("data.txt", "r");
    if (in == NULL) return 1;

    char line[100];
    while (fgets(line, sizeof(line), in) != NULL) {
        printf("%s", line);
    }
    fclose(in);
    return 0;
}
`,
        testCases: [
          {
            input: "",
            expectedOutput: "Line1\nLine2",
            description: "two lines",
          },
          {
            input: "",
            expectedOutput: "Line1\nLine2",
            description: "append order",
          },
          {
            input: "",
            expectedOutput: "Line1\nLine2",
            description: "read all",
          },
        ],
        xpReward: 100,
        difficulty: "hard",
        language: "c",
        order: 3,
      },
      {
        id: "c-ex-08-04-macro",
        title: "Function-like Macros",
        description: "Define a macro and use it to compute a square.",
        theory: `### Preprocessor
Before compilation, the preprocessor performs textual substitution.

### Object-like Macro
#define PI 3.14159

### Function-like Macro
#define SQUARE(x) ((x) * (x))

### Why So Many Parentheses
Macros substitute text, not values:
#define BAD_SQUARE(x) x * x
BAD_SQUARE(1 + 2)  /* expands to 1 + 2 * 1 + 2 == 5 */

Wrapping parameters and the whole expression in parentheses prevents precedence bugs.

### Conditional Compilation
#ifdef DEBUG
    printf("debug\\n");
#endif

### Include Guards
#ifndef MY_HEADER_H
#define MY_HEADER_H
/* declarations */
#endif`,
        problemStatement:
          "Define a macro SQUARE(x) using parentheses correctly. Read an integer n and print its square using the macro.",
        inputExample: "5",
        outputExample: "25",
        hints: [
          "#define SQUARE(x) ((x) * (x))",
          "Read n with scanf",
          "Print SQUARE(n)",
        ],
        constraints: ["1 <= n <= 1000", "Must use a macro, not a function"],
        starterCode: `#include <stdio.h>

/* TODO: define SQUARE macro */

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: print the square using the macro */
    return 0;
}
`,
        solution: `#include <stdio.h>

#define SQUARE(x) ((x) * (x))

int main(void) {
    int n;
    scanf("%d", &n);

    printf("%d", SQUARE(n));
    return 0;
}
`,
        testCases: [
          { input: "5", expectedOutput: "25", description: "5 squared" },
          { input: "7", expectedOutput: "49", description: "7 squared" },
          { input: "10", expectedOutput: "100", description: "10 squared" },
        ],
        xpReward: 70,
        difficulty: "medium",
        language: "c",
        order: 4,
      },
    ],
  },
];

export async function seedCCourse() {
  const totalXP = cChapters
    .flatMap((chapter) => chapter.exercises)
    .reduce((sum, exercise) => sum + exercise.xpReward, 0);

  const course = await prisma.course.upsert({
    where: { id: C_COURSE.id },
    create: {
      ...C_COURSE,
      totalXP,
    },
    update: {
      title: C_COURSE.title,
      shortDescription: C_COURSE.shortDescription,
      description: C_COURSE.description,
      category: C_COURSE.category,
      difficulty: C_COURSE.difficulty,
      thumbnail: C_COURSE.thumbnail,
      isPremium: C_COURSE.isPremium,
      estimatedHours: C_COURSE.estimatedHours,
      enrolledCount: C_COURSE.enrolledCount,
      rating: C_COURSE.rating,
      tags: C_COURSE.tags,
      totalXP,
    },
  });

  const chapterIds = cChapters.map((chapter) => chapter.id);

  await prisma.chapter.deleteMany({
    where: {
      courseId: course.id,
      id: { notIn: chapterIds },
    },
  });

  for (const chapter of cChapters) {
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
    `Seeded ${course.title}: ${cChapters.length} chapters, ${cChapters.flatMap((c) => c.exercises).length} exercises`,
  );
}

export const C_COURSE_ID = C_COURSE.id;
