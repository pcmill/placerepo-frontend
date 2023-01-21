import PageLayout from "../components/page-layout";

function NotFound() {
    return (
        <PageLayout>
            <main className="flex w-full max-w-7xl flex-grow flex-col">
                <div className="flex-shrink-0">
                    <p className="text-base font-semibold text-indigo-600">404</p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                    <p className="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>

                    <div className="mt-6">
                        <a href="/" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                            Go back home
                            <span aria-hidden="true"> &rarr;</span>
                        </a>
                    </div>
                </div>
            </main>
        </PageLayout>
    )
}

export default NotFound;