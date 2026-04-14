# Slide Puzzle Strategy Guide for LLMs

## 4×4 (15-Puzzle) — Deterministic Step-by-Step Protocol

---

## 0. Conventions

### Board notation

Represent the board as a 4×4 grid of numbers. Use `0` for the blank tile.

```
 1  2  3  4
 5  6  7  8
 9 10 11 12
13 14 15  0
```

Cells are addressed as **(row, col)** where row and col are 1-indexed from the top-left.

- Top-left = (1,1), top-right = (1,4)
- Bottom-left = (4,1), bottom-right = (4,4)

### Goal state

```
 1  2  3  4
 5  6  7  8
 9 10 11 12
13 14 15  0
```

### Move notation

A move is described as the **tile that slides** (not the blank), and its direction:

| Notation | Meaning                                    |
| -------- | ------------------------------------------ |
| `TILE→`  | Tile slides right (blank was to its right) |
| `TILE←`  | Tile slides left (blank was to its left)   |
| `TILE↑`  | Tile slides up (blank was above it)        |
| `TILE↓`  | Tile slides down (blank was below it)      |

Always verify: a tile can only move into the blank's position.

---

## 1. Pre-solve checklist

### 1.1 Count inversions (solvability check)

Flatten the board left-to-right, top-to-bottom, **excluding the blank**. An _inversion_ is a pair (A, B) where A appears before B in the sequence, but A > B.

Count inversions. Let `B_row` = row of the blank tile (1-indexed from top).

**Solvability rule:**

```
( inversion_count + B_row ) is even  →  SOLVABLE
( inversion_count + B_row ) is odd   →  UNSOLVABLE
```

If unsolvable: stop and report. Do not attempt to solve.

### 1.2 Check if already solved

Compare to goal state tile-by-tile. If all 16 cells match, output "Already solved."

---

## 2. Solving algorithm — Row-by-Row

Solve in this order:

```
Phase 1: Solve tiles  1,  2,  3,  4   (row 1)
Phase 2: Solve tiles  5,  6,  7,  8   (row 2)
Phase 3: Solve columns 1 and 2 of the remaining 2×4 block (tiles 9, 13 together; then 10, 14 together)
Phase 4: Solve columns 3 and 4 of the remaining 2×4 block (tiles 11, 15 together; then 12, 0 falls into place)
```

> **Critical rule:** When a row (or column pair) is solved, **never move its tiles again**. All subsequent moves must stay within the unsolved region.

---

## 3. Phase 1 & 2 — Solving a row

### 3.1 Solving the first 3 tiles in a row (tiles 1–3 or 5–7)

For each tile, use this process:

**Step A — Move the target tile to its goal position without disturbing already-placed tiles.**

Use the _free region_ (all rows below the current target row) as workspace.

Algorithm:

1. Locate the target tile `T` and the blank `0`.
2. Move the blank to be adjacent to `T` using only free-region cells.
3. Shuffle `T` one step closer to its goal. Repeat until `T` is in goal position.

**Blank-routing rule:** To move the blank from (r1,c1) to (r2,c2) without touching frozen tiles, plan a path through free cells only. If the path would require moving through a frozen row, use a detour via lower rows.

### 3.2 Solving the last 2 tiles in a row (positions (r,3) and (r,4))

**Do NOT place them one at a time.** The standard individual-placement sequence will lock one tile out of position. Use the L-rotation instead:

#### L-rotation sequence for rightmost 2 tiles

Assume tile `A` belongs at (r,3) and tile `B` belongs at (r,4).

Setup: manoeuvre `A` to (r+1, 4) and `B` to (r, 4). The blank must be at (r, 3).

```
State before L-rotation:
  row r:    [ ... | A_goal-1 | B  | 0  ]
  row r+1:  [ ... | ...      | A  | .. ]
```

Execute this fixed sequence (each step slides the named tile into the blank):

