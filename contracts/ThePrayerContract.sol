pragma solidity 0.4.23;

import "node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Destructible.sol";
import "./ReentrancyGuard.sol";

contract ThePrayerContract is Destructible, ReentrancyGuard{
    using SafeMath for uint256;
    address public owner;

    mapping(address => PrayerData[]) public thePrayerList;
    mapping(uint => PrayerLinkData) public thePrayerLinks;
    mapping(uint => PrayerLinkData) public theAnsweredPrayerLinks;
    mapping(address => uint) public numberOfPrayersByAddress;

    uint public numberOfPrayerMakers;
    uint public totalNumberOfPrayers;
    uint public totalNumberOfAnsweredPrayers;

    event PrayerAdded(address prayerAddress, string prayerTitle, string prayerDetail);
    event PrayerAnswered(address prayerAddress, string prayerTitle, uint index);
    event PrayerIncemented(address incrementorAddress, address prayerAddress, uint index);
    event Sent(address indexed payee, uint256 amount, uint256 balance);
    event Received(address indexed payer, uint256 amount, uint256 balance);

    struct PrayerData {
        string prayerTitle;
        string prayerDetail;
        bool answered;
        uint prayerCount;
        uint timestamp;
        uint answeredTimestamp;
    }

    struct PrayerLinkData {
        address prayerMakerAddress;
        uint prayerMakerIndex;
    }


    function getPrayer(uint index) public view returns (address, uint, uint, string, string, uint, uint) {
        require(totalNumberOfPrayers > 0);
        PrayerLinkData memory linkData = thePrayerLinks[index];
        return getPrayerFromAddress(linkData.prayerMakerAddress, linkData.prayerMakerIndex);
    }

    function getAnsweredPrayer(uint index) public view returns (address, uint, uint, string, string, uint, uint) {
        require(totalNumberOfAnsweredPrayers > 0);
        PrayerLinkData memory linkData = theAnsweredPrayerLinks[index];
        return getPrayerFromAddress(linkData.prayerMakerAddress, linkData.prayerMakerIndex);
    }

    function getPrayerFromAddress(address prayerAddress, uint index) public view returns (address, uint, uint, string, string, uint, uint) {
        require(thePrayerList[prayerAddress].length > 0);
        require(thePrayerList[prayerAddress].length > index);
        
        PrayerData memory data = thePrayerList[prayerAddress][index];
        return (
            prayerAddress,
            index,
            data.prayerCount,
            data.prayerTitle,
            data.prayerDetail,
            data.timestamp,
            data.answeredTimestamp
        );
    }

    function addPrayer(string _prayerTitle, string _prayerDetail, uint timestamp) external nonReentrant {
        require(keccak256(_prayerTitle) != keccak256(""));
        require(keccak256(_prayerDetail) != keccak256(""));
        uint noOfPrayers = thePrayerList[msg.sender].length;
        if (noOfPrayers == 0) {
            PrayerData memory pd = PrayerData(_prayerTitle, _prayerDetail, false, 1, timestamp, 0);
            thePrayerList[msg.sender].push(pd);
            thePrayerLinks[totalNumberOfPrayers] = PrayerLinkData(msg.sender, 0);
            numberOfPrayerMakers = numberOfPrayerMakers.add(1);
            totalNumberOfPrayers = totalNumberOfPrayers.add(1);
            numberOfPrayersByAddress[msg.sender] = 1;
            emit PrayerAdded(msg.sender, _prayerTitle, _prayerDetail);
        } else {
            PrayerData[] storage prayerMakerPrayers = thePrayerList[msg.sender];
            uint length = prayerMakerPrayers.push(PrayerData(_prayerTitle, _prayerDetail, false, 1, timestamp, 0));
            thePrayerLinks[totalNumberOfPrayers] = PrayerLinkData(msg.sender, length.sub(1));
            totalNumberOfPrayers = totalNumberOfPrayers.add(1);
            uint numberByAddress = numberOfPrayersByAddress[msg.sender].add(1);
            numberOfPrayersByAddress[msg.sender] = numberByAddress;
            emit PrayerAdded(msg.sender, _prayerTitle, _prayerDetail);
        }
    }

    function getNumberOfPrayersByAddress(address _address) public view returns (uint) {
        require(_address != 0x0);
        return thePrayerList[_address].length;
    }

    function getTheNumberOfPrayerMakers() public view returns (uint) {
        return numberOfPrayerMakers;
    }

    function getTotalNumberOfPrayers() public view returns (uint){
        return totalNumberOfPrayers;
    }

    function getTotalNumberOfPrayersByAddress(address _address) public view returns (uint){
        return thePrayerList[_address].length;
    }

    function incrementPrayer(address prayerAddress, uint prayerIndex) external nonReentrant {
        require(thePrayerList[prayerAddress].length > 0);
        require(thePrayerList[prayerAddress].length > prayerIndex);
        thePrayerList[prayerAddress][prayerIndex].prayerCount = thePrayerList[prayerAddress][prayerIndex].prayerCount.add(1);
        emit PrayerIncemented(prayerAddress, prayerAddress, prayerIndex);
    }

    function answerPrayer(address prayerAddress, uint prayerIndex, uint timestamp) external nonReentrant returns (uint)  {
        require(prayerAddress == msg.sender);
        require(thePrayerList[msg.sender].length > 0);
        require(thePrayerList[msg.sender].length > prayerIndex);
        require(thePrayerList[msg.sender][prayerIndex].answered == false);
        PrayerData storage prayer = thePrayerList[msg.sender][prayerIndex];
        prayer.answered = true;
        prayer.answeredTimestamp = timestamp;
        theAnsweredPrayerLinks[totalNumberOfAnsweredPrayers] = PrayerLinkData(prayerAddress, prayerIndex);
        totalNumberOfAnsweredPrayers = totalNumberOfAnsweredPrayers.add(1);
        emit PrayerAnswered(prayerAddress, prayer.prayerTitle, prayerIndex);
        return prayer.answeredTimestamp.sub(prayer.timestamp);
    }

    function isPrayerAnswered(address prayerAddress, uint prayerIndex) public view returns (bool) {
        require(thePrayerList[prayerAddress].length > 0);
        require(thePrayerList[prayerAddress].length > prayerIndex);
        return thePrayerList[prayerAddress][prayerIndex].answered;
    }

    function () public payable {
        emit Received(msg.sender, msg.value, address(this).balance);
    }

  
    function sendTo(address payee, uint256 amount) public onlyOwner {
        require(payee != 0 && payee != address(this));
        require(amount > 0);
        payee.transfer(amount);
        emit Sent(payee, amount, address(this).balance);
    }

}
