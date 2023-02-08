import React from 'react'

// see https://stackoverflow.com/questions/61118060/how-to-access-tailwind-colors-from-javascript
import tailwindColors from 'tailwindcss/colors'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

const gridOptions = {
    drawOnChartArea: false, // hide the grid lines, b/c we only want the grid lines for one axis to show up
}

// Receives data for one day
const DayChart = ({ perDayData }: { perDayData: Record<string, string>[] }) => {
    const xLabels = perDayData.map((entry) => entry['Time'])
    const selectedDate = perDayData?.[0]?.['Date (DD-MM-YYYY)']

    // Colors from https://codepen.io/ruchern-chong/pen/OgJqvr
    const customGrey = 'rgba(255, 255, 255, 0.2)'
    const textColor = tailwindColors.gray[300]

    const allScalesOptions = {
        ticks: {
            // see https://www.chartjs.org/docs/latest/samples/scale-options/ticks.html
            color: textColor,
        },
    }

    const options = {
        backgroundColor: 'white',
        color: textColor,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        responsive: true,
        stacked: false,
        plugins: {
            legend: {
                position: 'top' as 'top',
            },
            title: {
                display: true,
                text: `Sensor readings for ${selectedDate}`,
                color: textColor,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                },
            },
            co2: {
                type: 'linear',
                display: true,
                position: 'left' as 'left',
                grid: {
                    color: customGrey,
                },

                ...allScalesOptions,
                // Only use a grid for CO2, we dont need a grid for every line
                // grid: gridOptions,
            },
            temperature: {
                type: 'linear',
                display: true,
                position: 'right' as 'right',
                grid: gridOptions,
                ...allScalesOptions,
            },
            humidity: {
                type: 'linear',
                display: true,
                position: 'left' as 'left',
                grid: gridOptions,
                ...allScalesOptions,
            },
            pm25: {
                type: 'linear',
                display: true,
                position: 'right' as 'right',
                grid: gridOptions,
                ...allScalesOptions,
            },
            VOC: {
                type: 'linear',
                display: true,
                position: 'left' as 'left',
                grid: gridOptions,
                ...allScalesOptions,
            },
        },
    }

    const data = React.useMemo(
        () => ({
            labels: xLabels,
            datasets: [
                {
                    label: 'CO₂',
                    data: perDayData.map((entry) =>
                        parseInt(entry['CO2 ppm'], 10),
                    ),
                    backgroundColor: tailwindColors.green[500],
                    yAxisID: 'co2',
                },
                {
                    label: 'Temperature',
                    data: perDayData.map((entry) =>
                        parseFloat(entry['Degrees Celcius']),
                    ),
                    backgroundColor: tailwindColors.red[500],
                    yAxisID: 'temperature',
                },
                {
                    label: 'Humidity',
                    data: perDayData.map((entry) =>
                        parseFloat(entry['% Relative Humidity']),
                    ),
                    backgroundColor: tailwindColors.blue[500],
                    yAxisID: 'humidity',
                },
                {
                    label: 'VOC',
                    data: perDayData.map((entry) =>
                        parseFloat(entry['VOC kOhm']),
                    ),
                    backgroundColor: tailwindColors.orange[500],
                    yAxisID: 'VOC',
                },
                {
                    label: 'PM2.5',
                    data: perDayData.map((entry) => parseFloat(entry['PM2.5'])),
                    backgroundColor: tailwindColors.gray[800],
                    yAxisID: 'pm25',
                },
            ],
        }),
        [perDayData, xLabels],
    )

    // Typescript doesn't like our options-object with multiple y-axes
    // but they do work, and are according to the docs: https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
    return <Line options={options} data={data} />
}

export default DayChart
