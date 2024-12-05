export default function OpeningScreen({setChangeScreen}){
    return(
        <section>
            <div>
                SLOOMOOVIES<br />
                PRESENTS
            </div>
            <div>
                SLOOMOO'S<br />
                HOLIDAY<br />
                WISH
            </div>
            <button onClick={()=>setChangeScreen(2)}>BEGIN!</button>
        </section>
    )
}