from pydantic import BaseModel


class UpdateCommentRequest(BaseModel):
    content: str
