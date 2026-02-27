'use client';

import { useState } from 'react';
import { Search, TrendingUp, Hash, Users, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const trendingHashtags = [
    { tag: 'TechInnovation', posts: '12.5K', trend: '+24%' },
    { tag: 'DesignSystem', posts: '8.2K', trend: '+18%' },
    { tag: 'StartupLife', posts: '6.7K', trend: '+12%' },
    { tag: 'AIArt', posts: '5.1K', trend: '+45%' },
    { tag: 'WebDev2025', posts: '4.3K', trend: '+9%' },
    { tag: 'RemoteWork', posts: '3.9K', trend: '+7%' },
];

const suggestedUsers = [
    { id: '1', username: 'sarah_designs', displayName: 'Sarah Chen', bio: 'Design systems & UI components', followers: '12.5K', isVerified: true, initials: 'SC' },
    { id: '2', username: 'dev_marcus', displayName: 'Marcus Johnson', bio: 'Full-stack developer', followers: '8.3K', isVerified: false, initials: 'MJ' },
    { id: '3', username: 'art_by_luna', displayName: 'Luna Rodriguez', bio: 'Digital artist & creator', followers: '25.1K', isVerified: true, initials: 'LR' },
    { id: '4', username: 'techie_alex', displayName: 'Alex Kim', bio: 'AI/ML engineer building the future', followers: '6.7K', isVerified: false, initials: 'AK' },
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                    <Search className="h-6 w-6 text-primary" />
                    Explore
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Discover trending topics, users, and communities</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search posts, users, communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button variant={showFilters ? 'secondary' : 'outline'} onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>

                {showFilters && (
                    <Card className="bg-muted/40 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-semibold">Advanced Search</CardTitle>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowFilters(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Date Range</Label>
                                    <Select defaultValue="all">
                                        <SelectTrigger><SelectValue placeholder="All Time" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Time</SelectItem>
                                            <SelectItem value="today">Today</SelectItem>
                                            <SelectItem value="week">This Week</SelectItem>
                                            <SelectItem value="month">This Month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger><SelectValue placeholder="English" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Languages</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Engagement</Label>
                                    <Input type="number" placeholder="Min. likes/comments" />
                                </div>
                                <div className="space-y-1.5 flex flex-col justify-end">
                                    <Button className="w-full">Apply Filters</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="trending" className="w-full">
                <TabsList className="w-full mb-6">
                    <TabsTrigger value="trending" className="flex-1"><TrendingUp className="h-4 w-4 mr-2" /> Trending</TabsTrigger>
                    <TabsTrigger value="users" className="flex-1"><Users className="h-4 w-4 mr-2" /> Suggested Users</TabsTrigger>
                    <TabsTrigger value="communities" className="flex-1"><Hash className="h-4 w-4 mr-2" /> Communities</TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trendingHashtags.map((item) => (
                        <Card key={item.tag} className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Hash className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{item.tag}</p>
                                        <p className="text-xs text-muted-foreground">{item.posts} posts</p>
                                    </div>
                                </div>
                                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-0">{item.trend}</Badge>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="users" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedUsers.map((user) => (
                        <Card key={user.id}>
                            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{user.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold flex items-center justify-center gap-1">
                                        {user.displayName}
                                        {user.isVerified && <Badge className="px-1.5 py-0 text-[10px] ml-1 bg-primary/20 text-primary border-0 rounded-full">✓</Badge>}
                                    </p>
                                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                                </div>
                                <p className="text-sm line-clamp-2 min-h-10">{user.bio}</p>
                                <div className="text-xs text-muted-foreground font-semibold">{user.followers} followers</div>
                                <Button className="w-full mt-2">Follow</Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="communities">
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl border-muted">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                            <Hash className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Discover Communities</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">Search for topics you care about and join vibrant communities.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
