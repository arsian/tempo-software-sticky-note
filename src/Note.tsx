import type { Note as NoteT } from "./types";

const Note = ({ note }: { note: NoteT }) => {
  return <div className={`note color-${note.color}`}>{note.text}</div>;
};

export default Note;
