import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ListGroup, ListGroupItem, Button} from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


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
});

export class ListPrayers extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = props.context.drizzle.contracts;
        this.state = {
            totalNumberOfPrayers: 0,
            prayers: [],
            page: null,
        };

        this.contracts = props.context.drizzle.contracts;
        this.accounts = props.context.drizzle.accounts;
        this.fetchTotalNumberOfPrayersFromContract().then(() => {
            this.fetchPrayers(0);
        });
    }

    onPaginatedSearch = (e) =>
        this.fetchPrayersFromContract(this.state.page + 1);


    async fetchTotalNumberOfPrayersFromContract() {
        let state = this.props.context.drizzle.store.getState();
        let totalNumberOfPrayers = await this.props.context.drizzle.contracts.ThePrayerContract.methods.totalNumberOfPrayers().call({
            from: state.accounts[0],
            gas: 650000
        });
        this.onSetNrOfPrayersResult(totalNumberOfPrayers);
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
                prayerTitle: result[0],
                prayerDetail: result[1],
                prayerTimestamp: result[2]
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

        return (
            <div className="page">
                <List
                    list={this.state.prayers}
                    page={this.state.page}
                    onPaginatedSearch={this.onPaginatedSearch}
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

const List = ({list, page, onPaginatedSearch}) =>
    <div>
        <div>
            <ListGroup>
                {list.map(item =>
                    <ListGroupItem>{item.prayerTitle}</ListGroupItem>)}
            </ListGroup>
        </div>
        <div className="interactions">
        {
            page !== null &&

                //for loop
                //need to calculate nr of max pages
            <Pagination>
            <PaginationItem disabled>
            <PaginationLink previous href="#" />
            </PaginationItem>
            <PaginationItem active>
            <PaginationLink href="#">
            1
            </PaginationLink>
            </PaginationItem>
            <PaginationItem>
            <PaginationLink href="#">
            2
            </PaginationLink>
            </PaginationItem>
            <PaginationItem>
            <PaginationLink href="#">
            3
            </PaginationLink>
            </PaginationItem>
            <PaginationItem>
            <PaginationLink href="#">
            4
            </PaginationLink>
            </PaginationItem>
            <PaginationItem>
            <PaginationLink href="#">
            5
            </PaginationLink>
            </PaginationItem>
            <PaginationItem>
            <PaginationLink next href="#" />
            </PaginationItem>
            </Pagination>
        //     <button
        //     type="button"
        //     onClick={onPaginatedSearch}
        // >
        //     More
        // </button>
    }
    </div>
</div>;

export default ListPrayers;