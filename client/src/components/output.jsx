import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import io from 'socket.io-client';
import "./output.css";
//550e8400-e29b-41d4-a716-446655440000
// Establish the socket connection
const SOCKET_URL = 'https://7ac4-2603-8000-a9f0-6cb0-508a-27a4-7718-7141.ngrok-free.app';
const socket = io(SOCKET_URL);

export default function Output({setChangeScreen}) {
  const [message, setMessage] = useState(null); // Store the latest message
  const [connected, setConnected] = useState(false); // Track socket connection status
  const outputImg = 'test.png';
  const outputPoem = 'Sloomoo closed their eyes and wished upon a star,\nFor a motorcycle to zoom both near and far.\nThough made of slime, they\'d be the coolest biker by far!';


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
                            <img src={"test.png"}
                            alt="sloomoovie"
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "relative",
                              objectFit: "cover",
                            }}
                            />
                        </div>
                        <Card.Body className="oc-body d-flex flex-column align-items-center justify-content-center">
                            <div className="poem">
                            {outputPoem}
                            
                            </div>
                            
                        </Card.Body>
                    </Card>
               <div className= "d-flex flex-column align-items-center justify-content-center mt-4">
                  <button  onClick={()=>setChangeScreen(3)}>MAKE A NEW WISH</button>
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

  {/* 
   <div>
                <h1>OUTPUT</h1>
                {connected ? (
                  <p>Connected to backend</p>
                ) : (
                  <p>Connecting to backend...</p>
                )}
                {message ? (
                  <div>
                    <p><strong>User:</strong> {message.user}</p>
                    <p><strong>Message:</strong> {message.text}</p>
                    <p><strong>Timestamp:</strong> {new Date(message.timestamp * 1000).toLocaleString()}</p>
                  </div>
                ) : (
                  <p>No messages yet...</p>
                )}
              </div> 
   */}
    </>

  );
}
