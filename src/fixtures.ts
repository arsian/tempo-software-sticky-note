import type { Note as NoteT } from "./types";

export const initialNotes: NoteT[] = [
  {
    id: "1",
    x: 60,
    y: 60,
    w: 180,
    h: 120,
    text: "Click anywhere on Canvas to create a new note",
    color: 0,
  },
  {
    id: "2",
    x: 280,
    y: 100,
    w: 180,
    h: 120,
    text: "Double click to Edit",
    color: 1,
  },
  {
    id: "3",
    x: 980,
    y: 600,
    w: 180,
    h: 120,
    text: "Move notes to Trash zone",
    color: 2,
  },
];

export const MIN_NOTE_DIMS = {
  W: 80,
  H: 60,
} as const;
