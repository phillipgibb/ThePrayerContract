import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Form, FormText } from 'reactstrap';
import { prayerContract, web3, account } from "../config.js";

class AddPrayerModal extends Component {

    constructor(props) {
        super(props);
        this.contracts = props.context.drizzle.contracts;
        this.handleAddPrayerButton = this.handleAddPrayerButton.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            prayerTitle: '',
            prayerDetail: ''
        };
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    async handleAddPrayerButtonold() {
        let state = this.props.context.drizzle.store.getState();
        const result = await this.props.context.drizzle.contracts.ThePrayerContract.methods.addPrayer(this.state.prayerTitle, this.state.prayerDetail).send({from: state.accounts[0], gas: 650000});
    }

    static handleAddPrayerButton() {
        prayerContract.methods.addPrayer(this.state.prayerTitle, this.state.prayerDetail).send({from: account, gas: 450000}, function(error, result){
            if(!error)
                console.log(JSON.stringify(result));
            else
                console.error(error);
        })
    }
    render() {
        return (
            <Form>
                <Input name="prayerTitle" type="text" onChange={this.handleInputChange} placeholder="Title" />
                <FormText>A Title that describes the Prayer succinctly.</FormText>
                <Input type="textarea" name="prayerDetail" id="prayerDetail" onChange={this.handleInputChange} />
                <FormText>Add as much information as you would like, but this could incur extra gas costs.</FormText>
                <br/>
                <Button color="primary" onClick={this.handleAddPrayerButton}>Add Prayer</Button> {' '}
                <Button color="primary" onClick={this.close}>Close</Button>
            </Form>
        );
    }
}

AddPrayerModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node,
    drizzle: PropTypes.object
};

export default AddPrayerModal;