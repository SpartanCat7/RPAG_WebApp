import React, { Component } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";

class DataDownloadPanel extends Component {

    downloadJson(filtered) {
        var alertList = null;
        if (filtered) {
            alertList = this.props.completeList;
        } else {
            alertList = this.props.filteredList;
        }

        window.alertList = alertList;

        var jsonString = JSON.stringify(alertList);
        var json = [jsonString];
        var blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

        var isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob1, 'DB_extract_' + new Date().valueOf() + '.json');
        } else {
            var url = window.URL || window.webkitURL;
            var link = url.createObjectURL(blob1);
            var a = document.createElement("a");
            a.download = 'DB_extract_' + new Date().valueOf() + '.json';
            a.href = link;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
    downloadCVS(filtered) {
        var alertList = null;
        if (filtered) {
            alertList = this.props.completeList;
        } else {
            alertList = this.props.filteredList;
        }

        var list = [];
        alertList.forEach(d => {
            list.push([
                d.id,
                d.userId,
                d.classId,
                d.date.seconds,
                d.latitude,
                d.longitude]);
        });

        var csv = 'ID,UserID,ClassID,TimestampSeconds,Latitude,Longitude\n';
        list.forEach(row => {
            csv += row.join(',');
            csv += "\n";
        });

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = 'DB_extract_' + new Date().valueOf() + '.csv';
        hiddenElement.click();

        hiddenElement.remove();
        //document.removeChild(hiddenElement);
    }

    render() {
        return (
            <Card text={"white"} bg={"dark"}>
                <Card.Header>
                    <h4>Descarga de Datos</h4>
                </Card.Header>
                <Card.Body>
                    <Card bg={"dark"}>
                        <Card.Header><h5>Lista completa</h5></Card.Header>
                        <Card.Body>
                            <Row className="text-center">
                                <Col><Button
                                    className="w-100"
                                    onClick={() => { this.downloadJson(false) }}>
                                    Descargar JSON
                                </Button></Col>
                                <Col><Button
                                    className="w-100"
                                    onClick={() => { this.downloadCVS(false) }}>
                                    Descargar CSV
                                </Button></Col>
                            </Row>
                        </Card.Body>
                        <Card.Header><h5>Lista filtrada</h5></Card.Header>
                        <Card.Body>
                            <Row className="text-center">
                                <Col><Button
                                    className="w-100"
                                    onClick={() => { this.downloadJson(true) }}>
                                    Descargar JSON
                                </Button></Col>
                                <Col><Button
                                    className="w-100"
                                    onClick={() => { this.downloadCVS(true) }}>
                                    Descargar CSV
                                </Button></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>
        )
    }
}

export default DataDownloadPanel;