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
        call.on('close', function() {
          console.log('close!!!!!!')
          // 상대방이 연결을 종료했을 때 실행되는 코드
          // 여기에서 필요한 처리를 수행하고 비디오를 중지할 수 있습니다.
          if (remoteVideo.current) {
            remoteVideo.current.pause(); // 비디오 중지
            remoteVideo.current.srcObject = null; // 비디오 객체 초기화
          }
        });
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
          call.on('close', function() {
            console.log('close!!!!!!')
            // 상대방이 연결을 종료했을 때 실행되는 코드
            // 여기에서 필요한 처리를 수행하고 비디오를 중지할 수 있습니다.
            if (remoteVideo.current) {
              remoteVideo.current.pause(); // 비디오 중지
              remoteVideo.current.srcObject = null; // 비디오 객체 초기화
            }
          });
        })
        .catch(function (error) {
          console.log(error);
        });
        

      // Other logic with the Peer object if needed
    };

    loadPeer();
  }, [myMail, partnerMail]);

  useEffect(() => {
    const checkConnectionStatus = setInterval(() => {
      // if (remoteVideo.current && remoteVideo.current.srcObject) {
      //   console.log('Connected');
      // } else {
      //   console.log('Not Connected');
      // }
    }, 1000);

    return () => {
      clearInterval(checkConnectionStatus);
    };
  }, []);

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