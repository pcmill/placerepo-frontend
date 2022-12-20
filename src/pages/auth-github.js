import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";

function AuthGithub() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserData = async (access_token) => {
            const data = await fetch(`https://api.github.com/user`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            const c = await data.json();
            const user = {
                id: c.id,
                username: c.login,
                avatar: c.avatar_url,
                access_token: access_token
            }

            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
        }

        const accessToken = searchParams.get('access_token');

        if (accessToken) {
            fetchUserData(accessToken);
            navigate('/');
        }
    }, [searchParams, setUser, navigate]);
}

export default AuthGithub;