from pydantic import BaseModel


class CreateCommentRequest(BaseModel):
    user_id: int
    content: str
    parent_comment_id: int | None = None
