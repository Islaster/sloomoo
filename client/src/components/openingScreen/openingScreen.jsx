import './openingScreen.css'

export default function OpeningScreen({setChangeScreen}){
    return(
        <section className="min-vh-100 d-flex align-items-center justify-content-center">
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
    )
}