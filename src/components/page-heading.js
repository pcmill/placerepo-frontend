import { FlagIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

function PageHeading(props) {
    return (
        <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {props.name}
                </h2>

                <div className="mt-2 flex flex-row sm:mt-4 sm:flex-wrap space-x-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <GlobeAltIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {props.continent}
                    </span>

                    <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <FlagIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {props.country_code}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageHeading;