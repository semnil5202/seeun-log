import type { SelectiveTranslateOptions, TranslationResult } from '../types';
import { splitHtmlIntoSections, reassembleSections } from './html-sections';

/** selective 재번역 결과를 기존 번역에 머지한다. */
export function mergeSelectiveResult(
  existing: TranslationResult,
  partial: TranslationResult,
  options: SelectiveTranslateOptions,
): TranslationResult {
  const fields = new Set(options.targetFields ?? []);
  const targetIndices = options.targetSectionIndices ?? [];
  const hasSections = targetIndices.length > 0;
  let mergedContent = existing.content;
  if (hasSections) {
    const existingSections = splitHtmlIntoSections(existing.content);
    const newSections = splitHtmlIntoSections(partial.content);
    const targetSet = new Set(targetIndices);
    const merged = existingSections.map((s) => {
      if (targetSet.has(s.index)) {
        const replacement = newSections[s.index];
        if (replacement) return { ...s, html: replacement.html };
      }
      return s;
    });
    const appendStart = existingSections.length;
    for (const ns of newSections) {
      if (ns.index >= appendStart) merged.push(ns);
    }
    mergedContent = reassembleSections(merged);
  }
  return {
    ...existing,
    title: fields.has('title') ? partial.title : existing.title,
    description: fields.has('description') ? partial.description : existing.description,
    place_name: fields.has('place_name') ? partial.place_name : existing.place_name,
    address: fields.has('address') ? partial.address : existing.address,
    product_name: fields.has('product_name') ? partial.product_name : existing.product_name,
    purchase_source: fields.has('purchase_source') ? partial.purchase_source : existing.purchase_source,
    price_prefix: fields.has('price_prefix') ? partial.price_prefix : existing.price_prefix,
    image_alts: fields.has('image_alts') ? partial.image_alts : existing.image_alts,
    thumbnail_alt: fields.has('image_alts') ? partial.thumbnail_alt : existing.thumbnail_alt,
    content: hasSections ? mergedContent : existing.content,
  };
}
