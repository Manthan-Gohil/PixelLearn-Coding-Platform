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
  language: "javascript";
  order: number;
};

type SeedChapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: SeedExercise[];
};

type JsTopic = {
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
  chapterBoilerplate?: string;
};

export const JS_COURSE_ID = "javascript-complete-mastery";

const JS_COURSE = {
  id: JS_COURSE_ID,
  title: "JavaScript: Complete Mastery (Basics to Advanced)",
  shortDescription:
    "A complete JavaScript path covering fundamentals, async internals, architecture, and advanced browser/Node patterns.",
  description:
    "This course is designed as a true end-to-end JavaScript curriculum. It starts with basics (variables, types, operators) and builds progressively through control flow, functions, scope, closures, this, objects, arrays, Maps/Sets, async programming, Web APIs, DOM/events, forms, error handling, ES6+, OOP, functional programming, performance engineering, advanced patterns (debounce/memoization/generators/proxy/workers), and JavaScript environments in browser and Node.js.",
  category: "Web Development",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 160,
  enrolledCount: 0,
  rating: 4.95,
  tags: [
    "JavaScript",
    "Frontend",
    "Node.js",
    "DOM",
    "Async",
    "ES6+",
    "OOP",
    "Functional Programming",
  ],
};

const CLOSURE_THEORY_SUPPLEMENT = `### Closure Deep Dive (Based on Core Patterns)
1. **Functions within functions**
   Closures are created when an inner function is defined inside an outer function and continues to access outer variables after the outer function returns.

2. **Multiple closures**
   Different function instances can keep different captured values from different outer calls.

3. **Changing outer variables**
   Closures capture variable references, not value snapshots. If the captured variable changes, later closure calls see the updated value.

4. **Closures in event handlers**
   Event listeners commonly rely on closures to preserve setup-time variables across asynchronous user interactions.

5. **Closures in loops**
   Use \`let\` in loops for per-iteration bindings. With \`var\`, callbacks often capture the same shared variable.

6. **Closures with IIFE**
   IIFE patterns create private scope immediately and are useful for encapsulating internals.

### Practical Use Cases
- Private counters/state managers
- Function factories (customized behaviors)
- Memoization caches
- Debounced/throttled handlers
- Module-like encapsulation`;

