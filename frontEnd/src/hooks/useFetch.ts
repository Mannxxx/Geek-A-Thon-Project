import { useLogout } from "./auth/useLogout";
import { usePED } from "./usePED";

// Function to check if Content-Type is application/json
function isContentTypeJSON(headers: any) {
    const contentType = headers.get('content-type');
    return contentType && contentType.includes('application/json')
}

export function useFetch() {

    const { logout } = useLogout();

    const {
        data, setData,
        isPending, setIsPending,
        error, setError
    } = usePED();

    const fetchData = async ({ noheaders, path, method = 'GET', body, headers = {} }: {
        path: string,
        method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
        body?: BodyInit | null | undefined,
        headers?: any,
        noheaders?: boolean
    }) => {

        setIsPending(true);
        setData(null);
        setError(null);

        try {
            const userCredData = await localStorage.getItem('userCrediantials');

            if (!userCredData) {
                logout();
                return;
            }
            const userCred = await JSON.parse(userCredData)

            let headers;
            if (noheaders) headers = undefined
            else headers = {
                'Authorization': `Bearer ${userCred.access_token}`,
                "Content-Type": "application/json",
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}${path}`, {
                method,
                credentials: 'include',
                headers,
                body
            });

            if (!isContentTypeJSON(response.headers)) throw Error("Something Went Wrong")

            let json: any;
            if (response.status === 204) {
                json = { status: "Successfully completed your request" }
            }
            else json = await response.json();

            console.log(json);

            if (!response.ok) {
                if ([401, 403].includes(response.status)) logout();
                else throw Error(json.error || json.detail);
            }
            if (response.ok) {
                setData(json);
                setIsPending(false);
                setError(null);
                return json;
            }
        } catch (error: any) {
            console.log(error);
            setData(null);
            setError(error.message);
            setIsPending(false);
        }
    }
    return { fetchData, data, setData, isPending, error, setIsPending };
}