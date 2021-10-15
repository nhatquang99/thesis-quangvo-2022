// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract House is ERC721, Ownable {
    
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string constant internal EMPTY_STRING = "";
    
    string private _baseURIextended = "ipfs://";

    //Address -> balance of address in this contract
    mapping(address => uint) balances;
    
    //Hash -> hash existed or not
    mapping(string => bool) private _hashes;

    //TokenId -> on-sale or off-sale
    mapping(uint256 => bool) private _isOnSale;

    //TokenId -> index in saleTokens
    mapping(uint256 => uint) private _onSaleIndex;

    //TokenId -> Address -> address offered or not
    mapping(uint256 => mapping(address => bool)) private _hasOffer;

    //Address -> all tokens of address
    mapping(address => uint256[]) public _myTokens;
    
    //TokenId -> token URI
    mapping(uint256 => string) private _tokenURIs;
    
    SaleToken[] public saleTokens;
    
    uint public totalTokens;
    
    uint public totalSaleTokens;
    

    constructor() ERC721("PremiumHouse", "PH") {}

    struct Offer 
    {
        address bidder;
        uint offerPrice;
    }

    struct SaleToken 
    {
        uint tokenId;
        address postedBy;
        uint minimumPrice;
        uint offersCount;
        bool isAvailable;
        address soldTo;
        Offer[] offers;
    }

    //@Desc: SET BASE URI
    function setBaseURI(string memory baseURI_) external onlyOwner 
    {
        _baseURIextended = baseURI_;
    }

    //@Desc: SET TOKEN URI
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(_exists(tokenId), "Token does not exist");

        _tokenURIs[tokenId] = _tokenURI;
    }

    //Override
    //@Desc: GET BASE URI
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    //Override
    //@DESC: GET TOKEN URI
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        string memory _tokenURI = _tokenURIs[tokenId];

        return _tokenURI;
        
    }

    //PUBLIC
    //Mint a new token
    function mint(address _to, string memory _hash) public returns (uint256)
    {
        require(_hashes[_hash] != true, "Your token already exists");
        _hashes[_hash] = true;

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(_to, newItemId);
        _setTokenURI(newItemId, _hash);
        
        _myTokens[_to].push(newItemId);
        
        totalTokens += 1;

        return newItemId;
    }
    
    //OWNER
    //Burn a token
    function burn(uint256 tokenId) public 
    {
       require(_exists(tokenId), "Token does not exist");
       require( _isApprovedOrOwner(_msgSender(), tokenId), "You are not authorized");
       
       string memory _hash = _tokenURIs[tokenId];
       _hashes[_hash] = false;
       delete _tokenURIs[tokenId];
       
       removeMyToken(msg.sender, tokenId);
       
       totalTokens -= 1;

       _burn(tokenId);
    }

    //OWNER
    //Put a token on sale
    function putOnSale(uint256 tokenId, uint minimumPrice) public 
    {
       require(_exists(tokenId), "Token does not exist");
       require(ownerOf(tokenId) == _msgSender(), "You are not authorized");
       require(_isOnSale[tokenId] != true, "Token is already on sale");

       _isOnSale[tokenId] = true;
       _onSaleIndex[tokenId] = saleTokens.length;
       
       SaleToken storage newSaleToken;
       newSaleToken.tokenId = tokenId;
       newSaleToken.postedBy = _msgSender();
       newSaleToken.minimumPrice = minimumPrice;
       newSaleToken.offersCount = 0;
       newSaleToken.isAvailable = true;
       
       saleTokens.push(newSaleToken);
       
       totalSaleTokens += 1;
    }
    
    //BUYER
    //Offer an on-sale token
    function offer(uint256 tokenId) public restrictOnMarket(tokenId) payable
    {
        require(_isApprovedOrOwner(_msgSender(), tokenId) == false, "You can not offer to your own token");
        require(_hasOffer[tokenId][msg.sender] != true, "You have offered for this token");
        
        _hasOffer[tokenId][msg.sender] = true;
        
        uint tokenIndex = _onSaleIndex[tokenId];

        SaleToken storage currentSaleToken = saleTokens[tokenIndex];
        
        require(msg.value >= currentSaleToken.minimumPrice);
        require(currentSaleToken.isAvailable != false, "Token is not for sale in this auction");
        
        Offer memory currentOffer = Offer({
            bidder: msg.sender,
            offerPrice: msg.value
        });
        
        currentSaleToken.offers.push(currentOffer);
        
        currentSaleToken.offersCount += 1;
        
        balances[msg.sender] += msg.value;
    }
    
    //OWNER
    //Transfer token ownership
    function transfer(uint256 tokenId, uint offerIndex) public restrictOnMarket(tokenId) payable
    {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "You are not authorized");
        
        uint tokenIndex = _onSaleIndex[tokenId];
        
        SaleToken storage currentSaleToken = saleTokens[tokenIndex];
        
        require(currentSaleToken.offersCount != 0, "Your token has not been offered yet");
        require(currentSaleToken.isAvailable != false, "Token is not for sale in this auction");
        
        Offer[] storage currentOffers = currentSaleToken.offers;
        
      
        
        for (uint i = 0; i < currentOffers.length; i++)
        {
            Offer memory currentOffer = currentOffers[i];
            
            balances[currentOffer.bidder] -= currentOffer.offerPrice;
            
            if (i == offerIndex)
            {
                payable(ownerOf(tokenId)).transfer(currentOffer.offerPrice);
                _myTokens[currentOffer.bidder].push(tokenId);
                safeTransferFrom(ownerOf(tokenId), currentOffer.bidder, tokenId);
                currentSaleToken.soldTo = currentOffer.bidder;
            }
            else
            {
                payable(currentOffer.bidder).transfer(currentOffer.offerPrice);
                
            }
            
            // delete currentOffers[i];
            delete _hasOffer[tokenId][currentOffer.bidder];
        }
        
        removeMyToken(msg.sender, tokenId);
        
        delete currentSaleToken.offers;
        currentSaleToken.isAvailable = false;
        
        _isOnSale[tokenId] = false;
        delete _onSaleIndex[tokenId];
        
        totalSaleTokens -= 1;   
    }
    
    //OWNER
    //Remove ownership of a token
    function removeMyToken(address _owner, uint256 tokenId) internal 
    {
        uint256[] storage myTokens = _myTokens[_owner];
       
        bool isIndexNotFound = true;
        
        uint currentIndex = 0;
        
        while (isIndexNotFound) 
        {
            if (myTokens[currentIndex] != tokenId) 
            {
                currentIndex += 1;
            }
            else 
            {
               isIndexNotFound = false;
            }
        }
        
        for (uint i = currentIndex; i < myTokens.length - 1; i++) 
        {
            myTokens[i] = myTokens[i+1];
        }
        
        delete myTokens[myTokens.length-1];
        
        myTokens.pop();
    }
    
    //BUYER
    //Revoke offer from an on-sale token
    function revokeOffer (uint256 tokenId) public restrictOnMarket(tokenId) payable
    {
        require(_hasOffer[tokenId][msg.sender] != false, "You have not offered for this token");
        
        uint tokenIndex = _onSaleIndex[tokenId];
        
        SaleToken storage currentSaleToken = saleTokens[tokenIndex];
        
        require(currentSaleToken.isAvailable != false, "Token is not for sale in this auction");
        require(currentSaleToken.offersCount != 0, "Your token has not been offered yet");
        
        Offer[] storage currentOffers = currentSaleToken.offers;
    
        bool isIndexNotFound = true;
        
        uint currentIndex = 0;
        
        while (isIndexNotFound) 
        {
            if (currentOffers[currentIndex].bidder != msg.sender) 
            {
                currentIndex += 1;
            }
            else 
            {
               isIndexNotFound = false;
            }
        }
        
        balances[msg.sender] -= currentOffers[currentIndex].offerPrice;
        payable(msg.sender).transfer(currentOffers[currentIndex].offerPrice);
        _hasOffer[tokenId][msg.sender] = false;
        
        for (uint i = currentIndex; i < currentOffers.length - 1; i++) 
        {
            currentOffers[i] = currentOffers[i+1];
        }
        
        delete currentOffers[currentOffers.length-1];
        
        currentOffers.pop();
        
        currentSaleToken.offersCount -= 1;
        
    }
    
    //OWNER
    //Revoke token off market
    function revokeSaleToken(uint256 tokenId) public restrictOnMarket(tokenId) payable
    {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "You are not authorized");
        
        uint tokenIndex = _onSaleIndex[tokenId];
        
        SaleToken storage currentSaleToken = saleTokens[tokenIndex];
        
        require(currentSaleToken.isAvailable != false, "Token is not for sale in this auction");
        
        if (currentSaleToken.offersCount > 0)
        {
            Offer[] storage currentOffers = currentSaleToken.offers;
            
            for (uint i = 0; i < currentOffers.length; i++)
            {
                balances[currentOffers[i].bidder] -= currentOffers[i].offerPrice;
                payable(currentOffers[i].bidder).transfer(currentOffers[i].offerPrice);
                _hasOffer[tokenId][currentOffers[i].bidder] = false;
            }
            
            delete currentSaleToken.offers;
        }

        _isOnSale[tokenId] = false;
        delete _onSaleIndex[tokenIndex];
        currentSaleToken.isAvailable = false;
        
        totalSaleTokens -= 1;
    }
    
    
    
    // //CONTRACT OWNER
    // //Get contract balance
    // function _getContractBalance() public view onlyOwner returns(uint) 
    // {
    //     return address(this).balance;
    // }
    
    //PUBLIC
    //Return all on-sale tokens
    function _getSaleTokens() public view returns (SaleToken[] memory)
    {
        return saleTokens;
    }
    
    //PUBLIC
    //Return an on-sale token
    function _getOnSaleToken(uint256 tokenId) public view returns (SaleToken memory)
    {
        uint tokenIndex = _onSaleIndex[tokenId];
        SaleToken memory currentSaleToken = saleTokens[tokenIndex];
        
        return currentSaleToken;
    }

    //PUBLIC
    //Get token status if one is on-sale or not
    function _getOnSaleStatus(uint256 tokenId) public view returns (bool)
    {
        require(_exists(tokenId), "Token does not exist");
        return _isOnSale[tokenId];
    }
    
    //PUBLIC
    //Get all my tokens
    function _getMyTokens() public view returns (uint[] memory)
    {
        return _myTokens[msg.sender];
    }
    
    modifier restrictOnMarket(uint256 tokenId)
    {
        require(_exists(tokenId), "Token does not exist");
        require(_isOnSale[tokenId] != false, "Token is not on sale");
        _;
    }
}