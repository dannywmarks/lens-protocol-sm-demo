import "../styles/globals.css";
import { useState, useEffect } from "react";
import { ethers, providers } from "ethers";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  createClient,
  STORAGE_KEY,
  authenticate as authenticateMutation,
  getChallenge,
} from "../api/index.js";
import { parseJwt, refreshAuthToken } from "../utils";
import { AppContext } from "../context";
import utp from "../public/assets/UTPBGBLCK.png";
import defaultProfile from "../public/assets/defaultProfile.png";

function MyApp({ Component, pageProps }) {
  const [connected, setConnected] = useState(true);
  const [userAddress, setUserAddress] = useState();
  const router = useRouter();

  useEffect(() => {
    refreshAuthToken();
    async function checkConnection() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const addresses = await provider.listAccounts();
      if (addresses.length) {
        setConnected(true);
        setUserAddress(addresses[0]);
      } else {
        setConnected(false);
      }
    }
    checkConnection();
    listenForRouteChangeEvents();
  }, []);

  async function listenForRouteChangeEvents() {
    router.events.on("routeChangeStart", () => {
      refreshAuthToken();
    });
  }

  async function signIn() {
    try {
      const accounts = await window.ethereum.send("eth_requestAccounts");
      setConnected(true);
      const account = accounts.result[0];
      const urqlClient = await createClient();
      const response = await urqlClient
        .query(getChallenge, {
          address: account,
        })
        .toPromise();
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setUserAddress(account);
      const signature = await signer.signMessage(response.data.challenge.text);
      const authData = await urqlClient
        .mutation(authenticateMutation, {
          address: account,
          signature,
        })
        .toPromise();
      const { accessToken, refreshToken } = authData.data.authenticate;
      const accessTokenData = parseJwt(accessToken);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken,
          refreshToken,
          exp: accessTokenData.exp,
        })
      );
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
      <div className="container mx-auto">
        <nav
          className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded"
          style={{ backgroundColor: "#131313" }}
        >
          <div className="container flex flex-wrap justify-between items-center mx-auto">
            <Link href="/">
              <a className="flex items-center ml-3">
                <Image
                  src={utp}
                  width="60px"
                  height="60px"
                  className="mr-3 h-6 sm:h-9"
                  alt="Flowbite Logo"
                />
                <div className="ml-5">
                  {!connected ? (
                    <button className="text-white px-4 py-2 rounded-2xl bg-red-500" onClick={signIn}>
                      Sign in
                    </button>
                  ) : (
                    <div className="text-white">
                      <span className="text-white uppercase font-bold mr-3">
                        User:
                      </span>
                      {userAddress && userAddress.slice(0,5) + '...' + userAddress.slice(38,42)}
                    
                    </div>
                  )}
                </div>
              </a>
            </Link>

            <div className="flex items-center md:order-2 mr-5">
              <button
                type="button"
                className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="dropdown"
              >
                <span className="sr-only">Open user menu</span>
                <Image
                  width="50px"
                  height="50px"
                  className="w-8 h-8 rounded-full"
                  src={defaultProfile}
                  alt="user photo"
                />
              </button>

              <div
                className="hidden z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                id="dropdown"
                data-popper-reference-hidden=""
                data-popper-escaped=""
                data-popper-placement="top"
              >
                <div className="py-3 px-4">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    Bonnie Green
                  </span>
                  <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                    name@flowbite.com
                  </span>
                </div>
                <ul className="py-1" aria-labelledby="dropdown">
                  <Link href="">
                    <a className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                      Dashboard
                    </a>
                  </Link>
                  <Link href="">
                    <a className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                      Create Profile
                    </a>
                  </Link>

                  <Link href="">
                    <a
                      href="#"
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </Link>
                </ul>
              </div>
              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <svg
                  className="hidden w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 md:flex-row md:space-x-2 md:mt-0 md:text-sm md:font-medium uppercase">
                <Link href="/create">
                  <a
                    className="block py-2 pr-4 pl-3 text-white hover:text-blue-500"
                    aria-current="page"
                  >
                    Create Profile
                  </a>
                </Link>
                <Link href="">
                  <a className="block py-2 pr-4 pl-3 text-white hover:text-blue-500">
                    My Profile
                  </a>
                </Link>
                <Link href="/">
                  <a className="block py-2 pr-4 pl-3 text-white hover:text-blue-500">
                    Profiles
                  </a>
                </Link>
              </ul>
            </div>
          </div>
        </nav>

        <Component {...pageProps} />
      </div>
    </AppContext.Provider>
  );
}

export default MyApp;
