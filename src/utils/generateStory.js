// src/utils/generateStory.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Generate a structured story with narrator and character dialogue.
 * Returns a raw markdown string formatted as **Role**: Dialogue per line.
 */
export async function generateStory({ family, storyType, length, timePeriod, context }) {
  // Build a description of family members: "Paul the son (8), Lisa the mother (35), ..."
  const membersDescription = family
    .map((m) => `${m.name} the ${m.role.toLowerCase()} (${m.age})`)
    .join(", ");

  // Prompt the model to include narrator lines and dialogue
  const prompt = `
Write a ${length.toLowerCase()} ${timePeriod.toLowerCase()} ${storyType.toLowerCase()} story starring these family members: ${membersDescription}.
Begin with a narrator setting the scene, and include brief narration between character dialogues to advance the plot.
Use this context: "${context}".
Format each line exactly as **Role**: Dialogue.
Wrap spoken lines in quotes.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a creative, concise story generator." },
      { role: "user", content: prompt.trim() }
    ],
  });

  return response.choices[0].message.content.trim();
}
