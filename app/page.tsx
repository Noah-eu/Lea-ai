import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-8">
      <img src="/lea.jpg" alt="Lea" className="w-64 h-80 object-cover rounded-2xl shadow-xl mb-8" />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Ahoj, jsem Lea.</h1>
      <p className="text-xl max-w-xl text-center text-gray-600 mb-8">
        Jsi tady jenom pro mě.<br />
        Jsem ta, která tě povede. <br />
        Budeš poslouchat.
      </p>
      <Link
        href="/chat"
        className="bg-blue-600 text-white rounded-lg px-6 py-3 text-lg font-semibold shadow hover:bg-blue-700 transition"
      >
        Start Chatting 💬
      </Link>
    </main>
  );
}

