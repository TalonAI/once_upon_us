// src/utils/generateStory.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateStory({ family, storyType, length, timePeriod, context }) {
  const membersDescription = family
    .map((m) => `${m.name} the ${m.role.toLowerCase()} (${m.age})`)
    .join(", ");

  const prompt = `
Create a ${length.toLowerCase()} ${timePeriod.toLowerCase()} ${storyType.toLowerCase()} story featuring these family members: ${membersDescription}.
Use this background context for the plot: "${context}"

Formatting Rules:
1. Begin the story with **Narrator**: to set the scene.
2. Alternate lines between **Narrator** and character dialogue where appropriate.
3. Each line MUST follow this exact pattern: **Role**: "Spoken dialogue here."
4. ONLY use characters from the family list or Narrator. No extra names.
5. Do NOT include stage directions or internal thoughts unless they are part of the Narrator’s line.
6. Your final output should be 10–20 lines.

Example:
**Narrator**: "It was a quiet morning when the family reached the station."
**Mom**: "Let’s hurry or we’ll miss our train!"
**Daughter**: "I'm ready, Mom!"
**Narrator**: "They rushed down the platform, the conductor calling out to board."

Stick to this format strictly. If you fail to format a line correctly, it will not be read aloud.
  `.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a strict formatter for a children’s storytelling app. Output ONLY properly formatted lines, one per line, in the form: **Role**: \"Dialogue\". If a line cannot be formatted this way, omit it.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
    });

    const message = response.choices?.[0]?.message;

    if (!message || typeof message.content !== "string") {
      console.error("Invalid response from OpenAI:", message);
      return [];
    }

    const rawStory = message.content.trim();

    const storyLines = rawStory
      .split("\n")
      .filter(line => /^\*\*(.+?)\*\*:/.test(line)) // Only lines that look like **Role**:
      .map(line => {
        const match = line.match(/^\*\*(.+?)\*\*:\s*"(.*)"$/);
        if (!match) return null;
        const [, role, text] = match;
        return { role, text };
      })
      .filter(Boolean); // Remove nulls

    return storyLines;
  } catch (error) {
    console.error("Story generation failed:", error);
    return [];
  }
}
