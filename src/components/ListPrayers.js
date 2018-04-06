import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ListGroup, ListGroupItem, Button} from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink, Row, Col, Alert } from 'reactstrap';
import PrayerWidget from "./widget/PrayerWidget";

// import { _ } from 'lodash';
var _ = require('lodash');

const applyUpdateResult = (result, page) => (prevState) => ({
    prayers: [...prevState, ...result],
    page: page,
});

const applySetResult = (result, page) => (prevState) => ({
    prayers: result,  //need to add to the list
    page: page,
});

const applySetResultNrOfPrayers = (totalNumberOfPrayers) => (prevState) => ({
    totalNumberOfPrayers: totalNumberOfPrayers,
    pages: totalNumberOfPrayers>0?Math.ceil(totalNumberOfPrayers/10):0,
});

export class ListPrayers extends Component {
    constructor(props) {
        super(props);
        this.handleOnPageinationButton = this.handleOnPageinationButton.bind(this);
        this.handleIncrementPrayerButton = this.handleIncrementPrayerButton.bind(this);

        this.contracts = props.context.drizzle.contracts;
        this.state = {
            totalNumberOfPrayers: 0,
            prayers: [],
            page: null,
            pages: 0,
            prayerAddress: 0x0,
            prayerIndex: 0
        };

        this.contracts = props.context.drizzle.contracts;
        this.accounts = props.context.drizzle.accounts;
        this.fetchTotalNumberOfPrayersFromContract().then(() => {
            this.fetchPrayers(0);
        });
    }

    onPaginatedSearch = (e) => {
        this.fetchPrayersFromContract(this.state.page);
    };

    handleOnPageinationButton(newPageNr){
        this.state.page = newPageNr;
        this.onPaginatedSearch();
    };


    onIncrementPrayer = (e) => {
        this.incrementPrayersInContract(this.state.prayerAddress, this.state.prayerIndex);
    };

    handleIncrementPrayerButton(address, index){
        this.state.prayerAddress = address;
        this.state.prayerIndex = index;
        this.onIncrementPrayer();
    };


    async incrementPrayersInContract(address, index) {
        let state = this.props.context.drizzle.store.getState();
        await this.props.context.drizzle.contracts.ThePrayerContract.methods.incrementPrayer(address, index).send({
            from: state.accounts[0],
            gas: 650000
        });
    }

    async fetchTotalNumberOfPrayersFromContract() {
        let state = this.props.context.drizzle.store.getState();
        let totalNumberOfPrayers = await this.props.context.drizzle.contracts.ThePrayerContract.methods.totalNumberOfPrayers().call({
            from: state.accounts[0],
            gas: 650000
        });
        this.state.totalNumberOfPrayers = totalNumberOfPrayers;
        this.state.pages = totalNumberOfPrayers>0?Math.ceil(totalNumberOfPrayers/10):0;
        //this.onSetNrOfPrayersResult(totalNumberOfPrayers);
    }
    //columns to do
    //fetch with most recent
    //fetch in order of popularity
    //fetch most recently answered

    async fetchPrayersFromContract(page) {
        let state = this.props.context.drizzle.store.getState();
        let from = page * 10;
        let to = from + 10;
        let prayers = [];
        // const totalNumberOfPrayers = await this.props.context.drizzle.contracts.ThePrayerContract.methods.totalNumberOfPrayers().call({
        //     from: state.accounts[0],
        //     gas: 650000
        // });
        let i = from;
        for (; i < to && i < this.state.totalNumberOfPrayers; i++) {
            const result = await this.props.context.drizzle.contracts.ThePrayerContract.methods.getPrayer(i).call({
                from: state.accounts[0],
                gas: 650000
            });
            let prayer = {
                prayerMakerAddress: result[0],
                index: result[1],
                count: result[2],
                prayerTitle: result[3],
                prayerDetail: result[4],
                prayerTimestamp: result[5]
            };
            prayers.push(prayer);
        }
        if (prayers.length > 0) {
            this.onSetResult(prayers, page);
        }
    }

    fetchPrayers = (page) =>
        this.fetchPrayersFromContract(page);
    // .then(result => this.onSetResult(result, page));

    onSetResult = (result, page) =>
        page === 0
            ? this.setState(applySetResult(result, page))
            : this.setState(applyUpdateResult(result, page));

    onSetNrOfPrayersResult = (nrOfPrayers) =>
        this.setState(applySetResultNrOfPrayers(nrOfPrayers));

    render() {
        let state = this.props.context.drizzle.store.getState();
        return (
            <div className="page">
                <List
                    address={state.accounts[0]}
                    list={this.state.prayers}
                    page={this.state.page}
                    pages={this.state.pages}
                    handleOnPageinationButton={this.handleOnPageinationButton}
                    incrementPrayer={this.handleIncrementPrayerButton}
                />
            </div>

        );
    }


}

// const mapStateToProps = state => {
//     return {
//         accounts: state.accounts,
//         drizzleStatus: state.drizzleStatus,
//         ThePrayerContract: state.contracts.ThePrayerContract
//     };
// };


ListPrayers.contextTypes = {
    drizzle: PropTypes.object
};


let PageButtons = React.createClass({
    render: function() {

        let pageItems = _.range(0, this.props.noOfPages).map(i => { return { id: i, name: 'Item ' + i }; });
        return (
            <Pagination>
                {pageItems.map(item =>
                        <PaginationItem key={item.id}>
                            <PaginationLink onClick={() => this.props.handleOnPageinationButton(item.id)}>{item.id}</PaginationLink>
                        </PaginationItem>
                    ,this
                )}
            </Pagination>
        );
    }
});

const List = ({address, list, page, pages, handleOnPageinationButton, incrementPrayer}) => {
    return (
     <div>
        <div>
            <ListGroup>
                {list.map(function(prayer) {
                    return <ListGroupItem color="primary" id={"Tooltip-" + prayer.prayerMakerAddress+prayer.index} key={prayer.prayerMakerAddress+prayer.index}>
                        <PrayerWidget address={address} title={prayer.prayerTitle} detail={prayer.prayerDetail} number={prayer.count} index={prayer.index} prayerMakerAddress={prayer.prayerMakerAddress} onClick={incrementPrayer}/>
                    </ListGroupItem>
                })}
            </ListGroup>
        </div>
        <div className="interactions">
        {
            page !== null && <div><br/><PageButtons noOfPages={pages} handleOnPageinationButton={handleOnPageinationButton} /></div>

        }
        </div>
     </div>)
};

export default ListPrayers;
