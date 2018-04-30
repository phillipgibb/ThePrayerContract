# The Prayer Contract

This repo is for a Decentralized Application (dApp) where uses can submit Prayers at only the cost of gas. There after others can join in Prayer by essentially incrementing the prayer count thereby giving an indication of how many times people have payed this prayer. The originator of the prayer can at any time mark the prayer as answered which allows for people to see how long it took to find the answer to this prayer.

* Front end app using [Truffle's](truffleframework.com) [ReactJs](https://reactjs.org/) [ReactStrap](https://reactstrap.github.io/) 

## Getting Started

Running the dApp locally requires a test node that has accounts with ether. The ether will only be for the gas costs. The dApp also assumes a metamask extension in the browser from which the dApp is called.

### Prerequisites

Genache is preferred over testrpc

`Node.Js`, `Truffle`, `Genache-cli`, `npm` or `yarn`


### Installing

```
npm install or yarn install
```

### The Prayer Contract
Firstly open either Ganache GUI or Ganache-cli at port 9545.

To run Ganache-cli

```ganache-cli -p 9545```

To deploy the contracts, use:

```truffle migrate```


### Front end

Then load up the app with

```npm start```


## Running the tests

```npm test```


## Built With


* [Truffle](truffleframework.com) - Tooling suite for Solidity
* [React](https://reactjs.org/) - A front end JS framework for app development
* [ReactStrap](https://reactstrap.github.io/) - Easy to use React Bootstrap 4 components 


## Authors

* **Phillip Gibb** - [Gmail](mailto:phillipgibb@gmail.com?subject=The%20Prayer%20Contract) [ETH Address : 0x61715B3C0DDCA7ED8B3c525C0bDe87d33826698f]

## License

This project is licensed under the GNU License - see the [LICENSE.md](LICENSE.md) file for details
