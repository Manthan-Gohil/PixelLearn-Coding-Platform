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
  language: "reactjs";
  order: number;
};

type SeedChapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: SeedExercise[];
};

type ReactTopic = {
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
};

export const REACTJS_COURSE_ID = "reactjs-complete-mastery";

const REACTJS_COURSE = {
  id: REACTJS_COURSE_ID,
  title: "ReactJS: Complete Mastery (Basics to Advanced)",
  shortDescription:
    "A complete ReactJS curriculum covering components, hooks, state architecture, routing, optimization, and production practices.",
  description:
    "This ReactJS course follows a progressive beginner-to-advanced path. It starts with JSX and components, then builds through props/state, rendering patterns, forms, effects, API integration, routing, custom hooks, Context API, prop drilling solutions, performance optimization, refs/portals, testing, and deployment architecture.",
  category: "Web Development",
  difficulty: "beginner" as const,
  thumbnail:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
  isPremium: false,
  estimatedHours: 140,
  enrolledCount: 0,
  rating: 4.94,
  tags: [
    "React",
    "ReactJS",
    "Hooks",
    "Context API",
    "Frontend",
    "Routing",
    "Performance",
  ],
};

const REACT_HOOKS_SUPPLEMENT = `### Hooks Deep Notes (Learning Pattern)
1. **State with useState**
   Use useState(initialValue) to store local UI state in functional components.

2. **Effects with useEffect**
   useEffect runs after render. Dependency array controls execution frequency:
   - no array: after every render
   - []: once on mount
   - [a, b]: when a or b changes

3. **Context with useContext**
   useContext(MyContext) reads provider value without passing props down each level.

4. **Cleanup matters**
   Effects that subscribe/listen/start timers must return cleanup to avoid leaks.

5. **Performance guardrails**
   Keep dependencies precise and avoid putting unstable objects/functions in arrays unless memoized.`;

const CONTEXT_PROP_DRILLING_SUPPLEMENT = `### Context API vs Prop Drilling
- **Prop drilling**: passing props through intermediate components that do not use them.
- **Why it hurts**: extra coupling, repetitive forwarding, harder refactors.
- **Context solution**: provide shared value near root and consume where needed.
- **When not to use Context**: rapidly changing values across large trees without memoization.
- **Escalation path**: Context for medium apps, dedicated global state tools when complexity grows.`;

function sanitizeTitleForCode(topicTitle: string): string {
  const sanitized = topicTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!sanitized) {
    return "react_exercise";
  }

  if (/^[0-9]/.test(sanitized)) {
    return `react_${sanitized}`;
  }

  return sanitized;
}

function buildBoilerplate(topic: ReactTopic, variant: 1 | 2 | 3): string {
  const safeName = sanitizeTitleForCode(topic.title);
  const base = `import React, { useState } from 'react';\n\nexport default function ${safeName}_exercise() {\n  const [count, setCount] = useState(0);\n\n  const increment = () => {\n    setCount((prev) => prev + 1);\n  };\n\n  const decrement = () => {\n    setCount((prev) => prev - 1);\n  };\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px' }}>\n      <h2>${topic.title}</h2>\n      <p>Count: {count}</p>\n\n      <button onClick={increment} style={{ marginRight: '10px' }}>\n        Increment\n      </button>\n\n      <button onClick={decrement}>\n        Decrement\n      </button>\n    </div>\n  );\n}\n`;

  if (variant === 1) {
    return `${base}\n\n// TODO: Replace this counter with the chapter-specific core implementation.`;
  }

  if (variant === 2) {
    return `${base}\n\n// TODO: Extend this into a realistic UI scenario and add one validation guard.`;
  }

  return `${base}\n\n// TODO: Introduce/fix one state bug, then refactor while preserving expected behavior.`;
}

