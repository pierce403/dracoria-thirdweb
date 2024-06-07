'use client'
import { ConnectButton } from "@/app/thirdweb";

// import styles from "./page.module.css";
import { client } from "./utils/client";
import DracoriaNavbar from "./components/Navbar";
import Garden from "./components/Garden";
import Settings from "./components/Settings";
import Chat from "./components/Chat";
import Dragon from "./components/Dragon";
import { LoginButton } from "./components/LoginButton";


export default function Home() {
  return (<div className="theme-dark">
    <DracoriaNavbar />
    <div style={{ textAlign: "center", marginTop: '20px' }}>
      <LoginButton />
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
