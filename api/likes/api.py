from fastapi import APIRouter, Depends, status
from api.auth.token import VerifyToken
from fastapi.responses import JSONResponse
from .model import Like, AddLike
from uuid import UUID


like_route = APIRouter(tags=["like", ], default_response_class=JSONResponse)


@like_route.post("/like", status_code=status.HTTP_201_CREATED)
async def create_like(like: AddLike, token_data: str = Depends(VerifyToken().verify)):
    """
    Create a Like
    """

    like._email = token_data["email"]
    return await Like.create_like(like)


@like_route.delete("/like/{like_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_like(like_id: str, token_data: str = Depends(VerifyToken().verify)):
    """
    Delete a Like
    :param like_id: ID of the like
    :param token_data: decoded token data
    """
    return await Like.delete_like(like_id, token_data["email"])
