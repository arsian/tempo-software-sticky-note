export interface Note {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  color: number; //will have a dict
}

export type Action =
  | { type: "CREATE"; note: Note }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; w: number; h: number }
  | { type: "EDIT"; id: string; text: string }
  | { type: "DELETE"; id: string }
  | { type: "BRING_TO_FRONT"; id: string };
