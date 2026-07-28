# app/models/like.py

from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Empêche un même utilisateur de liker 2x le même post
    __table_args__ = (UniqueConstraint("post_id", "user_id", name="unique_user_post_like"),)

    post = relationship("Post", back_populates="likes")
    user = relationship("User", back_populates="likes")