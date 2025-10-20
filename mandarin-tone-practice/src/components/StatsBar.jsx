import React from 'react';

export default function StatsBar({ stats, onShowDashboard }) {
  if (!stats.total) return null;
  const percent = Math.round((stats.correct / stats.total) * 100);

  return (
    <div className="flex flex-col items-center">
  {/* % right: */}
  <div className="mt-4 text-center text-lg text-gray-700 dark:text-gray-100">
    Session accuracy: <span className="font-bold">{percent}%</span>
  </div>
  {/* more info */}
  <button
    onClick={onShowDashboard}
    className="underline mt-4 text-xs font-small text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 shadow-sm transition"
  >
    More Stats
  </button>
</div>


    // <div className="mt-4 text-center text-lg text-gray-700 dark:text-gray-100">
    //   <p>
    //     Session accuracy: <span className="font-bold">{percent}%</span>
    //   </p>
    //   <button
    //     onClick={onShowDashboard}
    //     className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition dark:bg-blue-600 dark:hover:bg-blue-700"
    //   >
    //     More stats
    //   </button>
    // </div>
  );
}