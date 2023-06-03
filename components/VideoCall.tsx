import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const VideoCall = ({ uuid, mail, host, guest }: { uuid: string; mail: { myMail: string; partnerMail: string }, host:string, guest: string }) => {
  const router = useRouter();
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const { myMail, partnerMail } = mail;

  useEffect(() => {
    const loadPeer = async () => {
      const Peer = (await import('peerjs')).default;
      const peer = new Peer(myMail, {
        host: "videoserver.gloomy-store.com",
        port: 443,
        path: "/",
      });

      peer.on('call', function (call) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(function (stream) {
            if (myVideo.current) myVideo.current.srcObject = stream;
            call.answer(stream);
            call.on('stream', function (stream) {
              if (remoteVideo.current) remoteVideo.current.srcObject = stream;
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      });

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function (stream) {
          if (myVideo.current) myVideo.current.srcObject = stream;
          let call = peer.call(partnerMail, stream);
          if (call != null) {
            call.on('stream', function (stream) {
              if (remoteVideo.current) remoteVideo.current.srcObject = stream;
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      // Other logic with the Peer object if needed
    };

    loadPeer();
  }, [myMail, partnerMail]);

  return (
    <>
      <video
        id="remotevideo"
        ref={remoteVideo}
        autoPlay
      />
      <video
        id="myvideo"
        ref={myVideo}
        autoPlay
      />
    </>
  );
};

export default VideoCall;