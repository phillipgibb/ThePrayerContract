import React, {Component} from 'react'
import {Table, Button} from 'reactstrap';
import { Alert, Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import update from 'immutability-helper';
var config = require("../config.js");

var _ = require('lodash');

export class PendingPrayersTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendingPrayers: []
        };

    }

    componentWillReceiveProps(newProps) {
        this.setState({pendingPrayers: newProps.pendingPrayers});
    }

    render() {
        if (this.state.pendingPrayers.length === 0) {
            return <Alert className="text-center" color="success">Nothing Pending...</Alert>;
        }
    

        return (
            <div className="page">
                <List
                    list={this.state.pendingPrayers}
                />
            </div>

        );
    }


}

const List = ({list}) => {
    return (
     <div>
        <div>
            <Table dark striped>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Transaction Hash</th>
                    <th>Receipt</th>
                    <th>Confirms</th>
                </tr>
                </thead>
                <tbody>
                {list.map(function(prayer, index) {
                    return <tr id={prayer.transactionHash} key={prayer.transactionHash}>
                        <td>{index}</td>
                        <td>{prayer.prayerTitle}</td>
                        <td>{prayer.transactionTimestamp}</td>
                        <td><a href={'https://etherscan.io/tx/' + prayer.transactionHash}></a></td>
                        <td>{prayer.receiptReceived?'Yes':'No'}</td>
                        <td>{prayer.confirms > 0?prayer.confirms: <img v-if='pending' id='loader' src='https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif'></img>}</td>
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
