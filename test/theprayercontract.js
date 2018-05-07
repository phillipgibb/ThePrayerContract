var ThePrayerContract = artifacts.require("./ThePrayerContract.sol");


ThePrayerContract.web3.eth.getGasPrice(function(error, result){ 
  var gasPrice = Number(result);
  console.log("Gas Price is " + gasPrice + " wei"); // "10000000000000"

  // Get Contract instance
  ThePrayerContract.deployed().then(function(instance) {

      // Use the keyword 'estimateGas' after the function name to get the gas estimation for this particular function 
      return instance.addPrayer.estimateGas("Help", "We all need to Pray", Date.now());

  }).then(function(result) {
      var gas = Number(result);

      console.log("gas estimation = " + gas + " units");
      console.log("gas cost estimation = " + (gas * gasPrice) + " wei");
      console.log("gas cost estimation = " + ThePrayerContract.web3.fromWei((gas * gasPrice), 'ether') + " ether");
  });
});


 contract('ThePrayerContract', function(accounts) {
  it("...should send a prayer.", function() {
    var thePrayerContractInstance
    var gasPrice;
    return ThePrayerContract.deployed().then(function(instance) {
      thePrayerContractInstance = instance;
      return thePrayerContractInstance.addPrayer("Help", "We all need to Pray", Date.now(), {from : accounts[0]});
    }).then(function( txResult) {
      assert.equal(txResult.logs[0].event, "PrayerAdded", "The Log-Event should be PrayerAdded");
      return thePrayerContractInstance.getTotalNumberOfPrayersByAddress.call(accounts[0], {from : accounts[0]});
    }).then(function(numberOfPrayers) {
      assert.equal(numberOfPrayers, 1, "There should only be one Prayer");
      return thePrayerContractInstance.isPrayerAnswered.call(accounts[0], numberOfPrayers-1, {from : accounts[0]});
    }).then(function(answered) {
      assert.equal(answered, false, "The Pray should not be answered Yet.");
    });
  });

  it("...prayer should be answered.", function() {
    var thePrayerContractInstance
    return ThePrayerContract.deployed().then(function(instance) {
      thePrayerContractInstance = instance;
      return thePrayerContractInstance.addPrayer("Help", "We all need to Pray", Date.now(), {from : accounts[0]});
    }).then(function(txResult) {
      assert.equal(txResult.logs[0].event, "PrayerAdded", "The Log-Event should be PrayerAdded");
      return thePrayerContractInstance.answerPrayer(accounts[0], 0, Date.now(), {from : accounts[0]});
    }).then(function(txResult) {
      assert.equal(txResult.logs[0].event, "PrayerAnswered", "The Log-Event should be PrayerAnswered");
      return thePrayerContractInstance.isPrayerAnswered.call(accounts[0], 0);
    }).then(function(answered) {
      assert.equal(answered, true, "The Pray should be answered.");
    });
  });

  it('...should selfdestruct', function(){
    var thePrayerContractInstance
    return ThePrayerContract.deployed().then(function(instance) {
      thePrayerContractInstance = instance;
      return thePrayerContractInstance.destroy({from : accounts[0]});
    }).then(function(txResult) {
      assert.equal(txResult.logs[0].event, "ContractDestroyed", "The Log-Event should be ContractDestroyed");
    });
  });
});
