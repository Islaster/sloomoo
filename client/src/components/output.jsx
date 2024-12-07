import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://7ac4-2603-8000-a9f0-6cb0-508a-27a4-7718-7141.ngrok-free.app')

export default function Output(){
    const [message, setMessage] = useState({})
    useEffect(() => {
        // Listen for new messages
        socket.on('newMessage', (message) => {
          console.log('Received new message:', message);
          // Transform and update the message
            
        });
    
        return () => socket.off('newMessage'); // Cleanup listener
      }, []);
    
    return(
        <>
        <h1>OUTPUT</h1>
        </>
    )
}