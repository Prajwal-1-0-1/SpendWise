from fastapi import FastAPI, UploadFile, File,HTTPException
from sqlalchemy import func
from app.database import engine,SessionLocal
from app.models import Base,Expense
import os

app = FastAPI()
Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)

@app.get("/analytics/total-expenditure")
def get_total_expenditure():
    db = SessionLocal()
    total = db.query(Expense).with_entities(func.sum(Expense.amount)).scalar()
    return {"total_expenditure": total}