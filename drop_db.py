import asyncio
from sqlalchemy import text
from backend.app.utils.db import engine

async def drop_all():
    async with engine.begin() as conn:
        print("Dropping tables...")
        # Drop in correct order due to foreign keys
        await conn.execute(text("DROP TABLE IF EXISTS posts CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE"))
        print("Tables dropped successfully.")

if __name__ == "__main__":
    asyncio.run(drop_all())
