from fastapi import Response, APIRouter, status, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from api.auth.token import VerifyToken
from stats import Player, Sport, Country, Season, Year
import json
import numpy as np
from typing import Any


class NumpyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()  # Convert numpy arrays to lists
        return super().default(obj)


class CustomJsonResponse(JSONResponse):
    def render(self, content: Any) -> bytes:
        return json.dumps(
            content,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"), cls=NumpyJSONEncoder
        ).encode("utf-8")


stats_route = APIRouter(tags=["stats"],
                        prefix="/stats", dependencies=[Depends(VerifyToken().verify)])


@stats_route.get("/player")
async def stats_by_player(player: str, filter: str):
    """
    filters: [total_medals, medals_by_event, medals_by_year
    """
    if not hasattr(Player, filter):
        return CustomJsonResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": "Invalid Filter"})

    return CustomJsonResponse(getattr(Player(player), filter)())


@stats_route.get("/country")
async def stats_by_country(country: str, filter: str):
    """
    filter: medals_by_year, medals_by_sport, top_performers
    """
    if not hasattr(Country, filter):
        return CustomJsonResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": "Invalid Filter"})
    return CustomJsonResponse(getattr(Country(country), filter)())


@stats_route.get("/season")
async def stats_by_season(season: str, filter: str):
    """
        filter: [medals_by_country]
        """
    if not hasattr(Season, filter):
        return CustomJsonResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": "Invalid Filter"})

    return CustomJsonResponse(getattr(Season(season), filter)())


@stats_route.get("/year")
async def stats_by_year(year: int, filter: str):
    """
        filter: [medals_by_country, top_performers]
        """
    if not hasattr(Year, filter):
        return CustomJsonResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": "Invalid Filter"})

    return CustomJsonResponse(getattr(Year(year), filter)())


@stats_route.get("/sport")
async def stats_by_sport(sport: str, filter: str):
    """
        filter: [medals_by_country]
        """
    if not hasattr(Sport, filter):
        return CustomJsonResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": "Invalid Filter"})

    return CustomJsonResponse(getattr(Sport(sport), filter)())

