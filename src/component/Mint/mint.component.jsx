import React, {Component, useState} from 'react';
import {ethers} from 'ethers'
import Moralis from "moralis";
import Market from '../../ABI/contracts/NFTMarket.json'
import Mint from '../../ABI/contracts/Mint.json'
import Web3Modal from 'web3modal'
import './mint.styles.scss'

import {
    nftaddress, nftmarketaddress
  } from '../../config'

class MintTokens extends Component{
    constructor(props){
        super(props);

        this.state={
            name: '',
            description:'',
            price:'',
            thumbnail: '',
            video:null
        }
    }
    onChangeHandler = (event) => {
        this.setState({
            video: event.target.files[0],
            loaded: 0,
        });
    };
    onChangeImage = (event) => {
        this.setState({
            thumbnail: event.target.files[0],
            loaded: 0,
        });
    };
    mintNft = async (url, nftPrice) => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)    
        const signer = provider.getSigner()
        
        /* next, create the item */
        let contract = new ethers.Contract(nftaddress, Mint.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()
        console.log(tx)
        let event = tx.events[0]
        let value = event.args[2] 
        let tokenId = value.toNumber()
        const price = ethers.utils.parseUnits(nftPrice, 'ether')
      
        /* then list the item for sale on the marketplace */
        let contract2 = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract2.getListingPrice()
        listingPrice = listingPrice.toString()
    
        transaction = await contract2.createMarketItem(nftaddress, tokenId, price, { value: listingPrice})
        await transaction.wait()
        // router.push('/')
    } 
        handleSubmit = async event =>{
            let user = Moralis.User.current()
            event.preventDefault()
            const {name, description, video, price, thumbnail} = this.state
            const vid = new Moralis.File(video.name, video)
            const thumn = new Moralis.File(thumbnail.name, thumbnail)
            try{
                await vid.saveIPFS()
                let vidHash = vid.hash()
                await thumn.saveIPFS()
                let thumnHash = thumn.hash()
                let metadata = {
                    name:name,
                    description: description,
                    thumbnail: "/ipfs/" + thumnHash,
                    video: "/ipfs/" + vidHash 
                }
    
                console.log(metadata)
                const jsonFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
                await jsonFile.saveIPFS()
                console.log(jsonFile.ipfs())
                this.mintNft(jsonFile.ipfs(), price)
                let metadataHash = jsonFile.hash()
                console.log(metadataHash)
            } catch(err){
                console.log(err)
            }

        }
       
        handleChange = event =>{
            const {name, value} = event.target;
    
            this.setState({ [name]: value});
        }
    render(){
        const {name, description, video} = this.state
        return (
            <div >
            <div >
                <div className="mint-title">Mint Video</div>
                <form onSubmit={this.handleSubmit} >
                    <div >
                    <input className="input-style" name ="name" type="text"  onChange={this.handleChange} placeholder="Token name"></input>
                    </div>
                    <div >
                    <input name="description" type="text"  onChange={this.handleChange} placeholder="Description"></input>
                    </div>
                    <div >
                    <input name="price" type="number"  onChange={this.handleChange} placeholder="ETH" ></input>
                    </div>
                    <div className="upload">
                        <div className >
                            <p className="upload-directive">Thumbnail</p>
                            <input name="thumbnail" type="file"  onChange={this.onChangeImage} placeholder="Thumbnail"></input>
                        </div>
                        <div className>
                            <p className="upload-directive">Video file</p>
                            <input type="file"  onChange={this.onChangeHandler} name="image" accept="video/*"></input>
                        </div>
                    </div>
                    <div >
                    <button >Submit</button>
                    </div>
                </form>
            </div>
        </div>
        )
    }   
    
}

export default MintTokens;