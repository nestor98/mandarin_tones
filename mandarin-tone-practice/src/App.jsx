import React, { useEffect, useState } from 'react';
import TonePractice from './components/TonePractice';
import StatsBar from './components/StatsBar';
import { db } from './db';
import data from './data/sentences_mandarin_english.json';

export default function App() {
  const [stats, setStats] = useState({ correct: 0, total: 0 });
 
  const updateStats = async (correct, total) => {
    setStats((prev) => {
      const newStats = {
        correct: prev.correct + correct,
        total: prev.total + total,
      };
      // Save asynchronously without blocking the UI
      db.stats.add({
        date: new Date().toISOString(),
        ...newStats,
      });
      return newStats;
    });
  };

  
  // const updateStats = async (correct, total) => {
  //   setStats({ correct, total });
  //   await db.stats.add({
  //     date: new Date().toISOString(),
  //     correct,
  //     total,
  //   });
  // };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start p-4 md:items-center md:justify-center">
      <h1 className="text-3xl font-bold mb-4 text-center md:text-left w-full md:w-auto">
        Mandarin Tone Practice
      </h1>

      <TonePractice
        sentences={data}
        onUpdateStats={updateStats}
        className="w-full max-w-full md:max-w-xl"
      />

      <StatsBar stats={stats} />
    </div>

  );
}

// import { useEffect, useState } from "react";
// import data from "./data/sentences_mandarin_english.json";

// function App() {
//   const [sentence, setSentence] = useState(null);

//   useEffect(() => {
//     console.log("Data loaded:", data);
//     setSentence(data[0]);
//   }, []);

//   if (!sentence) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6 text-lg">
//       <h2 className="text-2xl mb-4">{sentence.english}</h2>
//       <p className="text-3xl mb-2">{sentence.chinese}</p>
//       <p className="text-xl text-gray-600">{sentence.pinyin_no_tone.join(" ")}</p>
//       <audio controls src={sentence.audio_urls[0]} className="mt-4" />
//     </div>
//   );
// }

// export default App;
