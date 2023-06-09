import Head from 'next/head'
import NavBar from '@/components/NavBar'
import styles from '@/styles/chat.module.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

// * Socket.io
import {io} from "socket.io-client";
import VideoCall from '@/components/VideoCall'

type Props = {
  uuid: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx: GetServerSidePropsContext<ParsedUrlQuery>) => {
  const { uuid } = ctx.params || {};

  // UUID 값에 대한 추가 로직 수행

  return {
    props: {
      uuid,
    },
  } as GetServerSidePropsResult<Props>;;
};


export default function Chat({uuid}:{uuid:string}) {
  // nextauth 로그인
  let session  = useSession();
  const [isLogin,setIsLogin] = useState(!(session.status === 'unauthenticated'))

 // 로그인하면 채팅 데이터 로딩
 const [chatData, setChatData]:[{
    _id: string,
    uuid: string,
    name: string,
    host: string,
    guest: string,
    timestamp: string,
    time: string,
  },Function] = useState({
    _id: '',
    uuid: '',
    name: '',
    host: '',
    guest: '',
    timestamp: '',
    time: '',
  })

  // 내 메일(비디오 컴포넌트에 내 아이디를 넣기위해 따로 뺌, 로딩 확인용도도 추가)
  const [mail, setMail] = useState({myMail:'',partnerMail:''})
  // 나의 데이터 (사진, 이름)
  const [myData,setMyData]:[{
    name:string,
    email:string,
    photo:string,
  },Function] = useState({
    name:'',
    email:'',
    photo:'',
  })

  // 상대방 데이터 (사진, 이름)
  const [partnerData,setPartnerData]:[{
    name:string,
    email:string,
    photo:string,
  },Function] = useState({
    name:'',
    email:'',
    photo:'',
  })
  // 실제 채팅들
  const [chats,setChats]:[{
    email:string,
    msg:string,
    time:number,
  }[],Function] = useState([{
    email:'',
    msg:'',
    time:0,
  }])

  // 내 채팅 데이터 가져오기
  const fetchChatroomData = async () => {
    try {
      const res = await axios.get(`/api/chatroom/get/${uuid}`);
      return res.data
    } catch (err) {
      console.log(err);
    }
  };
  // 내 채팅들 가져오기
  const fetchChatsData = async () => {
    try {
      const res = await axios.get(`/api/chats/get/${uuid}`);
      return res.data
    } catch (err) {
      console.log(err);
    }
  };

  // 유저의 정보 가져오기
  const getUserData = async (email:string) => {
    try {
      const res = await axios.get(`/api/users/get/${email}`);
      return res.data
    } catch (err) {
      console.log(err);
    }
  };

  // 최초 마운트시, 로그인 상태면 채팅 데이터를 불러옴
 useEffect(()=>{
  if (session.status === 'authenticated') {
    setIsLogin(true);
    (async function(){
      const chatroomData = await fetchChatroomData() as any;
      const chatsData = await fetchChatsData() as any;
      const myEmail = session.data.user?.email as string;
      const partnerEmail = chatroomData.host === myEmail ? chatroomData.guest : chatroomData.host
      setChatData(chatroomData)
      const myData = await getUserData(myEmail)
      const partnerData = await getUserData(partnerEmail)
      setMail({myMail:myEmail,partnerMail:partnerEmail})
      setMyData(myData)
      setPartnerData(partnerData)
      setChats(chatsData.chat)
      // console.log(chatsData)
      // console.log(myData)
      // console.log(session)
    })()
   } else if(session.status === 'loading') {
    return
   } else {
    alert('잘못된 접근입니다.')
    window.location.href = '/'
   }
 },[session])

  // 채팅 보내기 기능 관련
  const [inputValue, setInputValue] = useState('')
  const [meet, setMeet] = useState(false) // 채팅방에 두 명이 모였으면 true
  function onInput(e: React.FormEvent<HTMLInputElement>){
    const val = e.currentTarget.value
    setInputValue(val)
  }
  function sendMessage(e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLInputElement>) {
    if(!inputValue) return
    onSocket()
  }
  // let interval = 3000;
  const chatRef = useRef<HTMLDivElement>(null);
  useCallback(()=>{
  },[])
  
  const newTime = ()=> {
    return Number(new Date())
  }
  // socket.on('hi', (data) => console.log(data)); // 서버 -> 클라이언트
  const socket = useMemo(()=>{
    return io(`${process.env.NEXT_PUBLIC_API_URL}`,{
      reconnectionAttempts: 20,
      reconnectionDelay: 2000, // 2초
      reconnectionDelayMax: 2000, // 2초
    });
  },[])
  const onSocket = useCallback(()=>{
    socket.emit('msgSend', {
      parentId:uuid,
      time: newTime(),
      msg: inputValue,
      email: myData.email
    });
    setInputValue('')
  },[inputValue])

  useEffect(() => {
    const handleBroadcast = (data:any) => {
      if(data.chat){ // 채팅 데이터를 받아온 것이라면
        setChats(data.chat)
      } else if(data[uuid]) { // 채팅방 구성원을 받아오는 것이라면
        if(data[uuid].length === 2) { // 인원이 두명이면, 드디어 만났다에 true
          setMeet(true)
        } else if(data[uuid].length < 2 && meet) { // 인원이 두명인 과거가 있었는데, 2명 미만으로 줄면 퇴장
          alert('상대방과의 연결이 끊겼습니다.')
          window.location.href = '/';
        } else if(data[uuid].length === 2 && meet){
          return
        }
      }
      // 수신한 데이터를 원하는 대로 처리합니다.
      // 예: 화면에 표시하거나 다른 동작 수행 등
    };
    socket.on('broadcast', handleBroadcast);
    socket.emit('joinroom', {uuid});
    return () => {
      socket.off('broadcast', handleBroadcast);
      socket.emit('leaveroom', {uuid}); // 룸에서 나가는 이벤트
    };
  }, [meet]);
  useEffect(() => {
    chatRef.current?.scrollTo(0,chatRef.current?.scrollHeight)
  }, [chats]);



  // 화상통화
  


  return (
    <>
      <Head>
        <title>Gloomy Chat</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar isLogin={isLogin} />
      <div className="wrap">
        {/* <header className="img-box header mb-100 hp-300">
          <div className="img-box--words">
            <h1>Gloomy Chat</h1>
            <p>Video Call &amp; Text Chat</p>
          </div>
        </header> */}

       <section className="section fadeInUp active blink mt-0 pb-10">
          <h2 className="title-03 mt-0" id="intro">{chatData.name}</h2>
          <div className={`mt-0 ${styles['chat-box']}`}>
            <article className={`${styles['video-box']}`}>
              {/* <video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                // autoPlay
                muted
              /> */}
              {
                chatData.host &&
                <VideoCall 
                uuid={uuid} 
                mail={mail}
                host={chatData.host}
                guest={chatData.guest}
                />
              }
              
            </article>
            <article className={`${styles['chat-box__chats']} mt-30`} ref={chatRef}>
            {
              chats.length > 0 &&

              chats.map((chat,index) => 
              chat.email === myData.email ? 
              <div className={`${styles['chats']} ${styles['right']}`} key={'chat'+index.toString()}>
                  <div className={`${styles['chat-box__division']}`}>
                    <a href="#!" title='프로필 보기'>
                      <img src={myData.photo} alt="profile" />
                    </a>
                    <div className={`${styles['chat-box__wrap']}`}>
                      <strong>{myData.name}</strong>
                      <div className={`${styles['chatting']}`}>
                        <p>{chat.msg}</p>
                      </div>
                    </div>
                  </div>
                </div>
              :
              <div className={`${styles['chats']}`} key={'chat'+index.toString()}>
                  <div className={`${styles['chat-box__division']}`}>
                    <a href="#!" title='프로필 보기'>
                      <img src={partnerData.photo} alt="profile" />
                    </a>
                    <div className={`${styles['chat-box__wrap']}`}>
                      <strong>{partnerData.name}</strong>
                      <div className={`${styles['chatting']}`}>
                        <p>{chat.msg}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) 
            }
            {
              chats.length === 0 && 
              <>
                채팅 기록이 없습니다.
              </>
            }
            </article>
            <article className={`${styles['chat-box__input']} pl-10 pr-10`}>
              <input type="text" onChange={onInput} value={inputValue} onKeyDown={e=> e.key === 'Enter' && sendMessage(e)} />
              <button onClick={sendMessage}>보내기</button>
            </article>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </>
  )
}
