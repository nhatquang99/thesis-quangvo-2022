import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import FormData from "form-data";
import Loader from "../components/Loader";
import Message from "../components/Message";
import IPFS from "ipfs-api";
import { pinFiletoPinata, pinJSONToPinata } from "../actions/tokenActions";
import { useSelector, useDispatch } from "react-redux";
import {
  PIN_FILE_TO_PINATA_RESET,
  TOKEN_REDUCER_LOADING_FALSE,
  TOKEN_REDUCER_LOADING_TRUE,
} from "../constants/tokenConstant";
import { tokenContract, web3 } from "../utils/interact";

const TokenMintScreen = ({ match, history }) => {
  const ipfs = new IPFS({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const dispatch = useDispatch();
  const [message, setMessage] = useState(undefined);
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [bedroom, setBedroom] = useState(0);
  const [restroom, setRestroom] = useState(0);
  const [type, setType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState("");

  const tokenReducer = useSelector((state) => state.tokenReducer);
  const globalReducer = useSelector((state) => state.globalReducer);

  const {
    loading,
    first_image_hash,
    second_image_hash,
    third_image_hash,
    tokenHash,
  } = tokenReducer;
  const { userAddress } = globalReducer;

  const formValidation = () => {
    if (
      address == "" ||
      address == undefined ||
      area == "" ||
      area == undefined ||
      bedroom == "" ||
      bedroom == undefined ||
      restroom == "" ||
      restroom == undefined ||
      type == "" ||
      type == undefined
    ) {
      return true;
    } else {
      return false;
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const payload = {
      address,
      area,
      bedroom,
      restroom,
      type,
      first_image_hash,
      second_image_hash,
      third_image_hash,
    };
    dispatch(pinJSONToPinata(payload));
  };

  const mintHandler = async (e) => {
    e.preventDefault();
    const isAddress = web3.utils.isAddress(ownerAddress);
    if (!isAddress) {
      setErrorMessage("Address does not exists");
    } else {
      setErrorMessage("");
      dispatch({ type: TOKEN_REDUCER_LOADING_TRUE });
      const address = await web3.eth.getAccounts();

      try {
        const response = await tokenContract.methods
          .mint(ownerAddress, tokenHash)
          .send({ from: address[0] });

        if (response.status == true) {
          setCurrentStep(4);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }

      dispatch({ type: TOKEN_REDUCER_LOADING_FALSE });
    }
  };

  const uploadFileToPinata = async (e, id) => {
    const formData = new FormData();
    formData.append("my-image-file", e.target.files[0], e.target.files[0].name);

    dispatch(pinFiletoPinata(formData, id));
  };

  const initialize = async () => {
    const address = await web3.eth.getAccounts();
    const contractOwner = await tokenContract.methods
      .owner()
      .call({ from: address[0] });

    if (address[0] != contractOwner) {
      setErrorMessage("You do not have rights to use this feature.");
    } else {
      setIsAuthorized(true);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (tokenHash) {
      setCurrentStep(3);
    }
  }, [tokenHash]);

  return (
    <>
      <Link to={`/`} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        {errorMessage && <Message variant="danger">{errorMessage}</Message>}
        {isAuthorized && <h2 className="text-center">Create Your Own Token</h2>}
      </FormContainer>

      {isAuthorized && currentStep == 1 && (
        <>
          <CheckoutSteps step1 />
          <div style={{ textAlign: "center" }}>{loading && <Loader />}</div>
          <FormContainer>
            <Form
              onSubmit={() => {
                if (first_image_hash && second_image_hash && third_image_hash) {
                  setCurrentStep(2);
                }
              }}
              encType="multipart/form-data"
            >
              <Form.Group controlId="firstImage">
                <Form.Label>
                  First Image <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  required
                  name="file"
                  onChange={(e) => uploadFileToPinata(e, 1)}
                />
              </Form.Group>

              <Form.Group controlId="secondImage">
                <Form.Label>
                  Second Image <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  required
                  name="file"
                  onChange={(e) => uploadFileToPinata(e, 2)}
                />
              </Form.Group>

              <Form.Group controlId="thirdImage">
                <Form.Label>
                  Third Image<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  required
                  name="file"
                  onChange={(e) => uploadFileToPinata(e, 3)}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={
                  first_image_hash && second_image_hash && third_image_hash
                    ? false
                    : true
                }
              >
                Next
              </Button>
            </Form>
          </FormContainer>
        </>
      )}

      {isAuthorized && currentStep == 2 && (
        <>
          <CheckoutSteps step1 step2 />
          <div style={{ textAlign: "center" }}>{loading && <Loader />}</div>
          <FormContainer>
            <Form onSubmit={submitHandler} encType="multipart/form-data">
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Token Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="area">
                <Form.Label>Area (m2)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Token Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="bedroom">
                <Form.Label>Bedroom(s)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter bedroom quantity"
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="restroom">
                <Form.Label>Restroom(s)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter restroom quantity"
                  value={restroom}
                  onChange={(e) => setRestroom(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  placeholder="Enter token type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Token Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Single Detached">Single Detached</option>
                  <option value="Cabin">Cabin</option>
                  <option value="Duplex">Duplex</option>
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={formValidation()}
              >
                Next
              </Button>
            </Form>
          </FormContainer>
        </>
      )}

      {isAuthorized && currentStep == 3 && (
        <>
          <CheckoutSteps step1 step2 step3 />
          <div style={{ textAlign: "center" }}>{loading && <Loader />}</div>
          <FormContainer>
            <Form onSubmit={mintHandler} encType="multipart/form-data">
              <Form.Group controlId="address">
                <Form.Label>Your token hash</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  value={tokenHash}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="owner">
                <Form.Label>Owner Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Owner Address"
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Mint
              </Button>
            </Form>
          </FormContainer>
        </>
      )}

      {isAuthorized && currentStep == 4 && (
        <>
          <CheckoutSteps step1 step2 step3 step4 />
          <FormContainer>
            <Message variant="success">Succesfully Minted</Message>
          </FormContainer>
        </>
      )}
    </>
  );
};

export default TokenMintScreen;
