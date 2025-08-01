"use client";

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { askLea } from "../../utils/askLea";

type Message = {
  sender: "user" | "lea";
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll na konec při přidání zprávy
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Local storage: načti historii
  useEffect(() => {
    const stored = localStorage.getItem("lea-messages");
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  // Local storage: ulož historii
  useEffect(() => {
    localStorage.setItem("lea-messages", JSON.stringify(messages));
  }, [messages]);

  // Odeslání zprávy
  async function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askLea(input);
      setMessages((msgs) => [...msgs, { sender: "lea", text: answer }]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: "lea", text: "Omlouvám se, něco se pokazilo." },
      ]);
    }
    setLoading(false);
  }

  // Smazání chatu
  function handleClearChat() {
    setMessages([]);
    localStorage.removeItem("lea-messages");
  }

  return (
    <div className="max-w-md w-full mx-auto flex flex-col h-[90vh] max-h-[700px] bg-white rounded-2xl shadow-xl p-4">
      {/* Hlavička */}
      <div className="flex flex-col items-center mb-4">
        <img
          src="/lea.jpg"
          alt="Lea"
          className="w-16 h-16 rounded-full shadow-md"
        />
        <div className="font-semibold text-gray-700 mt-2 text-lg">Lea</div>
      </div>
      {/* Chat */}
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <MessageBubble sender="lea" text="Lea píše..." />}
        <div ref={bottomRef} />
      </div>
      {/* Input + Odeslat */}
      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Napiš zprávu Lei…"
          disabled={loading}
        />
        <button
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
          onClick={handleSend}
          disabled={loading}
        >
          Odeslat
        </button>
      </div>
      {/* Tlačítko smazat chat */}
      <button
        onClick={handleClearChat}
        className="w-full py-2 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
        style={{ marginTop: 2 }}
      >
        Smazat chat
      </button>
    </div>
  );
}
