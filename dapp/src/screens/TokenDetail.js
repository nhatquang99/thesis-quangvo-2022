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

const TokenDetailScreen = ({ match, history }) => {
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
  const [saleTokens, setSaleTokens] = useState([]);
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [offerList, setOfferList] = useState([]);
  const [isHistorySectionVisible, setIsHistorySectionVisible] = useState(false);
  const [isOffersSectionVisible, setIsOffersSectionVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);


  const initialize = async () => {
    dispatch({ type: GET_JSON_FROM_PINATA_RESET });
    try {
      const address = await web3.eth.getAccounts();
      if (address[0]) {
        const tokenURI = await tokenContract.methods
          .tokenURI(match.params.id)
          .call({ from: address[0] });
        const _tokenOwner = await tokenContract.methods
          .ownerOf(match.params.id)
          .call({ from: address[0] });
        const _isOnSale = await tokenContract.methods
          ._getOnSaleStatus(match.params.id)
          .call({ from: address[0] });
        const _saleTokens = await tokenContract.methods
          ._getSaleTokens()
          .call({ from: address[0] });
        if (_saleTokens.length != 0) {
          const currentTokenTransactions = _saleTokens.filter(
            (_currnetSaleToken) => _currnetSaleToken.tokenId == match.params.id
          );

          if (currentTokenTransactions.length != 0) {
            setSaleTokens(currentTokenTransactions);
          }
        }

        setCurrentUser(address[0]);
        setIsOnSale(_isOnSale);
        setTokenOwner(_tokenOwner);

        if (_isOnSale) {
          const _saleToken = await tokenContract.methods
            ._getOnSaleToken(match.params.id)
            .call({ from: address[0] });

          if (_saleToken.offersCount > 0) {
            setOfferList(_saleToken.offers);
            for (const offer of _saleToken.offers) {
              if (offer.bidder == address[0]) {
                setCurrentOffer(offer);
                break;
              }
            }
          }
          setSaleToken(_saleToken);
        }

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

  const offerToken = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await tokenContract.methods.offer(match.params.id).send({
        from: currentUser,
        value: web3.utils.toWei(offerPrice, "ether"),
      });
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const putOnSale = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("-----POS-------", match.params.id);
      console.log("-----POS-------", minimumPrice);
      console.log("-----POS-------", currentUser);

      await tokenContract.methods
        .putOnSale(match.params.id, web3.utils.toWei(minimumPrice, "ether"))
        .send({ from: currentUser });
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const acceptOffer = async (e, index) => {
    e.preventDefault();
    try {
      setLoading(true);

      await tokenContract.methods
        .transfer(match.params.id, index)
        .send({ from: currentUser });
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  console.log("-------------", saleTokens);
  return (
    <>
      {errorMessage && <Message variant="danger">{errorMessage}</Message>}

      {loading && <Loader />}

      {tokenDetail && (
        <>
          <Row style={{ height: 50 }}></Row>
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
                  #{match.params.id}
                </ListGroup.Item>
                <ListGroup.Item>Current Owner: {tokenOwner}</ListGroup.Item>
                <ListGroup.Item>Address: {tokenDetail.address}</ListGroup.Item>
                <ListGroup.Item>
                  Bedroom(s): {tokenDetail.bedroom}
                </ListGroup.Item>
                <ListGroup.Item>
                  Restroom(s): {tokenDetail.restroom}
                </ListGroup.Item>
                <ListGroup.Item>Area(m2): {tokenDetail.area}</ListGroup.Item>
                {saleToken && (
                  <>
                    <ListGroup.Item>
                      Status: {saleToken.isAvailable ? "For Sale" : "Sold"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Buyer:{" "}
                      {saleToken.soldTo == EMPTY_ADDRESS
                        ? "Unknown"
                        : saleToken.soldTo}
                    </ListGroup.Item>
                  </>
                )}
              </ListGroup>
            </Col>

            <Col md={3}>
              {isOnSale && saleToken && saleToken.isAvailable == true && (
                <>
                  <ListGroup>
                    <ListGroup.Item>
                      <Row>
                        <Col>Total Offers </Col>
                        <Col>
                          <strong>{saleToken.offersCount}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Minimum Price: </Col>
                        <Col>
                          {web3.utils.fromWei(saleToken.minimumPrice, "ether")}{" "}
                          (ETH)
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                  {currentUser != tokenOwner && currentOffer == null && (
                    <Form
                      onSubmit={offerToken}
                      encType="multipart/form-data"
                      style={{ marginTop: 15 }}
                    >
                      <Form.Group controlId="offerPrice">
                        <Form.Label>Offer Price (ETH)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Set minimum price for your token"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        disabled={
                          offerPrice <=
                          web3.utils.fromWei(saleToken.minimumPrice, "ether")
                            ? true
                            : false
                        }
                      >
                        Offer
                      </Button>
                    </Form>
                  )}
                  {currentUser != tokenOwner && currentOffer && (
                    <ListGroup className="py-3">
                      <ListGroup.Item>
                        <Row>
                          <Col>Your Offer: </Col>
                          <Col>
                            {web3.utils.fromWei(
                              currentOffer.offerPrice,
                              "ether"
                            )}{" "}
                            (ETH)
                          </Col>
                        </Row>
                      </ListGroup.Item>{" "}
                    </ListGroup>
                  )}
                </>
              )}

              {!isOnSale && currentUser == tokenOwner && (
                <Form onSubmit={putOnSale} encType="multipart/form-data">
                  <Message variant='warning'>Please be aware that you only receive 90% value of your offer.</Message>
                  <Form.Group controlId="address">
                    <Form.Label>Minimum Price (ETH)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Set minimum price for your token"
                      value={minimumPrice}
                      onChange={(e) => setMinimumPrice(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Put On Sale
                  </Button>
                </Form>
              )}
            </Col>
          </Row>
          <Row>
            {saleToken && saleToken.offersCount > 0 && (
              <Col md={12}>
                <Button
                  onClick={() => {
                    setIsOffersSectionVisible(!isOffersSectionVisible);
                  }}
                  variant="light"
                >
                  <h2>
                    <i
                      className={`fas fa-chevron-${
                        isOffersSectionVisible ? "down" : "right"
                      }`}
                      style={{ marginRight: 15 }}
                    ></i>
                    Offers
                  </h2>
                </Button>
                {isOffersSectionVisible && (
                  <Table>
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>Offer Price (ETH)</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {offerList.map((offer, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td>{offer.bidder}</td>
                              <td>
                                {web3.utils.fromWei(offer.offerPrice, "ether")}
                              </td>
                              {currentUser == tokenOwner && (
                                <td style={{ paddingTop: 16 }}>
                                  <Button
                                    onClick={(e) => acceptOffer(e, index)}
                                    variant="outline-success"
                                    size="sm"
                                  >
                                    Accept
                                  </Button>
                                </td>
                              )}
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Col>
            )}
          </Row>
          <Row>
            {saleTokens.length != 0 ? (
              <Col md={12}>
                <Button
                  onClick={() => {
                    setIsHistorySectionVisible(!isHistorySectionVisible);
                  }}
                  variant="light"
                >
                  <h2>
                    <i
                      className={`fas fa-chevron-${
                        isHistorySectionVisible ? "down" : "right"
                      }`}
                      style={{ marginRight: 15 }}
                    ></i>
                    History
                  </h2>
                </Button>
                {isHistorySectionVisible && (
                  <Table>
                    <thead>
                      <tr>
                        <th>Owner</th>
                        <th>Minimum Price</th>
                        <th>Buyer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleTokens.map((saleToken, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td>{saleToken.postedBy}</td>
                              <td>
                                {web3.utils.fromWei(
                                  saleToken.minimumPrice,
                                  "ether"
                                )}
                              </td>
                              <td>
                                {saleToken.soldTo == EMPTY_ADDRESS
                                  ? "Unknown"
                                  : saleToken.soldTo}
                              </td>
                              <td>
                                {saleToken.isAvailable ? "For Sale" : "Sold"}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Col>
            ) : (
              <Message variant="warning">No transactions history</Message>
            )}
          </Row>
        </>
      )}
    </>
  );
};

export default TokenDetailScreen;
