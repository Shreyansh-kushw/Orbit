import asyncio
import sys
import os

# Add the project root to the python path
sys.path.append(os.getcwd())

from sqlalchemy import select
from backend.app.utils.db import AsyncSessionLocal, models
from backend.embedding import embed_content

async def backpopulate():
    print("Starting backpopulation of embeddings...")
    
    async with AsyncSessionLocal() as db:
        # Fetch all posts where embedding is null
        result = await db.execute(select(models.Post).where(models.Post.embedding == None))
        posts = result.scalars().all()
        
        if not posts:
            print("No posts found that require embedding updates.")
            return

        print(f"Found {len(posts)} posts to update.")
        
        for i, post in enumerate(posts):
            try:
                print(f"[{i+1}/{len(posts)}] Embedding post: {post.title}")
                
                # Combine title and content for the embedding
                text_to_embed = f"{post.title} {post.content}"
                
                # Generate new embedding
                # embed_content is synchronous in your implementation, 
                # but we'll use to_thread to keep the loop responsive if needed
                new_embedding = await asyncio.to_thread(embed_content, text_to_embed)
                
                # Update the post
                post.embedding = new_embedding
                
                # Commit every few posts to avoid long transactions, or just at the end
                if (i + 1) % 5 == 0:
                    await db.commit()
                    print(f"Progress saved...")
                    
            except Exception as e:
                print(f"Error embedding post '{post.title}': {e}")
                continue
        
        await db.commit()
        print("Backpopulation complete!")

if __name__ == "__main__":
    asyncio.run(backpopulate())
