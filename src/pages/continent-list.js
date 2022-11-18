import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ContinentList() {
    const apiKey = localStorage.getItem('apiKey');
    const [continents, setContinents] = useState([]);

    useEffect(() => {
        const fetchContinents = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/continent`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const c = await data.json();
            setContinents(c);
        }

        fetchContinents();
    }, [apiKey]);

    if (continents) {
        return (
            <>
                <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                    Continents
                </h2>

                <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {continents.map((c) => (
                            <li key={c.id}>
                                <Link to={"/continent/" + c.id} className="block hover:bg-gray-50" preventScrollReset={true}>
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

export default ContinentList;