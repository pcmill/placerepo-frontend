import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";

function Logout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout();
    
        navigate('/');
    }, [logout, navigate]);

    return null;
}

export default Logout;