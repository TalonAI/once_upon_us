// src/utils/speechUtils.js

let utterance, audio, isPaused = false;

// Env
const ELEVEN_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_MAP = {
  Narrator: import.meta.env.VITE_VOICE_NARRATOR_ID,
  Mother:   import.meta.env.VITE_VOICE_MOTHER_ID,
  Father:   import.meta.env.VITE_VOICE_FATHER_ID,
  Son:      import.meta.env.VITE_VOICE_SON_ID,
  Daughter: import.meta.env.VITE_VOICE_DAUGHTER_ID,
  Uncle:    import.meta.env.VITE_VOICE_UNCLE_ID,
  Aunt:     import.meta.env.VITE_VOICE_AUNT_ID,
};

async function elevenSpeak(text, voiceId) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVEN_KEY,
      },
      body: JSON.stringify({ text, model_id: "eleven_monolingual_v1" }),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    audio = new Audio(URL.createObjectURL(blob));
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play();
  });
}

export async function speakText(text, role = "Narrator") {
  if (!text) return;
  const cleaned = text.replace(/\([^)]+\)/g, "").trim();
  if (!cleaned) return;

  const voiceId = VOICE_MAP[role] || VOICE_MAP.Narrator;
  if (ELEVEN_KEY && voiceId) {
    try {
      await elevenSpeak(cleaned, voiceId);
      return;
    } catch (e) {
      console.warn("ElevenLabs failed, falling back:", e);
    }
  }

  // Browser fallback
  utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return new Promise((r) => (utterance.onend = r));
}

export function pauseSpeech() {
  if (audio && !audio.paused) audio.pause(), (isPaused = true);
  else if (speechSynthesis.speaking && !speechSynthesis.paused)
    speechSynthesis.pause(), (isPaused = true);
}

export function resumeSpeech() {
  if (audio && audio.paused) audio.play(), (isPaused = false);
  else if (isPaused) speechSynthesis.resume(), (isPaused = false);
}

export function stopSpeech(setIsPlaying) {
  if (audio) audio.pause(), (audio = null);
  window.speechSynthesis.cancel();
  isPaused = false;
  if (typeof setIsPlaying === "function") setIsPlaying(false);
}
