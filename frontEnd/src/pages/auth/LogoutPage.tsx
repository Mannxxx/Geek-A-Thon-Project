import { useEffect } from "react";
import { ErrorPendingComp } from "src/components";
import { useFetch, useLogout } from "src/hooks";

export function LogoutPage() {

    const { logout } = useLogout();

    const { isPending, error, data, fetchData } = useFetch();

    useEffect(() => {
        fetchData({
            path: `/logout`,
            method: 'POST',
        })
    }, [])

    useEffect(() => {
        if (data?.status === 'success') logout();
    }, [data]);

    return (
        <ErrorPendingComp
            pendingText={"Logging Out"}
            isPending={isPending}
            error={error}
            placeholder={""}
        />
    );
}