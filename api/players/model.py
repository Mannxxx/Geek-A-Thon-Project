from __future__ import annotations

import asyncio
from asyncpg.prepared_stmt import PreparedStatement
from pydantic import BaseModel, EmailStr, Field
from database import Table, DataBase as DB
from typing import Optional
import datetime
from uuid import UUID
from enum import Enum


class Sex(str, Enum):
    M = "M"
    F = "F"


class PlayerModel(BaseModel):
    class Config:
        underscore_attrs_are_private = True

    name: str = Field(..., title="Name", description="Name of the player")
    country: str = Field(..., title="Country", description="Player's Country")
    dob: datetime.date = Field(..., title="Date of Birth", description="Date of Birth of Player")
    sex: Sex = Field(..., title="Sex", description="Sex of the Player")
    height: int = Field(..., title="Height", description="Height of the player")
    sport_id: UUID = Field(..., title="Sport ID", description="SPORT ID")


class AddPlayer(PlayerModel):
    ...


class GetPlayer(PlayerModel):
    player_id: UUID = Field(..., title="Stream ID", description="ID of stream")
    sport_name: str = Field(..., title="Sport ID", description="Sport Name")


class Player(Table):
    __get_player: PreparedStatement
    __get_players: PreparedStatement
    __get_player_by_sport: PreparedStatement
    __get_player_by_id: PreparedStatement

    _instance: Like

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Comment, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    async def prepare_stmt(cls):
        cls.__create_player = await DB.connection.prepare(
            "INSERT INTO players (name, country, dob, sex, height, sport_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id")
        cls.__get_player_by_sport = await DB.connection.prepare(
            "SELECT p.*, s.name AS sport_name  FROM players p INNER JOIN sports s on s.id = p.sport_id WHERE p.sport_id=$1")
        cls.__get_player_by_id = await DB.connection.prepare(
            "SELECT p.*, s.name AS sport_name  FROM players p INNER JOIN sports s on s.id = p.sport_id WHERE p.id=$1")

        cls.__get_players = await DB.connection.prepare("SELECT * FROM players")

    @classmethod
    async def create_player(cls, player: AddPlayer) -> int:
        return {"id": await cls.__create_like.fetchval(player.name, player.country, player.dob, player.sex, player.height, player.sport_id)}

    @classmethod
    async def players(cls):
        return cls._get_players(await cls.__get_players.fetch())

    @classmethod
    async def player_by_sport_id(cls, sport_id: UUID):
        return cls._get_players(await cls.__get_player_by_sport.fetch(sport_id))

    @classmethod
    async def player_by_id(cls, player_id: UUID):
        return cls._get_players(await cls.__get_player_by_id.fetch(player_id))

    @classmethod
    def _get_players(cls, players) -> List[GetPlayer]:

        return [GetPlayer(player_id=player["id"], name=player["name"], country=player["country"],
                          dob=player["dob"], sex=player["sex"], height=player["height"],
                          sport_id=player["sport_id"], sport_name=player["sport_name"]) for player in players]
