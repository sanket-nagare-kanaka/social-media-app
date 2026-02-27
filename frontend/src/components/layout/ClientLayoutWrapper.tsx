'use client';

import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import Sidebar from "@/components/layout/Sidebar";

export default function ClientLayoutWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    // Define which paths should use the full-width layout
    const isManagementScreen =
        pathname?.startsWith('/moderation') ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/compliance');

    return (
        <TooltipProvider>
            <AnimatedBackground />
            <div className="flex min-h-screen relative z-0">
                <Sidebar />
                <main className="flex-1 ml-[72px] lg:ml-[275px] relative transition-all duration-300">
                    {/* Dynamic container width based on route */}
                    <div className={`mx-auto w-full px-4 py-8 pb-32 transition-all duration-300 ${isManagementScreen ? 'max-w-full' : 'max-w-[640px]'}`}>
                        <div className={`backdrop-blur-md bg-background/60 dark:bg-background/40 border border-primary/10 rounded-2xl shadow-xl p-4 sm:p-6 ${isManagementScreen ? 'min-h-[90vh]' : 'min-h-[80vh]'}`}>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
}
