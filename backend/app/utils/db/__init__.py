"""Deals with the setting up, creation and yielding of a database session"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from pathlib import Path

from backend.app.utils.auth.config import settings

# getting the database directory path.


# Database Path
SQLALCHEMY_DATABASE_URL = settings.database_url


engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# creating the base class
class Base(DeclarativeBase): ...


async def get_db():
    """Function to create and yield database session."""
    async with AsyncSessionLocal() as session:
        yield session
