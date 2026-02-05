import React, { useCallback, useEffect } from "react";
import { useSocket } from "../Providers/Socket";
import { usePeer } from "../Providers/Peer";
import { useState } from "react";
import ReactPlayer from "react-player";

const Room = () => {
  console.log(" Room component mounted");

  const { socket } = useSocket();
  const [myStream, setMyStream] = useState();
  const [remoteEmailId, setRemoteEmailId] = useState(null);
  // const [remoteStream, setRemoteStream] = useState(null);
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();
  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New User Joined", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },
    [createOffer, socket],
  );
  const handleInCommingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("IncomingCall from ", from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accept", { emailId: from, ans });
      setRemoteEmailId(from);
    },
    [createAnswer, socket],
  );
  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call got Accepted ", ans);
      await setRemoteAns(ans);
      sendStream(myStream);
    },
    [setRemoteAns],
  );
  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    // sendStream(stream);
    setMyStream(stream);
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleInCommingCall);
    socket.on("call-accepted", handleCallAccepted);
    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleInCommingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [handleNewUserJoined, handleInCommingCall, handleCallAccepted, socket]);
  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);
  return (
    <div className="bg-amber-100">
      <h1>Room Page</h1>
      <button
        className="border border-gray-600 p-1 font-semibold text-sm rounded-lg cursor-pointer"
        onClick={(e) => sendStream(myStream)}
      >
        Send My Stream
      </button>
      <h4>
        You are connected to @<p className="bg-white">{remoteEmailId}</p>{" "}
      </h4>
      <ReactPlayer className="bg-red-300" url={myStream} playing />
      <ReactPlayer className="bg-red-500" url={remoteStream} playing />
    </div>
  );
};

export default Room;
