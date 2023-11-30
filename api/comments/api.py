from fastapi import APIRouter, Depends, status
from api.auth.token import VerifyToken
from fastapi.responses import JSONResponse
from .model import AddComment, Comment
from uuid import UUID


comment_route = APIRouter(tags=["comment", ], default_response_class=JSONResponse)


@comment_route.get("/comments/{stream_id}", status_code=status.HTTP_200_OK)
async def get_comments(stream_id: UUID, token_data: str = Depends(VerifyToken().verify)):
    """
    Get All Comments for a stream
    :param stream_id:  stream id of a particular stream
    :param token_data: decoded token data
    :return: List of comments as JsonResponse
    """
    return await Comment.get_comment(stream_id=stream_id)


@comment_route.get("/comment/{comment_id}", status_code=status.HTTP_200_OK)
async def get_comments(comment_id: UUID, token_data: str = Depends(VerifyToken().verify)):
    """
    Get a particular comment
    :param comment_id: Comment id
    :param token_data: decoded token data
    :return: Single comment as JsonResponse
    """
    return await Comment.get_comment(comment_id=comment_id)


@comment_route.post("/comment", status_code=status.HTTP_201_CREATED)
async def create_comment(comment: AddComment, token_data: str = Depends(VerifyToken().verify)):
    """
    Create a Comment
    """
    comment._email = token_data["email"]
    return await Comment.create_comment(comment)


@comment_route.delete("/comment/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: UUID, token_data: str = Depends(VerifyToken().verify)):
    """
    Delete a Comment
    :param comment_id: Comment id
    :param token_data: decoded token data
    """
    return await Comment.delete_comment(comment_id, token_data["email"])
