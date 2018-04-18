const Eth = require('ethjs');
const web3 = require('web3');

// const eth = new Eth(web3.currentProvider);
const PrayerArtifacts = require('../build/contracts/ThePrayerContract.json');

let contractAddress = "0x345ca3e014aaf5dca488057592ee47305d9b3e10";
// let web3 = window.web3;

// let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
// let prayerContract = null;
let eth;
// if (web3 && web3.currentProvider.isMetaMask) {
    //

    // prayerContract = new web3.eth.Contract(PrayerArtifacts.abi, contractAddress);
// } else {
//     console.log('MetaMask account not detected :(');
// }

if (typeof web3 !== 'undefined') {

    // Use Mist/MetaMask's provider
    eth = new Eth(web3.givenProvider);
} else {

    eth = new Eth(new Eth.HttpProvider('ws://localhost:9545'))
}

let prayerContract = eth.contract(PrayerArtifacts.abi, PrayerArtifacts.bytecode).at(contractAddress);

module.exports = {prayerContract, eth};