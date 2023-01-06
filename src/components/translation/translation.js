import { PencilIcon } from "@heroicons/react/20/solid";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth-context";
import TranslationEdit from "./translation-edit";

function Translation(props) {
    const [editing, setEditing] = useState(false);
    const translation = props.translation;
    const defaultTranslation = props.defaultTranslation || false;
    const { user } = useContext(AuthContext);

    function updateTranslation(t) {
        translation.name = t.name;
        setEditing(false);
    }

    return (
        <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
                {!editing && <div className="flex items-center">
                    <p className="truncate text-sm font-medium text-indigo-600">{translation.name}</p>
                    {user && <PencilIcon onClick={() => setEditing(true)} className="ml-2 mr-1.5 h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />}
                </div>}
                
                {defaultTranslation && !editing && <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        default translation
                    </p>
                </div>}
            </div>

            {!editing && <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-800">
                        <LanguageIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                        {translation.language_code} {translation.language && <span className="ml-1 text-gray-500">({translation.language})</span>}
                    </p>
                </div>
            </div>}

            {editing && <TranslationEdit 
                translation={translation}
                placeholder={props.placeholder}
                endpoint={props.endpoint}
                setEntity={(t) => updateTranslation(t)}/>}
        </div>
    )
}

export default Translation;