from pydantic import BaseModel
from datetime import date

class UserCreate(BaseModel):
    username: str
    password: str

class ExpenseUpdate(BaseModel):
    merchant: str
    amount: float
    category: str
    purchase_date: date     