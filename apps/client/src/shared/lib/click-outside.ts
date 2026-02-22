/**
 * 요소 외부 클릭 시 콜백을 실행한다.
 * @param el 감시할 요소
 * @param onClose 외부 클릭 시 실행할 콜백
 * @returns cleanup 함수
 */
export function onClickOutside(
  el: HTMLElement,
  onClose: () => void,
): () => void {
  const handler = (e: MouseEvent) => {
    if (!el.contains(e.target as Node)) {
      onClose();
    }
  };

  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}
