import React from "react";

export default function StoryViewer({ storyText }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Your Story</h2>
      <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-scroll whitespace-pre-wrap">
        {storyText}
      </div>
    </div>
  );
}