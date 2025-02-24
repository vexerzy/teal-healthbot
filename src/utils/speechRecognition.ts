
export const initSpeechRecognition = () => {
  if (typeof window !== "undefined") {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      return new SpeechRecognition();
    }
  }
  return null;
};
