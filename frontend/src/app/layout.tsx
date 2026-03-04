'use client';

import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider } from "@/lib/auth-context";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Auth pages get a clean layout without sidebar
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup') || pathname?.startsWith('/help');

  // Define which paths should use the full-width layout
  const isManagementScreen =
    pathname?.startsWith('/moderation') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/compliance');

  if (isAuthPage) {
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
        <body className="antialiased min-h-screen bg-background text-foreground font-sans" suppressHydrationWarning>
          <AuthProvider>
            <AnimatedBackground />
            {children}
          </AuthProvider>
        </body>
      </html>
    );
  }

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
      <body className="antialiased min-h-screen bg-background text-foreground font-sans" suppressHydrationWarning>
        <AuthProvider>
          <TooltipProvider>
            <AnimatedBackground />
            <div className="flex min-h-screen relative z-0">
              <Sidebar />
              <main className="flex-1 ml-[72px] lg:ml-[275px] relative">
                {/* Dynamic container width based on route */}
                <div className={`mx-auto w-full px-4 py-8 pb-32 transition-all duration-300 ${isManagementScreen ? 'max-w-full' : 'max-w-[640px]'}`}>
                  <div className={`backdrop-blur-md bg-background/60 dark:bg-background/40 border border-primary/10 rounded-2xl shadow-xl p-4 sm:p-6 ${isManagementScreen ? 'min-h-[90vh]' : 'min-h-[80vh]'}`}>
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
