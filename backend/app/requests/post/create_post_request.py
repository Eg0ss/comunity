from pydantic import BaseModel


class CreatePostRequest(BaseModel):
    title: str
    content: str
    status: str = "published"
    category_ids: list[int] = []
