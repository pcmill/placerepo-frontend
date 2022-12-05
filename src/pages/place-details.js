import { Transition } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../components/page-layout";
import Translation from "../components/translation";
import TranslationNew from "../components/translation-new";
import { PlaceContext } from "../contexts/place-context";

function PlaceDetails() {
    const { id } = useParams();
    const apiKey = localStorage.getItem('apiKey');
    const { place, setPlace } = useContext(PlaceContext);
    const [addingTranslation, setAddingTranslation] = useState(false);
    const [defaultTranslation, setDefaultTranslations] = useState(null);

    useEffect(() => {
        const fetchPlace = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/place/${id}`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const c = await data.json();
            setPlace(c);

            const defaultT = c.translations.find((t) => t.id === c.default_translation);
            setDefaultTranslations(defaultT);
        }

        fetchPlace();
    }, [id, apiKey, setPlace]);

    function updateTranslations(translation) {
        const newPlace = { ...place }
        newPlace.translations.push(translation);
        setPlace(newPlace);
    }

    if (place && defaultTranslation) {
        return (
            <PageLayout>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {defaultTranslation.name}
                </h2>

                <div className="flex mt-4 items-center">
                    <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                        Translations
                    </h2>

                    <button
                        onClick={() => setAddingTranslation(!addingTranslation)}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {addingTranslation && <span>Done</span>}
                        {!addingTranslation && <span>Add translation</span>}
                    </button>
                </div>

                <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        <Transition
                            show={addingTranslation}
                            enter="transition-opacity duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100">
                            <TranslationNew 
                                placeholder="New York" 
                                entityId={{place_id: id}}
                                endpoint="/place/translation"
                                setEntity={(t) => updateTranslations(t)}/>
                        </Transition>

                        {place.translations.map((tr) => (
                            <li key={tr.id}>
                                <Translation 
                                    translation={tr}
                                    endpoint="/place/translation"
                                    placeholder="New York" 
                                    defaultTranslation={tr.id === defaultTranslation.id} />
                            </li>
                        ))}
                    </ul>
                </div>
            </PageLayout>
        );
    } else {
        return null;
    }
}

export default PlaceDetails;