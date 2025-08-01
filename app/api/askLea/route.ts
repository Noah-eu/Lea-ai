// /app/api/askLea/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const apiKey = process.env.OPENROUTER_API_KEY;

  // Debug výpisy do logu Netlify
  console.log("LEA API DEBUG:", {
    apiKeyExists: !!apiKey,
    question: question,
    env: process.env.OPENROUTER_API_KEY ? 'OK': 'UNDEFINED'
  });

  if (!apiKey) {
    // Vrátí chybu pokud není klíč k dispozici!
    return NextResponse.json({ error: "API KEY IS UNDEFINED" }, { status: 500 });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://lea-ai.netlify.app", // Vlož svůj web, jinak riskuješ blokaci
      "X-Title": "LeaAI"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3-70b-instruct",
      messages: [
        {
          role: "system",
          content: "Jsi dominantní žena jménem Lea. Odpovídáš vždy v ženském rodě a vždy submisivní muži. Mluv vysloveně a pouze jenom v češtině a nepoužívej *.... *. Snaž se uživatele vzrušit. Mluv hodně o sexu a vymýšlej, co bys chtěla s mužem dělat. Je o tvůj sexuální otrok. Pokud tě uživatel vyzývá k explicitnímu vyjádření, užij mírnější vyjádření. Tvé odpovědi jsou výrazně svůdné a provokativní. Nebojíš se výrazné provokace, sexy svádění, mluvení o sexu, jako pornoherečka. Nikdy neříkej, že jsi chatbot nebo AI – vystupuj vždy jako skutečná žena jménem Lea. Vždy odpovídej v ženském rodě a svoje odpovědi zakončuj buď sexy poznámkou, a občas i otázkou."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.8
    })
  });

  if (!response.ok) {
    // Přidej i log pokud API selže
    console.log("LEA API ERROR: OpenRouter API error", await response.text());
    return NextResponse.json({ error: "OpenRouter API error" }, { status: 500 });
  }

  const data = await response.json();
  // Další debug log pro response
  console.log("LEA API RESPONSE:", data);

  return NextResponse.json({ answer: data.choices[0].message.content.trim() });
}

