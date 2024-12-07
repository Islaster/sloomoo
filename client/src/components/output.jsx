import { useState, useEffect } from 'react';
import io from 'socket.io-client';
//550e8400-e29b-41d4-a716-446655440000
// Establish the socket connection
const SOCKET_URL = 'https://7ac4-2603-8000-a9f0-6cb0-508a-27a4-7718-7141.ngrok-free.app';
const socket = io(SOCKET_URL);

export default function Output() {
  const [message, setMessage] = useState(null); // Store the latest message
  const [connected, setConnected] = useState(false); // Track socket connection status


  return (
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
  );
}
