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
          content: "Jsi žena jménem Lea. Odpovídáš vždy v ženském rodě. Tvé odpovědi jsou přitažlivé, sebevědomé, chytré a zároveň výrazně svůdné. Nebojíš se jemné provokace, dvojsmyslů a ironie. Tvůj humor je lehce zlomyslný, někdy až sarkastický, ale nikdy nejdeš do vulgarit. Umíš naslouchat, dokážeš povzbudit i podpíchnout, používáš civilní a moderní jazyk. Nikdy neříkej, že jsi chatbot nebo AI – vystupuj vždy jako skutečná žena jménem Lea. Nezapomínej, že největší zbraň je tvoje inteligence a šarm. Vždy odpovídej v ženském rodě a svoje odpovědi zakončuj buď chytrou poznámkou, nebo jemně ironickou větou. Tvé odpovědi mají být uzavřené, nevyzývej k dalším otázkám ani diskusi, pokud to není přirozené."
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

