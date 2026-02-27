'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, Check, X, ArrowUp, Eye, Filter, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface ModerationItem {
    id: string;
    postId: string;
    user: string;
    riskScore: number;
    reportCount: number;
    category: string;
    status: 'flagged' | 'under_review' | 'approved' | 'removed';
    createdDate: string;
    content: string;
}

const demoQueue: ModerationItem[] = [
    { id: '1', postId: 'POST-4821', user: 'toxic_user123', riskScore: 0.92, reportCount: 8, category: 'Hate Speech', status: 'flagged', createdDate: '2025-02-27', content: 'This is a flagged post containing potentially harmful content...' },
    { id: '2', postId: 'POST-4819', user: 'spam_account', riskScore: 0.88, reportCount: 12, category: 'Spam', status: 'flagged', createdDate: '2025-02-27', content: 'Buy now! Limited offer! Click this suspicious link...' },
    { id: '3', postId: 'POST-4815', user: 'user_42', riskScore: 0.67, reportCount: 3, category: 'Misinformation', status: 'under_review', createdDate: '2025-02-26', content: 'Unverified medical claims about a new treatment...' },
    { id: '4', postId: 'POST-4810', user: 'art_creator', riskScore: 0.45, reportCount: 2, category: 'NSFW Content', status: 'under_review', createdDate: '2025-02-26', content: 'Artistic content that was flagged for review...' },
    { id: '5', postId: 'POST-4808', user: 'debate_king', riskScore: 0.73, reportCount: 6, category: 'Harassment', status: 'flagged', createdDate: '2025-02-25', content: 'Aggressive comment targeting another user...' },
];

function getRiskVariant(score: number): 'destructive' | 'outline' | 'secondary' {
    if (score >= 0.7) return 'destructive';
    if (score >= 0.3) return 'outline';
    return 'secondary';
}

function getStatusVariant(status: string): 'destructive' | 'outline' | 'secondary' | 'default' {
    switch (status) {
        case 'flagged': return 'destructive';
        case 'under_review': return 'outline';
        case 'approved': return 'secondary';
        case 'removed': return 'destructive';
        default: return 'default';
    }
}

function getCategoryColor(category: string) {
    switch (category) {
        case 'Hate Speech': return 'text-red-400';
        case 'Spam': return 'text-orange-400';
        case 'Misinformation': return 'text-yellow-400';
        case 'NSFW Content': return 'text-pink-400';
        case 'Harassment': return 'text-purple-400';
        default: return 'text-muted-foreground';
    }
}

export default function ModerationDashboard() {
    const [queue, setQueue] = useState(demoQueue);
    const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredQueue = statusFilter === 'all' ? queue : queue.filter(i => i.status === statusFilter);
    const flaggedCount = queue.filter(i => i.status === 'flagged').length;
    const underReviewCount = queue.filter(i => i.status === 'under_review').length;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                        <Shield className="h-6 w-6 text-primary" />
                        Moderation Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Review flagged content and manage reports</p>
                </div>
                <div className="flex gap-3">
                    <Card className="px-5 py-3 text-center">
                        <p className="text-2xl font-extrabold text-destructive">{flaggedCount}</p>
                        <p className="text-xs text-muted-foreground">Flagged</p>
                    </Card>
                    <Card className="px-5 py-3 text-center">
                        <p className="text-2xl font-extrabold text-yellow-500">{underReviewCount}</p>
                        <p className="text-xs text-muted-foreground">Under Review</p>
                    </Card>
                </div>
            </div>

            {/* Filters */}
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="flagged">Flagged</TabsTrigger>
                        <TabsTrigger value="under_review">Under Review</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="removed">Removed</TabsTrigger>
                    </TabsList>
                    <Button variant="outline" size="sm">
                        <Filter className="h-3.5 w-3.5 mr-1.5" /> More Filters
                    </Button>
                </div>

                {/* Table */}
                <TabsContent value={statusFilter} className="mt-4">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Post ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="w-[100px]">Risk Score</TableHead>
                                    <TableHead className="w-[60px] text-center">Reports</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[90px]">Date</TableHead>
                                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredQueue.map((item) => (
                                    <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelectedItem(item)}>
                                        <TableCell className="font-mono text-xs text-primary">{item.postId}</TableCell>
                                        <TableCell className="font-medium">@{item.user}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={item.riskScore * 100} className="h-2 w-16" />
                                                <Badge variant={getRiskVariant(item.riskScore)} className="text-xs">
                                                    {(item.riskScore * 100).toFixed(0)}%
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-bold">{item.reportCount}</TableCell>
                                        <TableCell>
                                            <span className={`text-sm font-medium ${getCategoryColor(item.category)}`}>
                                                {item.category}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(item.status)}>
                                                {item.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{item.createdDate}</TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setSelectedItem(item)}>
                                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-green-500">
                                                        <Check className="mr-2 h-4 w-4" /> Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <X className="mr-2 h-4 w-4" /> Remove
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-yellow-500">
                                                        <AlertTriangle className="mr-2 h-4 w-4" /> Warn User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-orange-500">
                                                        <ArrowUp className="mr-2 h-4 w-4" /> Escalate
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Detail Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Content Detail — {selectedItem?.postId}</DialogTitle>
                        <DialogDescription>
                            Review the flagged content and take appropriate action.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-4 py-2">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Posted By</p>
                                <p className="font-medium">@{selectedItem.user}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Content</p>
                                <p className="text-sm leading-relaxed bg-muted p-3 rounded-lg">{selectedItem.content}</p>
                            </div>
                            <Separator />
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Risk Score</p>
                                    <div className="flex items-center gap-3">
                                        <Progress value={selectedItem.riskScore * 100} className="h-2.5 w-28" />
                                        <Badge variant={getRiskVariant(selectedItem.riskScore)} className="text-sm">
                                            {(selectedItem.riskScore * 100).toFixed(0)}%
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Reports</p>
                                    <p className="text-lg font-bold">{selectedItem.reportCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Category</p>
                                    <Badge variant="outline">{selectedItem.category}</Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10">
                            <AlertTriangle className="mr-2 h-4 w-4" /> Warn User
                        </Button>
                        <Button variant="outline" className="text-green-500 border-green-500/50 hover:bg-green-500/10">
                            <Check className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button variant="destructive">
                            <X className="mr-2 h-4 w-4" /> Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
