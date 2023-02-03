import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
    Bars3BottomLeftIcon
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { SidebarContext } from '../contexts/sidebar-context';
import { AuthContext } from '../contexts/auth-context';
import { getGitHubUrl } from '../util/auth';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import useComponentVisible from './click-outside';

const userNavigation = [
    { name: 'Sign out', to: '/logout' }
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Topbar() {
    const { changeSidebarState } = useContext(SidebarContext);
    const { user, accessToken } = useContext(AuthContext);
    const [searchResults, setSearchResults] = useState([]);
    const [searchFocus, setSearchFocus] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

    async function search(query) {
        const res = await fetch(`${process.env.REACT_APP_MEILI_ENDPOINT}/indexes/geo/search`, {
            method: 'POST',
            body: JSON.stringify({
                q: query,
                limit: 6
            }),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_MEILI_KEY}`
            }
        });
    
        if (res.ok) {
            const data = await res.json();
            setMenuOpen(true);
            setIsComponentVisible(true);
            setSearchResults(data.hits);
        } else {
            setSearchResults([]);
        }
    }

    // eslint-disable-next-line
    const debouncedSearch = useCallback(
        debounce(search, 200)
    , []);

    function clearSearch() {
        setQuery('');
        setSearchResults([]);
        setMenuOpen(false);
        setIsComponentVisible(false);
    }

    useEffect(() => {
        if (query.length > 1) {
            debouncedSearch(query);
        }
    }, [query, debouncedSearch]); 

    useEffect(() => {
        console.log('isComponentVisible', isComponentVisible);
        if (searchFocus) {
            setIsComponentVisible(true);
            setMenuOpen(true);
        } else {
            setMenuOpen(isComponentVisible && searchResults.length > 0);
        }
    }, [isComponentVisible, searchResults, searchFocus]);

    return (
        <>
            <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
                <button
                    type="button"
                    className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                    onClick={() => changeSidebarState(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="flex flex-1 justify-between px-4">
                    <div className="flex flex-1">
                        <form className="flex w-full md:ml-0" action="#" method="GET">
                            <label htmlFor="search-field" className="sr-only">
                                Search
                            </label>

                            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                                </div>

                                <input
                                    id="search-field"
                                    className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                                    placeholder="Search"
                                    type="search"
                                    name="search"
                                    value={query || ''}
                                    onBlur={() => setSearchFocus(false)}
                                    onFocus={() => setSearchFocus(true)}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="ml-4 flex items-center md:ml-6">
                        {!user && 
                            <a href={getGitHubUrl()} className="text-sm font-medium text-gray-500 hover:text-gray-900">Sign in with GitHub</a>
                        }

                        {user && accessToken && <Menu as="div" className="relative ml-3">
                            <div>
                                <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span className="sr-only">Open user menu</span>
                                    <span className="font-bold text-gray-700 truncate">{user.github_user_name}</span>

                                    <img
                                        className="ml-4 h-8 w-8 rounded-full"
                                        src={`${user.github_avatar}&size=64`}
                                        alt={user.github_user_name}
                                    />
                                </Menu.Button>
                            </div>
                            
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                        <Menu.Item key={item.name}>
                                            {({ active }) => (
                                                <Link
                                                    to={item.to}
                                                    className={classNames(
                                                        active ? 'bg-gray-100' : '',
                                                        'block px-4 py-2 text-sm text-gray-700'
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Transition>
                        </Menu>}
                    </div>
                </div>

                <div ref={ref}>
                    {menuOpen && <div className="absolute top-16 left-4 right-4 bg-white shadow-lg rounded-b-lg border-t">
                        <ul className="max-w-7xl mx-auto divide-y divide-gray-200">
                            {searchResults.map((result) => (
                                <li key={result.id} className="px-4 py-4 sm:px-6">
                                    <Link onClick={() => clearSearch()} to={`/place/${result['entity-id']}`} className="group relative">
                                        <div className="w-full overflow-hidden group-hover:opacity-75">
                                            <span className="underline">{result.name}</span>
                                            <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">{result['admin-1']}</span>
                                            <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">{result['country']}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>}
                </div>      
            </div>
        </>
    )
}

export default Topbar;