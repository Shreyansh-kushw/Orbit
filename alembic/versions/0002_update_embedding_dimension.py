"""update embedding dimension to 3072

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-06 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision: str = '0002'
down_revision: Union[str, Sequence[str], None] = '0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Drop the existing index (768 dimensions)
    op.drop_index('ix_posts_embedding', table_name='posts')
    
    # Nullify existing embeddings because they have the wrong dimension (768)
    op.execute("UPDATE posts SET embedding = NULL")
    
    # Alter the column dimension to 3072
    # Note: We do NOT create an index here because pgvector indexes 
    # are limited to 2000 dimensions on standard PostgreSQL.
    op.alter_column('posts', 'embedding',
               existing_type=Vector(768),
               type_=Vector(3072),
               existing_nullable=True)

def downgrade() -> None:
    # Alter back to 768
    op.alter_column('posts', 'embedding',
               existing_type=Vector(3072),
               type_=Vector(768),
               existing_nullable=True)
    
    # Recreate the index for the smaller dimension
    op.create_index('ix_posts_embedding', 'posts', ['embedding'], postgresql_using='hnsw', postgresql_ops={'embedding': 'vector_cosine_ops'}, postgresql_with={'m': 16, 'ef_construction': 64})
