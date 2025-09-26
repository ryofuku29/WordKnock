import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";

export default function RootLayout({
  children, // レイアウトの中身として差し込まれる各ページの内容。/words/page.tsx
}: {
  // TypeScript で props の型を宣言。「children は React 要素（テキスト・タグ・コンポーネント等）だよ」という意味。
  children: React.ReactNode;
}) {
  return (
    // jaの方がいいのかな？
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
