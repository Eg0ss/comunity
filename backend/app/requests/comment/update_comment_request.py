from pydantic import BaseModel


class UpdateCommentRequest(BaseModel):
    user_id: int
    content: str
