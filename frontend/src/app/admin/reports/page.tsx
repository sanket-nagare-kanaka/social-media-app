'use client';

import { useState } from 'react';
import { AlertTriangle, UserX, RotateCcw, FileText, Ban, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const suspensionList = [
    { id: '1', user: 'toxic_user123', status: 'temp_suspended', reason: 'Multiple hate speech violations', date: '2025-02-27', expiresIn: '5 days' },
    { id: '2', user: 'spam_bot_44', status: 'permanently_banned', reason: 'Automated spam', date: '2025-02-26', expiresIn: 'Never' },
    { id: '3', user: 'angry_poster', status: 'warning', reason: 'Harassment in comments', date: '2025-02-25', expiresIn: 'N/A' },
];

const appealList = [
    { id: '1', user: 'user_wrongly_flagged', appeal: 'My post was educational content about toxicity detection, not actual toxic content.', date: '2025-02-27', status: 'pending' },
    { id: '2', user: 'debate_king', appeal: 'I was expressing a strong opinion, not harassing anyone. Please review the context.', date: '2025-02-26', status: 'under_review' },
];

const repeatOffenders = [
    { user: 'toxic_user123', violations: 12, lastViolation: '2025-02-27', severity: 'high' },
    { user: 'spam_bot_44', violations: 34, lastViolation: '2025-02-26', severity: 'critical' },
    { user: 'angry_poster', violations: 5, lastViolation: '2025-02-25', severity: 'medium' },
];

const auditHistory = [
    { id: '1', action: 'User suspended', actor: 'mod_sarah', target: 'toxic_user123', date: '2025-02-27 14:30', details: 'Temp suspended for 7 days' },
    { id: '2', action: 'Post removed', actor: 'mod_alex', target: 'POST-4821', date: '2025-02-27 12:15', details: 'Hate speech violation' },
    { id: '3', action: 'Appeal accepted', actor: 'admin_jen', target: 'user_wrongly_flagged', date: '2025-02-26 18:00', details: 'Content re-classified as educational' },
    { id: '4', action: 'Account banned', actor: 'admin_jen', target: 'spam_bot_44', date: '2025-02-26 10:30', details: 'Permanent ban for automated spam' },
    { id: '5', action: 'Role changed', actor: 'admin_jen', target: 'mod_sarah', date: '2025-02-25 09:00', details: 'Promoted to Senior Moderator' },
];

function getSuspensionBadge(status: string) {
    switch (status) {
        case 'permanently_banned': return <Badge variant="destructive">Permanently Banned</Badge>;
        case 'temp_suspended': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Temp Suspended</Badge>;
        case 'warning': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Warning</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
}

function getSeverityBadge(severity: string) {
    switch (severity) {
        case 'critical': return <Badge variant="destructive">Critical</Badge>;
        case 'high': return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>;
        case 'medium': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medium</Badge>;
        default: return <Badge variant="secondary">{severity}</Badge>;
    }
}

export default function UserReportsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                    User Reports
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Manage user suspensions, appeals, and view audit history</p>
            </div>

            <Tabs defaultValue="suspensions">
                <TabsList>
                    <TabsTrigger value="suspensions"><UserX className="h-4 w-4 mr-1.5" /> Suspensions</TabsTrigger>
                    <TabsTrigger value="appeals"><RotateCcw className="h-4 w-4 mr-1.5" /> Appeals</TabsTrigger>
                    <TabsTrigger value="repeat"><AlertTriangle className="h-4 w-4 mr-1.5" /> Repeat Offenders</TabsTrigger>
                    <TabsTrigger value="audit"><FileText className="h-4 w-4 mr-1.5" /> Audit History</TabsTrigger>
                </TabsList>

                {/* Suspensions */}
                <TabsContent value="suspensions" className="mt-4 space-y-3">
                    {suspensionList.map(item => (
                        <Card key={item.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold">@{item.user}</span>
                                    {getSuspensionBadge(item.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{item.reason}</p>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.date}</span>
                                    <span>Expires: {item.expiresIn}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Appeals */}
                <TabsContent value="appeals" className="mt-4 space-y-3">
                    {appealList.map(item => (
                        <Card key={item.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold">@{item.user}</span>
                                    <Badge variant={item.status === 'pending' ? 'outline' : 'secondary'}>
                                        {item.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                                <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground mb-3">
                                    &ldquo;{item.appeal}&rdquo;
                                </blockquote>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="text-green-500 border-green-500/50 hover:bg-green-500/10">
                                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Reinstate
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                                        <XCircle className="h-3.5 w-3.5 mr-1.5" /> Deny
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Repeat Offenders */}
                <TabsContent value="repeat" className="mt-4 space-y-3">
                    {repeatOffenders.map(item => (
                        <Card key={item.user}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold">@{item.user}</span>
                                    {getSeverityBadge(item.severity)}
                                </div>
                                <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                                    <span className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> {item.violations} violations</span>
                                    <span>Last: {item.lastViolation}</span>
                                </div>
                                <Button size="sm" variant="destructive">
                                    <Ban className="h-3.5 w-3.5 mr-1.5" /> Ban User
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Audit History */}
                <TabsContent value="audit" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-0">
                                {auditHistory.map((item, index) => (
                                    <div key={item.id}>
                                        <div className="flex items-start gap-3 py-3">
                                            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-sm">{item.action}</p>
                                                    <span className="text-xs text-muted-foreground">{item.date}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">By @{item.actor} → {item.target}</p>
                                                <p className="text-xs text-muted-foreground/60">{item.details}</p>
                                            </div>
                                        </div>
                                        {index < auditHistory.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
