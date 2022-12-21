import { useEffect, useState } from "react";
import PageLayout from "../components/page-layout";

function CountryNew() {
    const [form, setForm] = useState({
        language_code: 'en',
        name: '',
        country_code: '',
        continent_id: ''
    });

    const [continents, setContinents] = useState([]);
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const apiKey = localStorage.getItem('apiKey');
        setApiKey(apiKey);

        const fetchContinents = async () => {

            const c = await fetch(`${process.env.REACT_APP_BACKEND}/v1/continent`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const json = await c.json();

            setContinents(json);
        }

        fetchContinents();
    }, []);

    useEffect(() => {
        if (continents.length && form.continent_id === '') {
            setForm({
                ...form,
                continent_id: continents[0].id
            });
        }
    }, [continents, form]);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        await fetch(`${process.env.REACT_APP_BACKEND}/v1/country`, {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': apiKey,
                    
                }
        });
    };

    return (
        <PageLayout>
            <h1 className="text-xl font-medium text-gray-900">Add a new country</h1>
            <p className="mt-1 text-sm text-gray-500">Adding a new country does not happen often. This happened last in 2011 when South Sudan became recognized. Since this task does not happen often it will probably be done by a Level 2 user.</p>

            <form onSubmit={handleSubmit}>
                <section className="mt-4">
                    <div className="flex justify-between">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Country name in English
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
                            placeholder="France"
                            value={form.name || ''}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                <section className="mt-4">
                    <div className="flex justify-between">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Country code (two letters)
                        </label>
                        <span className="text-sm text-gray-500">
                            Required
                        </span>
                    </div>

                    <div className="mt-1">
                        <input
                            type="text"
                            name="country_code"
                            id="country_code"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="FR"
                            value={form.country_code || ''}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                <section className="mt-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Continent
                    </label>

                    <select
                        id="continent_id"
                        name="continent_id"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={form.continent_id || ''}
                        onChange={handleChange}
                    >
                        {continents && continents.map((continent) => (
                            <option key={continent.id} value={continent.id}>{continent.name}</option>
                        ))}
                    </select>
                </section>

                <button
                    type="submit"
                    className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create new country
                </button>
            </form>
        </PageLayout>
    )
}

export default CountryNew;