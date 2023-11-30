import { useEffect, useState } from "react";

import { ErrorPendingComp } from "src/components";
import { useFetch } from "src/hooks";
import { StreamComments } from "./StreamComments";
import { SentimentAnalysisComp } from "src/pages";

//Share - Start
async function handleShare({ title, desc, url }: {
    title: string,
    desc: string,
    url: string
}) {
    try {
        await navigator.share({
            title,
            text: desc,
            url: url
        });
        // alert('Shared Successfully');
    }
    catch (err) { alert('Error Occured While Sharing\n\n' + err); }
}
//Share -End

function StreakLikeShareBtn({ likes, liked, streamId, views }: {
    liked: boolean,
    likes: number,
    streamId: string | undefined,
    views: number
}) {
    const [isLiked, setIsLiked] = useState<boolean>(liked);
    const [nLikes, setNLikes] = useState(likes)
    const { isPending, error, data, fetchData } = useFetch();

    function handleChangeLike() {

        setIsLiked(!isLiked)
        setNLikes(isLiked ? nLikes - 1 : nLikes + 1);
        if (isLiked) {
            fetchData({
                path: `/like/${streamId}`,
                method: 'DELETE'
            })
        } else {
            fetchData({
                path: '/like',
                method: 'POST',
                body: JSON.stringify({
                    stream_id: streamId
                })
            })
        }
    }

    return (
        <>
            <span>{views} views {nLikes} likes</span>
            <div className="container mt-4 d-flex flex-row justify-content-around">
                <button
                    type="button"
                    className="stream-btn like-btn"
                    onClick={handleChangeLike}
                >
                    <i
                        className={isLiked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"} style={isLiked ? {
                            color: 'green'
                        } : undefined}></i>
                    <span>Like</span>
                </button>
                <button
                    type="button"
                    className="stream-btn share-btn"
                    onClick={() => handleShare({
                        title: ``,
                        desc: "Hey watch this awesome stream",
                        url: `${process.env.REACT_APP_API_URL}/stream/${streamId}`
                    })}
                >
                    <i className="fa-regular fa-share-from-square"></i>
                    <span>Share</span>
                </button>
                <button
                    disabled={true}
                    type="button"
                    className="stream-btn report-btn"
                >
                    <i className="fa-regular fa-flag"></i>
                    <span>Report</span>
                </button>
            </div>
        </>
    );
}


export function StreamComp({
    streamId: id,
    eventName,
    Content,
    Players
}: {
    streamId: string,
    eventName: string,
    Content: any,
    Players: any
}) {
    const { data, isPending, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData({
            path: `/stream/${id}`
        })
    }, [id])

    if (!data || isPending || error) return <ErrorPendingComp
        isPending={isPending}
        error={error}
        pendingText={"Loading ..."}
        placeholder={"Stream Here"}
    />
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-8">
                    <div className="embed-responsive embed-responsive-16by9">
                        <div className="ratio ratio-16x9">
                            <iframe
                                title="Event Stream"
                                src={`https://player.vimeo.com/video/${data[0].stream_url}`}
                                width="640"
                                height="360"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            // #t=${data[0].start_time}
                            />
                        </div>
                        <div className="mt-3">
                            <h3>{eventName}</h3>
                            <StreakLikeShareBtn
                                views={data[0].views}
                                likes={data[0].likes}
                                liked={data[0].liked}
                                streamId={id}
                            />
                            <div className="mt-3">
                                <div>
                                    <button className="btn btn-primary d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#description" aria-expanded="false" aria-controls="description">
                                        Show Description
                                    </button>
                                </div>
                                <div className="collapse mt-3 d-lg-block" id="description">
                                    {Content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid col-lg-4 mt-3 mt-lg-0" id="chatBox-container">
                    <div className="card">
                        <div className="card-body">
                            <SentimentAnalysis event_name={eventName} />
                        </div>
                    </div>
                    {Players}
                </div>
                <StreamComments streamId={data[0].stream_id} />
            </div>
        </div>
    )
}


function SentimentAnalysis({ event_name }: {
    event_name: string
}) {

    const { isPending, error, data, fetchData } = useFetch();

    useEffect(() => {
        fetchData({ path: `/sentiment?event=${event_name}` });
    }, [])

    return (
        <SentimentAnalysisComp
            title={"Sentiment Analysis of this Event"}
            data={data}
            error={error}
            isPending={isPending}
        />

    );
}