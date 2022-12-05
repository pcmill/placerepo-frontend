import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminListByAdmin(props) {
    const apiKey = localStorage.getItem('apiKey');
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/admin/list/${props.adminId}`, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            const a = await data.json();
            setAdmins(a);
        }

        fetchAdmins();
    }, [apiKey, props.adminId]);

    if (admins && admins.length) {
        return (
            <>
                <h2 className="mt-4 text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                    Admins
                </h2>

                <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {admins.map((a) => (
                            <li key={a.id}>
                                <Link to={"/admin/" + a.id} className="block hover:bg-gray-50" preventScrollReset={true}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center">
                                            <p className="truncate text-sm font-medium text-indigo-600">{a.name}</p>

                                            <div className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5">
                                                <span className="text-xs text-gray-500">Translations</span>
                                                <span className="ml-2 text-sm text-gray-800">{a.translations}</span> 
                                            </div>
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
        return (
            <>
                <h2 className="mt-4 text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                    Admins
                </h2>

                <p className="mt-2 text-gray-700">No more admins founds.</p>
            </>
        );
    }
}

export default AdminListByAdmin;