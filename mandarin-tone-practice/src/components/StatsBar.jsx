import React from 'react';

export default function StatsBar({ stats }) {
  if (!stats.total) return null;
  const percent = Math.round((stats.correct / stats.total) * 100);
  return (
    <div className="mt-4 text-gray-700">
      <p>Session accuracy: <span className="font-bold">{percent}%</span></p>
    </div>
  );
}
