import Image from "next/image";
import Link from "next/link";
import Error404 from "assets/images/404.png";
import Error404Mobile from 'assets/images/404-mobile.png';
import styles from '../styles/Error404.module.scss';
import useDetectWindowMode from "hooks/useDetectWindowMode";
import { WINDOW_MODE } from "constants/app";

export default function Custom404() {
  const windowMode = useDetectWindowMode();
  const isMobile = [WINDOW_MODE['SM'], WINDOW_MODE['MD'], WINDOW_MODE['LG']].includes(windowMode);
  return (
    <div className={styles.container}>
      <Image src={isMobile ? Error404Mobile : Error404} className="w-[100%]" />
      <div className={styles.textElement}>
        <div className={styles.text404}>404</div>
        <div className={styles.textNotice}>Sorry! The page you’re looking for cannot be found.</div>
      </div>
      
    </div>
  )
}