function sanitizeTitleForCode(topicTitle: string): string {
  return topicTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function buildBoilerplate(topic: JsTopic, variant: 1 | 2 | 3): string {
  const safeName = sanitizeTitleForCode(topic.title);
  const base =
    topic.chapterBoilerplate ||
    `// Chapter: ${topic.title}\n// Goal: ${topic.description}\n\nfunction run_${safeName}() {\n  // Step 1: Read the task\n  // Step 2: Implement logic\n  // Step 3: Print final output\n}\n\nrun_${safeName}();`;

  if (variant === 1) {
    return `${base}\n\n// TODO: Complete the core task for this chapter.`;
  }

  if (variant === 2) {
    return `${base}\n\n// TODO: Extend solution for an applied scenario.\n// Add input validation and at least one edge-case handling block.`;
  }

  return `${base}\n\n// TODO: Debug + refactor challenge\n// 1) Fix at least one logic issue\n// 2) Improve readability\n// 3) Keep output contract unchanged`;
}

function buildDetailedTheory(topic: JsTopic): string {
  const generic = `

### Concept Breakdown
- **What this chapter teaches:** ${topic.description}
- **How to think about it:** Start from small examples, then scale to real usage patterns.
- **Common mistakes to avoid:**
  - Mixing syntax without understanding execution order
  - Ignoring edge cases and error handling
  - Writing code without verifying assumptions

### Real-world Application
This chapter’s concepts are directly used in production code for UI logic, API integration, performance optimization, and maintainable architecture.

### Interview/Assessment Angle
Be able to explain both **how** the code works and **why** a specific pattern is chosen over alternatives.`;

  if (topic.id === "js-ch-05-closures") {
    return `${topic.theory}${generic}\n\n${CLOSURE_THEORY_SUPPLEMENT}`;
  }

  return `${topic.theory}${generic}`;
}

function buildExercises(topic: JsTopic): SeedExercise[] {
  const detailedTheory = buildDetailedTheory(topic);
  const mediumOrHard: "medium" | "hard" =
    topic.difficulty === "hard" ? "hard" : "medium";

  return [
    {
      id: `${topic.id}-ex-01-core`,
      title: `${topic.title} - Core Practice`,
      description: `${topic.description} (core implementation).`,
      theory: detailedTheory,
      problemStatement: topic.problemStatement,
      inputExample: topic.inputExample,
      outputExample: topic.outputExample,
      hints: topic.hints,
      constraints: topic.constraints,
      starterCode: buildBoilerplate(topic, 1),
      solution: topic.solution,
      testCases: topic.testCases,
      xpReward: topic.xpReward,
      difficulty: topic.difficulty,
      language: "javascript",
      order: 1,
    },
    {
      id: `${topic.id}-ex-02-applied`,
      title: `${topic.title} - Applied Scenario`,
      description:
        "Apply the same concept in a practical mini-scenario with edge-case handling.",
      theory: `${detailedTheory}\n\n### Applied Scenario Guidance\nTransform the core idea into a practical implementation (UI or API style), and handle at least one edge case explicitly.`,
      problemStatement: `Applied task for ${topic.title}: Use the same concept in a realistic mini-scenario, include one validation/guard condition, and log deterministic output.`,
      inputExample:
        topic.inputExample ||
        "Use sample values to simulate a realistic workflow.",
      outputExample:
        topic.outputExample ||
        "Expected output should be deterministic and clearly labeled.",
      hints: [
        ...topic.hints,
        "Add guard checks for invalid input/state.",
        "Keep function boundaries clean and reusable.",
      ],
      constraints: [
        ...topic.constraints,
        "Must include one guard/validation check",
      ],
      starterCode: buildBoilerplate(topic, 2),
      solution: `${topic.solution}\n\n// Applied extension example\nconsole.log('applied-scenario-complete');`,
      testCases: [
        ...topic.testCases,
        {
          input: "",
          expectedOutput: "applied-scenario-complete",
          description: "applied scenario completion marker",
        },
      ],
      xpReward: Math.round(topic.xpReward * 1.2),
      difficulty: mediumOrHard,
      language: "javascript",
      order: 2,
    },
    {
      id: `${topic.id}-ex-03-debug-refactor`,
      title: `${topic.title} - Debug & Refactor`,
      description:
        "Fix a flawed baseline implementation, then refactor for readability and maintainability.",
      theory: `${detailedTheory}\n\n### Debugging Focus\n- Identify incorrect assumptions\n- Fix logic or flow issues\n- Refactor for clearer intent and naming`,
      problemStatement: `Debug task for ${topic.title}: Start from a partially-correct implementation, fix output mismatch, and refactor the code without changing final expected behavior.`,
      inputExample: topic.inputExample || "Use provided mock inputs",
      outputExample: topic.outputExample || "Expected corrected output",
      hints: [
        "Reproduce bug first with logs.",
        "Fix one issue at a time and retest.",
        "Refactor only after behavior is correct.",
      ],
      constraints: [
        ...topic.constraints,
        "Must preserve output contract after refactor",
      ],
      starterCode: buildBoilerplate(topic, 3),
      solution: `${topic.solution}\n\n// Refactor checkpoint\nconsole.log('debug-refactor-complete');`,
      testCases: [
        ...topic.testCases,
        {
          input: "",
          expectedOutput: "debug-refactor-complete",
          description: "debug/refactor completion marker",
        },
      ],
      xpReward: Math.round(topic.xpReward * 1.35),
      difficulty: "hard",
      language: "javascript",
      order: 3,
    },
  ];
}

const jsTopics: JsTopic[] = [
  {
    id: "js-ch-01-basics",
    title: "1. Basics",
    description: "Variables, data types, operators, coercion, and console I/O.",
    theory:
      "### Topics Covered\n- `var`, `let`, `const` and re-assignment rules\n- Primitive vs non-primitive types\n- Arithmetic/comparison/logical operators\n- Type conversion and coercion (`Number()`, `String()`, `===` vs `==`)\n- Console-based input/output mindset\n\n### Why this matters\nAll advanced JavaScript builds on understanding values, references, and operator behavior.",
    problemStatement:
      "Create variables using `const` and `let`, perform arithmetic and strict equality checks, then print formatted results to console.",
    inputExample: "const a=10, b='10'",
    outputExample: "sum=20\nstrictEqual=false",
    hints: [
      "Prefer `===` over `==`.",
      "Use template literals for readable output.",
      "Avoid mutating values declared with `const`.",
    ],
    constraints: ["Use console output only", "Use both `let` and `const`"],
    starterCode:
      "const a = 10;\nconst b = '10';\n// TODO: log sum and strict equality",
    solution:
      "const a = 10;\nconst b = '10';\nconst sum = a + Number(b);\nconsole.log(`sum=${sum}`);\nconsole.log(`strictEqual=${a === b}`);",
    testCases: [
      { input: "", expectedOutput: "sum=20", description: "numeric addition" },
      {
        input: "",
        expectedOutput: "strictEqual=false",
        description: "strict equality check",
      },
    ],
    xpReward: 90,
    difficulty: "easy",
  },
  {
    id: "js-ch-02-control-flow",
    title: "2. Control Flow",
    description: "if/else/switch, loops, break, continue.",
    theory:
      "### Topics Covered\n- `if`, `else if`, `else`, `switch`\n- `for`, `while`, `do...while`\n- `break` and `continue`\n\n### Why this matters\nControl flow is how programs make decisions and process repeated work reliably.",
    problemStatement:
      "Print numbers 1 to 20, but skip multiples of 3 using `continue`, and stop when number reaches 17 using `break`.",
    inputExample: "",
    outputExample: "1 2 4 5 7 8 10 11 13 14 16",
    hints: [
      "Check skip condition before stop condition carefully.",
      "Use an array accumulator then `join(' ')` for exact output.",
    ],
    constraints: ["Must use both `continue` and `break`"],
    starterCode: "// TODO: loop from 1..20 with rules",
    solution:
      "const out = [];\nfor (let i = 1; i <= 20; i++) {\n  if (i % 3 === 0) continue;\n  if (i >= 17) break;\n  out.push(i);\n}\nconsole.log(out.join(' '));",
    testCases: [
      {
        input: "",
        expectedOutput: "1 2 4 5 7 8 10 11 13 14 16",
        description: "loop controls",
      },
    ],
    xpReward: 100,
    difficulty: "easy",
  },
  {
    id: "js-ch-03-functions",
    title: "3. Functions",
    description:
      "Declarations, expressions, arrow functions, default/rest params, HOF.",
    theory:
      "### Topics Covered\n- Function declaration vs expression\n- Arrow functions\n- Default parameters and rest parameters\n- Return values\n- Higher-order functions\n\n### Why this matters\nFunctions are JavaScript’s primary abstraction tool and enable reusable, testable code.",
    problemStatement:
      "Create a higher-order function `applyDiscount(price, fn)` and pass an arrow function that applies a 10% discount. Print final value for 500.",
    inputExample: "500",
    outputExample: "450",
    hints: [
      "Higher-order means function accepts/returns function.",
      "Keep return values explicit.",
    ],
    constraints: [
      "Use arrow callback",
      "Use return values (no global mutation)",
    ],
    starterCode: "// TODO",
    solution:
      "function applyDiscount(price, fn) { return fn(price); }\nconst result = applyDiscount(500, (p) => p * 0.9);\nconsole.log(result);",
    testCases: [{ input: "", expectedOutput: "450", description: "10% off" }],
    xpReward: 110,
    difficulty: "medium",
  },
  {
    id: "js-ch-04-scope-execution",
    title: "4. Scope & Execution",
    description: "Global/local/block scope, lexical scope, hoisting, TDZ.",
    theory:
      "### Topics Covered\n- Global, function, and block scope\n- Lexical scope and scope chain\n- Hoisting behavior for `var`, function declarations\n- Temporal Dead Zone for `let`/`const`\n\n### Why this matters\nMost JavaScript bugs come from misunderstanding where variables live and when they’re accessible.",
    problemStatement:
      "Demonstrate lexical scope with nested functions and print a parent variable from child scope.",
    inputExample: "",
    outputExample: "outer-value",
    hints: [
      "Declare variable in outer function.",
      "Access it inside inner function.",
    ],
    constraints: ["Use nested functions"],
    starterCode: "// TODO",
    solution:
      "function outer() {\n  const msg = 'outer-value';\n  function inner() {\n    console.log(msg);\n  }\n  inner();\n}\nouter();",
    testCases: [
      {
        input: "",
        expectedOutput: "outer-value",
        description: "lexical scope",
      },
    ],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "js-ch-05-closures",
    title: "5. Closures (Important)",
    description: "Closure concept, loops, async closures, practical uses.",
    theory:
      "### Topics Covered\n- Closure definition (function + lexical environment)\n- Encapsulation/private state use cases\n- Closure pitfalls in loops\n- Closure behavior with async callbacks\n\n### Why this matters\nClosures power modules, memoization, hooks-like patterns, and async correctness.",
    problemStatement:
      "Build `createCounter()` closure that returns increment function. Call it three times and print 1,2,3.",
    inputExample: "",
    outputExample: "1\n2\n3",
    hints: ["Keep `count` inside factory function.", "Return inner function."],
    constraints: ["`count` must not be global"],
    starterCode: "// TODO",
    solution:
      "function createCounter() {\n  let count = 0;\n  return function () {\n    count += 1;\n    console.log(count);\n  };\n}\nconst next = createCounter();\nnext();\nnext();\nnext();",
    testCases: [
      { input: "", expectedOutput: "1\n2\n3", description: "state retained" },
    ],
    xpReward: 130,
    difficulty: "medium",
  },
  {
    id: "js-ch-06-this-keyword",
    title: "6. this Keyword",
    description: "Global/object context, arrow vs normal, call/apply/bind.",
    theory:
      "### Topics Covered\n- `this` in global, function, and object method contexts\n- Arrow function lexical `this`\n- `call`, `apply`, `bind` for explicit context control\n\n### Why this matters\nUnderstanding `this` is critical for object methods, class behavior, and event handlers.",
    problemStatement:
      "Create `person.fullName` method and reuse it for another object with `call`.",
    inputExample: "{first:'A',last:'B'}",
    outputExample: "A B",
    hints: [
      "Use normal function for dynamic `this`.",
      "Invoke with `.call(obj)`.",
    ],
    constraints: ["Must use call/apply/bind at least once"],
    starterCode: "// TODO",
    solution:
      "function fullName() { return `${this.first} ${this.last}`; }\nconst user = { first: 'A', last: 'B' };\nconsole.log(fullName.call(user));",
    testCases: [
      { input: "", expectedOutput: "A B", description: "context binding" },
    ],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "js-ch-07-objects",
    title: "7. Objects",
    description: "Object creation, methods, destructuring, Object.* helpers.",
    theory:
      "### Topics Covered\n- Object literals and dynamic properties\n- Methods and shorthand syntax\n- Destructuring objects\n- `Object.keys`, `Object.values`, `Object.entries`\n\n### Why this matters\nMost app data is represented as objects; fluent object operations are foundational.",
    problemStatement:
      "Given a user object, print all keys comma-separated and the role using destructuring.",
    inputExample: "{name:'Dev',role:'Engineer',exp:4}",
    outputExample: "name,role,exp\nEngineer",
    hints: ["Use Object.keys(user).", "Use `{ role } = user`."],
    constraints: ["Use both Object.keys and destructuring"],
    starterCode: "// TODO",
    solution:
      "const user = { name: 'Dev', role: 'Engineer', exp: 4 };\nconsole.log(Object.keys(user).join(','));\nconst { role } = user;\nconsole.log(role);",
    testCases: [
      {
        input: "",
        expectedOutput: "name,role,exp\nEngineer",
        description: "keys and field",
      },
    ],
    xpReward: 110,
    difficulty: "easy",
  },
  {
    id: "js-ch-08-arrays",
    title: "8. Arrays",
    description:
      "Array methods map/filter/reduce, find/some/every, spread/rest, destructuring.",
    theory:
      "### Topics Covered\n- Transformation: map/filter/reduce\n- Search and checks: find/some/every\n- Array destructuring\n- Spread/rest with arrays\n\n### Why this matters\nIdiomatic array methods reduce loops and improve readability.",
    problemStatement:
      "From [2,4,5,7], print sum of even numbers using filter + reduce.",
    inputExample: "[2,4,5,7]",
    outputExample: "6",
    hints: ["Filter evens first.", "Reduce with initial value 0."],
    constraints: ["Must use filter and reduce"],
    starterCode: "// TODO",
    solution:
      "const nums = [2, 4, 5, 7];\nconst total = nums.filter((n) => n % 2 === 0).reduce((a, b) => a + b, 0);\nconsole.log(total);",
    testCases: [{ input: "", expectedOutput: "6", description: "even sum" }],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "js-ch-09-advanced-data-structures",
    title: "9. Advanced Data Structures",
    description: "Map, Set, WeakMap, WeakSet usage patterns.",
    theory:
      "### Topics Covered\n- `Map` for key-value with non-string keys\n- `Set` for unique values\n- `WeakMap` and `WeakSet` for weakly held object references\n\n### Why this matters\nChoosing the right data structure improves performance and memory safety.",
    problemStatement:
      "Use Set to remove duplicates from [1,1,2,3,3] and print resulting length.",
    inputExample: "[1,1,2,3,3]",
    outputExample: "3",
    hints: [
      "`new Set(arr)` deduplicates.",
      "Use spread to convert back if needed.",
    ],
    constraints: ["Must use Set"],
    starterCode: "// TODO",
    solution:
      "const values = [1, 1, 2, 3, 3];\nconst unique = new Set(values);\nconsole.log(unique.size);",
    testCases: [
      { input: "", expectedOutput: "3", description: "deduplication" },
    ],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "js-ch-10-async-javascript",
    title: "10. Asynchronous JavaScript",
    description:
      "Callbacks, Promises, async/await, event loop, call stack and queues.",
    theory:
      "### Topics Covered\n- Callback pattern and callback hell risks\n- Promise states/chaining/error handling\n- `async`/`await` flow\n- Event loop model\n- Call stack, microtask queue, macrotask queue\n\n### Why this matters\nAsync correctness is mandatory for APIs, UI responsiveness, and production reliability.",
    problemStatement:
      "Create Promise resolved via setTimeout(0), then log sequence proving microtask runs before macrotask.",
    inputExample: "",
    outputExample: "sync\npromise\ntimeout",
    hints: [
      "Log sync first.",
      "Use Promise.resolve().then(...).",
      "Use setTimeout.",
    ],
    constraints: ["Must include both Promise and setTimeout"],
    starterCode: "// TODO",
    solution:
      "console.log('sync');\nPromise.resolve().then(() => console.log('promise'));\nsetTimeout(() => console.log('timeout'), 0);",
    testCases: [
      {
        input: "",
        expectedOutput: "sync\npromise\ntimeout",
        description: "event loop ordering",
      },
    ],
    xpReward: 140,
    difficulty: "hard",
  },
  {
    id: "js-ch-11-web-apis",
    title: "11. Web APIs",
    description: "setTimeout/setInterval, Fetch/AJAX, JSON handling.",
    theory:
      "### Topics Covered\n- Browser timers (`setTimeout`, `setInterval`)\n- Fetch API basics and response parsing\n- JSON stringify/parse\n\n### Why this matters\nWeb APIs are the bridge between JS runtime and browser capabilities.",
    problemStatement: 'Parse JSON string `{"ok":true}` and print `true`.',
    inputExample: '{"ok":true}',
    outputExample: "true",
    hints: ["Use JSON.parse.", "Read property from parsed object."],
    constraints: ["Must use JSON.parse"],
    starterCode: "// TODO",
    solution:
      "const raw = '{\"ok\":true}';\nconst obj = JSON.parse(raw);\nconsole.log(obj.ok);",
    testCases: [
      { input: "", expectedOutput: "true", description: "json parse" },
    ],
    xpReward: 100,
    difficulty: "easy",
  },
  {
    id: "js-ch-12-dom-manipulation",
    title: "12. DOM Manipulation",
    description: "Select/update/create/remove DOM nodes.",
    theory:
      "### Topics Covered\n- Selecting nodes (`querySelector`, `querySelectorAll`)\n- Updating content and styles\n- Creating/removing elements\n\n### Why this matters\nDOM manipulation powers dynamic user interfaces.",
    problemStatement:
      "Create a `<li>` element with text `Learn JS` and append it to `#todoList`.",
    inputExample: "<ul id='todoList'></ul>",
    outputExample: "li appended",
    hints: [
      "Use document.createElement.",
      "Set textContent.",
      "Append to target list.",
    ],
    constraints: ["Must use createElement and appendChild/append"],
    starterCode: "// TODO",
    solution:
      "const list = document.querySelector('#todoList');\nif (list) {\n  const li = document.createElement('li');\n  li.textContent = 'Learn JS';\n  list.append(li);\n}",
    testCases: [
      { input: "", expectedOutput: "li appended", description: "dom mutation" },
    ],
    xpReward: 110,
    difficulty: "medium",
  },
  {
    id: "js-ch-13-events",
    title: "13. Events",
    description: "Listeners, bubbling/capturing, delegation.",
    theory:
      "### Topics Covered\n- `addEventListener` basics\n- Propagation: capture vs bubble\n- Event delegation via parent listener\n\n### Why this matters\nEfficient event handling is essential for scalable UI behavior.",
    problemStatement:
      "Attach one click listener on `#list` and log clicked `<li>` text using event delegation.",
    inputExample: "ul#list > li*",
    outputExample: "clicked item text",
    hints: ["Use `event.target`.", "Guard with `matches('li')`."],
    constraints: ["Must use delegation (single parent listener)"],
    starterCode: "// TODO",
    solution:
      "const list = document.querySelector('#list');\nif (list) {\n  list.addEventListener('click', (event) => {\n    const target = event.target;\n    if (target instanceof HTMLLIElement) console.log(target.textContent);\n  });\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "clicked item text",
        description: "delegated click",
      },
    ],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "js-ch-14-forms-validation",
    title: "14. Forms & Validation",
    description: "Input handling, form events, validation patterns.",
    theory:
      "### Topics Covered\n- Reading input values\n- Form submit handling (`preventDefault`)\n- Required and custom validations\n\n### Why this matters\nValidation improves data quality and user experience.",
    problemStatement:
      "On form submit, prevent default and print `Valid` only when email contains '@'.",
    inputExample: "user@example.com",
    outputExample: "Valid",
    hints: ["Use submit listener.", "Use `.includes('@')`."],
    constraints: ["Must use preventDefault"],
    starterCode: "// TODO",
    solution:
      "const form = document.querySelector('#signupForm');\nconst emailInput = document.querySelector('#email');\nif (form && emailInput instanceof HTMLInputElement) {\n  form.addEventListener('submit', (e) => {\n    e.preventDefault();\n    console.log(emailInput.value.includes('@') ? 'Valid' : 'Invalid');\n  });\n}",
    testCases: [
      { input: "", expectedOutput: "Valid", description: "contains @" },
      { input: "", expectedOutput: "Invalid", description: "missing @" },
    ],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "js-ch-15-error-handling",
    title: "15. Error Handling",
    description: "try/catch/finally, throw, custom error classes.",
    theory:
      "### Topics Covered\n- `try/catch/finally`\n- Throwing built-in/custom errors\n- Error boundary design in async and sync flows\n\n### Why this matters\nResilient applications fail gracefully and surface actionable error messages.",
    problemStatement:
      "Write function `parseAge` that throws error for negative age; catch and print message.",
    inputExample: "-1",
    outputExample: "Age cannot be negative",
    hints: ["Validate input before return.", "Throw `new Error(...)`."],
    constraints: ["Must use try/catch"],
    starterCode: "// TODO",
    solution:
      "function parseAge(age) {\n  if (age < 0) throw new Error('Age cannot be negative');\n  return age;\n}\ntry {\n  console.log(parseAge(-1));\n} catch (err) {\n  if (err instanceof Error) console.log(err.message);\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "Age cannot be negative",
        description: "thrown and handled",
      },
    ],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "js-ch-16-es6-features",
    title: "16. ES6+ Features",
    description:
      "Template literals, destructuring, modules, optional chaining, nullish coalescing, classes.",
    theory:
      "### Topics Covered\n- Template literals\n- Array/object destructuring\n- `import`/`export` module mindset\n- Optional chaining (`?.`) and nullish coalescing (`??`)\n- Spread/rest and classes\n\n### Why this matters\nModern JavaScript syntax boosts clarity and maintainability.",
    problemStatement:
      "Given `const user = { profile: { city: 'Pune' } }`, print city via optional chaining and default with nullish coalescing.",
    inputExample: "user object",
    outputExample: "Pune",
    hints: ["Use `user.profile?.city ?? 'Unknown'`"],
    constraints: ["Must use both `?.` and `??`"],
    starterCode: "// TODO",
    solution:
      "const user = { profile: { city: 'Pune' } };\nconst city = user.profile?.city ?? 'Unknown';\nconsole.log(city);",
    testCases: [
      { input: "", expectedOutput: "Pune", description: "safe access" },
    ],
    xpReward: 110,
    difficulty: "easy",
  },
  {
    id: "js-ch-17-oop",
    title: "17. OOP in JavaScript",
    description:
      "Prototypes, prototype chain, classes, inheritance, polymorphism.",
    theory:
      "### Topics Covered\n- Prototype-based inheritance model\n- `class` syntax over prototypes\n- `extends`, `super`, method overriding\n- Encapsulation with private fields and method polymorphism\n\n### Why this matters\nOOP helps model entities and behavior in larger applications.",
    problemStatement:
      "Create class `Animal` with `speak()`, subclass `Dog` overriding `speak()`, then print overridden output.",
    inputExample: "",
    outputExample: "Woof",
    hints: ["Use `extends`.", "Override method in child class."],
    constraints: ["Must use class inheritance"],
    starterCode: "// TODO",
    solution:
      "class Animal { speak() { return '...'; } }\nclass Dog extends Animal { speak() { return 'Woof'; } }\nconsole.log(new Dog().speak());",
    testCases: [{ input: "", expectedOutput: "Woof", description: "override" }],
    xpReward: 130,
    difficulty: "medium",
  },
  {
    id: "js-ch-18-functional-programming",
    title: "18. Functional Programming",
    description: "Pure functions, immutability, currying, composition.",
    theory:
      "### Topics Covered\n- Pure vs impure functions\n- Immutability patterns\n- Currying\n- Function composition\n\n### Why this matters\nFP patterns reduce side effects and make code predictable/testable.",
    problemStatement:
      "Implement curried add function `add(a)(b)` and print add(2)(5).",
    inputExample: "2, 5",
    outputExample: "7",
    hints: ["Return function from function.", "Avoid shared mutable state."],
    constraints: ["Must implement currying"],
    starterCode: "// TODO",
    solution: "const add = (a) => (b) => a + b;\nconsole.log(add(2)(5));",
    testCases: [
      { input: "", expectedOutput: "7", description: "curried output" },
    ],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "js-ch-19-memory-performance",
    title: "19. Memory & Performance",
    description: "Stack/heap, GC, leaks, optimization basics.",
    theory:
      "### Topics Covered\n- Stack vs heap allocations\n- Garbage collection high-level model\n- Common memory leaks (dangling listeners, retained closures)\n- Performance profiling basics\n\n### Why this matters\nEfficient memory use keeps apps responsive and stable at scale.",
    problemStatement:
      "Create an expensive computation function and memoize it with closure cache object.",
    inputExample: "fib-like repeated calls",
    outputExample: "cache hits on repeated inputs",
    hints: [
      "Use object/Map cache in closure.",
      "Return cached value when available.",
    ],
    constraints: ["Must memoize repeated calls"],
    starterCode: "// TODO",
    solution:
      "function memoize(fn) {\n  const cache = new Map();\n  return function (n) {\n    if (cache.has(n)) return cache.get(n);\n    const result = fn(n);\n    cache.set(n, result);\n    return result;\n  };\n}\nconst square = memoize((n) => n * n);\nconsole.log(square(9));\nconsole.log(square(9));",
    testCases: [
      { input: "", expectedOutput: "81", description: "computed value" },
      { input: "", expectedOutput: "81", description: "cached reuse" },
    ],
    xpReward: 140,
    difficulty: "hard",
  },
  {
    id: "js-ch-20-advanced-concepts",
    title: "20. Advanced Concepts",
    description:
      "Debounce/throttle, memoization, generators, iterators, proxy/reflect, workers.",
    theory:
      "### Topics Covered\n- Debouncing vs throttling\n- Memoization patterns\n- Generators/iterators protocol\n- Proxy/Reflect interception\n- Web Workers and Service Workers overview\n\n### Why this matters\nThese concepts are common in high-scale, performance-sensitive JavaScript systems.",
    problemStatement:
      "Implement a debounce utility and demonstrate single invocation despite rapid calls.",
    inputExample: "debounce(fn, 300)",
    outputExample: "handler called once",
    hints: ["Use closure timer id.", "clearTimeout before new timeout."],
    constraints: ["Must use setTimeout + clearTimeout"],
    starterCode: "// TODO",
    solution:
      "function debounce(fn, wait) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), wait);\n  };\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "handler called once",
        description: "debounce behavior",
      },
    ],
    xpReward: 150,
    difficulty: "hard",
  },
  {
    id: "js-ch-21-javascript-environment",
    title: "21. JavaScript Environment",
    description:
      "Browser, DOM, BOM, Node.js, modules, filesystem, event-driven architecture.",
    theory:
      "### Topics Covered\n- Browser runtime, DOM, BOM (`window`, `navigator`, `location`)\n- Node.js runtime and event-driven architecture\n- Module systems (`ESM`/`CommonJS`)\n- File system basics in Node (`fs`)\n\n### Why this matters\nProduction engineers must reason about runtime differences between browser and server.",
    problemStatement:
      "In Node.js, read a file asynchronously using `fs.promises.readFile` and print first line.",
    inputExample: "notes.txt",
    outputExample: "first line text",
    hints: [
      "Use `import { readFile } from 'node:fs/promises'`.",
      "Split by newline.",
    ],
    constraints: ["Node.js environment required"],
    starterCode: "// TODO",
    solution:
      "import { readFile } from 'node:fs/promises';\n\nasync function run() {\n  const raw = await readFile('notes.txt', 'utf8');\n  console.log(raw.split(/\\r?\\n/)[0] ?? '');\n}\nrun();",
    testCases: [
      {
        input: "",
        expectedOutput: "first line text",
        description: "filesystem async read",
      },
    ],
    xpReward: 160,
    difficulty: "hard",
  },
];

const jsChapters: SeedChapter[] = jsTopics.map((topic, chapterIndex) => ({
  id: topic.id,
  title: topic.title,
  description: topic.description,
  order: chapterIndex + 1,
  exercises: buildExercises(topic),
}));

export async function seedJsCourse() {
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
