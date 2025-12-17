// @ts-nocheck

import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.tsx'
    import './index.css'

    // --- Local Environment Mocking ---
    // The Idol Management Sim code relies on these global variables 
    // for Firebase setup and authorization. We must mock them locally.

    window.__app_id = 'local-sim-id';

    // NOTE: This is a DUMMY Firebase Config. 
    // You cannot connect to a real Firebase project using these values.
    // For a real connection, replace the values with your actual Firebase project config.
    window.__firebase_config = JSON.stringify({
        apiKey: "AIzaSxxxxxxxxxxxxxxxxx-DUMMY",
        authDomain: "project-id.firebaseapp.com",
        projectId: "project-id",
        storageBucket: "project-id.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef0123456789abcdef"
    });

    // An empty token will force the app to use signInAnonymously, which is fine locally.
    window.__initial_auth_token = ''; 
    // ---------------------------------

const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(

      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )