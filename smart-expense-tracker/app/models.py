from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from .database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)
    merchant = Column(String)
    amount = Column(Float)
    category = Column(String)
    purchase_date = Column(Date)


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True)
    image_path = Column(String)
    uploaded_at = Column(DateTime)