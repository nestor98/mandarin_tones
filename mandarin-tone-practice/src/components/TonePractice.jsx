import React, { useEffect, useState } from 'react';
import ToneSelector from './ToneSelector';

export default function TonePractice({ sentences, onUpdateStats }) {
  const [sentence, setSentence] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    loadRandomSentence();
  }, []);
  const usedSentences = new Set();

  const loadRandomSentence = () => {
    if (usedSentences.size === sentences.length) {
      usedSentences.clear(); // Reset if all sentences have been used
    }

    let s;
    do {
      s = sentences[Math.floor(Math.random() * sentences.length)];
    } while (usedSentences.has(s));

    usedSentences.add(s);
    setSentence(s);
    setGuesses(Array(s.pinyin_no_tone.length).fill(0));
    setChecked(false);
  };

  const playAudio = () => {
    if (sentence?.audio_urls?.length) {
      if (!window.audioInstance || window.audioInstance.paused) {
        window.audioInstance = new Audio(sentence.audio_urls[0]);
        window.audioInstance.play();
      }
      else {
        window.audioInstance.currentTime = 0;
      }
    }
  };

  const handleGuess = (index, tone) => {
    const newGuesses = [...guesses];
    newGuesses[index] = tone;
    setGuesses(newGuesses);
  };

  const checkAnswer = () => {
    if (checked) return;
    let correct = 0;
    let n_punctuation = 0;

    sentence.tones.forEach((t, i) => {
      if (t === guesses[i]) correct++;
      if (t === -1) n_punctuation++;
    });

    const total = sentence.tones.length - n_punctuation;
    setScore({ correct, total });
    
    setChecked(true);
    onUpdateStats(correct, total);
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      playAudio();
    } else if (e.code === 'Enter') {
      e.preventDefault();
      checkAnswer();
    }
    else if (e.code === 'KeyN') {
      e.preventDefault();
      loadRandomSentence();
    } else if (['Digit1','Digit2','Digit3','Digit4','Digit5'].includes(e.code)) {
      const tone = parseInt(e.code.replace('Digit', ''), 10);
      const firstEmpty = guesses.findIndex(g => g === 0);
      if (firstEmpty !== -1) handleGuess(firstEmpty, tone);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!sentence) return <p>Loading…</p>;

  const punctuationRegex = /[，。！？、；：,.!?;:"'“”‘’\-…]/;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 text-center inline-block max-w-full lg:max-w-5xl">
          {/* English translation */}
          <p className="text-gray-500 mb-3">{sentence.english}</p>

          {/* Sentence wrapper: scroll on mobile if too long */}
          <div className="overflow-x-auto">
            <div
              className="inline-grid justify-start gap-x-2 gap-y-1 min-w-max"
              style={{ gridTemplateColumns: `repeat(${sentence.chinese.length}, auto)` }}
            >

          {/* Characters */}
          {sentence.chinese.split('').map((char, i) => (
            <div key={`char-${i}`} className="text-2xl text-center">{char}</div>
          ))}

          {/* Pinyin */}
          {sentence.pinyin_no_tone.map((p, i) => (
            <div key={`pinyin-${i}`} className="text-sm text-gray-400 text-center">{p}</div>
          ))}

          {/* Tone selectors */}
          {sentence.chinese.split('').map((char, i) => {
            const isPunctuation = punctuationRegex.test(char);
              
            return (
              <div key={`tone-${i}`} className="flex flex-col items-center">
                {!isPunctuation && (
                  <ToneSelector
                    baseSyllable={sentence.pinyin_no_tone[i]}
                    selected={guesses[i]}
                    correct={checked ? sentence.tones[i] : null}
                    onSelect={(t) => handleGuess(i, t)}
                    vertical
                    compact
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <button
          onClick={playAudio}
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition"
          title="Play (Space)"    
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v18l15-9L5 3z" />
          </svg>
          Play
        </button>

        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition" onClick={checkAnswer}
          disabled={checked} title="Check (Enter)">
          Check
        </button>

        <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition" onClick={loadRandomSentence}
                title="Next (N)">
          Next
        </button>
      </div>

      {/* Score */}
      {checked && (
        <p className="mt-4 text-lg">
          Score: {score.correct}/{score.total} (
          {Math.round((score.correct / score.total) * 100)}%)
        </p>
      )}
    </div>
  );
}
