import React, { Component } from 'react'
import { ContractData } from 'drizzle-react-components'
import PropTypes from 'prop-types'
import ListPrayers from '../../components/ListPrayers'



class Home extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.handleAddPrayerButton = this.handleAddPrayerButton.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            prayerTitle: '',
            prayerDetail: ''
        };

    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    async handleAddPrayerButton() {
        let state = this.context.drizzle.store.getState();
        // let dc = DrizzleContract(this.context.drizzle.contracts.ThePrayerContract);
        // dc.options({
        //     from: this.props.accounts[0],
        //     gas: 4712388,
        //     gasPrice: 100000000000
        // });

        // Declare this transaction to be observed. We'll receive the stackId for reference.
        const result = await this.context.drizzle.contracts.ThePrayerContract.methods.addPrayer(this.state.prayerTitle, this.state.prayerDetail).send({from: state.accounts[0], gas: 650000});
        //     .then(
        //     txResult => function(error, txResult){
        //         console.log(txResult);
        //     }
        // );

    }
  render() {
      // let state = this.context.drizzle.store.getState();
      // let key = this.contracts.ThePrayerContract.methods.getTheNumberOfPrayerMakers.cacheCall([]);
      // let theNoOfPrayerMakers = state.contracts.ThePrayerContract.methods.getTheNumberOfPrayerMakers[key].value;

      return (
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>The Prayer Contract</h1>
                <h2>The Number of Prayer Makers:{" "}
                <ContractData
                  contract="ThePrayerContract"
                  method="getTheNumberOfPrayerMakers"
                  methodArgs={[]}
                /></h2>
                <h3>Add Prayer</h3>

              <div className="App-intro">
                  <form className="pure-form pure-form-stacked">
                      <input name="prayerTitle" type="text" onChange={this.handleInputChange} placeholder="Title" />
                      <textarea name="prayerDetail" type="text" onChange={this.handleInputChange} placeholder="Detail" />
                      <button className="pure-button" type="button" onClick={this.handleAddPrayerButton}>Add Prayer</button>
                  </form>
              </div>
            </div>
            <br/><br/>
        </div>
            <div>
                <ListPrayers/>
            </div>
        </main>
      )
  }
     // getNumberOfPrayerMakers() {
     //     return this.contracts.ThePrayerContract.methods.getNumberOfPrayerMakers.data();

         // let state = this.context.drizzle.store.getState();

// If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
//         if (state.drizzleStatus.initialized) {
            // Declare this call to be cached and synchronized. We'll receive the store key for recall.
            // return this.contracts.ThePrayerContract.methods.getNumberOfPrayerMakers().call();
            // return await this.context.drizzle.contracts.ThePrayerContract.methods.getNumberOfPrayerMakers().call({from: state.accounts[0]});


            // this.context.drizzle.contracts.ThePrayerContract.methods.getNumberOfPrayerMakers.cacheCall();
                // .then(function(result){
                //     console.log("Number : " + result);
                //     return result;
                // }).done();
            // .then( function(result){
            //     console.log("Number : " + result);
            // }).done();


            // Promise.resolve(this.contracts.ThePrayerContract.methods.getNumberOfPrayerMakers.cacheCall()).then(_number => function(_number){
            //         console.log("Number : " + _number);
            //         return _number;
            //     }).catch(function (error) {
            //         console.log("error : " + error);
            //         return 0;
            //     });

            // }
            // let no = this.contracts.ThePrayerContract.methods.getNumberOfPrayerMakers.cacheCall();
            // console.log("Returning = " + no);
            // return no;

    // }
}

Home.contextTypes = {
    drizzle: PropTypes.object
};

export default Home
