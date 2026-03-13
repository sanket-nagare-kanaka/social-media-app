'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Repeat2, Bookmark, Share2, MoreHorizontal, Flag, UserX, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth-context';

interface Author {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
}

interface PollOption {
  id: string;
  label: string;
  position: number;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  total_votes: number;
  user_voted_option_id: string | null;
}

interface PostChild {
  id: string;
  content: string | null;
  author: Author;
  created_at: string | null;
}

interface Post {
  id: string;
  author: Author;
  type: string;
  content: string | null;
  media_url?: string | null;
  status: string;
  published_at: string | null;
  created_at: string | null;
  poll: Poll | null;
  thread_children: PostChild[] | null;
}

interface FeedResponse {
  posts: Post[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

function getTimeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

function getInitials(name: string | null, username: string): string {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return username.slice(0, 2).toUpperCase();
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const displayName = post.author.display_name || post.author.username;
  const initials = getInitials(post.author.display_name, post.author.username);
  const timeAgo = getTimeAgo(post.published_at || post.created_at);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm">{displayName}</span>
                {post.author.is_verified && (
                  <Badge className="bg-primary/20 text-primary px-1.5 py-0 text-[10px]">✓</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">@{post.author.username} · {timeAgo}</span>
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
        {post.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>}
        {post.media_url && post.type === 'image' && (
          <div className="mt-2 rounded-xl overflow-hidden border">
            <img src={post.media_url} alt="Post image" className="w-full h-auto max-h-[500px] object-contain" />
          </div>
        )}
        {post.media_url && post.type === 'video' && (
          <div className="mt-2 rounded-xl overflow-hidden border">
            <video src={post.media_url} controls className="w-full h-auto max-h-[500px]" />
          </div>
        )}

        {/* Poll */}
        {post.poll && (
          <div className="mt-4 space-y-2 p-3 rounded-lg bg-muted/50 border">
            <p className="text-sm font-semibold">{post.poll.question}</p>
            {post.poll.options.map((opt) => {
              const pct = post.poll!.total_votes > 0
                ? ((opt.votes / post.poll!.total_votes) * 100).toFixed(0)
                : '0';
              return (
                <div key={opt.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{opt.label}</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <Progress value={Number(pct)} className="h-1.5" />
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">{post.poll.total_votes} votes</p>
          </div>
        )}

        {/* Thread children */}
        {post.thread_children && post.thread_children.length > 0 && (
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-primary/20">
            {post.thread_children.map((child) => (
              <div key={child.id} className="space-y-1">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{child.content}</p>
              </div>
            ))}
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
                  <span className="text-xs">0</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Comment</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <Repeat2 className="h-4 w-4" />
                  <span className="text-xs">0</span>
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
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchFeed = useCallback(async (pageNum: number, append: boolean = false) => {
    if (pageNum === 1) setIsLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/api/posts?page=${pageNum}&per_page=20`);
      if (!res.ok) throw new Error('Failed to load feed');
      const data: FeedResponse = await res.json();
      setPosts(prev => append ? [...prev, ...data.posts] : data.posts);
      setHasMore(data.has_more);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage, true);
  };

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

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm text-center">
          {error}
          <Button variant="ghost" size="sm" className="ml-2" onClick={() => fetchFeed(1)}>Retry</Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl border-muted">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-lg mb-1">No posts yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs">Be the first to share something! Create a post to get started.</p>
        </div>
      )}

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
