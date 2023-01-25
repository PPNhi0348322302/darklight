import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {StoreProvider} from './store'
import {GoogleOAuthProvider} from '@react-oauth/google'
const root = ReactDOM.createRoot(document.getElementById('root'))
const CLIENT_ID = process.env.REACT_APP_GOOGLE_ID 

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId= {CLIENT_ID}>
      <StoreProvider>
          <App />
      </StoreProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

