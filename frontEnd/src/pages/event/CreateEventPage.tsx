import { useForm } from "react-hook-form";

import { useFetch, usePED } from "src/hooks";

import { ErrorPendingComp } from "src/components";

import { countryNames, sportNames } from "src/data";
import { useEffect, useState } from "react";
import { primaryColor } from "src/util";
import { useNavigate, useNavigation } from "react-router-dom";

export function CreateEventPage() {

    const [step1Completed, setstep1Completed] = useState(false);

    const [step1Data, setStep1Data] = useState<any>(null);

    const { isPending, setIsPending, error, setError, setData, data } = usePED();


    async function handleCB(data: any) {
        try {
            setstep1Completed(data);

            const userCredData = await localStorage.getItem('userCrediantials');

            if (!userCredData) {
                return;
            }
            const userCred = await JSON.parse(userCredData)

            const response = await fetch(`${process.env.REACT_APP_API_URL}${'/event/types'}`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${userCred.access_token}`,
                    "Content-Type": "application/json",
                }
            });

            const json1 = await response.json();

            const response2 = await fetch(`${process.env.REACT_APP_API_URL}${'/sports'}`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${userCred.access_token}`,
                    "Content-Type": "application/json",
                }
            });

            const json2 = await response2.json();
            setStep1Data({
                step1: data,
                eventTypes: json1,
                sports: json2
            })
        }
        catch (error: any) {
            console.log(error);
            setData(null);
            setError(error.message);
            setIsPending(false);
        }
    }

    if (isPending) return <ErrorPendingComp
        isPending={isPending}
        pendingText="Creating Step 2 Form ..."
        error={error}
        placeholderIconName={"fa-solid fa-person-skating"}
        placeholder={'Step 2 Form'}
    />

    return <>
        <div className="container">
            <h2>Create A New Event</h2>
            <div className="d-flex" style={{
                columnGap: 20
            }}>
                <h3 style={{ display: 'flex' }}>Step 1 : Upload Stream</h3>
                {step1Data &&
                    <>
                        <h3>-</h3>
                        <h3 style={{
                            color: primaryColor
                        }}>  Completed</h3>
                    </>
                }
            </div>
        </div>
        {step1Data ? <EventForm uploadData={step1Data} /> : <StreamForm CB={handleCB} />}
    </>
}

