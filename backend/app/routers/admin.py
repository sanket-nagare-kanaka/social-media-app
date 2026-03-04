"""Admin router — user management, role changes, suspensions (admin-only)."""

from fastapi import APIRouter, Depends, HTTPException, Query
from app.middleware.auth import require_role
from app.models.user import AuthUser, UserProfile, UserRoleUpdate, UserSuspendRequest
from app.services.auth_service import AuthService, get_auth_service
from uuid import UUID

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user: AuthUser = Depends(require_role("admin")),
    service: AuthService = Depends(get_auth_service),
):
    """List all users with pagination (admin only)."""
    return await service.list_users(page=page, per_page=per_page)


@router.put("/users/{user_id}/role", response_model=UserProfile)
async def change_user_role(
    user_id: UUID,
    data: UserRoleUpdate,
    user: AuthUser = Depends(require_role("admin")),
    service: AuthService = Depends(get_auth_service),
):
    """Change a user's role (admin only)."""
    if user_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    try:
        return await service.change_role(user_id, data.role)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/users/{user_id}/suspend", response_model=UserProfile)
async def suspend_user(
    user_id: UUID,
    data: UserSuspendRequest,
    user: AuthUser = Depends(require_role("admin", "senior_moderator")),
    service: AuthService = Depends(get_auth_service),
):
    """Suspend a user account (admin/senior_moderator only)."""
    if user_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot suspend yourself")
    try:
        return await service.suspend_user(user_id, data.reason, data.duration_days)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/users/{user_id}/reinstate", response_model=UserProfile)
async def reinstate_user(
    user_id: UUID,
    user: AuthUser = Depends(require_role("admin")),
    service: AuthService = Depends(get_auth_service),
):
    """Reinstate a suspended user (admin only)."""
    try:
        return await service.reinstate_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
