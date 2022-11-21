import { Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../components/page-layout";
import Translation from "../components/translation";
import TranslationNew from "../components/translation-new";
import { ContinentContext } from "../contexts/continent-context";

function ContinentDetails() {
    const { id } = useParams();
    const apiKey = localStorage.getItem('apiKey');
    const { continent, setContinent } = useContext(ContinentContext);
    const [addingTranslation, setAddingTranslation] = useState(false);
    const [defaultTranslation, setDefaultTranslations] = useState(null);

    useEffect(() => {
        const fetchContinent = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/continent/${id}`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const c = await data.json();
            setContinent(c);

            const defaultT = c.translations.find((t) => t.id === c.default_translation);
            setDefaultTranslations(defaultT);
        }

        fetchContinent();
    }, [id, apiKey, setContinent]);

    function updateTranslations(translation) {
        const newContinent = { ...continent }
        newContinent.translations.push(translation);
        setContinent(newContinent);
    }

    if (continent && defaultTranslation) {
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
                                placeholder="Africa" 
                                entityId={{continent_id: id}}
                                endpoint="/continent/translation"
                                setEntity={(t) => updateTranslations(t)}/>
                        </Transition>

                        {continent.translations.map((tr) => (
                            <li key={tr.id}>
                                <Translation translation={tr} defaultTranslation={tr.id === defaultTranslation.id} />
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

export default ContinentDetails;