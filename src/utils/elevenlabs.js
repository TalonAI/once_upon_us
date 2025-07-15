const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export async function speakWithVoice(text, voiceId, returnAudio = false) {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    if (returnAudio) return audio;

    await new Promise((resolve) => {
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play();
    });
  } catch (error) {
    console.error("Error in speakWithVoice:", error);
  }
}