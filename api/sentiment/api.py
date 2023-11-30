from .model import GetSentiment, Sentiment
from models import get_sentiment
from fastapi import Response, APIRouter, status, Depends
from fastapi.responses import PlainTextResponse
from api.auth.token import VerifyToken
from typing import Dict


sentiment_route = APIRouter(tags=["sentiment"])

sentiment_cache: Dict[str, Dict[str, float]] = {}


@sentiment_route.get("/sentiment")
async def predict_medals(event: str, token_data=Depends(VerifyToken().verify)):
    if event in sentiment_cache:
        return Sentiment(**sentiment_cache[event])
    sentiment: Dict[str, float] = get_sentiment(event)
    sentiment_cache[event] = sentiment
    return Sentiment(**sentiment)
