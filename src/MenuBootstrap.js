import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavigationBootstrap() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/demo">Demo</Nav.Link>
            <Nav.Link href="/gia-pha1">Gia phả 1</Nav.Link>
            <Nav.Link href="/gia-pha2">Gia phả 2 OK</Nav.Link>
            <Nav.Link href="/context-menu">Context Menus</Nav.Link>
            <Nav.Link href="/reactjs-demo">ReactJs Demo</Nav.Link>
            <Nav.Link href="/modal-demo">ModalDemo</Nav.Link>
            <Nav.Link href="/quan-ly">Quản lý gia phả</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBootstrap;
