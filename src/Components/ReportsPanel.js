import React, { Component } from "react";
import { Card, Row, Col } from "react-bootstrap";
//import Chart from "chart.js/auto";
import AlertCountPanel from "./ReportComponents/AlertCountPanel";
import AlertDistributionPanel from "./ReportComponents/AlertDistributionPanel";
import AlertTimelinePanel from "./ReportComponents/AlertTimelinePanel";

class ReportsPanel extends Component {

    render() {
        return (
            <Card className="w-100" text={"white"} bg={"dark"}>
                <Card.Header>
                    <h4>Datos relevantes</h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col><AlertCountPanel alertList={this.props.filteredList} /></Col>
                        <Col><AlertDistributionPanel alertList={this.props.filteredList} /></Col>
                    </Row>
                    <Row>
                        <AlertTimelinePanel alertList={this.props.filteredList} />
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}

export default ReportsPanel;