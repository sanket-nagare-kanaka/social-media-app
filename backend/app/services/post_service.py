"""Post service — business logic for content publishing."""

from uuid import UUID
from typing import Optional
from datetime import datetime, timezone

from app.utils.supabase_client import get_supabase_client
from app.models.post import (
    PostCreate, PostUpdate, PostResponse, AuthorResponse,
    PollResponse, PollOptionResponse, FeedResponse,
)


class PostService:
    """Service for post CRUD, feed, drafts, polls, and threads."""

    def __init__(self):
        self.supabase = get_supabase_client()

    # ── Helpers ──────────────────────────────────────────────────

    def _build_author(self, profile: dict) -> AuthorResponse:
        return AuthorResponse(
            id=profile["id"],
            username=profile["username"],
            display_name=profile.get("display_name"),
            avatar_url=profile.get("avatar_url"),
            is_verified=profile.get("is_verified", False),
        )

    def _build_poll(self, post_id: str, user_id: Optional[str] = None) -> Optional[PollResponse]:
        poll_result = self.supabase.table("polls").select("*").eq("post_id", post_id).execute()
        if not poll_result.data:
            return None
        poll = poll_result.data[0]

        options_result = (
            self.supabase.table("poll_options")
            .select("*")
            .eq("poll_id", poll["id"])
            .order("position")
            .execute()
        )
        options = options_result.data or []

        # Get vote counts per option
        option_responses = []
        total_votes = 0
        user_voted_option_id = None

        for opt in options:
            votes_result = (
                self.supabase.table("poll_votes")
                .select("*", count="exact")
                .eq("poll_option_id", opt["id"])
                .execute()
            )
            vote_count = votes_result.count or 0
            total_votes += vote_count

            # Check if the current user voted for this option
            if user_id:
                user_vote = (
                    self.supabase.table("poll_votes")
                    .select("id")
                    .eq("poll_option_id", opt["id"])
                    .eq("user_id", user_id)
                    .execute()
                )
                if user_vote.data:
                    user_voted_option_id = UUID(opt["id"])

            option_responses.append(PollOptionResponse(
                id=opt["id"],
                label=opt["label"],
                position=opt["position"],
                votes=vote_count,
            ))

        return PollResponse(
            id=poll["id"],
            question=poll["question"],
            options=option_responses,
            total_votes=total_votes,
            expires_at=poll.get("expires_at"),
            user_voted_option_id=user_voted_option_id,
        )

    def _build_post_response(self, post: dict, user_id: Optional[str] = None) -> PostResponse:
        # Fetch author profile
        author_result = self.supabase.table("profiles").select("*").eq("id", post["author_id"]).execute()
        author = self._build_author(author_result.data[0]) if author_result.data else AuthorResponse(
            id=post["author_id"], username="unknown"
        )

        # Build poll if post type is poll
        poll = None
        if post["type"] == "poll":
            poll = self._build_poll(post["id"], user_id)

        # Fetch thread children
        thread_children = None
        if post["type"] == "thread":
            children_result = (
                self.supabase.table("posts")
                .select("*")
                .eq("parent_id", post["id"])
                .eq("status", "published")
                .order("created_at")
                .execute()
            )
            if children_result.data:
                thread_children = [
                    self._build_post_response(c, user_id) for c in children_result.data
                ]

        return PostResponse(
            id=post["id"],
            author=author,
            type=post["type"],
            content=post.get("content"),
            media_url=post.get("media_url"),
            status=post["status"],
            community_id=post.get("community_id"),
            parent_id=post.get("parent_id"),
            scheduled_at=post.get("scheduled_at"),
            published_at=post.get("published_at"),
            created_at=post.get("created_at"),
            updated_at=post.get("updated_at"),
            poll=poll,
            thread_children=thread_children,
        )

    # ── Rate Limiting ────────────────────────────────────────────

    async def check_rate_limit(self, user_id: UUID) -> Optional[str]:
        """Check if user exceeds posting rate limits. Returns error message or None."""
        profile = self.supabase.table("profiles").select("created_at").eq("id", str(user_id)).execute()
        if not profile.data:
            return "User not found"

        created_at = datetime.fromisoformat(profile.data[0]["created_at"].replace("Z", "+00:00"))
        account_age = (datetime.now(timezone.utc) - created_at).days

        # Count posts created today
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        today_posts = (
            self.supabase.table("posts")
            .select("id", count="exact")
            .eq("author_id", str(user_id))
            .gte("created_at", today_start)
            .neq("status", "draft")
            .execute()
        )
        post_count = today_posts.count or 0

        # New users (< 7 days): max 3 posts/day
        if account_age < 7 and post_count >= 3:
            return "New accounts (less than 7 days old) are limited to 3 posts per day"

        # Regular users: max 20 posts/day
        if post_count >= 20:
            return "Daily post limit reached (20 posts per day)"

        return None

    # ── CRUD Operations ──────────────────────────────────────────

    async def create_post(self, user_id: UUID, data: PostCreate) -> PostResponse:
        """Create a new post (text, image, video, poll, or thread)."""
        # Rate limit check for non-draft posts
        if data.status != "draft":
            rate_error = await self.check_rate_limit(user_id)
            if rate_error:
                raise ValueError(rate_error)

        now = datetime.now(timezone.utc).isoformat()
        post_data = {
            "author_id": str(user_id),
            "type": data.type,
            "content": data.content,
            "media_url": data.media_url,
            "status": data.status,
            "community_id": data.community_id,
            "parent_id": str(data.parent_id) if data.parent_id else None,
            "scheduled_at": data.scheduled_at.isoformat() if data.scheduled_at else None,
            "published_at": now if data.status == "published" else None,
        }

        result = self.supabase.table("posts").insert(post_data).execute()
        if not result.data:
            raise ValueError("Failed to create post")

        post = result.data[0]

        # Create poll if type is poll
        if data.type == "poll" and data.poll_question and data.poll_options:
            poll_result = self.supabase.table("polls").insert({
                "post_id": post["id"],
                "question": data.poll_question,
            }).execute()

            if poll_result.data:
                poll_id = poll_result.data[0]["id"]
                for i, option in enumerate(data.poll_options):
                    self.supabase.table("poll_options").insert({
                        "poll_id": poll_id,
                        "label": option.label,
                        "position": i,
                    }).execute()

        # Create thread children if type is thread
        if data.type == "thread" and data.thread_posts:
            for thread_content in data.thread_posts:
                if thread_content.strip():
                    self.supabase.table("posts").insert({
                        "author_id": str(user_id),
                        "type": "text",
                        "content": thread_content,
                        "status": data.status,
                        "parent_id": post["id"],
                        "published_at": now if data.status == "published" else None,
                    }).execute()

        return self._build_post_response(post, str(user_id))

    async def get_post(self, post_id: UUID, user_id: Optional[UUID] = None) -> Optional[PostResponse]:
        """Get a single post by ID."""
        result = self.supabase.table("posts").select("*").eq("id", str(post_id)).execute()
        if not result.data:
            return None
        return self._build_post_response(result.data[0], str(user_id) if user_id else None)

    async def update_post(self, post_id: UUID, user_id: UUID, data: PostUpdate, is_admin: bool = False) -> PostResponse:
        """Update a post (content, status). Only author or admin can update."""
        # Verify ownership or admin
        post_result = self.supabase.table("posts").select("*").eq("id", str(post_id)).execute()
        if not post_result.data:
            raise ValueError("Post not found")

        post = post_result.data[0]
        if post["author_id"] != str(user_id) and not is_admin:
            raise PermissionError("Not authorized to update this post")

        update_data = data.model_dump(exclude_none=True)
        if not update_data:
            return self._build_post_response(post, str(user_id))

        # If publishing, set published_at
        if update_data.get("status") == "published" and post["status"] in ("draft", "scheduled"):
            update_data["published_at"] = datetime.now(timezone.utc).isoformat()

            # Rate limit check
            rate_error = await self.check_rate_limit(user_id)
            if rate_error:
                raise ValueError(rate_error)

        if "scheduled_at" in update_data and update_data["scheduled_at"]:
            update_data["scheduled_at"] = update_data["scheduled_at"].isoformat()

        result = self.supabase.table("posts").update(update_data).eq("id", str(post_id)).execute()
        if not result.data:
            raise ValueError("Failed to update post")

        return self._build_post_response(result.data[0], str(user_id))

    async def delete_post(self, post_id: UUID, user_id: UUID, is_admin: bool = False) -> dict:
        """Soft-delete a post by setting status to 'removed'."""
        post_result = self.supabase.table("posts").select("*").eq("id", str(post_id)).execute()
        if not post_result.data:
            raise ValueError("Post not found")

        post = post_result.data[0]
        if post["author_id"] != str(user_id) and not is_admin:
            raise PermissionError("Not authorized to delete this post")

        self.supabase.table("posts").update({"status": "removed"}).eq("id", str(post_id)).execute()
        return {"message": "Post removed"}

    # ── Feed & Queries ───────────────────────────────────────────

    async def get_feed(self, page: int = 1, per_page: int = 20, user_id: Optional[UUID] = None) -> FeedResponse:
        """Get paginated feed of published posts (no thread children)."""
        offset = (page - 1) * per_page
        result = (
            self.supabase.table("posts")
            .select("*", count="exact")
            .in_("status", ["published", "approved"])
            .is_("parent_id", "null")
            .order("created_at", desc=True)
            .range(offset, offset + per_page - 1)
            .execute()
        )

        posts = [
            self._build_post_response(p, str(user_id) if user_id else None)
            for p in (result.data or [])
        ]

        total = result.count or 0
        return FeedResponse(
            posts=posts,
            total=total,
            page=page,
            per_page=per_page,
            has_more=(offset + per_page) < total,
        )

    async def get_user_posts(self, target_user_id: UUID, page: int = 1, per_page: int = 20) -> FeedResponse:
        """Get a user's published posts."""
        offset = (page - 1) * per_page
        result = (
            self.supabase.table("posts")
            .select("*", count="exact")
            .eq("author_id", str(target_user_id))
            .in_("status", ["published", "approved"])
            .is_("parent_id", "null")
            .order("created_at", desc=True)
            .range(offset, offset + per_page - 1)
            .execute()
        )

        posts = [self._build_post_response(p, str(target_user_id)) for p in (result.data or [])]
        total = result.count or 0
        return FeedResponse(posts=posts, total=total, page=page, per_page=per_page, has_more=(offset + per_page) < total)

    async def get_drafts(self, user_id: UUID) -> list[PostResponse]:
        """Get all drafts for a user."""
        result = (
            self.supabase.table("posts")
            .select("*")
            .eq("author_id", str(user_id))
            .eq("status", "draft")
            .is_("parent_id", "null")
            .order("updated_at", desc=True)
            .execute()
        )
        return [self._build_post_response(p, str(user_id)) for p in (result.data or [])]

    async def publish_post(self, post_id: UUID, user_id: UUID) -> PostResponse:
        """Publish a draft or scheduled post."""
        post_result = self.supabase.table("posts").select("*").eq("id", str(post_id)).execute()
        if not post_result.data:
            raise ValueError("Post not found")

        post = post_result.data[0]
        if post["author_id"] != str(user_id):
            raise PermissionError("Not authorized to publish this post")

        if post["status"] not in ("draft", "scheduled"):
            raise ValueError(f"Cannot publish a post with status '{post['status']}'")

        rate_error = await self.check_rate_limit(user_id)
        if rate_error:
            raise ValueError(rate_error)

        now = datetime.now(timezone.utc).isoformat()
        result = (
            self.supabase.table("posts")
            .update({"status": "published", "published_at": now})
            .eq("id", str(post_id))
            .execute()
        )

        # Also publish thread children if any
        self.supabase.table("posts").update(
            {"status": "published", "published_at": now}
        ).eq("parent_id", str(post_id)).eq("status", "draft").execute()

        if not result.data:
            raise ValueError("Failed to publish post")

        return self._build_post_response(result.data[0], str(user_id))

    # ── Poll Voting ──────────────────────────────────────────────

    async def vote_poll(self, post_id: UUID, option_id: UUID, user_id: UUID) -> PollResponse:
        """Cast or change a vote on a poll."""
        # Verify the post is a poll
        post_result = self.supabase.table("posts").select("type").eq("id", str(post_id)).execute()
        if not post_result.data or post_result.data[0]["type"] != "poll":
            raise ValueError("Post is not a poll")

        # Verify the option belongs to this post's poll
        poll_result = self.supabase.table("polls").select("id").eq("post_id", str(post_id)).execute()
        if not poll_result.data:
            raise ValueError("Poll not found")

        poll_id = poll_result.data[0]["id"]
        option_result = (
            self.supabase.table("poll_options")
            .select("id")
            .eq("id", str(option_id))
            .eq("poll_id", poll_id)
            .execute()
        )
        if not option_result.data:
            raise ValueError("Invalid poll option")

        # Remove existing vote for this poll (across all options of this poll)
        all_options = self.supabase.table("poll_options").select("id").eq("poll_id", poll_id).execute()
        for opt in (all_options.data or []):
            self.supabase.table("poll_votes").delete().eq(
                "poll_option_id", opt["id"]
            ).eq("user_id", str(user_id)).execute()

        # Cast new vote
        self.supabase.table("poll_votes").insert({
            "poll_option_id": str(option_id),
            "user_id": str(user_id),
        }).execute()

        poll = self._build_poll(str(post_id), str(user_id))
        if not poll:
            raise ValueError("Failed to retrieve poll after vote")
        return poll


def get_post_service() -> PostService:
    """Dependency injection for PostService."""
    return PostService()
