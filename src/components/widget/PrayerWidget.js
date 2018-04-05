import React from 'react';

import { Card, CardText, CardTitle, Button, Alert } from 'reactstrap';

const PrayerWidget = ({
                          title,
                          detail,
                          number,
                          address,
                          index,
                          onClick,
                          ...restProps
                      }) => {
    return (
        <Card body {...restProps} className="text-center">
            <CardTitle className={`text-primary`} style={{textDecoration:`underline`}}>{title}</CardTitle>
            <Alert tag="div" color="primary">{detail}</Alert>
            <Button onClick={() => onClick(address, index)}>Add to this Prayer [{number}]</Button>
        </Card>
    );
};


export default PrayerWidget;