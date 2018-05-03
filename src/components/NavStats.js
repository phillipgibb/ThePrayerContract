import React from "react";
import { NavItem, Nav } from "reactstrap";

const NavStats = ({ numberOfPrayerMakers, numberOfPrayers }) => {
  return (
    <Nav className="ml-auto">
      <NavItem className="pl-3" style={{padding: '5px', border: '2px solid #17a2b8'}}>
        Prayer Makers: {numberOfPrayerMakers}  {' '}  Prayers: {numberOfPrayers}
      </NavItem>
    </Nav>
  );
};

export default NavStats;