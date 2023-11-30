import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorPendingComp } from "src/components";
import { useFetch } from "src/hooks"
import { timeHourMin } from "src/util/time";

import { StreamComp } from "src/components/StreamComp";

export function EventStreamPage() {

    const { id } = useParams();
    const { data, isPending, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData({
            path: `/event/${id}`
        })
    }, [])

    return (
        <div className="container">
            {data?.length ?
                <>
                    <StreamComp
                        streamId={data[0].stream_id}
                        eventName={data[0].event_name}
                        Content={<LL data={data} />}
                        Players={
                            <div className="row mt-4">
                                <h3>Players</h3>
                                <div className="card-group">
                                    {data[0].players.map((item: any, index: number) =>
                                        <div key={index} className="col-12 mt-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <Link to={`/player/${item.player_id}`}>
                                                        <h4 className="card-title" style={{
                                                            color: 'black'
                                                        }}>{item.name}</h4>
                                                    </Link>
                                                    {[{
                                                        iconName: "fa-solid fa-earth-americas",
                                                        title: item.country
                                                    }].map((item2, index: number) =>
                                                        <div
                                                            key={index}
                                                            className="mt-3 mb-3"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <i className={item2.iconName} style={{ width: 30, }}></i>
                                                            <span>{item2.title}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    />
                </>
                : <ErrorPendingComp
                    isPending={isPending}
                    pendingText="Loading ..."
                    error={error}
                    placeholderIconName={"fa-solid fa-volleyball"}
                    placeholder={'Event will be shown here'}
                />
            }
        </div >
    )
}


function LL({ data }: {
    data: any
}) {
    return <>
        <div className="row">
            <div className="mt-3 mb-3" style={{
                display: 'flex',
                columnGap: 10,
                alignItems: 'center'
            }}>
                <i className="fa-solid fa-list-ul"></i>
                <span>{data[0].event_type}</span>
            </div>
            <div className="mt-3 mb-3" style={{
                display: 'flex',
                columnGap: 10,
                alignItems: 'center'
            }}>
                <i className="fa-regular fa-calendar"></i>
                <span>{new Date(data[0].date).toDateString()}</span>
            </div>
            <div className="mt-3 mb-3" style={{
                display: 'flex',
                columnGap: 10,
                alignItems: 'center'
            }}>
                <i className="fa-regular fa-clock"></i>
                <span>{timeHourMin(data[0].date)}</span>
            </div>
            <div className="mt-3 mb-3" style={{
                display: 'flex',
                columnGap: 10,
                alignItems: 'center'
            }}>
                <i className="fa-solid fa-earth-americas"></i>
                <span>{data[0].location}</span>
            </div>
        </div>
    </>
}