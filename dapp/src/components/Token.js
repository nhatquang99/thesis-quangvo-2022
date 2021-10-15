import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { web3 } from "../utils/interact";

const Token = ({ saleToken }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/token/${saleToken.tokenId}`}>
        <Card.Header>#{saleToken.tokenId}</Card.Header>
        <Card.Body>
          <Card.Title as="div">
            <strong>Posted By: {saleToken.postedBy}</strong>
          </Card.Title>

          <Card.Text as="div">
            Minimum Price (ETH):{" "}
            {web3.utils.fromWei(saleToken.minimumPrice, "ether")}
          </Card.Text>
          <Card.Text as="div">Total Offers: {saleToken.offersCount}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default Token;
