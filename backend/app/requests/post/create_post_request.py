from pydantic import BaseModel


class CreatePostRequest(BaseModel):
    user_id: int
    title: str
    content: str
    status: str = "published"
    category_ids: list[int] = []
