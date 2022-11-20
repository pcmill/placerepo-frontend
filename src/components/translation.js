import { LanguageIcon } from "@heroicons/react/24/outline";

function Translation(props) {
    const translation = props.translation;
    const defaultTranslation = props.defaultTranslation || false;

    return (
        <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-indigo-600">{translation.name}</p>
                
                {defaultTranslation && <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        default translation
                    </p>
                </div>}
            </div>

            <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-800">
                        <LanguageIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                        {translation.language_code} {translation.language && <span className="ml-1 text-gray-500">({translation.language})</span>}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Translation;