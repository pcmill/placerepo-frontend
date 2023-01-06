import { useState } from "react";

function TranslationEdit(props) {
    const translation = props.translation;
    const placeholder = props.placeholder;
    const apiKey = localStorage.getItem('apiKey');
    const [name, setName] = useState(translation.name);

    async function saveTranslation(event) {
        event.preventDefault();

        const body = {
            translation_id: translation.id,
            name
        }

        await fetch(`${process.env.REACT_APP_BACKEND}/v1${props.endpoint}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                'x-api-key': apiKey
            }
        });

        // Send the result back up to be rendered by the details page.
        props.setEntity({
            name
        });
    }

    function cancelEdit(event) {
        event.preventDefault();

        props.setEntity({
            name: translation.name
        });
    }

    return (
        <form onSubmit={(e) => saveTranslation(e)} className="py-2">
            <p className="mb-2 truncate text-sm font-medium text-grey-400">Edit translation</p>

            <div className="flex">
                <div className="flex flex-grow items-center">
                    <label htmlFor="name" className="sr-only">
                        Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block flex w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={placeholder}
                    />
                </div>

                <span
                    onClick={(event) => cancelEdit(event)}
                    className="relative cursor-pointer ml-2 rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2"
                >
                    Cancel
                </span>

                <button
                    type="submit"
                    className="relative ml-2 rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                    Save changes
                </button>
            </div>
        </form>
    )
}

export default TranslationEdit;