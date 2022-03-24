import React, { Component, createRef } from "react";
import { Card } from "react-bootstrap";
import Chart from "chart.js/auto";
import { getClassName, getClassCount, getIdList, deepCopy, getClassColor } from "../../Utils/AlertDataUtils";

class AlertTimelinePanel extends Component {

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
            type: 'bar',
            data: {
                labels: ['1'],
                datasets: [{
                    label: 'Linea de tiempo de alertas',
                    data: [{x: "name", y: 1}]
                }]
            },
            options: {
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true
                    }
                }
            }
        });
    }

    updateCharts() {
        // chart1
        if (this.myChart != null) {
            var datasets = [];
            var labels = [];

            var countPerDate = this.getAlertTimelineCount(this.props.alertList);
            if (countPerDate != null && countPerDate.length > 0) {
                for (var i = 0; i < countPerDate[0].classCounters.length; i++) {
                    datasets.push({
                        label: getClassName(countPerDate[0].classCounters[i].classId),
                        data: [],
                        backgroundColor: getClassColor(countPerDate[0].classCounters[i].classId)
                    });
                }
                countPerDate.forEach(element => {
                    for (var i = 0; i < element.classCounters.length; i++) {
                        datasets[i].data.push(element.classCounters[i].counter);
                    }
                    labels.push(element.startDate.toDateString());
                });

            }

            /*
            var data = [];
            counts.forEach(element => {
                labels.push(element.name);
                data.push(element.count);
            });
            */

            /*console.log("data = ", data);
            console.log("labels = ", labels);*/

            this.myChart.data.labels = labels;
            this.myChart.data.datasets = datasets;
            this.myChart.update();
        }
    }

    getAlertTimelineCount(alertList) {
        //console.log("getAlertTimelineCount()");
        if (alertList != null && alertList.length > 0) {
            var classIdList = getIdList();
            var classCounters = [];
            classIdList.forEach(classID => {
                classCounters.push({
                    classId: classID,
                    counter: 0
                })
            });

            //console.log("classIdList = ", classIdList);
            //console.log("alertList =", alertList);

            var timestamps = [];
            alertList.forEach(element => {
                //timestamps.push(element.date.toDate().getTime())
                timestamps.push(element.date.getTime())
            });

            //console.log("timestamps = ", timestamps);

            var minTimestamp = timestamps[0];
            var maxTimestamp = timestamps[0];
            timestamps.forEach(t => {
                if (t < minTimestamp) {
                    minTimestamp = t;
                }
                if (t > maxTimestamp) {
                    maxTimestamp = t;
                }
            });

            //console.log("minTimestamp = ", minTimestamp);
            //console.log("maxTimestamp = ", maxTimestamp);

            var startDate = new Date(minTimestamp);
            startDate.setHours(0, 0, 0, 0);
            startDate.setDate(1);

            var countPerDate = [];
            var newDate = startDate;

            while (newDate.getTime() < maxTimestamp) {
                var nextDate = new Date(newDate);
                //nextDate.setDate(nextDate.getDate() + 1);
                nextDate.setMonth(nextDate.getMonth() + 1, 1);

                countPerDate.push({
                    startDate: new Date(newDate),
                    endDate: new Date(nextDate),
                    classCounters: deepCopy(classCounters) // los ... son para hacer una copia y no una referencia
                })
                //console.log("newDate: ", newDate, "nextDate: ", nextDate);
                newDate = new Date(nextDate);
            }

            //console.log("(empty) countPerDate = ", countPerDate);
            
            countPerDate.forEach(timeWindow => {
                alertList.forEach(alert => {
                    //if (alert.date.toDate() >= timeWindow.startDate && alert.date.toDate() < timeWindow.endDate) {
                    if (alert.date >= timeWindow.startDate && alert.date < timeWindow.endDate) {
                        //console.log("Date", alert.date.toDate(), "in window", timeWindow.startDate, "-", timeWindow.endDate);
                        for (var i = 0; i < timeWindow.classCounters.length; i++) {
                            if (alert.classId == timeWindow.classCounters[i].classId) {
                                timeWindow.classCounters[i].counter += 1;
                                break;
                            }
                        }
                    }
                });
            });

            //console.log("(filled) countPerDate = ", countPerDate);

            return countPerDate;
        }
    }

    render() {
        return (
            <Card className="w-100" text={"white"} bg={"dark"}>
                <Card.Header>
                    <h5>Alertas por Mes</h5>
                </Card.Header>
                <Card.Body style={{backgroundColor: "white"}}>
                    <canvas ref={this.graphCanvas} className="w-100" height="400px"></canvas>
                </Card.Body>
            </Card>
        )
    }
}

export default AlertTimelinePanel;