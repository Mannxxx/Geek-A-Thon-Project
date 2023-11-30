from __future__ import annotations

import asyncio
from asyncpg.prepared_stmt import PreparedStatement
from pydantic import BaseModel, EmailStr, Field
from database import Table, DataBase as DB
from typing import Optional, List, Dict, Any
import datetime
from uuid import UUID
from ..players.model import GetPlayer
import json


class EventModel(BaseModel):
    class Config:
        underscore_attrs_are_private = True

    event_type: UUID = Field(..., title="event_type", description="Type of Event")
    stream_id: UUID = Field(..., title="Stream ID", description="ID of the stream")
    sport_id: UUID = Field(..., title="Sport ID", description="ID of the Sport")
    location: str = Field(..., title="Location", description="Location of the event")
    event_name: Optional[str] = Field(..., title="Event Name", description="Event Name")


class CreateEvent(EventModel):
    players: List[UUID] = Field(..., title="Players", description="List of Players")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.event_name:
            self.event_name = f"len({self.players} At {self.location})"


class GetEvent(EventModel):
    event_id: UUID = Field(..., title="Event Id", description="ID of the Event")
    event_type: str = Field(..., title="event_type", description="Type of Event")
    players: List[Dict[str, Any]]
    date: datetime.datetime


class _GetEvent(EventModel):
    event_type: str = Field(..., title="event_type", description="Type of Event")
    event_id: UUID = Field(..., title="Event Id", description="ID of the Event")
    date: datetime.datetime


class EventType(BaseModel):
    event_type_id: UUID
    event_name: str


class Event(Table):
    __get_events: PreparedStatement
    __get_event: PreparedStatement
    __create_event: PreparedStatement
    __get_event_types: PreparedStatement
    __create_pin: PreparedStatement

    _instance: Event

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Comment, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    async def prepare_stmt(cls):
        cls.__create_event = await DB.connection.prepare(
            'INSERT INTO events ("type", stream_id, sport_id, location) VALUES ($1, $2, $3, $4) RETURNING id'
        )

        cls.__get_event = await DB.connection.prepare(
            "SELECT e.id AS event_id, e.stream_id as stream_id, e.sport_id as sport_id, et.name AS event_type, e.name as event_name, e.location as location, e.date AS event_date, json_agg(json_build_object('player_id', p.id, 'name', p.name, 'country', p.country, 'dob', p.dob, 'sex', p.sex, 'height', p.height)) AS players FROM events e JOIN event_types et ON e.type = et.id LEFT JOIN players_in_event pie ON e.id = pie.event_id LEFT JOIN players p ON pie.player_id = p.id WHERE e.id = $1 GROUP BY e.id, et.name, e.stream_id, e.sport_id, e.name, e.location, e.date;"
        )

        cls.__get_events = await DB.connection.prepare(
            "SELECT e.id AS id, e.name AS event_name, e.sport_id AS sport_id, e.stream_id AS stream_id, e.date AS date, e.location AS location, et.name AS event_type FROM events e JOIN event_types et ON e.type = et.id;"
        )
        cls.__get_event_types = await DB.connection.prepare("SELECT * from event_types")
        cls.__create_pin = await DB.connection.prepare(
            "INSERT into players_in_event (event_id, player_id) VALUES ($1, $2)"
        )

    @classmethod
    async def create_event(cls, event: CreateEvent) -> UUID:
        event_id = await cls.__create_event.fetchval(
            event.event_type, event.stream_id, event.sport_id, event.location
        )
        await cls.__create_pin.executemany(
            [(event_id, player) for player in event.players]
        )
        return {"id": event_id}

    @classmethod
    async def event_by_id(cls, event_id: UUID):
        return cls._get_event(await cls.__get_event.fetch(event_id))

    @classmethod
    async def events(cls):
        return cls._get_events(await cls.__get_events.fetch())

    @classmethod
    async def event_types(cls) -> List[EventType]:
        events = await cls.__get_event_types.fetch()
        return [
            EventType(event_type_id=event["id"], event_name=event["name"])
            for event in events
        ]

    @classmethod
    def _get_event(cls, events) -> GetEvent:
        return [
            GetEvent(
                event_id=event["event_id"],
                event_type=event["event_type"],
                event_name=event["event_name"],
                stream_id=event["stream_id"],
                sport_id=event["sport_id"],
                location=event["location"],
                date=event["event_date"],
                players=json.loads(event["players"]),
            )
            for event in events
        ]

    @classmethod
    def _get_events(cls, events) -> List[_GetEvent]:
        return [
            _GetEvent(
                event_id=event["id"],
                event_type=event["event_type"],
                event_name=event["event_name"],
                stream_id=event["stream_id"],
                sport_id=event["sport_id"],
                location=event["location"],
                date=event["date"],
            )
            for event in events
        ]
