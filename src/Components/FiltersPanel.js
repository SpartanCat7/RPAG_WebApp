import React, { Component, createRef } from "react";
import { Row, Col, Button, Accordion, Card, Form } from "react-bootstrap";

class FiltersPanel extends Component {

    typeSelector = createRef();
    dateUseCheck = createRef();
    dateMinSelector = createRef();
    dateMaxSelector = createRef();

    state = {
        usingDateFilter: false
    }

    updateMainAlertList() {
        var completeList = this.props.completeList;
        var newList = [];

        window.dateUseCheck = this.dateUseCheck;
        window.dateMinSelector = this.dateMinSelector;
        window.listItem1 = completeList[0];

        completeList.forEach(element => {
            var passesTypeFilter = false;

            var selectedType = this.typeSelector.current.value;
            if (selectedType !== "All") {
                if (element.classId.toString() === selectedType) {
                    passesTypeFilter = true;
                }
            } else {
                passesTypeFilter = true;
            }

            var passesTimeFilter = false;
            if (this.dateUseCheck.current.checked === true && this.dateMinSelector.current.value != "" && this.dateMaxSelector.current.value != "") {
                var minDate = new Date(this.dateMinSelector.current.value);
                var maxDate = new Date(this.dateMaxSelector.current.value);
                maxDate.setDate(maxDate.getDate() + 1);

                //if (element.date.toMillis() >= minDate.getTime() && element.date.toMillis() <= maxDate.getTime()) {
                if (element.date.getTime() >= minDate.getTime() && element.date.getTime() <= maxDate.getTime()) {
                    passesTimeFilter = true;
                }
            } else {
                passesTimeFilter = true;
            }

            if (passesTypeFilter && passesTimeFilter) {
                newList.push(element);
            }
        });

        this.props.listUpdaterMethod(newList);
    }

    render() {
        return (
            <Card text={"white"} bg={"dark"}>
                <Card.Header>
                    <h4>Filtros</h4>
                </Card.Header>
                <Card.Body>
                    <Accordion defaultActiveKey="0">
                        <Card bg={"dark"}>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                <h5>Tipos de Alerta</h5>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Form.Control as="select" ref={this.typeSelector} custom>
                                        <option value="All" >Todos</option>
                                        <option value="1" >Accidente</option>
                                        <option value="2" >Incendio</option>
                                        <option value="3" >Persona Herida</option>
                                        <option value="4" >Bloqueo</option>
                                        <option value="5" >Trafico</option>
                                        <option value="6" >Manifestaciones</option>
                                        <option value="7" >Calle Dañada</option>
                                        <option value="8" >Corte Electrico</option>
                                    </Form.Control>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card bg={"dark"}>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                                <h5>Tiempo de Suceso</h5>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Form>
                                        <Form.Group className="text-center">
                                            <Form.Check
                                                type="checkbox"
                                                ref={this.dateUseCheck}
                                                id="chkDateFilter" label="Aplicar filtro de fecha" custom
                                                onChange={() => {
                                                    this.setState({ usingDateFilter: this.dateUseCheck.current.checked })
                                                }} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Row>
                                                <Col className="text-center"><Form.Label>Start date:</Form.Label></Col>
                                                <Col>
                                                    <input className="w-100"
                                                        ref={this.dateMinSelector}
                                                        type="date" id="startDate" name="startDate"
                                                        disabled={!this.state.usingDateFilter} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="text-center"><Form.Label>End date:</Form.Label></Col>
                                                <Col>
                                                    <input className="w-100"
                                                        ref={this.dateMaxSelector}
                                                        type="date" id="endDate" name="endDate"
                                                        disabled={!this.state.usingDateFilter} />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Card.Body>
                <Card.Body className="text-center">
                    <Button onClick={() => { this.updateMainAlertList() }}>Recargar mapa</Button>
                </Card.Body>
            </Card>
        )
    }
}

export default FiltersPanel;