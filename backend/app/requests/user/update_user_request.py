from pydantic import BaseModel


class UpdateUserRequest(BaseModel):
    full_name: str | None = None
    username: str | None = None
    avatar_url: str | None = None
