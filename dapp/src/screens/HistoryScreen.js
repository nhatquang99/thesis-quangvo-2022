import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Token from "../components/Token";
import { Col, Row } from "react-bootstrap";
import { connectWallet, tokenContract, web3 } from "../utils/interact";
import { UPDATE_ADDRESS } from "../constants/globalConstant";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SaleToken from "../components/SaleToken";

const HistoryScreen = ({ match }) => {
  const dispatch = useDispatch();
  const globalReducer = useSelector((state) => state.globalReducer);
  const { userAddress } = globalReducer;
  const [saleTokens, setSaleTokens] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const intialize = async () => {
    const address = await web3.eth.getAccounts();
    if (address[0]) 
    {
      const _saleTokens = await tokenContract.methods
        ._getSaleTokens()
        .call({ from: address[0] });
      if (_saleTokens.length == 0)
      {
        setErrorMessage("There is no token on the market.");
        setLoading(false);
      }
      else 
      {
          setSaleTokens(_saleTokens);
          setLoading(false);
      }
    } else {
      setErrorMessage("Please sign in your account.");
      setLoading(false);
    }
  };

  useEffect(() => {
    intialize();
  }, []);

  console.log("----------", saleTokens);

  return (
    <>
      {loading ? (
        <Loader />
      ) : errorMessage ? (
        <Message variant="danger">{errorMessage}</Message>
      ) : (
        <Row>
          {saleTokens &&
            saleTokens.map((saleToken, index) => {
              return (
                <Col sm={12} md={6} lg={4} xl={3} key={index}>
                  <SaleToken saleToken={saleToken} index={index} />
                </Col>
              );
            })}
        </Row>
      )}
    </>
  );
};

export default HistoryScreen;
