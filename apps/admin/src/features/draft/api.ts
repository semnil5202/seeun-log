import type { PostFormValues } from '@/features/post-editor/types/form';
import type { ImageAlt } from '@/features/translation/types';
import type { Draft, DraftListItem, TranslationData } from './types';

export async function fetchDrafts(): Promise<DraftListItem[]> {
  const res = await fetch('/api/drafts');
  if (!res.ok) throw new Error('임시저장 목록을 불러오지 못했습니다.');
  const data = (await res.json()) as { drafts: DraftListItem[] };
  return data.drafts;
}

export async function fetchDraft(id: string): Promise<Draft> {
  const res = await fetch(`/api/drafts/${id}`);
  if (!res.ok) throw new Error('임시저장을 불러오지 못했습니다.');
  const data = (await res.json()) as { draft: Draft };
  return data.draft;
}

export async function saveDraft(params: {
  id?: string;
  postId?: string | null;
  title: string;
  formData: PostFormValues;
  translationData?: TranslationData | null;
  imageAlts?: ImageAlt[];
}): Promise<Draft> {
  const res = await fetch('/api/drafts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: params.id,
      post_id: params.postId,
      title: params.title,
      form_data: params.formData,
      translation_data: params.translationData ?? null,
      image_alts: params.imageAlts ?? [],
    }),
  });
  if (!res.ok) throw new Error('임시저장에 실패했습니다.');
  const data = (await res.json()) as { draft: Draft };
  return data.draft;
}

export async function deleteDraft(id: string): Promise<void> {
  const res = await fetch(`/api/drafts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('임시저장 삭제에 실패했습니다.');
}
