import { useContext, useEffect, useState } from "react";
import "./form.css";
import { v4 as uuidv4 } from "uuid";
import "./form.css";
import axios from "axios";
import { AppContext } from "../../contexts/AppContext";
import {Filter} from 'bad-words'


export default function SloomooForm({ setChangeScreen }) {
  const {prompt, setPrompt, poem, setPoem} = useContext(AppContext);
  const filter = new Filter();
  const [error, setError] = useState("");
  const baseURL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

  useEffect(() => {
    const uniqueId = localStorage.getItem('uniqueId');
    if (!uniqueId) {
      localStorage.setItem('uniqueId', uuidv4());
    }else{
      console.log('uniqueId found: ', uniqueId)
    }    
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault()
    const uniqueId = localStorage.getItem('uniqueId');
    if (filter.isProfane(prompt)) {
      setError("Sloomoo's wish only works when we spread love and joy! Would you like to make another special wish?");
      setPrompt("");
      return;
    }

    const data = {
      'prompt': prompt,
      "id": uniqueId
    }
 
    axios.post(baseURL, data).then((res)=>{
      if(res){ 
        setPoem(res.data.poem);
        axios.get(`${baseURL}/comfyui`)
      }
    });

    e.preventDefault();
    // Handle form submission here
    setChangeScreen(4); // Or whatever screen number you want to go to next
  };

  const handleChange =(e)=> {
    setPrompt(e.target.value);
    setError("");
  }
  return (
    <section className="vh-100 vw-100">
      <div className="header-container">
        <div style={{ width: "100vw", height: "8vh" }}>
          <img
            src="/Drips_Master-01.png"
            alt="lildrip"
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="sloomoo-holiday-wish-header">
          SLOOMOO'S HOLIDAY WISH
        </div>
      </div>
      
      <section className="d-flex flex-column align-items-center justify-content-center p-2">
        <div className="form-card">
          <form onSubmit={handleSubmit} className="wish-form">
            <label htmlFor="wish" className="wish-label">
              WHAT IS SLOOMOO'S WISH?
            </label>
            <textarea
              id="wish"
              maxLength={100}
              placeholder="Ex. a party with friends"
              className="wish-input"
              name="prompt"
              onChange={handleChange}
              required
            />
            {error && <p className="error-message">{error}</p>} 
            <button type="submit" className="submit-button">
              SHAKE!!!
            </button>
          </form>
        </div>
      </section>
  {/*
      <footer className="mt-2">
      <a 
          className="credit d-flex flex-column align-items-center justify-content-center"
          onClick={() => setChangeScreen("c")}
          style={{ cursor: "pointer" }}
        >
          credits
        </a>
      </footer>
          */}
    </section>
  );
}