import React, { useEffect } from "react";
import { useSocket } from "../Providers/Socket";

const Room = () => {
  const { socket } = useSocket();
  const handleNewUserJoined = (data) => {
    const { emailId } = data;
    console.log("New User Joined", emailId);
  };
  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
  }, [socket]);
  return <div>Room Page</div>;
};

export default Room;
