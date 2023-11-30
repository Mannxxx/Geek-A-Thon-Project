import { useForm } from "react-hook-form";

import { useFetch } from "src/hooks";

import { ErrorPendingComp } from "src/components";

import { countryNames, seasonNames, sportNames } from "src/data";
import { useEffect, useState } from "react";

const sexList = [{
    title: "Male",
    value: "M"
}, {
    title: "Female",
    value: "F"
}]

export function PredictPage() {

    const { data, isPending, fetchData, error } = useFetch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            sex: "",
            age: "",
            height: "",
            weight: "",
            country: "",
            season: "",
            sport: ""
        }
    });
    console.log(errors);


    function onSubmit({ sex, age, height, weight, country, season, sport }: {
        sex: string,
        age: number | string,
        height: string,
        weight: string,
        country: string,
        season: string,
        sport: string
    }) {

        fetchData({
            path: `/predict`,
            method: "POST",
            body: JSON.stringify({
                sex,
                age,
                height,
                weight,
                country,
                season,
                sport
            })
        });
    }

    return (
        <div className="container">
            <h2
                style={{
                    textAlign: 'center'
                }}
            >Medal Prediction</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <div className="form-group mb-3">
                    <label htmlFor="sport" className="form-label">Sport</label>
                    <select
                        id="sport"
                        {...register("sport", { required: "Required" })}
                        className={`form-select ${errors.sport ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {sportNames.map((item: string, index: number) =>
                            <option key={index} value={item}>{item}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.sport?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select
                        id="country"
                        {...register("country", { required: "Required" })}
                        className={`form-select ${errors.country ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {countryNames.map((item: string, index: number) =>
                            <option key={index} value={item}>{item}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.country?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="season" className="form-label">Season</label>
                    <select
                        id="season"
                        {...register("season", { required: "Required" })}
                        className={`form-select ${errors.season ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {seasonNames.map((item: string, index: number) =>
                            <option key={index} value={item}>{item}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.season?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="sex" className="form-label">Sex</label>
                    <select
                        id="sex"
                        {...register("sex", { required: "Required" })}
                        className={`form-select ${errors.sex ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {sexList.map((item, index: number) =>
                            <option key={index} value={item.value}>{item.title}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.sex?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input
                        id="age"
                        type="number"

                        onInput={(e: any) => {
                            if (e.target.value.length > e.target.maxLength)
                                e.target.value = e.target.value.slice(0, e.target.maxLength);
                        }}

                        maxLength={3}
                        {...register("age", {
                            required: "Required",
                            min: {
                                value: 10,
                                message: 'The minimum age requirement is 10 years or older.',
                            },
                            max: {
                                value: 97,
                                message: 'The maximum allowable age is 97 years.',
                            }
                        })}
                        className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.age?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="height" className="form-label">Height (in cms)</label>
                    <input
                        id="height"
                        type="number"
                        onInput={(e: any) => {
                            if (e.target.value.length > e.target.maxLength)
                                e.target.value = e.target.value.slice(0, e.target.maxLength);
                        }}

                        maxLength={3}
                        {...register("height", {
                            required: "Required",
                            min: {
                                value: 127,
                                message: 'The minimum allowable height is 127 cms ',
                            },
                            max: {
                                value: 226,
                                message: 'The maximum allowable height is 226 cms',
                            }
                        })}
                        className={`form-control ${errors.height ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.height?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="weight" className="form-label">Weight (in kgs)</label>
                    <input
                        id="weight"
                        type="number"
                        onInput={(e: any) => {
                            if (e.target.value.length > e.target.maxLength)
                                e.target.value = e.target.value.slice(0, e.target.maxLength);
                        }}

                        maxLength={3}
                        {...register("weight", {
                            required: "Required",
                            min: {
                                value: 25,
                                message: 'The minimum allowable height is 25 kg ',
                            },
                            max: {
                                value: 214,
                                message: 'The maximum allowable height is 214 kg',
                            }
                        })}
                        className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.weight?.message}</div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={isPending}>Predict</button>
            </form>
            {data ?
                <PredictResult data={data} />
                : <ErrorPendingComp
                    isPending={isPending}
                    pendingText="Predicting ..."
                    error={error}
                    placeholderIconName={"fa-solid fa-magnifying-glass-chart"}
                    placeholder={'Predicitons will be shown here'}
                />
            }
        </div>
    )
}

function PredictResult({
    data
}: {
    data: {
        prediction: string,
    }
}) {

    const [iconURL, setIconName] = useState<string | null>(null);

    useEffect(() => {
        switch (data.prediction) {
            case 'Gold':
                setIconName("https://img.icons8.com/arcade/200/first-place-ribbon.png")
                break;
            case 'Silver':
                setIconName("https://img.icons8.com/arcade/200/second-place-ribbon.png")
                break;
            case 'Bronze':
                setIconName("https://img.icons8.com/arcade/200/third-place-ribbon.png")
                break;
            default:
                setIconName('https://img.icons8.com/color/200/lose.png')
                break;
        }
    }, [data.prediction])

    return <>
        <h3 className="mt-4 mb-4">Result</h3>
        <div
            className="row d-flex justify-content-around align-items-center mb-5"
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
                {iconURL ?
                    <img
                        width="200"
                        height="200"
                        src={iconURL}
                        alt="medal"
                    /> : null
                }
                <strong style={{ fontSize: 30 }}>{data.prediction}</strong>
            </div>
        </div>
    </>
}