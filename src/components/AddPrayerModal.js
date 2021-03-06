import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Form, FormText } from 'reactstrap';
var config = require("../config.js");

class AddPrayerModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingPrayer: false,
            prayerTitle: '',
            prayerDetail: '',
            account: props.account
        };
    }

    componentWillMount() {
        this.handleAddPrayerButton = this.handleAddPrayerButton.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

     handleAddPrayerButton() {
        let self = this;
         self.setState({loadingPrayer: true});
         let addPrayerEvent = config.prayerContract.methods
         .addPrayer(this.state.prayerTitle, this.state.prayerDetail, Date.now())
         .send( {from: this.state.account, gas: 450000})
         .on('transactionHash', function(hash){
            self.props.onAddPrayer(self.state.prayerTitle, hash, this);
            self.setState({loadingPrayer: false});
        }).catch(function (error) {
            console.error(error);
            self.setState({loadingPrayer: false});
         })
         console.log("addPrayerEvent : "+addPrayerEvent)
         
    }
    render() {
        return (
            <Form>
                <Input name="prayerTitle" type="text" onChange={this.handleInputChange} placeholder="Title" />
                <FormText>A Title that describes the Prayer succinctly.</FormText>
                <Input type="textarea" name="prayerDetail" id="prayerDetail" onChange={this.handleInputChange} />
                <FormText>Add as much information as you would like, but this could incur extra gas costs.</FormText>
                <br/>
                <Button color="info" disabled={(this.state.loadingPrayer)} onClick={this.handleAddPrayerButton}>{(this.state.loadingPrayer)?'Adding ...':'Add Prayer'}</Button> {' '}
                <Button color="info" onClick={this.close}>Close</Button>
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