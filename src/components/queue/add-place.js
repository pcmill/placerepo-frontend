import MiniMap from "../mini-map";

function AddPlaceQueue(props) {
    const q = props.queueItem;

    return (
        <>
            <div className="flex items-center">
                {q.place_name && <p className="text-md text-gray-600">
                    {q.place_name}
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

            {q.request.latitude && q.request.longitude && <div className="mt-2">
                <MiniMap latitude={q.request.latitude} longitude={q.request.longitude} />
            </div>}
        </>
    )
}

export default AddPlaceQueue;