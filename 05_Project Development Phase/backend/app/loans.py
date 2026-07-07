"""Loan management routes for FinRelief AI."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .database import get_db
from .models import Loan, User
from .schemas import LoanCreate, LoanResponse, LoanUpdate

router = APIRouter(tags=["Loans"])


@router.post("/loan", response_model=LoanResponse, status_code=status.HTTP_201_CREATED)
def create_loan(loan_data: LoanCreate, db: Session = Depends(get_db)) -> Loan:
    """Create a new loan for an existing user."""
    user = db.query(User).filter(User.id == loan_data.user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    loan = Loan(
        user_id=loan_data.user_id,
        lender_name=loan_data.lender_name.strip(),
        loan_type=loan_data.loan_type.strip(),
        loan_amount=loan_data.loan_amount,
        outstanding_balance=loan_data.outstanding_balance,
        interest_rate=loan_data.interest_rate,
        monthly_emi=loan_data.monthly_emi,
        tenure=loan_data.tenure,
        status=loan_data.status.strip(),
    )

    try:
        db.add(loan)
        db.commit()
        db.refresh(loan)
        return loan
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create loan",
        ) from exc


@router.get("/loans", response_model=list[LoanResponse])
def list_loans(db: Session = Depends(get_db)) -> list[Loan]:
    """Return all loans stored in the database."""
    return db.query(Loan).order_by(Loan.id.desc()).all()


@router.get("/loan/{loan_id}", response_model=LoanResponse)
def get_loan(loan_id: int, db: Session = Depends(get_db)) -> Loan:
    """Fetch a loan by its identifier."""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if loan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found",
        )
    return loan


@router.put("/loan/{loan_id}", response_model=LoanResponse)
def update_loan(
    loan_id: int,
    loan_data: LoanUpdate,
    db: Session = Depends(get_db),
) -> Loan:
    """Update an existing loan record."""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if loan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found",
        )

    update_data = loan_data.model_dump(exclude_unset=True)
    if "user_id" in update_data and update_data["user_id"] is not None:
        user = db.query(User).filter(User.id == update_data["user_id"]).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

    if "lender_name" in update_data and update_data["lender_name"] is not None:
        update_data["lender_name"] = update_data["lender_name"].strip()
    if "loan_type" in update_data and update_data["loan_type"] is not None:
        update_data["loan_type"] = update_data["loan_type"].strip()
    if "status" in update_data and update_data["status"] is not None:
        update_data["status"] = update_data["status"].strip()

    try:
        for key, value in update_data.items():
            setattr(loan, key, value)
        db.commit()
        db.refresh(loan)
        return loan
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update loan",
        ) from exc


@router.delete("/loan/{loan_id}", status_code=status.HTTP_200_OK)
def delete_loan(loan_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    """Delete a loan record from the database."""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if loan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found",
        )

    try:
        db.delete(loan)
        db.commit()
        return {"message": "Loan deleted successfully"}
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete loan",
        ) from exc
