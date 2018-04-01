import React, {Component} from 'react'
import {ContractData} from 'drizzle-react-components'
import ListPrayers from '../../components/ListPrayers'
import AddPrayerModal from "../../components/AddPrayerModal.js";
import PropTypes from 'prop-types'
import {
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
    constructor(props, context) {
        super(props);
        this.context = context;
        this.state = {modal: false};
        this.toggle = this.toggle.bind(this);
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

        return (
            <Container>
                <h1>The Prayer Contract</h1>
                <h2>The Number of Prayer Makers:{" "}
                    <ContractData
                        contract="ThePrayerContract"
                        method="getTheNumberOfPrayerMakers"
                        methodArgs={[]}
                    /></h2>
                <Row>
                    <Col>
                        <Button color="primary" onClick={this.toggle}>Submit a Prayer</Button>
                    </Col>
                    <Col>
                        <div className="interactions">
                            <Form>
                                <InputGroup>
                                    <Input type="text" ref={node => this.input = node}/>
                                    <InputGroupAddon addonType="append"><Button color="primary"
                                                                                onClick={this.onInitialSearch}>Search</Button></InputGroupAddon>
                                </InputGroup>
                            </Form>
                        </div>
                    </Col>
                </Row>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Prayer</ModalHeader>
                    <ModalBody>
                        <AddPrayerModal context={this.context} onClose={this.toggle}/>
                    </ModalBody>
                </Modal>
                <br/><br/>
                <div>
                    <ListPrayers context={this.context}/>
                </div>
            </Container>

        )
    }

}

Home.contextTypes = {
    drizzle: PropTypes.object
};

export default Home
