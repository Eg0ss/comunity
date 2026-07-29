from sqlalchemy.orm import Session
from app.models.user import User
from app.resources.user.user_resource import user_resource


class ListUsersAction:
    def execute(self, db: Session) -> list:
        users = db.query(User).all()
        return [user_resource(u) for u in users]
