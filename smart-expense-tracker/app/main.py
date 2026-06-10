from fastapi import FastAPI, UploadFile, File
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



@app.post("/test-expense")
def test_expense():
    db = SessionLocal()

    expense = Expense(
        merchant="Dominos",
        amount=500,
        category="Food",
        purchase_date="2026-06-05"
    )

    db.add(expense)
    db.commit()

    return {"message": "saved"}


