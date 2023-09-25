import Cookies from "js-cookie";
import { FetchBasedService } from "../base/fetchBased.service"
import { browser } from "$app/environment";
import userForm, { type User } from "$lib/stores/users/userForm";
import { ethers } from "ethers";

export default class AuthService extends FetchBasedService {

  constructor(params: { fetch: any }) {
    super({ fetch: params.fetch })
  }


  walletAddressCookiePresent(): boolean {
    return browser && !!Cookies.get(this.cookieWalletAddress)
  }

  walletAddressCookie(): string|undefined {
    return Cookies.get(this.cookieWalletAddress)
  }

  async setUser() {
    if (browser && this.walletAddressCookiePresent()) {
      userForm.set({
        user: {
          address: this.walletAddressCookie(),
        },
        userValid: true
      })
    }
  }

  async loginWithMetamask() {

    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
        .catch((error: any) => {
          if (error.code === 4001) {
            alert("Please connect to MetaMask.")
            return;
          } else {
            console.error(error);
            return;
          }
        })

      console.log(accounts)

      if (accounts.length > 0) {
        let expired_at: Date = new Date();
        Cookies.set(this.cookieWalletAddress, accounts[0], {
          expires: expired_at.setDate(expired_at.getDate() + 1),
          sameSite: 'strict'
        })

        await this.setUser()

/*         const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(this.cookieWalletAddress)
        console.log(balance) */

        return {
          data: {
            address: this.cookieWalletAddress,
            name: ''
          }
        }
      } else {
        alert('No accounts found');
        return {
          data: {
            address: '',
            name: ''
          }
        }
      }
    } else {
      alert('No ethereum wallet found');
      return {
        data: {
          address: '',
          name: ''
        }
      }
    }
  }
}