import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <p style={style.completed}>
            {step2 ? <i className="fas fa-check fa-sm"></i> : "1"}
          </p>
        ) : (
          <p style={style.uncompleted}>1</p>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <p style={style.completed}>
            {step3 ? <i className="fas fa-check fa-sm"></i> : "2"}
          </p>
        ) : (
          <p style={style.uncompleted}>2</p>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <p style={style.completed}>
          {step4 ? <i className="fas fa-check fa-sm"></i> : "3"}
        </p>        ) : (
          <p style={style.uncompleted}>3</p>
        )}
      </Nav.Item>

    </Nav>
  );
};

var style = {
  completed: {
    borderRadius: "50%",
    backgroundColor: "#0aa65a",
    height: 22,
    width: 22,
    textAlign: "center",
    color: "#fff",
  },
  uncompleted: {
    borderRadius: "50%",
    backgroundColor: "#7c818a",
    height: 22,
    width: 22,
    textAlign: "center",
    color: "#fff",
  },
};

export default CheckoutSteps;
