from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from app.models.category import Category
from app.resources.category.category_resource import category_resource

router = APIRouter()


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).order_by(Category.name).all()
    return [category_resource(c) for c in cats]