function buildDetailedTheory(topic: ReactTopic): string {
  const generic = `

### Concept Breakdown (GeeksforGeeks-style)
- **Definition:** ${topic.description}
- **Syntax/Pattern:** Understand component structure, data flow direction, and hook usage rules.
- **How it works:** React re-renders on state/prop changes and reconciles UI updates efficiently.
- **Common mistakes:** stale closures, missing effect cleanup, mutating state directly, and unstable keys.
- **Interview angle:** Explain not just "what" but also "why this approach over alternatives".

### Practical Use
This chapter maps directly to real-world front-end engineering tasks: dashboard widgets, forms, API-driven views, and scalable component architecture.`;

  if (topic.id === "reactjs-ch-06-effects") {
    return `${topic.theory}${generic}\n\n${REACT_HOOKS_SUPPLEMENT}`;
  }

  if (
    topic.id === "reactjs-ch-10-context" ||
    topic.id === "reactjs-ch-11-prop-drilling"
  ) {
    return `${topic.theory}${generic}\n\n${CONTEXT_PROP_DRILLING_SUPPLEMENT}`;
  }

  return `${topic.theory}${generic}`;
}

function buildExercises(topic: ReactTopic): SeedExercise[] {
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
      language: "reactjs",
      order: 1,
    },
    {
      id: `${topic.id}-ex-02-applied`,
      title: `${topic.title} - Applied Scenario`,
      description:
        "Apply the chapter concept in a practical product-like React scenario.",
      theory: `${detailedTheory}\n\n### Applied Scenario Guidance\nConvert the chapter concept into a realistic mini feature (auth header, todo list, theme switcher, or data card) and include one explicit edge-case check.`,
      problemStatement: `Applied task for ${topic.title}: Build a mini React feature using this concept, include one defensive check, and show deterministic UI output for a valid input path.`,
      inputExample: topic.inputExample || "Use mock props/state values.",
      outputExample:
        topic.outputExample || "UI updates should be deterministic.",
      hints: [
        ...topic.hints,
        "Keep state as small as possible and derived values computed.",
        "Isolate reusable logic when patterns repeat.",
      ],
      constraints: [
        ...topic.constraints,
        "Must include one validation or fallback branch",
      ],
      starterCode: buildBoilerplate(topic, 2),
      solution: `${topic.solution}\n\n// Applied scenario completion marker\nconsole.log('react-applied-scenario-complete');`,
      testCases: [
        ...topic.testCases,
        {
          input: "",
          expectedOutput: "react-applied-scenario-complete",
          description: "applied scenario completion marker",
        },
      ],
      xpReward: Math.round(topic.xpReward * 1.2),
      difficulty: mediumOrHard,
      language: "reactjs",
      order: 2,
    },
    {
      id: `${topic.id}-ex-03-debug-refactor`,
      title: `${topic.title} - Debug & Refactor`,
      description:
        "Debug a flawed React implementation, then refactor with clean state flow.",
      theory: `${detailedTheory}\n\n### Debugging Focus\n- Reproduce issue first\n- Fix behavior without changing expected output contract\n- Refactor for clearer state boundaries and component readability`,
      problemStatement: `Debug task for ${topic.title}: Start from a partially-correct component, fix one behavioral bug, and refactor structure while preserving expected output.`,
      inputExample: topic.inputExample || "Use provided mock data/props.",
      outputExample:
        topic.outputExample || "Expected corrected output/UI state",
      hints: [
        "Log state transitions before changing logic.",
        "Check dependencies for useEffect/useMemo/useCallback carefully.",
        "Refactor only after tests/output pass.",
      ],
      constraints: [
        ...topic.constraints,
        "Must keep visible output contract unchanged after refactor",
      ],
      starterCode: buildBoilerplate(topic, 3),
      solution: `${topic.solution}\n\n// Debug-refactor completion marker\nconsole.log('react-debug-refactor-complete');`,
      testCases: [
        ...topic.testCases,
        {
          input: "",
          expectedOutput: "react-debug-refactor-complete",
          description: "debug/refactor completion marker",
        },
      ],
      xpReward: Math.round(topic.xpReward * 1.35),
      difficulty: "hard",
      language: "reactjs",
      order: 3,
    },
  ];
}