function StreamForm({ CB }: { CB: Function }) {
    const { data, isPending, fetchData, error, setData, setIsPending } = useFetch();

    const { register, handleSubmit, formState: { errors }, getValues } = useForm({
        defaultValues: {
            video: null,
            name: "",
            description: "",
            privacy: "",
        }
    });

    useEffect(() => {
        if (!data) return;
        CB({ ...data, event_name: getValues('name') })
    }, [data])

    function onSubmit({ video, name, description, privacy }: {
        video: any,
        name: string,
        description: string,
        privacy: string
    }) {

        let bodyContent = new FormData();

        bodyContent.append('name', name)
        bodyContent.append('description', description)
        bodyContent.append('privacy', privacy)
        bodyContent.append('video', video[0])

        fetchData({
            path: `/stream`,
            method: "POST",
            noheaders: true,
            body: bodyContent
        });
    }

    return (
        <div className="container">

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <div className="form-group mb-3">
                    <label htmlFor="video" className="form-label">Select a video</label>
                    <input
                        id="video"
                        type="file"
                        accept="video/*"
                        {...register("video", {
                            required: "Required",
                        })}
                        className={`form-control ${errors.video ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.video?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="desc" className="form-label">Stream Name</label>
                    <input
                        id="desc"
                        type="text"

                        {...register("name", {
                            required: "Required",
                        })}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="age" className="form-label">Description :</label>
                    <textarea
                        id="desc"
                        {...register("description", {
                            required: "Required",
                        })}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.description?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="country" className="form-label">Privacy</label>
                    <select
                        id="country"
                        {...register("privacy", { required: "Required" })}
                        className={`form-select ${errors.privacy ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {[{
                            title: "Public",
                            value: 'public'
                        }, {
                            title: "Private",
                            value: 'private'
                        }, {
                            title: "Unlisted",
                            value: 'unlisted'
                        }].map((item, index: number) =>
                            <option key={index} value={item.value}>{item.title}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.privacy?.message}</div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={isPending}>Upload Stream</button>
            </form>
            {data ?
                null
                : <ErrorPendingComp
                    isPending={isPending}
                    pendingText="Uploading Stream ..."
                    error={error}
                    placeholderIconName={""}
                    placeholder={''}
                />
            }
        </div>
    )
}

export function EventForm({
    uploadData: uData
}: {
    uploadData: any
}) {

    const [uploadData, setUploadData] = useState(uData);
    const { data, isPending, fetchData, error } = useFetch();
    const { data: dataP, isPending: isPendingP, fetchData: fD, error: errorS } = useFetch();
    console.log(uploadData);
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            event_type: "",
            stream_id: "",
            sport_id: "",
            location: "",
            players: []
        }
    });
    const players = watch('players');

    const sportId = watch('sport_id');
    useEffect(() => {
        console.log(sportId);

        if (sportId) fD({
            path: `/players/sport/${sportId}`
        })
    }, [sportId])

    useEffect(() => {
        if (!data || !data?.id) return;
        navigate(`/event/${data.id}`)
    }, [data])


    useEffect(() => {
        if (dataP) setUploadData({ ...uData, players: dataP })
    }, [dataP])
    console.log(players);

    function onSubmit({ event_type, stream_id, sport_id, location, players }: {
        event_type: string,
        stream_id: number | string,
        sport_id: string,
        location: string,
        players: string[]
    }) {

        fetchData({
            path: `/event`,
            method: "POST",
            body: JSON.stringify({
                event_type,
                stream_id: "e340bdd5-51f8-4e4f-98cf-b586d35bc44c",
                sport_id,
                location,
                event_name: uData.step1.event_name,
                players: [
                    "017ba7cf-bb7b-4904-a796-5366cc363aec",
                    "02a7c0fd-98ee-4f4e-b9ba-d232975ce2d3", "03ba8b42-96b2-416d-94e1-b357f8a7ba83"
                ]
            })
        });
    }

    return (
        <div className="container">
            <h3>Step 2 : Fill Additional details about Event & Stream
            </h3>
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <div className="form-group mb-3">
                    <label htmlFor="event_type" className="form-label">Event Type</label>
                    <select
                        id="event_type"
                        {...register("event_type", { required: "Required" })}
                        className={`form-select ${errors.event_type ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {uploadData?.eventTypes?.map((item: any, index: number) =>
                            <option key={index} value={item.event_type_id}>{item.event_name}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.event_type?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="sport_id" className="form-label">Select Sport</label>
                    <select
                        id="sport_id"
                        {...register("sport_id", { required: "Required" })}
                        className={`form-select ${errors.sport_id ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {uploadData?.sports?.map((item: any, index: number) =>
                            <option key={index} value={item.sport_id}>{item.name}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.sport_id?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <select
                        id="location"
                        {...register("location", { required: "Required" })}
                        className={`form-select ${errors.location ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {countryNames.map((item: string, index: number) =>
                            <option key={index} value={item}>{item}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.location?.message}</div>
                </div>
                {uploadData?.players &&
                    <div className="form-group ">
                        <label htmlFor="players" className="form-label">Select Players</label>

                        {uploadData?.players?.map((item: any, index: number) =>
                            <div
                                className="form-check mb-3" key={index}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={item.player_id}
                                    value={players.includes(item.player_id as never) as never}
                                    onChange={(e) => {
                                        console.log(e.target.value);

                                        if (e.target.value) {
                                            const p = players.filter(i => i === item.player_id)
                                            setValue('players', [...p])
                                        } else setValue('players', [...players, item.player_id] as any)
                                    }}
                                    id="flexCheckDefault"
                                />
                                <label className="form-check-label" htmlFor={item.player_id}>
                                    {item.name}
                                </label>
                            </div>
                        )}
                        <div className="invalid-feedback">{errors.players?.message}</div>
                    </div>}
                <button className="btn btn-primary" type="submit" disabled={isPending}>Create</button>
            </form>
            {data ?
                null
                : <ErrorPendingComp
                    isPending={isPending}
                    pendingText="Creating a new Event ..."
                    error={error}
                    // placeholderIconName={"fa-solid fa-magnifying-glass-chart"}
                    placeholder={''}
                />
            }
        </div>
    )
}