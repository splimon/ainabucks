// @ts-expect-error - CSS module types may be missing for this side-effect import; to properly fix this add a declaration file (e.g. global.d.ts) with: declare module '@radix-ui/themes/styles.css';
import "@radix-ui/themes/styles.css";
// @ts-expect-error - CSS module types may be missing in the project; to properly fix this add a declaration file (e.g. global.d.ts) with: declare module '*.css';
import "./globals.css";
import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import NavBar from "./NavBar";

export const metadata: Metadata = {
  title: "Aina Bucks",
  description: "Volunteer. Earn. Redeem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme accentColor="grass">
          <NavBar />
          <main className="p-5">{children}</main>
        </Theme>
      </body>
    </html>
  );
}
