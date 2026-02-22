const AD_PLACEHOLDER = `\n\n<div class="not-prose w-full h-[300px] bg-gray-100 rounded-xl mx-auto my-8 flex items-center justify-center" role="complementary" aria-label="Advertisement"><span class="text-body2 text-gray-400 select-none">In-Article Adsense</span></div>\n\n`;

/**
 * 마크다운 본문의 H2 섹션 경계에 In-Article 광고를 삽입한다.
 * @param markdown 원본 마크다운 문자열
 */
export const insertInArticleAds = (markdown: string): string => {
  const parts = markdown.split(/(?=^## )/m);
  if (parts.length <= 2) return markdown;

  const secondIdx = 1;
  const lastIdx = parts.length - 1;

  return parts
    .map((part, i) => {
      if (i === secondIdx || (i === lastIdx && lastIdx !== secondIdx)) {
        return AD_PLACEHOLDER + part;
      }
      return part;
    })
    .join("");
};
