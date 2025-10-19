import React, { useEffect, useState } from 'react';
import ToneSelector from './ToneSelector';
// import { ReactComponent as GearIcon } from '../assets/gear.svg';



// ---------- Utils ----------
function normalizeNonChinese(text) {
  // Merge spaced-out Latin letters: "J o h n" → "John"
  text = text.replace(/((?:[A-Za-z]\s+){1,}[A-Za-z])/g, m => m.replace(/\s+/g, ''));
  // Merge spaced-out digits: "1 0 0" → "100"
  text = text.replace(/((?:\d\s+){1,}\d)/g, m => m.replace(/\s+/g, ''));
  return text;
}

function tokenizeChinese(text) {
  const normalized = normalizeNonChinese(text);
  // Separate each Chinese character individually, but group Latin/digits/punctuation
  return normalized.match(/[\u4e00-\u9fff]|[A-Za-z]+|\d+|[，。！？、；：,.!?;:"'“”‘’\-…]/g) || [];
}

function getAcceptableTones(pinyin_no_tone, tones) {
  const valid = tones.map(t => [t]); // base: each tone itself

  for (let i = 0; i < tones.length - 1; i++) {
    const syl = pinyin_no_tone[i];
    const nextTone = tones[i + 1];

    // 不 (bu) → 2 before 4
    if (syl === 'bu' && nextTone === 4) valid[i].push(2);

    // 一 (yi) → 2 before 4, 4 before others
    if (syl === 'yi') {
      if (nextTone === 4) valid[i].push(2);
      else valid[i].push(4);
    }

    // 3 + 3 → first becomes 2
    if (tones[i] === 3 && nextTone === 3) valid[i].push(2);
  }

  return valid;
}

// ---------- Component ----------
export default function TonePractice({ sentences, onUpdateStats, playbackSpeed }) {
  const [sentence, setSentence] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  //speed:
  

  const usedSentences = new Set();

  useEffect(() => {
    loadRandomSentence();
  }, []);

  const loadRandomSentence = () => {
    if (usedSentences.size === sentences.length) usedSentences.clear();

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
        window.audioInstance.playbackRate = playbackSpeed;
        window.audioInstance.play();
      } else {
        window.audioInstance.currentTime = 0;
        window.audioInstance.playbackRate = playbackSpeed;
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

    const acceptable = getAcceptableTones(sentence.pinyin_no_tone, sentence.tones);
    let correct = 0;
    let n_punctuation = 0;
    const mistakes = [];

    acceptable.forEach((validTones, i) => {
      const tone = sentence.tones[i];
      const guess = guesses[i];

      if (tone === -1) {
        n_punctuation++;
        return;
      }

      if (validTones.includes(guess)) {
        correct++;
        // disabled mistakes until i think they can be nicely presented
        // mistakes.push({ chosen: guess, expected: guess });
      } else {
        // mistakes.push({
        //   sentence_id: sentence.id,
        //   syllable_index: i,
        //   pinyin: sentence.pinyin_no_tone[i],
        //   expected: validTones,
        //   chosen: guess,
        //   context: sentence.chinese,
        // });
      }
    });

    const total = sentence.tones.length - n_punctuation;
    setScore({ correct, total });
    setChecked(true);
    onUpdateStats(correct, total, mistakes);
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      playAudio();
    } else if (e.code === 'Enter') {
      e.preventDefault();
      checkAnswer();
    } else if (e.code === 'KeyN') {
      e.preventDefault();
      loadRandomSentence();
    } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].includes(e.code)) {
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
  const tokens = tokenizeChinese(sentence.chinese);

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 text-center inline-block max-w-full lg:max-w-5xl">
      {/* Sentence url, very small to the right */}
      <div className="text-xs text-gray-400 text-right mb-2">
        <a
          href={`https://tatoeba.org/eng/sentences/show/${sentence.id}`}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-gray-600 inline-flex items-center"
        >
          source
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3 h-3 ml-1"
          >
            <path
              fillRule="evenodd"
              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
      {/* English translation */}
      <p className="text-gray-500 mb-3">{sentence.english}</p>

      {/* Sentence wrapper */}
      <div className="overflow-x-auto">
        <div
          className="inline-grid justify-start gap-x-2 gap-y-1 min-w-max"
          style={{ gridTemplateColumns: `repeat(${tokens.length}, auto)` }}
        >
          {/* Characters */}
          {tokens.map((tok, i) => (
            <div key={`char-${i}`} className="text-2xl text-center">
              {tok}
            </div>
          ))}

          {/* Pinyin */}
          {sentence.pinyin_no_tone.map((p, i) => (
            <div key={`pinyin-${i}`} className="text-sm text-gray-400 text-center">
              {p}
            </div>
          ))}

          {/* Tone selectors */}
          {tokens.map((tok, i) => {
            const isPunctuation = punctuationRegex.test(tok);
            return (
              <div key={`tone-${i}`} className="flex flex-col items-center">
                {!isPunctuation && (
                  <ToneSelector
                    baseSyllable={sentence.pinyin_no_tone[i]}
                    selected={guesses[i]}
                    correct={
                      checked
                        ? getAcceptableTones(sentence.pinyin_no_tone, sentence.tones)[i]
                        : sentence.tones[i]
                    }                    
                    onSelect={(t) => handleGuess(i, t)}
                    checked={checked}
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

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          onClick={checkAnswer}
          disabled={checked}
          title="Check (Enter)"
        >
          Check
        </button>

        <button
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition"
          onClick={loadRandomSentence}
          title="Next (N)"
        >
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
