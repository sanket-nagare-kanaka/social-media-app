'use client';

import { useState } from 'react';
import { Heart, MessageCircle, AtSign, Shield, AlertTriangle, Check, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'mention' | 'moderation_decision' | 'report_outcome';
    title: string;
    body: string;
    timeAgo: string;
    isRead: boolean;
    icon: React.ReactNode;
}

const demoNotifications: Notification[] = [
    { id: '1', type: 'like', title: 'Sarah Chen liked your post', body: '"Just shipped the new design system..."', timeAgo: '2m', isRead: false, icon: <Heart className="h-5 w-5 text-red-500 fill-red-500" /> },
    { id: '2', type: 'comment', title: 'Marcus Johnson commented', body: '"Great insights! I totally agree with the TypeScript take."', timeAgo: '15m', isRead: false, icon: <MessageCircle className="h-5 w-5 text-primary" /> },
    { id: '3', type: 'mention', title: 'Luna Rodriguez mentioned you', body: '"@you should check out this new AI moderation tool..."', timeAgo: '1h', isRead: false, icon: <AtSign className="h-5 w-5 text-blue-500" /> },
    { id: '4', type: 'moderation_decision', title: 'Content approved', body: 'Your reported post has been reviewed and approved by a moderator.', timeAgo: '3h', isRead: true, icon: <Shield className="h-5 w-5 text-green-500" /> },
    { id: '5', type: 'report_outcome', title: 'Report resolved', body: 'The content you reported has been removed for violating community guidelines.', timeAgo: '5h', isRead: true, icon: <AlertTriangle className="h-5 w-5 text-yellow-500" /> },
    { id: '6', type: 'like', title: 'Alex Kim and 12 others liked your post', body: '"Building a moderation system with AI risk scoring..."', timeAgo: '8h', isRead: true, icon: <Heart className="h-5 w-5 text-red-500 fill-red-500" /> },
    { id: '7', type: 'comment', title: 'Natalie Wright replied to your comment', body: '"Thanks for the kind words! Here\'s what we learned..."', timeAgo: '12h', isRead: true, icon: <MessageCircle className="h-5 w-5 text-primary" /> },
    { id: '8', type: 'moderation_decision', title: 'Account warning received', body: 'Your post was flagged for review. Please review our community guidelines.', timeAgo: '1d', isRead: true, icon: <Shield className="h-5 w-5 text-destructive" /> },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(demoNotifications);
    const [filter, setFilter] = useState<string>('all');

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-extrabold tracking-tight">Notifications</h1>
                    {unreadCount > 0 && <Badge variant="default" className="bg-primary text-primary-foreground">{unreadCount} new</Badge>}
                </div>
                {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllRead} className="text-muted-foreground hover:text-foreground">
                        <Check className="h-4 w-4 mr-1.5" /> Mark all read
                    </Button>
                )}
            </div>

            {/* Filter Tabs */}
            <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
                <TabsList className="w-full justify-start h-auto flex-wrap bg-transparent p-0 gap-2 mb-2">
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'like', label: 'Likes' },
                        { key: 'comment', label: 'Comments' },
                        { key: 'mention', label: 'Mentions' },
                        { key: 'moderation_decision', label: 'Moderation' },
                        { key: 'report_outcome', label: 'Reports' },
                    ].map(tab => (
                        <TabsTrigger
                            key={tab.key}
                            value={tab.key}
                            className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background border bg-muted/50 pb-2 pt-1.5"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Notification List */}
            <div className="flex flex-col gap-2">
                {filtered.map((notif) => (
                    <div
                        key={notif.id}
                        className={`flex gap-4 p-4 rounded-xl border transition-colors hover:bg-muted/50 cursor-pointer
                        ${!notif.isRead ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
                    >
                        <div className="mt-1 shrink-0">{notif.icon}</div>
                        <div className="flex-1 space-y-1">
                            <p className="font-semibold text-sm">{notif.title}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{notif.body}</p>
                            <p className="text-xs text-muted-foreground font-medium pt-1">{notif.timeAgo}</p>
                        </div>
                        {!notif.isRead && (
                            <div className="shrink-0 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                        )}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl border-muted">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                            <Bell className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">No notifications</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">You're all caught up! Check back later for new updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
