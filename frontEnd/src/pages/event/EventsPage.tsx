import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorPendingComp } from "src/components";
import { useFetch } from "src/hooks"
import { timeHourMin } from "src/util/time";

export function EventsPage() {

    const { data, isPending, error, fetchData } = useFetch();

    const [search, setSearch] = useState('');
    const [mList, setMList] = useState([]);

    useEffect(() => {
        fetchData({
            path: '/events'
        })
    }, [])

    useEffect(() => {
        if (!data) {
            setMList([])
            return;
        }
        setMList([...data] as any);
    }, [data])

    useEffect(() => {

        if (!data) return;

        const setData = setTimeout(async () => {
            if (!search) setMList([...data] as any)
            else {
                const newList = await data.filter((item: any) => {
                    console.log(item);

                    return item.event_name.toLowerCase().includes(search)
                })
                setMList([...newList] as any)
            }
        }, 600)

        return () => clearTimeout(setData)
    }, [search, data])

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 mt-3 mb-3">
                    <div className="d-flex"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap'
                        }}
                    >
                        <h2 className="m-0">Events</h2>
                        <Link className="main-btn" to={'/create-event'}>
                            <i className="fa-solid fa-plus me-2" />
                            <span>Create Event</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 mt-3 mb-3">
                    <input
                        className="form-control"
                        aria-describedby="search"
                        aria-label="Search"
                        type="text"
                        value={search}
                        onInput={(e: any) => setSearch(e.target.value)}
                        placeholder="Search event"
                    />
                </div>
            </div>
            {data ?
                <div className="row">
                    <div className="card-group">
                        {mList?.length !== 0 ? mList?.map((item: any, index: number) =>
                            <div key={index} className="col-12 mt-3 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <Link to={`/event/${item.event_id}`}>
                                            <h2 className="card-title">{item.event_name}</h2>
                                        </Link>
                                        <div className="mt-3 mb-3" style={{
                                            display: 'flex',
                                            columnGap: 10,
                                            alignItems: 'center'
                                        }}>
                                            <i className="fa-solid fa-list-ul"></i>
                                            <span>{item.event_type}</span>
                                        </div>
                                        <div className="mt-3 mb-3" style={{
                                            display: 'flex',
                                            columnGap: 10,
                                            alignItems: 'center'
                                        }}>
                                            <i className="fa-regular fa-calendar"></i>
                                            <span>{new Date(item.date).toDateString()}</span>
                                        </div>
                                        <div className="mt-3 mb-3" style={{
                                            display: 'flex',
                                            columnGap: 10,
                                            alignItems: 'center'
                                        }}>
                                            <i className="fa-regular fa-clock"></i>
                                            <span>{timeHourMin(item.date)}</span>
                                        </div>
                                        <div className="mt-3 mb-3" style={{
                                            display: 'flex',
                                            columnGap: 10,
                                            alignItems: 'center'
                                        }}>
                                            <i className="fa-solid fa-earth-americas"></i>
                                            <span>{item.location}</span>
                                        </div>
                                        <div className="mt-3 mb-3" style={{
                                            display: 'flex',
                                            columnGap: 10,
                                            alignItems: 'center'
                                        }}>
                                            <Link
                                                to={`/event/${item.event_id}#players`}
                                                className="btn btn-primary"
                                            >
                                                <i className="fas fa-running me-2" />
                                                <span>Players</span>
                                            </Link>
                                            <Link
                                                to={`/event-stream/${item.event_id}`}
                                                className="btn btn-primary">
                                                <i className="fa-solid fa-play me-2"
                                                />
                                                <span>Watch Stream</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <ErrorPendingComp
                            isPending={false}
                            error={null}
                            placeholder="Empty List"
                            pendingText={""}
                            placeholderIconName="fa-solid fa-list-ul"
                        />}
                    </div>
                </div>
                : <ErrorPendingComp
                    isPending={isPending}
                    pendingText="Loading ..."
                    error={error}
                    placeholderIconName={"fa-solid fa-volleyball"}
                    placeholder={'Events will be shown here'}
                />
            }
        </div >
    )
}