'use client';

import { useState } from 'react';
import { Settings, Users, Shield, Sliders, UserPlus, Ban, ArrowUpDown, Bell, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const demoUsers = [
    { id: '1', username: 'sarah_designs', email: 'sarah@example.com', role: 'verified_creator', status: 'active', createdDate: '2024-01-15' },
    { id: '2', username: 'mod_sarah', email: 'modsarah@example.com', role: 'senior_moderator', status: 'active', createdDate: '2024-02-10' },
    { id: '3', username: 'dev_marcus', email: 'marcus@example.com', role: 'user', status: 'active', createdDate: '2024-03-22' },
    { id: '4', username: 'toxic_user123', email: 'toxic@example.com', role: 'user', status: 'temp_suspended', createdDate: '2024-06-01' },
    { id: '5', username: 'spam_bot_44', email: 'bot@example.com', role: 'user', status: 'permanently_banned', createdDate: '2024-07-15' },
];

function getRoleBadge(role: string) {
    switch (role) {
        case 'verified_creator': return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Verified Creator</Badge>;
        case 'senior_moderator': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Senior Moderator</Badge>;
        default: return <Badge variant="secondary">User</Badge>;
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'active': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
        case 'temp_suspended': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Temp Suspended</Badge>;
        case 'permanently_banned': return <Badge variant="destructive">Permanently Banned</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
}

const categories = ['Hate Speech', 'Spam', 'Misinformation', 'Harassment', 'NSFW Content'];

export default function AdminPage() {
    const [autoFlagThreshold, setAutoFlagThreshold] = useState([85]);
    const [escalationCount, setEscalationCount] = useState([5]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                    <Settings className="h-6 w-6 text-primary" />
                    Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Manage users, moderation rules, and system settings</p>
            </div>

            <Tabs defaultValue="users">
                <TabsList>
                    <TabsTrigger value="users"><Users className="h-4 w-4 mr-1.5" /> User Management</TabsTrigger>
                    <TabsTrigger value="moderation"><Shield className="h-4 w-4 mr-1.5" /> Moderation Rules</TabsTrigger>
                    <TabsTrigger value="settings"><Sliders className="h-4 w-4 mr-1.5" /> System Settings</TabsTrigger>
                </TabsList>

                {/* User Management */}
                <TabsContent value="users" className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Users</h2>
                        <Button size="sm">
                            <UserPlus className="h-4 w-4 mr-1.5" /> Create Moderator
                        </Button>
                    </div>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {demoUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">@{user.username}</TableCell>
                                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{user.createdDate}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">Actions</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem><ArrowUpDown className="mr-2 h-4 w-4" /> Change Role</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive"><Ban className="mr-2 h-4 w-4" /> Suspend</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Moderation Rules */}
                <TabsContent value="moderation" className="mt-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" /> Risk Thresholds
                            </CardTitle>
                            <CardDescription>Configure automatic content flagging and escalation rules</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Auto-flag threshold</Label>
                                    <Badge variant="destructive">{(autoFlagThreshold[0] / 100).toFixed(2)}</Badge>
                                </div>
                                <Slider value={autoFlagThreshold} onValueChange={setAutoFlagThreshold} max={100} step={1} />
                                <p className="text-xs text-muted-foreground">Content with toxicity score above this will be auto-flagged</p>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Escalation report count</Label>
                                    <Badge variant="outline">{escalationCount[0]}</Badge>
                                </div>
                                <Slider value={escalationCount} onValueChange={setEscalationCount} max={20} step={1} />
                                <p className="text-xs text-muted-foreground">Posts with this many reports will be escalated to senior moderator</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Auto-flag Categories</CardTitle>
                            <CardDescription>Select which content categories should be automatically flagged</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {categories.map(cat => (
                                    <div key={cat} className="flex items-center justify-between rounded-lg border p-3">
                                        <Label className="font-medium">{cat}</Label>
                                        <Switch defaultChecked />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Escalation Time</CardTitle>
                            <CardDescription>Maximum time before flagged content is auto-escalated</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select defaultValue="4">
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 hour</SelectItem>
                                    <SelectItem value="2">2 hours</SelectItem>
                                    <SelectItem value="4">4 hours</SelectItem>
                                    <SelectItem value="8">8 hours</SelectItem>
                                    <SelectItem value="24">24 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="settings" className="mt-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sliders className="h-5 w-5" /> Rate Limits
                            </CardTitle>
                            <CardDescription>Control posting frequency to prevent spam</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Posts per day (new users, &lt;7 days)</Label>
                                    <Input type="number" defaultValue={3} min={1} max={50} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Posts per day (regular users)</Label>
                                    <Input type="number" defaultValue={20} min={1} max={100} />
                                </div>
                                <div className="space-y-2">
                                    <Label>API requests per minute</Label>
                                    <Input type="number" defaultValue={60} min={10} max={1000} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" /> Retention Policy
                            </CardTitle>
                            <CardDescription>Configure how long user data is retained</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Data retention period</Label>
                                <Select defaultValue="365">
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="90">90 days</SelectItem>
                                        <SelectItem value="180">180 days</SelectItem>
                                        <SelectItem value="365">1 year</SelectItem>
                                        <SelectItem value="730">2 years</SelectItem>
                                        <SelectItem value="0">Indefinite</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" /> Notification Templates
                            </CardTitle>
                            <CardDescription>Customize email templates for user notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Warning email subject</Label>
                                <Input type="text" defaultValue="Your post has been flagged for review" />
                            </div>
                            <div className="space-y-2">
                                <Label>Suspension email subject</Label>
                                <Input type="text" defaultValue="Your account has been temporarily suspended" />
                            </div>
                        </CardContent>
                    </Card>

                    <Button>Save Settings</Button>
                </TabsContent>
            </Tabs>
        </div>
    );
}
