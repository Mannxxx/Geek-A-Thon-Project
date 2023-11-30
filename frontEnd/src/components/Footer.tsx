import { Link } from 'react-router-dom'

export function Footer() {
    return (
        <section id="contact" className="footer_wrapper mt-3 mt-md-0">
            <div className="container">
                <div className="row align-items-center">
                    <div className="d-flex col-lg-4 col-md-12 justify-content-center">
                        <div className="footer-logo">
                            <Link to="/"><img decoding="async" src="/logo.png" alt='brand' /></Link>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 justify-content-center mt-2 mb-2 mt-lg-0 mb-lg-0">
                        <div className="copyright-text text-center">
                            <p className="mb-0">Copyright © 2023 <Link to="/">Olympus</Link>. All Rights Reserved.</p>
                        </div>
                    </div>
                    <div className="d-flex col-lg-4 col-md-12 justify-content-center">
                        <ul
                            className="list-unstyled d-flex justify-content-center justify-content-md-end justify-content-lg-center jus social-icon mb-3 mb-md-0">
                            <li>
                                <Link to="https://github.com/Cosmicoppai/Olympus"><i className="fab fa-github"></i></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}