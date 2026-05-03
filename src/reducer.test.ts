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

  //   test("MOVE updates only the target note", () => {});
  //   test("MOVE on a non-existant note/id is no-op", () => {});

  //   test("RESIZE updates only the target note", () => {});

  //   test("RESIZE on a non-existant note/id is no-op", () => {});

  //   test("EDIT updates only the target note", () => {});

  //   test("EDIT on a non-existant note/id is no-op", () => {});

  //   test("DELETE removes only the target note", () => {});

  //   test("DELETE on a non-existant note/id is no-op", () => {});
});
