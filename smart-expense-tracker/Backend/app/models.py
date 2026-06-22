from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)
    merchant = Column(String,index=True)
    amount = Column(Float,index=True)
    category = Column(String,index=True)
    purchase_date = Column(Date,index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="expenses")


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True)
    image_path = Column(String)
    uploaded_at = Column(DateTime)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    expenses = relationship("Expense", back_populates="user")