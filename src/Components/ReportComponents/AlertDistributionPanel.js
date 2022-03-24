import React, { Component, createRef } from "react";
import { Card } from "react-bootstrap";
import Chart from "chart.js/auto";
import { getClassName, getClassCount, getIdList, getClassColor } from "../../Utils/AlertDataUtils";

class AlertDistributionPanel extends Component {

    graphCanvas = createRef();
    myChart = null;

    componentDidMount() {
        this.CreateCharts();
    }

    componentDidUpdate() {
        if (this.graphCanvas.current != null){
            this.updateCharts();
        }
    }

    CreateCharts() {
        this.myChart = new Chart(this.graphCanvas.current, {
            type: 'doughnut',
            data: {
                labels: ['1'],
                datasets: [{
                    label: 'Distribucion de Alertas por Tipo',
                    data: [{x: "name", y: 1}]
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateCharts() {
        // chart1
        if (this.myChart != null) {
            var counts = this.getAlertsCount(this.props.alertList);
            var data = [];
            var labels = [];
            counts.forEach(element => {
                labels.push(element.name);
                data.push(element.count);
            });

            /*console.log("data = ", data);
            console.log("labels = ", labels);*/

            this.myChart.data.labels = labels;
            this.myChart.data.datasets.forEach((dataset) => {
                //dataset.data = [12, 19, 3, 5, 2, 3];
                dataset.data = data;
                dataset.backgroundColor = [];
                counts.forEach(element => {
                    dataset.backgroundColor.push(getClassColor(element.id));
                });
            });
            this.myChart.update();
        }
    }

    getAlertsCount(alertList) {
        var indexList = getIdList();
        var countingList = [];
        for (var i = 0; i < indexList.length; i++) {
            countingList.push({
                id: indexList[i],
                name: getClassName(indexList[i]),
                count: 0
            });
        }

        alertList.forEach(element => {
            for (var i = 0; i < countingList.length; i++) {
                if (element.classId == countingList[i].id) {
                    countingList[i].count += 1;
                    break;
                }
            }
        });

        return countingList;
    }

    render() {
        return (
            <Card className="w-100" text={"white"} bg={"dark"}>
                <Card.Header>
                    <h5>Distribucion de alerta por tipo</h5>
                </Card.Header>
                <Card.Body style={{backgroundColor: "white"}}>
                    <canvas ref={this.graphCanvas} className="w-100" ></canvas>
                </Card.Body>
            </Card>
        )
    }
}

export default AlertDistributionPanel;