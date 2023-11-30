from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path


class TweetScraperConfig(BaseSettings):
    scraper_url: str = Field(validation_alias="API_URL")
    api_key: str = Field(validation_alias="API_KEY")

    model_config = SettingsConfigDict(env_file=Path(__file__).parent.joinpath(".env"))
