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

export async function seedCssCourse() {
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

export const CSS_COURSE_ID = CSS_COURSE.id;
