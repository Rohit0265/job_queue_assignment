import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs API",
  description: "Simple job queue backend",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
