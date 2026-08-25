"""Update embedding column to 1536 dimensions and add HNSW index

Revision ID: 0003
Revises: 0002
Create Date: 2026-08-25 20:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision: str = '0003'
down_revision: Union[str, Sequence[str], None] = '0002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Drop existing vector index if any
    op.execute("DROP INDEX IF EXISTS ix_posts_embedding;")

    # 2. Clear out incompatible 3072-dimensional embeddings
    op.execute("UPDATE posts SET embedding = NULL;")

    # 3. Alter embedding column type to Vector(1536)
    op.alter_column(
        'posts',
        'embedding',
        type_=Vector(1536),
        existing_type=Vector(3072),
        existing_nullable=True,
    )

    # 4. Create HNSW index for cosine distance on the 1536-dim vector
    op.create_index(
        'ix_posts_embedding',
        'posts',
        ['embedding'],
        postgresql_using='hnsw',
        postgresql_ops={'embedding': 'vector_cosine_ops'},
        postgresql_with={'m': 16, 'ef_construction': 64},
    )


def downgrade() -> None:
    # 1. Drop index
    op.execute("DROP INDEX IF EXISTS ix_posts_embedding;")

    # 2. Reset embeddings
    op.execute("UPDATE posts SET embedding = NULL;")

    # 3. Revert back to Vector(3072)
    op.alter_column(
        'posts',
        'embedding',
        type_=Vector(3072),
        existing_type=Vector(1536),
        existing_nullable=True,
    )
