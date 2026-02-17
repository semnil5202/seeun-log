import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "seeun-log admin",
  description: "seeun-log 관리자 페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
