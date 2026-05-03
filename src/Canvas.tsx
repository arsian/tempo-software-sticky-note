import { useReducer } from "react";
import Note from "./Note";
import { notesReducer } from "./reducer";
import type { Note as NoteT } from "./types";

const Canvas = () => {
  const initialNotes: NoteT[] = [
    { id: "1", x: 60, y: 60, w: 180, h: 120, text: "First note", color: 0 },
    { id: "2", x: 280, y: 100, w: 180, h: 120, text: "Second note", color: 1 },
  ];
  const [notes] = useReducer(notesReducer, initialNotes);

  return (
    <div className="canvas">
      {notes.map((n) => (
        <Note key={n.id} note={n} />
      ))}
    </div>
  );
};

export default Canvas;
