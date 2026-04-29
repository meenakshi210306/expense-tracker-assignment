from sqlalchemy.orm import Session
from app.models import Expense
from app.schemas import ExpenseCreate, ExpenseUpdate
from datetime import datetime, timedelta

def get_expense(db: Session, expense_id: int):
    return db.query(Expense).filter(Expense.id == expense_id).first()

def get_expenses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Expense).offset(skip).limit(limit).all()

def get_expenses_by_category(db: Session, category: str):
    return db.query(Expense).filter(Expense.category == category).all()

def get_expenses_by_date_range(db: Session, start_date: datetime, end_date: datetime):
    return db.query(Expense).filter(
        Expense.date >= start_date,
        Expense.date <= end_date
    ).all()

def create_expense(db: Session, expense: ExpenseCreate):
    db_expense = Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def update_expense(db: Session, expense_id: int, expense: ExpenseUpdate):
    db_expense = get_expense(db, expense_id)
    if db_expense:
        update_data = expense.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_expense, key, value)
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
    return db_expense

def delete_expense(db: Session, expense_id: int):
    db_expense = get_expense(db, expense_id)
    if db_expense:
        db.delete(db_expense)
        db.commit()
    return db_expense

def get_total_by_category(db: Session):
    from sqlalchemy import func
    return db.query(
        Expense.category,
        func.sum(Expense.amount)
    ).group_by(Expense.category).all()

def get_monthly_summary(db: Session, year: int, month: int):
    from sqlalchemy import func, extract
    return db.query(
        Expense.category,
        func.sum(Expense.amount).label('total')
    ).filter(
        extract('year', Expense.date) == year,
        extract('month', Expense.date) == month
    ).group_by(Expense.category).all()
