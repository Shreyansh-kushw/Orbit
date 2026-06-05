from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from backend.app.api.routers import users, posts
from backend.app.utils.config import settings
from backend.app.utils.db import engine, Base

from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Database initialization is handled by Alembic migrations
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
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
