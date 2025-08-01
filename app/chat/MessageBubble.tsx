type MessageBubbleProps = {
  sender: "user" | "lea";
  text: string;
};

export default function MessageBubble({ sender, text }: MessageBubbleProps) {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
      {sender === "lea" && (
        <img
          src="/lea.jpg"
          alt="Lea"
          className="w-7 h-7 rounded-full mr-2 self-end border border-pink-400"
        />
      )}
      <div
        className={`
          rounded-2xl px-4 py-2 max-w-xs
          ${sender === "user"
            ? "bg-gray-700 text-gray-100 self-end"
            : "bg-pink-800 text-white self-start"}
        `}
      >
        {text}
      </div>
    </div>
  );
}
