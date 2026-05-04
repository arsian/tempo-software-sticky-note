import type { Note, Action } from "./types";

export function notesReducer(state: Note[], action: Action): Note[] {
  switch (action.type) {
    case "CREATE":
      return [...state, action.note];
    case "MOVE":
      return state.map((note) =>
        note.id === action.id ? { ...note, x: action.x, y: action.y } : note,
      );
    case "EDIT":
      return state.map((note) =>
        note.id === action.id ? { ...note, text: action.text } : note,
      );
    case "RESIZE":
      return state.map((note) =>
        note.id === action.id ? { ...note, w: action.w, h: action.h } : note,
      );
    case "DELETE":
      return state.filter((note) => note.id !== action.id);
    case "BRING_TO_FRONT": {
      const note = state.find((n) => n.id === action.id);
      if (!note) return state;
      if (state[state.length - 1] === note) return state;
      return [...state.filter((n) => n.id !== action.id), note];
    }
  }
}
