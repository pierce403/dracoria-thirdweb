'use client'
import { ConnectButton } from "@/app/thirdweb";

// import styles from "./page.module.css";
import { myClient, myChain } from "../../utils/constants";
import DracoriaNavbar from "./Navbar";
import Garden from "./Garden";
import Settings from "./Settings";
import Chat from "./Chat";
import Dragon from "./Dragon";


export default function Home() {
  return (<div className="theme-dark">
    <DracoriaNavbar />
    <div style={{ textAlign: "center", marginTop: '20px' }}>
      <ConnectButton client={myClient} />
    </div>
    <div className="container p-4">
      <Dragon />
    </div>
    <div className="container p-4">
      <Garden />
    </div>
    <div className="container p-4">
      <Settings />
    </div>
    <div className="container p-4">
      <Chat />
    </div>
  </div>);
}
