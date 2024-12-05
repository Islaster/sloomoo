import OpeningScreen from "./openingScreen"
import SloomooVideo from "./sloomooVideo"
import Credits from "./credits"
import { useState } from "react"

export default function TextPrompt(){
  const [changeScreen, setChangeScreen] = useState(1);
  const renderOpeningScreen = changeScreen === 1 ? <OpeningScreen  setChangeScreen={setChangeScreen}/> : "";
  const renderCredits = changeScreen === 'c' ? <Credits /> : "";
  const renderSloomooVideo = changeScreen === 2 ? <SloomooVideo setChangeScreen={setChangeScreen}/>: "";
  console.log(changeScreen)
  return(
    <>
    {renderOpeningScreen}
    {renderCredits}
    {renderSloomooVideo}
    {/* form */}
    {/* loading screen */}
    {/* result page */}
    </>
  )
}