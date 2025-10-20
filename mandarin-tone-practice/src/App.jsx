import React, { useEffect, useState } from 'react';
import TonePractice from './components/TonePractice';
import StatsBar from './components/StatsBar';
import ConfusionMatrixDashboard from './components/ConfusionMatrixDashboard';
import AboutModal from './components/AboutModal';
// import { db } from './db';
import data from './data/sentences_mandarin_english.json';


import diaoData from "./data/diao.json";
import shengData from "./data/sheng.json";

import AnimatedCharacter from './components/chars/AnimatedCharacter.jsx';



export default function App() {
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [showStats, setShowStats] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [confusionMatrix, setConfusionMatrix] = useState(
    Array(5).fill().map(() => Array(5).fill(0))
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const updateStats = async (correctDelta, totalDelta, matrix) => {
    setStats(prev => ({
      correct: prev.correct + correctDelta,
      total: prev.total + totalDelta,
    }));

    // Update confusion matrix
    setConfusionMatrix(matrix);

    // if (SAVE_STATS) { // Disabled for now, i dont think its that useful
    //   const today = new Date().toISOString().slice(0, 10);
    //   await db.stats.add({ date: today, correct: correctDelta, total: totalDelta });

    //   for (const m of mistakes) {
    //     await db.mistakes.add({
    //       date: new Date().toISOString(),
    //       sentence_id: m.sentence_id,
    //       syllable_index: m.syllable_index,
    //       pinyin: m.pinyin,
    //       expected: m.expected,
    //       chosen: m.chosen,
    //       context: m.context,
    //     });
    //   }
    // }
  };

  return (
<div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">


      {/* ─── Animated logo top-left ─── */}
      <div className="absolute top-3 left-3 pl-4 pt-1 flex gap-0 items-center z-20">
        <AnimatedCharacter data={shengData} size={50} delay={.0} /> 
        <AnimatedCharacter data={diaoData} size={50} delay={1.8} />
      </div>


{/* ─── Top controls (always at top) ─── */}
<div
  className="w-full flex justify-end p-4 sm:p-6 pb-2
             pt-[max(theme(spacing.4),env(safe-area-inset-top))]
             bg-transparent relative z-10"
>

  <div className="flex gap-2 items-center">
    {/* ⚙️ Settings */}
    <div className="relative">
      <button
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        onClick={() => setShowSpeedControl(prev => !prev)}
        title="Settings"
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0002 8C9.79111 8 8.00024 9.79086 8.00024 12C8.00024 14.2091 9.79111 16 12.0002 16C14.2094 16 16.0002 14.2091 16.0002 12C16.0002 9.79086 14.2094 8 12.0002 8ZM10.0002 12C10.0002 10.8954 10.8957 10 12.0002 10C13.1048 10 14.0002 10.8954 14.0002 12C14.0002 13.1046 13.1048 14 12.0002 14C10.8957 14 10.0002 13.1046 10.0002 12Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.2867 0.5C9.88583 0.5 8.6461 1.46745 8.37171 2.85605L8.29264 3.25622C8.10489 4.20638 7.06195 4.83059 6.04511 4.48813L5.64825 4.35447C4.32246 3.90796 2.83873 4.42968 2.11836 5.63933L1.40492 6.83735C0.67773 8.05846 0.954349 9.60487 2.03927 10.5142L2.35714 10.7806C3.12939 11.4279 3.12939 12.5721 2.35714 13.2194L2.03927 13.4858C0.954349 14.3951 0.67773 15.9415 1.40492 17.1626L2.11833 18.3606C2.83872 19.5703 4.3225 20.092 5.64831 19.6455L6.04506 19.5118C7.06191 19.1693 8.1049 19.7935 8.29264 20.7437L8.37172 21.1439C8.6461 22.5325 9.88584 23.5 11.2867 23.5H12.7136C14.1146 23.5 15.3543 22.5325 15.6287 21.1438L15.7077 20.7438C15.8954 19.7936 16.9384 19.1693 17.9553 19.5118L18.3521 19.6455C19.6779 20.092 21.1617 19.5703 21.8821 18.3606L22.5955 17.1627C23.3227 15.9416 23.046 14.3951 21.9611 13.4858L21.6432 13.2194C20.8709 12.5722 20.8709 11.4278 21.6432 10.7806L21.9611 10.5142C23.046 9.60489 23.3227 8.05845 22.5955 6.83732L21.8821 5.63932C21.1617 4.42968 19.678 3.90795 18.3522 4.35444L17.9552 4.48814C16.9384 4.83059 15.8954 4.20634 15.7077 3.25617L15.6287 2.85616C15.3543 1.46751 14.1146 0.5 12.7136 0.5H11.2867Z"
        />
      </svg>
    </button>


    {showSpeedControl && (
  <div className="absolute top-[calc(100%+0.5rem)] right-0 w-44 px-3 py-2 
  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
  rounded-2xl shadow-lg z-50">
    
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Speed: {speed.toFixed(1)}×
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full mt-2 accent-gray-600 dark:accent-gray-300"
        />
        <hr className="my-2 border-gray-300 dark:border-gray-600" />
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-full text-sm py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    )}
  </div>

    {/* ℹ️ About */}
    
        <button
          onClick={() => setShowAbout(true)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="About this project"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
      </div> 
    {/* <button
      onClick={() => setShowAbout(true)}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      title="About this project"
    > */}
      

    {/* </button> */}
  {/* </div> */}
</div>

{/* ─── Main content (center if short, scroll if long) ─── */}
<main
  className="flex-grow flex flex-col items-center
             justify-center sm:justify-[45%]
             px-4 sm:px-6 pb-8 transition-all duration-500"
>
  
  <TonePractice
    sentences={data}
    onUpdateStats={updateStats}
    playbackSpeed={speed}
  />

  <StatsBar
    stats={stats}
    onShowDashboard={() => setShowStats(!showStats)}
  />

  {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
  {showStats && <ConfusionMatrixDashboard matrix={confusionMatrix} />}
</main>
</div>
);

}

// <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">

// {/* Top controls — scrolls away naturally */}
// <div
//   className="w-full flex justify-end p-4 sm:p-6 pb-2
//              pt-[max(theme(spacing.4),env(safe-area-inset-top))]
//              bg-transparent relative z-10"
// >
//   <div className="flex gap-2 items-center">
          
//         <button
//             className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//             onClick={() => setShowSpeedControl(prev => !prev)}
//             title="Settings"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.6"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M12.0002 8C9.79111 8 8.00024 9.79086 8.00024 12C8.00024 14.2091 9.79111 16 12.0002 16C14.2094 16 16.0002 14.2091 16.0002 12C16.0002 9.79086 14.2094 8 12.0002 8ZM10.0002 12C10.0002 10.8954 10.8957 10 12.0002 10C13.1048 10 14.0002 10.8954 14.0002 12C14.0002 13.1046 13.1048 14 12.0002 14C10.8957 14 10.0002 13.1046 10.0002 12Z"
//               />
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M11.2867 0.5C9.88583 0.5 8.6461 1.46745 8.37171 2.85605L8.29264 3.25622C8.10489 4.20638 7.06195 4.83059 6.04511 4.48813L5.64825 4.35447C4.32246 3.90796 2.83873 4.42968 2.11836 5.63933L1.40492 6.83735C0.67773 8.05846 0.954349 9.60487 2.03927 10.5142L2.35714 10.7806C3.12939 11.4279 3.12939 12.5721 2.35714 13.2194L2.03927 13.4858C0.954349 14.3951 0.67773 15.9415 1.40492 17.1626L2.11833 18.3606C2.83872 19.5703 4.3225 20.092 5.64831 19.6455L6.04506 19.5118C7.06191 19.1693 8.1049 19.7935 8.29264 20.7437L8.37172 21.1439C8.6461 22.5325 9.88584 23.5 11.2867 23.5H12.7136C14.1146 23.5 15.3543 22.5325 15.6287 21.1438L15.7077 20.7438C15.8954 19.7936 16.9384 19.1693 17.9553 19.5118L18.3521 19.6455C19.6779 20.092 21.1617 19.5703 21.8821 18.3606L22.5955 17.1627C23.3227 15.9416 23.046 14.3951 21.9611 13.4858L21.6432 13.2194C20.8709 12.5722 20.8709 11.4278 21.6432 10.7806L21.9611 10.5142C23.046 9.60489 23.3227 8.05845 22.5955 6.83732L21.8821 5.63932C21.1617 4.42968 19.678 3.90795 18.3522 4.35444L17.9552 4.48814C16.9384 4.83059 15.8954 4.20634 15.7077 3.25617L15.6287 2.85616C15.3543 1.46751 14.1146 0.5 12.7136 0.5H11.2867Z"
//               />
//             </svg>
//           </button>


//           {showSpeedControl && (
//         <div className="absolute top-[calc(100%+0.5rem)] right-0 w-44 px-3 py-2 
//         bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
//         rounded-2xl shadow-lg z-50">
          
//               <label className="text-sm text-gray-700 dark:text-gray-300">
//                 Speed: {speed.toFixed(1)}×
//               </label>
//               <input
//                 type="range"
//                 min="0.5"
//                 max="1.5"
//                 step="0.05"
//                 value={speed}
//                 onChange={(e) => setSpeed(parseFloat(e.target.value))}
//                 className="w-full mt-2 accent-gray-600 dark:accent-gray-300"
//               />
//               <hr className="my-2 border-gray-300 dark:border-gray-600" />
//               <button
//                 onClick={() => setIsDark(!isDark)}
//                 className="w-full text-sm py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* About button */}
//         <button
//           onClick={() => setShowAbout(true)}
//           className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//           title="About this project"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <circle cx="12" cy="12" r="10"></circle>
//             <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
//             <line x1="12" y1="17" x2="12.01" y2="17"></line>
//           </svg>
//         </button>
//       </div>

//       {/* <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6 text-left">
//         Mandarin Tone Practice</h1> */}

//         {/* <main className="w-full flex flex-col items-center sm:px-6 pb-8"> */}
//         {/* <main className="w-full flex flex-col items-center px-4 sm:px-6 mt-2"> */}
//       <TonePractice
//         sentences={data}
//         onUpdateStats={updateStats}
//         playbackSpeed={speed}
//       />
      
//         <StatsBar
//           stats={stats} 
//           onShowDashboard={() => setShowStats(!showStats)}
//         />
      

//       {/* {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />} */}
//       {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

//       {showStats && <ConfusionMatrixDashboard matrix={confusionMatrix} />}
    
//   {/* </main> */}
//     </div>
//   );
// }
