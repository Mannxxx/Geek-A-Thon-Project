import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useQuery } from 'src/hooks';

export function NotFoundPage() {

    const navigate = useNavigate();
    const [time, setTime] = useState(9);

    const query = useQuery();
    const msg = query.get('msg');

    useEffect(() => {
        // console.log("msg", msg);

        setTimeout(() => {
            if (time > 0) setTime(time - 1);

            if (time === 1) navigate('/')
        }, 1000);

    }, [navigate, time, msg]);

    return (
        <div
            id="not-found"
            className='container d-flex justify-content-center'
            style={{
                alignItems: 'center',
                minHeight: 300
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <img src='/404.svg' alt='not-found-404' />
                <h2>{msg ? msg : "Sorry, this page can't be found"}</h2><br />
                <strong>Auto re-directing to <Link to='/'>Home</Link> page in {time} sec</strong>
            </div>
        </div>
    );
}