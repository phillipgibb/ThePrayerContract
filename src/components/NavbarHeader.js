import React, {Component} from 'react' 
import { Container, Navbar, NavbarBrand, NavbarItem, NavLink, Button, Alert, Form,
    Input,
    Label,
    InputGroup,
    Row,
    Col} from "reactstrap";
import mainLogo from "../../assets/images/praying-hands.svg";
import NavStats from "../components/NavStats.js";

export default class NavbarHeader extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSwitchToggle = this.handleSwitchToggle.bind(this)
    this.state = {
      isOpen: true,
      isSwitchOn: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

    handleSwitchToggle() {
        this.setState({isSwitchOn: !this.state.isSwitchOn});    
        this.props.toggleOnlyPrayersSwitch();
    }

    componentWillReceiveProps(newProps) {

    }

    render() {
    return (
        <Container fluid>
            <Navbar light expand="md">
                <Row style={{flexWrap: 'nowrap', width: '100%', height: '100px', paddingTop: '20px'}}>
                    <Col sm="5">
                       <img src={mainLogo} alt="The Prayer Contract" width='50px'/>{"    "}
                        <NavbarBrand className="text-center">
                            The Prayer Contract - your prayer on the blockchain
                        </NavbarBrand>
                    </Col>
                    <Col sm="2">
                        <Button onClick={this.props.toggleAddPrayerModal}>Submit Prayer</Button>
                    </Col>
                    <Col sm="2">
                        <label className="switchLabel">All Prayers:</label>
                        <label className="switch">
                            <input type="checkbox" onChange={this.handleSwitchToggle} ref={node => this.input = node}/>
                            <span className="slider"></span>
                        </label>
                    </Col>
                    <Col sm="auto">
                        <NavStats numberOfPrayerMakers={this.props.numberOfPrayerMakers} numberOfPrayers={this.props.numberOfPrayers}/>
                    </Col>
          </Row>        
        </Navbar>
      </Container>
    );
  }
}

const ToggleButton = function(props) {
    let classNames = ["toggle-button", (props.isOn) ? "toggle-button_position-right" : "toggle-button_position-left"].join(" ");
    return (<div className={classNames}></div>);
};

