// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { BrowserRouter } from 'react-router-dom'


// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//      <BrowserRouter>
//     <App />
//     </BrowserRouter>
//   </StrictMode>,
// )

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from "react-hot-toast";
import ScrollToTop from './components/common/ScrollToTop';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
        <Toaster
          toastOptions={{
            success: {
              style: { background: "#1E1E1E", color: "#fff" },
              iconTheme: { primary: "#4CAF50", secondary: "#fff" },
            },
            error: {
              style: { background: "#1E1E1E", color: "#fff" },
              iconTheme: { primary: "#FF5252", secondary: "#fff" },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
