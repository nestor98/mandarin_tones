import React from 'react';

// Tone marks table
const TONE_MARKS = {
  a: ['ā', 'á', 'ǎ', 'à'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

function addToneMark(syl, tone) {
  if (tone === 5 || tone < 1) return syl; // neutral
  if (!syl) return syl;

  const vowels = ['a', 'e', 'o', 'i', 'u', 'ü'];
  for (let v of vowels) {
    const idx = syl.indexOf(v);
    if (idx >= 0) {
      const mark = TONE_MARKS[v][tone - 1];
      return syl.slice(0, idx) + mark + syl.slice(idx + 1);
    }
  }
  return syl;
}

/**
 * ToneSelector
 * @param {string} baseSyllable - the plain pinyin syllable (e.g. "hao")
 * @param {number} selected - user's current guess
 * @param {number|number[]} correct - accepted tone(s), or -1 if none
 * @param {function} onSelect - callback(tone)
 * @param {boolean} vertical - render buttons vertically
 * @param {boolean} compact - use smaller buttons
 * @param {boolean} checked - whether the answer has been checked
 */
export default function ToneSelector({
  baseSyllable,
  selected,
  correct,
  onSelect,
  vertical,
  compact,
  checked,
}) {
  const tones = [1, 2, 3, 4, 5];

  // If no tone applies (tone === -1), skip rendering
  if (correct === -1 || (Array.isArray(correct) && correct.includes(-1))) {
    return null;
  }

  const toneColor = (tone) => {
    if (!checked) {
      return selected === tone
        ? 'bg-blue-200 dark:bg-blue-600 text-gray-900 dark:text-white'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100';
    }

    const correctTones = Array.isArray(correct) ? correct : [correct];
    if (correctTones.includes(tone))
      return 'bg-green-300 dark:bg-green-600 text-gray-900 dark:text-white';
    if (tone === selected && !correctTones.includes(tone))
      return 'bg-red-300 dark:bg-red-600 text-gray-900 dark:text-white';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100';
  };

  return (
    <div
      className={`flex ${vertical ? 'flex-col' : 'flex-row'} justify-center gap-1`}
    >
      {tones.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`
            rounded text-sm font-medium
            ${toneColor(t)} 
            ${compact ? 'h-6 px-2 min-w-[2.2rem]' : 'h-8 px-3 min-w-[2.5rem]'}
            transition-colors duration-200
            hover:brightness-105 active:scale-[0.97]
          `}
        >
          {addToneMark(baseSyllable, t)}
        </button>
      ))}
    </div>
  );
}
