from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path
import logging
import asyncpg
from typing import List
import asyncio


class DataBaseConfig(BaseSettings):
    username: str = Field(validation_alias="DB_ROOT_USER")
    password: str = Field(validation_alias="DB_ROOT_PASSWORD")
    crt_path: str = Field(validation_alias="CERTIFICATE_PATH")

    model_config = SettingsConfigDict(env_file=Path(__file__).parent.joinpath(".env"))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.crt_path = Path(__file__).parent.joinpath(self.crt_path)


class DataBase:
    config = DataBaseConfig()
    conn_str = f"postgresql://{config.username}:{config.password}@olympus-3157.7s5.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert={config.crt_path}"
    connection: asyncpg.connection.Connection = None
    sql_file: str | Path = Path(__file__).parent.joinpath("sql/olympus.sql")

    def __init__(self):
        logging.info("DB class in initialized")

    @classmethod
    async def connect(cls):
        if not cls.connection:
            cls.connection = await asyncpg.connect(cls.conn_str)
            # Set the multiple_active_portals_enabled session variable to true
            await cls.connection.execute("SET multiple_active_portals_enabled = true")

        logging.info("successfully connected to DataBase :)")

    @classmethod
    async def close(cls):
        if cls.connection:
            await cls.connection.close()

    @classmethod
    async def migrate(cls):
        if not cls.connection:
            await cls.connect()
        with open(cls.sql_file, "r") as sql_file:
            try:
                await cls.connection.execute(sql_file.read())
                logging.info("Migrated Successfully")
            except asyncpg.PostgresError as error:
                raise error


class Table:
    subs: List[Table] = []

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        cls.subs.append(cls)

    @classmethod
    async def prepare_stmt(cls):
        logging.info("Preparing statements fo tables ")

        """
        using loop, because cockroachDB is not allowing async preparations
        """
        for sub in cls.subs:
            await sub.prepare_stmt()
        # await asyncio.gather(*[sub.prepare_stmt() for sub in cls.subs])


if __name__ == "__main__":
    import asyncio
    asyncio.get_event_loop().run_until_complete(DataBase.connect())
    DataBase()
