import { openai } from '@/shared/lib/openai';
import { CATEGORY_TRANSLATE_SYSTEM_PROMPT } from '@/shared/constants/prompts';
import type { TranslationLocale } from '@/shared/types/post';

export async function translateCategoryName(
  name: string,
): Promise<Record<TranslationLocale, string>> {
  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: CATEGORY_TRANSLATE_SYSTEM_PROMPT },
      { role: 'user', content: name },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error('번역 결과가 비어있습니다.');

  return JSON.parse(text) as Record<TranslationLocale, string>;
}
