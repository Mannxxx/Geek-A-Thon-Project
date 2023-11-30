import { useState } from "react";
import { useForm } from "react-hook-form";

import { useFetch } from "src/hooks/useFetch";
import { players } from "src/data";
import { Chart } from "src/components/Chart";

import { ErrorPendingComp } from "src/components/ErrorPendingComp";

const filterOptions = [{
    title: "Total Medals",
    value: "total_medals"
}, {
    title: "Medals By Event",
    value: "medals_by_event"
}, {
    title: "Medals By Year",
    value: "medals_by_year"
}]

export function PlayerStatsPage() {

    const { data, isPending, fetchData, error } = useFetch();
    const [titles, setTitles] = useState(["Chart 1", "Chart 2", "Chart 3"])

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            player: "",
            filter: ""
        }
    });
    console.log(errors);


    function onSubmit({ player, filter }: {
        player: string,
        filter: string
    }) {
        setTitles([
            `Number of Times ${filter === 'medals_by_country' ? "Country's" : 'Top Performers'} Lost in the Olympics in ${player}`,
            `Number of Times ${filter === 'medals_by_country' ? "Country's" : 'Top Performers'} Won in the Olympics in ${player}`,
            `Number of Times ${filter === 'medals_by_country' ? "Country's" : 'Top Performers'} Won in the Olympics with Medals in ${player}`
        ])
        fetchData({
            path: `/stats/player?player=${player}&filter=${filter}`,
        });
    }

    return (
        <div className="container">
            <form
                onSubmit={handleSubmit(onSubmit)}
                // className="was-validated"
                noValidate
            >
                <div className="form-group mb-3">
                    <label htmlFor="player" className="form-label">Player Name</label>
                    <select
                        id="player"
                        {...register("player", { required: "Required" })}
                        className={`form-select ${errors.filter ? 'is-invalid' : ''}`}
                        defaultValue={""}
                    >
                        <option value="" disabled>Select</option>
                        {players.map((item: string, index: number) =>
                            <option key={index} value={item}>{item}</option>
                        )}
                    </select>
                    <div className="invalid-feedback">{errors.player?.message}</div>
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