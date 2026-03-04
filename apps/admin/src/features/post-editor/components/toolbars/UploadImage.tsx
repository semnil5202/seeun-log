'use client';

import { type ChangeEvent, useRef } from 'react';

import { cn } from '@/lib/utils';
import { ImageIcon } from '../icons';

import type { EditorProps } from './types';

export function UploadImage({ editor }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: url }).run();

    e.target.value = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'flex h-8 w-8 cursor-pointer items-center justify-center rounded text-foreground hover:bg-accent',
        )}
      >
        <ImageIcon />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
