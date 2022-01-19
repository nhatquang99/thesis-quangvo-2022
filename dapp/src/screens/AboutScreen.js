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
            <p>
              Premium House is a real estate document storage system as well as
              a trading platform that helps people buy and sell real estate
              easily that licensed by the government.
            </p>
            <p>
              Premium House is one of the first real estate storage systems
              applying Blockchain technology in the world. With the intervention
              of Blockchain, all information about ownership as well as buying
              and selling history for a certain asset is transparent and public.
              Premium House's mission is to create an
              ecosystem to help people feel secure when trading properties as
              well as improve the buying and selling process to the maximum to
              help cut fee and paperwork procedure compared to the
              traditional process.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AboutScreen;
