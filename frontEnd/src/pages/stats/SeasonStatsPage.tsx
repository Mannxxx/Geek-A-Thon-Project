import { useForm } from "react-hook-form";

import { useFetch } from "src/hooks/useFetch";
import { seasonNames } from "src/data";
import { Chart } from "src/components/Chart";

import { ErrorPendingComp } from "src/components/ErrorPendingComp";

export function SeasonStatsPage() {

    const { data, isPending, fetchData, error } = useFetch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            season: ""
        }
    });
    console.log(errors);


    function onSubmit({ season }: {
        season: string
    }) {
        fetchData({
            path: `/stats/season?season=${season}&filter=${"medals_by_country"}`,
        });
    }

    return (
        <div className="container">
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
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
                <button className="btn btn-primary" type="submit" disabled={isPending}>Get Charts</button>
            </form>
            {data ?
                <>
                    <Chart
                        canvasId={'12'}
                        title={"Number of Times Countries Have Lost in the Olympics"}
                        labels={Object.keys(data)}
                        data={Object.keys(data).map((item: any) => {
                            return data[item]["lost"]
                        })}
                    />
                    <Chart
                        canvasId={'18'}
                        title={"Number of Times Countries Have Won in the Olympics"}
                        labels={Object.keys(data)}
                        data={Object.keys(data).map((item: any) => {
                            return data[item]["Total"]
                        })}
                    />
                    <Chart
                        canvasId={'88'}
                        title={"Number of Times Countries Have Won in the Olympics With Medals"}
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