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
            address: 0,
            totalNumberOfPrayerMakers: 0,
        };

        this.toggle = this.toggle.bind(this);
        this.modalPrayerAdded = this.modalPrayerAdded.bind(this);

        // config.prayerContract.totalNumberOfPrayerMakers.call({
        //     from: this.state.address,
        //     gas: 650000
        // }, (error, result) => {
        //     if(!error) {
        //         this.setState({totalNumberOfPrayerMakers : result});
        //     }else {
        //         console.error(error);
        //     }
        // });

    }


    // need to wait for this response!!!!!!!!!!!!!!! or figure out why set state does not update render
    componentWillMount() {
        this.setState({ loading: 'true' });
        config.eth.coinbase((error, coinbase) =>{
            if(!error) {
                console.log('coinbase: ' + coinbase);
                if(coinbase === null) {
                    this.setState({ loading: 'locked' });
                } else {
                    // this.setState({
                    //     address: coinbase
                    // });
                    this.getTotalNumberOfPrayerMakers(coinbase);
                    // Home.setupTestState(this.state.address);
                }
            }else {
                console.error(error);
            }
        });
    }

    getTotalNumberOfPrayerMakers(coinbase){
        let self = this;
        config.prayerContract.getTheNumberOfPrayerMakers((error, result) => {
            if (result[0]) {
                let number = result[0].toNumber(10);
                console.log(number);
                self.setState({
                    loading: 'false',
                    totalNumberOfPrayerMakers : number,
                    address: coinbase
                });
            }else{
                console.error("Error: " + error);
            }
        });
    }

    static setupTestState(address) {
        let Lipsum = require('node-lipsum');
        var lipsum = new Lipsum();
        var lipsumOpts = {
            start: 'yes',
            what: 'bytes',
            amount: 80
        };

        // for (let i = 0; i < 1; i++) {
        //     Home.getTestDetail(lipsum, lipsumOpts).then(function (detail) {
        //         Home.addTestPrayer2("Please Help Account[0] Number [" + i + "]", detail, address, prayerContract);
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


    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    //need to watch for transaction hash??
    modalPrayerAdded = (e) => {
        this.forceUpdate();
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

        if (!config.eth) {
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
                        <Button color="info" onClick={this.toggle}>Submit your Prayer</Button>
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
                        <ListPrayersTable address={this.state.address}/>
                    </Col>

                </Row>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Prayer</ModalHeader>
                    <ModalBody>
                        <AddPrayerModal address={this.state.address} onClose={this.toggle} onAddPrayer={this.modalPrayerAdded}/>
                    </ModalBody>
                </Modal>
            </Container>

        )
    }
}

export default Home
