import { Combobox } from "@headlessui/react";
import { CheckIcon, LanguageIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { NotificationContext } from "../../contexts/notification-context";

function TranslationNew(props) {
    const placeholder = props.placeholder;
    const entityId = props.entityId;
    const { accessToken } = useContext(AuthContext);
    const { addNotification } = useContext(NotificationContext);
    const [languages, setLanguages] = useState([]);
    const [name, setName] = useState('');
    const [query, setQuery] = useState('');
    const defaultLanguage = {
        id: 39,
        language_code: "en",
        description: "English"
    }

    const lastUsedLanguage = JSON.parse(localStorage.getItem('lastUsedLanguage'));
    const [selectedLanguage, setSelectedLanguage] = useState(lastUsedLanguage || defaultLanguage);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    function adjustLanguage(value) {
        setSelectedLanguage(value);
        localStorage.setItem('lastUsedLanguage', JSON.stringify(value));
    }

    const filteredLanguages =
      query === ''
        ? languages
        : languages.filter((language) => {
            return language.description.toLowerCase().includes(query.toLowerCase())
          });

    useEffect(() => {
        const fetchLanguages = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/language`);

            const l = await data.json();
            setLanguages(l);
        }

        fetchLanguages();
    }, []);

    async function saveTranslation(event) {
        event.preventDefault();

        const body = {
            changeRequest: {
                type: props.requestType,
                requestObject: {
                    ...entityId,
                    language_code: selectedLanguage.language_code,
                    name
                }
            }
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND}/v1/queue`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                'x-access-token': accessToken
            }
        });

        if (response.ok) {
            addNotification('success', 'Your new translation has been added to the queue. It will be processed as soon as possible.', 10000);
        } else {
            addNotification('error', 'There was a problem saving your translation. Please try again later.', 5000);
        }

        setName('');
    }

    return (
        <form onSubmit={(e) => saveTranslation(e)} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
                <label htmlFor="name" className="sr-only">
                    Name
                </label>

                <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder={placeholder}
                />
            </div>

            <div className="mt-2 flex justify-between">
                <div className="flex flex-col md:flex-row w-full items-center text-sm text-gray-800">
                    <div className="flex items-center w-full md:w-auto">
                        <LanguageIcon className="mr-2 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />

                        <Combobox value={selectedLanguage} onChange={adjustLanguage}>
                            <div className="relative w-full md:w-56">
                                <Combobox.Input
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                    displayValue={(language) => language && language.description}
                                    onChange={(event) => setQuery(event.target.value)} />

                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredLanguages.map((language) => (
                                        <Combobox.Option
                                            className={({ active }) =>
                                                classNames(
                                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                            )}
                                            key={language.id}
                                            value={language}>
                                            
                                            {({ active, selected }) => (
                                                <>
                                                    <span className={classNames('block truncate', selected && 'font-semibold')}>{language.description}</span>

                                                    {selected && (
                                                        <span
                                                            className={classNames(
                                                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                active ? 'text-white' : 'text-indigo-600'
                                                            )}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                            </div>
                        </Combobox>
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto mt-2 md:mt-0 ml-auto inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Save translation
                    </button>
                </div>
            </div>
        </form>
    )
}

export default TranslationNew;