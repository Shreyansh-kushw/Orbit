from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.app.utils.db import get_db, engine, Base
import backend.app.utils.db.models as models
from backend.app.api.routers import users, posts

from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(_app: FastAPI):
    """This lifespan function responsible for creating the database tables."""

    # startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        yield

    # shutdown
    await engine.dispose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mounting the directories
app.mount("/static", StaticFiles(directory="./frontend/public"), name="static")
app.mount("/media", StaticFiles(directory="./backend/media"), name="media")


# adding the routers
app.include_router(users.app, prefix="/api/users", tags=["users"])
app.include_router(posts.app, prefix="/api/posts", tags=["posts"])
