'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        dob: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Signup attempt', formData);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-[420px] space-y-6">

                {/* Logo and Tagline */}
                <div className="flex flex-col items-center text-center space-y-3 mb-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 text-white shadow-xl">
                            <span className="text-2xl font-extrabold">S</span>
                        </div>
                        <span className="text-3xl font-extrabold tracking-tight">Social</span>
                    </Link>
                    <p className="text-muted-foreground">Join the community today.</p>
                </div>

                <Card className="shadow-lg border-primary/10">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>Enter your details below to create your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">@</span>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="bg-muted/50 pl-8"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="bg-muted/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                    className="bg-muted/50"
                                />
                                <p className="text-[10px] text-muted-foreground">Must be at least 13 years old to use this platform.</p>
                            </div>

                            <Button type="submit" className="w-full font-bold shadow-md shadow-primary/20">
                                Sign Up
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground font-semibold">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full bg-muted/50 hover:bg-muted font-bold">
                                Google
                            </Button>
                            <Button variant="outline" className="w-full bg-muted/50 hover:bg-muted font-bold">
                                Apple
                            </Button>
                        </div>

                        <p className="text-xs text-center text-muted-foreground mt-6 px-4">
                            By clicking continue, you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col border-t p-4 pb-6 mt-2">
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
