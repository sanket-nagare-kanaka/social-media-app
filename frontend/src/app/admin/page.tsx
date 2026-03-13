'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, Users, Shield, Sliders, UserPlus, Ban, ArrowUpDown, Bell, Database, Loader2, RefreshCw, CheckCircle2, Undo2 } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth-context';

interface UserProfile {
    id: string;
    username: string;
    display_name: string | null;
    email?: string;
    role: string;
    account_status: string;
    is_verified: boolean;
    created_at: string | null;
}

interface UsersResponse {
    users: UserProfile[];
    total: number;
    page: number;
    per_page: number;
}

const ALL_ROLES = [
    { value: 'user', label: 'User' },
    { value: 'verified_creator', label: 'Verified Creator' },
    { value: 'community_moderator', label: 'Community Moderator' },
    { value: 'senior_moderator', label: 'Senior Moderator' },
    { value: 'admin', label: 'Admin' },
    { value: 'compliance_officer', label: 'Compliance Officer' },
    { value: 'analyst', label: 'Analyst' },
];

function getRoleBadge(role: string) {
    switch (role) {
        case 'admin': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Admin</Badge>;
        case 'verified_creator': return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Verified Creator</Badge>;
        case 'senior_moderator': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Senior Moderator</Badge>;
        case 'community_moderator': return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Community Moderator</Badge>;
        case 'compliance_officer': return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Compliance Officer</Badge>;
        case 'analyst': return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Analyst</Badge>;
        default: return <Badge variant="secondary">User</Badge>;
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'active': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
        case 'warning': return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Warning</Badge>;
        case 'temp_suspended': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Temp Suspended</Badge>;
        case 'permanently_banned': return <Badge variant="destructive">Permanently Banned</Badge>;
        case 'appeal': return <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Appeal</Badge>;
        case 'review': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Under Review</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
}

const categories = ['Hate Speech', 'Spam', 'Misinformation', 'Harassment', 'NSFW Content'];

export default function AdminPage() {
    const { session } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Role Change Dialog
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [roleDialogUser, setRoleDialogUser] = useState<UserProfile | null>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [roleLoading, setRoleLoading] = useState(false);

    // Suspend Dialog
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
    const [suspendDialogUser, setSuspendDialogUser] = useState<UserProfile | null>(null);
    const [suspendReason, setSuspendReason] = useState('');
    const [suspendDuration, setSuspendDuration] = useState<string>('');
    const [suspendLoading, setSuspendLoading] = useState(false);

    // Reinstate loading
    const [reinstateLoading, setReinstateLoading] = useState<string | null>(null);

    const [autoFlagThreshold, setAutoFlagThreshold] = useState([85]);
    const [escalationCount, setEscalationCount] = useState([5]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const fetchUsers = useCallback(async () => {
        if (!session?.access_token) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${apiUrl}/api/admin/users?page=${page}&per_page=${perPage}`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: 'Failed to fetch users' }));
                throw new Error(err.detail || `Error ${res.status}`);
            }
            const data: UsersResponse = await res.json();
            setUsers(data.users);
            setTotalUsers(data.total);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, [session, page, perPage, apiUrl]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleChangeRole = async () => {
        if (!roleDialogUser || !selectedRole || !session?.access_token) return;
        setRoleLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/admin/users/${roleDialogUser.id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ role: selectedRole }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: 'Failed to change role' }));
                throw new Error(err.detail);
            }
            setRoleDialogOpen(false);
            showSuccess(`Changed ${roleDialogUser.username}'s role to ${selectedRole}`);
            await fetchUsers();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setRoleLoading(false);
        }
    };

    const handleSuspend = async () => {
        if (!suspendDialogUser || !suspendReason || !session?.access_token) return;
        setSuspendLoading(true);
        try {
            const body: any = { reason: suspendReason };
            if (suspendDuration && suspendDuration !== 'permanent') {
                body.duration_days = parseInt(suspendDuration);
            }
            const res = await fetch(`${apiUrl}/api/admin/users/${suspendDialogUser.id}/suspend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: 'Failed to suspend user' }));
                throw new Error(err.detail);
            }
            setSuspendDialogOpen(false);
            setSuspendReason('');
            setSuspendDuration('');
            showSuccess(`Suspended ${suspendDialogUser.username}`);
            await fetchUsers();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSuspendLoading(false);
        }
    };

    const handleReinstate = async (user: UserProfile) => {
        if (!session?.access_token) return;
        setReinstateLoading(user.id);
        try {
            const res = await fetch(`${apiUrl}/api/admin/users/${user.id}/reinstate`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: 'Failed to reinstate user' }));
                throw new Error(err.detail);
            }
            showSuccess(`Reinstated ${user.username}`);
            await fetchUsers();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setReinstateLoading(null);
        }
    };

    const totalPages = Math.ceil(totalUsers / perPage);

    return (
        <div className="flex flex-col gap-6">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium text-sm">{successMessage}</span>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
                </div>
            )}

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
                        <h2 className="text-lg font-bold">Users ({totalUsers})</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoading}>
                                <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                            </Button>
                        </div>
                    </div>

                    <Card>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="py-16 text-center text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No users found.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Display Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">@{user.username}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.display_name || '—'}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>{getStatusBadge(user.account_status)}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">Actions</Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => {
                                                            setRoleDialogUser(user);
                                                            setSelectedRole(user.role);
                                                            setRoleDialogOpen(true);
                                                        }}>
                                                            <ArrowUpDown className="mr-2 h-4 w-4" /> Change Role
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {user.account_status === 'active' ? (
                                                            <DropdownMenuItem className="text-destructive" onClick={() => {
                                                                setSuspendDialogUser(user);
                                                                setSuspendDialogOpen(true);
                                                            }}>
                                                                <Ban className="mr-2 h-4 w-4" /> Suspend
                                                            </DropdownMenuItem>
                                                        ) : (user.account_status === 'temp_suspended' || user.account_status === 'permanently_banned') ? (
                                                            <DropdownMenuItem onClick={() => handleReinstate(user)} disabled={reinstateLoading === user.id}>
                                                                {reinstateLoading === user.id ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Undo2 className="mr-2 h-4 w-4" />
                                                                )}
                                                                Reinstate
                                                            </DropdownMenuItem>
                                                        ) : null}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Card>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Page {page} of {totalPages} ({totalUsers} users)
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
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

            {/* Role Change Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription>
                            Change role for <strong>@{roleDialogUser?.username}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>New Role</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_ROLES.map(r => (
                                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleChangeRole} disabled={roleLoading || selectedRole === roleDialogUser?.role}>
                            {roleLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Change Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend Dialog */}
            <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Suspend User</DialogTitle>
                        <DialogDescription>
                            Suspend <strong>@{suspendDialogUser?.username}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Reason *</Label>
                            <Textarea
                                placeholder="Describe the reason for suspension..."
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Select value={suspendDuration} onValueChange={setSuspendDuration}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 day</SelectItem>
                                    <SelectItem value="3">3 days</SelectItem>
                                    <SelectItem value="7">7 days</SelectItem>
                                    <SelectItem value="14">14 days</SelectItem>
                                    <SelectItem value="30">30 days</SelectItem>
                                    <SelectItem value="permanent">Permanent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setSuspendDialogOpen(false);
                            setSuspendReason('');
                            setSuspendDuration('');
                        }}>Cancel</Button>
                        <Button variant="destructive" onClick={handleSuspend} disabled={suspendLoading || !suspendReason}>
                            {suspendLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Suspend User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
