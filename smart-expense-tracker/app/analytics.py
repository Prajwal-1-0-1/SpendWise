from fastapi import APIRouter,HTTPException
from sqlalchemy import func
from app.database import engine,SessionLocal
from app.models import Base,Expense


router = APIRouter(prefix="/analytics", tags=["analytics"])



@router.get("/total-expenditure")
def get_total_expenditure():
    db = SessionLocal()
    total = db.query(func.sum(Expense.amount)).scalar()
    db.close()
    return {"total_expenditure": total}



@router.get("/monthly_expenditure/{year}/{month}")
def get_monthly_expenditure(year: int, month: int):

    if not (1 <= month <= 12):
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")
    
    db = SessionLocal()
    total = db.query(func.sum(Expense.amount)).filter(
        func.extract('year', Expense.purchase_date) == year,
        func.extract('month', Expense.purchase_date) == month
    ).scalar()

    if total is None:
        total = 0.0
    db.close()
    return {"monthly_expenditure": total}



@router.get("/category_expenditure/{category}")
def get_category_expenditure(category: str):
    db = SessionLocal()
    total = db.query(func.sum(Expense.amount)).filter(
        Expense.category == category
    ).scalar()

    if total is None:
        total = 0.0
    db.close()
    return {"category_expenditure": total}



@router.get("/category_breakdown")
def get_category_breakdown():
    db = SessionLocal()

    category_totals = db.query(
        Expense.category,
        func.sum(Expense.amount)
    ).group_by(
        Expense.category
    ).all()

    result = [
        {
            "category": category,
            "total": total
        }
        for category, total in category_totals
    ]

    db.close()

    return {"category_breakdown": result}