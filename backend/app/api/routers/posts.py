"""Router for posts, dealing with various post related functionalities."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, literal, or_
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
from backend.embedding import embed_content
import asyncio

app = APIRouter()


@app.get("", response_model=PaginatedResponse)
async def get_posts(
    db: Annotated[AsyncSession, Depends(get_db)],
    tag: Annotated[str, Query] = "",
    keyword: Annotated[str, Query] = "",
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    """Returns the list of all posts fitting the search criteria."""

    # Base queries
    query = select(models.Post)
    count_query = select(func.count()).select_from(models.Post)


    if tag:
        tag_filter = (literal(",") + func.coalesce(models.Post.tags, '') + literal(",")).ilike(
            f"%,{tag},%"
        )
        # problem. if for a post, tags are NULL, then the tag filter would be evaluated to be NULL as well.
        # thus, these posts would never really be evaluated in the results.
        # solution , replacing the NULL value for no tags with an '' (empty string).
        
        query = query.where(tag_filter)
        count_query = count_query.where(tag_filter)

    if keyword:
        try:
            """Adding a error handling block to switch to keyword matching in case of embedding failures."""

            keyword_embedding = await asyncio.to_thread(embed_content, keyword)
            keyword_filter = models.Post.embedding.cosine_distance(keyword_embedding)
            
            # Hybrid Filter: Semantic match OR literal keyword match
            hybrid_condition = or_(
                keyword_filter < 0.7,
                models.Post.title.icontains(keyword),
                models.Post.content.icontains(keyword)
            )
            
            # query = query.where(hybrid_condition).order_by(keyword_filter)
            query = query.where(hybrid_condition).order_by(keyword_filter.asc().nulls_last())
            # THINKING BEHIND THIS ABOVE CHANGE - 
            # With regards to the probability of failure in the embedding process of the posts,
            # there is a chance that some post might be created but corresponsing field for its embedding be
            # left NULL.
            # IN such cases if while searching the database, if a post is encountered which successfully
            # matches the keywords but has its embedding NULL, it would break the order_by method 
            # and thus these posts may be unexpectedly ordered in the returned list. 
            # 
            # So therefore, we will enforce two new methods, one is ascending (to enforce ascending order, ie
            # the closer to the original meaning the better)
            # And also another nulls_last() method to place all the NULL embeddings posts at the last of the returned
            # response.  

            count_query = count_query.where(hybrid_condition)

        except Exception as e:
            print(f"Error embedding keyword: {e}")
            keyword_filter = or_(
                models.Post.title.icontains(keyword),
                models.Post.content.icontains(keyword),
            )
            query = query.where(keyword_filter).order_by(models.Post.date_posted.desc())
            count_query = count_query.where(keyword_filter)

    if not keyword:
        query = query.order_by(models.Post.date_posted.desc())

    count = await db.execute(count_query)
    total = count.scalar() or 0

    result = await db.execute(
        query.options(selectinload(models.Post.author))
        
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
        embedding=await asyncio.to_thread(embed_content,(f"{post.title} {post.content}")),
    )

    db.add(new_post)
    await db.commit()
    await db.refresh(new_post, attribute_names=["author"])

    return new_post


@app.get("/total")
async def get_total_posts(
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Returns the total number of posts on the site."""

    posts_count = await db.execute(select(func.count()).select_from(models.Post))

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

    if post_data.title:
        post.title = post_data.title
    if post_data.content:
        post.content = post_data.content
    
    # Update embedding if title or content changed
    if post_data.title or post_data.content:
        try:
            post.embedding = await asyncio.to_thread(embed_content, f"{post.title} {post.content}")
        
        except Exception as e:
            print(f"Error embedding post content: {e}")
            post.embedding = None
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Error embedding post content, {}".format(e),
            )
    
    if post_data.tags is not None: # because if use removes all tags then this becomes empty list and not None, so just checking for None is enough to know if the tags were changed or not
        post.tags = post_data.tags

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
