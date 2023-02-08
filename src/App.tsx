import React from 'react'

// Our own components
import DayChart from './DayChart'
import FileLoader from './FileLoader'

// Styles
import './styles/app.css'

const dateProp = 'Date (DD-MM-YYYY)'

const appTitle = 'MoreSense Log Viewer'

type TDayData = Record<string, string>[]

export default function App() {
    const [file, setFile] = React.useState<File>()
    const [columns, setColumns] = React.useState<string[]>([])
    const [data, setData] = React.useState<Record<string, string>[]>([])

    const [selectedDay, setSelectedDay] = React.useState(1)

    // Debug info: show columns
    React.useEffect(() => {
        // PapaParse doesnt correctly parse all the columns, so we dont get all the particulate matter columns
        console.log('Columns in data: ', columns)
    }, [columns])

    // Set document title
    React.useEffect(() => {
        document.title = appTitle
    }, [])

    // Split data per day
    const dataPerDay = React.useMemo(() => {
        let _allDaysData: TDayData[] = []
        let currentDay = ''
        let currentDayData: TDayData = []

        // Go through all entries from the CSV, add those to data per day
        // if a new day encountered: put the dayData in allDaysData
        // clear dayData, start adding again
        data.forEach((entry, i) => {
            const entryDate = entry[dateProp]

            if (i === 0) {
                // Setup: set the currentDay to the first item's day
                currentDay = entryDate
            }

            // if our entry belongs to a different day, create an entry for a new day
            // 00-00-000 means the MoreSense didnt have internet, and thus no date was stored
            // we'll treat it as not a new day
            if (entryDate !== currentDay && entryDate !== '00-00-0000') {
                // make new day

                currentDay = entryDate

                // Store the finished day data
                _allDaysData.push(currentDayData)

                // Clear current day data
                currentDayData = []
            } else {
                // Not a new day, just a new entry
                currentDayData.push(entry)

                // if last entry, push this day to allDays as well
                if (i === data.length - 1) {
                    _allDaysData.push(currentDayData)
                }
            }
        })

        return _allDaysData
    }, [data])

    // Prepare data for components
    // Our days start at day 1, which corresponds to position 0 in the array
    let dataForPickedDay = dataPerDay[selectedDay - 1]

    const tailwindClasses = {
        button: 'rounded-full bg-sky-300 py-2 px-4 font-semibold text-slate-900 hover:bg-sky-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500',
        greyButton:
            'rounded-full bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400',
    }

    return (
        <div className="App bg-slate-900 min-h-screen text-white flex flex-col items-center">
            <h1
                className="bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 
                            bg-clip-text font-display text-5xl tracking-tight text-transparent mt-8 leading-normal"
            >
                MoreSense Log Viewer
            </h1>
            <FileLoader
                data={data}
                setData={setData}
                file={file}
                setFile={setFile}
                setColumns={setColumns}
            />
            <div className="flex gap-x-2 items-center">
                <button
                    className={tailwindClasses.button}
                    onClick={() => {
                        if (selectedDay > 1) {
                            setSelectedDay(selectedDay - 1)
                        }
                    }}
                >
                    {'←'}
                </button>
                {selectedDay} of {dataPerDay.length}
                <button
                    className={`${tailwindClasses.button}`}
                    onClick={() => {
                        if (selectedDay < dataPerDay.length)
                            setSelectedDay(selectedDay + 1)
                    }}
                >
                    {'→'}
                </button>
            </div>

            {dataPerDay.length > 0 && dataForPickedDay && (
                <DayChart perDayData={dataForPickedDay} />
            )}
        </div>
    )
}
