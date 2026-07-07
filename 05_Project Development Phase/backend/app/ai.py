"""AI negotiation utilities and API endpoints for FinRelief AI."""

import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

load_dotenv()

router = APIRouter(tags=["AI Negotiation"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"


class NegotiationRequest(BaseModel):
    """Request schema for AI negotiation generation."""

    user_name: str = Field(..., min_length=2, max_length=255)
    lender_name: str = Field(..., min_length=2, max_length=255)
    loan_amount: float = Field(..., gt=0)
    outstanding_balance: float = Field(..., ge=0)
    monthly_income: float = Field(..., gt=0)
    monthly_expenses: float = Field(..., ge=0)
    financial_health_score: int = Field(..., ge=0, le=100)
    settlement_percentage: int = Field(..., ge=0, le=100)
    estimated_settlement_amount: float = Field(..., ge=0)


class NegotiationResponse(BaseModel):
    """Response schema for AI negotiation generation."""

    strategy: str
    recommendation: str
    letter: str


def _fallback_response(payload: NegotiationRequest) -> NegotiationResponse:
    """Return a safe fallback response when Gemini is unavailable."""
    return NegotiationResponse(
        strategy=(
            f"Prepare a calm, evidence-based negotiation with {payload.lender_name}. "
            f"Emphasize stable income, affordability, and a reasonable settlement request."
        ),
        recommendation=(
            f"Recommend requesting a settlement of {payload.settlement_percentage}% of the outstanding balance "
            f"({payload.estimated_settlement_amount:.2f}) and presenting a structured repayment offer."
        ),
        letter=(
            f"Dear {payload.lender_name},\n\n"
            f"I am writing to request a settlement resolution for my outstanding balance of {payload.outstanding_balance:.2f}. "
            f"Based on my current financial circumstances, I believe a negotiated settlement is the most practical path forward. "
            f"I am committed to resolving this responsibly and respectfully.\n\n"
            f"Sincerely,\n{payload.user_name}"
        ),
    )


def _build_prompt(payload: NegotiationRequest) -> str:
    """Create a prompt for Gemini that captures the user's financial profile."""
    return (
        f"You are a professional debt relief advisor. "
        f"Write a negotiation strategy, a settlement recommendation, and a professional negotiation letter for a user named {payload.user_name} "
        f"negotiating with {payload.lender_name}. "
        f"The loan amount is {payload.loan_amount:.2f}, outstanding balance is {payload.outstanding_balance:.2f}, "
        f"monthly income is {payload.monthly_income:.2f}, monthly expenses are {payload.monthly_expenses:.2f}, "
        f"financial health score is {payload.financial_health_score}, settlement percentage is {payload.settlement_percentage}%, "
        f"and estimated settlement amount is {payload.estimated_settlement_amount:.2f}. "
        f"Keep the tone professional, persuasive, and concise."
    )


@router.post("/ai-negotiation", response_model=NegotiationResponse, status_code=status.HTTP_200_OK)
async def generate_negotiation(payload: NegotiationRequest) -> NegotiationResponse:
    """Generate negotiation support content using the Gemini API or fallback content."""
    if not GEMINI_API_KEY:
        return _fallback_response(payload)

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json={
                    "contents": [
                        {
                            "parts": [
                                {"text": _build_prompt(payload)}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "topK": 40,
                        "topP": 0.95,
                        "maxOutputTokens": 800,
                    },
                },
            )
            response.raise_for_status()
            data: dict[str, Any] = response.json()

            text = ""
            if "candidates" in data and data["candidates"]:
                content = data["candidates"][0].get("content", {})
                parts = content.get("parts", [])
                if parts:
                    text = parts[0].get("text", "")

            if not text.strip():
                return _fallback_response(payload)

            sections = [section.strip() for section in text.split("\n\n") if section.strip()]
            if len(sections) >= 3:
                strategy, recommendation, letter = sections[0], sections[1], sections[2]
                return NegotiationResponse(
                    strategy=strategy,
                    recommendation=recommendation,
                    letter=letter,
                )

            return _fallback_response(payload)
    except (httpx.HTTPError, ValueError, KeyError, TypeError):
        return _fallback_response(payload)
