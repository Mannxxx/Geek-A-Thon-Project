import { useEffect } from "react"
import { Link } from "react-router-dom";
import { useAuthContext } from "src/context";

export function Navbar() {

    const { isLoggedIn } = useAuthContext();

    useEffect(() => {
        // Header Scroll
        let nav = document.querySelector(".navbar");
        window.onscroll = function () {

            if (document.documentElement.scrollTop > 20) {
                nav?.classList.add("header-scrolled");
            } else {
                nav?.classList.remove("header-scrolled");
            }
        }

        // nav hide 
        let navBar = document.querySelectorAll(".nav-link");
        let navCollapse = document.querySelector(".navbar-collapse.collapse");
        navBar.forEach(function (a) {
            a.addEventListener("click", function () {
                navCollapse?.classList.remove("show");
            })
        })
    }, [])


    return (
        <header className="header_wrapper">
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img decoding="async" src="/logo.png" className="img-fluid" alt="logo" style={{
                            width: 40,
                            height: 40
                        }} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-stream navbar-toggler-icon"></i>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav menu-navbar-nav">
                            <li className="nav-item d-none">
                                <Link className="nav-link active" aria-current="page" to="#home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/stats-analysis">Stats & Analysis</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/events">Events</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/sports">Sports</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about">About</Link>
                            </li>

                            {isLoggedIn ?
                                <li className="nav-item">
                                    <Link className="nav-link" to='/user'>
                                        <i className="fas fa-user" style={{ fontSize: 20 }}></i>
                                    </Link>
                                </li> :
                                <li className="nav-item mt-3 mt-lg-0">
                                    <Link className="main-btn" to="/login">Login / Sign Up</Link>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}