'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Shield, Key, Users, Lock, ArrowRight, Copy, Check, LogIn,
    ChevronDown, ChevronUp, BookOpen, Zap, Eye, UserCheck,
    AlertTriangle, Database, Server, Globe, Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/* ------------------------------------------------------------------ */
/*  Test Credentials                                                   */
/* ------------------------------------------------------------------ */
const TEST_USERS = [
    {
        role: 'admin',
        label: 'Admin',
        email: 'admin@social-test.com',
        password: 'Admin@123456',
        color: 'from-red-500 to-rose-600',
        badge: 'bg-red-500/15 text-red-600 border-red-500/30',
        icon: Shield,
        access: ['Full platform governance', 'User management & role changes', 'Suspend / ban / reinstate users', 'Moderation rules config', 'System settings'],
    },
    {
        role: 'senior_moderator',
        label: 'Senior Moderator',
        email: 'sr.moderator@social-test.com',
        password: 'SrModerator@123456',
        color: 'from-orange-500 to-amber-600',
        badge: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
        icon: AlertTriangle,
        access: ['Escalation handling', 'Suspend & warn users', 'All moderation actions', 'Report management'],
    },
    {
        role: 'community_moderator',
        label: 'Community Moderator',
        email: 'moderator@social-test.com',
        password: 'Moderator@123456',
        color: 'from-blue-500 to-indigo-600',
        badge: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
        icon: Eye,
        access: ['Review flagged content', 'Approve / remove posts', 'Report management', 'Community moderation'],
    },
    {
        role: 'verified_creator',
        label: 'Verified Creator',
        email: 'creator@social-test.com',
        password: 'Creator@123456',
        color: 'from-emerald-500 to-green-600',
        badge: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
        icon: UserCheck,
        access: ['Creator analytics dashboard', 'Monetization features', 'All standard user actions', 'Verified badge'],
    },
    {
        role: 'compliance_officer',
        label: 'Compliance Officer',
        email: 'compliance@social-test.com',
        password: 'Compliance@123456',
        color: 'from-purple-500 to-violet-600',
        badge: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
        icon: Fingerprint,
        access: ['Audit log access', 'Data export & deletion requests', 'Compliance reports', 'User data overview'],
    },
    {
        role: 'analyst',
        label: 'Analyst',
        email: 'analyst@social-test.com',
        password: 'Analyst@123456',
        color: 'from-cyan-500 to-sky-600',
        badge: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30',
        icon: Zap,
        access: ['Platform analytics dashboard', 'Reports read access', 'User activity overview'],
    },
];

