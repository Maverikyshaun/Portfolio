from fastapi import APIRouter

from app.api.routes import inquiries, portfolio

api_router = APIRouter()
api_router.include_router(portfolio.router)
api_router.include_router(inquiries.router)
