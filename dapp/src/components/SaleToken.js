import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { web3 } from "../utils/interact";

const SaleToken = ({ saleToken, index }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/saleToken/${index}`}>
        <Card.Header>#{index+1}</Card.Header>
        <Card.Body>
          <Card.Title as="div">
            <strong>TokenId: {saleToken.tokenId}</strong>
          </Card.Title>

          <Card.Text as="div">
            Minimum Price (ETH):{" "}
            {web3.utils.fromWei(saleToken.minimumPrice, "ether")}
          </Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default SaleToken;
