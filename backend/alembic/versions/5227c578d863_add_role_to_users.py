"""add role to users

Revision ID: 5227c578d863
Revises: 0a06949072ca
Create Date: 2026-07-30 09:23:09.052714

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5227c578d863'
down_revision: Union[str, Sequence[str], None] = '0a06949072ca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column('role', sa.String(), nullable=False, server_default='user')
    )

def downgrade() -> None:
    op.drop_column('users', 'role')
