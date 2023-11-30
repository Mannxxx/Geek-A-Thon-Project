from __future__ import annotations

from pydantic import BaseModel, model_validator
from enum import Enum


class SexEnum(str, Enum):
    M = "M"
    F = "F"


class Player(BaseModel):
    sex: SexEnum
    age: int
    height: float
    weight: float
    country: str
    season: str
    sport: str

    @model_validator(mode="after")
    def update_fields(self) -> Player:
        if len(self.country) > 3:
            self.country = self.country.lower().capitalize()
        else:
            self.country = self.country.upper()
        self.season = self.season.lower().capitalize()
        self.sport = self.sport.lower().capitalize()
        return self
