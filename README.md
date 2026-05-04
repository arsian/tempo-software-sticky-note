# Sticky Notes

A lean drag-and-drop sticky note app built with React, TypeScript, and Vite without external drag-and-drop libraries

## Features

- Click and drag empty canvas to create a note at any size and position
- Drag a note to move it
- Drag the bottom-right corner to resize
- Drag a note onto the trash zone to delete it
- Double-click to edit a note's text
- Click on a note to bring it to the front
- Notes persist across page reloads via localStorage

## Stack

- React 19 + TypeScript
- Vite (dev server + build)
- Vitest + React Testing Library (tests)

## Architecture

State is managed with `useReducer` along with `CREATE`, `MOVE`, `RESIZE`, `EDIT`, `DELETE`, and `BRING_TO_FRONT` actions. Decision to choose reducer over state is an easy one, declarative and therefore easy to test. Enables forward looking feats such as history (undo/redo) as well.

Drag interactions follow a "DOM during, dispatch on commit" pattern: `mousedown` starts the gesture, `mousemove`/`mouseup` are attached to `window` (not the element), the DOM is mutated directly during the drag for performance, and a single dispatch commits the final state on release. This avoids re-rendering on every mouse move that would otherwise be updated as a `useState`

## Getting started

```bash
npm install
npm run dev      # start dev server
npm test         # run tests
npm run build    # production build
```
