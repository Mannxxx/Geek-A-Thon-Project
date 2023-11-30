import { useState } from "react";
import { useForm } from "react-hook-form";

import { useFetch } from "src/hooks/useFetch";
import { Chart } from "src/components/Chart";
import { ErrorPendingComp } from "src/components/ErrorPendingComp";

const filterOptions = [{
    title: "Medals By Country",
    value: "medals_by_country"
}, {
    title: "Top Performers",
    value: "top_performers"
}]

export function YearStatsPage() {

    const { data, isPending, fetchData, error } = useFetch();
    const [titles, setTitles] = useState(["Chart 1", "Chart 2", "Chart 3"])

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            year: "",
            filter: ""
        }
    });
    console.log(errors);


    function onSubmit({ year, filter }: {
        year: string,
        filter: string
    }) {
        setTitles([
            `Number of Times ${filter === 'medals_by_country' ? "Country's" : 'Top Performers'} Lost in the Olympics in ${year}`,
            `Number of Times ${filter === 'medals_by_country' ? "Country's" : 'Top Performers'} Won in the Olympics in ${year}`,
            `Number of Times ${filter === 'medals_by_country' ? "Country's" : 'Top Performers'} Won in the Olympics with Medals in ${year}`
        ])
        fetchData({
            path: `/stats/year?year=${year}&filter=${filter}`,
        });
    }

    return (
        <div className="container">
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >

                <div className="form-group mb-3">
                    <label htmlFor="year" className="form-label">Year</label>
                    <input
                        id="year"
                        type="number"
                        onInput={(e: any) => {
                            if (e.target.value.length > e.target.maxLength)
                                e.target.value = e.target.value.slice(0, e.target.maxLength);
                        }}

                        maxLength={4}
                        {...register("year", {
                            required: "Required",
                            min: {
                                value: 1896,
                                message: 'Must be greater than 1896 or equal to the current year',
                            },
                            max: {
                                value: new Date().getFullYear(),
                                message: 'Must be greater than 1896 or equal to the current year',
                            }
                        })}
                        className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.year?.message}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="filter" className="form-label">Filter</label>
                    <select
                        id="filter"
                        {...register("filter", { required: "Required" })}
                        className={`form-select ${errors.filter ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {filterOptions.map((item, index: number) =>
                            <option key={index} value={item.value}>{item.title}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.filter?.message}</div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={isPending}>Get Charts</button>
            </form>
            {data ?
                <>
                    <Chart
                        canvasId={'12'}
                        title={titles[0]}
                        labels={Object.keys(data)}
                        data={Object.keys(data).map((item: any) => {
                            return data[item]["lost"]
                        })}
                    />
                    <Chart
                        canvasId={'18'}
                        title={titles[1]}
                        labels={Object.keys(data)}
                        data={Object.keys(data).map((item: any) => {
                            return data[item]["won"]["Silver"] + data[item]["won"]["Gold"] + data[item]["won"]["Bronze"]
                        })}
                    />
                    <Chart
                        type="bar"
                        canvasId={'88'}
                        title={titles[2]}
                        labels={Object.keys(data)}
                        legendDisplay={true}
                        strictType={true}
                        dataset={[{
                            label: ' Silver ',
                            borderWidth: 1,
                            data: Object.keys(data).map((item: any) => {
                                return data[item]["won"]["Silver"]
                            }),
                            borderColor: '#C0C0C0',
                            hoverBackgroundColor: '#C0C0C0',
                            backgroundColor: `${'#C0C0C0'}BB`,
                        }, {
                            label: ' Gold ',
                            borderWidth: 1,
                            data: Object.keys(data).map((item: any) => {
                                return data[item]["won"]["Gold"]
                            }),
                            borderColor: '#FFD700',
                            hoverBackgroundColor: '#FFD700',
                            backgroundColor: `${'#FFD700'}BB`,
                        }, {
                            label: ' Bronze ',
                            borderWidth: 1,
                            data: Object.keys(data).map((item: any) => {
                                return data[item]["won"]["Bronze"]
                            }),
                            borderColor: '#CD7F32',
                            hoverBackgroundColor: '#CD7F32',
                            backgroundColor: `${'#CD7F32'}BB`,
                        }]}
                    />
                </>
                : <ErrorPendingComp
                    isPending={isPending}
                    pendingText="Fetching charts"
                    error={error}
                    placeholderIconName={"fa-solid fa-magnifying-glass-chart"}
                    placeholder={'Charts will be shown here'}
                />
            }
        </div>
    )
}