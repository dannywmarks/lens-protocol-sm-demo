import { basicClient, STORAGE_KEY } from './api'
import { refresh as refreshMutation } from './api/mutations'
import { ethers, utils } from 'ethers'
import omitDeep from 'omit-deep'

export function trimString(string, length) {
  if (!string) return null
  return string.length < length ? string : string.substr(0, length-1) + "..."
}

export function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  console.log({jsonPayload})
  return JSON.parse(jsonPayload);
};

export async function refreshAuthToken() {
  const token = JSON.parse(localStorage.getItem(STORAGE_KEY))
  if (!token) return
  try {
    const authData = await basicClient.mutation(refreshMutation, {
      refreshToken: token.refreshToken
    }).toPromise()

    const { accessToken, refreshToken } = authData.data.refresh
    const exp = parseJwt(refreshToken).exp

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      accessToken, refreshToken, exp
    }))
    console.log({accessToken})
    return {
      accessToken
    }
  } catch (err) {
    console.log('error:', err)
  }
}

export function getSigner() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  return provider.getSigner();
}

export const getAddressFromSigner = () => {
  return getSigner().address;
};

export function signedTypeData (domain, types, value) {
  const signer = getSigner();
  return signer._signTypedData(
    omitDeep(domain, '__typename'),
    omitDeep(types, '__typename'),
    omitDeep(value, '__typename')
  )
}

export function splitSignature(signature) {
  return utils.splitSignature(signature)
}



export function generateRandomColor(){
  let maxVal = 0xFFFFFF; // 16777215
  let randomNumber = Math.random() * maxVal; 
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);   
  return `#${randColor.toUpperCase()}`
}