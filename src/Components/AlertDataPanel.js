import React, { Component } from "react";
import { Table, Accordion, Card, Row, Col } from "react-bootstrap";

import { getClassName } from "../Utils/AlertDataUtils";
import { getVotesCountForAlert } from "../Utils/firebaseAlertManager";
/*
const [alertId, setAlertId] = useState(null);
const [alertType, setAlertType] = useState(null);
const [votesTrue, setVotesTrue] = useState(null);
const [votesFalse, setVotesFalse] = useState(null);
const [coordinates, setCoordinates] = useState(null);
const [location, setLocation] = useState(null);
const [date, setDate] = useState(null);
*/
class AlertDataPanel extends Component {

    state = {
        alertId: null,
        alertType: null,
        votesTrue: null,
        votesFalse: null,
        coordinates: null,
        location: null,
        date: null,
    }

    updateState = (alertData) => {
        //console.log("Updating panel with ", alertData)
        this.setState({
            alertId: alertData.id,
            alertType: getClassName(alertData.classId),
            coordinates: alertData.latitude + "/" + alertData.longitude,
            //date: alertData.date.toDate().toDateString()
            date: alertData.date.toDateString()
        });
        /*
        setAlertId(alertData.alertId);
        setAlertType(getClassName(alertData.classId));
        setCoordinates(alertData.latitude + "/" + alertData.longitude);
        setDate(alertData.date.toDate().toDateString());*/
        //console.log("Sending id ", alertData.id, " for votes");
        getVotesCountForAlert(alertData.id, this.updateVotes);
    }
    updateLocation = (locationText) => {
        //setLocation(locationText);
        this.setState({
            location: locationText
        });
    }
    updateVotes = (trueCount, falseCount) => {
        /*setVotesTrue(trueCount);
        setVotesFalse(falseCount);*/

        var percVotesTrue = trueCount / (trueCount + falseCount) * 100;
        var percVotesFalse = 100 - percVotesTrue;
        if ((trueCount + falseCount) == 0) {
            percVotesTrue = 0;
            percVotesFalse = 0;
        }
        console.log("Percentages:", percVotesTrue, "-", percVotesFalse);
        
        this.setState({
            votesTrue: trueCount,
            votesFalse: falseCount,
            percVotesTrue: percVotesTrue.toFixed(0) + "%",
            percVotesFalse: percVotesFalse.toFixed(0) + "%"
        });
    }

    render() {
        return (
            <Accordion className="w-100" defaultActiveKey="0">
                <Card text={"white"} bg={"dark"}>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <h4>Datos de Alerta Seleccionada</h4>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Dato</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>ID</td>
                                        <td id="txtAlertId">
                                            {this.state.alertId != null ? this.state.alertId : "---"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Tipo</td>
                                        <td id="txtAlertType">
                                            {this.state.alertType != null ? this.state.alertType : "---"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Votos</td>
                                        <td>
                                            <Row>
                                                <Col>
                                                    <span id="txtAlertTrueVotes" style={{ color: "green" }}>
                                                        {this.state.votesTrue != null ? this.state.votesTrue + " V" : "?"}
                                                    </span>
                                                    <span> - </span>
                                                    <span id="txtAlertFalseVotes" style={{ color: "red" }}>
                                                        {this.state.votesFalse != null ? this.state.votesFalse + " F" : "?"}
                                                    </span>
                                                </Col>
                                                <Col>
                                                    <div className="w-100" style={{
                                                        height: "100%",
                                                        padding: "0px"
                                                    }}>
                                                        <div style={{
                                                            backgroundColor: "green",
                                                            height: "100%",
                                                            width: this.state.percVotesTrue != null ? this.state.percVotesTrue : "0px",
                                                            display: "inline-block"
                                                        }} />
                                                        <div style={{
                                                            backgroundColor: "red",
                                                            height: "100%",
                                                            width: this.state.percVotesFalse != null ? this.state.percVotesFalse : "0px",
                                                            display: "inline-block"
                                                        }} />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Lat, Lng</td>
                                        <td id="txtLatLng">
                                            {this.state.coordinates != null ? this.state.coordinates : "---"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ubicacion</td>
                                        <td id="txtLocation">
                                            {this.state.location != null ? this.state.location : "---"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Fecha de Envio</td>
                                        <td id="txtAlertDate">
                                            {this.state.date != null ? this.state.date : "--/--/--"}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
}

export default AlertDataPanel;