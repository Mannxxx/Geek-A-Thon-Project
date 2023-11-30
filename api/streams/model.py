from __future__ import annotations

from pydantic import BaseModel, EmailStr
from database import Table, DataBase as DB
import datetime
from asyncpg.prepared_stmt import PreparedStatement
from typing import List, Optional
from uuid import UUID
from enum import Enum


class StreamModel(BaseModel):
    stream_url: str


class StreamPrivacy(str, Enum):
    public = "public"  # video will be visible to everyone
    private = "private"  # video will be only visible to you
    unlisted = "unlisted" # video will be only visible to people with link


class CreateStream(StreamModel):
    privacy: Optional[StreamPrivacy] = StreamPrivacy.public


class GetStream(StreamModel):
    stream_id: UUID
    views: int
    start_time: datetime.datetime
    likes: int
    liked: bool


class Stream(Table):
    __create_stream: PreparedStatement
    __get_stream_by_id: PreparedStatement

    _instance: Stream

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Stream, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    async def prepare_stmt(cls):
        cls.__create_stream = await DB.connection.prepare("INSERT INTO streams (stream_url, views, privacy) VALUES ($1, 0, $2) RETURNING id")
        cls.__get_stream_by_id = await DB.connection.prepare("SELECT s.*, COALESCE(l.like_count, 0) AS likes, CASE WHEN l.stream_id IS NOT NULL THEN 1 ELSE 0 END AS liked FROM streams s LEFT JOIN (SELECT stream_id, COUNT(likes.id) AS like_count FROM likes WHERE email=$1 GROUP BY stream_id) l ON s.id = l.stream_id WHERE s.id=$2;")

    @classmethod
    async def create_stream(cls, stream: CreateStream):
        return {"id": await cls.__create_stream.fetchval(stream.stream_url, stream.privacy)}

    @classmethod
    async def get_stream_by_id(cls, email: EmailStr, stream_id: int) -> List[GetStream]:
        stream = await cls.__get_stream_by_id.fetchrow(email, stream_id)
        return [GetStream(stream_id=stream["id"], stream_url=stream["stream_url"], views=stream["views"],
                          likes=stream["likes"], start_time=stream["start_time"], liked=stream["liked"])]
