from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from backend.app.api.routers import users, posts

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

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
