import { useNavigate } from 'react-router-dom'
import { useAuthContext } from 'src/context/AuthContext'

import { deleteAllCookies } from 'src/util';

export const useLogout = () => {
    const navigate = useNavigate()

    const { dispatch } = useAuthContext();

    async function logout() {

        deleteAllCookies();

        // remove local and session from storage
        localStorage.clear();

        sessionStorage.clear();
        // dispatch logout action
        dispatch({ type: 'LOGOUT' });

        navigate('/');
    }
    return { logout }
}