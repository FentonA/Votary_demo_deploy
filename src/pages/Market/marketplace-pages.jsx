import React, {Component,useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import {ethers} from 'ethers'
import Moralis from "moralis";
import {
  nftmarketaddress, nftaddress
} from '../../config'
import './marketplace.styles.scss'
import Market from '../../ABI/contracts/NFTMarket.json'
import Mint from '../../ABI/contracts/Mint.json'

let rpcEndpoint = null

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

export default function MarketPlace() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {   
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect() 
    const provider = new ethers.providers.JsonRpcProvider(`https://speedy-nodes-nyc.moralis.io/1c9de03c861f345f3331ea16/eth/rinkeby`) 
    const tokenContract = new ethers.Contract(nftaddress, Mint.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const votary = await axios.get(tokenUri)
      console.log(votary)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        video: votary.data.video,
        name: votary.data.name,
        description: votary.data.description,
        thumbnail: votary.data.thumbnail
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="nft-collection">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="nft-collection">
          {
            nfts.map((nft, i) => (
              <div key={i} className="nft-item">
                <img src ={"https://ipfs.moralis.io:2053/"+nft.thumbnail}/>
                <div className="movieInfo">
                  <p >{nft.name}</p>
                  <p className="text-gray-400">{nft.description}</p>

                </div>
                <div className="pricePositions">
                  <p >{nft.price} ETH</p>
                  <button className="buyButton" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}