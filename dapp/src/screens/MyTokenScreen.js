import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { tokenContract, web3 } from "../utils/interact";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Card } from "react-bootstrap";
import {Link} from 'react-router-dom'

const MyTokenScreen = () => {
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [myTokens, setMyTokens] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const initialize = async () => {
    const addresses = await web3.eth.getAccounts();

    if (addresses[0]) {
      const totalTokens = await tokenContract.methods
        ._getMyTokens()
        .call({ from: addresses[0] });
      if (totalTokens.length != 0) {
        console.log("---------", totalTokens);
        setMyTokens(totalTokens);
        setLoading(false);
      } else {
        setErrorMessage("You do not have any tokens");
        setLoading(false);
      }
    } else {
      setErrorMessage("Please sign in your account.");
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : errorMessage ? (
        <Message variant="danger">{errorMessage}</Message>
      ) : (
        <Container>
          <Row>
            <Col>
              <h1>My Token</h1>
            </Col>
          </Row>
          <Row>
            {myTokens &&
              myTokens.map((myToken) => {
                return (
                  <Col sm={12} md={6} lg={4} xl={3} key={myToken}>
                    <Card className="my-3 p-3 rounded">
                    <Link to={`/token/${myToken}`}>
                        <Card.Img style={{width: '100%', height: '100%' }} variant="top" src='https://images.adsttc.com/media/images/5d9c/4216/284d/d1a1/9b00/02fe/large_jpg/feature_-279A0964.jpg?1570521591' />
                    </Link>
                      <Card.Body>
                        <Link to={`/token/${myToken}`}>
                          <Card.Title as="div" className='text-center'>
                            <strong>
                              #{myToken}
                            </strong>
                          </Card.Title>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Container>
      )}
    </>
  );
};

export default MyTokenScreen;
