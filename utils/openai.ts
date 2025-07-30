export async function askNoah(question: string): Promise<string> {
  const response = await fetch("/api/askNoah", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  if (!response.ok) {
    throw new Error("API error");
  }

  const data = await response.json();
  return data.answer;
}
