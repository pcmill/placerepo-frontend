import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CenterMap from "../components/center-map";
import PageLayout from "../components/page-layout";
import { roundTo } from "../util/number";

function PlaceNew() {
    const [form, setForm] = useState({
        language_code: 'en',
        name: '',
        latitude: null,
        longitude: null,
        admin_id: null,
        country_id: null
    });

    const [countries, setCountries] = useState([]);
    const [firstAdmins, setFirstAdmins] = useState([]);
    const [secondAdmins, setSecondAdmins] = useState([]);
    const [selectFirstAdmin, setSelectFirstAdmin] = useState(null);
    const [selectSecondAdmin, setSelectSecondAdmin] = useState(null);
    const [apiKey, setApiKey] = useState('');
    const navigate = useNavigate();

    function showFirstAdmin () {
        return firstAdmins && firstAdmins.length > 0;
    }

    function showSecondAdmin () {
        return firstAdmins && 
            firstAdmins.length > 0 &&
            secondAdmins && 
            secondAdmins.length > 0;
    }

    useEffect(() => {
        const apiKey = localStorage.getItem('apiKey');
        setApiKey(apiKey);

        const fetchCountries = async () => {
            const c = await fetch(`${process.env.REACT_APP_BACKEND}/v1/country`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const json = await c.json();

            // Reset the admins if they where already set
            setFirstAdmins([]);
            setSecondAdmins([]);

            setCountries(json);
        }

        fetchCountries();
    }, []);

    useEffect(() => {
        setForm(prevState => {
            return {
                ...prevState,
                admin_id: selectSecondAdmin ? selectSecondAdmin : selectFirstAdmin
            }
        });
    }, [selectFirstAdmin, selectSecondAdmin]);

    useEffect(() => {
        if (form.country_id) {
            const fetchFirstAdmin = async () => {
                const c = await fetch(`${process.env.REACT_APP_BACKEND}/v1/admin/country/${form.country_id}`, {
                    headers: {
                        'x-api-key': apiKey
                    }
                });
    
                const json = await c.json();
    
                setFirstAdmins(json);
                setSelectFirstAdmin(json[0].id);
            }
    
            setSecondAdmins([]);
            fetchFirstAdmin();
        }
    }, [form.country_id, apiKey]);

    useEffect(() => {
        if (selectFirstAdmin) {
            const fetchSecondAdmin = async () => {
                const c = await fetch(`${process.env.REACT_APP_BACKEND}/v1/admin/list/${selectFirstAdmin}`, {
                    headers: {
                        'x-api-key': apiKey
                    }
                });
    
                const json = await c.json();
    
                setSecondAdmins(json);
                setSelectSecondAdmin(json[0].id);
            }
    
            fetchSecondAdmin();
        }
    }, [selectFirstAdmin, apiKey]);

    const handleChange = (event) => {
        setForm(prevState => {
            return {
                ...prevState,
                [event.target.id]: event.target.value
            }
        });
    };

    const setLatLng = (latlng) => {
        setForm(prevState => {
            return {
                ...prevState,
                latitude: latlng.latitude,
                longitude: latlng.longitude
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:8881/v1/place', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': apiKey,
                    
                }
        });

        if (response.ok) {
            navigate('/');
        }
    };

    return (
        <PageLayout>
            <h1 className="text-xl font-medium text-gray-900">Add a new place</h1>

            <form onSubmit={handleSubmit}>
                <section className="mt-4">
                    <div className="flex justify-between">
                        <label htmlFor="email" className="block text-md font-medium text-gray-700">
                            Place name in English
                        </label>
                        <span className="text-sm text-gray-500">
                            Required
                        </span>
                    </div>

                    <div className="mt-1">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Sydney"
                            value={form.name || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <p className="mt-2 text-xs text-gray-500">Translations can be added later.</p>
                </section>

                <section className="mt-4">
                    <label htmlFor="location" className="block text-md font-medium text-gray-700">
                        Country
                    </label>

                    <select
                        id="country_id"
                        name="country_id"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={form.country_id || ''}
                        onChange={handleChange}
                    >
                        {countries && countries.map((country) => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                    </select>
                </section>

                {showFirstAdmin() && <section className="mt-4">
                    <label htmlFor="location" className="block text-md font-medium text-gray-700">
                        Top level admin
                    </label>

                    <select
                        id="admin_id"
                        name="admin_id"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={selectFirstAdmin || ''}
                        onChange={(event) => {setSelectFirstAdmin(event.target.value)}}
                    >
                        {firstAdmins.length && firstAdmins.map((admin) => (
                            <option key={admin.id} value={admin.id}>{admin.name}</option>
                        ))}
                    </select>
                </section>}

                {showSecondAdmin() && <section className="mt-4">
                    <label htmlFor="location" className="block text-md font-medium text-gray-700">
                        Second level admin
                    </label>

                    <select
                        id="admin_id"
                        name="admin_id"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={selectSecondAdmin || ''}
                        onChange={(event) => {setSelectSecondAdmin(event.target.value)}}
                    >
                        {secondAdmins.length && secondAdmins.map((admin) => (
                            <option key={admin.id} value={admin.id}>{admin.name}</option>
                        ))}
                    </select>
                </section>}

                <section className="mt-4">
                    <h3 className="mb-2 block text-md font-medium text-gray-700">
                        Center of the place
                    </h3>

                    <p className="mb-2 text-xs text-gray-500">Drag the marker to where the visual center of the place is.</p>

                    <CenterMap newLatLng={(latlng) => setLatLng(latlng)} />

                    {form.latitude && form.longitude && <div className="mt-2 flex items-center text-xs relative">
                        <span className="text-gray-700">Latitude:</span> 
                        <span className="ml-2 rounded-full bg-gray-300 px-2 py-1 text-xs font-medium text-gray-800">
                            {roundTo(form.latitude, 6)}
                        </span>

                        <span className="ml-2 text-gray-700">Longitude:</span>
                        <span className="ml-2 rounded-full bg-gray-300 px-2 py-1 text-xs font-medium text-gray-800">
                            {roundTo(form.longitude, 6)}
                        </span>
                    </div>}
                </section>

                <button
                    type="submit"
                    className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create new place
                </button>

                <div><pre>{JSON.stringify(form, null, 2) }</pre></div>
            </form>
        </PageLayout>
    )
}

export default PlaceNew;