"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { askLea } from "../../utils/openai";

type Message = {
  sender: 'user' | 'lea';
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Načtení historie z localStorage po načtení komponenty
  useEffect(() => {
    const saved = localStorage.getItem("lea-chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Uložení historie do localStorage při každé změně zpráv
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("lea-chat", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askLea(input);
      setMessages((msgs) => [
        ...msgs,
        { sender: 'lea', text: answer }
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'lea', text: "Omlouvám se, něco se pokazilo. Zkuste to prosím znovu." }
      ]);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md w-full mx-auto flex flex-col h-[90vh] max-h-[700px] bg-white rounded-2xl shadow-xl p-4">
      {/* Lei fotka v hlavičce */}
      <div className="flex flex-col items-center mb-4">
        <img src="/lea.jpg" alt="Lea" className="w-16 h-16 rounded-full shadow-md" />
        <div className="font-semibold text-gray-700 mt-2">Lea</div>
      </div>
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        {loading && (
          <MessageBubble sender="lea" text="Lea přemýšlí..." />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl p-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
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
    </div>
  );
}
