import { getGitHubUrl } from "../util/auth";

function LoggedOut() {
    return (
        <div
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center"
        >
            <h2>You need to be logged for this</h2>

            <img alt="GitHub logo" src="/github.svg" width="32" height="32" className="mx-auto mt-4" />

            <a href={getGitHubUrl()} className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Sign in with GitHub</a>
        </div>
    )
}

export default LoggedOut;