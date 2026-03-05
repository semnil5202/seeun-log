# Tiptap 이미지 삽입 기능 가이드

> fanplus-front 프로젝트의 Tiptap 에디터 이미지 삽입 기능을 다른 프로젝트에서 재현하기 위한 종합 가이드 문서입니다.

---

## 1. 사용 라이브러리

| 패키지                    | 버전     | 용도                                                         |
| ------------------------- | -------- | ------------------------------------------------------------ |
| `@tiptap/react`           | ^2.11.7  | Tiptap React 바인딩                                          |
| `@tiptap/starter-kit`     | ^2.11.7  | 기본 에디터 기능 번들 (bold, italic, history, dropcursor 등) |
| `@tiptap/extension-image` | ^2.11.7  | 이미지 노드 확장 (커스텀 확장의 베이스)                      |
| `react-image-crop`        | ^11.0.10 | 이미지 크롭 UI (ReactCrop 컴포넌트)                          |
| `axios`                   | -        | S3 업로드 API 호출                                           |

---

## 2. 전체 아키텍처 개요

```
[사용자 클릭: 이미지 업로드 버튼]
        │
        ▼
[ImageUploadModal] ── 파일 선택 (input[type=file])
        │
        ├─ GIF → 크롭 스킵 → uploadImage() → S3 업로드
        │
        └─ 그 외 → [ImageCropModal] ── ReactCrop으로 크롭
                        │
                        ▼
                   Canvas API로 크롭 영역 추출 → File 생성
                        │
                        ▼
                   uploadImage() → S3 3단계 업로드
                        │
                        ▼
                   editor.chain().focus().setImage({ src: accessURL }).run()
                        │
                        ▼
                   [CustomResizableImage] 노드로 에디터에 렌더링
                   (4개 코너 핸들로 리사이즈 가능)
```

---

## 3. 핵심 파일 구조

```
src/
├── api/
│   └── imageUpload.ts                          # S3 이미지 업로드 API (3단계)
├── features/fanficEditor/tiptap/
│   ├── configs/
│   │   ├── image.ts                            # CustomResizableImage 확장
│   │   ├── starterKit.ts                       # StarterKit 설정 (dropcursor 포함)
│   │   └── index.ts                            # 모든 config export
│   ├── components/toolbars/
│   │   └── UploadImage.tsx                     # 툴바 이미지 업로드 버튼
│   ├── hooks/
│   │   └── useInitTiptapEditor.ts              # 에디터 초기화 (확장 등록)
│   └── icons/
│       └── UploadImageIcon.tsx                 # 이미지 업로드 아이콘
└── module/imageSelectModal/
    ├── hooks/
    │   └── useUploadImageModalOpen.tsx          # 업로드 모달 오픈 훅
    ├── components/modals/
    │   ├── ImageUploadModal.tsx                 # 파일 선택 모달
    │   └── ImageCropModal.tsx                   # 이미지 크롭 모달
    └── type/
        └── dto.ts                              # ImageUploadDto 타입 정의
```

---

## 4. S3 이미지 업로드 API (3단계 Presigned URL 방식)

**파일**: `src/api/imageUpload.ts`

### 전체 흐름

```typescript
export const uploadImage = async (image: File) => {
  // Step 1: 서버에 업로드 준비 요청 → presigned URL 획득
  const { attachment, uploadUrl } = await prepareImageUpload(image.name);

  // Step 2: presigned URL로 S3에 직접 업로드
  await uploadImageOnS3(uploadUrl, image);

  // Step 3: 서버에 업로드 완료 알림 → accessURL 획득
  const uploadedImage = await completeImageUpload(attachment.id);

  return { uploadedImage, attachmentId: attachment.id };
};
```

### 각 단계 상세

```typescript
// Step 1: 업로드 준비
const prepareImageUpload = async (name: string) => {
  const body = { name, contentType: 'image/png' };
  const response = await axios.post<{ attachment: AttachmentDTO; uploadUrl: string }>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/s3/prepare-upload`,
    body,
  );
  return response.data;
};

// Step 2: S3 직접 업로드
const uploadImageOnS3 = async (uploadUrl: string, image: File) => {
  await axios.put(uploadUrl, image, { headers: { 'Content-Type': image.type } });
};

