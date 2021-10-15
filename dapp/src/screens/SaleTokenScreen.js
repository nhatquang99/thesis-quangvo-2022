import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Form,
  Carousel,
  Table,
} from "react-bootstrap";
import { tokenContract, web3 } from "../utils/interact";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getJSONFromPinata } from "../actions/tokenActions";
import { GET_JSON_FROM_PINATA_RESET } from "../constants/tokenConstant";

const SaleTokenScreen = ({ match, history }) => {
  const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

  const dispatch = useDispatch();
  const tokenReducer = useSelector((state) => state.tokenReducer);
  const { tokenDetail } = tokenReducer;
  const [loading, setLoading] = useState(true);
  const [tokenOwner, setTokenOwner] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOnSale, setIsOnSale] = useState(false);
  const [saleToken, setSaleToken] = useState(undefined);
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [offerList, setOfferList] = useState([]);

  const initialize = async () => {
    dispatch({ type: GET_JSON_FROM_PINATA_RESET });
    try {
      const address = await web3.eth.getAccounts();
      if (address[0]) {
        setCurrentUser(address[0]);

        const _saleToken = await tokenContract.methods
          .saleTokens(match.params.id)
          .call();
        console.log(_saleToken);
        setSaleToken(_saleToken);

        const tokenURI = await tokenContract.methods
          .tokenURI(_saleToken.tokenId)
          .call({ from: address[0] });

        dispatch(getJSONFromPinata(tokenURI));
        setLoading(false);
      } else {
        setErrorMessage("Please sign in your account.");
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      initialize();
    } catch (error) {
      console.log("error", error.message);
    }
  }, []);

  return (
    <>
      {errorMessage && <Message variant="danger">{errorMessage}</Message>}

      {loading && <Loader />}

      {tokenDetail && saleToken && (
        <>
          <Row style={{ height: 50 }}>
            <h2>Transaction {parseInt(match.params.id) + 1}</h2>
          </Row>
          <Row>
            <Col md={6}>
              <Carousel style={{ width: "100%", height: "100%" }}>
                <Carousel.Item>
                  <img
                    src={`https://ipfs.io/ipfs/${tokenDetail.first_image_hash}`}
                    alt="first-image"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 0,
                      marginTop: 0,
                      padding: 0,
                    }}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={`https://ipfs.io/ipfs/${tokenDetail.second_image_hash}`}
                    alt="second-image"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 0,
                      marginTop: 0,
                      padding: 0,
                    }}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={`https://ipfs.io/ipfs/${tokenDetail.third_image_hash}`}
                    alt="third slide"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 0,
                      marginTop: 0,
                      padding: 0,
                    }}
                  />
                </Carousel.Item>
              </Carousel>
            </Col>

            <Col md={3} style={{ wordBreak: "break-all" }}>
              <ListGroup variant="flush">
                <ListGroup.Item className="font-weight-bold">
                  Token {saleToken.tokenId}
                </ListGroup.Item>
                <ListGroup.Item>Owner: {saleToken.postedBy}</ListGroup.Item>
                <ListGroup.Item>Address: {tokenDetail.address}</ListGroup.Item>
                <ListGroup.Item>
                  Bedroom(s): {tokenDetail.bedroom}
                </ListGroup.Item>
                <ListGroup.Item>
                  Restroom(s): {tokenDetail.restroom}
                </ListGroup.Item>
                <ListGroup.Item>Area(m2): {tokenDetail.area}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3} style={{ wordBreak: "break-all" }}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  Status: {saleToken.isAvailable ? "For Sale" : "Sold"}
                </ListGroup.Item>
                <ListGroup.Item>
                  Buyer:{" "}
                  {saleToken.soldTo == EMPTY_ADDRESS
                    ? "Unknown"
                    : saleToken.soldTo}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default SaleTokenScreen;
