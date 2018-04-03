pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract ThePrayerContract {
    using SafeMath for uint256;
    address public owner;

    mapping(address => PrayerData[]) public thePrayerList;
    mapping(uint => PrayerLinkData) public thePrayerLinks;
    mapping(uint => PrayerLinkData) public theAnsweredPrayerLinks;
    uint public numberOfPrayerMakers;
    uint public totalNumberOfPrayers;
    uint public totalNumberOfAnsweredPrayers;

    event PrayerAdded(address prayerAddress, string prayerTitle, string prayerDetail);
    event PrayerAnswered(address prayerAddress, string prayerTitle, uint index);
    event PrayerIncemented(address incrementorAddress, address prayerAddress, uint index);

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

    function getPrayer(uint index) public view returns (string, string, uint, uint) {
        require(totalNumberOfPrayers > 0);
        PrayerLinkData memory linkData = thePrayerLinks[index];
        return getPrayer(linkData.prayerMakerAddress, linkData.prayerMakerIndex);
    }

    function getAnsweredPrayer(uint index) public view returns (string, string, uint, uint) {
        require(totalNumberOfAnsweredPrayers > 0);
        PrayerLinkData memory linkData = theAnsweredPrayerLinks[index];
        return getPrayer(linkData.prayerMakerAddress, linkData.prayerMakerIndex);
    }

    function getPrayer(address prayerAddress, uint index) public view returns (string, string, uint, uint) {
        require(thePrayerList[prayerAddress].length > 0);
        return (
            thePrayerList[prayerAddress][index].prayerTitle,
            thePrayerList[prayerAddress][index].prayerDetail,
            thePrayerList[prayerAddress][index].timestamp,
            thePrayerList[prayerAddress][index].answeredTimestamp
        );
    }

    function addPrayer(string _prayerTitle, string _prayerDetail) public {
        require(keccak256(_prayerTitle) != keccak256(""));
        require(keccak256(_prayerDetail) != keccak256(""));
        uint noOfPrayers = thePrayerList[msg.sender].length;
        if (noOfPrayers == 0) {
            PrayerData memory pd = PrayerData(_prayerTitle, _prayerDetail, false, 1, now, 0);
            thePrayerList[msg.sender].push(pd);
            thePrayerLinks[totalNumberOfPrayers] = PrayerLinkData(msg.sender, 0);
            numberOfPrayerMakers = numberOfPrayerMakers.add(1);
            totalNumberOfPrayers = totalNumberOfPrayers.add(1);
            PrayerAdded(msg.sender, _prayerTitle, _prayerDetail);
        } else {
            PrayerData[] storage prayerMakerPrayers = thePrayerList[msg.sender];
            uint length = prayerMakerPrayers.push(PrayerData(_prayerTitle, _prayerDetail, false, thePrayerList[msg.sender].length, now, 0));
            thePrayerLinks[totalNumberOfPrayers] = PrayerLinkData(msg.sender, length.sub(1));
            totalNumberOfPrayers = totalNumberOfPrayers.add(1);
            PrayerAdded(msg.sender, _prayerTitle, _prayerDetail);
        }
    }

    function getNumberOfPrayersByAddress(address _address) public view returns (uint) {
        require(_address != 0x0);
        return thePrayerList[_address].length;
    }

    function getTheNumberOfPrayerMakers() public view returns (uint) {
        return numberOfPrayerMakers;
    }

    function incrementPrayer(address prayerAddress, uint prayerIndex) public {
        require(thePrayerList[prayerAddress].length > 0);
        thePrayerList[prayerAddress][prayerIndex].prayerCount = thePrayerList[prayerAddress][prayerIndex].prayerCount.add(1);
        PrayerIncemented(prayerAddress, prayerAddress, prayerIndex);
    }

    function answerPrayer(address prayerAddress, uint prayerIndex) public returns (uint) {
        require(prayerAddress == msg.sender);
        require(thePrayerList[msg.sender].length > 0);
        require(thePrayerList[msg.sender][prayerIndex].answered == false);
        PrayerData storage prayer = thePrayerList[msg.sender][prayerIndex];
        prayer.answered = true;
        prayer.answeredTimestamp = now;
        theAnsweredPrayerLinks[totalNumberOfAnsweredPrayers] = PrayerLinkData(prayerAddress, prayerIndex);
        totalNumberOfAnsweredPrayers = totalNumberOfAnsweredPrayers.add(1);
        PrayerAnswered(prayerAddress, prayer.prayerTitle, prayerIndex);
        return prayer.answeredTimestamp.sub(prayer.timestamp);
    }

    function isPrayerAnswered(address prayerAddress, uint prayerIndex) public view returns (bool) {
        require(thePrayerList[prayerAddress].length > 0);
        return thePrayerList[prayerAddress][prayerIndex].answered;
    }

}
