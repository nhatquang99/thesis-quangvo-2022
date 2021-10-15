import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";


const AboutScreen = ({ match, history }) => {

  return (
    <>
        <Container>
            <Row className="text-center">
                <Col>
                    <h1>About Us</h1>
                </Col>
            </Row>
            <Row className="text-justify justify-content-md-center">
                <Col>
                        <p>In CryptoKitties, users collect and breed oh-so-adorable creatures that we call CryptoKitties! Each kitty has a unique genome that defines its appearance and traits. Players can breed their kitties to create new furry friends and unlock rare cattributes.</p>
                        <p>CryptoKitties is one of the world’s first blockchain games. ‘Blockchain’ is the technology that makes things like Bitcoin possible. While CryptoKitties isn’t a digital currency, it does offer the same security: each CryptoKitty is one-of-a-kind and 100% owned by you. It cannot be replicated, taken away, or destroyed.</p>
                </Col>
            </Row>

        </Container>
    </>
  );
};

export default AboutScreen;
