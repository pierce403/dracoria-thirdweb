import { ConnectButton } from "@/app/thirdweb";

import styles from "./page.module.css";
import { myChain } from "../../utils/constants";
import Navbar from "./Navbar";
import Garden from "./Garden";
import Settings from "./Settings";
import Chat from "./Chat";
import Dragon from "./Dragon";

export default function Home() {
  return (<div className={styles.main}>
    <Navbar />
    <div style={{ textAlign: "center", marginTop: '20px' }}>
      <ConnectButton client={myChain} />
    </div>
    <div className={styles.cardsContainer}>
      <Dragon />
      <Garden />
      <Settings />
      <Chat />
    </div>
  </div>);
}
