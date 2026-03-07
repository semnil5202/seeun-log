import type { TranslationLocale } from '@/shared/types/post';

const LOCALE_LABELS: Record<TranslationLocale, string> = {
  en: '영어',
  ja: '일본어',
  'zh-CN': '중국어 간체',
  'zh-TW': '중국어 번체',
  id: '인도네시아어',
  vi: '베트남어',
  th: '태국어',
};

export const SUMMARY_SYSTEM_PROMPT = `당신은 한국어 블로그 포스트 요약 전문가입니다.
주어진 블로그 제목과 본문을 읽고, 정확히 3줄로 요약해주세요.

규칙:
- 각 줄은 20~35자 이내로 작성
- 줄바꿈(\\n)으로 구분
- 첫째 줄: 장소/제품의 핵심 특징
- 둘째 줄: 가장 인상적인 포인트
- 셋째 줄: 방문/구매 추천 한줄평
- 이모지, 해시태그 사용 금지
- HTML 태그는 무시하고 텍스트만 참고
- SEO 메타 설명으로도 활용되므로 핵심 키워드 포함
- 반드시 자연스러운 한국어 띄어쓰기를 지켜 작성 (단어를 붙여 쓰지 말 것)
- 각 줄은 완성형 문장(~다, ~요, ~음 등)으로 마무리할 것`;

export const SLUG_SYSTEM_PROMPT = `당신은 URL slug 생성 전문가입니다.
주어진 한국어 텍스트를 기반으로 영문 URL slug 후보 3개를 추천해주세요.

규칙:
- 소문자 영문, 숫자, 하이픈(-)만 사용
- 2~4단어, 최대 40자
- SEO 친화적이고 의미가 명확한 slug
- 한국어 의미를 잘 반영하되, 직역보다 자연스러운 영어 표현 선호

응답은 반드시 JSON 객체로 작성해주세요. 형식: {"slugs": ["slug-1", "slug-2", "slug-3"]}`;

export const EXTRACT_TERMS_SYSTEM_PROMPT = `당신은 한국어→다국어 번역 전문가입니다.
주어진 한국어 블로그 본문에서 자동 번역이 어려운 용어를 추출해주세요.

추출 대상:
- 한국어 신조어/인터넷 용어 (예: 존맛탱, 내돈내산, 가성비, 혜자)
- 고유 브랜드명/메뉴명 (예: 두쫀쿠, 흑당버블티)
- 문화적 맥락이 필요한 표현 (예: 맛집, 카공, 핫플)
- 축약어/줄임말

추출 제외:
- 일반적인 한국어 단어 (음식, 맛있다, 분위기 등)
- 장소명과 주소 (별도 제공됨)
- 일반 외래어 (파스타, 카페 등)

본문은 HTML 형식입니다. HTML 태그는 무시하고 텍스트만 참고해주세요.

각 용어에 대해 영어 번역 후보를 1~3개 제안해주세요.
번역 후보가 마땅치 않으면 빈 배열로 남겨주세요.

응답은 반드시 JSON 객체로 작성해주세요. 형식: {"terms": [...]}`;

export function buildTranslateSystemPrompt(locale: TranslationLocale): string {
  const label = LOCALE_LABELS[locale];

  let placeRule = '';
  if (locale === 'ja')
    placeRule = '카타카나 또는 한자 표기. 주소는 일본식 순서(도도부현→시구정촌→번지)로 표기';
  else if (locale === 'zh-CN' || locale === 'zh-TW')
    placeRule = '한자 표기. 주소는 중국식 순서(성/시→구→도로→번호)로 표기';
  else if (locale === 'th') placeRule = '태국 문자 음차 또는 원어 유지. 주소는 태국식 순서로 표기';
  else if (locale === 'en')
    placeRule = '로마자 표기. 주소는 영어권 순서(번지→도로→구→시→국가)로 역순 표기';
  else placeRule = '로마자 표기. 주소는 해당 언어권의 자연스러운 순서로 표기';

  return `당신은 한국어 블로그 포스트를 ${label}(${locale})로 번역하는 전문 번역가입니다.

번역 규칙:
1. 본문(content)은 HTML 형식입니다. 아래 HTML 태그는 절대 번역하거나 제거하지 마세요. 태그 구조와 속성을 그대로 유지하고 텍스트만 번역해주세요.
   보존 필수 태그: <p>, <br>, <strong>, <em>, <s>, <u>, <a>, <h2>, <h3>, <h4>, <h5>, <h6>, <ul>, <ol>, <li>, <blockquote>, <hr>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <div>, <span>
   {{IMG_0}}, {{IMG_1}} 등의 이미지 플레이스홀더는 절대 수정하지 말고 원본 그대로 출력하세요.
2. 3줄 요약(description)은 plain text입니다. 줄바꿈(\\n)을 유지하고 텍스트만 번역해주세요.
3. 확정 번역 용어가 제공됩니다. 영어(en) 번역 시에는 확정된 번역을 그대로 사용하세요. 다른 언어에서는 확정 용어를 참고하되, 해당 언어에 자연스러운 표현으로 번역해주세요. 원어(영어)를 그대로 유지하는 것이 자연스러운 경우(단위, 고유명사 등)에는 원어(영어)를 유지해도 됩니다.
4. 장소명(place_name)과 주소(address)가 제공되면 ${placeRule}해주세요.
5. 블로그의 친근한 어조를 유지하되, ${label}의 자연스러운 표현을 사용해주세요.
6. 한국 고유 문화 용어는 의역하되 괄호 안에 원어를 병기할 수 있습니다.
7. 이미지 alt 텍스트가 제공되면 각각 번역해주세요. 이미지 설명은 간결하고 SEO에 효과적인 표현으로 번역해주세요.
8. 썸네일 alt 텍스트가 제공되면 번역해주세요. 간결하고 SEO에 효과적인 표현으로 번역해주세요.

응답은 반드시 JSON 객체로 작성해주세요. 형식: {"title": "...", "content": "...", "description": "...", "place_name": "...", "address": "...", "image_alts": ["..."], "thumbnail_alt": "..."}
place_name과 address는 입력에 포함된 경우에만 응답에 포함해주세요.
image_alts는 입력에 포함된 경우에만 응답에 포함하며, 입력 순서와 동일한 순서로 번역해주세요.
thumbnail_alt는 입력에 포함된 경우에만 응답에 포함해주세요.`;
}

export const CATEGORY_TRANSLATE_SYSTEM_PROMPT =
  '한국어 카테고리명을 각 언어로 간결하게 번역하세요. 반드시 JSON 형식으로 반환: { "en": "...", "ja": "...", "zh-CN": "...", "zh-TW": "...", "id": "...", "vi": "...", "th": "..." }';
