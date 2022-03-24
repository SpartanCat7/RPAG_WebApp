import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

class PageHeader extends Component {
    render(){
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Sistema Publico de Alertas Viales</Navbar.Brand>
            </Navbar>
        )
    }
}

export default PageHeader;