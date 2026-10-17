/**
 * Pixel-art 1-bit ala Anytype — terminal dengan muka terlampau senyum.
 * Semua fill pakai currentColor agar bisa diberi warna via className.
 */
const PIXELS: readonly string[] = [
  "############",
  "#..........#",
  "#.#......#.#",
  "#..........#",
  "#..........#",
  "#..######..#",
  "#..........#",
  "############",
];

export function TerminalArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 8"
      role="img"
      aria-label="Ilustrasi pixel-art terminal senyum"
      shapeRendering="crispEdges"
      className={className}
    >
      {PIXELS.flatMap((row, r) =>
        [...row].map((cell, c) =>
          cell === "#" ? (
            <rect key={`${r}-${c}`} x={c} y={r} width={1.01} height={1.01} />
          ) : null,
        ),
      )}
    </svg>
  );
}
