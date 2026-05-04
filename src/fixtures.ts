import type { Note as NoteT } from "./types";

export const initialNotes: NoteT[] = [
  { id: "1", x: 60, y: 60, w: 180, h: 120, text: "First note", color: 0 },
  { id: "2", x: 280, y: 100, w: 180, h: 120, text: "Second note", color: 1 },
];

export const MIN_NOTE_DIMS = {
  W: 80,
  H: 60,
} as const;
