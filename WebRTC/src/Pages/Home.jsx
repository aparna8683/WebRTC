import React, { useEffect, useState } from "react";
import { useSocket } from "../Providers/Socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const socketContext = useSocket();
  if (!socketContext) {
    console.log("SocketContext is null");
    return null;
  }
  const { socket } = socketContext;
  const handleJoinRoom = () => {
    if (!email || !roomId) {
      alert("Please enter email and room ID");
      return;
    }
    if (!socket) {
      console.log("Socket not ready yet");
      return;
    }

    socket.emit("join-room", {
      roomId,
      emailId: email,
    });
  };

  useEffect(() => {
    const handleJoinedRoom = ({ roomId }) => {
      navigate(`/room/${roomId}`);
    };
    socket.on("joined-room", handleJoinedRoom);
    return () => {
      socket.off("joined-room", handleJoinedRoom);
    };
  }, [socket, navigate]);
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  to-purple-200">
        <div className="bg-white w-80 p-6 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Join a Room</h2>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Enter room number"
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />

          <button
            onClick={handleJoinRoom}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
