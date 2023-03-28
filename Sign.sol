// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Signature {


    address[] whitelist;

    struct Document {
        bool exist;
        uint256 docNo;
        address[] signAddressess;
    }

    mapping(uint256 => Document) public documents;

    event DocumenSigned(address partipicant, uint docNo);


    function getDocument(uint _docNo) public view returns (uint docNo, address[] memory signAddresses) {
        require(documents[_docNo].exist, "Document not found");
        Document memory document = documents[_docNo];


        return (
            _docNo,
            document.signAddressess
        );
    }


    function addToWhitelist(address _address) public {
        whitelist.push(_address);
    }


    function getWhitelist() public view returns (address[] memory) {
        return whitelist;
    }


    modifier onlyWhitelist(address _addr) {
        require(isWhitelisted(_addr), "You are not on the whitelist");
        _;
    }


    function isWhitelisted(address _address) internal view returns (bool) {
        for (uint i = 0; i < whitelist.length; i++)
        {
            if(whitelist[i] == _address) {
                return true;
            }
        }

        return false;
    }


    function signDocument(uint _docNo) public onlyWhitelist(msg.sender) {


        Document storage document = documents[_docNo];
        document.exist = true;
        document.docNo = _docNo;
        document.signAddressess.push(msg.sender);


        emit DocumenSigned(msg.sender, _docNo);
    }
}
