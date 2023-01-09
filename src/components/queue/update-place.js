import { Link } from "react-router-dom";
import { undefinedText } from "../../util/text";
import MiniMap from "../map/mini-map";

function UpdatePlaceQueue(props) {
    const q = props.queueItem;

    return (
        <>
            <div className="flex items-center">
                {q.place_name && <p className="text-md text-gray-600">
                    <Link to={`/place/${q.place.id}`} className="underline">{q.place_name}</Link>
                </p>}

                {q.request.name && <p className="text-md text-gray-700">
                    {q.request.name}
                </p>}

                <p className="ml-auto text-sm text-gray-400">
                    {q.request_type}
                </p>
            </div>

            <div className="flex items-center">
                {q.admin_name && <p className="mr-3 text-sm text-gray-500">{q.admin_name}</p>}
                {q.country_name && <p className="text-sm text-gray-500">{q.country_name}</p>}
            </div>

            <h4 className="mt-2 text-md text-gray-700">Changes</h4>

            <div className="border-y border-gray-200 px-4 py-5 sm:p-0 mt-2">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {q.request.population && q.place.population !== q.request.population && 
                        <div className="py-2 sm:grid sm:grid-cols-3 gap-4 px-2">
                            <dt className="text-sm font-medium text-gray-500">Population </dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{undefinedText(q.place.population)} -&gt; <span className="font-medium text-gray-700">{q.request.population}</span></dd>
                        </div>}

                    {q.request.population_record_year && q.place.population_record_year !== q.request.population_record_year && 
                        <div className="py-2 sm:grid sm:grid-cols-3 gap-4 px-2">
                            <dt className="text-sm font-medium text-gray-500">Population Record Year</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{undefinedText(q.place.population_record_year)} -&gt; <span className="font-medium text-gray-700">{q.request.population_record_year}</span></dd>
                        </div>}
                    
                    {q.request.population_approximate && q.place.population_approximate !== q.request.population_approximate && 
                        <div className="py-2 sm:grid sm:grid-cols-3 gap-4 px-2">
                            <dt className="text-sm font-medium text-gray-500">Population Approximate</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{undefinedText(q.place.population_approximate)} -&gt; <span className="font-medium text-gray-700">{q.request.population_approximate}</span></dd>
                        </div>}
                    
                    {q.request.wikidata_id && q.place.wikidata_id !== q.request.wikidata_id && 
                        <div className="py-2 sm:grid sm:grid-cols-3 gap-4 px-2">
                            <dt className="text-sm font-medium text-gray-500">Wikidata id</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{undefinedText(q.place.wikidata_id)} -&gt; <span className="font-medium text-gray-700">{q.request.wikidata_id}</span></dd>
                        </div>}

                    {q.request.polygon && !q.place.polygon && 
                        <div className="py-2 sm:grid sm:grid-cols-3 gap-4 px-2">
                            <dt className="text-sm font-medium text-gray-500">Polygon</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">New polygon added</dd>
                        </div>}
                    
                    {q.request.polygon && q.place.polygon && 
                        <div className="py-2 sm:grid sm:grid-cols-3 gap-4 px-2">
                            <dt className="text-sm font-medium text-gray-500">Polygon</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">Polygon adjusted</dd>
                        </div>}
                </dl>
            </div>

            {q.request.latitude && q.request.longitude && q.request.polygon && <div className="mt-4">
                <MiniMap
                    latitude={q.request.latitude}
                    longitude={q.request.longitude} 
                    oldPolygon={q.place.polygon}
                    newPolygon={q.request.polygon} />
            </div>}

            {q.request.latitude && q.request.longitude && 
                q.place.latitude !== q.request.latitude && 
                q.place.longitude !== q.request.longitude && <div className="mt-4">
                <MiniMap
                    latitude={q.request.latitude}
                    longitude={q.request.longitude} />
            </div>}
        </>
    )
}

export default UpdatePlaceQueue;