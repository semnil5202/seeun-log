import { openai } from '@/shared/lib/openai';
import { SUMMARY_SYSTEM_PROMPT, SLUG_SYSTEM_PROMPT } from '@/shared/constants/prompts';

export async function streamSummary(
  title: string,
  content: string,
  onChunk: (text: string) => void,
): Promise<string> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    stream: true,
    messages: [
      { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
      { role: 'user', content: `제목: ${title}\n\n본문:\n${content}` },
    ],
  });

  let fullText = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? '';
    if (text) {
      fullText += text;
      onChunk(fullText);
    }
  }

  return fullText;
}

export async function fetchSlugSuggestions(text: string): Promise<string[]> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    response_format: { type: 'json_object' },
    stream: true,
    messages: [
      { role: 'system', content: SLUG_SYSTEM_PROMPT },
      { role: 'user', content: text },
    ],
  });

  let fullText = '';
  for await (const chunk of stream) {
    fullText += chunk.choices[0]?.delta?.content ?? '';
  }

  const parsed = JSON.parse(fullText) as { slugs: string[] };
  if (!Array.isArray(parsed.slugs) || parsed.slugs.length === 0) {
    throw new Error('슬러그 추천 결과가 없습니다.');
  }

  return parsed.slugs.slice(0, 3);
}
