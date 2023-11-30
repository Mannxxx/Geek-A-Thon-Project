from __future__ import annotations

import asyncio
from asyncpg.prepared_stmt import PreparedStatement
from pydantic import BaseModel, EmailStr, Field
from database import Table, DataBase as DB
from typing import Optional
import datetime
from uuid import UUID


class LikeModel(BaseModel):
    class Config:
        underscore_attrs_are_private = True

    stream_id: UUID = Field(..., title="Stream ID", description="ID of stream")


class AddLike(LikeModel):
    _email: EmailStr = Field(..., title="email", description="User Email")


class GetLike(LikeModel):
    like_id: UUID = Field(..., title="Like ID", description="ID of Like")
    email: EmailStr
    created_at: Optional[datetime.datetime] = Field(..., title="Liked At", description="Time at which stream is liked")


class Like(Table):
    __create_like: PreparedStatement
    __delete_like: PreparedStatement

    _instance: Like

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Comment, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    async def prepare_stmt(cls):
        cls.__create_like = await DB.connection.prepare("INSERT INTO likes (stream_id, email) VALUES ($1, $2) RETURNING id")
        cls.__delete_like = await DB.connection.prepare("DELETE FROM likes WHERE id=$1 AND email=$2")

    @classmethod
    async def create_like(cls, like: AddLike) -> int:
        return {"id": await cls.__create_like.fetchval(like.stream_id, like._email)}

    @classmethod
    async def delete_like(cls, like_id: UUID, email: EmailStr):
        await cls.__delete_like.fetch(like_id, email)
