import './openingScreen.css'

export default function OpeningScreen({setChangeScreen}){
    return(
    <>
    <section className="vh-100 vw-100">
                <div style={{ width: '100vw', height: '30vh' }}>
                    <img src="/Drips_Master-03.png" alt="bigdrip"
                                style={{
                                    width: '120%',
                                    height: '100%',
                                    position: 'relative',
                                }} />
                </div>
            <section className="align-items-center justify-content-center">
                <div className="text-center">
                    <div className='sloomoovies-presents pb-5' >
                        SLOOMOOVIES<br />
                        PRESENTS
                    </div>
                    <div className="sloomoos-holiday-wish pb-5">
                        SLOOMOO'S<br />
                        HOLIDAY<br />
                        WISH
                    </div>
                    <button  onClick={()=>setChangeScreen(2)}>BEGIN!</button>
                </div>
            </section>
        </section>
    </>
    )
}