from fastapi import APIRouter, Depends, status, File, UploadFile, Form, BackgroundTasks
from api.auth.token import VerifyToken
from fastapi.responses import JSONResponse
from .model import CreateStream, Stream
from uuid import UUID
from pathlib import Path
from streaming import upload_video, TEMP_FOLDER
from typing import BinaryIO, Optional
from os import remove

stream_route = APIRouter(tags=["stream", ], default_response_class=JSONResponse)


@stream_route.get("/stream/{stream_id}", status_code=status.HTTP_200_OK)
async def get_stream(stream_id: UUID, token_data: str = Depends(VerifyToken().verify)):
    """
    Get Stream Data
    :param stream_id:  stream id of a particular stream
    :param token_data: decoded token data
    :return: Stream Data as JsonResponse
    """
    return await Stream.get_stream_by_id(token_data["email"], stream_id=stream_id)


@stream_route.post("/stream", status_code=status.HTTP_201_CREATED)
async def create_stream(bt: BackgroundTasks, video: UploadFile = File(...), name: str = Form(...),
                        description: str = Form(...),
                        visibility: Optional[str] = "public"):
    """
    Create a stream
    :TODO add authentication afterwards
    """
    file_path = f"{TEMP_FOLDER.joinpath(video.filename)}"
    _save_file(file_path, video.file)

    video_id = upload_video(file_path, name, description, visibility)
    bt.add_task(remove, file_path)  # remove file
    return {"stream_id": await Stream.create_stream(CreateStream(stream_url=video_id)), "video_id": video_id}


def _save_file(path: Path | str, file: BinaryIO):
    with open(path, "wb+") as f:
        f.write(file.read())
