"""Router for posts, dealing with various post related functionalities."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import backend.app.utils.models as models

from backend.app.utils.database import get_db
from backend.app.api.schemas.schema import PostCreate, PostResponse, PostUpdate

app = APIRouter()


@app.get("", response_model=list[PostResponse])
async def get_posts(db: Annotated[AsyncSession, Depends(get_db)]):
    """Returns the list of all posts."""

    result = await db.execute(
        select(models.Post)
        .options(selectinload(models.Post.author))
        .order_by(models.Post.date_posted.desc()),
    )
    posts = result.scalars().all()
    return posts

@app.post(
    "",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_post(
    post: PostCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Creates a new post"""

    new_post = models.Post(
        title=post.title,
        content=post.content,
        user_id=1, # TEMPORARY
    )

    db.add(new_post)
    await db.commit()
    await db.refresh(new_post, attribute_names=["author"])
    
    return new_post

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

    update_data = post_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)

    await db.commit()
    await db.refresh(post, attribute_names=["author"])
    return post

@app.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
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

    await db.delete(post)
    await db.commit()