import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import {
  listSheets,
  ensureSettingsSheet,
  ensureCurrentSheets,
} from "@/lib/google-sheets";
import { buildYearGroups } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { NoNumberScroll } from "@/components/no-number-scroll";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
});

export const metadata: Metadata = {
  title: "mezumani",
  description: "ניהול תקציב אישי",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ensure settings sheet exists
  await ensureSettingsSheet();

  let sheets = await listSheets();

  // Auto-create current month and annual sheets if missing
  const created = await ensureCurrentSheets(sheets);
  if (created) {
    sheets = await listSheets();
  }

  const yearGroups = buildYearGroups(sheets);

  return (
    <html lang="he" dir="rtl">
      <body className={rubik.variable}>
        <NoNumberScroll />
        <div className="app-layout">
          <Sidebar yearGroups={yearGroups} />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
