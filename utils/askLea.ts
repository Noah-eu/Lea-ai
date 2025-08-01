export async function askLea(question: string): Promise<string> {
  const res = await fetch('/api/askLea', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Chyba při volání API');
  }

  return data.answer;
}
