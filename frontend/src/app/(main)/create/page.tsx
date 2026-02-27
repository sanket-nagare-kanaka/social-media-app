'use client';

import { useState } from 'react';
import { ImageIcon, Film, BarChart2, MessageSquare, Calendar, X, Bold, Italic, Link2, Smile, Hash, Image as ImageI } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type PostType = 'text' | 'image' | 'video' | 'poll' | 'thread';

export default function CreatePostPage() {
    const [postType, setPostType] = useState<PostType>('text');
    const [content, setContent] = useState('');
    const [community, setCommunity] = useState('');
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [threadPosts, setThreadPosts] = useState(['']);

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

    return (
        <div className="flex flex-col gap-6 mx-auto w-full max-w-3xl">
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
                        onClick={() => setPostType(pt.type)}
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
                            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/20 transition-colors hover:bg-muted/40 cursor-pointer">
                                <ImageI className="h-10 w-10 text-muted-foreground mb-4" />
                                <p className="font-semibold mb-1">Drag and drop or <span className="text-primary hover:underline">browse files</span></p>
                                <p className="text-xs text-muted-foreground">
                                    {postType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV up to 100MB'}
                                </p>
                            </div>
                        )}

                        {/* Poll Options */}
                        {postType === 'poll' && (
                            <div className="space-y-4 bg-muted/20 p-4 rounded-xl border">
                                <Label className="text-base font-semibold">Poll Options</Label>
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
                    <Button variant={showSchedule ? 'secondary' : 'ghost'} onClick={() => setShowSchedule(!showSchedule)} className="text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" /> {showSchedule ? 'Cancel Schedule' : 'Schedule'}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline">Save Draft</Button>
                        <Button className="font-bold px-6">{showSchedule && scheduleDate ? 'Schedule Post' : 'Publish'}</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
