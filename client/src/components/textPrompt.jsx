import OpeningScreen from "./openingScreen/openingScreen"
import SloomooVideo from "./sloomooVideo/sloomooVideo"
import Credits from "./credits/credits"
import SloomooForm from "./form"
import { useState } from "react"
import Output from "./output"

export default function TextPrompt(){

  const [changeScreen, setChangeScreen] = useState(2);
  const renderOpeningScreen = changeScreen === 1 ? <OpeningScreen  setChangeScreen={setChangeScreen}/> : "";
  const renderCredits = changeScreen === 'c' ? <Credits /> : "";
  const renderSloomooVideo = changeScreen === 2 ? <SloomooVideo setChangeScreen={setChangeScreen}/>: "";
  const renderForm = changeScreen === 3 ? <SloomooForm /> : "";
  const renderOutput = changeScreen === 4? <Output />: "";
  console.log(changeScreen);
  return(
    <>
    {renderOpeningScreen}
    {renderCredits}
    {renderSloomooVideo}
    {renderForm }
    {renderOutput}
    </>
  )
}