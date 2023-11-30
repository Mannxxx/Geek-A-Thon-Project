import { useForm } from "react-hook-form";

import { useFetch } from "src/hooks";

import { ErrorPendingComp } from "src/components";

import { countryNames, sportNames } from "src/data";

export function CreateSportPage() {

    const { data, isPending, fetchData, error } = useFetch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            event_type: "",
            stream_id: "",
            sport_id: "",
            location: "",
            players: []
        }
    });
    console.log(errors);

    function onSubmit({ event_type, stream_id, sport_id, location, players }: {
        event_type: string,
        stream_id: number | string,
        sport_id: string,
        location: string,
        players: string[]
    }) {

        fetchData({
            path: `/sport`,
            method: "POST",
            body: JSON.stringify({
                event_type, stream_id, sport_id, location, players
            })
        });
    }

    return (
        <div className="container">
            <h2
                style={{
                    textAlign: 'center'
                }}
            >Add A New Sport</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <div className="form-group mb-3">
                    <label htmlFor="sport" className="form-label">Event Type</label>
                    <select
                        id="sport"
                        {...register("event_type", { required: "Required" })}
                        className={`form-select ${errors.event_type ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {sportNames.map((item: string, index: number) =>
                            <option key={index} value={item}>{item}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.event_type?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select
                        id="country"
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