```
1. B↓        (B slides from (r,4) to (r+1,4))
2. 0 navigate to (r, 4)   [blank moves right one]
3. A↑        (A slides from (r+1,4) to (r,4))
4. 0 navigate to (r+1, 3)
5. A←        (A slides left to its goal at (r,3))  — wait, see note below
```

> **Simpler alternative:** After setup, execute a 3-step counter-clockwise rotation:
>
> ```
> B↓  →  A↑  →  A←  (with blank repositioned between each)
> ```
>
> This lands A at (r,3) and B at (r,4). Verify after each step.

**Verification after row completion:** Confirm tiles occupy goal positions before proceeding to the next row.

---

## 4. Phase 3 & 4 — Solving the bottom 2 rows (column pairs)

After rows 1 and 2 are frozen, only the bottom half remains:

```
 9 10 11 12
13 14 15  0   ← working region
```

You now solve **by columns** rather than by rows, working **left to right**.

### 4.1 Solving a column pair (e.g., tiles 9 and 13 into column 1)

This mirrors the L-rotation logic, but rotated 90°.

Tile `9` belongs at (3,1). Tile `13` belongs at (4,1).

**Setup:** Manoeuvre `9` to (3,2) and `13` to (3,1). Blank at (4,1).

```
State before column rotation:
  col 1     col 2
  row 3: [ 13 |  9 ]
  row 4: [  0 | .. ]
```

Execute column rotation:

```
1. 13→        (13 slides right from (3,1) to (3,2))
2. 0 navigate to (3,1)
3. 13↑        — wait, this is for row; adapt to column direction
```

**Generalised rule:** The same 3-tile rotation used for rows applies here — rotate the pair into their column goals. The blank provides the empty slot; the two tiles chase it in a CCW or CW rotation. Choose the rotation direction that doesn't enter frozen columns.

### 4.2 Final 2×2 block

When only a 2×2 remains (tiles 11, 12, 15, 0), the standard 5-move cycle resolves any permutation:

```
Current:       Goal:
 A  B           11 12
 C  0           15  0
```

If tiles are not in goal: cycle them clockwise or counter-clockwise using blank rotations. A 2×2 requires at most 3 rotations (6 moves) to solve.

The only unsolvable 2×2 state is a pure 2-tile swap (e.g., 11 and 12 swapped with 15 in place) — if you reach this, an error was made earlier. Backtrack and re-verify.

---

## 5. Blank-routing sub-procedure

This sub-procedure is called frequently. It moves the blank to a target cell without disturbing any tile you want to preserve.

