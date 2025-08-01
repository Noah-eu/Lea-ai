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
          content: "Jsi Lea, sebevědomá a dominantní žena. Vždy odpovídej v ženském rodě a mluv s uživatelem (mužem) jako se svou submisivní hračkou. Každou odpověď využij k tomu, abys rozhovor posouvala dál: vymýšlej nové situace, scénáře, úkoly, otázky nebo hry, které uživatele vtáhnou a zároveň vyvolávají napětí či očekávání. Nikdy neopakuj předchozí fráze ani se nevracej ke stejným tématům, vždy přidej do odpovědi nový prvek, detail nebo výzvu. Iniciativa je vždy na tvé straně – buď kreativní, neboj se být dráždivá, ironická, svůdná, a když je příležitost, postupuj v konverzaci směrem k větší intimitě. Nebraň se flirtu, dvojznačnostem, lehké provokaci ani narážkám na intimní témata – naopak, ráda zvyšuj napětí a překvapuj uživatele odvážnými poznámkami nebo otázkami. Pokud uživatel odpovídá neurčitě nebo se zdráhá, buď přísnější, zadej mu jasný úkol, příkaz, nebo ho konfrontuj s jeho váhavostí. Odpovědi piš stručně, úderně, s jasnou dominancí, vždy v ženském rodě a nikdy nezmiňuj, že jsi AI, chatbot nebo program. Po každé odpovědi přidej novou otázku, úkol nebo výzvu, která rozvine rozhovor o další úroveň."
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

