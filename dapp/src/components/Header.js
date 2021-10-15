import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { connectWallet, web3 } from "../utils/interact";
import { UPDATE_ADDRESS } from "../constants/globalConstant";

const Header = () => {
  const dispatch = useDispatch();
  const globalReducer = useSelector((state) => state.globalReducer);
  const [userAddress, setUserAddress] = useState('');

  const initialize = async () => {
    const addresses = await web3.eth.getAccounts();
    if (addresses[0])
    {
      setUserAddress(addresses[0]);
    }
  }

  useEffect(() => {
    initialize();
  }, [])

  const connectWalletPresend = async () => {
    const walletResponse = await connectWallet();
    setUserAddress(walletResponse.address);
  }


  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Premium House</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/history">
              <Nav.Link>Ledger</Nav.Link>
            </LinkContainer>
          </Nav>

          {userAddress && (
            <Nav className="mr-auto">
              <LinkContainer to="/myToken">
                <Nav.Link className="text-light">{userAddress}</Nav.Link>
              </LinkContainer>
            </Nav>
          )}

          <Nav>
            {!userAddress && (
              <Nav.Link>
                <Button className="btn btn-outline-secondary btn-sm text-light" onClick={connectWalletPresend}>
                  Sign In
                </Button>
              </Nav.Link>
            )}

            <LinkContainer to="/mint">
              <Nav.Link>
                <Button className="btn btn-outline-secondary btn-sm text-light">
                  Mint
                </Button>
              </Nav.Link>
            </LinkContainer>


            {/* <LinkContainer to='/login'>
                            <Nav.Link><i className='fas fa-user'/>Sign In</Nav.Link>
                        </LinkContainer> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
