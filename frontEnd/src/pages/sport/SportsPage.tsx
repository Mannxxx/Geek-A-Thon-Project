import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorPendingComp } from "src/components";
import { useFetch } from "src/hooks"

export function SportsPage() {

    const { data, isPending, error, fetchData } = useFetch();

    const [search, setSearch] = useState('');
    const [mList, setMList] = useState([]);

    useEffect(() => {
        fetchData({
            path: '/sports'
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

                    return item.name.toLowerCase().includes(search)
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
                        <h2 className="m-0">Sports</h2>
                        {/* <Link className="main-btn" to={'/create-sport'}>
                            <i className="fa-solid fa-plus me-2" />
                            <span>Create Sport</span>
                        </Link> */}
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
                        placeholder="Search sport"
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

                                        <Link to={`/sport/${item.sport_id}`}>
                                            <h2 className="card-title">{item.name}</h2>
                                        </Link>
                                        {[{
                                            iconName: "fa-solid fa-person-running",
                                            title: "Number of Players : " + item.players
                                        }, {
                                            iconName: "fa-regular fa-newspaper",
                                            title: item.desc
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
                    placeholder={'Sports will be shown here'}
                />
            }
        </div >
    )
}