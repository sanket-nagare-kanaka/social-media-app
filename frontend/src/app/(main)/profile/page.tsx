'use client';

import { useState } from 'react';
import { Settings, Grid3X3, MessageSquare, Image as ImageIcon, Bookmark, Users, UserPlus, BarChart3, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
    const user = {
        displayName: 'Sarah Chen',
        username: 'sarah_designs',
        bio: 'Design systems & UI engineer. Building beautiful, accessible interfaces. ✨',
        isVerified: true,
        postsCount: 342,
        followersCount: '12.5K',
        followingCount: 891,
        avatarInitial: 'S',
    };

    const tabs = [
        { key: 'posts', icon: <Grid3X3 className="h-4 w-4 mr-2" />, label: 'Posts' },
        { key: 'replies', icon: <MessageSquare className="h-4 w-4 mr-2" />, label: 'Replies' },
        { key: 'media', icon: <ImageIcon className="h-4 w-4 mr-2" />, label: 'Media' },
        { key: 'bookmarks', icon: <Bookmark className="h-4 w-4 mr-2" />, label: 'Bookmarks' },
    ];

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0 relative">
                    {/* Story ring effect */}
                    <div className="rounded-full p-1 bg-gradient-to-tr from-orange-500 via-pink-500 to-primary">
                        <div className="h-32 w-32 rounded-full border-4 border-background bg-muted flex items-center justify-center text-4xl font-extrabold text-muted-foreground shadow-inner">
                            {user.avatarInitial}
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold flex items-center gap-2">
                                {user.displayName}
                                {user.isVerified && <CheckCircle2 className="h-5 w-5 fill-primary text-primary-foreground" />}
                            </h1>
                            <p className="text-muted-foreground font-medium">@{user.username}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="default" className="w-full sm:w-auto"><UserPlus className="h-4 w-4 mr-2" /> Follow</Button>
                            <Button variant="outline" size="icon"><BarChart3 className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <p className="max-w-md text-sm leading-relaxed">{user.bio}</p>

                    {/* Stats */}
                    <div className="flex gap-6">
                        <div className="flex flex-col items-start cursor-pointer group">
                            <span className="text-lg font-extrabold group-hover:text-primary transition-colors">{user.postsCount}</span>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Posts</span>
                        </div>
                        <div className="flex flex-col items-start cursor-pointer group">
                            <span className="text-lg font-extrabold group-hover:text-primary transition-colors">{user.followersCount}</span>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Followers</span>
                        </div>
                        <div className="flex flex-col items-start cursor-pointer group">
                            <span className="text-lg font-extrabold group-hover:text-primary transition-colors">{user.followingCount}</span>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Following</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full flex justify-start rounded-none border-b bg-transparent p-0 mb-6 h-auto">
                    {tabs.map(tab => (
                        <TabsTrigger
                            key={tab.key}
                            value={tab.key}
                            className="flex-1 md:flex-none rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-muted-foreground font-semibold data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent shadow-none"
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="posts" className="grid grid-cols-3 gap-1 sm:gap-4 mt-0">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                        <div key={i} className="aspect-square bg-muted/50 rounded-md sm:rounded-xl hover:opacity-80 transition-opacity cursor-pointer overflow-hidden relative group">
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4 font-bold">
                                <span className="flex items-center gap-1"><HeartIcon className="h-5 w-5 fill-white" /> 124</span>
                                <span className="flex items-center gap-1"><MessageCircleIcon className="h-5 w-5 fill-white" /> 12</span>
                            </div>
                        </div>
                    ))}
                </TabsContent>

                {['replies', 'media', 'bookmarks'].map(tab => (
                    <TabsContent key={tab} value={tab} className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl border-muted">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                            {tabs.find(t => t.key === tab)?.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-1 hidden sm:block">No {tab} yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm hidden sm:block">When you have {tab}, they will appear here.</p>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

// Simple icons for the hover state
function HeartIcon(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
}

function MessageCircleIcon(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>;
}
