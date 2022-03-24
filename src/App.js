//import logo from './logo.svg';
//import './App.css';

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import PageHeader from './Components/PageHeader';
import FiltersPanel from "./Components/FiltersPanel";
import AlertDataPanel from "./Components/AlertDataPanel";
import DataDownloadPanel from "./Components/DataDownloadPanel";
import ReportsPanel from "./Components/ReportsPanel";

import { getAllAlerts, getArchivedAlerts } from "./Utils/firebaseAlertManager";
import { getClassName, getClassIcon } from './Utils/AlertDataUtils';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3BhcnRhbmNhdDciLCJhIjoiY2p2ZzVkOWRrMDQ1ejQxcmc2bjgxc3JtYSJ9.Nn4-Xa4AaeoVe3p3z67I7g';

function App() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const alertDataPanel = useRef(null);
    const heatmapSwitchButton = useRef(null);
    /*
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    */
    //const [zoom, setZoom] = useState(5);

    const [currentAlertList, setCurrentAlertList] = useState([]);
    const [completeList, setCompleteList] = useState([]);
    const [currentMarkers, setCurrentMarkers] = useState([]);
    const [heatmapActive, setHeatmapActive] = useState(false);

    const geocoder = useRef(null);

    const heatmapData = {
        type: "FeatureCollection",
        features: []
    };

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/spartancat7/cjvl41ivp2rer1cmmqq0xpl5w',
            //center: [lng, lat],
            //zoom: zoom
        });
        geocoder.current = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        });
        map.current.addControl(geocoder.current);
        /*
        window.myGeocoder = geocoder.current;
        console.log("myGeocoder value assigned");
        */

        map.current.on('load', () => {
            map.current.addSource('heatmap_alert_data', {
                type: 'geojson',
                data: heatmapData
            });
            map.current.addLayer(
                {
                    id: 'alert_heat',
                    type: 'heatmap',
                    source: 'heatmap_alert_data',
                    maxzoom: 18
                }
            );
            console.log("Layer added");

            getAllAlerts(updateCompleteListAndMap);
            //getArchivedAlerts(null, null);
        })
    });

    useEffect(refreshAlertsInMap, [currentAlertList, heatmapActive]);

    function refreshAlertsInMap() {
        console.log("refreshAlertsInMap()");
        if (map.current.isStyleLoaded()) {
            console.log("Refreshing icons");
            removeAllMarkers();
            var newMarkerList = [];
            heatmapData.features = [];
    
            
            if (heatmapActive) {
                currentAlertList.forEach(d => {
                    heatmapData.features.push({
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                d.longitude,
                                d.latitude
                            ]
                        }
                    });
                });
                if (map.current.getSource('heatmap_alert_data') != null) {
                    map.current.getSource('heatmap_alert_data').setData(heatmapData);
                }
                map.current.setLayoutProperty('alert_heat', 'visibility', 'visible');
            } else {
                map.current.setLayoutProperty('alert_heat', 'visibility', 'none');
    
                currentAlertList.forEach(d => {
                    var el = document.createElement('div');
                    el.className = 'marker';
                    el.setAttribute("alertId", d.id);
                    el.setAttribute("userId", d.userId);
                    el.setAttribute("alertName", getClassName(d.classId));
                    el.setAttribute("classId", d.classId);
                    el.setAttribute("date", d.date);
                    el.setAttribute("latitude", d.latitude);
                    el.setAttribute("longitude", d.longitude);
                    el.setAttribute("geohash", d.geohash);
                    
                    el.onclick = () => {
                        //console.log('Selected: ', d);
                        alertDataPanel.current.updateState(d);
                        geocoder.current.geocoderService
                            .reverseGeocode({
                                query: [d.longitude, d.latitude]
                            }).send().then(
                                response => {
                                    //console.log(response.body.features);
                                    var features = response.body.features;
                                    if (features.length > 0) {
                                        alertDataPanel.current.updateLocation(features[0].place_name);
                                    } else {
                                        alertDataPanel.current.updateLocation("---");
                                    }
                                }
                            )
                    }
        
                    var bgImage = "url(assets/icons/alerts/" + getClassIcon(d.classId) + ")";
                    el.style.backgroundImage = bgImage;
        
                    var newMarker = new mapboxgl.Marker(el)
                        .setLngLat([d.longitude, d.latitude])
                        .setPopup(
                            new mapboxgl.Popup({ offset: 25 }) // add popups
                                .setHTML(
                                    '<h2 style="color: black">' +
                                    getClassName(d.classId) +
                                    '</h2><p style="color: black>' +
                                    //d.date.toDate().toDateString() +
                                    d.date.toDateString() +
                                    '</p>'
                                )
                        )
                        .addTo(map.current);
        
                    newMarkerList.push(newMarker);
                });
            }
            setCurrentMarkers(newMarkerList);
            console.log("after setCurrentMarkers(newMarkerList)");
        }
    }

    function updateCompleteListAndMap(newAlertList) {
        console.log("updateCompleteListAndMap(newAlertList)");
        setCompleteList(newAlertList);
        setCurrentAlertList(newAlertList);
    }

    function removeAllMarkers() {
        currentMarkers.forEach(element => {
            element.remove();
        });
        //setCurrentMarkers([]);
    }

    function switchHeatmap() {
        console.log("switchHeatmap()");
        if (heatmapActive) {
            setHeatmapActive(false);
        } else {
            setHeatmapActive(true);
        }
    }
    /*
        function getCompleteList() {
            console.log("getCompleteList() returning ", completeList);
            return completeList;
        }
    
        function getFilteredList() {
            console.log("getFilteredList() returning ", currentAlertList);
            return currentAlertList;
        }
    */
    return (
        <div>
            <PageHeader />
            <Container>
                <Row className="mt-3">
                    <Col className="pl-0">
                        <FiltersPanel
                            listUpdaterMethod={setCurrentAlertList}
                            completeList={completeList} />
                    </Col>
                    <Col className="pr-0">
                        <DataDownloadPanel
                            completeList={completeList}
                            filteredList={currentAlertList} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <AlertDataPanel ref={alertDataPanel} />
                </Row>
                <Row className="mt-3">
                    <Card className="w-100" text={"white"} bg={"dark"}>
                        <Card.Header>
                            <Row>
                                <Col><h4>Mapa actual</h4></Col>
                                <Col className="float-end" md="auto">
                                    <Button ref={heatmapSwitchButton} onClick={() => { switchHeatmap() }}>
                                        { heatmapActive ? "Mostrar mapa de alertas" : "Mostrar mapa de calor" }
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="w-100">
                                <div ref={mapContainer} className="map-container w-100" />
                            </div>
                        </Card.Body>
                    </Card>
                </Row>
                <Row className="mt-3">
                    <ReportsPanel /*completeList={completeList}*/ filteredList={currentAlertList} />
                </Row>
            </Container>
            <Container
                fluid className="mt-3 pt-5 pb-5"
                style={{ backgroundColor: "#3c40c6", color: "white" }} >
                <Container>
                    Hi
                </Container>
            </Container>
        </div>
    );
}

export default App;

