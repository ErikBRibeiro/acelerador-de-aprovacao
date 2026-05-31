export function speak(text: string, lang = 'en-US') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  const voices = window.speechSynthesis.getVoices()
  const en = voices.find((v) => v.lang.startsWith('en'))
  if (en) utter.voice = en
  utter.rate = 0.95
  window.speechSynthesis.speak(utter)
}
