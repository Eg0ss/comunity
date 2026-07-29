from app.models.category import Category


def category_resource(cat: Category) -> dict:
    return {
        "id": cat.id,
        "name": cat.name,
        "slug": cat.slug,
    }
