from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path


class StreamConfig(BaseSettings):

    access_token: str = Field(validation_alias="ACCESS_TOKEN")
    client_identifier: str = Field(validation_alias="CLIENT_IDENTIFIER")
    client_secret_key: str = Field(validation_alias="CLIENT_SECRET")

    model_config = SettingsConfigDict(env_file=Path(__file__).parent.joinpath(".env"))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


if __name__ == "__main__":
    ...
