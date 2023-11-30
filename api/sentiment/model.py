from pydantic import BaseModel


class Sentiment(BaseModel):
    sentiment: str
    score: float


class GetSentiment(BaseModel):
    event: str
