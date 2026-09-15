import "~/app/globals.css";

import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Sidebar } from "~/components/sidebar";

export const metadata: Metadata = {
  title: "ChatBot App ",
  description: "Onboarding assignment: Next.js + tRPC + MySQL + OpenAI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <TRPCReactProvider>
          <div className="flex min-h-screen">
            <Sidebar />

            <div className="min-w-0 flex-1">
              {children}
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
