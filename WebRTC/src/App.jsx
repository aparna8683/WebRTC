import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SocketProvider from "./Providers/Socket";
import Room from "./Pages/Room";

const App = () => {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </SocketProvider>
  );
};

export default App;
