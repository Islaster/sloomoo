import React, { useState, useRef } from "react";
import axios from "axios";

const CameraComponent = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
      alert("Could not access the camera. Please allow camera permissions.");
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL("image/jpeg"); // Returns the image as a base64 string
    }
    return null;
  };

  const sendImageToBackend = async () => {
    const imageData = captureImage();
    if (!imageData) {
      alert("Failed to capture image!");
      return;
    }

    setIsSending(true);
    try {
      const response = await axios.post("http://localhost:3001/brian", {
        image: imageData,
      });
      alert("Image sent successfully!");
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error sending image to backend:", error);
      alert("Failed to send image.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <button onClick={openCamera}>Open Camera</button>
      {isCameraOpen && (
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "500px" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <button onClick={sendImageToBackend} disabled={isSending}>
            {isSending ? "Sending..." : "Capture & Send Image"}
          </button>
          <button onClick={closeCamera}>Close Camera</button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
