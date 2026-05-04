import { useRef } from "react";
import type { Action, Note as NoteT } from "./types";
interface Props {
  note: NoteT;
  dispatch: React.Dispatch<Action>;
}

const MIN_NOTE_DIMS = {
  W: 80,
  H: 60,
} as const;

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

  const onResize = (e: React.MouseEvent) => {
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startW = note.w;
    const startH = note.h;

    function onMove(ev: MouseEvent) {
      const w = Math.max(MIN_NOTE_DIMS.W, startW + (ev.clientX - startMouseX));
      const h = Math.max(MIN_NOTE_DIMS.H, startH + (ev.clientY - startMouseY));
      if (ref.current) {
        ref.current.style.width = `${w}px`;
        ref.current.style.height = `${h}px`;
      }
    }
    function onUp(ev: MouseEvent) {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      const w = Math.max(MIN_NOTE_DIMS.W, startW + (ev.clientX - startMouseX));
      const h = Math.max(MIN_NOTE_DIMS.H, startH + (ev.clientY - startMouseY));
      dispatch({ type: "RESIZE", id: note.id, w, h });
    }

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
      <div className="resize-handle" onMouseDown={onResize} />
    </div>
  );
};

export default Note;
