from pydantic import BaseModel
from datetime import date

class UserCreate(BaseModel):
    username: str
    password: str

class ExpenseCreate(BaseModel):
    merchant: str
    amount: float
    category: str
    purchase_date: date

class ExpenseUpdate(BaseModel):
    merchant: str
    amount: float
    category: str
    purchase_date: date     