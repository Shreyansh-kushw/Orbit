"""Initial consolidated schema

Revision ID: 0001
Revises: 
Create Date: 2026-06-05 18:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision: str = '0001'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Create pgvector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # 2. Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=30), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('bio', sa.String(length=300), nullable=True),
        sa.Column('password_hash', sa.String(length=200), nullable=False),
        sa.Column('date_joined', sa.DateTime(timezone=True), nullable=False),
        sa.Column('image_file', sa.String(length=200), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    # 3. Create posts table with embedding
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=100), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('embedding', Vector(768), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('date_posted', sa.DateTime(timezone=True), nullable=False),
        sa.Column('tags', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_posts_id'), 'posts', ['id'], unique=False)
    op.create_index(op.f('ix_posts_user_id'), 'posts', ['user_id'], unique=False)
    op.create_index('ix_posts_embedding', 'posts', ['embedding'], postgresql_using='hnsw', postgresql_ops={'embedding': 'vector_cosine_ops'}, postgresql_with={'m': 16, 'ef_construction': 64})

def downgrade() -> None:
    op.drop_table('posts')
    op.drop_table('users')
    op.execute("DROP EXTENSION IF EXISTS vector")
