"""Main FastAPI application for FinRelief AI."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from . import models
from .ai import router as ai_router
from .auth import router as auth_router
from .database import Base, engine
from .financial import router as financial_router
from .loans import router as loan_router

app = FastAPI(
    title="FinRelief AI API",
    description="AI-powered debt relief and financial recovery platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(loan_router)
app.include_router(financial_router)
app.include_router(ai_router)


@app.get("/")
def read_root() -> dict[str, str]:
    """Return a welcome message for the API root endpoint."""
    return {"message": "Welcome to FinRelief AI API"}


@app.on_event("startup")
def startup_event() -> None:
    """Create all database tables and align existing SQLite schemas for authentication and loans."""
    Base.metadata.create_all(bind=engine)

    with engine.begin() as connection:
        inspector = inspect(connection)
        table_names = set(inspector.get_table_names())

        if "users" in table_names:
            user_columns = {column["name"] for column in inspector.get_columns("users")}
            if "hashed_password" not in user_columns and "password" in user_columns:
                connection.execute(text("ALTER TABLE users RENAME COLUMN password TO hashed_password"))
            elif "hashed_password" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255)"))

        if "loans" in table_names:
            loan_columns = {column["name"] for column in inspector.get_columns("loans")}
            if "loan_type" not in loan_columns:
                connection.execute(text("ALTER TABLE loans ADD COLUMN loan_type VARCHAR(100) DEFAULT 'Unknown'"))
            if "status" not in loan_columns:
                if "loan_status" in loan_columns:
                    connection.execute(text("ALTER TABLE loans RENAME COLUMN loan_status TO status"))
                else:
                    connection.execute(text("ALTER TABLE loans ADD COLUMN status VARCHAR(50) DEFAULT 'Active'"))
            if "created_at" not in loan_columns:
                connection.execute(text("ALTER TABLE loans ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
