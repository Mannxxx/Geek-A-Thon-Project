from __future__ import annotations

import asyncio
from asyncpg.prepared_stmt import PreparedStatement
from pydantic import BaseModel, EmailStr
from database import Table, DataBase as DB
from typing import Optional
import datetime
from uuid import UUID


class CommentModel(BaseModel):
    class Config:
        underscore_attrs_are_private = True

    stream_id: UUID
    content: str


class AddComment(CommentModel):
    _email: EmailStr
    parent_comment_id: Optional[UUID] | None = None


class GetComment(CommentModel):
    comment_id: UUID
    parent_comment_id: UUID | None = None
    email: EmailStr
    commented_at: Optional[datetime.datetime] = None


class Comment(Table):
    __create_cmt: PreparedStatement
    __get_cmt_by_id: PreparedStatement
    __get_cmt_by_stream: PreparedStatement
    __delete_cmt: PreparedStatement

    _instance: Comment

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Comment, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    async def prepare_stmt(cls):
        cls.__create_cmt = await DB.connection.prepare(
            "INSERT INTO comments (parent_comment_id, email, stream_id, content) VALUES ($1, $2, $3, $4) RETURNING id")
        cls.__get_cmt_by_id = await DB.connection.prepare("SELECT * FROM comments WHERE id=$1")
        cls.__get_cmt_by_stream = await DB.connection.prepare("SELECT * FROM comments WHERE stream_id=$1")
        cls.__delete_cmt = await DB.connection.prepare("DELETE FROM comments WHERE id=$1 AND email=$2")

    @classmethod
    async def create_comment(cls, comment: AddComment) -> int:
        return {"id": await cls.__create_cmt.fetchval(comment.parent_comment_id, comment._email, comment.stream_id,
                                                      comment.content)}

    @classmethod
    async def get_comment(cls, stream_id: UUID = None, comment_id: UUID = None) -> List[GetComment]:
        if stream_id:
            comments = await cls.__get_cmt_by_stream.fetch(stream_id)
        else:
            comments = await cls.__get_cmt_by_id.fetch(comment_id)

        return [GetComment(comment_id=comment["id"], parent_comment_id=comment["parent_comment_id"],
                           email=comment["email"], stream_id=comment["stream_id"],
                           content=comment["content"], commented_at=comment["commented_at"]) for comment in comments]

    @classmethod
    async def delete_comment(cls, comment_id: str, email: EmailStr):
        await cls.__delete_cmt.fetch(comment_id, email)
