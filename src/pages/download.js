import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import PageLayout from "../components/page-layout";

function Download() {
    return (
        <PageLayout>
            <div className="relative bg-white px-6 pt-12 pb-16 sm:pt-16 lg:mx-auto lg:grid lg:max-w-7xl lg:px-8">
                <div className="lg:pl-8">
                    <div className="text-base">
                        <h2 className="font-semibold leading-6 text-indigo-600">The Placerepo datasets</h2>
                        <h3 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">Choose a dataset to download</h3>

                        <p className="mt-4 text-lg text-gray-500">
                            The Placerepo dataset comes in two flavours: the SQL dump you can import into Postgres or the CSV files you can import into any database or spreadsheet software.
                        </p>

                        <div className="rounded-md bg-yellow-50 p-4 mt-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                </div>

                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">This is a work in progress</h3>
                                    
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Placerepo really is not ready to be used yet in a production capacity. We are still working on the data itself. The downloads on this page are limited and don't cover the world.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-indigo mt-5 text-gray-500">
                            <h3>The SQL dump</h3>

                            <div className="my-8">
                                <a href="https://pub-137e15e854754bb99dbe4c683e63670a.r2.dev/placerepo-20230120.zip" className="bg-blue-900 text-white p-4 text-sm font-medium rounded-md no-underline">
                                    <span className="text-sm">Download SQL dump</span>
                                    <span className="text-xs ml-2">2023-01-20 (20.4mb)</span>
                                </a>
                            </div>

                            <p>
                                The SQL dump can be used to kickstart your own geodata project. It follows the datamodel that you can find here: <a href="https://github.com/pcmill/placerepo/blob/main/database.sql">datamodel</a>
                            </p>
                            <p>
                                It currently covers the following entities:
                            </p>
                            <ul>
                                <li>Continents</li>
                                <li>Countries</li>
                                <li>Administrative divisions</li>
                                <li>Populated places</li>
                            </ul>

                            <p>I have plans to add the following extra entities in the future:</p>
                            <ul>
                                <li>Neighbourhoods</li>
                                <li>Postal codes</li>
                            </ul>

                            <p>
                                These entities all have their respective translations.
                            </p>
                            <p>
                                Rhoncus nisl, libero egestas diam fermentum dui. At quis tincidunt vel ultricies. Vulputate aliquet
                                velit faucibus semper. Pellentesque in venenatis vestibulum consectetur nibh id. In id ut tempus
                                egestas. Enim sit aliquam nec, a. Morbi enim fermentum lacus in. Viverra.
                            </p>
                            <h3>The CSV files</h3>
                            <p>
                                The CSV files are an easy way to get started with Placerepo. They where made with the intention of
                                being imported into a searchengine tool like Meilisearch or Typesense.
                            </p>
                            <p>
                                These files have a slightly different datamodel than the SQL dump. The continent, country and administrative areas are the meta data for the populated places.
                            </p>

                            <ul>
                                <li>Populated places - seperated out by translation</li>
                            </ul>

                            <p>
                                Incomplete example of a populated place:
                            </p>

                            <pre>
                                <code className="flex flex-col">
                                    <span>id,entity-id,language,name,country-name,admin-1,admin-2</span>
                                    <span>ndjffmh6pyj2,3kwgqb96,nl,Amsterdam,Nederland,Gemeente Amsterdam,Noord-Holland</span>
                                    <span>7q0fh2gyz8hc,3kwgqb96,en,Amsterdam,Netherlands,Gemeente Amsterdam,North Holland</span>
                                </code>
                            </pre>

                            <p>
                                As you can see the <code>entity-id</code> can exist multiple times. This can be inserted directly into Meilisearch with users being able to search in their own language. 
                                As long as you set the <a href="https://docs.meilisearch.com/learn/configuration/distinct.html">distinctive attribute</a> to the <code>entity-id</code> it will always return only one result per populated place.
                            </p>

                            <p>
                                Typesense has a similar feature called <a href="https://typesense.org/docs/0.22.2/api/documents.html#group-results">group results</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

export default Download;