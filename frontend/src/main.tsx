import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// If a token is passed in the URL fragment (e.g. after server-side OAuth/login),
// store it in localStorage under the frontend origin so API calls can use it.
if (typeof window !== 'undefined') {
  const hash = window.location.hash;
  if (hash && hash.includes('token=')) {
    try {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('token');
      if (token) {
        localStorage.setItem('token', token);
        // Clean the URL (remove fragment)
        const clean = window.location.origin + window.location.pathname + window.location.search;
        window.history.replaceState({}, document.title, clean);
      }
    } catch (e) {
      console.warn('Failed to parse token from URL fragment', e);
    }
  }
}

createRoot(document.getElementById("root")!).render(<App />);
