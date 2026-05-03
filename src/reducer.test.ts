import { describe, test, expect } from "vitest";
import { notesReducer } from "./reducer";
import type { Note } from "./types";

const baseNote: Note = {
  id: "1",
  x: 10,
  y: 20,
  w: 100,
  h: 80,
  text: "",
  color: 0,
};

describe("notesReducer", () => {
  test("CREATE adds a note to an empty array", () => {
    const result = notesReducer([], { type: "CREATE", note: baseNote });
    expect(result).toEqual([baseNote]);
  });

  test("CREATE appends to an existing array", () => {
    const secondNote: Note = { ...baseNote, id: "2" };
    const result = notesReducer([baseNote], {
      type: "CREATE",
      note: secondNote,
    });
    expect(result).toEqual([baseNote, secondNote]);
  });

  test("MOVE updates only the target note", () => {
    const secondNote: Note = { ...baseNote, id: "2", x: 50, y: 50 };
    const result = notesReducer([baseNote, secondNote], {
      type: "MOVE",
      id: "2",
      x: 200,
      y: 300,
    });
    //make sure only note id:2 is moved
    expect(result).toEqual([baseNote, { ...secondNote, x: 200, y: 300 }]);
  });
  test("MOVE on a non-existant note/id is no-op", () => {
    const result = notesReducer([baseNote], {
      type: "MOVE",
      id: "999",
      x: 0,
      y: 0,
    });
    expect(result).toEqual([baseNote]);
  });

  test("RESIZE updates only the target note", () => {
    const result = notesReducer([baseNote], {
      type: "RESIZE",
      id: "1",
      w: 250,
      h: 175,
    });
    expect(result).toEqual([{ ...baseNote, w: 250, h: 175 }]);
  });

  test("RESIZE on a non-existant note/id is no-op", () => {
    const result = notesReducer([baseNote], {
      type: "RESIZE",
      id: "999",
      w: 250,
      h: 175,
    });
    expect(result).toEqual([baseNote]);
  });

  //   test("EDIT updates only the target note", () => {});

  //   test("EDIT on a non-existant note/id is no-op", () => {});

  //   test("DELETE removes only the target note", () => {});

  //   test("DELETE on a non-existant note/id is no-op", () => {});
});
