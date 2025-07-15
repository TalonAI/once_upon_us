// src/App.jsx
import React, { useState } from "react";
import FamilyForm from "./components/FamilyForm";
import StoryViewer from "./components/StoryViewer";
import { generateStory } from "./utils/generateStory";

function App() {
  const [family, setFamily] = useState([]);
  const [storyType, setStoryType] = useState("Adventure");
  const [length, setLength] = useState("short");
  const [timePeriod, setTimePeriod] = useState("current");
  const [context, setContext] = useState("");
  const [storyLines, setStoryLines] = useState([]); // Array of { speaker, line }
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  function parseStory(raw) {
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("**") && l.includes("**:"))
      .map((l) => {
        const [, speaker, text] = l.match(/^\*\*(.+?)\*\*:\s*(.*)$/);
        return { speaker, line: text };
      });
  }

  const handleGenerateStory = async () => {
    setLoading(true);
    try {
      const lines = await generateStory({
        family,
        storyType,
        length,
        timePeriod,
        context,
      });
      console.log("Generated Story:", lines);
      setStoryLines(lines);
    } catch (e) {
      console.error("Story generation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
      {/* Night Sky Decorations */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-10 right-10 w-2 h-2 bg-white rounded-full opacity-70"></div>
      <div className="absolute top-20 left-1/2 w-1 h-1 bg-white rounded-full opacity-60"></div>
      <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-75"></div>
      {/* Moon */}
      <div className="absolute top-12 left-12 w-16 h-16 bg-yellow-300 rounded-full shadow-lg opacity-70"></div>

      {/* Main App Content */}
      <div className="relative z-10 p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl text-red-400 font-bold mb-4 text-center">
          Once Upon Us
        </h1>
        <p className="text-center text-gray-300 mb-8">
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
          onClick={handleGenerateStory}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>

        {storyLines.length > 0 && (
          <StoryViewer
            story={storyLines}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        )}
      </div>
    </div>
  );
}

export default App;
