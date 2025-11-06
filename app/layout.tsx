import type { Metadata } from "next";
// @ts-expect-error - CSS module types may be missing in the project; to properly fix this add a declaration file (e.g. global.d.ts) with: declare module '*.css';
import "./globals.css";
import NavBar from "./NavBar";


export const metadata: Metadata = {
  title: "Aina Bucks",
  description: "A platform for tracking and rewarding volunteer hours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
