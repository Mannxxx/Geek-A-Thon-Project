from fastapi import APIRouter, Depends, status
from api.auth.token import VerifyToken
from fastapi.responses import JSONResponse
from uuid import UUID
from .model import CreateEvent, Event, GetEvent, _GetEvent
from typing import List, Dict


event_route = APIRouter(
    tags=[
        "event",
    ],
    dependencies=[
        Depends(VerifyToken().verify),
    ],
)


@event_route.get("/event/types")
async def get_event_types():
    return await Event.event_types()


@event_route.get("/events")
async def get_events() -> List[_GetEvent]:
    return await Event.events()


@event_route.post("/event")
async def add_event(event: CreateEvent) -> Dict[str, str | UUID]:
    return await Event.create_event(event)


@event_route.get("/event/{event_id}")
async def get_event_by_id(event_id: UUID) -> List[GetEvent]:
    return await Event.event_by_id(event_id)
