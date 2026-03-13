import type { Exercise, FlowchartEdge, FlowchartNode } from "@/types";

export type ExerciseFlowchart = {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
} | null;

export interface EditorCommandTarget {
  addCommand: (keybinding: number, handler: () => void) => void;
}

export interface EditorKeyBindings {
  KeyMod: {
    CtrlCmd: number;
    Shift: number;
  };
  KeyCode: {
    KeyV: number;
    Insert: number;
    KeyC: number;
    KeyX: number;
  };
}

export type PlaygroundEditorDidMount = (
  editor: EditorCommandTarget,
  monaco: EditorKeyBindings,
) => void;

export interface ExerciseNavigation {
  exerciseIndex: number;
  prevExercise: Exercise | null;
  nextExercise: Exercise | null;
}
