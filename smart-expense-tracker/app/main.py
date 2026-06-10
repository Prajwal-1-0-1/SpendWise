from fastapi import FastAPI, UploadFile, File,HTTPException
from app.database import engine,SessionLocal
from app.models import Base,Expense
from app.services.gemini_service import parse_receipt
from app.analytics import router as analytics_router
from app.crud import router as crud_router
import os


app = FastAPI()
app.include_router(analytics_router)
app.include_router(crud_router)




