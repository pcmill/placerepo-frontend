import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/page-layout";

function CountryList() {
    const apiKey = localStorage.getItem('apiKey');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/country`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const c = await data.json();
            setCountries(c);
        }

        fetchCountries();
    }, [apiKey]);

    if (countries) {
        return (
            <PageLayout>
                <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                    Countries
                </h2>

                <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {countries.map((c) => (
                            <li key={c.id}>
                                <Link to={"/country/" + c.id} className="block hover:bg-gray-50" preventScrollReset={true}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center">
                                            <p className="truncate text-sm font-medium text-indigo-600">{c.name}</p>

                                            <div className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5">
                                                <span className="text-xs text-gray-500">Translations</span>
                                                <span className="ml-2 text-sm text-gray-800">{c.translations}</span> 
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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

export default CountryList;