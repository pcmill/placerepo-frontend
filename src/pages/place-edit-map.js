import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditMap from "../components/edit-map";
import PageLayout from "../components/page-layout";
import { PlaceContext } from "../contexts/place-context";

function PlaceEditMap() {
    const { id } = useParams();
    const apiKey = localStorage.getItem('apiKey');
    const navigate = useNavigate();
    const { place, setPlace } = useContext(PlaceContext);
    const [defaultTranslation, setDefaultTranslations] = useState(null);

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

    async function savePlace(event) {
        event.preventDefault();

        const body = {
            place_id: place.id,
            country_id: place.country_id,
            latitude: place.latitude,
            longitude: place.longitude,
            polygon: place.polygon,
            admin_id: place.admin_id
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND}/v1/place`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                'x-api-key': apiKey
            }
        });

        if (response.ok) {
            navigate(`/place/${place.id}`);
        }
    }

    if (place) {
        return (
            <PageLayout>
                {defaultTranslation && <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Editing data for {defaultTranslation.name}
                </h2>}

                <section className="mt-4">
                    <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                        Map
                    </h2>

                    <p className="my-2 text-xs text-gray-500">Move the marker around to set a new center. Add a polygon for the place outline.</p>
                
                    <div className="mt-4">
                        <EditMap 
                            latitude={place.latitude}
                            longitude={place.longitude}
                            polygon={place.polygon}
                            setPolygon={(polygon) => setPlace({ ...place, polygon })}
                            />
                    </div>
                </section>

                <section className="mt-4">
                    <button
                        type="submit"
                        onClick={(e) => savePlace(e)}
                        className="relative rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Save changes
                    </button>
                </section>
            </PageLayout>
        );
    } else {
        return null;
    }
}

export default PlaceEditMap;