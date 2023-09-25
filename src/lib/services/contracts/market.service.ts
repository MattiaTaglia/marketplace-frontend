import { BrowserProvider, Contract, ethers, type EthersError } from "ethers";
import { MARKETABI } from "$lib/abi/market.abi";
import { FetchBasedService } from "../base/fetchBased.service";

export default class MarketService extends FetchBasedService {
  
  marketAddress: string
  
  constructor(params: { fetch: any }, marketAddress: string) {
    super({ fetch: params.fetch })
    this.marketAddress = marketAddress
  }
  
  async convertMaticInUsd (amount: number) {    
    const provider = new ethers.BrowserProvider(window.ethereum)
    const market = new ethers.Contract(this.marketAddress, MARKETABI, provider)

    let weiAmount = ethers.parseEther(amount.toString())
    const convertedValue = await market.convertMaticInUsd(weiAmount)
    const usdValue = Number(ethers.formatEther((Number(convertedValue) / 10 ** 8).toString()))
    console.log(usdValue)

    return usdValue
  }

  async convertMaticInEth (amount: number) { 
    const provider = new ethers.BrowserProvider(window.ethereum)
    const market = new ethers.Contract(this.marketAddress, MARKETABI, provider)

    let weiAmount = ethers.parseEther(amount.toString())
    const convertedValue = await market.convertMaticInEth(weiAmount)
    const ethValue = Number(convertedValue) / 10 ** 44
    console.log(ethValue)

    return ethValue
  }

  async buyShardsWithMatic (amount: number, maticValue: number) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const market = new ethers.Contract(this.marketAddress, MARKETABI, signer)

    console.log(amount)
    const amountToBuy = ethers.parseEther(amount.toString())
    const tx = await market.buyShardsInUsd(amountToBuy, {
      value: ethers.parseEther(maticValue.toString())
    })
    console.log("Sent! 🎉");
    console.log(`TX hash: ${tx.hash}`);
    console.log("Waiting for receipt...");

    //await this.provider.waitForTransaction(tx.hash, 1, 150000).then(() => {});
  }

  async buyShardsWithEth (amount: number, ethValue: number) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const market = new ethers.Contract(this.marketAddress, MARKETABI, signer)

    console.log(amount)
    const amountToBuy = ethers.parseEther(amount.toString())
    const tx = await market.buyShardsInEth(amountToBuy, {
      value: ethers.parseEther(ethValue.toString())
    })
    console.log("Sent! 🎉");
    console.log(`TX hash: ${tx.hash}`);
    console.log("Waiting for receipt...");
    if (!!tx) return true

    //await this.provider.waitForTransaction(tx.hash, 1, 150000).then(() => {});
  }

  async ethWithdraw() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const market = new ethers.Contract(this.marketAddress, MARKETABI, signer)

    const tx = await market.ethWithdraw()
    console.log("Sent! 🎉");
    console.log(`TX hash: ${tx.hash}`);
  }

  async maticWithdraw() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const market = new ethers.Contract(this.marketAddress, MARKETABI, signer)

    const tx = await market.maticWithdraw()
    console.log("Sent! 🎉");
    console.log(`TX hash: ${tx.hash}`);
  }

  async _round2Decimals(x: number | string) {
    return Math.round((Number(x) + Number.EPSILON) * 100) / 100;
  }

  async _round5Decimals(x: number | string) {
    return Math.round((Number(x) + Number.EPSILON) * 100000) / 100000;
  }
}