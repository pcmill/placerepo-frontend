import { Transition } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminList from "../components/admin-list";
import PageHeading from "../components/page-heading";
import PageLayout from "../components/page-layout";
import Translation from "../components/translation/translation";
import TranslationNew from "../components/translation/translation-new";
import { AuthContext } from "../contexts/auth-context";
import { CountryContext } from "../contexts/country-context";

function CountryDetails() {
    const { id } = useParams();
    const { country, setCountry } = useContext(CountryContext);
    const [addingTranslation, setAddingTranslation] = useState(false);
    const [defaultTranslation, setDefaultTranslations] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCountry = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/country/${id}`);

            const c = await data.json();
            setCountry(c);

            const defaultT = c.translations.find((t) => t.id === c.default_translation);
            setDefaultTranslations(defaultT);
        }

        fetchCountry();
    }, [id, setCountry]);

    if (country && defaultTranslation) {
        return (
            <PageLayout>
                <PageHeading name={defaultTranslation.name} country_code={country.country_code} continent={country.continent_name} />

                <div className="flex mt-4 items-center">
                    <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                        Translations
                    </h2>

                    {user && <button
                        onClick={() => setAddingTranslation(!addingTranslation)}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {addingTranslation && <span>Done</span>}
                        {!addingTranslation && <span>Add translation</span>}
                    </button>}
                </div>

                <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        <Transition
                            show={addingTranslation}
                            enter="transition-opacity duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100">
                            <TranslationNew 
                                placeholder="Kenya" 
                                entityId={{country_id: id}}
                                requestType="add_country_translation"/>
                        </Transition>

                        {country.translations.map((tr) => (
                            <li key={tr.id}>
                                <Translation 
                                    requestType="update_country_translation"
                                    translation={tr}
                                    placeholder="Kenya"
                                    defaultTranslation={tr.id === defaultTranslation.id} />
                            </li>
                        ))}
                    </ul>
                </div>

                <AdminList countryId={country.id} />
            </PageLayout>
        );
    } else {
        return null;
    }
}

export default CountryDetails;