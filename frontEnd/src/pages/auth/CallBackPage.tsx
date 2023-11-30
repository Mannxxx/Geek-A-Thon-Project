import { useEffect } from 'react';
import { ErrorPendingComp } from 'src/components';
import { useLogin, useQuery, usePED } from 'src/hooks';

export function CallBackPage() {
    let query = useQuery();

    const { isPending, setIsPending, setError, error } = usePED();
    const { login } = useLogin();

    useEffect(() => {
        if (isPending) return;
        setIsPending(true);

        fetch(`${process.env.REACT_APP_API_URL}/token?code=${query.get("code")}&&state=${query.get("state")}`, {
            method: 'POST',
            credentials: "include"
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else throw Error('Something Went Wrong')
            })
            .then(data => {
                login(data)
                // console.log(data);
            }).finally(() => {
                setIsPending(false)
            }).catch(error => {
                setError(error.message)
                console.log(error);
            })
    }, [query])

    return (
        <ErrorPendingComp
            pendingText={'Getting You In ...'}
            isPending={isPending}
            error={error}
            placeholder={''}
        />
    )
}