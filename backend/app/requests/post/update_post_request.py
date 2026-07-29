from pydantic import BaseModel


class UpdatePostRequest(BaseModel):
    user_id: int
    title: str | None = None
    content: str | None = None
    status: str | None = None
    category_ids: list[int] | None = None
