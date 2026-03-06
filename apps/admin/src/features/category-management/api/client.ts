import { openai } from '@/shared/lib/openai';
import type { TranslationLocale } from '@/shared/types/post';

export async function translateCategoryName(
  name: string,
): Promise<Record<TranslationLocale, string>> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-nano',
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          '한국어 카테고리명을 각 언어로 간결하게 번역하세요. 반드시 JSON 형식으로 반환: { "en": "...", "ja": "...", "zh-CN": "...", "zh-TW": "...", "id": "...", "vi": "...", "th": "..." }',
      },
      { role: 'user', content: name },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error('번역 결과가 비어있습니다.');

  return JSON.parse(text) as Record<TranslationLocale, string>;
}