// Step 3: 업로드 완료 처리
const completeImageUpload = async (attachmentId: number) => {
  const response = await axios.post<CompleteImageUploadDTO>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/s3/complete-upload/${attachmentId}`,
  );
  return response.data;
};
```

### 응답 타입

```typescript
type CompleteImageUploadDTO = {
  id: number;
  name: string;
  key: string;
  url: string;
  accessURL: string; // ← 에디터 이미지 src에 사용되는 최종 URL
  bucket: string;
  contentType: string;
  createAt: string;
  status: string;
  updatedAt: string;
};
```

---

## 5. CustomResizableImage 확장 (핵심)

**파일**: `src/features/fanficEditor/tiptap/configs/image.ts`

`@tiptap/extension-image`를 확장하여 리사이즈 기능을 추가한 커스텀 노드입니다.

### 전체 코드

```typescript
import Image from '@tiptap/extension-image';

export const CustomResizableImage = Image.extend({
  // 1. style 속성 추가 (width % 기반 리사이즈를 위해)
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: 'width: 100%; height: auto; vertical-align: bottom;',
        parseHTML: (element) => {
          return element.getAttribute('style') ?? 'width: 100%; height: auto;';
        },
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
    };
  },

  // 2. 커스텀 NodeView로 리사이즈 핸들 구현
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const {
        view,
        options: { editable },
      } = editor;
      const { style } = node.attrs;

      // DOM 구조: div.container > img + div.dot x4
      const $container = document.createElement('div');
      const $img = document.createElement('img');

      // 이미지 속성 적용 (src, alt, title 등)
      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        $img.setAttribute(key, value);
      });

      $img.setAttribute('style', 'width: 100%; height: auto; display: block;');
      $container.setAttribute(
        'style',
        `${style}; display: inline-block; position: relative; cursor: pointer;`,
      );
      $container.appendChild($img);

      // 읽기 전용이면 리사이즈 핸들 없이 반환
      if (!editable) return { dom: $container };

      // ... 리사이즈 로직 (아래 섹션 참고)

      return { dom: $container };
    };
  },
});
```

### 리사이즈 동작 원리

```
[컨테이너 클릭] → 점선 border + 4개 코너 dot 표시
       │
[dot mousedown] → startX, startWidth 기록
       │
[mousemove] → deltaX 계산 → 에디터 너비 대비 % 계산 → 컨테이너 width 업데이트
       │
[mouseup] → ProseMirror 트랜잭션으로 노드 attrs에 style 반영
       │
[외부 클릭] → border & dot 숨김
```

### 리사이즈 핵심 로직

```typescript
// 에디터 너비 기준 퍼센트로 리사이즈
const handleResize = (deltaX: number) => {
  const editorWidth = document.querySelector('.ProseMirror')?.clientWidth ?? 400;
  const newWidth = Math.min(startWidth + deltaX, editorWidth); // 에디터 너비 초과 방지
  const percent = ((newWidth / editorWidth) * 100).toFixed(1);
  $container.style.width = `${percent}%`;
  $img.style.width = '100%';
};

// ProseMirror 노드 속성 업데이트 (컨테이너 전용 style 제거 후 저장)
const updateNodeAttrs = () => {
  if (typeof getPos === 'function') {
    const newAttrs = {
      ...node.attrs,
      style: $container.style.cssText
        .replace(/\b(border|cursor|display|position|box-sizing)\s*:[^;]+;/g, '')
        .trim(),
    };
    view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs));
  }
};
```

### 모바일/데스크톱 대응

```typescript
const isMobile = document.documentElement.clientWidth < 768;
const dotPosition = isMobile ? '-8px' : '-4px';
// dot 크기: 모바일 16px, 데스크톱 9px
```

### 에디터 등록

```typescript
// useInitTiptapEditor.ts에서 inline: true로 설정
CustomResizableImage.configure({ inline: true });
```

> `inline: true`로 설정하면 이미지가 텍스트 사이에 인라인으로 삽입됩니다.

---

## 6. 이미지 크롭 기능

**파일**: `src/module/imageSelectModal/components/modals/ImageCropModal.tsx`

### 크롭 프로세스

```typescript
// 1. ReactCrop 컴포넌트로 시각적 크롭 영역 선택
<ReactCrop crop={crop} aspect={cropRatio} ruleOfThirds keepSelection onChange={setCrop}>
  <img ref={imageRef} src={imageUrl} onLoad={handleImageLoad} />
</ReactCrop>

// 2. 초기 크롭 영역 계산 (이미지 로드 시)
const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
  const { width, height } = e.currentTarget;
  if (!cropRatio) return setCrop({ unit: 'px', width, height, x: 0, y: 0 });

  // 비율 제한이 있으면 자동 계산
  let cropWidth = width;
  let cropHeight = width / cropRatio;
  if (cropHeight > height) {
    cropHeight = height;
    cropWidth = height * cropRatio;
  }
  setCrop({ unit: 'px', width: cropWidth, height: cropHeight,
            x: (width - cropWidth) / 2, y: (height - cropHeight) / 2 });
};

// 3. Canvas API로 크롭 영역 추출
const scaleX = imageElement.naturalWidth / imageElement.width;
const scaleY = imageElement.naturalHeight / imageElement.height;
canvas.width = crop.width * scaleX;
canvas.height = crop.height * scaleY;
ctx.drawImage(imageElement,
  crop.x * scaleX, crop.y * scaleY,       // 소스 좌표 (원본 비율 적용)
  crop.width * scaleX, crop.height * scaleY, // 소스 크기
  0, 0,                                      // 대상 좌표
  crop.width * scaleX, crop.height * scaleY  // 대상 크기
);

// 4. Blob → File 변환 → S3 업로드
canvas.toBlob(async (blob) => {
  const croppedFile = new File([blob], image?.name || '', { type: image.type });
  const { uploadedImage } = await uploadImage(croppedFile);
  await onSubmit(uploadedImage, handleCloseModals);
}, image.type, 1); // quality: 1 (최대 품질)
```

### GIF 예외 처리

```typescript
// ImageUploadModal.tsx에서 GIF는 크롭 모달을 건너뜀
if (imageFile.type !== 'image/gif') {
  return imageCropModal.open(/* ... */);
}
// GIF는 크롭 없이 바로 업로드
const { uploadedImage } = await uploadImage(imageFile);
onSubmit(uploadedImage, onExit);
```

---

## 7. 툴바 → 에디터 삽입 연결

**파일**: `src/features/fanficEditor/tiptap/components/toolbars/UploadImage.tsx`

```typescript
export const UploadImage = ({ editor, handleTooltip }: EditorProps) => {
  const handleUploadImageModalOpen = useUploadImageModalOpen({
    accept: 'image/jpeg, image/png, image/jpg, image/gif',
    onSubmit: (image, closeModals) => {
      // S3 업로드 완료 후 에디터에 이미지 삽입
      editor.chain().focus().setImage({ src: image.accessURL }).run();
      closeModals();
    },
  });

  return (
    <ToggleButton onClick={handleUploadImageModalOpen}>
      <UploadImageIcon />
    </ToggleButton>
  );
};
```

**모달 오픈 훅** (`useUploadImageModalOpen.tsx`):

```typescript
export const useUploadImageModalOpen = ({ cropRatio, accept, onSubmit }: Props) => {
  const imageUploadModal = useModal();

  return () => {
    imageUploadModal.open(({ isOpen, close, exit }) => (
      <ImageUploadModal
        isOpen={isOpen}
        cropRatio={cropRatio}   // 선택적 비율 제한
        accept={accept}          // 허용 파일 타입
        onClose={close}
        onExit={exit}
        onSubmit={onSubmit}      // 업로드 완료 콜백
      />
    ));
  };
};
```

---

## 8. 로컬 드래그 앤 드롭 / 붙여넣기 이미지 처리

### 현재 상태: 별도 커스텀 핸들러 없음

이 프로젝트에서는 로컬 파일을 에디터에 드래그 앤 드롭하거나 클립보드에서 이미지를 붙여넣는 기능에 대한 **커스텀 핸들러를 구현하지 않았습니다**.

### Tiptap 기본 동작

- `@tiptap/extension-image`는 기본적으로 `handleDrop`과 `handlePaste` 핸들러를 제공하지 않습니다.
- `StarterKit`의 `dropcursor` 설정(`width: 2`)은 드래그 시 **커서 위치 시각 표시**만 담당하며, 실제 이미지 드롭 처리와는 무관합니다.

### 실제 드래그 앤 드롭 시 동작

로컬 파일을 에디터에 드래그 앤 드롭하면:

- Tiptap/ProseMirror의 기본 동작에 의존합니다.
- `@tiptap/extension-image`의 기본 설정에서는 **로컬 파일 드롭을 처리하지 않으므로**, 드롭된 파일은 무시되거나 브라우저 기본 동작(새 탭에서 파일 열기 등)이 발생할 수 있습니다.

### 드래그 앤 드롭 방지를 위한 별도 기술

이 프로젝트에서는 드래그 앤 드롭을 **명시적으로 방지하는 코드(e.preventDefault() 등)를 작성하지 않았습니다**. 다만 아래 이유로 사실상 드래그 앤 드롭 이미지 삽입이 동작하지 않습니다:

1. **커스텀 `handleDrop` 미구현**: ProseMirror의 `handleDrop` 플러그인을 등록하지 않아 파일 드롭 이벤트가 에디터 레벨에서 처리되지 않음
2. **Image 확장의 기본 제한**: `@tiptap/extension-image`는 URL 기반 이미지 삽입(`setImage({ src })`)만 지원하며, File 객체 직접 처리를 지원하지 않음
3. **S3 업로드 필수**: 이 프로젝트의 이미지는 반드시 S3 업로드를 거쳐 `accessURL`을 받아야 하므로, 로컬 파일 직접 삽입은 아키텍처적으로 불가

### 만약 드래그 앤 드롭을 명시적으로 방지하고 싶다면

```typescript
// 방법 1: editorProps로 handleDrop 차단
const editor = useEditor({
  editorProps: {
    handleDrop: (view, event, slice, moved) => {
      if (!moved && event.dataTransfer?.files.length) {
        event.preventDefault();
        return true; // 이벤트 소비 (에디터 기본 동작 방지)
      }
      return false;
    },
    handlePaste: (view, event, slice) => {
      if (event.clipboardData?.files.length) {
        event.preventDefault();
        return true;
      }
      return false;
    },
  },
});

// 방법 2: ProseMirror 플러그인으로 차단
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Extension } from '@tiptap/core';

const PreventImageDrop = Extension.create({
  name: 'preventImageDrop',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('preventImageDrop'),
        props: {
          handleDrop: (view, event) => {
            if (event.dataTransfer?.files.length) {
              event.preventDefault();
              return true;
            }
            return false;
          },
          handlePaste: (view, event) => {
            if (event.clipboardData?.files.length) {
              event.preventDefault();
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
```

---

## 9. 에디터 초기화 전체 코드

**파일**: `src/features/fanficEditor/tiptap/hooks/useInitTiptapEditor.ts`

```typescript
import { useEditor } from '@tiptap/react';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import {
  CharacterLimit,
  CustomBulletList,
  CustomHeading,
  CustomLink,
  CustomParagraph,
  CustomResizableImage,
  CustomStarterKit,
  CustomTextAlign,
  CustomTextHighlight,
  CustomYoutube,
  FontSize,
  TextColor,
} from '../configs';

export const useInitTiptapEditor = () => {
  const [charCount, setCharCount] = useState<number>(0);
  const [html, setHtml] = useState<string>('');

  const editor = useEditor({
    extensions: [
      CustomStarterKit, // bold, italic, strike, history, dropcursor 등
      CustomHeading, // H2~H6
      CustomBulletList,
      CustomParagraph, // line-height 지원
      CustomTextAlign, // 텍스트 정렬
      CustomLink, // 링크 (https 강제)
      CustomYoutube, // YouTube 임베드
      CustomTextHighlight, // 다색 하이라이트
      CharacterLimit, // 100,000자 제한
      FontFamily,
      TextStyle,
      FontSize,
      TextColor,
      CustomResizableImage.configure({ inline: true }), // ← 이미지 리사이즈
      Placeholder.configure({ placeholder: '내용' }),
    ],
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const charCount = getCharacterCount(editor);
      const html = addParagraphBreak(editor.getHTML());
      setHtml(html);
      setCharCount(charCount);
    },
  });

  return { html, charCount, editor };
};
```

---

## 10. 다른 프로젝트 적용 시 체크리스트

### 필수 설치 패키지

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image react-image-crop
```

### 구현 순서

1. **S3 업로드 API 구축** (prepare → upload → complete 3단계)
2. **CustomResizableImage 확장** 작성 (image.ts)
3. **이미지 업로드 모달** 구현 (파일 선택 → 크롭 → 업로드)
4. **툴바 버튼** 연결 (모달 오픈 → 업로드 완료 → `setImage()`)
5. **에디터 초기화** 시 `CustomResizableImage.configure({ inline: true })` 등록

### 주의사항

- `vertical-align: bottom` 스타일은 textHighlight 플러그인과의 충돌 해결 용도
- 리사이즈 시 에디터 너비 초과 방지 로직 필수 (`Math.min`)
- GIF는 크롭 불가이므로 별도 분기 처리 필요
- 크롭 시 `naturalWidth/naturalHeight`와 렌더 크기의 비율(scale)을 반드시 계산해야 원본 해상도 유지
- `updateNodeAttrs`에서 컨테이너 전용 CSS 속성(border, cursor, display, position, box-sizing)은 제거 후 저장
