export function GetTriangle({ pos }: {
    pos: 'left' | 'right'
}) {
    if (pos === 'left') return <div className='triangle triangle-left' />
    else return <div className='triangle triangle-right' />
}