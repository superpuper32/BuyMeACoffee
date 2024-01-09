import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'
import { Button, Form, Footer } from '../components';
import abi from '../../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json';

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0xF5C1F1d17CF3d8C5ea6372890A7905D110Cd8bC9";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  // const [name, setName] = useState("");
  // const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  // const onNameChange = (e) => setName(e.target.value);
  // const onMessageChange = (e) => setMessage(e.target.value);

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) console.log("please install MetaMask");

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.BrowserProvider(ethereum);
  //       const signer = await provider.getSigner();
  //       const buyMeACoffee = new ethers.Contract(
  //         contractAddress,
  //         contractABI,
  //         signer
  //       );

  //       console.log("buying coffee..")
  //       console.log("buyMeACoffee .", buyMeACoffee);
  //       const coffeeTxn = await buyMeACoffee.buyCoffee(
  //         name ? name : "anon",
  //         message ? message : "Enjoy your coffee!",
  //         { value: ethers.parseEther("0.001") }
  //       );

  //       console.log('coffeeTxn', coffeeTxn);

  //       await coffeeTxn.wait();

  //       console.log("mined ", coffeeTxn.hash);

  //       console.log("coffee purchased!");

  //       // Clear the form fields.
  //       setName("");
  //       setMessage("");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
        
        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
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
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
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
        <title>Buy SuperPuper a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Buy SuperPuper a Coffee!</h1>
        
        {currentAccount ? (
          <Form />
        ) : (
          <Button click={connectWallet}>Connect your wallet</Button>
          // <button onClick={connectWallet}> Connect your wallet </button>
        )}
      </main>

      {currentAccount && (<h1>Memos received</h1>)}

      {currentAccount && (memos.map((memo, idx) => {
        return (
          <div key={idx} style={{border:"2px solid", "borderRadius":"5px", padding: "5px", margin: "5px"}}>
            <p style={{"fontWeight":"bold"}}>"{memo.message}"</p>
            <p>From: {memo.name} at {memo.timestamp.toString()}</p>
          </div>
        )
      }))}

      <Footer />
    </div>
  )
}
