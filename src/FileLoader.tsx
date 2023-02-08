import React from 'react'

// Utilities
import Papa from 'papaparse'
import sampleData from './data/sampleData'

// Allowed extensions for input file
const allowedExtensions = ['csv']

const tailwindClasses = {
    greyButton:
        'rounded-full bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400',
}

type TFileLoaderProps = {
    file?: File
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>
    data: Record<string, string>[]
    setData: React.Dispatch<React.SetStateAction<Record<string, string>[]>>
    setColumns: React.Dispatch<React.SetStateAction<string[]>>
}

export default function FileLoader({
    file,
    setFile,
    data,
    setData,
    setColumns,
}: TFileLoaderProps) {
    // Will contain the error when
    // correct file extension is not used
    const [error, setError] = React.useState('')

    const loadSampleData = () => {
        let mergedSampleData: any[] = []
        sampleData.forEach((dayData) => mergedSampleData.push(...dayData))
        setData(mergedSampleData)
    }

    const parseFile = () => {
        // If user clicks the parse button without
        // a file we show a error
        if (!file) return setError('Enter a valid file')

        const reader = new FileReader()

        // Event listener on reader when the file
        // loads, we parse it and set the data.
        // this data is kind of derived state so would be good to not store it with useState
        // but with useMemo, but that's hard because FileReader is async
        // TODO fix the typing here, see https://stackoverflow.com/questions/71434654/typescript-papaparse-no-overload-matches-this-call
        reader.onload = async ({ target }) => {
            if (!target) return null

            const result = target.result

            if (!result) return null

            const csv = Papa.parse(target, { header: true })
            const parsedData = csv.data
            const columns = Object.keys(parsedData[0])
            setColumns(columns)
            setData(parsedData)
        }
        reader.readAsText(file)
    }

    const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        setError('')

        const eventTarget = e.target as HTMLInputElement

        // Check if user has entered the file
        if (eventTarget.files?.length) {
            const inputFile = eventTarget.files[0]

            // Check if the fileExtension is valid
            const fileExtension = inputFile?.type.split('/')[1]
            if (!allowedExtensions.includes(fileExtension)) {
                setError('Please input a csv file')
                return
            }

            // If input type is correct set the file in state
            setFile(inputFile)
        }
    }

    // Automatically parse file when the user selects a file
    React.useEffect(parseFile, [file, setColumns, setData])

    return (
        <>
            <div className="flex gap-x-2">
                <label
                    htmlFor="csvInput"
                    style={{ display: 'block' }}
                    className={`${tailwindClasses.greyButton} my-3`}
                >
                    Pick a .CSV log file
                </label>
                <button
                    onClick={loadSampleData}
                    className="text-slate-500 text-xs"
                >
                    Use sample data
                </button>
                <input
                    className="w-0 h-0"
                    onChange={handleFileChange}
                    id="csvInput"
                    name="file"
                    type="File"
                />
            </div>
            {/* Debug info - only show error when data is empty (sampleData loaded) */}
            <div>{!data && error && error}</div>
        </>
    )
}
