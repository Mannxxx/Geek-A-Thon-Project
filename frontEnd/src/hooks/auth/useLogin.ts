import { useAuthContext } from 'src/context/AuthContext';
import { usePED } from '../usePED';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {

    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const { isPending, setIsPending } = usePED();

    async function login(user: any) {

        if (isPending) return;

        setIsPending(true)

        localStorage.setItem('userCrediantials', JSON.stringify(user))
        // localStorage.setItem('user', JSON.stringify(user))
        dispatch({ type: 'SET_IS_LOGGED_IN', payload: true })
        // update the auth context
        navigate('/');

        // update loading state
        setIsPending(false)
    }
    return { login, isPending }
}
