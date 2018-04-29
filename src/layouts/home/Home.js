import React, {Component} from 'react'
import ListPrayersTable from '../../components/ListPrayersTable'
import AddPrayerModal from "../../components/AddPrayerModal.js";
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


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: 'initial',
            modal: false,
            account: 0x0,
            totalNumberOfPrayerMakers: 0,
            onlyOwnPrayers: false
        };

        this.timerId = -1;

        this.toggleAddPrayerModal = this.toggleAddPrayerModal.bind(this);
        this.modalPrayerAdded = this.modalPrayerAdded.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
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
                self.setState({
                    loading: 'false',
                    totalNumberOfPrayerMakers : number,
                    account: _account
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

    //need to watch for transaction hash??
    modalPrayerAdded = (e) => {
        this.forceUpdate();
    };
    
    toggleCheckbox() {
        this.setState({
            onlyOwnPrayers: !this.state.onlyOwnPrayers
        });
    }

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
            <Container>
                <h1 className="text-center">The Prayer Contract</h1>
                <h2 className="text-center">Your Prayer on the Blockchain</h2>
                <Row>
                    <Col sm={{ size: 6, order: 2, offset: 3 }}>
                        <Alert className="text-center" color="success">
                            The Number of Prayer Makers:{" "}
                            {this.state.totalNumberOfPrayerMakers}
                        </Alert>
                    </Col>
                </Row>
                <Row className="pb-sm-3 justify-content-center" >
                    <Col sm="3" className="align-items-sm-center" >
                        <Button color="info" onClick={this.toggleAddPrayerModal}>Submit your Prayer</Button>
                    </Col>
                    <Col sm="3">
                        <div className="align-items-sm-center interactions">
                        <Alert className="text-center" color="success">
                            <Form>
                                <InputGroup>
                                    <Label check>
                                     <Input type="checkbox" onChange={this.toggleCheckbox} ref={node => this.input = node}/> {' '}
                                        Only List Own Prayers
                                     </Label>
                                </InputGroup>
                            </Form>
                            </Alert>
                        </div>
                    </Col>
                    <Col sm="3">
                        <div className="align-items-sm-center interactions">
                            <Form>
                                <InputGroup>
                                    <Input type="text" ref={node => this.input = node}/>
                                    <InputGroupAddon addonType="append"><Button color="info"
                                                                                onClick={this.onInitialSearch}>Search</Button></InputGroupAddon>
                                </InputGroup>
                            </Form>
                        </div>
                    </Col>
                </Row>
                <Row  className="justify-content-sm-center">
                    <Col sm={{ size: 6, order: 2 }}><Alert className="text-center" color="success">The Prayer List</Alert></Col>
                 </Row>
                <Row>
                    <Col>
                        <ListPrayersTable account={this.state.account} onlyOwnPrayers={this.state.onlyOwnPrayers} />
                    </Col>

                </Row>

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

export default Home