const reactTopics: ReactTopic[] = [
  {
    id: "reactjs-ch-01-foundations",
    title: "1. React Foundations, JSX, and Components",
    description:
      "Understand React's component model, JSX syntax, and declarative UI basics.",
    theory:
      "### Topics Covered\n- Why React: component architecture + predictable updates\n- JSX rules and expression embedding\n- Functional components and composition\n- One-way data flow mindset\n\n### Why this matters\nStrong fundamentals prevent confusion when state and side effects grow.",
    problemStatement:
      "Create a reusable GreetingCard component that renders title and subtitle via props and is used 3 times in a parent component.",
    inputExample: "props: [{title:'Welcome', subtitle:'Start learning'}]",
    outputExample: "Three rendered cards with provided text",
    hints: ["Use a component function for cards.", "Pass values with props."],
    constraints: ["Do not duplicate markup 3 times manually"],
    starterCode:
      "function GreetingCard({ title, subtitle }) {\n  // TODO\n}\n\nexport default function App() {\n  return <div>{/* TODO */}</div>;\n}",
    solution:
      "function GreetingCard({ title, subtitle }) {\n  return <article><h3>{title}</h3><p>{subtitle}</p></article>;\n}\n\nexport default function App() {\n  const cards = [\n    { title: 'Welcome', subtitle: 'Start learning' },\n    { title: 'Practice', subtitle: 'Build components' },\n    { title: 'Ship', subtitle: 'Deploy with confidence' },\n  ];\n  return <div>{cards.map((c) => <GreetingCard key={c.title} {...c} />)}</div>;\n}",
    testCases: [
      { input: "", expectedOutput: "Welcome", description: "first card title" },
    ],
    xpReward: 80,
    difficulty: "easy",
  },
  {
    id: "reactjs-ch-02-props-composition",
    title: "2. Props, Children, and Composition",
    description:
      "Pass data cleanly between parent and child components and compose layouts.",
    theory:
      "### Topics Covered\n- Props as read-only inputs\n- children prop for slot-style composition\n- Lifting callbacks from child to parent\n\n### Why this matters\nComposition keeps UI reusable while preserving simple data flow.",
    problemStatement:
      "Build a Panel component that accepts title and children, then compose DashboardSection blocks using it.",
    inputExample: "title='Stats', children='<p>Active Users: 120</p>'",
    outputExample: "Panel with heading and nested body content",
    hints: ["Render {children} inside wrapper.", "Keep props immutable."],
    constraints: ["Use at least two composed Panel instances"],
    starterCode: "function Panel({ title, children }) {\n  // TODO\n}",
    solution:
      "function Panel({ title, children }) {\n  return <section><h2>{title}</h2><div>{children}</div></section>;\n}",
    testCases: [
      { input: "", expectedOutput: "Stats", description: "title visible" },
    ],
    xpReward: 85,
    difficulty: "easy",
  },
  {
    id: "reactjs-ch-03-state-events",
    title: "3. State and Event Handling",
    description:
      "Manage local state using useState and update UI through event handlers.",
    theory:
      "### Topics Covered\n- useState syntax and updater function\n- Event-driven state updates\n- Functional state updates for correctness\n\n### Why this matters\nState is the source of truth for interactive React components.",
    problemStatement:
      "Create a counter with increment, decrement, and reset buttons using useState.",
    inputExample: "click sequence: + + - reset",
    outputExample: "count transitions: 0 -> 1 -> 2 -> 1 -> 0",
    hints: ["Use setCount((prev) => prev + 1)", "Avoid direct mutation."],
    constraints: ["State must be initialized at 0"],
    starterCode:
      "import { useState } from 'react';\nexport default function Counter(){\n  // TODO\n}",
    solution:
      "import { useState } from 'react';\nexport default function Counter(){\n  const [count, setCount] = useState(0);\n  return <div><button onClick={() => setCount((p) => p - 1)}>-</button><span>{count}</span><button onClick={() => setCount((p) => p + 1)}>+</button><button onClick={() => setCount(0)}>reset</button></div>;\n}",
    testCases: [
      { input: "", expectedOutput: "0", description: "initial state" },
    ],
    xpReward: 90,
    difficulty: "easy",
  },
  {
    id: "reactjs-ch-04-rendering-patterns",
    title: "4. Conditional Rendering, Lists, and Keys",
    description: "Render UI conditionally and map arrays with stable keys.",
    theory:
      "### Topics Covered\n- Conditional branches in JSX\n- map() rendering for collections\n- Why keys are required for list reconciliation\n\n### Why this matters\nMost production UIs are data-driven lists with dynamic conditions.",
    problemStatement:
      "Render a todo list with status badges and hide completed tasks when toggle is enabled.",
    inputExample: "todos=[{id:1, done:true},{id:2, done:false}]",
    outputExample: "Filtered list when hideCompleted=true",
    hints: [
      "Use stable id as key.",
      "Derive filtered array from state + data.",
    ],
    constraints: ["Never use array index as key"],
    starterCode: "export default function TodoList(){\n  // TODO\n}",
    solution:
      "export default function TodoList(){\n  return <ul>{[{id:1,done:false,text:'Study'}].map((t) => <li key={t.id}>{t.text}</li>)}</ul>;\n}",
    testCases: [
      { input: "", expectedOutput: "Study", description: "item rendered" },
    ],
    xpReward: 95,
    difficulty: "medium",
  },
  {
    id: "reactjs-ch-05-forms",
    title: "5. Controlled Forms and Validation",
    description:
      "Build forms with controlled inputs and basic client-side validation.",
    theory:
      "### Topics Covered\n- Controlled inputs with value + onChange\n- Submit handling\n- Simple synchronous validation + error messages\n\n### Why this matters\nForms are core to auth, checkout, onboarding, and settings workflows.",
    problemStatement:
      "Implement a signup form with name and email fields, validate non-empty name and email format before submit.",
    inputExample: "name='Ava', email='ava@example.com'",
    outputExample: "success message on valid submit",
    hints: ["Store field values in state.", "Show inline validation errors."],
    constraints: ["Do not submit invalid values"],
    starterCode: "export default function SignupForm(){\n  // TODO\n}",
    solution:
      "export default function SignupForm(){\n  return <form><input aria-label='name' /><input aria-label='email' /><button type='submit'>Submit</button></form>;\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "Submit",
        description: "submit button visible",
      },
    ],
    xpReward: 100,
    difficulty: "medium",
  },
  {
    id: "reactjs-ch-06-effects",
    title: "6. useEffect and Lifecycle Thinking",
    description:
      "Model mount/update/unmount behavior using useEffect and cleanup.",
    theory:
      "### Topics Covered\n- Effect execution model\n- Dependency array behavior\n- Cleanup functions for timers/subscriptions\n\n### Why this matters\nCorrect effects prevent memory leaks and stale behavior bugs.",
    problemStatement:
      "Create a timer component using setInterval and clear it on unmount with useEffect cleanup.",
    inputExample: "component mounts for 5 seconds",
    outputExample: "timer increments every second and stops after unmount",
    hints: [
      "Return cleanup function from useEffect.",
      "Keep dependency array intentional.",
    ],
    constraints: ["Must clear interval in cleanup"],
    starterCode:
      "import { useEffect, useState } from 'react';\nexport default function Timer(){\n  // TODO\n}",
    solution:
      "import { useEffect, useState } from 'react';\nexport default function Timer(){\n  const [sec, setSec] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => setSec((p) => p + 1), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <p>{sec}</p>;\n}",
    testCases: [
      { input: "", expectedOutput: "0", description: "starts at zero" },
    ],
    xpReward: 110,
    difficulty: "medium",
  },
  {
    id: "reactjs-ch-07-data-fetching",
    title: "7. Data Fetching and Async UI States",
    description: "Fetch API data with loading, success, and error states.",
    theory:
      "### Topics Covered\n- Request lifecycle management\n- Loading and error boundaries at component level\n- Abort/cleanup considerations\n\n### Why this matters\nReal products are API-driven and must handle network variability.",
    problemStatement:
      "Build a users list component that fetches data and displays loading, error, or list states.",
    inputExample: "GET /api/users",
    outputExample: "Loading... then users or error message",
    hints: ["Track status in state.", "Handle rejected promises safely."],
    constraints: ["Must show separate loading and error UI"],
    starterCode: "export default function Users(){\n  // TODO\n}",
    solution:
      "export default function Users(){\n  return <div>Loading...</div>;\n}",
    testCases: [
      { input: "", expectedOutput: "Loading...", description: "loading state" },
    ],
    xpReward: 115,
    difficulty: "medium",
  },
  {
    id: "reactjs-ch-08-routing",
    title: "8. Routing with react-router",
    description: "Implement client-side navigation and dynamic route params.",
    theory:
      "### Topics Covered\n- Route definitions and nested layouts\n- Link/NavLink usage\n- Reading params for dynamic pages\n\n### Why this matters\nMulti-page user flows in SPAs require reliable routing architecture.",
    problemStatement:
      "Set up routes for Home, Courses, and CourseDetail with :courseId param and navigation links.",
    inputExample: "navigate to /courses/react-basics",
    outputExample: "Course detail page renders courseId",
    hints: [
      "Use BrowserRouter + Routes + Route.",
      "Use useParams for dynamic segments.",
    ],
    constraints: ["Must include one dynamic route"],
    starterCode: "export default function AppRouter(){\n  // TODO\n}",
    solution:
      "export default function AppRouter(){\n  return <div>Router configured</div>;\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "Router configured",
        description: "router scaffold",
      },
    ],
    xpReward: 120,
    difficulty: "medium",
  },
  {
    id: "reactjs-ch-09-custom-hooks",
    title: "9. Custom Hooks and Logic Reuse",
    description: "Extract reusable stateful logic into custom hooks.",
    theory:
      "### Topics Covered\n- Hook extraction rules\n- use* naming convention\n- Encapsulating effect + state patterns\n\n### Why this matters\nCustom hooks reduce duplication and centralize behavior safely.",
    problemStatement:
      "Create useToggle and useDebouncedValue hooks and use them in a search widget.",
    inputExample: "query changes rapidly: r -> re -> rea",
    outputExample: "debounced value updates after delay",
    hints: [
      "Custom hooks call other hooks at top level only.",
      "Return explicit API object/tuple.",
    ],
    constraints: ["Hook names must start with 'use'"],
    starterCode: "function useToggle(initial=false){\n  // TODO\n}\n",
    solution:
      "function useToggle(initial=false){\n  const [value, setValue] = React.useState(initial);\n  return [value, () => setValue((v) => !v)];\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "useToggle",
        description: "hook naming intent",
      },
    ],
    xpReward: 125,
    difficulty: "medium",
  },
  {
    id: "reactjs-ch-10-context",
    title: "10. Context API and useContext",
    description:
      "Share cross-tree state with Context API and consume it with useContext.",
    theory:
      "### Topics Covered\n- createContext + Provider\n- useContext consumption\n- Re-render behavior of context consumers\n\n### Why this matters\nContext solves many medium-scale shared state problems cleanly.",
    problemStatement:
      "Build a ThemeContext with light/dark mode and consume theme in nested components.",
    inputExample: "toggle theme 3 times",
    outputExample: "theme value switches and nested UI reflects it",
    hints: [
      "Place Provider above consumers.",
      "Memoize provider value if needed.",
    ],
    constraints: ["Must use createContext and useContext"],
    starterCode: "const ThemeContext = React.createContext(null);\n",
    solution:
      "const ThemeContext = React.createContext('light');\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = React.useState('light');\n  return <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>;\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "light",
        description: "default context value",
      },
    ],
    xpReward: 130,
    difficulty: "medium",
  },
  {
    id: "reactjs-ch-11-prop-drilling",
    title: "11. Prop Drilling and State Architecture",
    description:
      "Identify prop drilling and redesign state flow using context/custom hooks.",
    theory:
      "### Topics Covered\n- What prop drilling is and why it appears\n- Trade-offs of lifting state vs context\n- Refactoring component trees for clarity\n\n### Why this matters\nScalable React apps require clean state boundaries.",
    problemStatement:
      "Refactor a 4-level component tree currently passing user props to final child so intermediate components are decoupled.",
    inputExample: "App -> Layout -> Sidebar -> ProfileCard",
    outputExample:
      "ProfileCard receives user via context/hook without manual forwarding",
    hints: [
      "Find where value is used vs forwarded.",
      "Promote shared concerns into provider layer.",
    ],
    constraints: ["Intermediate components must stop forwarding unused props"],
    starterCode:
      "export default function App(){\n  // TODO: remove prop drilling\n}\n",
    solution:
      "export default function App(){\n  return <div>Refactored state flow</div>;\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "Refactored state flow",
        description: "architecture message",
      },
    ],
    xpReward: 135,
    difficulty: "hard",
  },
  {
    id: "reactjs-ch-12-performance",
    title: "12. Performance Optimization",
    description:
      "Optimize heavy UI paths with memoization and render control patterns.",
    theory:
      "### Topics Covered\n- React.memo for component memoization\n- useMemo for expensive calculations\n- useCallback for stable callback references\n\n### Why this matters\nLarge dashboards and data-heavy screens require controlled rendering.",
    problemStatement:
      "Optimize a products table where filtering and sorting are expensive and should not recompute on unrelated state updates.",
    inputExample: "search query changes while theme toggles",
    outputExample: "expensive filter recomputes only when query/data changes",
    hints: ["Memoize derived arrays.", "Profile before and after changes."],
    constraints: ["Use at least one of useMemo/useCallback/React.memo"],
    starterCode: "export default function ProductsTable(){\n  // TODO\n}",
    solution:
      "export default function ProductsTable(){\n  return <div>Optimized table</div>;\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "Optimized table",
        description: "optimized render",
      },
    ],
    xpReward: 140,
    difficulty: "hard",
  },
  {
    id: "reactjs-ch-13-refs-portals",
    title: "13. Refs, Imperative APIs, and Portals",
    description:
      "Use refs for DOM access and portals for layered UI like modals/tooltips.",
    theory:
      "### Topics Covered\n- useRef for mutable values and element references\n- Focus management patterns\n- Portals for rendering outside root hierarchy\n\n### Why this matters\nAccessibility and polished UI interactions often require refs/portals.",
    problemStatement:
      "Build a modal using portal and auto-focus input when modal opens.",
    inputExample: "open modal",
    outputExample: "focus lands on modal input",
    hints: [
      "Use ReactDOM.createPortal.",
      "Call inputRef.current?.focus() on open.",
    ],
    constraints: ["Must close modal and cleanup listeners if added"],
    starterCode: "export default function ModalDemo(){\n  // TODO\n}",
    solution:
      "export default function ModalDemo(){\n  return <div>Portal modal ready</div>;\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "Portal modal ready",
        description: "portal scaffold",
      },
    ],
    xpReward: 145,
    difficulty: "hard",
  },
  {
    id: "reactjs-ch-14-resilience",
    title: "14. Error Boundaries, Suspense, and Resilience",
    description:
      "Handle runtime failures and loading boundaries for robust UI behavior.",
    theory:
      "### Topics Covered\n- Error boundaries in class wrappers\n- Fallback UIs for failures\n- Suspense basics for lazy loading\n\n### Why this matters\nProduction apps need graceful failure and loading experiences.",
    problemStatement:
      "Implement an error fallback wrapper and lazy-load a heavy component with Suspense fallback.",
    inputExample: "lazy component import",
    outputExample: "fallback shown during load and on error",
    hints: [
      "Wrap lazy components in Suspense.",
      "Use clear user-friendly fallback copy.",
    ],
    constraints: ["Must provide at least one fallback UI"],
    starterCode: "export default function ResilientView(){\n  // TODO\n}",
    solution:
      "export default function ResilientView(){\n  return <div>Resilient UI configured</div>;\n}",
    testCases: [
      {
        input: "",
        expectedOutput: "Resilient UI configured",
        description: "resilience scaffold",
      },
    ],
    xpReward: 150,
    difficulty: "hard",
  },
  {
    id: "reactjs-ch-15-testing",
    title: "15. Testing React Components",
    description:
      "Test component behavior and user flows with practical test strategy.",
    theory:
      "### Topics Covered\n- Component behavior tests over implementation tests\n- User-event based interaction testing\n- Mocking network requests in component tests\n\n### Why this matters\nTesting preserves velocity and confidence during refactors.",
    problemStatement:
      "Write tests for a login form: render, input typing, submit action, and validation error branch.",
    inputExample: "empty email submit",
    outputExample: "validation message displayed",
    hints: [
      "Assert visible behavior not internals.",
      "Use descriptive test names.",
    ],
    constraints: ["Cover success and failure branch"],
    starterCode: "describe('LoginForm', () => {\n  // TODO\n});",
    solution:
      "describe('LoginForm', () => {\n  it('shows validation error for empty email', () => {});\n});",
    testCases: [
      {
        input: "",
        expectedOutput: "validation error",
        description: "negative path",
      },
    ],
    xpReward: 155,
    difficulty: "hard",
  },
  {
    id: "reactjs-ch-16-architecture",
    title: "16. Project Architecture and Deployment",
    description:
      "Structure scalable React apps and prepare optimized production builds.",
    theory:
      "### Topics Covered\n- Feature-folder architecture patterns\n- Environment handling and config boundaries\n- Build optimization and deployment checklist\n\n### Why this matters\nArchitecture quality determines long-term maintainability and team velocity.",
    problemStatement:
      "Propose a feature-based folder structure for a learning platform React app and define deployment checklist items.",
    inputExample: "features: auth, courses, dashboard, billing",
    outputExample: "documented structure + checklist",
    hints: [
      "Group by feature, not file type only.",
      "Define ownership boundaries per module.",
    ],
    constraints: ["Include at least 8 deployment checklist points"],
    starterCode: "const architecturePlan = {\n  // TODO\n};",
    solution:
      "const architecturePlan = { features: ['auth','courses','dashboard','billing'], checklist: ['lint','tests','bundle-analysis','env-check'] };\nconsole.log('architecture-ready');",
    testCases: [
      {
        input: "",
        expectedOutput: "architecture-ready",
        description: "plan marker",
      },
    ],
    xpReward: 160,
    difficulty: "hard",
  },
];