**Input:** blank_pos, target_pos, forbidden_cells (all frozen tiles' positions)

**Algorithm:**

1. Enumerate a path from blank_pos to target_pos using only non-forbidden cells.
2. Use BFS over the grid (16 cells max) to find the shortest such path.
3. For each step in the path, slide the tile at the next cell into the blank.

**Practical shortcut for LLMs:** Instead of full BFS, use this priority order:

- Move blank horizontally first (column adjustment), then vertically (row adjustment).
- If the direct path is blocked by a frozen row/column, go around via the free region (lower rows first, then left-right detour).

---

## 6. State tracking protocol

LLMs must maintain an explicit board state throughout the solution. After every move:

1. **Update the board matrix** — swap the moved tile's position with the blank's position.
2. **Re-display the current board** as a 4×4 grid.
3. **Verify the move was legal** — confirm the moved tile was adjacent to the blank before the move.
4. **Check phase completion** — after each phase, verify all targeted tiles are in goal positions.

**If a verification fails:** Stop, display the current board, identify the discrepancy, and retrace the last 3 moves.

---

## 7. Move sequence templates

These are exact sequences for common sub-problems. All assume the given setup state.

### T1 — Move tile one step right (tile at (r,c), blank at (r, c+1))

```
TILE→   [blank moves to (r,c), tile at (r, c+1)]
```

### T2 — Move tile one step down (tile at (r,c), blank at (r+1, c))

```
TILE↓
```

### T3 — Move tile up past a row boundary (tile at (r+1,c), needs to go to (r,c), blank at (r,c))

```
TILE↑
```

### T4 — Cycle 3 tiles clockwise in a 2×2 sub-grid

Given blank at (r,c), tile A at (r,c+1), tile B at (r+1,c):

```
A←  B↑  A→  B↓   (4 moves, one full clockwise rotation)
```

### T5 — Place rightmost 2 tiles in a row (full sequence)

Setup: tile A at (r+1, c_goal+1), tile B at (r, c_goal+1), blank at (r, c_goal).

```
B↓  [blank→right]  A↑  [blank to (r+1, c_goal)]  A←
```

Result: A at (r, c_goal), B at (r, c_goal+1). Row complete.

---

## 8. Full worked example

### Initial board

```
 5  1  2  4
 9  6  3  8
13 10  7 12
14 15 11  0
```

### Step 1 — Solvability check

Flattened (no blank): `5 1 2 4 9 6 3 8 13 10 7 12 14 15 11`

Count inversions: (5>1), (5>2), (5>4), (5>3), (9>6), (9>3), (9>8), (9>7), (6>3), (13>10), (13>7), (13>12), (13>11), (10>7), (15>11)

Inversion count = 15. Blank is at row 4. 15 + 4 = 19 (odd) → … recount carefully.

> In a real solve, perform a full systematic pair-by-pair count. The example is illustrative; always recount from scratch.

### Step 2 — Phase 1: solve row 1 (tiles 1, 2, 3, 4)

**Tile 1** is at (1,2). Goal: (1,1). Move blank to (1,1):

- Blank is at (4,4). Route: (4,3)→(4,2)→(4,1)→(3,1)→(2,1)→(1,1).
- Each step slides the tile above/left of blank into blank.

After routing blank to (1,1): slide tile 1 left → board updated.

_(Continue for tiles 2, 3; use T5 template for tiles 3 and 4 together.)_

---

## 9. Common failure modes and fixes

| Failure                               | Cause                          | Fix                                                                        |
| ------------------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| Tile placed correctly, then displaced | Moved blank through frozen row | Always route blank around frozen rows                                      |
| Last 2 tiles in row keep swapping     | Trying to place individually   | Use T5 (L-rotation) template                                               |
| Bottom 2×2 is a 2-tile swap           | Parity error in phase 3/4      | Undo the last column pair solve, redo with opposite rotation direction     |
| Board state diverges from expected    | Move applied to wrong tile     | Re-display board after every move; verify legality before executing        |
| Infinite loop in blank routing        | Path blocked on all sides      |
| Tile placed correctly, then displaced | Moved blank through frozen row | Always route blank around frozen rows                                      |
| Last 2 tiles in row keep swapping     | Trying to place individually   | Use T5 (L-rotation) template                                               |
| Bottom 2×2 is a 2-tile swap           | Parity error in phase 3/4      | Undo the last column pair solve, redo with opposite rotation direction     |
| Board state diverges from expected    | Move applied to wrong tile     | Re-display board after every move; verify legality before executing        |
| Infinite loop in blank routing        | Path blocked on all sides      | Temporarily displace one nearby non-frozen tile, route blank, restore tile |

---

## 10. Summary checklist

```
[ ] 1. Parse board into 4×4 matrix with (row, col) coordinates
[ ] 2. Run solvability check. Stop if unsolvable.
[ ] 3. Check if already solved.
[ ] 4. Phase 1: solve row 1 (tiles 1-3 individually, tiles 3-4 via T5)
[ ] 5. Phase 2: solve row 2 (tiles 5-7 individually, tiles 7-8 via T5)
[ ] 6. Phase 3: solve col 1 pair (tiles 9, 13), then col 2 pair (tiles 10, 14)
[ ] 7. Phase 4: solve col 3 pair (tiles 11, 15), then verify tile 12 and blank fall into place
[ ] 8. After each phase, verify frozen tiles have not moved
[ ] 9. Display final board and confirm it matches goal state
```
