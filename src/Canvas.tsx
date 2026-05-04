import { useReducer, useRef, useEffect } from "react";
import Note from "./Note";
import type { Note as NoteT } from "./types";
import { notesReducer } from "./reducer";
import { initialNotes, MIN_NOTE_DIMS } from "./fixtures";
import { FaGithub } from "react-icons/fa";

const STORE_KEY = "sticky-notes";
const loadNotes = (): NoteT[] => {
  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (!stored) return initialNotes;
    return JSON.parse(stored);
  } catch {
    console.info("no saved work found. Clean slate!");
    return initialNotes;
  }
};

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const [notes, dispatch] = useReducer(notesReducer, undefined, loadNotes);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(notes));
    } catch {
      // localStorage might be full or unavailable; ignore
    }
  }, [notes]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return; // only fire on empty canvas - clicking on top of an existing note shold not create a note

    // intercrept blur of an editing note — exit editing without creating a new note
    const active = document.activeElement;
    if (active instanceof HTMLTextAreaElement) {
      active.blur();
      return;
    }

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

    const onMove = (ev: MouseEvent) => {
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
    };

    const onUp = (ev: MouseEvent) => {
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
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="canvas" onMouseDown={onMouseDown} ref={canvasRef}>
      {notes.map((n) => (
        <Note key={n.id} note={n} dispatch={dispatch} trashRef={trashRef} />
      ))}
      <div ref={trashRef} className="trash">
        Trash
      </div>
      <a
        className="github-link"
        href="https://github.com/arsian/tempo-software-sticky-note"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
      >
        <FaGithub size={90} />
      </a>
    </div>
  );
};

export default Canvas;
