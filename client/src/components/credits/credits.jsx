import './credits.css'

export default function Credits({setChangeScreen}){
    return(
        <>
        <section className="vh-100 vw-100">
            <div style={{ width: '100vw', height: '20vh' }}>
                <img src="/Drips_Master-03.png" alt="bigdrip"
                            style={{
                                width: '120%',
                                height: '100%',
                                position: 'relative'
                            }} />
            </div>
            <section className=" align-items-center justify-content-center pb-5">

                <div className='sloomoovies'>
                    SLOOMOOVIES IS...
                </div>
                <div className='credit-line'>
                    Producer/UX Designer<br />
                    Maddie Hong | <a 
                    href="https://www.instagram.com/hmdehong/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    @hmdehong
                </a>
                </div>
                <div className='credit-line'>
                    Full Stack Developer<br />
                    Isaac Laster |<a 
                    href="https://www.instagram.com/isaac_da_dev/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    @isaac_da_dev
                </a> 
                </div>
                <div className='credit-line'>
                    GenAI Videos <br />
                    Verena Puhm | <a 
                    href="https://www.instagram.com/verenapuhm/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    @verenapuhm
                </a> 
                </div>
                <div className='credit-line'>
                    Poem & QA<br />
                    Jagger Waters | <a 
                    href="https://www.instagram.com/glamorousreptile/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    @glamorousreptile
                </a> 
                </div>
                <div className='credit-line'>
                    LoRa Training<br />
                    Backlot AI | <a 
                    href="https://www.instagram.com/rakelle_backlotai/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    @rakelle_backlotai
                </a> 
                <a 
                    href="https://www.instagram.com/kenbot/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    @kenbot
                </a> 
                </div>
                <div className='credit-line'>
                    Storytellers <br />
                    You!!!
                </div>
                <div className='credit-line'>
                    SPECIAL THANKS TO<br />
                    Sloomoo Institute<br />
                    Machine Cinema<br />
                    Pickaxe
                </div>

                <footer className="mt-2">
                        <a 
                            className="credit d-flex flex-column align-items-center justify-content-center" 
                            onClick={() => setChangeScreen(1)}
                        > 
                            home
                        </a>
                </footer>
            </section>
        </section>
        </>
    
    )
}