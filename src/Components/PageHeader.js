import React, { Component } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

class PageHeader extends Component {
    render() {
        return (
            <Navbar className="sticky-top" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand className="navbar-brand-container mr-5" href="#">
                        <img
                            src="/assets/icons/alert_broadcast_icon_white.svg"
                            alt={"RPAV Logo"}
                            height={40}
                            className="align-top rpav-logo"
                        />
                        <span>
                            RPAV: Red Publica de Alertas Viales
                        </span>
                        
                    </Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="#filters-panel">Filtros</Nav.Link>
                            <Nav.Link href="#download-panel">Descargas</Nav.Link>
                            <Nav.Link href="#map-panel">Mapa</Nav.Link>
                            <Nav.Link href="#reports-panel">Reportes</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default PageHeader;