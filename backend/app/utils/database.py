from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from pathlib import Path

# getting the database directory path.

CURRENT_DIR = Path(__file__).parent
APP_DIR = Path(CURRENT_DIR).parent
DATABASE_DIR = f"{Path(APP_DIR).parent}/database"

# Database Path
SQLALCHEMY_DATABASE_URL = f"sqlite+aiosqlite:///{DATABASE_DIR}/database.db"


engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
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
    async with (
        AsyncSessionLocal() as session
    ):
        yield session

