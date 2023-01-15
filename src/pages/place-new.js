import { useContext, useEffect, useState } from "react";
import CenterMap from "../components/map/center-map";
import LoggedOut from "../components/logged-out";
import PageLayout from "../components/page-layout";
import { AuthContext } from "../contexts/auth-context";
import { NotificationContext } from "../contexts/notification-context";
import { roundTo } from "../util/number";
import { XCircleIcon } from "@heroicons/react/24/outline";

function PlaceNew() {
    const emptyForm = {
        language_code: 'en',
        name: '',
        latitude: null,
        longitude: null,
        admin_id: null,
        country_id: null
    };

    const [form, setForm] = useState(emptyForm);

    const [countries, setCountries] = useState([]);
    const [firstAdmins, setFirstAdmins] = useState([]);
    const [secondAdmins, setSecondAdmins] = useState([]);
    const [thirdAdmins, setThirdAdmins] = useState([]);
    const [selectFirstAdmin, setSelectFirstAdmin] = useState(null);
    const [selectSecondAdmin, setSelectSecondAdmin] = useState(null);
    const [selectThirdAdmin, setSelectThirdAdmin] = useState(null);
    const { user, accessToken } = useContext(AuthContext);
    const { addNotification } = useContext(NotificationContext);

    function showFirstAdmin () {
        return firstAdmins && firstAdmins.length > 0;
    }

    function showSecondAdmin () {
        return firstAdmins && 
            firstAdmins.length > 0 &&
            secondAdmins && 
            secondAdmins.length > 0;
    }

    function showThirdAdmin () {
        return firstAdmins &&
            firstAdmins.length > 0 &&
            secondAdmins &&
            secondAdmins.length > 0 &&
            thirdAdmins &&
            thirdAdmins.length > 0;
    }

    function activateSubmitButton() {
        return form.name && form.latitude && form.longitude && form.country_id;
    }

    useEffect(() => {
        const fetchCountries = async () => {
            const c = await fetch(`${process.env.REACT_APP_BACKEND}/v1/country`);
            const json = await c.json();

            setCountries(json);

            const lastUsedCountry = localStorage.getItem('lastUsedCountry');

            setForm(prevState => {
                return {
                    ...prevState,
                    country_id: (lastUsedCountry || json[0].id)
                }
            });
        }

        fetchCountries();
    }, []);

    useEffect(() => {
        let admin_id = null;

        if (selectThirdAdmin) {
            admin_id = selectThirdAdmin;
        } else if (selectSecondAdmin) {
            admin_id = selectSecondAdmin;
        } else if (selectFirstAdmin) {
            admin_id = selectFirstAdmin;
        }

        setForm(prevState => {
            return {
                ...prevState,
                admin_id
            }
        });
    }, [selectFirstAdmin, selectSecondAdmin, selectThirdAdmin]);

    useEffect(() => {
        if (form.country_id) {
            const fetchFirstAdmin = async () => {
                const c = await fetch(`${process.env.REACT_APP_BACKEND}/v1/admin/country/${form.country_id}`);
                const json = await c.json();
    
                setFirstAdmins(json);

                if (json.length > 0) {
                    setSelectFirstAdmin(json[0].id);
                } else {
                    setSelectFirstAdmin(null);
                }
            }
    
            setSecondAdmins([]);
            fetchFirstAdmin();
        }
    }, [form.country_id]);

    useEffect(() => {
        if (selectFirstAdmin) {
            const fetchSecondAdmin = async () => {
                const c = await fetch(`${process.env.REACT_APP_BACKEND}/v1/admin/list/${selectFirstAdmin}`);
                const json = await c.json();
    
                setSecondAdmins(json);

                if (json.length > 0) {
                    setSelectSecondAdmin(json[0].id);
                } else {
                    setSelectSecondAdmin(null);
                }
            }
    
            fetchSecondAdmin();
        } else {
            setSelectSecondAdmin(null);
        }
    }, [selectFirstAdmin]);

    useEffect(() => {
        if (selectSecondAdmin) {
            const fetchThirdAdmin = async () => {
                const c = await fetch(`${process.env.REACT_APP_BACKEND}/v1/admin/list/${selectSecondAdmin}`);
                const json = await c.json();
    
                setThirdAdmins(json);

                if (json.length > 0) {
                    setSelectThirdAdmin(json[0].id);
                } else {
                    setSelectThirdAdmin(null);
                }
            }
    
            fetchThirdAdmin();
        } else {
            setSelectThirdAdmin(null);
        }
    }, [selectSecondAdmin]);

    const handleChange = (event) => {
        setForm(prevState => {
            return {
                ...prevState,
                [event.target.id]: event.target.value
            }
        });

        if (event.target.id === 'country_id') {
            localStorage.setItem('lastUsedCountry', event.target.value);
        }
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

        const body = {
            changeRequest: {
                type: 'add_place',
                requestObject: form
            }
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND}/v1/queue`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                'x-access-token': accessToken
            }
        });

        await response.json();

        if (response.ok) {
            addNotification('success', 'Your request has been added to the queue. It will be processed as soon as possible.', 10000);
            
            setForm(prevState => {
                return {
                    ...prevState,
                    name: null,
                    latitude: null,
                    longitude: null
                }
            });
            
            window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })
        } else {
            addNotification('error', 'An error occurred. Please try again later.', 5000);
        }
    };

    return (
        <PageLayout>
            <h1 className="text-xl font-medium text-gray-900">Add a new place</h1>

            {!user && <div className="mt-4">
                <LoggedOut />
            </div>}

            {user && <form onSubmit={handleSubmit}>
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

                {showThirdAdmin() && <section className="mt-4">
                    <label htmlFor="location" className="block text-md font-medium text-gray-700">
                        Third level admin
                    </label>

                    <select
                        id="admin_id"
                        name="admin_id"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={selectThirdAdmin || ''}
                        onChange={(event) => {setSelectThirdAdmin(event.target.value)}}
                    >
                        {thirdAdmins.length && thirdAdmins.map((admin) => (
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

                {!activateSubmitButton() && <section>
                    <div className="mt-4 rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>

                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">There are some errors.</h3>

                                <div className="mt-2 text-sm text-red-700">
                                    <ul className="list-disc space-y-1 pl-5">
                                        {(!form.latitude || !form.longitude) && <li>Drag the marker on the map to set the latitude and longitude.</li>}
                                        {(!form.name) && <li>The name should be at least 1 character.</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}

                <button
                    type="submit"
                    disabled={!activateSubmitButton()}
                    className="mt-4 inline-flex items-center rounded-md border border-transparent disabled:bg-gray-300 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create new place
                </button>
            </form>}
        </PageLayout>
    )
}

export default PlaceNew;