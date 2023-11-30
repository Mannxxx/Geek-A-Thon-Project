import logging

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class Logger(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next) -> Response:
        logging.warning(f"{request.url}[{request.method }]")
        return await call_next(request)
