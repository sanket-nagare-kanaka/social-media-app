'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageIcon, Film, BarChart2, MessageSquare, Calendar, X, Bold, Italic, Link2, Smile, Hash, Image as ImageI, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import { useRef } from 'react';

type PostType = 'text' | 'image' | 'video' | 'poll' | 'thread';

export default function CreatePostPage() {
    const router = useRouter();
    const { session } = useAuth();
    const [postType, setPostType] = useState<PostType>('text');
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [community, setCommunity] = useState('');
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [threadPosts, setThreadPosts] = useState(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const addPollOption = () => setPollOptions([...pollOptions, '']);
    const removePollOption = (index: number) => setPollOptions(pollOptions.filter((_, i) => i !== index));
    const addThreadPost = () => setThreadPosts([...threadPosts, '']);

    const postTypes = [
        { type: 'text', icon: <MessageSquare className="h-5 w-5" />, label: 'Text' },
        { type: 'image', icon: <ImageIcon className="h-5 w-5" />, label: 'Image' },
        { type: 'video', icon: <Film className="h-5 w-5" />, label: 'Video' },
        { type: 'poll', icon: <BarChart2 className="h-5 w-5" />, label: 'Poll' },
        { type: 'thread', icon: <Hash className="h-5 w-5" />, label: 'Thread' },
    ] as const;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const removeMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const uploadMedia = async (): Promise<string | null> => {
        if (!mediaFile) return null;

        const supabase = createClient();
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${session?.user?.id || 'public'}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('media')
            .upload(filePath, mediaFile);

        if (uploadError) {
            throw new Error(`Failed to upload media: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    };

    const submitPost = async (status: 'draft' | 'published' | 'scheduled') => {
        if (!session?.access_token) {
            setError('You must be logged in to create a post');
            return;
        }

        // Validation
        if (!content.trim() && postType === 'text') {
            setError('Post content is required');
            return;
        }
        if ((postType === 'image' || postType === 'video') && !mediaFile && !content.trim()) {
            setError('Please select a media file or add a URL/caption');
            return;
        }
        if (postType === 'poll') {
            if (!pollQuestion.trim()) {
                setError('Poll question is required');
                return;
            }
            const validOptions = pollOptions.filter(o => o.trim());
            if (validOptions.length < 2) {
                setError('At least 2 poll options are required');
                return;
            }
        }
        if (status === 'scheduled' && !scheduleDate) {
            setError('Please select a date and time for scheduling');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Only upload the file to Supabase if the user clicks "Publish" or "Schedule"
            // As per the requirement: "it should only update when the user clicks on publish till that we should only see the preview"
            let finalContent = content.trim() || null;
            let finalMediaUrl: string | null = null;
            if (mediaFile && (status === 'published' || status === 'scheduled')) {
                const mediaUrl = await uploadMedia();
                if (mediaUrl) {
                    finalMediaUrl = mediaUrl;
                }
            }

            const body: any = {
                type: postType,
                content: finalContent,
                media_url: finalMediaUrl,
                status,
                community_id: community && community !== 'public' ? community : null,
            };

            if (status === 'scheduled' && scheduleDate) {
                body.scheduled_at = new Date(scheduleDate).toISOString();
            }

            if (postType === 'poll') {
                body.poll_question = pollQuestion;
                body.poll_options = pollOptions
                    .filter(o => o.trim())
                    .map(label => ({ label }));
            }

            if (postType === 'thread') {
                body.thread_posts = threadPosts.filter(t => t.trim());
            }

            const res = await fetch(`${apiUrl}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: 'Failed to create post' }));
                throw new Error(err.detail);
            }

            if (status === 'draft') {
                setSuccess('Draft saved!');
                setTimeout(() => setSuccess(null), 3000);
            } else if (status === 'scheduled') {
                setSuccess('Post scheduled!');
                setTimeout(() => {
                    setSuccess(null);
                    router.push('/');
                }, 1500);
            } else {
                setSuccess('Post published!');
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 mx-auto w-full max-w-3xl">
            {/* Success Toast */}
            {success && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium text-sm">{success}</span>
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
                <h1 className="text-2xl font-extrabold tracking-tight">Create Post</h1>
                <p className="text-sm text-muted-foreground mt-1">Share your thoughts, media, or start a discussion</p>
            </div>

            {/* Post Type Selector */}
            <div className="flex bg-muted/50 p-1.5 rounded-lg border overflow-x-auto">
                {postTypes.map((pt) => (
                    <button
                        key={pt.type}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all flex-1 justify-center whitespace-nowrap
                        ${postType === pt.type ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                        onClick={() => {
                            setPostType(pt.type);
                            // Clear media if switching away from media types
                            if (pt.type !== 'image' && pt.type !== 'video') removeMedia();
                        }}
                    >
                        {pt.icon}
                        <span>{pt.label}</span>
                    </button>
                ))}
            </div>

            {/* Editor Card */}
            <Card>
                {/* Toolbar */}
                <CardHeader className="p-3 border-b bg-muted/20">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Bold className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Italic className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Link2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Hash className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Smile className="h-4 w-4" /></Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Text Editor */}
                    <Textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[150px] border-0 focus-visible:ring-0 p-4 resize-none text-base"
                    />

                    <div className="px-4 pb-4 space-y-6">
                        {/* Media Upload */}
                        {(postType === 'image' || postType === 'video') && (
                            <div
                                className="border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center text-center bg-muted/20 transition-colors hover:bg-muted/40 cursor-pointer relative"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => !mediaPreview && fileInputRef.current?.click()}
                                style={{ minHeight: mediaPreview ? 'auto' : '200px' }}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept={postType === 'image' ? "image/*" : "video/*"}
                                    onChange={handleFileSelect}
                                />

                                {mediaPreview ? (
                                    <div className="relative w-full max-h-[400px]">
                                        {postType === 'image' ? (
                                            <img src={mediaPreview} alt="Preview" className="w-full h-auto object-contain max-h-[400px]" />
                                        ) : (
                                            <video src={mediaPreview} controls className="w-full h-auto max-h-[400px]" />
                                        )}
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-80 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeMedia();
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <ImageI className="h-10 w-10 text-muted-foreground mb-4 mx-auto" />
                                        <p className="font-semibold mb-1">Drag and drop or <span className="text-primary hover:underline">browse files</span></p>
                                        <p className="text-xs text-muted-foreground">
                                            {postType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV up to 100MB'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Poll Options */}
                        {postType === 'poll' && (
                            <div className="space-y-4 bg-muted/20 p-4 rounded-xl border">
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">Poll Question</Label>
                                    <Input
                                        placeholder="Ask a question..."
                                        value={pollQuestion}
                                        onChange={(e) => setPollQuestion(e.target.value)}
                                    />
                                </div>
                                <Label className="text-sm font-semibold">Options</Label>
                                <div className="space-y-3">
                                    {pollOptions.map((opt, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                placeholder={`Option ${index + 1}`}
                                                value={opt}
                                                onChange={(e) => {
                                                    const updated = [...pollOptions];
                                                    updated[index] = e.target.value;
                                                    setPollOptions(updated);
                                                }}
                                            />
                                            {pollOptions.length > 2 && (
                                                <Button variant="ghost" size="icon" onClick={() => removePollOption(index)}>
                                                    <X className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {pollOptions.length < 6 && (
                                        <Button variant="outline" size="sm" onClick={addPollOption} className="w-full mt-2 border-dashed">
                                            + Add Option
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Thread Builder */}
                        {postType === 'thread' && (
                            <div className="space-y-4">
                                {threadPosts.map((post, index) => (
                                    <div key={index} className="relative pl-8">
                                        <div className="absolute left-3 top-4 bottom-0 flex flex-col items-center translate-x-[-50%]">
                                            <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-background z-10" />
                                            {index < threadPosts.length - 1 && <div className="w-0.5 bg-border h-full flex-1 -mt-1" />}
                                        </div>
                                        <Textarea
                                            placeholder={index === 0 ? "Start your thread..." : "Continue the thread..."}
                                            value={post}
                                            onChange={(e) => {
                                                const updated = [...threadPosts];
                                                updated[index] = e.target.value;
                                                setThreadPosts(updated);
                                            }}
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                ))}
                                <div className="pl-8">
                                    <Button variant="ghost" size="sm" onClick={addThreadPost} className="text-primary hover:text-primary hover:bg-primary/10">
                                        + Add to thread
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Community Selector */}
                        <div className="pt-4 border-t space-y-2">
                            <Label>Post to Community</Label>
                            <Select value={community} onValueChange={setCommunity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="No community (public profile)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">No community (public profile)</SelectItem>
                                    <SelectItem value="tech">Technology</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="design">Design</SelectItem>
                                    <SelectItem value="health">Health & Wellness</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Schedule */}
                        {showSchedule && (
                            <div className="pt-4 border-t space-y-2 bg-muted/20 p-4 rounded-lg">
                                <Label>Schedule Post</Label>
                                <Input
                                    type="datetime-local"
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Actions */}
                <CardFooter className="p-4 border-t bg-muted/20 flex items-center justify-between">
                    <Button
                        variant={showSchedule ? 'secondary' : 'ghost'}
                        onClick={() => setShowSchedule(!showSchedule)}
                        className="text-muted-foreground"
                        disabled={isSubmitting}
                    >
                        <Calendar className="h-4 w-4 mr-2" /> {showSchedule ? 'Cancel Schedule' : 'Schedule'}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => submitPost('draft')} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Save Draft
                        </Button>
                        <Button
                            className="font-bold px-6"
                            onClick={() => submitPost(showSchedule && scheduleDate ? 'scheduled' : 'published')}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            {showSchedule && scheduleDate ? 'Schedule Post' : 'Publish'}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
