import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorPendingComp } from "src/components";
import { useFetch } from "src/hooks";
import { SentimentAnalysisComp } from "../pages/analysis/SentimentAnalysisPage";
import { StreamComments } from "src/components/StreamComments";

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

function StreakLikeShareBtn({ likes, liked, streamId }: {
    liked: boolean,
    likes: number,
    streamId: string | undefined
}) {
    const [isLiked, setIsLiked] = useState<boolean>(liked);

    const { isPending, error, data, fetchData } = useFetch();

    function handleChangeLike() {

        setIsLiked(!isLiked)
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

    return (<div className="container mt-4 d-flex flex-row justify-content-around">
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
    </div>);
}


export function StreamPage() {

    const { id } = useParams();

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
                            <iframe src="https://www.youtube.com/embed/9sT5KkdaSLc" title="stream video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        </div>
                        <div className="mt-3">
                            <h3>Video Title</h3>
                            <span>{data[0].views} views {data[0].likes} likes</span>
                            <StreakLikeShareBtn
                                likes={data[0].likes}
                                liked={data[0].liked}
                                streamId={id}
                            />
                            <div className="mt-3">
                                <p>Date: July 28, 2023</p>
                                <div>
                                    <button className="btn btn-primary d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#description" aria-expanded="false" aria-controls="description">
                                        Show Description
                                    </button>
                                </div>
                                <div className="collapse mt-3 d-lg-block" id="description">
                                    <p style={{
                                        textAlign: 'justify'
                                    }}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt vel turpis ac condimentum. Nulla facilisi.
                                        Quisque nec quam lacinia, vestibulum nibh et, aliquet libero. Nam in nisi sit amet velit volutpat volutpat.
                                        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec feugiat volutpat
                                        purus, ac rutrum mauris dignissim ac.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid h-100 col-lg-4 mt-3 mt-lg-0" id="chatBox-container">
                    <SentimentAnalysis />
                </div>
                <StreamComments streamId={data[0].stream_id} />
            </div>
        </div>
    )
}


function SentimentAnalysis() {

    const { isPending, error, data, fetchData } = useFetch();

    useEffect(() => {
        function onSubmit({ event }: {
            event: string
        }) {
            fetchData({ path: `/sentiment?event=${event}` });
        }
    }, [])

    return (

        <SentimentAnalysisComp
            title={"Sentiment Analysis of this Event"}
            data={{
                sentiment: 'Neutral',
                score: 0.88
            }}
            error={error}
            isPending={isPending}
        />

    );
}