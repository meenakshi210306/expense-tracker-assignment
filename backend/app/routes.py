from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import func
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import Expense

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ExpenseBase(BaseModel):
    title: str
    description: Optional[str] = None
    amount: float
    category: str
    date: datetime


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[datetime] = None


class ExpenseRead(ExpenseBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


@router.get("/", response_model=List[ExpenseRead])
def get_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return (
        db.query(Expense)
        .order_by(Expense.date.desc(), Expense.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{expense_id}", response_model=ExpenseRead)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.get(Expense, expense_id)
    if expense is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return expense


@router.post("/", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    expense = Expense(**payload.model_dump())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.put("/{expense_id}", response_model=ExpenseRead)
def update_expense(expense_id: int, payload: ExpenseUpdate, db: Session = Depends(get_db)):
    expense = db.get(Expense, expense_id)
    if expense is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(expense, field, value)

    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.get(Expense, expense_id)
    if expense is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return None


@router.get("/category/summary")
def get_category_summary(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Expense.category.label("category"),
            func.count(Expense.id).label("count"),
            func.coalesce(func.sum(Expense.amount), 0).label("total"),
        )
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
        .all()
    )
    return [
        {"category": row.category, "count": row.count, "total": float(row.total or 0)}
        for row in rows
    ]


@router.get("/category/{category}", response_model=List[ExpenseRead])
def get_expenses_by_category(category: str, db: Session = Depends(get_db)):
    return (
        db.query(Expense)
        .filter(func.lower(Expense.category) == category.lower())
        .order_by(Expense.date.desc(), Expense.id.desc())
        .all()
    )


@router.get("/monthly/{year}/{month}")
def get_monthly_summary(year: int, month: int, db: Session = Depends(get_db)):
    expenses = (
        db.query(Expense)
        .filter(func.strftime("%Y", Expense.date) == f"{year:04d}")
        .filter(func.strftime("%m", Expense.date) == f"{month:02d}")
        .all()
    )
    total = sum(expense.amount for expense in expenses)
    return {
        "year": year,
        "month": month,
        "count": len(expenses),
        "total": float(total),
        "expenses": expenses,
    }
