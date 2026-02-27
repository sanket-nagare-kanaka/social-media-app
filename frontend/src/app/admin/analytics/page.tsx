'use client';

import { BarChart3, TrendingUp, Users, AlertTriangle, Shield, Download, Hash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function AnalyticsDashboard() {
    const metrics = [
        { label: 'Active Users', value: '24.8K', change: '+12%', positive: true, icon: <Users className="h-5 w-5" />, color: 'text-violet-500', bg: 'bg-violet-500/10' },
        { label: 'New Posts Today', value: '3,421', change: '+8%', positive: true, icon: <TrendingUp className="h-5 w-5" />, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Flagged Content', value: '47', change: '-15%', positive: true, icon: <AlertTriangle className="h-5 w-5" />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'Mod. SLA (avg)', value: '2.4h', change: '-20%', positive: true, icon: <Shield className="h-5 w-5" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

    const topFlaggedKeywords = [
        { keyword: 'scam', count: 89, max: 89 },
        { keyword: 'fake news', count: 67, max: 89 },
        { keyword: 'spam link', count: 54, max: 89 },
        { keyword: 'harassment', count: 41, max: 89 },
        { keyword: 'inappropriate', count: 38, max: 89 },
    ];

    const barData = [65, 72, 58, 80, 85, 92, 78, 88, 95, 90, 82, 97];
    const growthData = [50, 55, 62, 58, 70, 75, 68, 82, 79, 85, 90, 95];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        Analytics Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Platform performance and moderation metrics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" /> CSV</Button>
                    <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" /> PDF</Button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(m => (
                    <Card key={m.label}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${m.bg} ${m.color}`}>
                                    {m.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xl font-extrabold">{m.value}</span>
                                        <Badge className={m.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                            {m.change}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Active Users (30 Day)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2 h-48">
                            {barData.map((h, i) => (
                                <div key={i} className="flex-1 flex items-end">
                                    <div
                                        className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Content Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2 h-48">
                            {growthData.map((h, i) => (
                                <div key={i} className="flex-1 flex items-end">
                                    <div
                                        className="w-full bg-green-500/80 rounded-t hover:bg-green-500 transition-colors"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Abuse Rate</CardTitle>
                        <CardDescription>Percentage of content flagged as abusive</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4 py-4">
                        <div className="w-28 h-28 rounded-full border-4 border-destructive bg-destructive/10 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold text-destructive">1.8%</span>
                            <span className="text-xs text-muted-foreground">of total</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Down 15% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top Flagged Keywords</CardTitle>
                        <CardDescription>Most commonly flagged content patterns</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {topFlaggedKeywords.map((kw, i) => (
                            <div key={kw.keyword} className="flex items-center gap-3 text-sm">
                                <span className="font-bold text-muted-foreground w-6">#{i + 1}</span>
                                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-semibold w-24">{kw.keyword}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-destructive/70 rounded-full"
                                        style={{ width: `${(kw.count / kw.max) * 100}%` }}
                                    />
                                </div>
                                <span className="font-bold text-destructive w-8 text-right">{kw.count}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
