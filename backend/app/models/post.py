"""Pydantic models for post creation, updates, and API responses."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


# --- Request Models ---

class PollOptionCreate(BaseModel):
    """A single poll option for creation."""
    label: str = Field(..., min_length=1, max_length=200)


class PostCreate(BaseModel):
    """Request body for creating a post."""
    type: str = Field(default="text", pattern="^(text|image|video|poll|thread)$")
    content: Optional[str] = None
    media_url: Optional[str] = None
    status: str = Field(default="draft", pattern="^(draft|published|scheduled)$")
    community_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    parent_id: Optional[UUID] = None
    # Poll fields (only when type = 'poll')
    poll_question: Optional[str] = None
    poll_options: Optional[list[PollOptionCreate]] = None
    # Thread posts (only when type = 'thread')
    thread_posts: Optional[list[str]] = None


class PostUpdate(BaseModel):
    """Request body for updating a post."""
    content: Optional[str] = None
    media_url: Optional[str] = None
    status: Optional[str] = Field(default=None, pattern="^(draft|published|scheduled|archived)$")
    scheduled_at: Optional[datetime] = None


class PollVoteRequest(BaseModel):
    """Request body for voting on a poll."""
    option_id: UUID


# --- Response Models ---

class AuthorResponse(BaseModel):
    """Author info embedded in post response."""
    id: UUID
    username: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_verified: bool = False


class PollOptionResponse(BaseModel):
    """Poll option with vote count."""
    id: UUID
    label: str
    position: int
    votes: int = 0


class PollResponse(BaseModel):
    """Poll data in a post response."""
    id: UUID
    question: str
    options: list[PollOptionResponse] = []
    total_votes: int = 0
    expires_at: Optional[datetime] = None
    user_voted_option_id: Optional[UUID] = None


class PostResponse(BaseModel):
    """Full post response for API."""
    id: UUID
    author: AuthorResponse
    type: str
    content: Optional[str] = None
    media_url: Optional[str] = None
    status: str
    community_id: Optional[str] = None
    parent_id: Optional[UUID] = None
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    poll: Optional[PollResponse] = None
    thread_children: Optional[list["PostResponse"]] = None


class FeedResponse(BaseModel):
    """Paginated feed response."""
    posts: list[PostResponse]
    total: int
    page: int
    per_page: int
    has_more: bool
