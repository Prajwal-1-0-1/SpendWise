from fastapi import FastAPI
from app.database import engine
from app.models import Base
from app.analytics import router as analytics_router
from app.crud import router as crud_router
from app.auth_routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://spend-wise-.*-dinnerbone\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(analytics_router)
app.include_router(auth_router)
app.include_router(crud_router)
Base.metadata.create_all(bind=engine)




