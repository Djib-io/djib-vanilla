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
              boxShadow: '0px 11px 60px rgba(0, 89, 176, 0.15)'
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
          right:40
      }}
      position={'bottom-right'} />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
