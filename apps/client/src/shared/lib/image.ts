/** 이미지 CDN URL 변환 및 확대 아이콘 주입 유틸리티. */

const RESIZED_SUFFIX = '_688';
const RESIZED_MAX_WIDTH = 688;

export function optimizedUrl(original: string): string {
  if (!original.endsWith('.webp')) return original;
  return original.replace(/\.webp$/, `${RESIZED_SUFFIX}.webp`);
}

export function injectOptimizedUrls(html: string): string {
  return html.replace(
    /<img([^>]*?)src="([^"]+?)\.webp"([^>]*?)>/gi,
    (match, before, base, after) => {
      if (!base.includes('media.eunminlog.site')) return match;

      let result = `<img${before}src="${base}${RESIZED_SUFFIX}.webp" data-full="${base}.webp"${after}>`;

      const widthMatch = result.match(/width="(\d+)"/);
      const heightMatch = result.match(/height="(\d+)"/);
      if (widthMatch && heightMatch) {
        const origW = parseInt(widthMatch[1]);
        const origH = parseInt(heightMatch[1]);
        if (origW > RESIZED_MAX_WIDTH) {
          const scale = RESIZED_MAX_WIDTH / origW;
          const newH = Math.round(origH * scale);
          result = result
            .replace(/width="\d+"/, `width="${RESIZED_MAX_WIDTH}"`)
            .replace(/height="\d+"/, `height="${newH}"`);
        }
      }

      result = result.replace(/>$/, ' loading="lazy" decoding="async">');
      return result;
    },
  );
}

const ZOOM_ICON =
  '<span class="img-zoom-hint" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg></span>';

export function injectZoomIcons(html: string): string {
  const preserved: string[] = [];
  let processed = html.replace(
    /<div\s+data-type="image-carousel"[^>]*>[\s\S]*?<\/div>|<aside\s+data-type="link-bookmark"[^>]*>[\s\S]*?<\/aside>/gi,
    (match) => {
      preserved.push(match);
      return `<!--ZOOM_SKIP_${preserved.length - 1}-->`;
    },
  );

  processed = processed.replace(/<img([^>]*?)>/gi, (_match, attrs: string) => {
    let width = '100%';
    let newAttrs = attrs;
    const styleMatch = attrs.match(/style="([^"]*)"/);
    if (styleMatch) {
      const widthMatch = styleMatch[1].match(/width:\s*([^;]+)/);
      if (widthMatch) {
        width = widthMatch[1].trim();
        const newStyle = styleMatch[1].replace(/width:\s*[^;]+;?\s*/, 'width:100%;');
        newAttrs = attrs.replace(/style="[^"]*"/, `style="${newStyle}"`);
      }
    }

    return `<span class="img-zoom-parent" style="position:relative;display:inline-block;width:${width};vertical-align:top"><img${newAttrs}>${ZOOM_ICON}</span>`;
  });

  preserved.forEach((block, i) => {
    processed = processed.replace(`<!--ZOOM_SKIP_${i}-->`, block);
  });

  return processed;
}
