# app/models/post_file.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class PostFile(Base):
    __tablename__ = "post_files"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    file_url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # "image", "video", "document"
    original_name = Column(String, nullable=True)
    size_kb = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("Post", back_populates="files")