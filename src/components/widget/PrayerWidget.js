import React, {Component} from 'react';

import { Card, CardText, CardTitle, Button, Alert } from 'reactstrap';
import { Col, Row } from 'reactstrap';

const PrayerWidget = ({
                          address,
                          title,
                          detail,
                          number,
                          prayerMakerAddress,
                          index,
                          onAnswer,
                          onJoin,
                          ...restProps
                      }) => {
    return (
        <Card body {...restProps} className="text-center">
            <CardTitle className={`text-primary`} style={{textDecoration:`underline`}}>{title}</CardTitle>
            <Alert tag="div" color="primary">{detail}</Alert>
            <Row>
                <Col>
                    {
                    address == prayerMakerAddress &&
                        <Button onClick={() => onAnswer(prayerMakerAddress, index)}>Answer Prayer</Button>
                    }
                </Col>
                <Col>
                    <Button onClick={() => onJoin(prayerMakerAddress, index)}>Join Prayer [{number}]</Button>
                </Col>
            </Row>

        </Card>
    );
};


export default PrayerWidget;