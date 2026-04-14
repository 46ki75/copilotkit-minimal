import React, { useState, useCallback } from "react";

import styles from "./puzzle.module.css";

export interface PuzzleProps {
  style?: React.CSSProperties;
}

const SIZE = 4;
const SOLVED = Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1).concat(0);

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

export const Puzzle = (props: PuzzleProps) => {
  const [tiles, setTiles] = useState<number[]>(() => shuffle(SOLVED));
  const [moves, setMoves] = useState(0);

  const isSolved = tiles.join() === SOLVED.join();

  const handleTileClick = useCallback(
    (index: number) => {
      if (isSolved) return;
      const emptyIndex = tiles.indexOf(0);
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      const emptyRow = Math.floor(emptyIndex / SIZE);
      const emptyCol = emptyIndex % SIZE;
      const isAdjacent =
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1);
      if (!isAdjacent) return;
      const next = [...tiles];
      [next[index], next[emptyIndex]] = [next[emptyIndex], next[index]];
      setTiles(next);
      setMoves((m) => m + 1);
    },
    [tiles, isSolved]
  );

  const handleReset = () => {
    setTiles(shuffle(SOLVED));
    setMoves(0);
  };

  return (
    <div className={styles.puzzle} style={props.style}>
      <h2 className={styles.title}>Slide Puzzle</h2>
      <p className={styles.moves}>Moves: {moves}</p>
      {isSolved && (
        <p className={styles.solved}>Solved! 🎉</p>
      )}
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
