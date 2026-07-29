from pydantic import BaseModel


class CreateCommentRequest(BaseModel):
    content: str
    parent_comment_id: int | None = None
