import React, { useState, useMemo } from 'react';

export default function ConfusionMatrixDashboard({ matrix }) {
  const [mode, setMode] = useState('percent'); // 'count' | 'percent'

  // Compute total per true tone (column-wise)
  const colTotals = useMemo(() => {
    const totals = Array(5).fill(0);
    for (let trueTone = 0; trueTone < 5; trueTone++) {
      for (let guess = 0; guess < 5; guess++) {
        totals[trueTone] += matrix[guess][trueTone];
      }
    }
    return totals;
  }, [matrix]);

  // Find max value for heatmap scaling
  const maxVal = useMemo(() => Math.max(...matrix.flat(), 1), [matrix]);


  // Find per column max value for heatmap scaling:
  const maxValCol = useMemo(() => Math.max(...colTotals, 1), [colTotals]);

  const toggleMode = () =>
    setMode((m) => (m === 'count' ? 'percent' : 'count'));

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Confusion Matrix
        </h3>
        <button
          onClick={toggleMode}
          className="text-sm px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 transition"
        >
          {mode === 'count' ? 'Show % per tone' : 'Show raw counts'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse mx-auto text-sm">
          <thead>
            <tr>
              <th className="p-2"></th>
              {[1, 2, 3, 4, 5].map((t) => (
                <th
                  key={`true-${t}`}
                  className="p-2 text-center text-gray-600 dark:text-gray-300"
                >
                  True {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((pred) => (
              <tr key={`row-${pred}`}>
                <th
                  className="p-2 text-right text-gray-600 dark:text-gray-300"
                >
                  Guess {pred}
                </th>
                {[1, 2, 3, 4, 5].map((actual) => {
                  const val = matrix[pred - 1][actual - 1];
                  const intensity = val / colTotals[actual - 1] || 0;
                  const colTotal = colTotals[actual - 1];
                  const percent =
                    colTotal > 0 ? (val / colTotal) * 100 : 0;

                  const bgColor = `rgba(59,130,246,${0.15 + intensity * 0.85})`;

                  return (
                    <td
                      key={`cell-${pred}-${actual}`}
                      className="border border-gray-300 dark:border-gray-700 w-12 h-12 text-center font-medium"
                      style={{
                        backgroundColor: bgColor,
                        color:
                          intensity > 0.6 ? 'white' : 'inherit',
                      }}
                    >
                      {mode === 'count'
                        ? val
                        : `${percent.toFixed(0)}%`}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Add totals row */}
            <tr>
              <th className="p-2 text-right text-gray-400 dark:text-gray-400">
                Total
              </th>
              {colTotals.map((total, i) => (
                <td
                  key={`total-${i}`}
                  className="border border-gray-300 dark:border-gray-700 text-center text-gray-400 dark:text-gray-400"
                >
                  {total}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend and accuracy per true tone */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
        <p className='text-xs'>Rows = guessed tone • Columns = true tone</p>
        <p className="mt-2">Per tone accuracy:</p>
        <div className="mt-2">
          {colTotals.map((total, i) => {
            const correct = matrix[i][i];
            const acc = total > 0 ? ((correct / total) * 100).toFixed(1) : '–';
            return (
              <span key={`acc-${i}`} className="mx-2">
                <strong>Tone {i + 1}:</strong> {acc}%
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
