import { LanguageIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeading from "../components/page-heading";
import { CountryContext } from "../contexts/country-context";

function CountryDetails() {
    const { id } = useParams();
    const { country, setCountry } = useContext(CountryContext);
    const apiKey = localStorage.getItem('apiKey');
    const [defaultTranslation, setDefaultTranslations] = useState(null);

    useEffect(() => {
        const fetchCountry = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/country/${id}`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const c = await data.json();
            setCountry(c);

            const defaultT = c.translations.find((t) => t.id === c.default_translation);
            setDefaultTranslations(defaultT);
        }

        fetchCountry();
    }, [id, apiKey, setCountry]);

    if (country && defaultTranslation) {
        return (
            <>
                <PageHeading name={defaultTranslation.name} country_code={country.country_code} continent={country.continent_name} />

                <h2 className="mt-4 text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                    Translations
                </h2>

                <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {country.translations.map((tr) => (
                            <li key={tr.id}>
                                <a href="/" className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-sm font-medium text-indigo-600">{tr.name}</p>
                                            
                                            {tr.id === defaultTranslation.id && <div className="ml-2 flex flex-shrink-0">
                                                <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                    default translation
                                                </p>
                                            </div>}
                                        </div>

                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-700">
                                                    <LanguageIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                                                    {tr.language_code} {tr.language && <span className="ml-1 text-gray-500">({tr.language})</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    } else {
        return null;
    }
}

export default CountryDetails;