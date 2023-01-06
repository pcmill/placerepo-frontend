import { Link } from "react-router-dom";

function AddTranslationQueue(props) {
    const q = props.queueItem;

    return (
        <>
            <div className="flex items-center">
                {q.place_name && q.request.name && <p className="text-md text-gray-600">
                    Add {q.language} translation <span className="font-medium">{q.request.name}</span> to place <Link to={`/place/${q.place.id}`} className="underline">{q.place_name}</Link>
                </p>}

                {q.admin_name && q.request.name && <p className="text-md text-gray-600">
                    Add {q.language} translation <span className="font-medium">{q.request.name}</span> to administrative area <Link to={`/admin/${q.admin.id}`} className="underline">{q.admin_name}</Link>
                </p>}

                {q.country_name && q.request.name && <p className="text-md text-gray-600">
                    Add {q.language} translation <span className="font-medium">{q.request.name}</span> to country <Link to={`/country/${q.country.id}`} className="underline">{q.country_name}</Link>
                </p>}

                {q.continent_name && q.request.name && <p className="text-md text-gray-600">
                    Add {q.language} translation <span className="font-medium">{q.request.name}</span> to continent <Link to={`/continent/${q.continent.id}`} className="underline">{q.continent_name}</Link>
                </p>}
            </div>
        </>
    )
}

export default AddTranslationQueue;