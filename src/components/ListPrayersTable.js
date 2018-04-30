import React, {Component} from 'react'
import {Table, Button} from 'reactstrap';
import { Alert, Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import update from 'immutability-helper';
var config = require("../config.js");

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


export class ListPrayersTable extends Component {
    constructor(props) {
        super(props);
        this.handleOnPageinationButton = this.handleOnPageinationButton.bind(this);
        this.handleJoinPrayerButton = this.handleJoinPrayerButton.bind(this);
        this.handleAnswerPrayerButton = this.handleAnswerPrayerButton.bind(this);

        this.state = {
            loading: 'initial',
            totalNumberOfPrayers: 0,
            prayers: [],
            page: null,
            pages: 0,
            prayerIndex: 0,
            account: props.account,
            accountChange: props.accountChange,
            prayerAddress: 0x0,
            onlyOwnPrayers: props.onlyOwnPrayers
        };

    }

    shouldComponentUpdate(){
        return true;
    }

    componentWillReceiveProps(newProps) {
     //   this.setState({onlyOwnPrayers: newProps.onlyOwnPrayers, loading: 'true' });
     this.state.onlyOwnPrayers = newProps.onlyOwnPrayers;
     this.state.accountChange = newProps.accountChange;
     this.state.account = newProps.account;
     if (this.state.loading !== 'true') {
         this.fetchTotalNumberOfPrayersFromContract();
     }
    }

    componentWillMount() {
        this.setState({ loading: 'true' });
        //this.fetchTotalNumberOfPrayersFromContract();
            // .then(() => {
            //     this.fetchPrayers(0);
            // });

    }

    onPaginatedSearch = (e) => {
        this.fetchPrayersFromContract(this.state.page);
    };

    handleOnPageinationButton(newPageNr){
        this.setState({page : newPageNr});
        this.onPaginatedSearch();
    };


    onJoinPrayer = (prayerMakerAddress, index, prayerArrayIndex) => {
        this.incrementPrayerInContract(prayerMakerAddress, index, prayerArrayIndex);
    };

    onAnswerPrayer = (prayerMakerAddress, index) => {
        this.markPrayerAnsweredInContract(prayerMakerAddress, index);
    };

    toDateTime = (secs) => {
        if ( secs === 0 ) {
            return '';
        }
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(parseInt(secs, 10));
        return t.toLocaleDateString('en-GB', { timeZone: 'UTC' });
    };


    handleJoinPrayerButton(address, index, prayerArrayIndex){
        this.setState({prayerAddress : address});
        this.setState({prayerIndex : index});
        this.onJoinPrayer(address, index, prayerArrayIndex);
    };

    handleAnswerPrayerButton(address, index){
        this.setState({prayerAddress : address});
        this.setState({prayerIndex : index});
        this.onAnswerPrayer(address, index);
    };

    incrementPrayerInContract(account, index, prayerArrayIndex) {
        let self = this;
        config.prayerContract.methods.incrementPrayer(account, index).send( {
            from: account,
            gas: 650000
        }).catch(function (error) {
            console.error(error);
        }).then(() => {
            // self.state.prayers[prayerArrayIndex].count++;
            // self.setState({ state: self.state });
            let pList = self.state.prayers;
            let newPrayer = update(pList[prayerArrayIndex], {count: function(x) {return x +1;}});
            pList[prayerArrayIndex] = newPrayer;
            self.setState({prayers: pList});
        }
        );
    }

    markPrayerAnsweredInContract(account, index) {
        let self = this;
        config.prayerContract.methods.answerPrayer(account, index, Date.now()).send( {
            from: account,
            gas: 650000
        }).catch(function (error) {
            console.error(error);
        }).then(() => {
            self.setState(this.state);
        });
    }

      fetchTotalNumberOfPrayersFromContract(){
        let self = this;
        let p;
        if (self.state.onlyOwnPrayers){
            p = config.prayerContract.methods.getTotalNumberOfPrayersByAddress(this.state.account).call(); 
        }else {
            p = config.prayerContract.methods.getTotalNumberOfPrayers().call();
        }
        p.catch(function (error) {
            console.error(error);
        }).then(function(result){
            if (result[0]) {
                let number = result[0];
                self.state.pages = number > 0 ? Math.ceil(number / 10) : 0;
                if (number > 0 && (self.state.totalNumberOfPrayers !== number || self.state.accountChange)) {
                    self.state.totalNumberOfPrayers = number;
                    self.fetchPrayers(0);
                } else if (number === 0) {
                    self.setState({loading: 'empty'})
                }
            }else{
                self.setState({loading: 'empty'})
            }
        });
    };

    fetchPrayersFromContract(page) {

        let from = page * 10;
        let to = from + 10;
        let prayers = [];
        let i = from;
        let self = this;

        for (; i < to && i < this.state.totalNumberOfPrayers; i++) {
            let p;
            if (self.state.onlyOwnPrayers){
                p = config.prayerContract.methods.getPrayerFromAddress(this.state.account, i).call(); 
            }else {
                p = config.prayerContract.methods.getPrayer(i).call();
            }
            p.catch(function (error) {
                console.error(error);
            }).then(function(result){
                console.log(JSON.stringify(result));
                let prayer = {
                    prayerMakerAddress: result[0],
                    index: result[1],
                    count: result[2],
                    prayerTitle: result[3],
                    prayerDetail: result[4],
                    prayerTimestamp: self.toDateTime(result[5]),
                    answeredTimestamp: result[6] !== "0"?self.toDateTime(result[6]):""
                };
                prayers.push(prayer);
                if (prayers.length === Number(self.state.totalNumberOfPrayers)) {
                    self.onSetResult(prayers, page);
                }
                self.setState( {
                    loading: 'false'
                });
               // self.state.loading = 'false'
            });

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
        if (this.state.loading === 'initial') {
            return <Alert className="text-center" color="success">Intializing...</Alert>;
        }
        
        if (this.state.loading === 'true') {
            this.fetchTotalNumberOfPrayersFromContract();
            return <Alert className="text-center" color="info">Loading...</Alert>;
        }

        if (this.state.loading === 'empty') {
            return <Alert className="text-center" color="warning">No prayers currently, add yours and be the first</Alert>;
        }

        return (
            <div className="page">
                <List
                    account={this.state.account}
                    list={this.state.prayers}
                    page={this.state.page}
                    pages={this.state.pages}
                    handleOnPageinationButton={this.handleOnPageinationButton}
                    answerPrayer={this.handleAnswerPrayerButton}
                    joinPrayer={this.handleJoinPrayerButton}
                />
            </div>

        );
    }


}

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

const List = ({account, list, page, pages, handleOnPageinationButton, answerPrayer, joinPrayer}) => {
    return (
     <div>
        <div>
            <Table dark striped>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Answered At</th>
                    <th>Nr of Joins</th>
                    <th>Join</th>
                    <th>Answer</th>
                </tr>
                </thead>
                <tbody>
                {list.map(function(prayer, index) {
                    return <tr id={prayer.prayerMakerAddress+':'+prayer.index} key={prayer.prayerMakerAddress+':'+prayer.index}>
                        <td>{index}</td>
                        <td>{prayer.prayerTitle}</td>
                        <td>{prayer.prayerTimestamp}</td>
                        <td>{prayer.answeredTimestamp}</td>
                        <td>{prayer.count}</td>
                        <td><Button color="info" disabled={(!(prayer.answeredTimestamp === ""))} onClick={() => joinPrayer(prayer.prayerMakerAddress, prayer.index, index)}>Join in Prayer</Button></td>
                        <td><Button color="info" disabled={(!(prayer.answeredTimestamp === "" && prayer.prayerMakerAddress === account))} onClick={() => answerPrayer(prayer.prayerMakerAddress, prayer.index)}>Answer Prayer</Button></td>
                    </tr>
                } )}
                </tbody>
            </Table>
        </div>
        <div className="interactions">
        {
            page !== null && <div><br/><PageButtons noOfPages={pages} handleOnPageinationButton={handleOnPageinationButton} /></div>

        }
        </div>
     </div>)
};

export default ListPrayersTable;
