import { Link } from 'react-router-dom'

export function UserPage() {
    return (
        <div className="container">
            <Link to='/logout' className='btn btn-warning'>Log Out</Link>
        </div>
    )
}