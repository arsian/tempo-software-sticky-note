import { useReducer, useRef } from "react";
import Note from "./Note";
import { notesReducer } from "./reducer";
import { initialNotes, MIN_NOTE_DIMS } from "./fixtures";

const Canvas = () => {
  const canvasRef = useRef(null);

  const [notes, dispatch] = useReducer(notesReducer, initialNotes);

  function onMoueDown(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) return; // only fire on empty canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    const ghost = document.createElement("div");
    ghost.className = "ghost";
    ghost.style.left = `${startX}px`;
    ghost.style.top = `${startY}px`;
    canvas.appendChild(ghost);

    function onMove(ev: MouseEvent) {
      const cx = ev.clientX - rect.left;
      const cy = ev.clientY - rect.top;
      const x = Math.min(startX, cx);
      const y = Math.min(startY, cy);
      const w = Math.abs(cx - startX);
      const h = Math.abs(cy - startY);
      ghost.style.left = `${x}px`;
      ghost.style.top = `${y}px`;
      ghost.style.width = `${w}px`;
      ghost.style.height = `${h}px`;
    }

    function onUp(ev: MouseEvent) {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      ghost.remove();

      const cx = ev.clientX - rect.left;
      const cy = ev.clientY - rect.top;
      const x = Math.min(startX, cx);
      const y = Math.min(startY, cy);
      const w = Math.max(MIN_NOTE_DIMS.W, Math.abs(cx - startX));
      const h = Math.max(MIN_NOTE_DIMS.H, Math.abs(cy - startY));

      dispatch({
        type: "CREATE",
        note: {
          id: crypto.randomUUID(),
          x,
          y,
          w,
          h,
          text: "",
          color: Math.floor(Math.random() * 5),
        },
      });
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div className="canvas" onMouseDown={onMoueDown} ref={canvasRef}>
      {notes.map((n) => (
        <Note key={n.id} note={n} dispatch={dispatch} />
      ))}
    </div>
  );
};

export default Canvas;
