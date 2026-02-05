import React from "react";
import { useState } from "react";
import { useEffect, useCallback } from "react";
import { useMemo } from "react";
const PeerContext = React.createContext(null);
import { useSocket } from "../Providers/Socket";


export const usePeer = () => React.useContext(PeerContext);

const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  }, []);
  const { socket } = useSocket();


  const createOffer = async () => {
    console.log("Creating WebRTC offer");

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };
  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };
  const setRemoteAnswer = async (ans) => {
    await peer.setRemoteDescription(ans);
  };
  const sendStream = async (stream) => {
    const tracks = stream.getTracks();

    for (const track of tracks) {
      const alreadyAdded = peer
        .getSenders()
        .find((sender) => sender.track === track);

      if (!alreadyAdded) {
        peer.addTrack(track, stream);
      }
    }
  };
  const handleTrackEvent = useCallback((ev) => {
    const streams = ev.streams;
    setRemoteStream(streams[0]);
  }, []);
  const handleNegotiation = useCallback(async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("offer", offer);
  }, [peer]);
  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [handleTrackEvent, peer]);
  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAnswer,
        sendStream,
        remoteStream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;
