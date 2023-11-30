from fastapi import APIRouter, Depends, status
from api.auth.token import VerifyToken
from fastapi.responses import JSONResponse
from .model import Player, GetPlayer, AddPlayer
from uuid import UUID
from typing import List


player_route = APIRouter(tags=["player", ], default_response_class=JSONResponse, dependencies=[Depends(VerifyToken().verify)])


@player_route.get("/player/{player_id}", status_code=status.HTTP_200_OK)
async def get_player_by_id(player_id: UUID) -> List[GetPlayer]:
    """
    Get Player By ID
    :param player_id: ID of the Player
    """

    return await Player.player_by_id(player_id=player_id)


@player_route.get("/players/sport/{sport_id}", status_code=status.HTTP_200_OK)
async def get_player_by_sport_id(sport_id: UUID) -> List[GetPlayer]:
    """
    Get Player By sport_id
    :param sport_id: sport id of the player
    """

    return await Player.player_by_sport_id(sport_id=sport_id)


@player_route.get("/players", status_code=status.HTTP_200_OK)
async def create_player(page_no: int = 1):
    return await Player.players()


@player_route.post("/player", status_code=status.HTTP_201_CREATED)
async def create_player(player: AddPlayer):
    return await Player.create_player(player)

