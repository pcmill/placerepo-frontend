import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CountryList() {
    const apiKey = localStorage.getItem('apiKey');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            const data = await fetch(`http://localhost:8881/v1/country`, {
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
            <>
                <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                    Countries
                </h2>

                <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {countries.map((c) => (
                            <li key={c.id}>
                                <Link to={"/country/" + c.id} className="block hover:bg-gray-50" preventScrollReset={true}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-sm font-medium text-indigo-600">{c.name}</p>
                                        </div>
                                    </div>
                                </Link>
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

export default CountryList;