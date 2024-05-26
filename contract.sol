// SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

contract ChatSystem {
    struct Chat {
        address userAddress;
        string username;
        string message;
        uint256 timestamp;
    }

    Chat[] public chats;
    
    event NewChatAdded(address indexed userAddress, string username, string message, uint256 timestamp);

    string[] public login_address;
    string[] public login_username;

    function addChat(string memory _username, string memory _message) public {
        Chat memory newChat = Chat({
            userAddress: msg.sender,
            username: _username,
            message: _message,
            timestamp: block.timestamp
        });
        chats.push(newChat);
        
        emit NewChatAdded(msg.sender, _username, _message, block.timestamp); 
    }

  
    function getAllChats() public view returns (Chat[] memory) {
        return chats;
    }

    function add_new_user(string memory new_address,string memory new_username)public{
        login_address.push(new_address);
        login_username.push(new_username);

    }

    function get_username(string memory addresss)public view returns (string memory){

        for(uint64 i=0;i<login_address.length;i++){
            if(keccak256(abi.encodePacked(login_address[i])) == keccak256(abi.encodePacked(addresss))){
                return login_username[i];
            }
        }



    }

     
}
