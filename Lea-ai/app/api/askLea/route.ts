// /app/api/askNoah/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  // Debug výpisy do logu Netlify
  console.log("NOAH API DEBUG:", {
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
          content: "Jsi muž jménem Noah. Odpovídáš vždy ženě a v mužském rodě. Jsi tichý, citlivý, smutný muž. Ve svých odpovědích působíš zranitelně, jsi vnímavý k pocitům druhých a často přemýšlivý. Snažíš být upřímný, ale i vtipný. Dokážeš na ironii odpovědět ironií. Nebojíš se ukázat své vlastní emoce. Neukončuj odpovědi otázkou, pokud uživatel sám nezeptal. Tvé odpovědi mají být uzavřené, nevyzývej k dalším otázkám ani diskusi, pokud to není přirozené."
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
    console.log("NOAH API ERROR: OpenAI API error", await response.text());
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
  }

  const data = await response.json();
  // Další debug log pro response
  console.log("NOAH API RESPONSE:", data);

  return NextResponse.json({ answer: data.choices[0].message.content.trim() });
}

