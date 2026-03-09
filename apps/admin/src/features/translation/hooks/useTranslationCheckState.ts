import { useCallback, useState } from 'react';

import type { CheckableField } from '../types';

type UseTranslationCheckStateReturn = {
  checkedFields: Set<CheckableField>;
  checkedSections: Set<number>;
  isAllChecked: boolean;
  isContentAllChecked: boolean;
  isContentIndeterminate: boolean;
  hasAnyChecked: boolean;
  toggleField: (field: CheckableField) => void;
  toggleSection: (index: number) => void;
  toggleAllContent: () => void;
  toggleAll: () => void;
  initFromDirty: (dirtyFields: Set<string>, dirtySections: Set<number>) => void;
};

const FIELD_TO_CHECKABLE: Record<string, CheckableField> = {
  title: 'title',
  description: 'description',
  place_name: 'place_name',
  address: 'address',
  product_name: 'product_name',
  purchase_source: 'purchase_source',
  price_prefix: 'price_prefix',
  image_alts: 'image_alts',
};

export function useTranslationCheckState(
  allFields: CheckableField[],
  sectionCount: number,
): UseTranslationCheckStateReturn {
  const [checkedFields, setCheckedFields] = useState<Set<CheckableField>>(new Set());
  const [checkedSections, setCheckedSections] = useState<Set<number>>(new Set());

  const isContentAllChecked = sectionCount > 0 && checkedSections.size === sectionCount;
  const isContentIndeterminate = checkedSections.size > 0 && !isContentAllChecked;
  const isAllChecked =
    allFields.length > 0 &&
    allFields.every((f) => checkedFields.has(f)) &&
    isContentAllChecked;
  const hasAnyChecked = checkedFields.size > 0 || checkedSections.size > 0;

  const toggleField = useCallback((field: CheckableField) => {
    setCheckedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  }, []);

  const toggleSection = useCallback((index: number) => {
    setCheckedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const toggleAllContent = useCallback(() => {
    setCheckedSections((prev) => {
      if (prev.size === sectionCount) return new Set();
      const all = new Set<number>();
      for (let i = 0; i < sectionCount; i++) all.add(i);
      return all;
    });
  }, [sectionCount]);

  const toggleAll = useCallback(() => {
    if (isAllChecked) {
      setCheckedFields(new Set());
      setCheckedSections(new Set());
    } else {
      setCheckedFields(new Set(allFields));
      const all = new Set<number>();
      for (let i = 0; i < sectionCount; i++) all.add(i);
      setCheckedSections(all);
    }
  }, [isAllChecked, allFields, sectionCount]);

  const initFromDirty = useCallback(
    (dirtyFieldsSet: Set<string>, dirtySectionsSet: Set<number>) => {
      const fields = new Set<CheckableField>();
      for (const f of dirtyFieldsSet) {
        const mapped = FIELD_TO_CHECKABLE[f];
        if (mapped) fields.add(mapped);
      }
      setCheckedFields(fields);
      setCheckedSections(new Set(dirtySectionsSet));
    },
    [],
  );

  return {
    checkedFields,
    checkedSections,
    isAllChecked,
    isContentAllChecked,
    isContentIndeterminate,
    hasAnyChecked,
    toggleField,
    toggleSection,
    toggleAllContent,
    toggleAll,
    initFromDirty,
  };
}
