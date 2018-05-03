import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../../App.css'

import React, {Component} from 'react'
import ListPrayersTable from '../../components/ListPrayersTable'
import AddPrayerModal from "../../components/AddPrayerModal.js";
import NavbarHeader from "../../components/NavbarHeader.js";
var config = require("../../config.js");

import {
    Alert,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Input,
    Label,
    InputGroup,
    InputGroupAddon,
    Container,
    Row,
    Col
} from 'reactstrap';
import NavStats from '../../components/NavStats';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: 'initial',
            modal: false,
            account: 0x0,
            accountChange: false,
            onlyOwnPrayers: true,
            totalNumberOfPrayerMakers: 0,
            totalNumberOfPrayers: 0,
            pendingPrayers: [{}]
        };

        this.timerId = -1;

        this.toggleAddPrayerModal = this.toggleAddPrayerModal.bind(this);
        this.toggleOnlyPrayersSwitch = this.toggleOnlyPrayersSwitch.bind(this);
        this.modalPrayerAdded = this.modalPrayerAdded.bind(this);
    }

    detectAccount = () => {
        config.web3.eth.getAccounts().then( accounts => {
            this.checkAccount(accounts);
        }).catch(e => { // Error catched if method doesn't exist
            console.log(e);
            const accounts = config.web3.accounts; // We'll try to get accounts from previous versions ( up to Web3 v0.20.x)
            if(accounts){
                this.checkAccount(accounts);
            }
        });
    }

    checkAccount(_accounts){
        if (_accounts.length > 0) {
            this.getTotalNumberOfPrayerMakers(_accounts[0]);
        } else {
            this.setState({loading: 'locked'})
        }
    }

    componentWillUnmount() {
        this.clearDetectAccountsTimer();
    }

    componentWillMount() {
        this.setState({ loading: 'true' });
        this.detectAccount();
        if(this.timerId !== -1){
            this.clearDetectAccountTimer();
        }
        setTimeout(this.setDetectAccountTimer(), 5000);
    }

    setDetectAccountTimer(){
        this.timerId = setInterval(
            () => this.detectAccount(),
            5000
        );
    }

    clearDetectAccountTimer(){
        clearInterval(this.timerId);
    }

    getTotalNumberOfPrayerMakers(_account){
        let self = this;
        config.prayerContract.methods.getTheNumberOfPrayerMakers().call((error, result) => {
            if (result[0]) {
                let number = result[0];
                let accountChanged = self.state.account !== _account
                self.setState({
                    loading: 'false',
                    totalNumberOfPrayerMakers : number,
                    account: _account,
                    accountChange: accountChanged
                });
                self.getTotalNumberOfPrayers();
            }else{
                console.error("Error: " + error);
            }
        });
    }

    getTotalNumberOfPrayers(){
        let self = this;
        config.prayerContract.methods.getTotalNumberOfPrayers().call((error, result) => {
            if (result[0]) {
                let number = result[0];
                self.setState({
                    totalNumberOfPrayers: number
                });
            }else{
                console.error("Error: " + error);
            }
        });
    }

    static setupTestState(account) {
        let Lipsum = require('node-lipsum');
        var lipsum = new Lipsum();
        var lipsumOpts = {
            start: 'yes',
            what: 'bytes',
            amount: 80
        };

        // for (let i = 0; i < 1; i++) {
        //     Home.getTestDetail(lipsum, lipsumOpts).then(function (detail) {
        //         Home.addTestPrayer2("Please Help Account[0] Number [" + i + "]", detail, account, prayerContract);
        //     });
        // }

        // for (let i = 0; i < 2; i++) {
        //     Home.getTestDetail(lipsum, lipsumOpts).then(function (detail) {
        //         Home.addTestPrayer("Please Help Account[1] Number [" + i + "]", detail, state.accounts[1], context.drizzle.contracts.ThePrayerContract);
        //     });
        // }

    }

    static  addTestPrayer(title, detail, account, contract) {
       let promise = contract.methods.addPrayer(title, detail).send({from: account});
        promise.then((result) => {
            console.log('result:', result)
        })
    }

      static addTestPrayer2(title, detail, account, contract) {
         contract.methods.addPrayer(title, detail).send({from: account, gas: 450000}, function(error, result){
             if(!error)
                 console.log(JSON.stringify(result));
             else
                 console.error(error);
         })
      }

    static addTestPrayer3(title, detail, account, contract) {
        contract.methods.addPrayer(title, detail).send({from: account}, function(error, result){
            if(!error)
                console.log(JSON.stringify(result));
            else
                console.error(error);
        })
    }

    static async getTestDetail(lipsum, lipsumOpts) {
        return await this.getLipsum(lipsum, lipsumOpts);
    }

    static getLipsum(lipsum, lipsumOpts) {
        let text = null;
        return new Promise(function(resolve, reject) {
            lipsum.getText(function(res){
                text = res;
                resolve(text);
            }, lipsumOpts);
        });
    }


    toggleAddPrayerModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleOnlyPrayersSwitch() {
        this.setState({
            onlyOwnPrayers: !this.state.onlyOwnPrayers
        });
    }

    //need to watch for transaction hash??
    modalPrayerAdded = (_prayerTitle, _txHash, _txEvent) => {
        let _pendingPrayers = this.state.pendingPrayers.slice(0);
        _pendingPrayers.push({prayerTitle: _prayerTitle, transactionTimestamp: Date(), transactionHash: _txHash, receiptReceived: false, confirms: 0});
        this.setState({pendingPrayers: _pendingPrayers});
        _txEvent.on('receipt', function(receipt){
            console.log(receipt)
            let _pendingPrayers = this.state.pendingPrayers.slice(0);
            let index = _pendingPrayers.findIndex(function(_pendingPrayers){
                _pendingPrayers.transactionHash === receipt.transactionHash;
            })
            _pendingPrayers[index].receiptReceived = true;
            this.setState({pendingPrayers: _pendingPrayers});
        }).on('confirmation', function(confirmNumber, receipt){
            console.log(confirm)
            let _pendingPrayers = this.state.pendingPrayers.slice(0);
            let index = _pendingPrayers.findIndex(function(_pendingPrayers){
                _pendingPrayers.transactionHash === receipt.transactionHash;
            })
            _pendingPrayers[index].confirms = confirmNumber;
            if(confirmNumber >= 3){
                if (index > -1) {
                    _pendingPrayers.splice(index, 1);
                }
            }
            this.setState({pendingPrayers: _pendingPrayers});
        })
    };

    onInitialSearch = (e) => {
        // e.preventDefault();
        // const { value } = this.input;
        // if (value === '') {
        //     return;
        // }
        // this.fetchPrayers(0);

    };

    render() {

        if (!config.web3) {
            return <Alert className="text-center" color="danger">Install or Activate MetaMask</Alert>
        }
        if (this.state.loading === 'locked') {
            return <Alert className="text-center" color="danger">Please unlock your metamask account...</Alert>;
        }

        if (this.state.loading === 'initial') {
            return <Alert className="text-center" color="success">Intializing...</Alert>
        }


        if (this.state.loading === 'true') {
            return <Alert className="text-center" color="info">Loading...</Alert>;
        }
        return (
            <Container fluid>
                <NavbarHeader   toggleAddPrayerModal={this.toggleAddPrayerModal} 
                                toggleOnlyPrayersSwitch={this.toggleOnlyPrayersSwitch}
                                numberOfPrayerMakers={this.state.totalNumberOfPrayerMakers} 
                                numberOfPrayers={this.state.totalNumberOfPrayers}/>
                <Row>
                    <Col>
                        <ListPrayersTable   account={this.state.account} 
                                            accountChange={this.state.accountChange} 
                                            onlyOwnPrayers={this.state.onlyOwnPrayers} 
                                            totalNumberOfPrayers={this.state.totalNumberOfPrayers}/>
                    </Col>
                </Row>
                {/* <Row>
                    <Col>
                        <PendingPrayers pendingPrayers={this.state.pendingPrayers}/>
                    </Col>
                </Row> */}
                <Modal isOpen={this.state.modal} toggle={this.toggleAddPrayerModal}>
                    <ModalHeader toggle={this.toggleAddPrayerModal}>Add Prayer</ModalHeader>
                    <ModalBody>
                        <AddPrayerModal account={this.state.account} onClose={this.toggleAddPrayerModal} onAddPrayer={this.modalPrayerAdded}/>
                    </ModalBody>
                </Modal>
            </Container>

        )
    }
}
//<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
export default Home
