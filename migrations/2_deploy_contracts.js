var ThePrayerContract = artifacts.require("./ThePrayerContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ThePrayerContract);
};
