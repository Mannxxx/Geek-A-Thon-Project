from fastapi import APIRouter, Depends, status
from api.auth.token import VerifyToken
from fastapi.responses import JSONResponse
from .model import Sport, GetSport, AddSport
from uuid import UUID
from typing import List


sport_route = APIRouter(tags=["sport", ], default_response_class=JSONResponse, dependencies=[Depends(VerifyToken().verify)])


@sport_route.get("/sport/{sport_id}", status_code=status.HTTP_200_OK)
async def get_sport_by_id(sport_id: UUID) -> List[GetSport]:
    """
    Get SPORT By ID
    :param sport_id: ID of the SPORT
    """

    return await Sport.sport_by_id(sport_id=sport_id)


@sport_route.get("/sports", status_code=status.HTTP_200_OK)
async def get_sport_by_id() -> List[GetSport]:

    return await Sport.sports()


@sport_route.post("/sport", status_code=status.HTTP_201_CREATED)
async def create_sport(sport: AddSport, token_data: str = Depends(VerifyToken().verify)):
    return await Sport.create_sport(sport)
