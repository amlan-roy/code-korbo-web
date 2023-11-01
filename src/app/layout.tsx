"use client";

import "./globals.css";
import { RecoilRoot } from "recoil";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer/Footer";
import Topbar from "@/components/Topbar/Topbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPathName = usePathname();
  const problemsPagePath = "/problem/";
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
      <RecoilRoot>
        <body>
          <ToastContainer />
          <div className="flex h-screen bg-slate-50 flex-col text-label-1 justify-between">
            <Topbar
              problemPage={currentPathName.startsWith(problemsPagePath)}
            />
            {children}
            <Footer />
          </div>
        </body>
      </RecoilRoot>
    </html>
  );
}
