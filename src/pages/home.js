import { useContext } from "react";
import { Link } from "react-router-dom";
import HomeMap from "../components/map/home-map";
import { AuthContext } from "../contexts/auth-context";

function Home() {
    const { user } = useContext(AuthContext);
    return (
        <div className="-px-8 relative">
            <HomeMap />

            {user && <Link
                to="/place/new"
                className="absolute top-2.5 left-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                New place
            </Link>}
        </div>
    )
}

export default Home;