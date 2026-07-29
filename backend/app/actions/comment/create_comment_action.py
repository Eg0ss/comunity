from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.models.post import Post
from app.requests.comment.create_comment_request import CreateCommentRequest
from app.resources.comment.comment_resource import comment_resource


class CreateCommentAction:
    def execute(self, db: Session, user_id: int, post_id: int, req: CreateCommentRequest) -> dict:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise ValueError("Article introuvable")

        if req.parent_comment_id:
            parent = db.query(Comment).filter(Comment.id == req.parent_comment_id, Comment.post_id == post_id).first()
            if not parent:
                raise ValueError("Commentaire parent introuvable")

        comment = Comment(
            post_id=post_id,
            user_id=user_id,
            parent_comment_id=req.parent_comment_id,
            content=req.content,
        )
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return comment_resource(comment)
