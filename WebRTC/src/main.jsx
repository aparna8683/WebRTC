import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SocketProvider from "./Providers/Socket";

createRoot(document.getElementById("root")).render(
    <SocketProvider>
      <BrowserRouter>
        {" "}
        <App />
      </BrowserRouter>
    </SocketProvider>
);
