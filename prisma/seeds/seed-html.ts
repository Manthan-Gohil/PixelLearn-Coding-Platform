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

export async function seedHtmlCourse() {
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

export const HTML_COURSE_ID = HTML_COURSE.id;
