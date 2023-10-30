import Footer from "@/components/Footer/Footer";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Korbo: Online code practice app",
  description: "This web app helps you practice coding online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Code Korbo: Online code practice app</title>
        <meta
          name="description"
          content="This web app helps you practice coding online"
        />
        <link rel="icon" href="/favicon.png" as="image" />
      </head>
      <body>
        <div className="flex h-screen bg-slate-50 flex-col text-label-1 justify-between">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
