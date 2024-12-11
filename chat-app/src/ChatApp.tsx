import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import "./App.css"

// Connect to Socket.IO server
const socket = io('http://localhost:8080', { path: '/socket.io' });

const ChatApp = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [sender, setSender] = useState<string>('driver'); // Default sender

  useEffect(() => {
    // Listen for replies from server
    socket.on('reply', (msg: { sender: string; content: string }) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('reply');
    };
  }, []);

  const sendMessage = () => {
    const msg = { sender, content: message };
    socket.emit('message', msg);
    setMessages((prevMessages) => [...prevMessages, msg]); // Echo the message locally
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === sender ? 'right' : 'left'}`}
          >
            <strong>{msg.sender === sender ? 'You' : msg.sender}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={() => setSender(sender === 'driver' ? 'passenger' : 'driver')}>
        Switch to {sender === 'driver' ? 'Passenger' : 'Driver'}
      </button>
    </div>
  );
};

export default ChatApp;
