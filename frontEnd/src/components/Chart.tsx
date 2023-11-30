import { useEffect, useState } from "react";
import ChartJS from 'chart.js/auto';

import { getRandomizedArray } from "src/util/functions";
import { chartColors } from "src/util/colors";
import { downloadCanvas } from "src/util/downloadCanvas";

export type TChartType = 'bar' | 'doughnut' | 'line' | 'pie' | 'polarArea' | 'radar';

export const chartNames = [{
    title: 'Bar',
    value: 'bar'
}, {
    title: 'Dough Nut',
    value: 'doughnut'
}, {
    title: 'Line',
    value: 'line'
}, {
    title: 'Pie',
    value: 'pie'
}, {
    title: 'Polar Area',
    value: 'polarArea'
}, {
    title: 'Radar',
    value: 'radar'
}]

export function Chart({
    title,
    labels,
    canvasId,
    data,
    type = 'bar',
    dataset,
    legendDisplay = false,
    strictType = false
}: {
    type?: TChartType,
    title: string,
    labels: string[],
    canvasId: string,
    data?: any,
    dataset?: any,
    legendDisplay?: boolean,
    strictType?: boolean
}) {

    const [chartType, setChartType] = useState(type);

    useEffect(() => {
        if (!labels || (!dataset && !data)) return;

        const ctx: any = document.getElementById(canvasId);
        if (!ctx) return;

        const colors = getRandomizedArray(chartColors, labels.length)

        const myChart = new ChartJS(ctx, {
            type: chartType,

            data: {
                labels,
                datasets: dataset ? dataset : [{
                    label: " ",
                    data,
                    borderWidth: 1,
                    borderColor: (c: any) => colors[c.dataIndex],
                    hoverBackgroundColor: (c: any) => colors[c.dataIndex],
                    backgroundColor: (c: any) => `${colors[c.dataIndex]}88`,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: legendDisplay
                    },
                }
            }
        });
        return () => myChart.destroy();
    }, [data, canvasId, labels, dataset, legendDisplay, type, chartType])

    return <div style={{
        marginTop: 60,
        marginBottom: 60
    }}>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
            }}
        >
            <h4 style={{ margin: 0 }}>{title}</h4>
            <div className="d-flex mt-3 m-0" style={{ columnGap: 20, alignItems: 'center' }}>
                {!strictType ? <select
                    className="form-select"
                    value={chartType}
                    onChange={e => setChartType(e.target.value as any)}
                >
                    {chartNames.map((item, index: number) =>
                        <option key={index} value={item.value}>{item.title}</option>
                    )}
                </select> : null}
                <button
                    className="btn btn-primary d-flex align-items-center"
                    style={{ columnGap: 8 }}
                    onClick={() => downloadCanvas({ canvasId, title })}
                ><i className="fas fa-download"></i>Download</button>
            </div>
        </div>
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div
                className="col-xxl-12 col-12 col-xl-8"
                style={{
                    padding: 30,
                    // width: "100%"
                }}>
                <canvas id={canvasId}></canvas>
            </div>
        </div>
    </div>
}