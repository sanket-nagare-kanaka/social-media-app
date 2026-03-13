"""Posts router — CRUD, feed, drafts, publishing, and poll voting."""

from fastapi import APIRouter, Depends, HTTPException, Query
from uuid import UUID
from typing import Optional

from app.middleware.auth import get_current_user, require_role
from app.models.user import AuthUser
from app.models.post import PostCreate, PostUpdate, PostResponse, PollVoteRequest, FeedResponse, PollResponse
from app.services.post_service import PostService, get_post_service

router = APIRouter(prefix="/api/posts", tags=["posts"])


@router.post("", response_model=PostResponse, status_code=201)
async def create_post(
    data: PostCreate,
    user: AuthUser = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """Create a new post (text, image, video, poll, thread)."""
    try:
        return await service.create_post(user.id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=FeedResponse)
async def get_feed(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
    service: PostService = Depends(get_post_service),
):
    """Get the public feed of published posts (paginated)."""
    return await service.get_feed(page=page, per_page=per_page)


@router.get("/me/drafts", response_model=list[PostResponse])
async def get_my_drafts(
    user: AuthUser = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """Get the current user's draft posts."""
    return await service.get_drafts(user.id)


@router.get("/user/{user_id}", response_model=FeedResponse)
async def get_user_posts(
    user_id: UUID,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
    service: PostService = Depends(get_post_service),
):
    """Get posts by a specific user."""
    return await service.get_user_posts(user_id, page=page, per_page=per_page)


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: UUID,
    service: PostService = Depends(get_post_service),
):
    """Get a single post by ID."""
    post = await service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: UUID,
    data: PostUpdate,
    user: AuthUser = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """Update a post (author or admin only)."""
    is_admin = user.profile and user.profile.role == "admin"
    try:
        return await service.update_post(post_id, user.id, data, is_admin=is_admin)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/{post_id}")
async def delete_post(
    post_id: UUID,
    user: AuthUser = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """Soft-delete a post (author or admin only)."""
    is_admin = user.profile and user.profile.role == "admin"
    try:
        return await service.delete_post(post_id, user.id, is_admin=is_admin)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/{post_id}/publish", response_model=PostResponse)
async def publish_post(
    post_id: UUID,
    user: AuthUser = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """Publish a draft or scheduled post."""
    try:
        return await service.publish_post(post_id, user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/{post_id}/vote", response_model=PollResponse)
async def vote_poll(
    post_id: UUID,
    data: PollVoteRequest,
    user: AuthUser = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """Vote on a poll option."""
    try:
        return await service.vote_poll(post_id, data.option_id, user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
