import "../styles/globals.css";
import { useState, useEffect } from "react";
import { ethers, providers } from "ethers";
import { useRouter } from "next/router";
import {
  createClient,
  STORAGE_KEY,
  authenticate as authenticateMutation,
  getChallenge,
} from "../api/index.js";
import { parseJwt, refreshAuthToken } from "../utils";
import { AppContext } from "../context";



function MyApp({ Component, pageProps }) {
  const [connected, setConnected] = useState(true);
  const [userAddress, setUserAddress] = useState();
  const router = useRouter();

  useEffect(() => {
    refreshAuthToken()
    async function checkConnection() {
      const provider = new ethers.providers.Web3Provider(
        (window).ethereum
      )
      const addresses = await provider.listAccounts();
      if (addresses.length) {
        setConnected(true)
        setUserAddress(addresses[0])
      } else {
        setConnected(false)
      }
    }
    checkConnection()
    listenForRouteChangeEvents()
  }, [])

  async function listenForRouteChangeEvents() {
    router.events.on('routeChangeStart', () => {
      refreshAuthToken()
    })
  }

  async function signIn() {
    try {
      const accounts = await window.ethereum.send("eth_requestAccounts");
      setConnected(true);
      const account = accounts.result[0];
      const urqlClient = await createClient()
      const response = await urqlClient.query(getChallenge, {
        address: account
      }).toPromise()
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      setUserAddress(account);
      const signature = await signer.signMessage(response.data.challenge.text)
      const authData = await urqlClient.mutation(authenticateMutation, {
        address: account, signature
      }).toPromise()
      const { accessToken, refreshToken } = authData.data.authenticate
      const accessTokenData = parseJwt(accessToken)

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken, refreshToken, exp: accessTokenData.exp
      }))
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <AppContext.Provider
      value={{
        userAddress,
      }}
    >
      <div style={{ padding: "100px" }}>
        <div>
        <button onClick={signIn}>Sign in</button>
        {console.log(connected, userAddress)}
        </div>

        <Component {...pageProps} />
      </div>
    </AppContext.Provider>
  );
}

export default MyApp;
