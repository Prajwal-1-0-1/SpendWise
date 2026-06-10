from fastapi import FastAPI, UploadFile, File,HTTPException
from app.database import engine,SessionLocal
from app.models import Base,Expense
from app.services.gemini_service import parse_receipt
import os


app = FastAPI()
Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)



@app.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):
    db = SessionLocal()

    filepath = f"uploads/{file.filename}"

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())



    receipt_data = parse_receipt(filepath)

    
    expense = Expense(
    merchant=receipt_data["merchant"],
    amount=receipt_data["amount"],
    category=receipt_data["category"],
    purchase_date=receipt_data["purchase_date"]
)

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense

@app.get("/expenses")
def get_expenses():
    db = SessionLocal()
    expenses = db.query(Expense).all()
    return expenses


@app.get(f"/expenses/{id}")
def get_expense(id: int):
    db = SessionLocal()
    expense = db.query(Expense).filter(Expense.id == id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    return expense

@app.delete("/expenses/{id}")
def delete_expense(id: int):
    db = SessionLocal()
    expense = db.query(Expense).filter(Expense.id == id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(expense)
    db.commit()

    return {"message": "Expense deleted successfully"}




