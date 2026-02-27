'use client';

import { useState } from 'react';
import { Users, Lock, Shield, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: string;
    isPrivate: boolean;
    requiresPreModeration: boolean;
    rules: string[];
    isMember: boolean;
}

const demoCommunities: Community[] = [
    { id: '1', name: 'Technology', description: 'Discuss the latest in tech, gadgets, and software development.', memberCount: '45.2K', isPrivate: false, requiresPreModeration: false, rules: ['Be respectful', 'No self-promotion', 'Stay on topic'], isMember: true },
    { id: '2', name: 'Finance', description: 'Markets, investing, crypto, and financial planning discussions.', memberCount: '28.7K', isPrivate: false, requiresPreModeration: true, rules: ['No financial advice', 'Cite sources', 'No spam'], isMember: false },
    { id: '3', name: 'Design', description: 'UI/UX, graphic design, typography, and visual art.', memberCount: '33.1K', isPrivate: false, requiresPreModeration: false, rules: ['Share your work', 'Give constructive feedback'], isMember: true },
    { id: '4', name: 'Enterprise Internal', description: 'Private discussions for enterprise team members only.', memberCount: '2.1K', isPrivate: true, requiresPreModeration: true, rules: ['Confidential', 'NDA applies'], isMember: false },
    { id: '5', name: 'Health & Wellness', description: 'Mental health, fitness, nutrition, and self-care discussions.', memberCount: '19.8K', isPrivate: false, requiresPreModeration: false, rules: ['No medical advice', 'Be supportive'], isMember: false },
];

export default function CommunitiesPage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'joined' | 'discover'>('all');

    const filtered = demoCommunities.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        if (filter === 'joined') return matchesSearch && c.isMember;
        if (filter === 'discover') return matchesSearch && !c.isMember;
        return matchesSearch;
    });

    return (
        <div className="flex flex-col gap-6 w-full mx-auto">
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Communities</h1>
                    <p className="text-sm text-muted-foreground mt-1">Discover spaces that match your interests</p>
                </div>
                <Button><UserPlus className="h-4 w-4 mr-2" /> Create Community</Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search communities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-muted/50 border-muted"
                />
            </div>

            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="joined">Joined</TabsTrigger>
                    <TabsTrigger value="discover">Discover</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {filtered.map(comm => (
                    <Card key={comm.id} className="flex flex-col hover:border-primary/50 transition-colors">
                        <CardContent className="p-5 flex-1 flex flex-col">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex gap-3 items-center">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h3 className="font-bold text-lg leading-tight">{comm.name}</h3>
                                            {comm.isPrivate && <Badge variant="outline" className="px-1 py-0 h-5"><Lock className="h-3 w-3 mr-1" /> Private</Badge>}
                                            {comm.requiresPreModeration && <Badge variant="outline" className="px-1 py-0 h-5 border-amber-500/30 text-amber-500"><Shield className="h-3 w-3 mr-1" /> Mod</Badge>}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{comm.memberCount} members</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{comm.description}</p>

                            <div className="w-full">
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {comm.rules.slice(0, 3).map((rule, i) => (
                                        <span key={i} className="text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-sm">
                                            {rule}
                                        </span>
                                    ))}
                                </div>
                                <Button variant={comm.isMember ? "outline" : "default"} className="w-full">
                                    {comm.isMember ? 'Joined' : 'Join Community'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No communities found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
