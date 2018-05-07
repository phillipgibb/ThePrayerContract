import React from "react";
import { NavItem, Nav } from "reactstrap";

const NavStats = ({ numberOfPrayerMakers, numberOfPrayers }) => {
  return (
    <Nav className="ml-auto">
      <NavItem className="pl-3">
        Prayer Makers: {numberOfPrayerMakers}
      </NavItem>
      <NavItem className="pl-3">
        Prayers: {numberOfPrayers}
      </NavItem>
    </Nav>
  );
};

export default NavStats;