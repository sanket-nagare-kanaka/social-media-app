'use client';

import { useState } from 'react';
import { FileText, Download, Trash2, CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const exportRequests = [
    { id: '1', user: 'sarah_designs', type: 'All Data', status: 'ready', requestedAt: '2025-02-27 10:00', expiresAt: '2025-02-28 10:00', format: 'JSON' },
    { id: '2', user: 'dev_marcus', type: 'Posts', status: 'processing', requestedAt: '2025-02-27 08:30', expiresAt: '--', format: 'CSV' },
    { id: '3', user: 'art_by_luna', type: 'Activity Logs', status: 'expired', requestedAt: '2025-02-25 14:00', expiresAt: '2025-02-26 14:00', format: 'PDF' },
];

const deletionRequests = [
    { id: '1', user: 'former_user_99', status: 'pending', requestedAt: '2025-02-27', reason: 'Account closure' },
    { id: '2', user: 'privacy_user', status: 'approved', requestedAt: '2025-02-26', reason: 'GDPR right to be forgotten' },
];

const auditLogs = [
    { id: '1', action: 'Post edited', actor: 'sarah_designs', target: 'POST-4821', timestamp: '2025-02-27 14:30:22' },
    { id: '2', action: 'Moderation action', actor: 'mod_sarah', target: 'Report #247', timestamp: '2025-02-27 12:15:05' },
    { id: '3', action: 'Account suspended', actor: 'admin_jen', target: 'toxic_user123', timestamp: '2025-02-27 10:00:18' },
    { id: '4', action: 'Role changed', actor: 'admin_jen', target: 'mod_alex → Senior Mod', timestamp: '2025-02-26 16:45:30' },
    { id: '5', action: 'Report decision', actor: 'mod_sarah', target: 'Report #244', timestamp: '2025-02-26 14:20:11' },
];

function getFormatBadge(format: string) {
    switch (format) {
        case 'JSON': return <Badge className="bg-blue-500/20 text-blue-400">JSON</Badge>;
        case 'CSV': return <Badge className="bg-green-500/20 text-green-400">CSV</Badge>;
        case 'PDF': return <Badge className="bg-red-500/20 text-red-400">PDF</Badge>;
        default: return <Badge variant="secondary">{format}</Badge>;
    }
}

function getExportStatusBadge(status: string) {
    switch (status) {
        case 'ready': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ready</Badge>;
        case 'processing': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Processing</Badge>;
        case 'expired': return <Badge variant="destructive">Expired</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
}

export default function CompliancePage() {
    const [auditSearch, setAuditSearch] = useState('');

    const filteredAudit = auditSearch
        ? auditLogs.filter(l => l.action.toLowerCase().includes(auditSearch.toLowerCase()) || l.actor.toLowerCase().includes(auditSearch.toLowerCase()) || l.target.toLowerCase().includes(auditSearch.toLowerCase()))
        : auditLogs;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        Compliance
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Data exports, deletions, audit logs, and access history</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" /> CSV</Button>
                    <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" /> JSON</Button>
                    <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" /> PDF</Button>
                </div>
            </div>

            <Tabs defaultValue="exports">
                <TabsList>
                    <TabsTrigger value="exports"><Download className="h-4 w-4 mr-1.5" /> Data Exports</TabsTrigger>
                    <TabsTrigger value="deletions"><Trash2 className="h-4 w-4 mr-1.5" /> Data Deletions</TabsTrigger>
                    <TabsTrigger value="audit"><FileText className="h-4 w-4 mr-1.5" /> Audit Logs</TabsTrigger>
                    <TabsTrigger value="access"><Eye className="h-4 w-4 mr-1.5" /> Access History</TabsTrigger>
                </TabsList>

                {/* Data Exports */}
                <TabsContent value="exports" className="mt-4">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Format</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Requested</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exportRequests.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">@{item.user}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{getFormatBadge(item.format)}</TableCell>
                                        <TableCell>{getExportStatusBadge(item.status)}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{item.requestedAt}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{item.expiresAt}</TableCell>
                                        <TableCell className="text-right">
                                            {item.status === 'ready' && (
                                                <Button size="sm"><Download className="h-3.5 w-3.5" /></Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Data Deletions */}
                <TabsContent value="deletions" className="mt-4 space-y-3">
                    {deletionRequests.map(item => (
                        <Card key={item.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold">@{item.user}</span>
                                    <Badge variant={item.status === 'pending' ? 'outline' : 'secondary'} className={item.status === 'approved' ? 'bg-green-500/20 text-green-400' : ''}>
                                        {item.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{item.reason}</p>
                                {item.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="text-green-500 border-green-500/50 hover:bg-green-500/10">
                                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                                            <XCircle className="h-3.5 w-3.5 mr-1.5" /> Reject
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Audit Logs */}
                <TabsContent value="audit" className="mt-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search audit logs..."
                                    value={auditSearch}
                                    onChange={(e) => setAuditSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-0">
                                {filteredAudit.map((item, index) => (
                                    <div key={item.id}>
                                        <div className="flex items-start gap-3 py-3">
                                            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm">{item.action}</p>
                                                <p className="text-xs text-muted-foreground">By @{item.actor} → {item.target}</p>
                                                <p className="text-xs text-muted-foreground/60">{item.timestamp}</p>
                                            </div>
                                        </div>
                                        {index < filteredAudit.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Access History */}
                <TabsContent value="access" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center py-12 text-muted-foreground gap-3">
                                <Eye className="h-12 w-12" />
                                <h3 className="text-lg font-semibold text-foreground">Access History</h3>
                                <p className="text-sm max-w-xs text-center">User login events, IP addresses, and session history will be displayed here.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
