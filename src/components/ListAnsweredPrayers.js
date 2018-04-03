import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ListGroup, ListGroupItem, Button} from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
// import { _ } from 'lodash';
var _ = require('lodash');

const applyUpdateResult = (result, page) => (prevState) => ({
    answeredPrayers: [...prevState, ...result],
    page: page,
});

const applySetResult = (result, page) => (prevState) => ({
    answeredPrayers: result,  //need to add to the list
    page: page,
});

export class ListAnsweredPrayers extends Component {
    constructor(props) {
        super(props);
        this.handleOnPageinationButton = this.handleOnPageinationButton.bind(this);
        this.contracts = props.context.drizzle.contracts;
        this.state = {
            totalNumberOfAnsweredPrayers: 0,
            answeredPrayers: [],
            page: null,
            pages: 0,
        };

        this.contracts = props.context.drizzle.contracts;
        this.accounts = props.context.drizzle.accounts;
        this.fetchTotalNumberOfPrayersFromContract().then(() => {
            this.fetchAnsweredPrayers(0);
        });
    }

    onPaginatedSearch = (e) => {
        this.fetchAnsweredPrayersFromContract(this.state.page);
    };

    handleOnPageinationButton(newPageNr){
        this.state.page = newPageNr;
        this.onPaginatedSearch();
    };

    async fetchTotalNumberOfPrayersFromContract() {
        let state = this.props.context.drizzle.store.getState();
        let totalNumberOfAnsweredPrayers = await this.props.context.drizzle.contracts.ThePrayerContract.methods.totalNumberOfAnsweredPrayers().call({
            from: state.accounts[0],
            gas: 650000
        });
        this.state.totalNumberOfAnsweredPrayers = totalNumberOfAnsweredPrayers;
        this.state.pages = totalNumberOfAnsweredPrayers>0?Math.ceil(totalNumberOfAnsweredPrayers/10):0;
        //this.onSetNrOfPrayersResult(totalNumberOfPrayers);
    }
    //columns to do
    //fetch with most recent
    //fetch in order of popularity
    //fetch most recently answered

    async fetchAnsweredPrayersFromContract(page) {
        let state = this.props.context.drizzle.store.getState();
        let from = page * 10;
        let to = from + 10;
        let answeredPrayers = [];
        // const totalNumberOfPrayers = await this.props.context.drizzle.contracts.ThePrayerContract.methods.totalNumberOfPrayers().call({
        //     from: state.accounts[0],
        //     gas: 650000
        // });
        let i = from;
        for (; i < to && i < this.state.totalNumberOfAnsweredPrayers; i++) {
            const result = await this.props.context.drizzle.contracts.ThePrayerContract.methods.getPrayer(i).call({
                from: state.accounts[0],
                gas: 650000
            });
            let prayer = {
                prayerTitle: result[0],
                prayerDetail: result[1],
                prayerTimestamp: result[2],
                answeredTimestamp: result[3],

            };
            answeredPrayers.push(prayer);
        }
        if (answeredPrayers.length > 0) {
            this.onSetResult(answeredPrayers, page);
        }
    }

    fetchAnsweredPrayers = (page) =>
        this.fetchAnsweredPrayersFromContract(page);
    // .then(result => this.onSetResult(result, page));

    onSetResult = (result, page) =>
        page === 0
            ? this.setState(applySetResult(result, page))
            : this.setState(applyUpdateResult(result, page));

    render() {

        return (
            <div className="page">
                <List
                    list={this.state.answeredPrayers}
                    page={this.state.page}
                    pages={this.state.pages}
                    handleOnPageinationButton={this.handleOnPageinationButton}
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


ListAnsweredPrayers.contextTypes = {
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

const List = ({list, page, pages, handleOnPageinationButton}) =>
     <div>
        <div>
            <ListGroup>
                {list.map(function(name, index) {
                    return <ListGroupItem key={index}>{name.prayerTitle}</ListGroupItem>;
                })}
            </ListGroup>
        </div>
        <div className="interactions">
        {
            page !== null && <div><br/><PageButtons noOfPages={pages} handleOnPageinationButton={handleOnPageinationButton} /></div>

}
    </div>
</div>;

export default ListAnsweredPrayers;
