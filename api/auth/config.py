from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path


class AuthConfig(BaseSettings):

    auth_domain: str = Field(validation_alias="AUTH0_DOMAIN")
    auth_client_id: str = Field(validation_alias="AUTH0_CLIENT_ID")
    auth_client_secret: str = Field(validation_alias="AUTH0_CLIENT_SECRET")
    app_secret: str = Field(validation_alias="APP_SECRET")
    app_url: str = Field("http://localhost:9000", validation_alias="APP_URL")
    api_url: str = Field("http://localhost:8000", validation_alias="API_URL")
    algorithm: str = Field("RS256", validation_alias="algorithm")

    model_config = SettingsConfigDict(env_file=Path(__file__).parent.joinpath(".env"))


if __name__ == "__main__":
    print(AuthConfig().auth_domain)
