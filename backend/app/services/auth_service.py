"""Auth service for profile management and RBAC."""

from uuid import UUID
from typing import Optional
from datetime import datetime, timedelta, timezone

from app.utils.supabase_client import get_supabase_client
from app.models.user import UserProfile, UserProfileUpdate, Permission


class AuthService:
    """Service for authentication-related business logic."""

    def __init__(self):
        self.supabase = get_supabase_client()

    async def get_profile(self, user_id: UUID) -> Optional[UserProfile]:
        """Fetch a user's profile by ID."""
        result = self.supabase.table("profiles").select("*").eq("id", str(user_id)).execute()
        if result.data and len(result.data) > 0:
            return UserProfile(**result.data[0])
        return None

    async def update_profile(self, user_id: UUID, data: UserProfileUpdate) -> UserProfile:
        """Update a user's own profile (display_name, bio, avatar_url)."""
        update_data = data.model_dump(exclude_none=True)
        if not update_data:
            profile = await self.get_profile(user_id)
            if profile is None:
                raise ValueError("Profile not found")
            return profile

        result = self.supabase.table("profiles").update(update_data).eq("id", str(user_id)).execute()
        if result.data and len(result.data) > 0:
            return UserProfile(**result.data[0])
        raise ValueError("Profile not found")

    async def get_permissions(self, role: str) -> list[Permission]:
        """Get all permissions for a given role."""
        result = self.supabase.table("permissions").select("*").eq("role", role).execute()
        return [Permission(**p) for p in result.data] if result.data else []

    async def list_users(self, page: int = 1, per_page: int = 20) -> dict:
        """List all users with pagination (admin only)."""
        offset = (page - 1) * per_page
        result = (
            self.supabase.table("profiles")
            .select("*", count="exact")
            .order("created_at", desc=True)
            .range(offset, offset + per_page - 1)
            .execute()
        )
        return {
            "users": [UserProfile(**u) for u in result.data] if result.data else [],
            "total": result.count or 0,
            "page": page,
            "per_page": per_page,
        }

    async def change_role(self, user_id: UUID, new_role: str) -> UserProfile:
        """Change a user's role (admin only)."""
        result = (
            self.supabase.table("profiles")
            .update({"role": new_role})
            .eq("id", str(user_id))
            .execute()
        )
        if result.data and len(result.data) > 0:
            return UserProfile(**result.data[0])
        raise ValueError("User not found")

    async def suspend_user(
        self, user_id: UUID, reason: str, duration_days: Optional[int] = None
    ) -> UserProfile:
        """Suspend a user account (admin/senior_moderator only)."""
        update_data = {
            "account_status": "temp_suspended" if duration_days else "permanently_banned",
            "suspension_reason": reason,
        }
        if duration_days:
            update_data["suspension_expires_at"] = (
                datetime.now(timezone.utc) + timedelta(days=duration_days)
            ).isoformat()

        result = (
            self.supabase.table("profiles")
            .update(update_data)
            .eq("id", str(user_id))
            .execute()
        )
        if result.data and len(result.data) > 0:
            return UserProfile(**result.data[0])
        raise ValueError("User not found")

    async def reinstate_user(self, user_id: UUID) -> UserProfile:
        """Reinstate a suspended user (admin only)."""
        result = (
            self.supabase.table("profiles")
            .update({
                "account_status": "active",
                "suspension_reason": None,
                "suspension_expires_at": None,
            })
            .eq("id", str(user_id))
            .execute()
        )
        if result.data and len(result.data) > 0:
            return UserProfile(**result.data[0])
        raise ValueError("User not found")


def get_auth_service() -> AuthService:
    """Dependency injection for AuthService."""
    return AuthService()
