import { useState } from "react";

export default function SloomooVideo({setChangeScreen}){
    const [int, setInt] = useState(0);
    const [buttonChange, setButtonChange] = useState(true);
    const videoInfo = [{videoSrc:"./", poem:""},];
    if(int === videoInfo.length){
        setButtonChange(false);
    }
    const buttonRender = buttonChange ? 
    <button onClick={()=>setInt(int+1)}>Next</button>:
    <button onClick={()=>setChangeScreen(3)}>Next</button>
    return(
        <>
        <section>
            <div>
                SLOOMOO'S<br />
                HOLIDAY<br />
                WISH<br />
            </div>
        </section>
        <section>
            <div>
                <video src={videoInfo[int].videoSrc} />
                <div>
                    {videoInfo[int].poem}
                </div>
                {buttonRender}
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