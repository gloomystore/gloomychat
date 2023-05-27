import styles from '@/styles/Footer.module.scss'
import Image from 'next/image'

export default function Footer({todayHit,totalHit}) {
  return (
    <footer className={`${styles["footer"]}`} id="contact">
    <div className={`${styles["footer-inner"]}`}>
      <article className={`${styles["footer-logo"]}`}>
        <a className="img-box" href="#!" onClick={e=>window.scrollTo(0,0)}>
          <Image src={require("/public/images/logo2.png")} alt="logo" className='onlyPC' />
          <Image src={require("/public/images/logo3.png")} alt="logo" className='onlySP' />
        </a>
      </article>
      <article className={`${styles["footer-desc"]}`}>
        <h5>이대영 포트폴리오 <em><span>today: {todayHit}</span><span>total: {totalHit}</span></em></h5>
        <p><a href="tel:01043431354">TEL : 010-4343-1354</a></p>
        <p><a href="mailto:serenity90s@naver.com">EMAIL : serenity90s@naver.com</a></p>
        <p>COPYRIGHT © 2019 YOUNG e Design CO., LTD. All Rights Reserved. Designed by YOUNG e Design</p>
      </article>
    </div>
  </footer>
  )
}
