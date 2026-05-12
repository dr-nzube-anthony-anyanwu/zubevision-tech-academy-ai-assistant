import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZTAAA - ZubeVision Tech Academy AI Assistant",
  description: "AI assistant for ZubeVision Tech Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
