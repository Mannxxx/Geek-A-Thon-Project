import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useFetch } from "src/hooks";

import { ErrorPendingComp, CircularProgressBar } from "src/components";

import { sportNames } from "src/data";

export function SentimentAnalysisPage() {

    const { data, isPending, fetchData, error } = useFetch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            event: ""
        }
    });
    console.log(errors);

    function onSubmit({ event }: {
        event: string
    }) {
        fetchData({ path: `/sentiment?event=${event}` });
    }

    return (
        <div className="container">
            <h2
                style={{
                    textAlign: 'center'
                }}
            >Sport Sentiment Analysis</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <div className="form-group mb-3">
                    <label htmlFor="event" className="form-label">Event</label>
                    <select
                        id="event"
                        {...register("event", { required: "Required" })}
                        className={`form-select ${errors.event ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {sportNames.map((item: string, index: number) =>
                            <option
                                key={index}
                                value={item}
                            >{item}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.event?.message}</div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={isPending}>Analyze</button>
            </form>
            <SentimentAnalysisComp data={data} isPending={isPending} error={error} />
        </div>
    )
}

export function SentimentAnalysisComp({
    data, isPending, error, title
}: {
    title?: string,
    data: {
        sentiment: string,
        score: number
    } | null,
    isPending: boolean,
    error: string | null
}) {
    return <>
        {data ?
            <SentimentResult title={title} data={data} />
            : <ErrorPendingComp
                isPending={isPending}
                pendingText="Analyzing ..."
                error={error}
                placeholderIconName={"fa-solid fa-magnifying-glass-chart"}
                placeholder={'Sentiment Analysis will be shown here'}
            />
        }</>
}


function SentimentResult({
    data, title = "Result"
}: {
    title?: string,
    data: {
        sentiment: string,
        score: number
    }
}) {

    const [iconName, setIconName] = useState('far fa-meh');
    const [iconColor, setIconColor] = useState('#000');

    useEffect(() => {
        switch (data.sentiment) {
            case 'Positive':
                setIconName('far fa-smile')
                setIconColor("#00cc00")
                break;
            case 'Neutral':
                setIconName('far fa-meh')
                setIconColor('#FFD700');
                break;
            case 'Angry':
                setIconName('far fa-angry')
                setIconColor('#FF0000')
                break;
            default:
                setIconName('fa-brands fa-think-peaks')
                setIconColor('#000')
                break;
        }
    }, [data.sentiment])

    return <>
        <h3 className="mt-4 mb-4">{title}</h3>
        <div
            className="row d-flex justify-content-around align-items-center"
            style={{ rowGap: 60 }}
        >
            <div
                className="col-12 col-md-6"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    rowGap: 20
                }}
            >
                <i
                    className={iconName}
                    style={{ fontSize: 100, color: iconColor }} />
                <strong>{data.sentiment}</strong>
            </div>
            <div
                className="col-12 col-md-6"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    rowGap: 20
                }}
            >
                <CircularProgressBar
                    percentage={(data.score * 100) % 100}
                    animationDuration={30}
                />
                <strong>Score</strong>
            </div>
        </div>
    </>
}