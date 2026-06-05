"""Router for posts, dealing with various post related functionalities."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, literal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import backend.app.utils.db.models as models
from backend.app.utils.auth import CurrentUser

from backend.app.utils.db import get_db
from backend.app.api.schemas import (
    PostCreate,
    PostResponse,
    PostUpdate,
    PaginatedResponse,
)


app = APIRouter()


@app.get("", response_model=PaginatedResponse)
async def get_posts(
    db: Annotated[AsyncSession, Depends(get_db)],
    tag: Annotated[str, Query] = "",
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    """Returns the list of all posts."""

    if tag:
        posts_count = await db.execute(select(func.count()).where((literal(",") + models.Post.tags + literal(",")).contains(f",{tag},")).select_from(models.Post))
        total = posts_count.scalar() or 0

        result = await db.execute(
            select(models.Post)
            .where((literal(",") + models.Post.tags + literal(",")).contains(f",{tag},"))
            .options(selectinload(models.Post.author))
            .order_by(models.Post.date_posted.desc())
            .offset(skip)
            .limit(limit),
        )
        posts = result.scalars().all()

        has_more = skip + len(posts) < total
    
    else:
        posts_count = await db.execute(select(func.count()).select_from(models.Post))
        total = posts_count.scalar() or 0

        result = await db.execute(
            select(models.Post)
            .options(selectinload(models.Post.author))
            .order_by(models.Post.date_posted.desc())
            .offset(skip)
            .limit(limit),
        )
        posts = result.scalars().all()

        has_more = skip + len(posts) < total

    return PaginatedResponse(
        posts=[PostResponse.model_validate(post) for post in posts],
        total=total,
        skip=skip,
        limit=limit,
        has_more=has_more,
    )


@app.post(
    "",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_post(
    post: PostCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Creates a new post"""

    new_post = models.Post(
        title=post.title,
        content=post.content,
        user_id=current_user.id,
        tags=post.tags,
    )

    db.add(new_post)
    await db.commit()
    await db.refresh(new_post, attribute_names=["author"])

    return new_post


@app.get("/total")
async def get_total_posts(db: Annotated[AsyncSession, Depends(get_db)],):
    """Returns the total number of posts on the site."""

    posts_count = await db.execute(
        select(func.count())
        .select_from(models.Post)
    )

    total = posts_count.scalar() or 0

    return total


@app.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    """Returns a specific post by its id."""

    result = await db.execute(
        select(models.Post)
        .options(selectinload(models.Post.author))
        .where(models.Post.id == post_id),
    )
    post = result.scalars().first()

    if post:
        return post

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")


@app.patch("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Updates a specific post."""

    result = await db.execute(select(models.Post).where(models.Post.id == post_id))
    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action",
        )

    update_data = post_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)

    await db.commit()
    await db.refresh(post, attribute_names=["author"])
    return post


@app.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Deletes a specific post."""

    result = await db.execute(select(models.Post).where(models.Post.id == post_id))
    post = result.scalars().first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action",
        )

    await db.delete(post)
    await db.commit()
