from fastapi import APIRouter,Depends,HTTPException
from app.models import User
from app.schemas import UserCreate
from app.database import SessionLocal
from app.auth import hash_password
from app.auth import (verify_password,create_access_token)
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(tags=["Auth"])

@router.post("/register")
def register(user: UserCreate):


    db = SessionLocal()

    existing = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing:
        return {"message": "User already exists"}

    new_user = User(
        username=user.username,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    db = SessionLocal()

    db_user = db.query(User).filter(
        User.username == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(status_code=401,detail="Invalid credentials")

    if not verify_password(form_data.password,db_user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid credentials")

    token = create_access_token(
        {"sub": str(db_user.id)}
    )
    

    db.close()

    return {
        "access_token": token,
        "token_type": "bearer"
    }