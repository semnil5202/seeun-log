'use client';

import { type ChangeEvent, useRef } from 'react';

import { NodeSelection } from '@tiptap/pm/state';

import { cn } from '@/lib/utils';
import { ImageIcon } from '../icons';
import { toWebP } from '../../lib/image';

import type { EditorProps } from './types';

export function UploadImage({ editor }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const webpBlob = await toWebP(file);
      urls.push(URL.createObjectURL(webpBlob));
    }

    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;

    // Case 0: carousel node itself is selected (NodeSelection) → append images
    if (selection instanceof NodeSelection && selection.node.type.name === 'imageCarousel') {
      for (const url of urls) {
        editor.commands.addImageToCarousel($from.pos, url);
      }
      e.target.value = '';
      return;
    }

    // Case 1: cursor after an imageCarousel block → append all images
    let carouselPos: number | null = null;

    if ($from.depth >= 1) {
      const posBefore = $from.before();
      if (posBefore > 0) {
        const resolved = state.doc.resolve(posBefore);
        const node = resolved.nodeBefore;
        if (node?.type.name === 'imageCarousel') {
          carouselPos = posBefore - node.nodeSize;
        }
      }
    } else if ($from.pos > 0) {
      const node = $from.nodeBefore;
      if (node?.type.name === 'imageCarousel') {
        carouselPos = $from.pos - node.nodeSize;
      }
    }

    if (carouselPos !== null) {
      for (const url of urls) {
        editor.commands.addImageToCarousel(carouselPos, url);
      }
      e.target.value = '';
      return;
    }

    // Case 2: multiple files selected → create carousel directly
    if (urls.length > 1) {
      const images = urls.map((src) => ({ src, width: '90%', height: 'auto' }));

      // If cursor is after an inline image, include it in the carousel
      const nodeBefore = $from.nodeBefore;
      if (nodeBefore?.type.name === 'image') {
        const existingSrc = nodeBefore.attrs.src as string;
        const imageEndPos = $from.pos;
        const imageStartPos = imageEndPos - nodeBefore.nodeSize;

        editor
          .chain()
          .focus()
          .command(({ tr, dispatch }) => {
            if (!dispatch) return true;

            tr.delete(imageStartPos, imageEndPos);

            const $afterDelete = tr.doc.resolve(imageStartPos);
            const parentNode = $afterDelete.parent;
            const parentStart = $afterDelete.start($afterDelete.depth);
            const parentEnd = $afterDelete.end($afterDelete.depth);

            const carouselNode = editor.schema.nodes.imageCarousel.create({
              images: [{ src: existingSrc, width: '90%', height: 'auto' }, ...images],
            });

            if (parentNode.content.size === 0) {
              tr.replaceWith(parentStart - 1, parentEnd + 1, carouselNode);
            } else {
              tr.insert(parentEnd + 1, carouselNode);
            }

            return true;
          })
          .run();
      } else {
        editor.commands.setImageCarousel({ images });
      }

      e.target.value = '';
      return;
    }

    // Case 3: single file, cursor right after an inline image → merge into carousel
    const nodeBefore = $from.nodeBefore;
    if (nodeBefore?.type.name === 'image') {
      const existingSrc = nodeBefore.attrs.src as string;
      const imageEndPos = $from.pos;
      const imageStartPos = imageEndPos - nodeBefore.nodeSize;

      editor
        .chain()
        .focus()
        .command(({ tr, dispatch }) => {
          if (!dispatch) return true;

          tr.delete(imageStartPos, imageEndPos);

          const $afterDelete = tr.doc.resolve(imageStartPos);
          const parentNode = $afterDelete.parent;
          const parentStart = $afterDelete.start($afterDelete.depth);
          const parentEnd = $afterDelete.end($afterDelete.depth);

          const carouselNode = editor.schema.nodes.imageCarousel.create({
            images: [
              { src: existingSrc, width: '90%', height: 'auto' },
              { src: urls[0], width: '90%', height: 'auto' },
            ],
          });

          if (parentNode.content.size === 0) {
            tr.replaceWith(parentStart - 1, parentEnd + 1, carouselNode);
          } else {
            tr.insert(parentEnd + 1, carouselNode);
          }

          return true;
        })
        .run();

      e.target.value = '';
      return;
    }

    // Case 4: single file, no special context → insert as single image
    editor.chain().focus().setImage({ src: urls[0] }).run();
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
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
