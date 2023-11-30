import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorPendingComp } from "src/components";
import { useFetch } from "src/hooks"
import { timeHourMin } from "src/util/time";

export function EventPage() {

    const { id } = useParams();
    const { data, isPending, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData({
            path: `/event/${id}`
        })
    }, [])

    return (
        <div className="container">
            {data ?
                <>
                    <Link to={`/event/${data[0].event_id}`}>
                        <h2 className="card-title">{data[0].event_name}</h2>
                    </Link>
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
                    <Link
                        to={`/event-stream/${data[0].event_id}`}
                        className="btn btn-primary">
                        <i className="fa-solid fa-play me-2"
                        />
                        <span>Watch Stream</span>
                    </Link>
                    <div className="row mt-4">
                        <h2>Players</h2>
                        <div className="card-group">
                            {data[0].players.map((item: any, index: number) =>
                                <div key={index} className="col-12 mt-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <Link to={`/player/${item.player_id}`}>
                                                <h3 className="card-title">{item.name}</h3>
                                            </Link>
                                            {[{
                                                iconName: "fa-solid fa-earth-americas",
                                                title: item.country
                                            }, {
                                                iconName: "fa-solid fa-cake-candles",
                                                title: new Date(item.dob).toDateString()
                                            }, {
                                                iconName: "fa-solid fa-arrows-up-down",
                                                title: item.height + ' cms'
                                            }, {
                                                iconName: "fa-solid fa-venus-mars",
                                                title: item.sex === 'F' ? 'Female' : 'Male'
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