import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import "./navbar.css"

function Header() {
  return (
      <Navbar bg="light" >
        <Container>
          <Navbar.Brand className='nav'>React Data Grid</Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default Header;