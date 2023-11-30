from .model import Player
from models import predict_medal
from fastapi import Response, APIRouter, status, Depends
from fastapi.responses import PlainTextResponse
from api.auth.token import VerifyToken


predict_route = APIRouter(tags=["predict"])


@predict_route.post("/predict")
async def predict_medals(player: Player, token_data=Depends(VerifyToken().verify)):
    return {"prediction": predict_medal(**player.model_dump())}
