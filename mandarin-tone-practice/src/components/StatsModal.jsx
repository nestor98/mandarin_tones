// this component is currently unused bc I got rid of the persistent DB between sessions.
// May come back to it, idk

import React, { useEffect, useState } from 'react';

import { db } from '../db';

export default function StatsModal({ stats, onClose }) {
  const [selectedCellMistakes, setSelectedCellMistakes] = useState([]);
  const [filter, setFilter] = useState({ expected: null, chosen: null }); // null = show all

  //. ......

  const [confusionMatrix, setConfusionMatrix] = useState([]);

  useEffect(() => {
    const loadMatrix = async () => {
      const mistakes = await db.mistakes.toArray();
      const matrix = Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => [])
      );
      
      mistakes.forEach(m => {
        m.expected.forEach(exp => {
          const eIdx = exp - 1;
          const cIdx = m.chosen - 1;
          if (eIdx >= 0 && eIdx < 5 && cIdx >= 0 && cIdx < 5) {
            matrix[eIdx][cIdx].push(m);
          }
        });
      });
      
      mistakes.forEach(m => {
        m.expected.forEach(exp => {
          const eIdx = exp - 1;
          const cIdx = m.chosen - 1;
          if (eIdx >= 0 && eIdx < 5 && cIdx >= 0 && cIdx < 5) {
            matrix[eIdx][cIdx].push(m);
          }
        });
      });
      setConfusionMatrix(matrix);
    };
    loadMatrix();
  }, []);


  // Filter mistakes for example list
  const displayedMistakes = selectedCellMistakes.filter(m => {
    if (!filter.expected && !filter.chosen) return true;
    const matchesExpected = !filter.expected || m.expected.includes(filter.expected);
    const matchesChosen = !filter.chosen || m.chosen === filter.chosen;
    return matchesExpected && matchesChosen;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl relative overflow-x-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Stats */}
        <h2 className="text-xl font-semibold mb-4">Session Statistics</h2>
        <p>
          Total answered: {stats.total}<br />
          Correct: {stats.correct}<br />
          Accuracy:{' '}
          {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
        </p>

        {/* Confusion matrix */}
        {confusionMatrix && (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">Tone Confusion Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Expected ↓ / Chosen →</th>
                    {[1, 2, 3, 4, 5].map(t => (
                      <th key={t} className="border p-2">{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {confusionMatrix.map((row, i) => (
                    <tr key={i}>
                      <th className="border p-2 bg-gray-100">{i + 1}</th>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`border p-2 ${
                            i === j
                              ? 'bg-green-100'
                              : cell.length > 0
                              ? 'bg-red-100 cursor-pointer hover:bg-red-200'
                              : ''
                          }`}
                          onClick={() => cell.length > 0 && setSelectedCellMistakes(cell)}
                        >
                          {cell.length || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Example sentences for selected cell */}
        {selectedCellMistakes?.length > 0 && (
          <div className="mt-4 max-h-60 overflow-y-auto border-t pt-2">
            <h4 className="font-semibold mb-2">Example sentences:</h4>
            <ul className="space-y-1 text-sm">
              {selectedCellMistakes.map((m, idx) => (
                <li key={`${m.sentence_id}-${m.syllable_index}-${idx}`}>
                  <span className="font-mono">{m.pinyin}</span> in "{m.context}"{' '}
                  (expected: {m.expected.join(',')}, chosen: {m.chosen})
                  {m.audio_url && (
                    <button
                      onClick={() => new Audio(m.audio_url).play()}
                      className="ml-2 text-blue-500 hover:underline"
                    >
                      🔊
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reset Database button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={async () => {
              if (
                confirm('Are you sure you want to reset all stats and mistakes?')
              ) {
                await db.stats.clear();
                await db.mistakes.clear();
                setMistakesState([]);
                setSelectedCellMistakes([]);
                alert('Database reset successfully.');
                onClose(); // Close the modal after resetting
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Stats
          </button>
        </div>
      </div>
    </div>
  );
}
