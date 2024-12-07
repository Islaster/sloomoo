import OpeningScreen from "./openingScreen/openingScreen"
import SloomooVideo from "./sloomooVideo/sloomooVideo"
import Credits from "./credits/credits"
import SloomooForm from "./form/form"
import { useState, useEffect } from "react"
import Output from "./output"

export default function TextPrompt(){

  const [changeScreen, setChangeScreen] = useState(1);
  const renderOpeningScreen = changeScreen === 1 ? <OpeningScreen  setChangeScreen={setChangeScreen}/> : "";
  const renderCredits = changeScreen === 'c' ? <Credits setChangeScreen={setChangeScreen} /> : "";
  const renderSloomooVideo = changeScreen === 2 ? <SloomooVideo setChangeScreen={setChangeScreen}/>: "";
  const renderForm = changeScreen === 3 ? <SloomooForm setChangeScreen={setChangeScreen}/> : "";
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