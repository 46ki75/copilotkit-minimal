import React, { useState, useCallback, useRef, useEffect } from "react";
import z from "zod";
import {
  useAgentContext,
  useConfigureSuggestions,
  useFrontendTool,
} from "@copilotkit/react-core/v2";

import styles from "./puzzle.module.css";

export interface PuzzleProps {
  style?: React.CSSProperties;
}

const SIZE = 4;
const SOLVED = Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1).concat(
  0,
);

function countInversions(tiles: number[]): number {
  const arr = tiles.filter((n) => n !== 0);
  let inv = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++;
    }
  }
  return inv;
}

function isSolvable(tiles: number[]): boolean {
  const inv = countInversions(tiles);
  const emptyRow = Math.floor(tiles.indexOf(0) / SIZE);
  const emptyFromBottom = SIZE - emptyRow;
  if (SIZE % 2 === 1) return inv % 2 === 0;
  if (emptyFromBottom % 2 === 0) return inv % 2 === 1;
  return inv % 2 === 0;
}

function shuffle(tiles: number[]): number[] {
  const arr = [...tiles];
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (!isSolvable(arr) || arr.join() === SOLVED.join());
  return arr;
}

function getAdjacentTiles(tiles: number[]): number[] {
  const emptyIndex = tiles.indexOf(0);
  const emptyRow = Math.floor(emptyIndex / SIZE);
  const emptyCol = emptyIndex % SIZE;
  return tiles
    .map((tile, index) => {
      if (tile === 0) return null;
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      const isAdjacent =
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1);
      return isAdjacent ? tile : null;
    })
    .filter((t): t is number => t !== null);
}

function boardToGrid(tiles: number[]): number[][] {
  return Array.from({ length: SIZE }, (_, row) =>
    tiles.slice(row * SIZE, row * SIZE + SIZE),
  );
}

export const Puzzle = (props: PuzzleProps) => {
  const [tiles, setTiles] = useState<number[]>(() => shuffle(SOLVED));
  const [moves, setMoves] = useState(0);

  const isSolved = tiles.join() === SOLVED.join();

  // Refs so tool handlers always see the latest state
  const tilesRef = useRef(tiles);
  const movesRef = useRef(moves);
  const setTilesRef = useRef(setTiles);
  const setMovesRef = useRef(setMoves);
  useEffect(() => {
    tilesRef.current = tiles;
  }, [tiles]);
  useEffect(() => {
    movesRef.current = moves;
  }, [moves]);

  // --- Machine-readable state ---
  const emptyIndex = tiles.indexOf(0);
  useAgentContext({
    description: "Current state of the 4x4 slide puzzle",
    value: JSON.stringify({
      board: boardToGrid(tiles),
      moves,
      solved: isSolved,
      empty_position: {
        row: Math.floor(emptyIndex / SIZE),
        col: emptyIndex % SIZE,
      },
      slidable_tiles: getAdjacentTiles(tiles),
    }),
  });

  // --- Machine-callable tool: slide a tile ---
  useFrontendTool({
    name: "slide_tile",
    description:
      "Slide a numbered tile (1–15) into the empty space. The tile must be directly adjacent (up, down, left, or right) to the empty space.",
    parameters: z.object({
      tile_number: z
        .number()
        .int()
        .min(1)
        .max(15)
        .describe("The number printed on the tile to slide"),
    }),
    handler: async ({ tile_number }) => {
      const currentTiles = tilesRef.current;
      const tileIndex = currentTiles.indexOf(tile_number);
      if (tileIndex === -1) {
        return {
          success: false,
          error: `Tile ${tile_number} not found on board`,
        };
      }
      const emptyIdx = currentTiles.indexOf(0);
      const row = Math.floor(tileIndex / SIZE);
      const col = tileIndex % SIZE;
      const emptyRow = Math.floor(emptyIdx / SIZE);
      const emptyCol = emptyIdx % SIZE;
      const isAdjacent =
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1);
      if (!isAdjacent) {
        return {
          success: false,
          error: `Tile ${tile_number} is not adjacent to the empty space`,
          slidable_tiles: getAdjacentTiles(currentTiles),
        };
      }
      const next = [...currentTiles];
      [next[tileIndex], next[emptyIdx]] = [next[emptyIdx], next[tileIndex]];
      setTilesRef.current(next);
      setMovesRef.current((m) => m + 1);
      const solved = next.join() === SOLVED.join();
      return {
        success: true,
        moved_tile: tile_number,
        moves: movesRef.current + 1,
        solved,
        board: boardToGrid(next),
        slidable_tiles: getAdjacentTiles(next),
      };
    },
  });

  // --- Machine-callable tool: reset puzzle ---
  useFrontendTool({
    name: "reset_puzzle",
    description:
      "Shuffle the board and start a new game, resetting the move counter to zero.",
    parameters: z.object({}),
    handler: async () => {
      const newTiles = shuffle(SOLVED);
      setTilesRef.current(newTiles);
      setMovesRef.current(0);
      return {
        success: true,
        board: boardToGrid(newTiles),
        slidable_tiles: getAdjacentTiles(newTiles),
      };
    },
  });

  // --- Human interaction ---
  const handleTileClick = useCallback(
    (index: number) => {
      if (isSolved) return;
      const emptyIdx = tiles.indexOf(0);
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      const emptyRow = Math.floor(emptyIdx / SIZE);
      const emptyCol = emptyIdx % SIZE;
      const isAdjacent =
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1);
      if (!isAdjacent) return;
      const next = [...tiles];
      [next[index], next[emptyIdx]] = [next[emptyIdx], next[index]];
      setTiles(next);
      setMoves((m) => m + 1);
    },
    [tiles, isSolved],
  );

  const handleReset = () => {
    setTiles(shuffle(SOLVED));
    setMoves(0);
  };

  useConfigureSuggestions({
    available: "always",
    suggestions: [
      {
        title: "Solve the puzzle",
        message: `Solve the 4x4 slide puzzle step by step using the slide_tile tool.

Rules:
- Call slide_tile repeatedly. Each call returns the updated board and slidable_tiles.
- Keep going until the tool response contains "solved": true.
- Never stop early — the puzzle may take 50 or more moves.
- Only tiles listed in slidable_tiles can be moved on each turn.

Strategy (row-by-row):
1. Place tiles 1, 2, 3, 4 in the top row.
2. Place tiles 5, 6, 7, 8 in the second row.
3. Solve the remaining 2×4 bottom section column by column (left to right).

Before each move, read the current board from the tool result and choose the tile from slidable_tiles that makes progress toward the goal. Start now.`,
      },
    ],
  });

  return (
    <div className={styles.puzzle} style={props.style}>
      <h2 className={styles.title}>Slide Puzzle</h2>
      <p className={styles.moves}>Moves: {moves}</p>
      {isSolved && <p className={styles.solved}>Solved! 🎉</p>}
      <div className={styles.board}>
        {tiles.map((tile, index) => (
          <button
            key={index}
            className={`${styles.tile} ${tile === 0 ? styles.empty : ""}`}
            onClick={() => handleTileClick(index)}
            disabled={tile === 0}
            aria-label={tile === 0 ? "empty" : `tile ${tile}`}
          >
            {tile !== 0 ? tile : ""}
          </button>
        ))}
      </div>
      <button className={styles.reset} onClick={handleReset}>
        New Game
      </button>
    </div>
  );
};
