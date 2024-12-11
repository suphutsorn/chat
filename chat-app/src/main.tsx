import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx'; // การ import App component ที่คุณสร้างขึ้น
import ChatApp from './ChatApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatApp />
  </StrictMode>
);
