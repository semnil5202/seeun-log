import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'seeun-log admin',
  description: 'seeun-log 관리자 페이지',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-pretendard antialiased">{children}</body>
    </html>
  );
}
