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
            totalNumberOfPrayers: 0,
        };

        this.toggle = this.toggle.bind(this);


        // config.prayerContract.totalNumberOfPrayers.call({
        //     from: this.state.address,
        //     gas: 650000
        // }, (error, result) => {
        //     if(!error) {
        //         this.setState({totalNumberOfPrayers : result});
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
                this.setState( {
                    address : coinbase,
                    loading: 'false'
                });
                // Home.setupTestState(this.state.address);
            }else {
                console.error(error);
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

    onInitialSearch = (e) => {
        // e.preventDefault();
        // const { value } = this.input;
        // if (value === '') {
        //     return;
        // }
        // this.fetchPrayers(0);

    };

    render() {

        if (this.state.loading === 'initial') {
            return <h2>Intializing...</h2>;
        }


        if (this.state.loading === 'true') {
            return <h2>Loading...</h2>;
        }
        return (
            <Container>
                <h1 className="text-center">The Prayer Contract</h1>
                <h2 className="text-center">Your Prayer on the Blockchain</h2>
                <Row>
                    <Col sm={{ size: 6, order: 2, offset: 3 }}>
                        <Alert className="text-center" color="success">
                            The Number of Prayer Makers:{" "}
                            {this.state.totalNumberOfPrayers}
                        </Alert>
                    </Col>
                </Row>
                <Row className="justify-content-md-center" >
                    <Col sm="3" >
                        <Button color="info" onClick={this.toggle}>Submit your Prayer</Button>
                    </Col>
                    <Col sm="3">
                        {/*<div className="interactions">*/}
                            <Form>
                                <InputGroup>
                                    <Input type="text" ref={node => this.input = node}/>
                                    <InputGroupAddon addonType="append"><Button color="info"
                                                                                onClick={this.onInitialSearch}>Search</Button></InputGroupAddon>
                                </InputGroup>
                            </Form>
                        {/*</div>*/}
                    </Col>
                </Row>
                <Row>
                    <Col><Alert className="text-center" color="success">The Prayer List</Alert></Col>
                 </Row>
                <Row>
                    <Col>
                        <ListPrayersTable address={this.state.address}/>
                    </Col>

                </Row>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Prayer</ModalHeader>
                    <ModalBody>
                        <AddPrayerModal address={this.state.address} onClose={this.toggle}/>
                    </ModalBody>
                </Modal>
            </Container>

        )
    }
}

export default Home
