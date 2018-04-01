import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom';
import { Drizzle, generateStore } from 'drizzle'

export class AddPrayerForm extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      prayerTitle: 'title',
      prayerDetail: 'detail'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = context.drizzle.contracts;
    this.accounts = context.drizzle.accounts;
  }

  handleChange(event) {
    this.setState({prayerTitle: event.target.prayerTitle, prayerDetail: event.target.prayerDetail});
  }

  handleSubmit(event) {
    const stackId = this.contracts.ThePrayerContract.methods.addPrayer.cacheSend('ssddd', 'sdsd', {from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'});
  }

  render() {
    const { drizzleStatus, accounts } = this.props;
    
    const options = {
      contracts: [
        this.contracts.ThePrayerContract
      ]
    }
    const drizzleStore = generateStore(options)
    const drizzle = new Drizzle(options, drizzleStore)

    var state = drizzle.store.getState()
    const stackId = drizzle.options.contracts[0].methods.addPrayer.cacheSend('ssddd', 'sdsd', {from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'});
     if (state.transactionStack[stackId]) {
       const txHash = state.trasnactionStack[stackId];
      console.log("Status = " +  state.transactions[txHash].status);
     }
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" name="Prayer Title" />
        </label>
        <label>
          Essay:
          <textarea onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    ThePrayerContract: state.contracts.ThePrayerContract
  };
};

AddPrayerForm.contextTypes = {
  drizzle: PropTypes.object
};

const AddPrayerFormContainer = drizzleConnect(AddPrayerForm, mapStateToProps);
export default AddPrayerFormContainer;
