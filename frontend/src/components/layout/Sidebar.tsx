'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home,
    Search,
    PlusSquare,
    Heart,
    User,
    Users,
    Shield,
    BarChart3,
    Settings,
    LogOut,
    Moon,
    Sun,
    FileWarning,
    ClipboardCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    roles?: string[];
}

const mainNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: <Home className="h-6 w-6" /> },
    { label: 'Explore', href: '/explore', icon: <Search className="h-6 w-6" /> },
    { label: 'Create', href: '/create', icon: <PlusSquare className="h-6 w-6" /> },
    { label: 'Notifications', href: '/notifications', icon: <Heart className="h-6 w-6" /> },
    { label: 'Communities', href: '/communities', icon: <Users className="h-6 w-6" /> },
    { label: 'Profile', href: '/profile', icon: <User className="h-6 w-6" /> },
];

const adminNavItems: NavItem[] = [
    { label: 'Moderation', href: '/moderation', icon: <Shield className="h-6 w-6" />, roles: ['community_moderator', 'senior_moderator', 'admin'] },
    { label: 'Reports', href: '/admin/reports', icon: <FileWarning className="h-6 w-6" />, roles: ['admin'] },
    { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="h-6 w-6" />, roles: ['admin', 'analyst'] },
    { label: 'Compliance', href: '/compliance', icon: <ClipboardCheck className="h-6 w-6" />, roles: ['compliance_officer', 'admin'] },
    { label: 'Admin', href: '/admin', icon: <Settings className="h-6 w-6" />, roles: ['admin'] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile, signOut, isLoading } = useAuth();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        setIsDark(shouldBeDark);
        document.documentElement.classList.toggle('dark', shouldBeDark);
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark', !isDark);
        localStorage.setItem('theme', newTheme);
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    const navLinkClass = (active: boolean) =>
        `flex items-center gap-4 px-3 py-3 rounded-lg transition-colors duration-200 group ` +
        (active
            ? `bg-primary/10 text-primary font-bold`
            : `text-muted-foreground hover:bg-muted hover:text-foreground font-semibold`);

    const userRole = profile?.role || 'user';

    // Filter admin nav items based on user role
    const visibleAdminItems = adminNavItems.filter(
        (item) => !item.roles || item.roles.includes(userRole)
    );

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    // Get user initials
    const getInitials = () => {
        if (profile?.display_name) {
            return profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (profile?.username) {
            return profile.username.slice(0, 2).toUpperCase();
        }
        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }
        return 'U';
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-full w-[72px] flex-col overflow-y-auto scrollbar-hide border-r border-border/50 bg-background/60 dark:bg-background/40 backdrop-blur-md px-3 py-6 transition-all duration-300 lg:w-[275px]">
                {/* Logo */}
                <div className="mb-8 px-3">
                    <Link href="/" className="flex items-center gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg">
                            <span className="text-xl font-extrabold">S</span>
                        </div>
                        <span className="hidden text-xl font-extrabold tracking-tight lg:block">Social</span>
                    </Link>
                </div>

                {/* Main Navigation */}
                <nav className="flex flex-col gap-1">
                    {mainNavItems.map((item) => (
                        <Link key={item.href} href={item.href} className={navLinkClass(isActive(item.href))}>
                            <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                            <span className="hidden lg:block">{item.label}</span>
                            {item.label === 'Notifications' && (
                                <span className="absolute left-[38px] top-4 h-2 w-2 rounded-full bg-red-500 lg:static lg:ml-auto"></span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Admin Section - Only show if user has relevant management roles */}
                {visibleAdminItems.length > 0 && (
                    <div className="mt-8 flex flex-col gap-1">
                        <div className="mb-2 hidden px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground lg:block">
                            Management
                        </div>
                        {visibleAdminItems.map((item) => (
                            <Link key={item.href} href={item.href} className={navLinkClass(isActive(item.href))}>
                                <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                                <span className="hidden lg:block">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="mt-auto flex flex-col gap-1 pt-8">
                    {/* User Profile Card */}
                    {user && (
                        <div className="mb-4 flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden lg:block overflow-hidden">
                                <p className="text-sm font-bold truncate">{profile?.display_name || profile?.username || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate">@{profile?.username || 'user'}</p>
                            </div>
                        </div>
                    )}

                    <button onClick={toggleTheme} className={navLinkClass(false) + " w-full content-start justify-start"}>
                        <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </span>
                        <span className="hidden lg:block">
                            {isDark ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className={navLinkClass(false) + " w-full content-start justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10"}
                    >
                        <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200"><LogOut className="h-6 w-6" /></span>
                        <span className="hidden lg:block">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 px-2 backdrop-blur-lg sm:hidden">
                {mainNavItems.slice(0, 5).map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                            {item.icon}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
