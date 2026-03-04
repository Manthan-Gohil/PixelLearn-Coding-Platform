import { FlowchartNode, FlowchartEdge } from "@/types";

/**
 * Dynamically generates a flowchart from exercise data.
 * Parses the theory, hints, and problem statement to create
 * a visual step-by-step approach diagram.
 */
export function generateFlowchart(exercise: {
  title: string;
  theory: string;
  problemStatement: string;
  hints: string[];
  language: string;
  starterCode: string;
  solution: string;
}): { nodes: FlowchartNode[]; edges: FlowchartEdge[] } {
  const nodes: FlowchartNode[] = [];
  const edges: FlowchartEdge[] = [];
  let nodeId = 1;

  // Start node
  nodes.push({ id: String(nodeId++), label: "Start", type: "start" });

  // Parse the theory for key concepts
  const theorySteps = extractTheorySteps(exercise.theory, exercise.language);

  // Parse the problem statement for action steps
  const problemSteps = extractProblemSteps(exercise.problemStatement, exercise.language);

  // Parse the hints
  const hintSteps = exercise.hints.map((h) => h.replace(/^Hint \d+:\s*/, "").trim());

  // Parse the solution for structural steps
  const solutionSteps = extractSolutionSteps(exercise.solution, exercise.language);

  // Build flowchart from combined analysis
  const allSteps = buildFlowchartSteps(
    theorySteps,
    problemSteps,
    hintSteps,
    solutionSteps,
    exercise.language
  );

  // Add process nodes
  for (const step of allSteps) {
    const type = step.type || inferNodeType(step.label);
    nodes.push({
      id: String(nodeId++),
      label: step.label,
      type: type,
    });
  }

  // End node
  nodes.push({ id: String(nodeId), label: "End", type: "end" });

  // Create edges connecting all nodes
  for (let i = 0; i < nodes.length - 1; i++) {
    const edge: FlowchartEdge = {
      from: nodes[i].id,
      to: nodes[i + 1].id,
    };

    // Add labels for decision edges
    if (nodes[i].type === "decision" && i + 2 < nodes.length) {
      edge.label = "Yes";
      // Add a "No" path that continues to the step after
      if (i + 2 < nodes.length - 1) {
        edges.push({
          from: nodes[i].id,
          to: nodes[i + 2].id,
          label: "No",
        });
      }
    }

    edges.push(edge);
  }

  return { nodes, edges };
}

function extractTheorySteps(theory: string, language: string): string[] {
  const steps: string[] = [];
  const lines = theory.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      steps.push(trimmed.replace("### ", ""));
    } else if (trimmed.startsWith("- ") && trimmed.length < 60) {
      steps.push(trimmed.replace("- ", ""));
    }
  }

  return steps.slice(0, 3); // Max 3 theory concepts
}

function extractProblemSteps(problem: string, language: string): string[] {
  const steps: string[] = [];

  // Look for action verbs to identify steps
  const actionPatterns = [
    /(?:create|write|build|implement|define|declare)\s+(?:a\s+)?(.{5,50})/gi,
    /(?:print|display|output|log|return)\s+(.{5,40})/gi,
    /(?:use|call|invoke)\s+(.{5,40})/gi,
    /(?:given|take|read|input)\s+(.{5,40})/gi,
    /(?:sort|filter|map|reduce|iterate|loop)\s+(.{5,40})/gi,
    /(?:calculate|compute|find|check|compare)\s+(.{5,40})/gi,
  ];

  for (const pattern of actionPatterns) {
    let match;
    while ((match = pattern.exec(problem)) !== null) {
      const step = match[0].trim();
      if (step.length > 5 && step.length < 60) {
        steps.push(capitalizeFirst(step));
      }
    }
  }

  return steps.slice(0, 4); // Max 4 problem steps
}

