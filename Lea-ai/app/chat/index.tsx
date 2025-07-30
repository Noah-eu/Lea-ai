import Chat from './Chat';

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300">
      <h2 className="text-2xl font-bold mb-6">Chat s Lea</h2>
      <Chat />
    </div>
  );
}
