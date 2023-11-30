import { useEffect, useState } from "react";

export function LoadingComp({
    title
}: {
    title?: string
}) {

    const ringcodes = ['#0081C8', '#FCB131', '#000', '#00A651', '#EE334E']

    const [currentColorIndex, setCurrentColorIndex] = useState(0)

    useEffect(() => {
        // console.log("msg", msg);
        const ci = setTimeout(() => {
            setCurrentColorIndex((currentColorIndex + 1) % ringcodes.length);
        }, 600);
        return () => clearTimeout(ci);
    }, [currentColorIndex, ringcodes.length]);

    return (
        <div className='container'
            style={{
                flexGrow: 1,
                minHeight: 300,
                display: 'flex',
                rowGap: 20,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div className="spinner-border" role="status" style={{
                color: ringcodes[currentColorIndex]
            }}>
                <span className="sr-only">Loading...</span>
            </div>
            {title ? <strong>{title}</strong> : null}
        </div>
    )
}
