"""Pydantic models for user profiles and authentication."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class TokenPayload(BaseModel):
    """Decoded JWT token payload from Supabase."""
    sub: str  # user UUID
    email: Optional[str] = None
    role: Optional[str] = "authenticated"
    aud: Optional[str] = None
    exp: Optional[int] = None
    iat: Optional[int] = None


class UserProfile(BaseModel):
    """Public user profile."""
    id: UUID
    username: str
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "user"
    account_status: str = "active"
    is_verified: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserProfileUpdate(BaseModel):
    """Fields a user can update on their own profile."""
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserRoleUpdate(BaseModel):
    """Admin-only: change a user's role."""
    role: str = Field(..., pattern="^(user|verified_creator|community_moderator|senior_moderator|admin|compliance_officer|analyst)$")


class UserSuspendRequest(BaseModel):
    """Admin-only: suspend a user."""
    reason: str
    duration_days: Optional[int] = None  # None = permanent


class Permission(BaseModel):
    """Single permission entry."""
    id: UUID
    role: str
    resource: str
    action: str


class AuthUser(BaseModel):
    """Authenticated user context injected into requests."""
    id: UUID
    email: Optional[str] = None
    profile: Optional[UserProfile] = None
