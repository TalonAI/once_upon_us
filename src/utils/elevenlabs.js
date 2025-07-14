const narratorVoiceId = import.meta.env.VITE_VOICE_NARRATOR_ID || '8LVfoRdkh4zgjr8v5ObE';

export async function speakWithVoice(text, voiceId = narratorVoiceId) {
  if (!voiceId) {
    console.error('Voice ID is undefined');
    return;
  }

  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ElevenLabs API key missing');
    return;
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.8,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.status}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}
