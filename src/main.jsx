import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './styles/index.css'

console.log("main.jsx: Starting render...");
try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log("main.jsx: Root created:", root);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
    console.log("main.jsx: Render called successfully.");
} catch (error) {
    console.error("main.jsx: RENDER ERROR:", error);
}
