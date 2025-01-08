"use client";

import { useState } from "react";
import { AiFillAudio, AiFillPauseCircle } from "react-icons/ai";

interface VoiceControlsProps {
  onVoiceInput: (transcript: string) => void;
}

export default function VoiceControls({ onVoiceInput }: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const recognition =
    typeof window !== "undefined" && "webkitSpeechRecognition" in window
      ? new (window as any).webkitSpeechRecognition()
      : null;

  const startListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event: any) =>
      console.error("Speech recognition error:", event.error);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onVoiceInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={
          isListening
            ? () => {
                recognition.stop();
                setIsListening(false);
              }
            : startListening
        }
        className={`px-3 py-1 rounded-full hover:bg-gray-200`}
      >
        {isListening ? <AiFillPauseCircle /> : <AiFillAudio />}
      </button>
    </div>
  );
}
