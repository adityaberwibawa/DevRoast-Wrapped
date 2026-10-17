/**
 * Pixel-art kalender 1-bit ala Anytype — majikan slide "PR terbengkalai"
 * (PR yang sama lamanya terkatung-katung di kalender).
 * Fill pakai currentColor.
 */
const PIXELS: readonly string[] = [
  "############",
  "#.#......#.#",
  "############",
  "#....##....#",
  "#..######..#",
  "#..........#",
  "#..######..#",
  "#..........#",
  "#...####...#",
  "############",
];

export function PixelCalendar({ className }: { className?: string }) {
  const w = PIXELS[0].length;
  const h = PIXELS.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Ilustrasi pixel-art kalender"
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
