import React, { useState } from "react";
import { ethers } from "ethers";

import abi from '../../../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json';

const CONTRACT_ADDRESS = "0xF5C1F1d17CF3d8C5ea6372890A7905D110Cd8bC9";
const CONTRACT_ABI = abi.abi;

const Form: React.FC = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const onNameChange = (e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value);
    const onMessageChange = (e: React.FormEvent<HTMLTextAreaElement>) => setMessage(e.currentTarget.value);

    const buyCoffee = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = await provider.getSigner();
                const buyMeACoffee = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    signer
                );

                const coffeeTxn = await buyMeACoffee.buyCoffee(
                    name ? name : "anon",
                    message ? message : "Enjoy your coffee!",
                    { value: ethers.parseEther("0.001") }
                );

                await coffeeTxn.wait();

                // Clear the form fields.
                setName("");
                setMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
          <form>
            <div>
              <label>Name</label>
                <br/>
                <input
                  id="name"
                  type="text"
                  placeholder="anon"
                  onChange={onNameChange}
                  />
              </div>
              <br/>
              <div>
                <label>Send Albert a message</label>
                <br/>
                <textarea
                  rows={3}
                  placeholder="Enjoy your coffee!"
                  id="message"
                  onChange={onMessageChange}
                  required
                >
              </textarea>
            </div>
            <div>
              <button
                type="button"
                onClick={buyCoffee}
              >
                Send 1 Coffee for 0.001ETH
              </button>
            </div>
          </form>
        </div>
    );
}

export default Form;
