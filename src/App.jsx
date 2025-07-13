// src/App.jsx
import React, { useState } from "react";
import FamilyForm from "./components/FamilyForm";
import StoryViewer from "./components/StoryViewer";
import { generateStory } from "./utils/generateStory";
import { speakText as playStory } from "./utils/speechUtils";

function App() {
  const [family, setFamily] = useState([]);
  const [storyType, setStoryType] = useState("Adventure");
  const [length, setLength] = useState("2 Minutes");
  const [timePeriod, setTimePeriod] = useState("Present Day");
  const [context, setContext] = useState("");
  const [storyText, setStoryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerateStory = async () => {
    setLoading(true);
    const raw = await generateStory({ family, storyType, length, timePeriod, context });
    setStoryText(raw);
    setLoading(false);
  };

  const parseStoryText = (raw) =>
    raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("**") && l.includes("**:"))
      .map((l) => {
        const [, role, body] = l.match(/^\*\*(.+?)\*\*:\s*(.*)$/);
        return { role, text: body };
      });

  const handlePlay = () => {
    if (!storyText) return;
    const segments = parseStoryText(storyText);
    setIsPlaying(true);
    playStory(segments).finally(() => setIsPlaying(false));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl text-red-600 font-bold mb-4 text-center">
        Once Upon Us
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Create a voice-narrated story starring your own family
      </p>

      <FamilyForm
        family={family}
        setFamily={setFamily}
        storyType={storyType}
        setStoryType={setStoryType}
        length={length}
        setLength={setLength}
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        context={context}
        setContext={setContext}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        onClick={handleGenerateStory}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Story"}
      </button>

      {storyText && (
        <>
          <StoryViewer storyText={storyText} />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handlePlay}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              ▶️ Play
            </button>
            <button
              onClick={() => window.speechSynthesis.pause()}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              ⏸ Pause
            </button>
            <button
              onClick={() => window.speechSynthesis.resume()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ▶ Resume
            </button>
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              ⏹ Stop
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

