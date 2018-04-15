import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Form, FormText } from 'reactstrap';
var config = require("../config.js");

class AddPrayerModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            prayerTitle: '',
            prayerDetail: '',
            account: props.address
        };
    }

    componentWillMount() {
        this.handleAddPrayerButton = this.handleAddPrayerButton.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    async handleAddPrayerButtonold() {
        const result = await this.props.context.drizzle.contracts.ThePrayerContract.addPrayer(this.state.prayerTitle, this.state.prayerDetail).send({from: this.state.account, gas: 650000});
    }

     handleAddPrayerButton() {
        config.prayerContract.addPrayer(this.state.prayerTitle, this.state.prayerDetail, {from: this.state.account, gas: 450000}).catch(function (error) {
            console.error(error);
        }).then(function(result){
            console.log(JSON.stringify(result));
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