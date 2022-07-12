import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import Providers from "./providers";
import {Toaster} from "react-hot-toast";

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
      <Toaster toastOptions={{
          className: '',
          style: {
              color: 'var(--yankees-blue)',
              boxShadow: '0px 11px 60px rgba(0, 89, 176, 0.15)',
          },
          success: {
              iconTheme: {
                  primary: 'var(--success-color)',
                  secondary: '#fff',
              },
          },
      }}
      containerStyle={{
          bottom: 40,
          right:40,
          zIndex:1
      }}
      position={'bottom-right'} />
        <svg className="clip-paths">
        <clipPath id="hex-clip" clipPathUnits="objectBoundingBox">
          <path d="M0.265,0.092 C0.38,0.031,0.437,0,0.5,0 C0.563,0,0.62,0.031,0.735,0.092 L0.765,0.108 C0.88,0.169,0.937,0.2,0.969,0.25 C1,0.3,1,0.362,1,0.484 V0.516 C1,0.638,1,0.7,0.969,0.75 C0.937,0.8,0.88,0.831,0.765,0.892 L0.735,0.908 C0.62,0.969,0.563,1,0.5,1 C0.437,1,0.38,0.969,0.265,0.908 L0.235,0.892 C0.12,0.831,0.063,0.8,0.031,0.75 C0,0.7,0,0.638,0,0.516 V0.484 C0,0.362,0,0.3,0.031,0.25 C0.063,0.2,0.12,0.169,0.235,0.108 L0.265,0.092"></path>
        </clipPath>
      </svg>
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
