if __name__ == "__main__":
    import asyncio
    from hypercorn.config import Config
    from hypercorn.asyncio import serve

    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from api.auth.config import AuthConfig
    from api.auth.api import auth_route
    from api.events.api import event_route
    from api.streams.api import stream_route
    from api.comments.api import comment_route
    from api.likes.api import like_route
    from api.players.api import player_route
    from api.sports.api import sport_route
    from api.predict.api import predict_route
    from api.stats.api import stats_route
    from api.sentiment.api import sentiment_route
    from database import DataBase, Table
    from middleware import ErrorHandler
    from middleware.logger import Logger
    import logging

    app = FastAPI()

    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                        datefmt="%Y-%m-%d %H:%M:%S")

    app.add_middleware(Logger)
    app.add_middleware(ErrorHandler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", ],
        allow_credentials=True,
        allow_headers=['*', ],
        allow_methods=['*', ]
    )  # This Middleware is only adding headers

    app.include_router(auth_route)
    app.include_router(predict_route)
    app.include_router(event_route)
    app.include_router(stream_route)
    app.include_router(like_route)
    app.include_router(comment_route)
    app.include_router(player_route)
    app.include_router(sport_route)
    app.include_router(stats_route)
    app.include_router(sentiment_route)

    app.add_event_handler("startup", DataBase.migrate)  # connect to database
    app.add_event_handler("startup", Table.prepare_stmt)  # prepare statements
    app.add_event_handler("shutdown", DataBase.close)  # close DB connection on shutdown

    asyncio.run(serve(app, Config()))
