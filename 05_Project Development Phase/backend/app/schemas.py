"""Pydantic schemas for request and response validation."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema used for shared fields."""

    full_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=50)


class UserCreate(UserBase):
    """Schema for creating a new user account."""

    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for user authentication."""

    email: EmailStr
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """Schema for updating an existing user."""

    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=50)
    password: Optional[str] = Field(default=None, min_length=6)


class UserResponse(UserBase):
    """Schema for returning a user after registration or login."""

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """JWT token response schema."""

    access_token: str
    token_type: str = "bearer"


class SettlementPredictionRequest(BaseModel):
    """Schema for settlement prediction requests."""

    financial_health_score: int = Field(..., ge=0, le=100, description="Financial health score from 0 to 100")
    outstanding_balance: Decimal = Field(..., ge=0, description="Outstanding debt balance")


class SettlementPredictionResponse(BaseModel):
    """Schema for settlement prediction results."""

    settlement_percentage: int = Field(..., description="Predicted settlement percentage")
    estimated_settlement_amount: Decimal = Field(..., description="Predicted settlement amount")
    confidence_level: str = Field(..., description="High, Medium, or Low confidence")
    recommendation: str = Field(..., description="Negotiation recommendation")


class LoanBase(BaseModel):
    """Base loan schema shared by create and update operations."""

    user_id: int = Field(..., gt=0)
    lender_name: str = Field(..., min_length=2, max_length=255)
    loan_type: str = Field(..., min_length=2, max_length=100)
    loan_amount: float = Field(..., gt=0)
    outstanding_balance: float = Field(..., ge=0)
    interest_rate: float = Field(..., ge=0)
    monthly_emi: float = Field(..., ge=0)
    tenure: int = Field(..., ge=1)
    status: str = Field(..., min_length=2, max_length=50)


class LoanCreate(LoanBase):
    """Schema for creating a loan record."""

    pass


class LoanUpdate(BaseModel):
    """Schema for updating a loan record."""

    user_id: Optional[int] = Field(default=None, gt=0)
    lender_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    loan_type: Optional[str] = Field(default=None, min_length=2, max_length=100)
    loan_amount: Optional[float] = Field(default=None, gt=0)
    outstanding_balance: Optional[float] = Field(default=None, ge=0)
    interest_rate: Optional[float] = Field(default=None, ge=0)
    monthly_emi: Optional[float] = Field(default=None, ge=0)
    tenure: Optional[int] = Field(default=None, ge=1)
    status: Optional[str] = Field(default=None, min_length=2, max_length=50)


class LoanResponse(LoanBase):
    """Schema for returning a loan record."""

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SettlementHistoryBase(BaseModel):
    """Base schema for settlement history."""

    predicted_amount: float = Field(..., ge=0)
    negotiation_letter: str = Field(..., min_length=1)
    ai_recommendation: str = Field(..., min_length=1)


class SettlementHistoryCreate(SettlementHistoryBase):
    """Schema for creating a settlement history entry."""

    pass


class SettlementHistoryUpdate(BaseModel):
    """Schema for updating a settlement history entry."""

    predicted_amount: Optional[float] = Field(default=None, ge=0)
    negotiation_letter: Optional[str] = Field(default=None, min_length=1)
    ai_recommendation: Optional[str] = Field(default=None, min_length=1)


class SettlementHistoryResponse(SettlementHistoryBase):
    """Schema for returning a settlement history entry."""

    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
