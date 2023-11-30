export function Banner() {
    return (
        <section id="home" className="banner_wrapper">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7 text-center text-lg-start order-lg-1 order-2">
                        <h3 className='text-secondary'>Empowering the Extraordinary</h3>
                        <h1><span>Welcome to Olympus, Where Legends Are Born.</span></h1>
                    </div>
                    <div className="col-lg-5 text-center order-lg-2 order-1">
                        <img decoding="async" src="/alien-monster.png" className="img-fluid" alt='banner' />
                    </div>
                </div>
                {/* <div className="row top-menu mt-5">
                    <div className="col-lg-3 col-sm-6  mb-4">
                        <div className="card">
                            <img decoding="async" src="./images/Menu/menu-1.jpg" alt="menu" />
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6  mb-4">
                        <div className="card">
                            <img decoding="async" src="./images/Menu/menu-2.jpg" alt="menu" />
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6  mb-4">
                        <div className="card">
                            <img decoding="async" src="./images/Menu/menu-3.jpg" alt="menu" />
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6  mb-4">
                        <div className="card">
                            <img decoding="async" src="./images/Menu/menu-4.jpg" alt="menu" />
                        </div>
                    </div>
                </div> */}
            </div>
        </section>
    )
}
