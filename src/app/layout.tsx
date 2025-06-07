import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen">
          <div className="max-w-screen-sm mx-auto w-full mt-14">{children}</div>
        </div>
      </body>
    </html>
  );
}
