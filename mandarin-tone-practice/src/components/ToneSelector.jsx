import React from 'react';

// Tone marks table
const TONE_MARKS = {
  a: ['ā','á','ǎ','à'],
  e: ['ē','é','ě','è'],
  i: ['ī','í','ǐ','ì'],
  o: ['ō','ó','ǒ','ò'],
  u: ['ū','ú','ǔ','ù'],
  ü: ['ǖ','ǘ','ǚ','ǜ']
};

function addToneMark(syl, tone) {
  if (tone === 5 || tone < 1) return syl; // neutral
  if (!syl) {
    console.log('Adding tone: UNDEFINED!!');
    return syl;
  }
  const vowels = ['a','e','o','i','u','ü'];
  console.log('Adding tone mark:', syl, tone);
  for (let v of vowels) {

    const idx = syl.indexOf(v);
    if (idx >= 0) {
      const mark = TONE_MARKS[v][tone-1];
      return syl.slice(0, idx) + mark + syl.slice(idx+1);
    }
  }
  return syl;
}

export default function ToneSelector({ baseSyllable, selected, correct, onSelect, vertical, compact }) {
  const tones = [1,2,3,4,5];

  const toneColor = (tone) => {
    if (correct == null) return selected === tone ? 'bg-blue-200' : 'bg-gray-100';
    if (tone === correct) return 'bg-green-300';
    if (tone === selected && tone !== correct) return 'bg-red-300';
    return 'bg-gray-100';
  };

  return (
    
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} justify-center gap-1`}>
      {tones.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`rounded text-sm ${toneColor(t)} 
            ${compact ? 'h-6 px-2 min-w-[2.2rem]' : 'h-8 px-3 min-w-[2.5rem]'} transition`}
        >
          {addToneMark(baseSyllable, t)}
        </button>
      ))}
    </div>
  );
}
