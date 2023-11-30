import {
    createContext, useReducer, useEffect, useState, useContext, ReactNode
} from 'react';

type ACTIONTYPE =
    { type: "SET_AUTH"; payload: object | null | undefined }
    | { type: "LOGIN"; payload: object | null | undefined }
    | { type: "LOGOUT" }
    | { type: "SET_IS_LOGGED_IN"; payload: boolean }

const initialState = {
    user: null,
    dispatch: () => null,
    isLoading: true,
    isLoggedIn: false,
}

export const AuthContext = createContext<{
    user: null | undefined | {
        crediantials: {
            access_token: string,
            expires_in: number,
            id_token: string,
            refresh_token: string,
            scope: string,
            token_type: string,
        }
    },
    isLoggedIn: boolean,
    dispatch: React.Dispatch<ACTIONTYPE>;
    isLoading: boolean
}>(initialState)


export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) throw Error('useAuthContext must be used inside an AuthContextProvider')
    return context
}

export function authReducer(state: typeof initialState, action: ACTIONTYPE) {

    let newState = state;

    switch (action.type) {
        case 'LOGIN':
            newState = { ...state, user: action.payload as any }
            break;
        case 'LOGOUT':
            return { ...initialState }
        case 'SET_IS_LOGGED_IN':
            newState = { ...state, isLoggedIn: action.payload }
            break;
    }

    localStorage.setItem('userData', JSON.stringify(newState.user))
    return newState
}

export function AuthContextProvider({ children }: {
    children: ReactNode
}) {

    const [isLoading, setIsLoading] = useState(true);

    // @ts-ignore
    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect(() => {
        try {
            const userCredData = localStorage.getItem('userCrediantials');
            const userData = localStorage.getItem('userData');

            if (userCredData) {
                // @ts-ignore
                dispatch({ type: 'SET_IS_LOGGED_IN', payload: true })
                if (userData) dispatch({ type: 'LOGIN', payload: JSON.parse(userData) })
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            localStorage.removeItem('userCrediantials');

            // @ts-ignore
            dispatch({ type: 'LOGOUT' } as any);
        }
    }, [])

    console.log('AuthContext state:', { ...state, isLoading })

    return (
        <AuthContext.Provider value={{ ...state, dispatch, isLoading }} >
            {children}
        </AuthContext.Provider>
    )
}