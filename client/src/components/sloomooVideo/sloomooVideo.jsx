import { useState } from "react";
import "./sloomooVideo.css"
import Card from 'react-bootstrap/Card';


export default function SloomooVideo({setChangeScreen}){
    const [int, setInt] = useState(0);
    const [buttonChange, setButtonChange] = useState(true);
    const videoInfo = [{videoSrc:"./", poem:""},];
    if(int === videoInfo.length){
        setButtonChange(false);
    }
    const buttonRender = buttonChange ? 
    <button onClick={()=>setInt(int+1)}>Next</button>:
    <button  onClick={()=>setChangeScreen(3)}>Next</button>
    return(
        <>
        <header>
            <div className='sloomoo-holiday-wish-header d-flex align-items-center justify-content-center p-5'>
                    SLOOMOO'S<br />
                    HOLIDAY<br />
                    WISH<br />
                </div>
        </header>
        <section className="min-vh-100 d-flex align-items-center justify-content-center">
            <div>
                <Card>
                    <video src={videoInfo[int].videoSrc} />
                    <div>
                        {videoInfo[int].poem}
                    </div>
                    {buttonRender}
                </Card>
            </div>
        </section>
        <section>
            <a onClick={()=>setChangeScreen('c')}> 
                credits
            </a>
        </section>
        </>
    )
}