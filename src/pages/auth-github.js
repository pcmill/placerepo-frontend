import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";

function AuthGithub() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser, setAccessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserData = async (access_token) => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/auth/user?access_token=${access_token}`);

            const u = await data.json();

            localStorage.setItem('user', JSON.stringify(u));
            localStorage.setItem('accessToken', access_token);

            setUser(u);
            setAccessToken(accessToken);
        }
        
        const accessToken = searchParams.get('access_token');

        if (accessToken) {
            fetchUserData(accessToken);
            navigate('/');
        }
    }, [searchParams, setUser, navigate]);
}

export default AuthGithub;