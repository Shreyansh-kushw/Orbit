"""Router for posts dealing with various post related functionalities."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import backend.app.utils.models as models

from backend.app.utils.database import get_db
from backend.app.api.schemas.schema import PostCreate, PostResponse, PostUpdate

app = APIRouter()