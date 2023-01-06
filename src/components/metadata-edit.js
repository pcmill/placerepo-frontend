import { useContext, useState } from "react";
import { AuthContext } from "../contexts/auth-context";

function MetadataEdit(props) {
    const [place, setPlace] = useState(props.place);
    const { accessToken } = useContext(AuthContext);

    async function saveMetadata(event) {
        event.preventDefault();

        const body = {
            changeRequest: {
                type: 'update_place',
                requestObject: {
                    place_id: place.id,
                    country_id: place.country_id,
                    latitude: Number(place.latitude),
                    longitude: Number(place.longitude),
                    polygon: place.polygon,
                    admin_id: place.admin_id,
                    population: place.population,
                    population_approximate: place.population_approximate,
                    population_record_year: place.population_record_year,
                    wikidata_id: place.wikidata_id
                }
            }
        }

        await fetch(`${process.env.REACT_APP_BACKEND}/v1/queue`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                'x-access-token': accessToken
            }
        });
    }

    function convertToBoolean(value) {
        if (value === 'true') {
            return true;
        }

        return false;
    }

    function cancelEdit(event) {
        event.preventDefault();

        props.setEntity({
            population: props.place.population,
            population_approximate: props.place.population_approximate,
            population_record_year: props.place.population_record_year,
            wikidata_id: props.place.wikidata_id
        });
    }

    return (
        <div className="divide-y divide-gray-200">
            <form onSubmit={(e) => saveMetadata(e)} className="px-6 py-4">
                <p className="mb-2 truncate text-sm font-medium text-grey-400">Edit population</p>

                <div className="flex w-full flex-col">
                    <div className="flex">
                        <div className="flex flex-col">
                            <label htmlFor="population">
                                Population
                            </label>

                            <input
                                type="text"
                                name="population"
                                id="population"
                                value={place.population || ""}
                                onChange={(e) => setPlace({ ...place, population: Number(e.target.value) })}
                                className="block flex w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder={125969}
                            />
                        </div>

                        <div className="flex flex-col ml-4">
                            <label htmlFor="population_record_year">
                                Population record year
                            </label>

                            <input
                                type="text"
                                name="population_record_year"
                                id="population_record_year"
                                value={place.population_record_year || ""}
                                onChange={(e) => setPlace({ ...place, population_record_year: Number(e.target.value) })}
                                className="block flex w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder={2020}
                            />
                        </div>

                        <div className="flex flex-col ml-4">
                            <label htmlFor="population_approximate">
                                Population approximate
                            </label>

                            <input
                                type="checkbox"
                                name="population_approximate"
                                id="population_approximate"
                                value={place.population_approximate || false}
                                onChange={(e) => setPlace({ ...place, population_approximate: convertToBoolean(e.target.value) })}
                                className="block flex rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder={2020}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex ml-auto">
                        <span
                            onClick={(event) => cancelEdit(event)}
                            className="relative cursor-pointer ml-2 rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2"
                        >
                            Cancel
                        </span>

                        <button
                            type="submit"
                            className="relative ml-2 rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </form>

            <form onSubmit={(e) => saveMetadata(e)} className="flex flex-col px-6 py-4">
                <p className="mb-2 truncate text-sm font-medium text-grey-400">Edit Wikidata ID</p>

                <div className="flex flex-col">
                    <label htmlFor="wikidata_id">
                        Wikidata ID
                    </label>

                    <input
                        type="text"
                        name="wikidata_id"
                        id="wikidata_id"
                        value={place.wikidata_id || ""}
                        onChange={(e) => setPlace({ ...place, wikidata_id: e.target.value })}
                        className="block flex rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Q12345"
                    />
                </div>

                <div className="mt-4 flex ml-auto">
                    <span
                        onClick={(event) => cancelEdit(event)}
                        className="relative cursor-pointer ml-2 rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2"
                    >
                        Cancel
                    </span>

                    <button
                        type="submit"
                        className="relative ml-2 rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Save changes
                    </button>
                </div>
            </form>
        </div>
    )
}

export default MetadataEdit;