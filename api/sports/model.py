from __future__ import annotations

import asyncio
from asyncpg.prepared_stmt import PreparedStatement
from pydantic import BaseModel, EmailStr, Field
from database import Table, DataBase as DB
from typing import Optional
import datetime
from uuid import UUID


class SportModel(BaseModel):
    class Config:
        underscore_attrs_are_private = True

    name: str = Field(..., title="Sport Name", description="Sport Name")
    desc: str = Field(..., title="Sport Description", description="Description of the Sport")
    players: int = Field(..., title="Players", description="Number of Players")


class AddSport(SportModel):
    ...


class GetSport(SportModel):
    sport_id: UUID = Field(..., title="Sport Id", description="ID of the SPORT")


class Sport(Table):
    __get_sport: PreparedStatement
    __get_sports: PreparedStatement
    __create_sport: PreparedStatement

    _instance: Like

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Comment, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    async def prepare_stmt(cls):
        cls.__create_sport = await DB.connection.prepare(
            'INSERT INTO sports (name, "desc", players) VALUES ($1, $2, $3) RETURNING id')
        cls.__get_sport = await DB.connection.prepare("SELECT * FROM sports WHERE id=$1")
        cls.__get_sports = await DB.connection.prepare("SELECT * FROM sports")

    @classmethod
    async def create_sport(cls, sport: AddSport) -> int:
        return {"id": await cls.__create_sport.fetchval(sport.name, sport.desc, sport.players)}

    @classmethod
    async def sport_by_id(cls, sport_id: UUID):
        return cls._get_sports(await cls.__get_sport.fetch(sport_id))

    @classmethod
    async def sports(cls):
        return cls._get_sports(await cls.__get_sports.fetch())

    @classmethod
    def _get_sports(cls, sports) -> List[GetSport]:
        return [GetSport(sport_id=sport["id"], name=sport["name"], desc=sport["desc"], players=sport["players"]) for sport in sports]
