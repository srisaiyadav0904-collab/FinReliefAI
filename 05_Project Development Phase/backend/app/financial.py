"""Financial analysis utilities and API endpoints for FinRelief AI."""

from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from .schemas import (
    SettlementPredictionRequest,
    SettlementPredictionResponse,
)

router = APIRouter(tags=["Financial Analysis"])


class FinancialAnalysisRequest(BaseModel):
    """Request payload for financial analysis."""

    monthly_income: Decimal = Field(..., gt=0, description="Monthly income before deductions")
    monthly_expenses: Decimal = Field(..., ge=0, description="Monthly household and living expenses")
    monthly_emi: Decimal = Field(..., ge=0, description="Total monthly EMI payment")
    outstanding_balance: Decimal = Field(..., ge=0, description="Total outstanding debt balance")


class FinancialAnalysisResponse(BaseModel):
    """Response payload with computed financial metrics."""

    dti: Decimal = Field(..., description="Debt-to-income ratio percentage")
    monthly_savings: Decimal = Field(..., description="Monthly savings after expenses and EMI")
    financial_health_score: int = Field(..., ge=0, le=100, description="Rule-based financial health score")
    risk_level: str = Field(..., description="Low, Medium, or High risk")


def quantize_money(value: Decimal) -> Decimal:
    """Round monetary values to two decimal places using decimal arithmetic."""
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_financial_health_score(dti: Decimal, monthly_savings: Decimal, outstanding_balance: Decimal) -> int:
    """Calculate a simple rule-based financial health score from 0 to 100."""
    score = 100

    if dti > Decimal("40"):
        score -= 40
    elif dti > Decimal("25"):
        score -= 25
    elif dti > Decimal("15"):
        score -= 10

    if monthly_savings < Decimal("0"):
        score -= 30
    elif monthly_savings < Decimal("500"):
        score -= 15

    if outstanding_balance > Decimal("0"):
        if dti > Decimal("30"):
            score -= 10
        elif dti > Decimal("20"):
            score -= 5

    return max(0, min(100, int(score)))


def determine_risk_level(score: int) -> str:
    """Translate a health score into a simple risk label."""
    if score >= 75:
        return "Low"
    if score >= 45:
        return "Medium"
    return "High"


@router.post("/financial-analysis", response_model=FinancialAnalysisResponse, status_code=status.HTTP_200_OK)
def analyze_finances(payload: FinancialAnalysisRequest) -> FinancialAnalysisResponse:
    """Analyze a user's monthly financial profile and return key health metrics."""
    dti = quantize_money((payload.monthly_emi / payload.monthly_income) * Decimal("100"))
    monthly_savings = quantize_money(payload.monthly_income - payload.monthly_expenses - payload.monthly_emi)
    financial_health_score = calculate_financial_health_score(
        dti=dti,
        monthly_savings=monthly_savings,
        outstanding_balance=payload.outstanding_balance,
    )
    risk_level = determine_risk_level(financial_health_score)

    return FinancialAnalysisResponse(
        dti=dti,
        monthly_savings=monthly_savings,
        financial_health_score=financial_health_score,
        risk_level=risk_level,
    )


@router.post("/settlement-prediction", response_model=SettlementPredictionResponse, status_code=status.HTTP_200_OK)
def predict_settlement(payload: SettlementPredictionRequest) -> SettlementPredictionResponse:
    """Estimate a likely settlement percentage and negotiation recommendation."""
    if payload.financial_health_score >= 80:
        settlement_percentage = 40
        confidence_level = "High"
        recommendation = "Good chance for settlement negotiation."
    elif payload.financial_health_score >= 60:
        settlement_percentage = 55
        confidence_level = "Medium"
        recommendation = "Moderate chance for settlement negotiation."
    else:
        settlement_percentage = 70
        confidence_level = "Low"
        recommendation = "Higher risk; settlement negotiation may require a stronger strategy."

    estimated_settlement_amount = quantize_money(
        payload.outstanding_balance * (Decimal(settlement_percentage) / Decimal("100"))
    )

    return SettlementPredictionResponse(
        settlement_percentage=settlement_percentage,
        estimated_settlement_amount=estimated_settlement_amount,
        confidence_level=confidence_level,
        recommendation=recommendation,
    )
