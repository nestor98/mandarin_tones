// src/components/AnimatedCharacter.jsx
import { useEffect, useRef } from "react";

export default function AnimatedCharacter({ data, size = 80, delay = 0 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path, i) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.animation = `draw-stroke 2s ease ${i * 0.1 + delay}s forwards, fill-path 0.8s ease ${data.strokes.length * 0.1 + delay + .7}s forwards`;
    });
  }, [data, delay]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      className="stroke-current text-gray-900 dark:text-gray-100"
      fill="none"
      strokeWidth="40"
      strokeLinecap="round"
      strokeLinejoin="round"
      // Flip vertically
      style={{ transform: "scaleY(-1)" }}
    >
      {data.strokes.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
