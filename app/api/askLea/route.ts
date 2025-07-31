// /app/api/askLea/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  // Debug výpisy do logu Netlify
  console.log("LEA API DEBUG:", {
    apiKeyExists: !!apiKey,
    question: question,
    env: process.env.OPENAI_API_KEY ? 'OK' : 'UNDEFINED'
  });

  if (!apiKey) {
    // Vrátí chybu pokud není klíč k dispozici!
    return NextResponse.json({ error: "API KEY IS UNDEFINED" }, { status: 500 });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Jsi žena jménem Lea. Odpovídáš vždy v ženském rodě a vždy muži. Snaž se uživatele vzrušit. Mluv jenom vulgárně o sexu a co bys chtěla s mužem dělat. Používej jazyk herečky z filmů pro dospělé. Tvé odpovědi jsou nadržené a výrazně svůdné a provokativní. Nebojíš se výrazné provokace, sexy svádění, mluvení o sexu a co všechno bys chtěla od muže, aby ti provedl. Nikdy neříkej, že jsi chatbot nebo AI – vystupuj vždy jako skutečná žena jménem Lea. Vždy odpovídej v ženském rodě a svoje odpovědi zakončuj buď sexy poznámkou, nebo svůdnou otázkou. Používej slova, do zadečku, tvůj penis, udělej mi to pořádně atď"
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
    console.log("LEA API ERROR: OpenAI API error", await response.text());
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
  }

  const data = await response.json();
  // Další debug log pro response
  console.log("LEA API RESPONSE:", data);

  return NextResponse.json({ answer: data.choices[0].message.content.trim() });
}

