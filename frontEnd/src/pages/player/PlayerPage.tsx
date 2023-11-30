import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorPendingComp } from "src/components";
import { useFetch } from "src/hooks"

export function PlayerPage() {

    const { id } = useParams();
    const { data, isPending, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData({
            path: `/player/${id}`
        })
    }, [])

    return (
        <div className="container">
            {data ?
                <>
                    <Link to={`/player/${data[0].player_id}`}>
                        <h2 className="card-title">{data[0].name}</h2>
                    </Link>
                    <Link to={`/sport/${data[0].sport_id}`}>
                        <div
                            className="mt-3 mb-3"
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <i className={"fa-solid fa-person-running"} style={{ width: 30, }}></i>
                            <span>{data[0].sport_name}</span>
                        </div>
                    </Link>
                    {[{
                        iconName: "fa-solid fa-earth-americas",
                        title: data[0].country
                    }, {
                        iconName: "fa-solid fa-cake-candles",
                        title: new Date(data[0].dob).toDateString()
                    }, {
                        iconName: "fa-solid fa-arrows-up-down",
                        title: data[0].height + ' cms'
                    }, {
                        iconName: "fa-solid fa-venus-mars",
                        title: data[0].sex === 'F' ? 'Female' : 'Male'
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