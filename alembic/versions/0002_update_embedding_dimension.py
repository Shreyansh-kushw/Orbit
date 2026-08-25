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
    # op.drop_index('ix_posts_embedding', table_name='posts')
    
    # Nullify existing embeddings because they have the wrong dimension (768)
    op.execute("UPDATE posts SET embedding = NULL")
    
    # Alter the column dimension to 3072
    # Note: We do NOT create an index here because pgvector indexes 
    # are limited to 2000 dimensions on standard PostgreSQL.
    op.alter_column('posts', 'embedding',
               existing_type=Vector(3072),
               type_=Vector(1536),
               existing_nullable=True)
    
    op.create_index(
        'ix_posts_embedding', # name of index
        'posts', # name of the corresponding table
        ['embedding'], # name of the column whose index is this
        postgresql_using='hnsw', # the method to use for creating index
        postgresql_ops={'embedding': 'vector_cosine_ops'}, # the operator to use for comparing vectors
        postgresql_with={'m': 16, 'ef_construction': 64} # the parameters to use for creating index
    )

def downgrade() -> None:

    # Drop the index (1536 dimensions)
    op.drop_index(
        'ix_posts_embedding', # name of index
        table_name='posts' # name of the corresponding table
    )

    # Clear out the embeddings before reverting back to 3072
    op.execute("UPDATE posts SET embedding = NULL")

    # Alter back to 3072
    op.alter_column('posts', 'embedding',
               existing_type=Vector(1536),
               type_=Vector(3072),
               existing_nullable=True)
    
    # Recreate the index for the smaller dimension
    op.alter_column(
        'posts', # table name
        'embedding', # column name
        existing_type=Vector(1536), # existing type
        type_=Vector(3072), # new dimensions 
        existing_nullable = True,        
    )