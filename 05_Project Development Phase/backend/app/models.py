"""SQLAlchemy models for the FinRelief AI backend."""

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    """Represents a registered user of the platform."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    loans: Mapped[list["Loan"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    settlements: Mapped[list["SettlementHistory"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Loan(Base):
    """Represents a debt or loan associated with a user."""

    __tablename__ = "loans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lender_name: Mapped[str] = mapped_column(String(255), nullable=False)
    loan_type: Mapped[str] = mapped_column(String(100), nullable=False)
    loan_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    outstanding_balance: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    interest_rate: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    monthly_emi: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    tenure: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="loans")


class SettlementHistory(Base):
    """Represents an AI-generated settlement recommendation history."""

    __tablename__ = "settlement_history"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    predicted_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    negotiation_letter: Mapped[str] = mapped_column(Text, nullable=False)
    ai_recommendation: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped[User] = relationship(back_populates="settlements")
