import OpenAI from 'openai';

export const runtime = 'edge';

const SYSTEM_PROMPT = `당신은 URL slug 생성 전문가입니다.
주어진 한국어 텍스트를 기반으로 영문 URL slug 후보 3개를 추천해주세요.

규칙:
- 소문자 영문, 숫자, 하이픈(-)만 사용
- 2~4단어, 최대 40자
- SEO 친화적이고 의미가 명확한 slug
- 한국어 의미를 잘 반영하되, 직역보다 자연스러운 영어 표현 선호

응답은 반드시 JSON 객체로 작성해주세요. 형식: {"slugs": ["slug-1", "slug-2", "slug-3"]}`;

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text: string };

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    response_format: { type: 'json_object' },
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: text },
    ],
  });

  let fullText = '';
  for await (const chunk of stream) {
    fullText += chunk.choices[0]?.delta?.content ?? '';
  }

  const parsed = JSON.parse(fullText) as { slugs: string[] };
  if (!Array.isArray(parsed.slugs) || parsed.slugs.length === 0) {
    return Response.json({ error: '슬러그 추천 결과가 없습니다.' }, { status: 500 });
  }

  return Response.json({ slugs: parsed.slugs.slice(0, 3) });
}
