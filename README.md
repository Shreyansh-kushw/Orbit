# Orbit 🪐

> A modern, full-stack social media platform built for connecting people and sharing ideas.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Now-blue?style=for-the-badge)](https://orbit-one-flame.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Shreyansh-kushw/Orbit)
    
      
![Python](https://img.shields.io/badge/Language-Python_|_TypeScript-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
     
**Orbit** is a full-stack social media application built with Next.js, FastAPI, and PostgreSQL. It supports user authentication, profile customization, post creation, media uploads, content feeds, and search functionality. The project was developed to explore scalable backend design, modern frontend development, and features commonly found in social networking platforms.


## 🚀 Key Features

- **Semantic & Hybrid Search:** Combine literal keyword matching with cosine similarity vector search.
- **Modern Full-Stack Architecture:** Fully async Python backend (FastAPI) paired with a modern Next.js 16 (App Router) frontend.
- **Robust Authentication:** Secure JWT-based auth with password hashing via `argon2`.
- **User Profiles & Avatars:** Complete profile management with local media storage.
- **End-to-End Type Safety:** Pydantic (Backend) ↔ Zod (Frontend) validation.

---

## 📸 Screenshots 


| Feed View | Sign Up |
|---|---|
| ![Feed](/assets/feed.png) | ![Profile](/assets/sign_up.png) |

| Create Post | Profile |
|---|---|
| ![Create](/assets/create_post.png) | ![Search](/assets/profile.png) |

---

## 🛠️ Tech Stack

### Backend
| Technology | Description | Version |
|---|---|---|
| **FastAPI** | High-performance async Python web framework | `>=0.136.3` |
| **PostgreSQL & asyncpg** | Primary database with async driver | `>=0.31.0` |
| **pgvector** | Open-source vector similarity search for Postgres | `>=0.4.2` |
| **SQLAlchemy (Async)** | Modern ORM with `Mapped` typed columns | `>=2.0.50` |
| **Google Gemini API** | Generates text embeddings (`text-embedding-004`) | `^2.8.0` |
| **Alembic** | Database migrations | `>=1.18.4` |

### Frontend
| Technology | Description | Version |
|---|---|---|
| **Next.js** | React framework (App Router) | `^16.2.6` |
| **React** | UI library | `^19.2.6` |
| **Tailwind CSS** | Utility-first CSS framework | `^4.2.0` |
| **Radix UI / Shadcn** | Unstyled, accessible UI primitives | Various |
| **React Hook Form & Zod** | Form state management and schema validation| `^7.54.1` & `^3.24.1` |
| **Lucide React** | Beautifully simple, pixel-perfect icons | `^0.564.0` |

---

## 🚦 Quick Start

Follow these steps to run Orbit locally.

### Prerequisites
- Python >= 3.12
- Node.js >= 22 & `npm`
- PostgreSQL with the `pgvector` extension installed
- `uv` (Fast Python package installer)

### 1. Database Setup
Ensure your PostgreSQL server is running and create a new database. Enable the vector extension:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Environment Variables
Create a `.env` file in the root directory for the backend and `frontend/.env.local` for the frontend.

**Root `.env`:**
| Variable | Description | Example |
|---|---|---|
| `SECRET_KEY` | Secret used for JWT signing | `your-super-secret-key-123` |
| `DATABASE_URL` | Async PostgreSQL connection string | `postgresql+asyncpg://user:pass@localhost/orbit` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token validity duration | `30` |
| `ALLOWED_ORIGINS` | CORS origins | `http://localhost:3000` |
| `GEMINI_API_KEY` | API key for Google Gemini Embedding API | `AIzaSy...` |

**`frontend/.env.local` (Frontend):**
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API Base URL | `http://localhost:8000` |

### 3. Backend Setup
```bash
# Install dependencies using uv
uv sync

# Run database migrations
uv run alembic upgrade head

# Start the FastAPI development server
uvicorn main:app --reload
```
*The backend API will be available at [http://localhost:8000](http://localhost:8000).*

### 4. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The frontend application will be available at [http://localhost:3000](http://localhost:3000).*

---

## 📂 Project Structure

```
Orbit/
├── backend/
│   ├── app/
│   │   ├── api/          # API Routers and Pydantic schemas
│   │   │   ├── routers/  # Endpoint logic (posts.py, users.py)
│   │   │   └── schemas/  # Pydantic models (PostCreate, UserPublic, etc.)
│   │   └── utils/        # Auth logic, config, and database engine
│   │       ├── auth/     # JWT creation and password hashing
│   │       ├── config/   # Pydantic Settings
│   │       └── db/       # SQLAlchemy models (User, Post)
│   ├── embedding/        # Google Gemini embedding configuration
│   └── media/            # Uploaded static files (e.g., profile pictures)
├── frontend/
│   ├── app/              # Next.js App Router pages (auth, create, profile, etc.)
│   ├── components/       # Reusable React components (orbit/ and ui/)
│   ├── hooks/            # Custom React hooks (use-toast, use-mobile)
│   ├── lib/              # Utility functions, API clients, auth handlers
│   ├── public/           # Static assets (favicons, manifests)
│   ├── styles/           # Global stylesheets
│   ├── components.json   # Shadcn UI configuration
│   ├── middleware.ts     # Next.js route middleware (auth protection)
│   ├── next.config.mjs   # Next.js configuration
│   ├── package.json      # Frontend dependencies (npm)
│   ├── postcss.config.mjs# PostCSS configuration
│   └── tsconfig.json     # TypeScript configuration
├── alembic/              # Database migration scripts
├── alembic.ini           # Alembic configuration
├── main.py               # FastAPI application entry point
├── pyproject.toml        # Backend dependencies (uv)
├── requirements.txt      # Exported Python dependencies
├── uv.lock               # uv dependency lockfile
└── .python-version       # Python version specification
```

---

## 🏗️ Architecture

```mermaid
graph TD
    Client[Next.js Client Components] -->|Fetch/Server Actions| Server[Next.js Server Components]
    Client -->|Direct API Calls| API[FastAPI Backend]
    Server -->|Direct API Calls| API
    
    API -->|JWT Validation| Auth[Auth Middleware]
    Auth --> Router[API Routers]
    Router -->|SQLAlchemy| DB[(PostgreSQL)]
    
    Router -->|Google GenAI| Gemini[Gemini Embedding API]
    Gemini -->|3072-dim Vector| DB
```
> **Note:** Client and Server Components are both part of the same Next.js application. Client Components run in the browser and handle interactivity; Server Components run on the server and are used for data fetching and initial renders.
---

## 📡 API Endpoints Reference

### Auth & Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/users` | Register a new user | No |
| `POST` | `/api/users/token` | Login and receive JWT access token | No |
| `GET` | `/api/users/me` | Get the currently authenticated user | Yes |
| `GET` | `/api/users/{user_id}` | Get a user's public profile | No |
| `GET` | `/api/users/u/{username}` | Get a user by their username | No |
| `PATCH` | `/api/users/{user_id}` | Update user profile details | Yes |
| `DELETE` | `/api/users/{user_id}` | Delete user account | Yes |
| `POST` | `/api/users/{user_id}/avatar` | Upload user profile picture | Yes |
| `GET` | `/api/users/total` | Get total number of registered users | No |

### Posts (`/api/posts`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/posts` | Get paginated posts (supports `tag` and `keyword` search) | No |
| `POST` | `/api/posts` | Create a new post (generates text embedding) | Yes |
| `GET` | `/api/posts/{post_id}` | Get a specific post | No |
| `PATCH` | `/api/posts/{post_id}` | Update a post (regenerates embedding if changed) | Yes |
| `DELETE` | `/api/posts/{post_id}` | Delete a post | Yes |
| `GET` | `/api/posts/total` | Get total number of posts | No |
| `GET` | `/api/users/{user_id}/posts` | Get paginated posts created by a specific user | No |

---

## 🧠 Data Flow: Hybrid Semantic Search

Orbit implements a hybrid search approach, combining the precision of keyword matching with the context awareness of semantic vector search.

```mermaid
sequenceDiagram
    participant User
    participant FastAPI
    participant Gemini API
    participant PostgreSQL (pgvector)
    
    User->>FastAPI: Search "?keyword=machine learning"
    FastAPI->>Gemini API: models.embed_content("machine learning")
    Gemini API-->>FastAPI: Returns 3072-dim vector [0.012, -0.98, ...]
    FastAPI->>PostgreSQL (pgvector): Hybrid Query (Cosine Distance < 0.7 OR ILIKE)
    PostgreSQL (pgvector)-->>FastAPI: Returns relevant Post rows
    FastAPI-->>User: Paginated JSON Response
```

---

## 🗄️ Database Schema

Orbit uses declarative SQLAlchemy 2.0 ORM models.

- **`User` Table:** Stores authentication details (hashed passwords), profile metadata (bio, name), and an `image_file` reference for avatars.
- **`Post` Table:** Stores the actual textual content, title, tags, and an `embedding` column of type `Vector(3072)`.

```python
# A highlight of the Post model showcasing pgvector integration
class Post(Base):
    __tablename__ = "posts"
    # ...
    embedding: Mapped[Vector] = mapped_column(
        Vector(3072),
        nullable=True,
    )
```

---

## 🚀 Deployment Instructions

### Backend Deployment (e.g., Render, Railway)
1. Provide a managed PostgreSQL database with `pgvector` support (e.g., Supabase, Neon, AWS RDS).
2. Set the `DATABASE_URL` environment variable to your production database.
3. Use a production ASGI server like Uvicorn with multiple workers:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### Frontend Deployment (e.g., Vercel)
1. Connect your repository to Vercel.
2. Set the build command to `npm run build` and install command to `npm install`.
3. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed FastAPI backend.
4. Deploy!

---

## 🔧 Troubleshooting

- **`pgvector` Extension Error:** If you get an error about `type "vector" does not exist`, ensure you ran `CREATE EXTENSION vector;` on your Postgres database *before* running Alembic migrations.
- **CORS Issues:** Make sure your frontend's URL (e.g., `http://localhost:3000`) is included in the `ALLOWED_ORIGINS` environment variable (or hardcoded fallback) on the backend.
- **Authentication Fails:** Double-check that `SECRET_KEY` matches between restarts if you aren't using a persistent `.env` file.

---

## 🎓 What I Learned

Building Orbit provided deep insights into modern full-stack integrations:
- **Vector Databases & LLMs:** Moving beyond traditional full-text search to implement `pgvector` and the Google Gemini API was a game-changer for information retrieval quality. Understanding vector similarity search was crucial for optimizing search results.
- **Async Python:** Leveraging SQLAlchemy 2.0's async `Mapped` features with `asyncpg` allowed for non-blocking database operations, maximizing FastAPI's potential for high concurrency.
- **Next.js 16 App Router:** Effectively mixing Server Components (for fast initial loads and SEO) and Client Components (for interactive elements like React Hook Form) requires a strong mental model of where code executes.
- **Security:** Handling JWTs securely between an independent Python backend and a Next.js frontend, ensuring smooth session management alongside file uploads.

---
*Built with ❤️ using FastAPI and Next.js*

