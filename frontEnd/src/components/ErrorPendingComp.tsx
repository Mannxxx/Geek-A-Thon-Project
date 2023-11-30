import { LoadingComp } from './LoadingComp'

export function ErrorPendingComp({
    pendingText,
    isPending,
    error,
    placeholder,
    placeholderIconName = 'fa'
}: {
    pendingText: string,
    isPending: boolean,
    error: string | null,
    placeholder: string,
    placeholderIconName?: string
}) {

    if (isPending) return <LoadingComp title={pendingText} />

    if (error) return <div style={{
        flexGrow: 1,
        minHeight: 300,
        rowGap: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <i className="fa-regular fa-face-frown text-danger" style={{ fontSize: 60 }}></i>
        <strong className='text-danger' style={{ textAlign: 'center' }}>{error}</strong>
    </div>


    return (
        <div style={{
            flexGrow: 1,
            minHeight: 300,
            rowGap: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <i className={placeholderIconName} style={{ fontSize: 40 }}></i>
            <strong>{placeholder}</strong>
        </div>
    )
}