function extractSolutionSteps(solution: string, language: string): string[] {
  const steps: string[] = [];
  const lines = solution.split("\n").filter((l) => l.trim() && !l.trim().startsWith("//") && !l.trim().startsWith("#"));

  // Identify key structural elements
  for (const line of lines) {
    const trimmed = line.trim();

    // Function definitions
    if (/^(def |function |const \w+ = |async function)/.test(trimmed)) {
      const match = trimmed.match(/(?:def |function |const )(\w+)/);
      if (match) {
        steps.push(`Define ${match[1]}()`);
      }
    }
    // Variable assignments
    else if (/^(let |const |var |\w+ = )/.test(trimmed) && !trimmed.includes("=>")) {
      const match = trimmed.match(/(?:let |const |var )?(\w+)\s*=/);
      if (match && !["i", "j", "k", "x", "y"].includes(match[1])) {
        steps.push(`Set up ${match[1]}`);
      }
    }
    // Loops
    else if (/^(for |while |\.forEach|\.map|\.filter|\.reduce)/.test(trimmed)) {
      steps.push("Loop through data");
    }
    // Conditionals
    else if (/^(if |switch )/.test(trimmed)) {
      steps.push("Check condition");
    }
    // Print/output
    else if (/^(print|console\.log|System\.out|std::cout|return )/.test(trimmed)) {
      steps.push("Output result");
    }
  }

  // Deduplicate and limit
  return [...new Set(steps)].slice(0, 5);
}

function buildFlowchartSteps(
  theorySteps: string[],
  problemSteps: string[],
  hintSteps: string[],
  solutionSteps: string[],
  language: string
): { label: string; type?: FlowchartNode["type"] }[] {
  const steps: { label: string; type?: FlowchartNode["type"] }[] = [];

  // Step 1: Read/understand inputs (from problem statement)
  const inputStep = problemSteps.find(
    (s) => /given|input|take|read/i.test(s)
  );
  if (inputStep) {
    steps.push({ label: truncate(inputStep, 35), type: "io" });
  }

  // Step 2: Process steps from solution or hints
  const processSteps = solutionSteps.length > 0 ? solutionSteps : hintSteps;
  for (const step of processSteps) {
    const type = inferNodeType(step);
    steps.push({ label: truncate(step, 35), type });
  }

  // Add action steps from problem if not enough from solution
  if (steps.length < 3) {
    for (const step of problemSteps) {
      if (!steps.some((s) => s.label.toLowerCase() === step.toLowerCase())) {
        steps.push({ label: truncate(step, 35), type: inferNodeType(step) });
      }
    }
  }

  // Add hint-based steps if still not enough
  if (steps.length < 3) {
    for (const hint of hintSteps) {
      if (hint.length > 5 && !steps.some((s) => s.label.toLowerCase().includes(hint.toLowerCase().slice(0, 10)))) {
        steps.push({ label: truncate(hint, 35), type: "process" });
      }
    }
  }

  // Ensure we always have output step
  if (!steps.some((s) => /output|print|display|log|return/i.test(s.label))) {
    const outputVerb = getOutputVerb(language);
    steps.push({ label: `${outputVerb} result`, type: "io" });
  }

  // Ensure minimum 3 steps, max 7
  if (steps.length < 3) {
    steps.splice(0, 0, { label: "Read problem input", type: "io" });
    steps.push({ label: "Verify output", type: "process" });
  }

  return steps.slice(0, 7);
}

function inferNodeType(label: string): FlowchartNode["type"] {
  const lower = label.toLowerCase();
  if (/^(if|check|is |does |has |compare|condition|decide|whether)/i.test(lower)) return "decision";
  if (/loop|iterate|for each|while|repeat|traverse/i.test(lower)) return "decision";
  if (/print|output|display|log|console|return|read|input|given/i.test(lower)) return "io";
  return "process";
}

function getOutputVerb(language: string): string {
  switch (language.toLowerCase()) {
    case "python": return "Print";
    case "javascript":
    case "jsx":
    case "tsx": return "console.log";
    case "java": return "System.out.println";
    case "cpp": return "cout <<";
    default: return "Print";
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}
