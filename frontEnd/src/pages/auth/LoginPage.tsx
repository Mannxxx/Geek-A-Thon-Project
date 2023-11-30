import { useEffect } from 'react'
import { ErrorPendingComp } from 'src/components';
import { usePED } from 'src/hooks';

export function LoginPage() {

    const { isPending, setIsPending, error, setError } = usePED();

    async function handleLogin() {
        setIsPending(true);
        try {
            await fetch(process.env.REACT_APP_API_URL, {
                credentials: "include",
            })

            await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                credentials: "include",
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    window.location.assign(data.authorize_url);
                })
        } catch (error: any) {
            console.log(error);
            setError(error.message)
        }
        finally {
            setIsPending(false)
        }
    }

    useEffect(() => {
        handleLogin();
    }, [])

    return <ErrorPendingComp
        pendingText={'Redirecting to Auth0'}
        isPending={isPending}
        error={error}
        placeholder={'Getting Ready ...'}
        placeholderIconName='fa-solid fa-person-skating'
    />
}
