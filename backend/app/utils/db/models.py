"""Contains the model schemas for database fields."""

from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector

from backend.app.utils.db import Base


class User(Base):
    """User table model for database"""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )
    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    email: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        nullable=False,
    )
    bio: Mapped[str] = mapped_column(
        String(300),
        nullable=True,
        default="I'm a passionate member of Orbit. Sharing my thoughts and experiences with the world.",
    )
    password_hash: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    date_joined: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )
    image_file: Mapped[str | None] = mapped_column(
        String(200),
        default=None,
        nullable=True,
    )

    posts: Mapped[list[Post]] = relationship(
        back_populates="author",
        cascade="all, delete-orphan",
    )

    @property
    def image_path(self) -> str | None:
        if self.image_file:
            return f"/media/profile_pics/{self.image_file}"

        return None


class Post(Base):
    """Post table model for database"""

    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[Vector] = mapped_column(
        Vector(1536),
        nullable=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    date_posted: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )
    tags: Mapped[str | None] = mapped_column(Text, nullable=True)

    author: Mapped[User] = relationship(back_populates="posts")

    __table_args__ = ( # used to define additional arguments when creating a table
    # when we need to create a index for a normal column, we can just use index=True argument
    # but for a vector column index, we need to create it manually using sqlalchemy.Index
        Index(
            "ix_posts_embedding", # name of the index
            "embedding", # name of the column whose index is this
            postgresql_using="hnsw", # the method to use for creating index
            postgresql_ops={"embedding": "vector_cosine_ops"}, # the operator to use for comparing vectors
            postgresql_with={
                "m" : 16, # number of neighbors for each node
                "ef_construction": 64 # number of visited nodes during construction
            }
        ),
    )

# For vector indexes- there are generally two main methods -> HNSW or IVFFlat
# It is generally more common and has better query performance but uses a bit more memory + slower build
# Slower build means the databse takes somewhat long time to create the hnsw index for the first time
# which is expected, and this is normal.

# For postgresql_ops - it means the operators used to compare the distances -
# Options are -
    # Cosine distance () -> here we are using this one.
    # L2 distance ()
    # Inner product ()