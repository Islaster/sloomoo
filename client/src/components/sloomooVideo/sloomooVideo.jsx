import { useState } from "react";
import "./sloomooVideo.css"
import Card from 'react-bootstrap/Card';


export default function SloomooVideo({setChangeScreen}){
    const [int, setInt] = useState(0);
    const [buttonChange, setButtonChange] = useState(true);
    const videoInfo = [{videoSrc:'/videos/Sloomoovie_part1.mp4', poem:"Sloomoo the slime loves spreading cheer\nWith squishy fun throughout the year!"}, {videoSrc:'/videos/Sloomoovie_part2.mp4', poem:`As Christmas bells ring through the night
            Sloomoo misses friends tonight
Warm inside their empty home,
Sweet Sloomoo sits, all alone.`}, {videoSrc:'/videos/Sloomoovie_part3.mp4', poem:`But when the doorbell chimes ring sweet and clear
    A beautiful snow globe did appear!
    And on a note, words dancing in light
    "Make a wish and shake with all your might!"`},  {videoSrc:'/videos/Sloomoovie_part4.mp4', poem:`What's the wish that made Sloomoo's heart soar?
        That's what your imagination's for!`}];
    if(int === videoInfo.length){
        setButtonChange(false);
    }
    const buttonRender = buttonChange ? 
    <button onClick={()=>setInt(int+1)}>NEXT</button>:
    <button  onClick={()=>setChangeScreen(3)}>Next</button>
    return( 
        <> 
        <section className="vh-100 vw-100">
            <div className="header-container">
                <div style={{ width: '100vw', height: '8vh' }}>
                    <img src="/Drips_Master-01.png" alt="lildrip"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    objectFit: 'cover'
                                }} />
                </div>
                <div className="sloomoo-holiday-wish-header">
                SLOOMOO'S 
                HOLIDAY 
                WISH
                </div>
            </div>
            <section className="d-flex flex-column align-items-center justify-content-center p-2 ">
                    <Card className="video-card d-flex flex-column align-items-center justify-content-center ">
                        <div className="video-wrapper">
                            <video 
                            src={videoInfo[int].videoSrc}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            controls 
                            autoPlay 
                            muted
                            loop
                            />
                        </div>
                        <Card.Body className="vc-body d-flex flex-column align-items-center justify-content-center">
                            <div className="poem">
                            {videoInfo[int].poem}
                            </div>
                            
                        </Card.Body>
                    </Card>
                    <div className= "d-flex flex-column align-items-center justify-content-center mt-4">
                            {buttonRender}
                </div>
         </section>
         <div>
                    <footer className="mt-2">
                        <a 
                            className="credit d-flex flex-column align-items-center justify-content-center" 
                            onClick={() => setChangeScreen('c')}
                            style={{ cursor: 'pointer' }}
                        > 
                            credits
                        </a>
                    </footer>
        </div>
        </section>

     </>
    )
}