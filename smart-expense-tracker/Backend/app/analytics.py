from fastapi import APIRouter,HTTPException, Depends
from app.models import User
from app.auth import get_current_user
from sqlalchemy import func
from app.database import engine,SessionLocal
from app.models import Base,Expense


router = APIRouter(prefix="/analytics", tags=["analytics"])



@router.get("/total-expenditure")
def get_total_expenditure(current_user: User = Depends(get_current_user)):
    db = SessionLocal()

    total = db.query(func.sum(Expense.amount)).filter(Expense.user_id == current_user.id).scalar()
    
    db.close()
    return {"total_expenditure": total or 0}



@router.get("/monthly_expenditure/{year}/{month}")
def get_monthly_expenditure(year: int, month: int, current_user: User = Depends(get_current_user)):

    if not (1 <= month <= 12):
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")
    
    db = SessionLocal()
    total = db.query(func.sum(Expense.amount)).filter(
        func.extract('year', Expense.purchase_date) == year,
        func.extract('month', Expense.purchase_date) == month,
        Expense.user_id == current_user.id
    ).scalar()

    if total is None:
        total = 0.0
    db.close()
    return {"monthly_expenditure": total}



@router.get("/category_expenditure/{category}")
def get_category_expenditure(category: str, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    total = db.query(func.sum(Expense.amount)).filter(
            Expense.category == category,
            Expense.user_id == current_user.id
        ).scalar()

    if total is None:
        total = 0.0
    db.close()
    return {"category_expenditure": total}



@router.get("/merchant_expenditure/{merchant}")
def get_merchant_expenditure(merchant: str, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    total = db.query(func.sum(Expense.amount)).filter(
            Expense.merchant == merchant,
            Expense.user_id == current_user.id
        ).scalar()

    if total is None:
        total = 0.0
    db.close()
    return {"merchant_expenditure": total}



@router.get("/category_breakdown")
def get_category_breakdown(current_user: User = Depends(get_current_user)):
    db = SessionLocal()

    category_totals = db.query(
        Expense.category,
        func.sum(Expense.amount)
        ).filter(
            Expense.user_id == current_user.id
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


@router.get("/view_all_expenses")
def view_all_expenses():
    db = SessionLocal()

    expenses = db.query(Expense).all()

    result = []

    for expense in expenses:
        result.append({
            "merchant": expense.merchant,
            "amount": expense.amount,
            "category": expense.category,
            "purchase_date": expense.purchase_date
        })

    db.close()

    return result