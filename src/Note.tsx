import { useRef, useState, useEffect } from "react";
import type { Action, Note as NoteT } from "./types";
import { MIN_NOTE_DIMS } from "./fixtures";
interface Props {
  note: NoteT;
  dispatch: React.Dispatch<Action>;
  trashRef: React.RefObject<HTMLDivElement | null>;
}

// sorry, had to look this up, didn't have enough time to get the algorithm right
// https://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements#:~:text=Sorted%20by:,7%20Comments
function rectsOverlap(a: DOMRect, b: DOMRect): boolean {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

const Note = ({ note, dispatch, trashRef }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing && textareaRef.current) {
      // Defer one frame so React commits readOnly=false to the DOM first
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [editing]);

  const onMouseDown = (e: React.MouseEvent) => {
    dispatch({ type: "BRING_TO_FRONT", id: note.id });

    const startMouseX = e.clientX; //where the mouse pointer was when drag starts
    const startMouseY = e.clientY;

    let overTrash = false;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;
      if (ref.current) {
        ref.current.style.transform = `translate(${dx}px, ${dy}px)`; //gpu dependant, no re-renders as we move note
      }
      if (ref.current && trashRef.current) {
        const hit = rectsOverlap(
          ref.current.getBoundingClientRect(),
          trashRef.current.getBoundingClientRect(),
        );
        if (hit !== overTrash) {
          overTrash = hit;
          trashRef.current.classList.toggle("armed", overTrash);
        }
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
      if (trashRef.current) {
        trashRef.current.classList.remove("armed");
      }
      if (overTrash) {
        dispatch({ type: "DELETE", id: note.id });
        return;
      }
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;
      dispatch({ type: "MOVE", id: note.id, x: startX + dx, y: startY + dy });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "BRING_TO_FRONT", id: note.id });
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startW = note.w;
    const startH = note.h;

    const onMove = (ev: MouseEvent) => {
      const w = Math.max(MIN_NOTE_DIMS.W, startW + (ev.clientX - startMouseX));
      const h = Math.max(MIN_NOTE_DIMS.H, startH + (ev.clientY - startMouseY));
      if (ref.current) {
        ref.current.style.width = `${w}px`;
        ref.current.style.height = `${h}px`;
      }
    };

    const onUp = (ev: MouseEvent) => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      const w = Math.max(MIN_NOTE_DIMS.W, startW + (ev.clientX - startMouseX));
      const h = Math.max(MIN_NOTE_DIMS.H, startH + (ev.clientY - startMouseY));
      dispatch({ type: "RESIZE", id: note.id, w, h });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    dispatch({ type: "BRING_TO_FRONT", id: note.id });
    setEditing(true);
  };

  return (
    <div
      className={`note color-${note.color}`}
      onMouseDown={onMouseDown}
      style={{ left: note.x, top: note.y, width: note.w, height: note.h }}
      ref={ref}
      onDoubleClick={onDoubleClick}
    >
      <textarea
        ref={textareaRef}
        className="note-body"
        value={note.text}
        readOnly={!editing}
        onChange={(e) =>
          dispatch({ type: "EDIT", id: note.id, text: e.target.value })
        }
        onBlur={() => setEditing(false)}
        onMouseDown={(e) => e.stopPropagation()}
      />
      <div className="resize-handle" onMouseDown={onResize} />
    </div>
  );
};

export default Note;
