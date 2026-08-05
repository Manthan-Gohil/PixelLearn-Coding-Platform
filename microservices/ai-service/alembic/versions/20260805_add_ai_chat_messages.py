"""add ai chat messages

Revision ID: 20260805_ai_chat
Revises:
Create Date: 2026-08-05
"""
from alembic import op
import sqlalchemy as sa

revision = "20260805_ai_chat"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("ai_chat_messages", sa.Column("id", sa.String(36), primary_key=True), sa.Column("user_id", sa.String(128), nullable=False), sa.Column("conversation_id", sa.String(128), nullable=False), sa.Column("role", sa.String(20), nullable=False), sa.Column("content", sa.Text(), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")))
    op.create_index("ix_ai_chat_messages_user_id", "ai_chat_messages", ["user_id"])
    op.create_index("ix_ai_chat_messages_conversation_id", "ai_chat_messages", ["conversation_id"])


def downgrade() -> None:
    op.drop_table("ai_chat_messages")
