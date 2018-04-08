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
                        (address === prayerMakerAddress && onAnswer) &&
                        <Button onClick={() => onAnswer(prayerMakerAddress, index)}>Prayer Answered</Button>
                    }
                </Col>
                <Col>
                    {
                        onJoin &&
                        <Button onClick={() => onJoin(prayerMakerAddress, index)}>Join in Prayer [{number}]</Button>
                    }
                </Col>
            </Row>

        </Card>
    );
};


export default PrayerWidget;