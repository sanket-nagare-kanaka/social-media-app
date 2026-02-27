import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Social Publishing Platform",
  description: "A modern social publishing and moderation platform for communities, creators, and enterprises.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <TooltipProvider>
          <AnimatedBackground />
          <div className="flex min-h-screen relative z-0">
            <Sidebar />
            <main className="flex-1 ml-[72px] lg:ml-[275px] relative">
              {/* Glassmorphic container for main content to stand out against animated background */}
              <div className="mx-auto w-full max-w-[640px] px-4 py-8 pb-32">
                <div className="backdrop-blur-md bg-background/60 dark:bg-background/40 border border-primary/10 rounded-2xl shadow-xl p-4 sm:p-6 min-h-[80vh]">
                  {children}
                </div>
              </div>
            </main>

          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
