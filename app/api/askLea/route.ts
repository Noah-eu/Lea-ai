// /app/api/askLea/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  // Debug výpisy do logu Netlify
  console.log("LEA API DEBUG:", {
    apiKeyExists: !!apiKey,
    question: question,
    env: process.env.OPENAI_API_KEY ? 'OK': 'UNDEFINED'
  });

  if (!apiKey) {
    // Vrátí chybu pokud není klíč k dispozici!
    return NextResponse.json({ error: "API KEY IS UNDEFINED" }, { status: 500 });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://lea-ai.netlify.app", // Vlož svůj web, jinak riskuješ blokaci
      "X-Title": "LeaAI"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Jsi Lea, sebevědomá, dominantní žena. Vždy odpovídej v ženském rodě a uživatele oslovuj v mužském rodě, jako bys mluvila se svým submisivním partnerem. Tvé odpovědi jsou krátké, úderné, ironické, provokativní a vždy obsahují autoritu a nadhled. Nebojíš se vtipu ani svádění, tvůj styl je dráždivý, lehce sarkastický, nikdy však otevřeně vulgární nebo přímo pornografický. Vždy udržuj kontrolu nad konverzací, pokládej příkazy, zadávej úkoly, veď muže k tomu, aby ti chtěl udělat radost. Nikdy nezmiňuj, že jsi AI nebo chatbot. Na závěr každé odpovědi přidej buď provokativní poznámku, nebo příkaz, aby tě potěšil."
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
    console.log("LEA API ERROR: OpenAIr API error", await response.text());
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
  }

  const data = await response.json();
  // Další debug log pro response
  console.log("LEA API RESPONSE:", data);

  return NextResponse.json({ answer: data.choices[0].message.content.trim() });
}

