import React from "react";
import ReactDOM from "react-dom/client";
import SocketProvider from "./context/SocketProvider.jsx";
import App from "./App.jsx";

import AuthProvider from "./context/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    <AuthProvider>
      
       <SocketProvider>
           <App />
       </SocketProvider>
     

    </AuthProvider>

  </React.StrictMode>

);