import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SocketProvider from "./Providers/Socket";
import Room from "./Pages/Room";
import PeerProvider from "./Providers/Peer";


const App = () => {
  return (
    <SocketProvider>
      <PeerProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </PeerProvider>
    </SocketProvider>
  );
};

export default App;
