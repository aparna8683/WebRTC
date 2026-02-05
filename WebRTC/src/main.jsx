import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SocketProvider from "./Providers/Socket";
import PeerProvider from "./Providers/Peer";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <PeerProvider>
      <BrowserRouter>
        {" "}
        <App />
      </BrowserRouter>
    </PeerProvider>
  </SocketProvider>,
);
