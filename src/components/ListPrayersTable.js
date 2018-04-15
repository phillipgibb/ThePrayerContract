import React, {Component} from 'react'
import {Table, Button} from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink} from 'reactstrap';
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
            prayerAddress: 0x0,
            prayerIndex: 0,
            address: props.address
        };

    }

    componentWillMount() {
        this.setState({ loading: 'true' });
        this.fetchTotalNumberOfPrayersFromContract();
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


    onJoinPrayer = (e) => {
        this.incrementPrayerInContract(this.state.prayerAddress, this.state.prayerIndex);
    };

    onAnswerPrayer = (e) => {
        this.markPrayerAnsweredInContract(this.state.prayerAddress, this.state.prayerIndex);
    };

    toDateTime(secs) {
        if ( secs === "0" ) {
            return '';
        }
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(parseInt(secs, 10));
        return t.toLocaleDateString('en-GB', { timeZone: 'UTC' });
    }


    handleJoinPrayerButton(address, index){
        this.setState({prayerAddress : address});
        this.setState({prayerIndex : index});
        this.onJoinPrayer();
    };

    handleAnswerPrayerButton(address, index){
        this.setState({prayerAddress : address});
        this.setState({prayerIndex : index});
        this.onAnswerPrayer();
    };

    async incrementPrayerInContract(address, index) {
        let account = this.state.address;
        await config.prayerContract.methods.incrementPrayer(address, index).send({
            from: account,
            gas: 650000
        });
    }

    async markPrayerAnsweredInContract(address, index) {
        let account = this.state.address;
        await config.prayerContract.methods.answerPrayer(address, index).send({
            from: account,
            gas: 650000
        });
    }

      fetchTotalNumberOfPrayersFromContract(){
        let account = this.state.address;
        let self = this;
        config.prayerContract.getTotalNumberOfPrayers().then(function(result){
            if (result[0]) {
                let number = result[0].toNumber(10);
                console.log(number);
                self.state.totalNumberOfPrayers = number;
                self.state.pages = number > 0 ? Math.ceil(number / 10) : 0;
                self.fetchPrayers(0);
            }else{
                console.error("Error");
            }
        });

        //this.onSetNrOfPrayersResult(totalNumberOfPrayers);
    };

//     simpleStore.get().catch((error) => {
//     // error null
// }).then(result) => {
//     // result <BigNumber ...>
// });
    //columns to do
    //fetch with most recent
    //fetch in order of popularity
    //fetch most recently answered

    async fetchPrayersFromContract(page) {
        let account = this.state.address;
        let from = page * 10;
        let to = from + 10;
        let prayers = [];
        // const totalNumberOfPrayers = await this.props.context.drizzle.contracts.ThePrayerContract.methods.totalNumberOfPrayers().call({
        //     from: state.accounts[0],
        //     gas: 650000
        // });
        let i = from;
        for (; i < to && i < this.state.totalNumberOfPrayers; i++) {
            const result = await config.prayerContract.methods.getPrayer(i).call({
                from: account,
                gas: 650000
            }, function(error, result){
                if(!error)
                    console.log(JSON.stringify(result));
                else
                    console.error(error);
            });
            let prayer = {
                prayerMakerAddress: result[0],
                index: result[1],
                count: result[2],
                prayerTitle: result[3],
                prayerDetail: result[4],
                prayerTimestamp: this.toDateTime(result[5]),
                answeredTimestamp: this.toDateTime(result[6])

            };
            // if (prayer.answeredTimestamp === "0") {
                prayers.push(prayer);
            // }
        }
        if (prayers.length > 0) {
            this.onSetResult(prayers, page);
        }
        this.setState( {
            loading: 'false'
        });
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
            return <h2>Intializing...</h2>;
        }
        if (this.state.loading === 'true') {
            return <h2>Loading...</h2>;
        }

        return (
            <div className="page">
                <List
                    address={this.state.address}
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

const List = ({address, list, page, pages, handleOnPageinationButton, answerPrayer, joinPrayer}) => {
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
                        <td><Button color="info" active={prayer.prayerMakerAddress === address} onClick={() => joinPrayer(prayer.prayerMakerAddress, prayer.index)}>Join in Prayer</Button></td>
                        <td><Button color="info" onClick={() => answerPrayer(prayer.prayerMakerAddress, prayer.index)}>Answer Prayer</Button></td>

                    </tr>
                })}
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
