import { useEffect, useRef, useState } from "react";

/**
 * AnimatedCharacter
 * - data: { character, strokes, medians }
 * - size: pixel size of the SVG
 * - duration: total duration per stroke
 */
export default function AnimatedCharacter({ data, size = 80, strokeDuration = 800 }) {
  const [drawnPaths, setDrawnPaths] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    let currentStroke = 0;
    const totalStrokes = data.strokes.length;

    function animateStroke() {
      if (currentStroke >= totalStrokes) return;

      const median = data.medians[currentStroke];
      const pathData = data.strokes[currentStroke];

      if (!median || median.length === 0) {
        currentStroke++;
        animateStroke();
        return;
      }

      let t = 0;
      const points = median.map(([x, y]) => [x, y]); // flip Y
      const interval = 16; // ~60fps
      const steps = strokeDuration / interval;

      function step() {
        t++;
        const progress = Math.min(1, t / steps);
        const idx = Math.floor(progress * (points.length - 1));
        const partialPath = points.slice(0, idx + 1)
          .map(([x, y], i) => i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
          .join(" ");

        setDrawnPaths(prev => {
          const copy = [...prev];
          copy[currentStroke] = partialPath;
          return copy;
        });

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          currentStroke++;
          animateStroke();
        }
      }

      step();
    }

    animateStroke();
  }, [data, strokeDuration]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="40"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="scale(1,-1) translate(0,-900)">
        {data.strokes.map((d, i) => (
          <path
            key={i}
            d={drawnPaths[i] || ""}
            fill="currentColor"
            fillOpacity={drawnPaths[i] ? 1 : 0}
          />
        ))}
      </g>
    </svg>
  );
}