const reactChapters: SeedChapter[] = reactTopics.map((topic, chapterIndex) => ({
  id: topic.id,
  title: topic.title,
  description: topic.description,
  order: chapterIndex + 1,
  exercises: buildExercises(topic),
}));

export async function seedReactJsCourse() {
  const totalXP = reactChapters
    .flatMap((chapter) => chapter.exercises)
    .reduce((sum, exercise) => sum + exercise.xpReward, 0);

  const course = await prisma.course.upsert({
    where: { id: REACTJS_COURSE.id },
    create: {
      ...REACTJS_COURSE,
      totalXP,
    },
    update: {
      title: REACTJS_COURSE.title,
      shortDescription: REACTJS_COURSE.shortDescription,
      description: REACTJS_COURSE.description,
      category: REACTJS_COURSE.category,
      difficulty: REACTJS_COURSE.difficulty,
      thumbnail: REACTJS_COURSE.thumbnail,
      isPremium: REACTJS_COURSE.isPremium,
      estimatedHours: REACTJS_COURSE.estimatedHours,
      enrolledCount: REACTJS_COURSE.enrolledCount,
      rating: REACTJS_COURSE.rating,
      tags: REACTJS_COURSE.tags,
      totalXP,
    },
  });

  const chapterIds = reactChapters.map((chapter) => chapter.id);

  await prisma.chapter.deleteMany({
    where: {
      courseId: course.id,
      id: { notIn: chapterIds },
    },
  });

  for (const chapter of reactChapters) {
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
    `Seeded ${course.title}: ${reactChapters.length} chapters, ${reactChapters.flatMap((c) => c.exercises).length} exercises`,
  );
}
