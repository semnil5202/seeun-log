export async function streamSummary(
  title: string,
  content: string,
  onChunk: (text: string) => void,
): Promise<string> {
  const res = await fetch('/api/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) throw new Error('요약 생성에 실패했습니다.');

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    fullText += chunk;
    onChunk(fullText);
  }

  return fullText;
}

export async function fetchSlugSuggestions(text: string): Promise<string[]> {
  const res = await fetch('/api/slug', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error('슬러그 추천에 실패했습니다.');

  const data = (await res.json()) as { slugs: string[] };
  return data.slugs;
}
