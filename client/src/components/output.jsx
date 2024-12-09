import { useState, useEffect, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import io from 'socket.io-client';
import "./output.css";
import axios from "axios";
import { AppContext } from '../contexts/AppContext';

export default function Output({ setChangeScreen }) {
  const [uniqueId, setUniqueId] = useState(null); // Store the unique ID from the backend
  const [outputPoem, setOutputPoem] = useState(''); // Store the poem content
  const [outputImg, setOutputImg] = useState('test.png'); // Default image placeholder
  const [isLoading, setIsLoading] = useState(true);
  const {prompt} = useContext(AppContext)
  
  const socket = io('https://sloomoo.onrender.com');
  
  useEffect(() => {
    
    socket.on('newImage', async ({ id }) => {
      console.log('New image detected for ID:', id)
      try{
        console.log(localStorage.getItem('uniqueId'))
        const url = `https://sloomoo.onrender.com/comfyui/output/${localStorage.getItem('uniqueId')}`
        const response = await axios.get(url,{responseType: 'blob'})
        const imageUrl = URL.createObjectURL(response.data);
        setOutputImg(imageUrl);
        setOutputPoem(`Sloomoo closed their eyes and wished for ${prompt}`)
      }catch (error) {
        console.error('Error fetching image:', error);
        setOutputImg('/error-placeholder.png'); // Fallback in case of error
      } finally {
        setIsLoading(false);
      }
    })
    return () => {
      socket.off('newImage');
    };
  }, []);
  

  return (
    <>
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
          <Card className="output-card d-flex flex-column align-items-center justify-content-center ">
            <div className="image-wrapper">
              {isLoading?
              <video
              src='/videos/loadingVideo.mp4'
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                objectFit: "cover",
              }}
              />
              :<img
              src={outputImg}
              alt="sloomoovie"
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                objectFit: "cover",
              }}
              />
            }
            </div>
            <Card.Body className="oc-body d-flex flex-column align-items-center justify-content-center">
              <div className="poem">
                {outputPoem}
              </div>
            </Card.Body>
          </Card>
          <div className="d-flex flex-column align-items-center justify-content-center mt-4">
            <button onClick={() => setChangeScreen(3)}>MAKE A NEW WISH</button>
          </div>
        </section>
        <div>
          <footer className="mt-2">
            <a
              className="credit d-flex flex-column align-items-center justify-content-center"
              onClick={() => setChangeScreen("c")}
              style={{ cursor: "pointer" }}
            >
              credits
            </a>
          </footer>
        </div>
      </section>
    </>
  );
}
