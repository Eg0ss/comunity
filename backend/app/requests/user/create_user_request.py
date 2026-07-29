from pydantic import BaseModel, EmailStr


class CreateUserRequest(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str
