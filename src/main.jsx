import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppContextProvider from "./Context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <GoogleOAuthProvider clientId="50307226748-kc67451ft59qs8mut92cpisuvc1rjcna.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
