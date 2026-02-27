import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const trendingTopics = [
    { tag: 'TechInnovation', posts: '12.5K' },
    { tag: 'DesignSystem', posts: '8.2K' },
    { tag: 'StartupLife', posts: '6.7K' },
    { tag: 'AIArt', posts: '5.1K' },
    { tag: 'WebDev2025', posts: '4.3K' },
];

const suggestedUsers = [
    { username: 'sarah_designs', initials: 'S', isVerified: true, context: '12 mutual followers' },
    { username: 'dev_marcus', initials: 'M', isVerified: false, context: '5 mutual followers' },
    { username: 'art_by_luna', initials: 'L', isVerified: true, context: '8 mutual followers' },
    { username: 'techie_alex', initials: 'A', isVerified: false, context: '3 mutual followers' },
    { username: 'photo_nat', initials: 'N', isVerified: true, context: '15 mutual followers' },
];

export default function RightSidebar() {
    return (
        <aside className="fixed right-0 top-0 bottom-0 z-10 hidden h-full w-[350px] flex-col overflow-y-auto scrollbar-hide border-l border-border/50 bg-background/60 dark:bg-background/40 backdrop-blur-md px-6 py-6 xl:flex">
            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-full border bg-muted/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Trending Section */}
            <div className="mb-8 rounded-xl border border-primary/10 bg-background/40 dark:bg-background/20 backdrop-blur-sm text-card-foreground">
                <div className="p-4 pb-2">
                    <h3 className="font-bold">Trending</h3>
                </div>
                <div className="flex flex-col">
                    {trendingTopics.map((topic, i) => (
                        <div key={i} className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50">
                            <div>
                                <p className="font-semibold text-sm">#{topic.tag}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested Users Section */}
            <div className="mb-8 rounded-xl border border-primary/10 bg-background/40 dark:bg-background/20 backdrop-blur-sm text-card-foreground">
                <div className="flex items-center justify-between p-4 pb-2">
                    <h3 className="font-bold">Suggested for you</h3>
                    <Link href="/explore" className="text-xs font-semibold text-primary hover:underline">
                        See All
                    </Link>
                </div>
                <div className="flex flex-col">
                    {suggestedUsers.map((user, i) => (
                        <div key={i} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-primary/10 text-primary">{user.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="flex items-center gap-1 text-sm font-bold">
                                        {user.username}
                                        {user.isVerified && (
                                            <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-primary/20 text-[8px] text-primary">✓</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{user.context}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10">Follow</Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Links */}
            <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <Link href="#" className="hover:underline">About</Link>
                <Link href="#" className="hover:underline">Help</Link>
                <Link href="#" className="hover:underline">Privacy</Link>
                <Link href="#" className="hover:underline">Terms</Link>
                <p className="w-full mt-2">© 2025 Social Publishing Platform</p>
            </div>
        </aside>
    );
}
