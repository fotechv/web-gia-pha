import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavigationBootstrap() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/giapha4">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/quan-ly">Quản lý gia phả</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBootstrap;
