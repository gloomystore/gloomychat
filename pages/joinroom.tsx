import Head from 'next/head'
import NavBar from '@/components/NavBar'
import styles from '@/styles/chat.module.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  uuid: string;
};

// export const getServerSideProps: GetServerSideProps<Props> = async (ctx: GetServerSidePropsContext<ParsedUrlQuery>) => {
//   const { uuid } = ctx.params || {};

//   // UUID 값에 대한 추가 로직 수행

//   return {
//     props: {
//       uuid,
//     },
//   } as GetServerSidePropsResult<Props>;;
// };


export default function Chat() {
  // nextauth 로그인
  let session  = useSession();
  const [isLogin,setIsLogin] = useState(!(session.status === 'unauthenticated'))
  const router = useRouter()
 // 유저들 정보
  const [users,setUsers]:[[{
    name:string,
    email:string,
    image:string,
  }],Function] = useState([{
    name:'',
    email:'',
    image:'',
  }])

  // 유저의 정보 가져오기
  const getUserData = async () => {
    try {
      const res = await axios.get(`/api/users/get`);
      return res.data
    } catch (err) {
      console.log(err);
    }
  };

  // 최초 마운트시, 로그인 상태면 유저 데이터를 불러옴
 useEffect(()=>{
  if (session.status === 'authenticated') {
    setIsLogin(true);
    (async function(){
      const usersData = await getUserData() as any;
      const filteredData = usersData.filter(e=> e.email !== session?.data?.user?.email)
      setUsers(filteredData)
      console.log(session.data.user)
      console.log(usersData)
    })()
   } else if(session.status === 'loading') {
    return
   } else {
    alert('잘못된 접근입니다.')
    window.location.href = '/'
   }
 },[session])

 // 채팅방 정보 만들기
 async function setChatroom(uuid:string,name:string,host:string,guest:string,timestamp:string,time:string){
  try {
    const data = {uuid, name, host, guest, timestamp, time}
    const res = await axios.post(`/api/chatroom/set`, data);
    return res
  } catch (err) {
    console.log(err);
  }
};

// 내 채팅 데이터 가져오기
const fetchChatrooms = async (myId:string) => {
  try {
    const res = await axios.get(`/api/chatrooms/get/${myId}`);
    return [
      ...res.data,
    ]
  } catch (err) {
    console.log(err);
  }
};

 // 실제 채팅방 만들기
 async function setChat(parentId:string){
  try {
    const {uuid} = getUuid();
    const data = {
      parentId,uuid,chat:[]
    }
    const res = await axios.post(`/api/chats/set`, data);
    return res
  } catch (err) {
    console.log(err);
  }
};

  type myChatRoom = {
    guest: string,
    host: string,
    name: string,
    time: string,
    timestamp: string,
    uuid: string,
    _id: string,
  }[]
  // 채팅 걸기 기능
  async function joinChat(guest:string){
    const myChat = await fetchChatrooms(session.data?.user?.email as string)
    const isAlreadyChatRoom = myChat?.filter(e => {
      if(e.guest === guest || e.host === guest) return true
      else return false
    })
    if((isAlreadyChatRoom as myChatRoom).length > 0) {
      return router.push(`/chat/${(isAlreadyChatRoom as myChatRoom)[0].uuid}`)
    };
    const name = prompt("채팅방 제목을 입력하세요:");
    if(!name) return alert('제목을 입력해주세요')
    const host = session?.data?.user?.email as string
    const {uuid,time} = getUuid()
    const timestamp = uuid.split('_')[0]
    const setChatroomResult = await setChatroom(uuid,name,host,guest,timestamp,time)
    const setChatResult = await setChat(uuid)
    if(setChatroomResult?.data.insertedId && setChatResult?.data.insertedId) {
      router.push(`/chat/${uuid}`)
    }
  }
  function getUuid(){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    const randomNumber = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

    const uuid = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}_${randomNumber}`;
    const time = currentDate.toISOString();

    const result = {
      uuid: uuid,
      time: time
    };
    return result
  }
  

  


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
          {/* <h2 className="title-03 mt-0" id="intro">{chatData.name}</h2> */}
          <div className={`ly-flex-wrap mt-50 ${styles['chatroom-box__wrap']}`}>
            {
              isLogin ?

              users.length > 0 ?
              <>
                {
                  users.map((user,index) => {
                  return <article key={'chat'+index.toString()} className={`${styles['chatroom-box']}`}>
                  <button onClick={()=>joinChat(user.email)} className={`${styles['chatroom-box__division']}`}>
                    <div>
                      <img src={user.image} alt="profile" width={60} height={60} />
                    </div>
                    <div>
                      <div className="ly-flex-wrap justify-between align-center">
                        <h3>{user.name}</h3>
                        <p className='mt-10'>{user.email}</p>
                      </div>
                    </div>
                  </button>
                </article>
                  })
                }
                
              </>
              :
              <>
              채팅 기록이 없습니다.
              </>
              :
              <>
                로그인해주세요
              </>
            }
            
         
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </>
  )
}
