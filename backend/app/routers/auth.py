"""Auth router — profile management for authenticated users."""

from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth import get_current_user
from app.models.user import AuthUser, UserProfile, UserProfileUpdate, Permission
from app.services.auth_service import AuthService, get_auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/me", response_model=UserProfile)
async def get_my_profile(
    user: AuthUser = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
):
    """Get the current authenticated user's profile."""
    profile = await service.get_profile(user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/me", response_model=UserProfile)
async def update_my_profile(
    data: UserProfileUpdate,
    user: AuthUser = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
):
    """Update the current user's own profile."""
    try:
        return await service.update_profile(user.id, data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/me/permissions", response_model=list[Permission])
async def get_my_permissions(
    user: AuthUser = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
):
    """Get the current user's role permissions."""
    if not user.profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return await service.get_permissions(user.profile.role)


@router.get("/roles/permissions", response_model=dict[str, list[Permission]])
async def get_all_roles_permissions(
    service: AuthService = Depends(get_auth_service),
):
    """Get all permissions grouped by role for the help page."""
    return await service.get_all_role_permissions()
