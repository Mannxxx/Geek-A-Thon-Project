import { useState } from 'react'

export function usePED(initialValue = null) {

    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(initialValue);

    return {
        isPending, setIsPending,
        error, setError,
        data, setData,
    }
}