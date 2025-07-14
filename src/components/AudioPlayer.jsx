// ✅ New File: src/components/AudioPlayer.jsx
import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ audioUrl, isPaused, onEnded, audioRef }) => {
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = onEnded;
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPaused) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Playback error:", err));
    }
  }, [isPaused]);

  return null;
};

export default AudioPlayer;
