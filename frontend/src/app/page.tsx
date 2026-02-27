'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Bookmark, Share2, MoreHorizontal, Flag, UserX } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

interface Post {
  id: string;
  author: { name: string; username: string; initials: string; isVerified: boolean };
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  isBookmarked: boolean;
  poll?: { question: string; options: { label: string; votes: number }[]; totalVotes: number };
}

const demoPosts: Post[] = [
  {
    id: '1',
    author: { name: 'Sarah Chen', username: 'sarah_designs', initials: 'SC', isVerified: true },
    content: 'Just shipped the new design system for our platform! 🎨 Featuring dark mode, glassmorphism cards, and Instagram-inspired gradients. What do you think?',
    timeAgo: '2h', likes: 234, comments: 45, reposts: 12, isLiked: false, isBookmarked: false,
  },
  {
    id: '2',
    author: { name: 'Marcus Johnson', username: 'dev_marcus', initials: 'MJ', isVerified: false },
    content: 'Hot take 🔥 TypeScript is not optional anymore. If your team isn\'t using it, you\'re paying for it in bugs. Here\'s why...',
    timeAgo: '4h', likes: 567, comments: 89, reposts: 34, isLiked: true, isBookmarked: true,
    poll: {
      question: 'Do you agree?',
      options: [
        { label: 'Strongly agree', votes: 156 },
        { label: 'Somewhat agree', votes: 89 },
        { label: 'Disagree', votes: 34 },
        { label: 'No opinion', votes: 12 },
      ],
      totalVotes: 291,
    },
  },
  {
    id: '3',
    author: { name: 'Luna Rodriguez', username: 'art_by_luna', initials: 'LR', isVerified: true },
    content: 'Built a content moderation system powered by AI risk scoring ✨ It analyzes posts in real-time and assigns toxicity scores. The future of safe online spaces is here!',
    timeAgo: '6h', likes: 892, comments: 134, reposts: 67, isLiked: false, isBookmarked: false,
  },
];

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{post.author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm">{post.author.name}</span>
                {post.author.isVerified && (
                  <Badge className="bg-primary/20 text-primary px-1.5 py-0 text-[10px]">✓</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">@{post.author.username} · {post.timeAgo}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Flag className="mr-2 h-4 w-4" /> Report Post</DropdownMenuItem>
              <DropdownMenuItem><UserX className="mr-2 h-4 w-4" /> Mute User</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm leading-relaxed">{post.content}</p>

        {/* Poll */}
        {post.poll && (
          <div className="mt-4 space-y-2 p-3 rounded-lg bg-muted/50 border">
            <p className="text-sm font-semibold">{post.poll.question}</p>
            {post.poll.options.map((opt) => {
              const pct = ((opt.votes / post.poll!.totalVotes) * 100).toFixed(0);
              return (
                <div key={opt.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{opt.label}</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <Progress value={Number(pct)} className="h-1.5" />
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">{post.poll.totalVotes} votes</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1 pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className={`gap-1.5 ${liked ? 'text-red-500' : 'text-muted-foreground'}`} onClick={handleLike}>
                  <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
                  <span className="text-xs">{likeCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Like</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Comment</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <Repeat2 className="h-4 w-4" />
                  <span className="text-xs">{post.reposts}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Repost</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${bookmarked ? 'text-primary' : 'text-muted-foreground'}`} onClick={() => setBookmarked(!bookmarked)}>
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-primary' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bookmark</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Feed Tabs */}
      <Tabs defaultValue="foryou">
        <TabsList className="w-full">
          <TabsTrigger value="foryou" className="flex-1">For You</TabsTrigger>
          <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
          <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {demoPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
