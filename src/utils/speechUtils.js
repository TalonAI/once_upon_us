let utterance;
let isPaused = false;

function getVoices() {
  return new Promise((resolve) => {
    const v = window.speechSynthesis.getVoices();
    if (v.length) return resolve(v);
    window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices());
  });
}

export async function speakText(segments) {
  if (!Array.isArray(segments) || segments.length === 0) return;

  const voices = await getVoices();
  const defaultVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
  const fullText = segments.map(seg => seg.text.replace(/\([^)]+\)/g, "").trim()).join(" ");
  utterance = new SpeechSynthesisUtterance(fullText);
  utterance.voice = defaultVoice;
  utterance.rate = 1; utterance.pitch = 1; utterance.volume = 1;
  isPaused = false;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  utterance.onend = () => { utterance = null; };
  utterance.onerror = e => console.error("TTS error:", e);
}

export function pauseSpeech() {
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause(); isPaused = true;
  }
}

export function resumeSpeech() {
  if (isPaused) { window.speechSynthesis.resume(); isPaused = false; }
}

export function stopSpeech() {
  window.speechSynthesis.cancel(); isPaused = false; utterance = null;
}