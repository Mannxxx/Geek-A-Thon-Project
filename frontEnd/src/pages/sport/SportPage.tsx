import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorPendingComp } from "src/components";
import { useFetch } from "src/hooks"

export function SportPage() {

    const { id } = useParams();
    const { data, isPending, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData({
            path: `/sport/${id}`
        })
    }, [])

    return (
        <div className="container">
            {data ?
                <>
                    <Link to={`/sport/${data[0].sport_id}`}>
                        <h2 className="card-title">{data[0].name}</h2>
                    </Link>
                    {[{
                        iconName: "fa-solid fa-person-running",
                        title: "Number of Players : " + data[0].players
                    }, {
                        iconName: "fa-regular fa-newspaper",
                        title: data[0].desc
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
                    placeholder={'Sport details will be shown here'}
                />
            }
        </div >
    )
}