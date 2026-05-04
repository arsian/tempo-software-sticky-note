import { useRef } from "react";
import type { Action, Note as NoteT } from "./types";
interface Props {
  note: NoteT;
  dispatch: React.Dispatch<Action>;
}
const Note = ({ note, dispatch }: Props) => {
  const ref = useRef(null);

  const onMouseDown = (e: React.MouseEvent) => {
    const startMouseX = e.clientX; //where the mouse pointer was when drag starts
    const startMouseY = e.clientY;
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;
      if (ref.current) {
        ref.current.style.transform = `translate(${dx}px, ${dy}px)`; //gpu dependant, no re-renders as we move note
      }
    };
    const startX = note.x;
    const startY = note.y;
    const onUp = (ev: MouseEvent) => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (ref.current) {
        ref.current.style.transform = "";
      }
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;
      dispatch({ type: "MOVE", id: note.id, x: startX + dx, y: startY + dy });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };
  return (
    <div
      className={`note color-${note.color}`}
      onMouseDown={onMouseDown}
      style={{ left: note.x, top: note.y, width: note.w, height: note.h }}
      ref={ref}
    >
      {note.text}
    </div>
  );
};

export default Note;
