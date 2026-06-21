# Todo-Calender Backend — FastAPI + PostgreSQL

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Settings & environment variables
│   ├── database.py              # SQLAlchemy engine & session
│   ├── dependencies.py          # FastAPI dependencies (auth, db)
│   │
│   ├── models/                  # SQLAlchemy ORM Models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── category.py
│   │   ├── activity_log.py
│   │   └── notification.py
│   │
│   ├── schemas/                 # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── category.py
│   │   ├── activity_log.py
│   │   └── notification.py
│   │
│   ├── crud/                    # CRUD operations
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── category.py
│   │   ├── activity_log.py
│   │   └── notification.py
│   │
│   ├── services/                # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── task_service.py
│   │   └── notification_service.py
│   │
│   ├── routers/                 # API Route handlers
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── tasks.py
│   │   ├── categories.py
│   │   ├── activity_logs.py
│   │   └── notifications.py
│   │
│   └── core/
│       ├── security.py          # JWT + password hashing
│       └── exceptions.py        # Custom exceptions
│
├── alembic/                     # DB migrations
│   ├── env.py
│   ├── versions/
│   └── alembic.ini
│
├── requirements.txt
├── .env.example
└── Dockerfile
```
