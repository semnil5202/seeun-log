import Image from '@tiptap/extension-image';

export const CustomResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null, renderHTML: () => ({}) },
      height: { default: null, renderHTML: () => ({}) },
      style: {
        default: 'width: 100%; height: auto;',
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('style') ?? 'width: 100%; height: auto;';
        },
        renderHTML: (attributes: Record<string, string>) => {
          const style = attributes.style || '';
          const hasHeight = /height\s*:/i.test(style);
          return { style: hasHeight ? style : `${style}; height: auto;` };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const {
        view,
        options: { editable },
      } = editor;
      const { style } = node.attrs;

      const $container = document.createElement('div');
      const $img = document.createElement('img');

      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        $img.setAttribute(key, value as string);
      });

      $img.setAttribute('style', 'width: 100%; height: auto; display: block;');
      $container.setAttribute(
        'style',
        `${style}; display: inline-block; position: relative; cursor: pointer;`,
      );
      $container.appendChild($img);

      if (!editable) return { dom: $container };

      const dotPositions = [
        { top: '-4px', left: '-4px', cursor: 'nw-resize' },
        { top: '-4px', right: '-4px', cursor: 'ne-resize' },
        { bottom: '-4px', left: '-4px', cursor: 'sw-resize' },
        { bottom: '-4px', right: '-4px', cursor: 'se-resize' },
      ];

      const dots: HTMLElement[] = [];

      dotPositions.forEach((pos) => {
        const dot = document.createElement('div');
        dot.setAttribute(
          'style',
          [
            'position: absolute',
            'width: 9px',
            'height: 9px',
            'background: #4a90d9',
            'border: 1px solid white',
            'border-radius: 50%',
            'display: none',
            `cursor: ${pos.cursor}`,
            pos.top !== undefined ? `top: ${pos.top}` : '',
            pos.bottom !== undefined ? `bottom: ${pos.bottom}` : '',
            pos.left !== undefined ? `left: ${pos.left}` : '',
            pos.right !== undefined ? `right: ${pos.right}` : '',
          ]
            .filter(Boolean)
            .join('; '),
        );
        $container.appendChild(dot);
        dots.push(dot);
      });

      let isSelected = false;

      const showHandles = () => {
        isSelected = true;
        $container.style.border = '1px dashed #4a90d9';
        $container.style.boxSizing = 'border-box';
        dots.forEach((dot) => {
          dot.style.display = 'block';
        });
      };

      const hideHandles = () => {
        isSelected = false;
        $container.style.border = 'none';
        dots.forEach((dot) => {
          dot.style.display = 'none';
        });
      };

      $container.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isSelected) showHandles();
      });

      const handleOutsideClick = (e: MouseEvent) => {
        if (!$container.contains(e.target as Node)) {
          hideHandles();
        }
      };

      document.addEventListener('click', handleOutsideClick);

      const updateNodeAttrs = () => {
        if (typeof getPos === 'function') {
          const pos = getPos();
          if (pos === undefined) return;
          let cleanStyle = $container.style.cssText
            .replace(/\b(border|cursor|display|position|box-sizing)\s*:[^;]+;/g, '')
            .trim();
          if (!/height\s*:/i.test(cleanStyle)) {
            cleanStyle = cleanStyle.replace(/;?\s*$/, '; height: auto;');
          }
          const newAttrs = { ...node.attrs, style: cleanStyle };
          view.dispatch(view.state.tr.setNodeMarkup(pos, null, newAttrs));
        }
      };

      dots.forEach((dot, index) => {
        let startX = 0;
        let startWidth = 0;
        const isLeft = index === 0 || index === 2;

        const onMouseMove = (e: MouseEvent) => {
          const editorWidth = document.querySelector('.ProseMirror')?.clientWidth ?? 400;
          const deltaX = isLeft ? startX - e.clientX : e.clientX - startX;
          const newWidth = Math.min(Math.max(startWidth + deltaX, 50), editorWidth);
          const percent = ((newWidth / editorWidth) * 100).toFixed(1);
          $container.style.width = `${percent}%`;
          $img.style.width = '100%';
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          updateNodeAttrs();
        };

        dot.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          startX = e.clientX;
          startWidth = $container.offsetWidth;
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      });

      return {
        dom: $container,
        destroy() {
          document.removeEventListener('click', handleOutsideClick);
        },
      };
    };
  },
}).configure({
  inline: true,
});
