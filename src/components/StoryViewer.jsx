
import React, { useState, useRef, useEffect } from 'react';
import { speakWithVoice } from '../utils/elevenlabs';
import { roleVoices } from '../utils/roleVoices';

const StoryViewer = ({ story }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector('.highlighted');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLine]);

  const playStory = async () => {
    setIsPlaying(true);
    for (let i = 0; i < story.length; i++) {
      setCurrentLine(i);
      const line = story[i];
      const voiceId = roleVoices['Narrator'];
      await speakWithVoice(line.text, voiceId);
    }
    setIsPlaying(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start p-8"
      style={{
        background: 'linear-gradient(to bottom, #0a0f2c, #1b2a49)',
        backgroundImage: 'url("https://raw.githubusercontent.com/PaulMaggio/night-sky-assets/main/stars-moon-bg.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        color: '#fff',
      }}
    >
      <div className="flex gap-4 mb-4">
        <button
          onClick={playStory}
          disabled={!story || story.length === 0 || isPlaying}
          className="bg-blue-500 text-white px-6 py-3 text-lg font-semibold rounded shadow"
        >
          ▶️ Play
        </button>
      </div>

      <div
        ref={containerRef}
        className="story-text space-y-2 p-4 rounded shadow-lg"
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          width: '100%',
          maxWidth: '700px',
        }}
      >
        {story && story.length > 0 ? (
          story.map((line, index) => (
            <p
              key={index}
              className={index === currentLine ? 'highlighted' : ''}
              style={{
                backgroundColor: index === currentLine ? '#4a90e2' : 'transparent',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <strong>{line.role}:</strong> {line.text}
            </p>
          ))
        ) : (
          <p>No story loaded. Please generate a story first.</p>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
