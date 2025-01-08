"use client";

import { useState } from "react";
import {
  AiFillAndroid,
  AiFillCustomerService,
  AiOutlineSend,
} from "react-icons/ai";
import VoiceControls from "@/components/VoiceControls";
import { Annotation } from "@/types";

interface ChatBoxProps {
  context: string;
  setAnnotations: (annotations: Array<Annotation>) => void;
  setGoToPage: (pageNumber: number) => void;
  chatHistory: { user: string; ai: string }[];
  setChatHistory: (chatHistory: { user: string; ai: string }[]) => void;
}

export default function ChatBox({
  context,
  setAnnotations,
  setGoToPage,
  chatHistory,
  setChatHistory,
}: ChatBoxProps) {
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    const newHistory = [...chatHistory, { user: userMessage, ai: "..." }];
    setChatHistory(newHistory);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage, context }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch response.");
      }

      const data = await response.json();

      setAnnotations([
        { pageNumber: data.response.page, text: data.response.highlight },
      ]);
      setGoToPage(data.response.page);

      const updatedHistory = [...newHistory];
      updatedHistory[updatedHistory.length - 1].ai = data.response.answer;
      setChatHistory(updatedHistory);
    } catch (error: unknown) {
      console.error("Error sending message:", (error as Error).message);
      const updatedHistory = [...newHistory];
      updatedHistory[updatedHistory.length - 1].ai =
        "Sorry, I couldn't process your request.";
      setChatHistory(updatedHistory);
    }
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in this browser.");
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50 border max-h-full">
      <div className="flex-grow overflow-auto mb-4">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className="mb-2 flex flex-col gap-2">
            <p className="text-blue-600 self-end bg-gray-200 px-3 py-1 rounded-full">
              {msg.user}
            </p>
            <div className="text-gray-700 flex items-start gap-2 justify-between">
              <AiFillAndroid className="border border-gray-200 text-black rounded-full w-8 h-8 min-w-8 py-1" />
              <div className="self-start flex-grow">
                {msg.ai}
                <button
                  onClick={() => handleSpeak(msg.ai)}
                  className="p-2 aspect-square rounded-full hover:bg-gray-200"
                >
                  <AiFillCustomerService />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1 px-2 py-1 rounded-full border border-gray-200 bg-white flex-grow">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow border-none focus-visible:ring-0 focus-visible:outline-none p-2 rounded-full"
          />
          <VoiceControls onVoiceInput={handleVoiceInput} />
        </div>
        <button
          onClick={sendMessage}
          className="bg-gray-600 text-white aspect-square rounded-full p-3 hover:bg-green-600 flex justify-center items-center"
        >
          <AiOutlineSend />
        </button>
      </div>
    </div>
  );
}
