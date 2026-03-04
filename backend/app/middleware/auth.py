"""Authentication middleware for FastAPI.

Validates Supabase JWT tokens using the Supabase Auth API (getUser)
and provides dependency injection for the current user and role-based access control.

This approach works regardless of whether the project uses HS256 or ECC (P-256)
JWT signing keys, since validation is delegated to Supabase's auth server.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from uuid import UUID
import httpx

from app.config import get_settings
from app.models.user import AuthUser, UserProfile
from app.utils.supabase_client import get_supabase_client

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> AuthUser:
    """
    Validate the Supabase JWT token by calling the Supabase Auth API.
    Returns an AuthUser with profile data.

    This uses Supabase's /auth/v1/user endpoint which validates the token
    server-side, so we don't need the JWT secret locally.
    """
    settings = get_settings()
    token = credentials.credentials

    # Validate token via Supabase Auth API
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{settings.SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.SUPABASE_ANON_KEY,
                },
            )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Auth service unavailable: {str(e)}",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_data = response.json()
    user_id = user_data.get("id")
    user_email = user_data.get("email")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not extract user ID from token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch user profile from Supabase database
    supabase = get_supabase_client()
    result = supabase.table("profiles").select("*").eq("id", user_id).execute()

    profile = None
    if result.data and len(result.data) > 0:
        profile = UserProfile(**result.data[0])

    return AuthUser(
        id=UUID(user_id),
        email=user_email,
        profile=profile,
    )


def require_role(*allowed_roles: str):
    """
    Dependency factory that checks if the current user has one of the allowed roles.

    Usage:
        @router.get("/admin/users", dependencies=[Depends(require_role("admin"))])
    """
    async def role_checker(user: AuthUser = Depends(get_current_user)) -> AuthUser:
        if user.profile is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User profile not found. Please complete your profile setup.",
            )

        if user.profile.account_status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account is {user.profile.account_status}. Access denied.",
            )

        if user.profile.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {', '.join(allowed_roles)}",
            )

        return user

    return role_checker
