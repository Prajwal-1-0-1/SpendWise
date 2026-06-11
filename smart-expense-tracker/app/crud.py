from fastapi import APIRouter, Depends, FastAPI, UploadFile, File,HTTPException
from app.database import engine,SessionLocal
from app.models import Base,Expense, User
from app.auth import get_current_user, oauth2_scheme
from app.services.gemini_service import parse_receipt
import os



router = APIRouter(prefix="/crud", tags=["crud"])


os.makedirs("uploads", exist_ok=True)


@router.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...),current_user: User = Depends(get_current_user)):
    db = SessionLocal()

    filepath = f"uploads/{file.filename}"

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())



    try:
        receipt_data = parse_receipt(filepath)
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)
    
    
    expense = Expense(
    merchant=receipt_data["merchant"],
    amount=receipt_data["amount"],
    category=receipt_data["category"],
    purchase_date=receipt_data["purchase_date"],
    user_id=current_user.id
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)
    db.close()  

    return expense




@router.get("/get_expenses")
def get_expenses(current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    

    expenses = db.query(Expense).filter(
               Expense.user_id == current_user.id,
               ).all()
    
    db.close()

    return expenses




@router.get("/get_expense/{id}")
def get_expense(id: int, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    expense = db.query(Expense).filter(
            Expense.id == id,
            Expense.user_id == current_user.id
            ).first()
    
    db.close()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    return expense



@router.delete("/delete_expenses/{id}")
def delete_expense(id: int,current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    expense = db.query(Expense).filter(
                Expense.id == id,
                Expense.user_id == current_user.id
            ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(expense)
    db.commit()
    db.close()

    return {"message": "Expense deleted successfully"}

