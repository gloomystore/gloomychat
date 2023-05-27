
import styles from '@/styles/NavBar.module.scss'
// import {useRouter} from 'next/router'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollBlock } from "@/store/stores/scrollBlock";
import Image from 'next/image'
// import Link from 'next/link'

export default function NavBar() {
  // const router = useRouter()
  const [navActive,setNavActive] = useState(false)
  function moveScroll(id){
    if(document.querySelector(`#${id}`)) {
      const top = document.querySelector(`#${id}`).getBoundingClientRect().top - 120;window.scrollTo(0,window.scrollY + top)
      if(navActive){
        setNavActive(false)
      }
    }
  }
  function handleNav(){
    setNavActive(!navActive)
  }

  /** redux */
  const dispatch = useDispatch();
  const scrollBlockState = useSelector((state) => state.scroll);
  const [scrollStyle,setScrollStyle] = useState(` `)

  useEffect(() => {
    dispatch(scrollBlock(navActive)); // redux에 test라는 state에 babo1을 넣는다.
    if(scrollBlockState){
      setScrollStyle(`
      html {
        height: 100vh;
        overflow-y: hidden;
      }
      `)
    } else {
      setScrollStyle(``)
    }
  }, [navActive,scrollBlockState])
  /** //redux */

  function goHome(){
    if(window.scrollY < 2) {
      window.location.reload(false)
    } else {
      window.scrollTo(0,0); setNavActive(false)
    }
  }

  return (
    <>
      <nav className={ navActive ? `${styles['nav']} ${styles['active']}`  : `${styles['nav']}` }>
        <h2 className={`${styles['nav-logo']}`}>
          <a href="#!" onClick={goHome} title="페이지 제일 위로" className={`${styles['navv']} img-box`}>
            <Image src={require("/public/images/logo2.png")} alt="logo" className='onlyPC' />
            <Image src={require("/public/images/logo3.png")} alt="logo" className='onlySP' />
          </a>
        </h2>
        <ul className={`${styles['nav-list']} onlyPC`}>
          <li>
            <a href='#!' onClick={()=>moveScroll('intro')}>Intro</a>
          </li>
          <li>
            <a href='#!' onClick={()=>moveScroll('skill')}>Skill</a>
          </li>
          <li>
            <a href='#!' onClick={()=>moveScroll('portfolio')}>Portfolio</a>
          </li>
          <li>
            <a href='#!' onClick={()=>moveScroll('contact')}>Contact</a>
          </li>
        </ul>
        <div className={`${styles['nav-inner']} onlySP`}>
          <button className={navActive ? `${styles['nav-hamburger']} ${styles['active']} onlySP` : `${styles['nav-hamburger']} onlySP`} onClick={handleNav} title="메뉴 열기/닫기">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <article className={navActive ? `${styles['nav-menu']} ${styles['active']}` : `${styles['nav-menu']}`}>
            <ul className={`${styles['nav-list-mobile']}`}>
              <li>
                <a href='#!' onClick={()=>moveScroll('intro')}>Intro</a>
              </li>
              <li>
                <a href='#!' onClick={()=>moveScroll('skill')}>Skill</a>
              </li>
              <li>
                <a href='#!' onClick={()=>moveScroll('portfolio')}>Portfolio</a>
              </li>
              <li>
                <a href='#!' onClick={()=>moveScroll('contact')}>Contact</a>
              </li>
            </ul>
          </article>
        </div>
      </nav>
      {
        scrollBlockState &&
        <style>
          {scrollStyle}
        </style>
      }
      
    </>
  )
}
