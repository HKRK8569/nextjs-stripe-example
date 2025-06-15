import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="min-h-screen ">
      <body className="max-w-screen-sm mx-auto w-full mt-14">{children}</body>
    </html>
  );
}
