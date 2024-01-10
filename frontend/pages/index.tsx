import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Head from 'next/head'

import { Button, Form, Footer, Memos } from '../components';
import styles from '../styles/Home.module.css'
import abi from '../utils/BuyMeACoffee.json';

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0xF5C1F1d17CF3d8C5ea6372890A7905D110Cd8bC9";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [memos, setMemos] = useState([]);

  // Wallet connection logic
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      // TODO
      // if (!ethereum) console.log("please install MetaMask");
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

        setCurrentAccount(accounts[0]);
      }      
    } catch (error) {
      console.log(error);
    }
  }

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        const memos = await buyMeACoffee.getMemos();

        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    let buyMeACoffee: any;
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from: string, timestamp: any, name: string, message: string) => {
      // console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState): any => [ ...prevState, {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const {ethereum} = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.BrowserProvider(ethereum);
      // const signer = provider.getSigner();
      
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Buy Super Puper a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Buy Super Puper a Coffee!</h1>
        {currentAccount ? (<Form />) : (<Button click={connectWallet}>Connect your wallet</Button>)}
      </main>

      {currentAccount && <Memos memos={memos} />}

      <Footer />
    </div>
  )
}
