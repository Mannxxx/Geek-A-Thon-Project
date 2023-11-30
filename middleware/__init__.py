import logging

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import traceback
from exceptions import StatsException, JWTException


class ErrorHandler(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next) -> Response:
        try:
            return await call_next(request)
        except JWTException as err:
            return JSONResponse(content={"error": err.__str__()}, status_code=401)
        except StatsException as err:
            return JSONResponse(content={"error": err.__str__()}, status_code=400)
        except Exception as exc:
            logging.error(traceback.print_exc())
            logging.error(exc)
            return JSONResponse(content={"error": exc.__str__()}, status_code=500)
