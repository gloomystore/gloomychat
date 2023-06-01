'use client';
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const VideoCall = ({uuid,name}:{uuid:string,name:any}) => {
  const socketRef = useRef<Socket>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection>();

  useEffect(() => {
    console.log(name)
    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

    pcRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // 변경된 부분: STUN 서버 추가
      ],
    });
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
  
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
        if (!(pcRef.current && socketRef.current)) {
          return;
        }
        stream.getTracks().forEach((track) => {
          if (!pcRef.current) {
            return;
          }
          pcRef.current.addTrack(track, stream);
        });
  
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            if (!socketRef.current) {
              return;
            }
            console.log("recv candidate");
            socketRef.current.emit("candidate", e.candidate, uuid);
          }
        };
  
        pcRef.current.ontrack = (e) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        };
      } catch (e) {
        console.error(e);
      }
    };
  
    const createOffer = async () => {
      console.log("create Offer");
      if (!(pcRef.current && socketRef.current)) {
        return;
      }
      try {
        const sdp = await pcRef.current.createOffer();
        pcRef.current.setLocalDescription(sdp);
        console.log("sent the offer");
        socketRef.current.emit("offer", sdp, uuid);
      } catch (e) {
        console.error(e);
      }
    };
  
    const createAnswer = async (sdp: RTCSessionDescription) => {
      console.log("createAnswer");
      if (!(pcRef.current && socketRef.current)) {
        return;
      }
  
      try {
        pcRef.current.setRemoteDescription(sdp);
        const answerSdp = await pcRef.current.createAnswer();
        pcRef.current.setLocalDescription(answerSdp);
  
        console.log("sent the answer");
        socketRef.current.emit("answer", answerSdp, uuid);
      } catch (e) {
        console.error(e);
      }
    };


    

    socketRef.current.on("all_users", (allUsers: Array<{ id: string }>) => {
      if (allUsers.length > 0) {
        createOffer();
      }
    });

    socketRef.current.on("getOffer", (sdp: RTCSessionDescription) => {
      console.log("recv Offer");
      createAnswer(sdp);
    });

    socketRef.current.on("getAnswer", (sdp: RTCSessionDescription) => {
      console.log("recv Answer");
      if (!pcRef.current) {
        return;
      }
      pcRef.current.setRemoteDescription(sdp);
    });

    socketRef.current.on("getCandidate", async (candidate: RTCIceCandidate) => {
      if (!pcRef.current) {
        return;
      }

      await pcRef.current.addIceCandidate(candidate);
    });

    socketRef.current.emit("join_room", {
      room: uuid,
    });

    getMedia();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  return (
    <>
      <video
        id="remotevideo"
        ref={remoteVideoRef}
        autoPlay
      />
      <video
        id="myvideo"
        ref={myVideoRef}
        autoPlay
      />
    </>
  );
};

export default VideoCall;