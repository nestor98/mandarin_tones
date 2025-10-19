import React from 'react';

export default function AboutModal({ onClose }) {
return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
                ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-sm text-gray-700">
                Practice mandarin tones in context. Inspired by the tone trainer in <a href="https://www.dong-chinese.com/learn/sounds/pinyin/toneTrainer" target="_blank" rel="noreferrer" className="text-blue-500 underline">Dong Chinese</a>, where I was missing some examples with full sentences.
            </p>
            <p className="text-sm text-gray-700 mt-3">
                Sentence and translations are from the amazing <a href="https://tatoeba.org/" target="_blank" rel="noreferrer" className="text-blue-500 underline">Tatoeba Project</a>, licensed under{' '}
                <a
                    href="https://creativecommons.org/licenses/by/2.0/fr/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline ml-1"
                >
                    CC BY 2.0 FR
                </a>{' '}
                and{' '}
                <a
                    href="https://creativecommons.org/publicdomain/zero/1.0/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                >
                    CC0
                </a>{' '}
                licenses.
            </p>
            <p className="text-xs text-gray-700 mt-3">
                Audios were contributed by users <a href="https://tatoeba.org/es/user/profile/fucongcong" target="_blank" rel="noreferrer" className="text-blue-500 underline">fucongcong</a> and <a href="https://tatoeba.org/es/user/profile/GlossaMatik" target="_blank" rel="noreferrer" className="text-blue-500 underline">GlossaMatik</a>.
                They don't have a license, so I am waiting for their permission to share it, for now, do not play the audios I guess :)
            </p>
            <p className="text-xs text-gray-500 mt-4">
                Created for personal and educational use.
            </p>
            <p className="text-xs text-gray-500 mt-4">
                Built with React, vite, Tailwind CSS, and the help of a friendly robot.
            </p>
        </div>
    </div>
);
}