/* ------------------------------------------------------------------ */
/*  Expandable Section                                                 */
/* ------------------------------------------------------------------ */
function Section({ title, icon: Icon, defaultOpen = false, children }: {
    title: string;
    icon: React.ElementType;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-primary/10 rounded-xl overflow-hidden bg-card/60 backdrop-blur-sm">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white shrink-0">
                    <Icon size={16} />
                </div>
                <span className="font-bold text-lg flex-1">{title}</span>
                {open ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
            </button>
            {open && (
                <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <Separator />
                    {children}
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Credential Card                                                    */
/* ------------------------------------------------------------------ */
function CredentialCard({ user }: { user: typeof TEST_USERS[0] }) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const router = useRouter();
    const Icon = user.icon;

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <Card className="border-primary/10 hover:border-primary/25 transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${user.color} text-white shadow-lg`}>
                        <Icon size={18} />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-base">{user.label}</CardTitle>
                        <Badge variant="outline" className={`mt-1 text-[10px] font-bold ${user.badge}`}>
                            {user.role}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Email */}
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-muted-foreground font-semibold w-14 shrink-0">Email</span>
                    <code className="text-xs flex-1 truncate font-mono">{user.email}</code>
                    <button
                        onClick={() => copyToClipboard(user.email, `${user.role}-email`)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                        {copiedField === `${user.role}-email` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>

                {/* Password */}
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-muted-foreground font-semibold w-14 shrink-0">Pass</span>
                    <code className="text-xs flex-1 truncate font-mono">{user.password}</code>
                    <button
                        onClick={() => copyToClipboard(user.password, `${user.role}-pass`)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                        {copiedField === `${user.role}-pass` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>

                {/* Access List */}
                <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Access</span>
                    <ul className="space-y-1">
                        {user.access.map((a) => (
                            <li key={a} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <span className="text-primary mt-0.5">•</span>
                                {a}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Login Button */}
                <Button
                    size="sm"
                    className={`w-full mt-2 font-bold bg-gradient-to-r ${user.color} text-white border-0 shadow-md hover:opacity-90`}
                    onClick={() => router.push(`/login?email=${encodeURIComponent(user.email)}`)}
                >
                    <LogIn size={14} className="mr-2" />
                    Login as {user.label}
                </Button>
            </CardContent>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/*  Flow Step                                                          */
/* ------------------------------------------------------------------ */
function FlowStep({ step, title, desc, icon: Icon }: {
    step: number;
    title: string;
    desc: string;
    icon: React.ElementType;
}) {
    return (
        <div className="flex gap-4 items-start">
            <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-lg shrink-0">
                    {step}
                </div>
                <div className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent mt-2" />
            </div>
            <div className="pb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} className="text-primary" />
                    <h4 className="font-bold">{title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  API Endpoint Row                                                   */
/* ------------------------------------------------------------------ */
function ApiRow({ method, path, desc, roles }: {
    method: string;
    path: string;
    desc: string;
    roles: string[];
}) {
    const methodColors: Record<string, string> = {
        GET: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
        POST: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
        PUT: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
        DELETE: 'bg-red-500/15 text-red-600 border-red-500/30',
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-primary/5 last:border-0">
            <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={`text-[10px] font-bold w-12 justify-center ${methodColors[method] || ''}`}>
                    {method}
                </Badge>
                <code className="text-xs font-mono text-foreground">{path}</code>
            </div>
            <span className="text-xs text-muted-foreground flex-1">{desc}</span>
            <div className="flex gap-1 flex-wrap">
                {roles.map((r) => (
                    <Badge key={r} variant="outline" className="text-[9px] font-semibold">{r}</Badge>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function HelpPage() {
    const [permissionsData, setPermissionsData] = useState<Record<string, { resource: string, action: string }[]>>({});
    const [isLoadingPerms, setIsLoadingPerms] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                // Determine API URL (default to localhost if env var missing)
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/auth/roles/permissions`);
                if (res.ok) {
                    const data = await res.json();
                    setPermissionsData(data);
                }
            } catch (err) {
                console.error("Failed to fetch permissions:", err);
            } finally {
                setIsLoadingPerms(false);
            }
        };
        fetchPermissions();
    }, []);

    return (
        <div className="flex min-h-screen w-full items-start justify-center bg-muted/30 p-4 py-8">
            <div className="w-full max-w-[900px] space-y-6">

                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-3 mb-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white shadow-xl">
                            <span className="text-2xl font-extrabold">S</span>
                        </div>
                        <span className="text-3xl font-extrabold tracking-tight">Social</span>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-extrabold tracking-tight">Authentication & Authorization Guide</h1>
                        <p className="text-muted-foreground max-w-lg">
                            Learn how the platform security works, get test credentials, and test the full auth flow.
                        </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button asChild size="sm" variant="outline" className="font-bold">
                            <Link href="/login"><LogIn size={14} className="mr-2" /> Login</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="font-bold">
                            <Link href="/signup"><Users size={14} className="mr-2" /> Sign Up</Link>
                        </Button>
                    </div>
                </div>

                {/* ============================================================ */}
                {/* Section 1: Architecture Overview                              */}
                {/* ============================================================ */}
                <Section title="Architecture Overview" icon={Server} defaultOpen={true}>
                    <p className="text-sm text-muted-foreground">
                        The platform uses a modern, decoupled architecture with <strong>Supabase Auth</strong> for identity management and <strong>FastAPI</strong> for business logic and RBAC enforcement.
                    </p>

                    {/* Visual Flow */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 py-4">
                        {[
                            { label: 'Next.js Frontend', sub: 'Supabase JS Client', icon: Globe, color: 'from-blue-500 to-indigo-600' },
                            { label: 'Supabase Auth', sub: 'OAuth / Email+Pass', icon: Lock, color: 'from-emerald-500 to-green-600' },
                            { label: 'JWT Token', sub: 'HS256 signed', icon: Key, color: 'from-amber-500 to-orange-600' },
                            { label: 'FastAPI Backend', sub: 'Middleware validates', icon: Server, color: 'from-purple-500 to-violet-600' },
                            { label: 'RBAC Check', sub: 'Role → Permissions', icon: Shield, color: 'from-red-500 to-rose-600' },
                        ].map((item, i) => (
                            <div key={item.label} className="flex flex-col items-center text-center">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-lg mb-2`}>
                                    <item.icon size={20} />
                                </div>
                                <span className="text-xs font-bold">{item.label}</span>
                                <span className="text-[10px] text-muted-foreground">{item.sub}</span>
                                {i < 4 && (
                                    <ArrowRight size={14} className="text-muted-foreground mt-2 rotate-90 sm:rotate-0 sm:absolute sm:hidden" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-xs">
                        <div className="font-bold text-sm">Key Components</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div><code className="text-primary">@supabase/ssr</code> — Browser auth client (cookie-based sessions)</div>
                            <div><code className="text-primary">python-jose</code> — JWT decoding & validation in FastAPI</div>
                            <div><code className="text-primary">AuthProvider</code> — React context wrapping the entire app</div>
                            <div><code className="text-primary">require_role()</code> — FastAPI dependency for role-gating endpoints</div>
                        </div>
                    </div>
                </Section>

                {/* ============================================================ */}
                {/* Section 2: How Authentication Works                           */}
                {/* ============================================================ */}
                <Section title="How Authentication Works" icon={Key} defaultOpen={true}>
                    <FlowStep
                        step={1}
                        title="User Signs Up or Logs In"
                        desc="Users register via email+password or OAuth (Google). Supabase Auth handles identity verification, email confirmation, and password hashing. On login, Supabase returns an access_token (JWT) and refresh_token."
                        icon={Users}
                    />
                    <FlowStep
                        step={2}
                        title="Auto Profile Creation"
                        desc="A Supabase database trigger automatically creates a row in the 'profiles' table when a new user signs up. The profile is initialized with role='user' and account_status='active'."
                        icon={Database}
                    />
                    <FlowStep
                        step={3}
                        title="JWT Sent to Backend"
                        desc="Every API request from the frontend includes the JWT in the Authorization header (Bearer token). The AuthProvider React context handles session management and auto-refresh."
                        icon={Key}
                    />
                    <FlowStep
                        step={4}
                        title="Backend Validates JWT"
                        desc="FastAPI middleware (get_current_user) decodes the JWT using the Supabase JWT secret, verifies the signature and expiration, then fetches the user's profile from the 'profiles' table."
                        icon={Shield}
                    />
                    <FlowStep
                        step={5}
                        title="RBAC Enforcement"
                        desc="Protected endpoints use require_role('admin', 'moderator', etc.) to check the user's profile.role. If the role doesn't match, a 403 Forbidden is returned. Account status is also checked — suspended users are blocked."
                        icon={Lock}
                    />
                </Section>

                {/* ============================================================ */}
                {/* Section 3: Roles & Permissions                               */}
                {/* ============================================================ */}
                <Section title="Roles & Permissions Matrix" icon={Users}>
                    <p className="text-sm text-muted-foreground mb-4">
                        The platform's permissions are dynamically loaded from the database. Each role has specific access to various resources below.
                    </p>

                    {isLoadingPerms ? (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(permissionsData).map(([role, perms]) => {
                                // Group by resource
                                const grouped: Record<string, string[]> = {};
                                perms.forEach(p => {
                                    if (!grouped[p.resource]) grouped[p.resource] = [];
                                    grouped[p.resource].push(p.action);
                                });

                                return (
                                    <div key={role} className="border border-primary/10 rounded-lg p-4 bg-muted/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="outline" className="text-xs font-bold uppercase">{role.replace('_', ' ')}</Badge>
                                            <span className="text-xs text-muted-foreground">{perms.length} permissions</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {Object.entries(grouped).map(([resource, actions]) => (
                                                <div key={resource} className="bg-background rounded p-2 text-xs border shadow-sm">
                                                    <div className="font-bold mb-1 text-primary">{resource}</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {actions.map(action => (
                                                            <Badge key={action} variant="secondary" className="text-[10px] leading-tight px-1.5 py-0">
                                                                {action}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Section>

                {/* ============================================================ */}
                {/* Section 4: Test Credentials (always open)                     */}
                {/* ============================================================ */}
                <Section title="Test Credentials" icon={LogIn} defaultOpen={true}>
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2 mb-2">
                        <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            <strong>Development only.</strong> These accounts are pre-seeded for testing. Click any "Login as…" button to jump to login pre-filled with the credentials.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TEST_USERS.map((user) => (
                            <CredentialCard key={user.role} user={user} />
                        ))}
                    </div>

                    <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground mt-2">
                        <strong>Regular User:</strong> Sign up normally via the{' '}
                        <Link href="/signup" className="text-primary font-bold hover:underline">Sign Up page</Link>{' '}
                        — new accounts are created with <code>role=&quot;user&quot;</code> by default.
                    </div>
                </Section>

                {/* ============================================================ */}
                {/* Section 5: Testing Guide                                     */}
                {/* ============================================================ */}
                <Section title="Full Testing Guide" icon={BookOpen}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                                Test User Registration
                            </h4>
                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-8">
                                <li>Go to <Link href="/signup" className="text-primary font-bold hover:underline">/signup</Link></li>
                                <li>Enter email, username, password, and date of birth</li>
                                <li>Click "Sign Up" — check email for confirmation link</li>
                                <li>Confirm email — you'll be redirected to the home feed</li>
                                <li>Verify your profile appears at <code>/profile</code> with role <code>user</code></li>
                            </ol>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                                Test Login (Email + Password)
                            </h4>
                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-8">
                                <li>Go to <Link href="/login" className="text-primary font-bold hover:underline">/login</Link></li>
                                <li>Enter any test credentials from above</li>
                                <li>Click "Sign In" — you should land on the home feed</li>
                                <li>The sidebar should show navigation items based on your role</li>
                            </ol>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                                Test Role-Based Access Control
                            </h4>
                            <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                                <p>Login as different roles and verify access:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="bg-muted/40 rounded-lg p-3">
                                        <div className="font-bold text-foreground text-xs mb-1">As Admin:</div>
                                        <ul className="space-y-0.5 text-xs">
                                            <li>✅ Access <code>/admin</code> — full user management</li>
                                            <li>✅ Access <code>/moderation</code> — review flagged content</li>
                                            <li>✅ Access <code>/compliance</code> — audit logs</li>
                                        </ul>
                                    </div>
                                    <div className="bg-muted/40 rounded-lg p-3">
                                        <div className="font-bold text-foreground text-xs mb-1">As Regular User:</div>
                                        <ul className="space-y-0.5 text-xs">
                                            <li>❌ <code>/admin</code> — API returns 403 Forbidden</li>
                                            <li>❌ <code>/moderation</code> — no access</li>
                                            <li>✅ Home feed, profile, create posts</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                                Test Admin Actions
                            </h4>
                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-8">
                                <li>Login as <strong>admin@social-test.com</strong></li>
                                <li>Go to <code>/admin</code> → User Management</li>
                                <li>Change a user's role → verify it updates in real-time</li>
                                <li>Suspend a user → login as that user → verify 403 on all API calls</li>
                                <li>Reinstate the user → verify access is restored</li>
                            </ol>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">5</span>
                                Test OAuth Login (Google)
                            </h4>
                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-8">
                                <li>Click "Google" on the login page</li>
                                <li>Complete the Google consent flow</li>
                                <li>You'll be redirected back via <code>/auth/callback</code></li>
                                <li>A profile is auto-created with <code>role=user</code></li>
                            </ol>
                        </div>
                    </div>
                </Section>

                {/* ============================================================ */}
                {/* Section 6: API Endpoints                                     */}
                {/* ============================================================ */}
                <Section title="API Endpoints Reference" icon={Database}>
                    <p className="text-sm text-muted-foreground mb-2">
                        Base URL: <code className="text-primary">http://localhost:8000</code>. All endpoints require a valid JWT in the <code>Authorization: Bearer</code> header unless noted.
                    </p>

                    <div className="space-y-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2 pb-1">Auth Endpoints</div>
                        <ApiRow method="GET" path="/api/auth/me" desc="Get current user's profile" roles={['any authenticated']} />
                        <ApiRow method="PUT" path="/api/auth/me" desc="Update own profile (display_name, bio, avatar)" roles={['any authenticated']} />
                        <ApiRow method="GET" path="/api/auth/me/permissions" desc="Get current user's role permissions" roles={['any authenticated']} />

                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-4 pb-1">Admin Endpoints</div>
                        <ApiRow method="GET" path="/api/admin/users" desc="List all users with pagination" roles={['admin']} />
                        <ApiRow method="PUT" path="/api/admin/users/:id/role" desc="Change a user's role" roles={['admin']} />
                        <ApiRow method="POST" path="/api/admin/users/:id/suspend" desc="Suspend a user account" roles={['admin', 'senior_mod']} />
                        <ApiRow method="POST" path="/api/admin/users/:id/reinstate" desc="Reinstate a suspended user" roles={['admin']} />

                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-4 pb-1">System</div>
                        <ApiRow method="GET" path="/api/health" desc="Health check (no auth required)" roles={['public']} />
                    </div>
                </Section>

                {/* ============================================================ */}
                {/* Section 7: Account Suspension Lifecycle                       */}
                {/* ============================================================ */}
                <Section title="Account Suspension Lifecycle" icon={AlertTriangle}>
                    <p className="text-sm text-muted-foreground mb-3">
                        The platform implements a complete account governance workflow:
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        {['ACTIVE', '→', 'WARNING', '→', 'TEMP_SUSPENDED', '→', 'PERMANENTLY_BANNED', '→', 'APPEAL', '→', 'REVIEW', '→'].map((s, i) =>
                            s === '→' ? (
                                <ArrowRight key={i} size={12} className="text-muted-foreground" />
                            ) : (
                                <Badge key={i} variant="outline" className="text-[10px] font-bold">{s}</Badge>
                            )
                        )}
                        <Badge variant="outline" className="text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border-emerald-500/30">REINSTATED</Badge>
                        <span className="text-muted-foreground">/</span>
                        <Badge variant="outline" className="text-[10px] font-bold bg-red-500/15 text-red-600 border-red-500/30">CONFIRMED_BAN</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div className="bg-muted/40 rounded-lg p-3 text-xs">
                            <div className="font-bold mb-1">Suspension (Admin / Sr. Moderator)</div>
                            <div className="text-muted-foreground">Can set temporary (N days) or permanent bans with a reason. Suspended users get 403 on all authenticated endpoints.</div>
                        </div>
                        <div className="bg-muted/40 rounded-lg p-3 text-xs">
                            <div className="font-bold mb-1">Reinstatement (Admin only)</div>
                            <div className="text-muted-foreground">Restores account_status to "active", clears suspension_reason and expiry. The user can immediately log in and access the platform.</div>
                        </div>
                    </div>
                </Section>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground pt-4 pb-8">
                    <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    <Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                </div>
            </div>
        </div>
    );
}
