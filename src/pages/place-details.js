import { Transition } from "@headlessui/react";
import { BuildingLibraryIcon, BuildingOffice2Icon, BuildingOfficeIcon, ClockIcon, GlobeAltIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DetailMap from "../components/map/detail-map";
import MetadataEdit from "../components/metadata-edit";
import PageLayout from "../components/page-layout";
import Translation from "../components/translation/translation";
import TranslationNew from "../components/translation/translation-new";
import { AuthContext } from "../contexts/auth-context";
import { PlaceContext } from "../contexts/place-context";

function PlaceDetails() {
    const { id } = useParams();
    const apiKey = localStorage.getItem('apiKey');
    const { place, setPlace } = useContext(PlaceContext);
    const [addingTranslation, setAddingTranslation] = useState(false);
    const [addingMetadata, setAddingMetaData] = useState(false);
    const [defaultTranslation, setDefaultTranslations] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPlace = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/place/${id}`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const c = await data.json();
            setPlace(c);

            const defaultT = c.translations.find((t) => t.id === c.default_translation);
            setDefaultTranslations(defaultT);
        }

        fetchPlace();
    }, [id, apiKey, setPlace]);

    function updateMetadata(metadata) {
        setAddingMetaData(false);
        const newPlace = { ...place, ...metadata }
        setPlace(newPlace);
    }

    if (place && defaultTranslation) {
        return (
            <PageLayout>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {defaultTranslation.name}
                </h2>

                <section className="mt-2 flex flex-row mt-4 flex-wrap space-x-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <GlobeAltIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {place.country_name}
                    </span>

                    {place.admin_4_name && <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <BuildingLibraryIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        Admin 4 - {place.admin_4_name}
                    </div>}

                    {place.admin_3_name && <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <BuildingOffice2Icon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        Admin 3 - {place.admin_3_name}
                    </div>}

                    {place.admin_2_name && <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <BuildingOfficeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        Admin 2 - {place.admin_2_name}
                    </div>}

                    {place.admin_1_name && <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <HomeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        Admin 1 - {place.admin_1_name}
                    </div>}
                </section>

                <section className="flex flex-row mt-1 sm:flex-wrap space-x-2">
                    <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {place.timezone}
                    </span>
                </section>

                <section>
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
                                    placeholder="New York" 
                                    entityId={{place_id: id}}
                                    requestType="add_place_translation" />
                            </Transition>

                            {place.translations.map((tr) => (
                                <li key={tr.id}>
                                    <Translation 
                                        translation={tr}
                                        endpoint="/place/translation"
                                        placeholder="New York" 
                                        defaultTranslation={tr.id === defaultTranslation.id} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="mt-4">
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                            Meta data
                        </h2>

                        {user && <button
                            onClick={() => setAddingMetaData(!addingMetadata)}
                            type="button"
                            className="ml-auto inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {addingMetadata && <span>Done</span>}
                            {!addingMetadata && <span>Edit meta data</span>}
                        </button>}
                    </div>

                    <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                        {!addingMetadata && <div className="px-6 pt-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="truncate text-sm text-gray-600">Population</p>
                            </div>
                        </div>}

                        {!addingMetadata && <div className="mt-2 sm:flex sm:justify-between">
                            <div className="px-6 pb-4 sm:flex">
                                <p className="flex items-center text-sm font-medium text-indigo-800">
                                    {place.population || 'Unknown'}
                                </p>

                                {place.population && <p className="ml-2 inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                    approximate: {place.population_approximate ? 'yes' : 'no'}
                                </p>}

                                {place.population && place.population_record_year && <p className="ml-2 inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                    record year: {place.population_record_year}
                                </p>}
                            </div>
                        </div>}

                        {addingMetadata && <MetadataEdit place={place} setEntity={(t) => updateMetadata(t)} />}
                    </div>

                    <div className="mt-2 overflow-hidden bg-white shadow sm:rounded-md">
                        {!addingMetadata && <div className="px-6 pt-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="truncate text-sm text-gray-600">Wikidata ID</p>
                            </div>
                        </div>}

                        {!addingMetadata && <div className="mt-2 sm:flex sm:justify-between">
                            <div className="px-6 pb-4 sm:flex">
                                {place.wikidata_id && <a href={`https://www.wikidata.org/wiki/${place.wikidata_id}`} className="flex underline items-center text-sm font-medium text-indigo-800">
                                    {place.wikidata_id}
                                </a>}

                                {!place.wikidata_id && <p className="flex items-center text-sm font-medium text-indigo-800">Unknown</p>}
                            </div>
                        </div>}
                    </div>
                </section>

                <section className="mt-4">
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                            Map
                        </h2>

                        {user && <Link
                            to={`/place/${id}/map`}
                            type="button"
                            className="ml-auto inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Edit map
                        </Link>}
                    </div>
                
                    <div className="mt-4">
                        <DetailMap 
                            latitude={place.latitude}
                            longitude={place.longitude}
                            polygon={place.polygon}
                            name={defaultTranslation.name}/>
                    </div>
                </section>
            </PageLayout>
        );
    } else {
        return null;
    }
}

export default PlaceDetails;