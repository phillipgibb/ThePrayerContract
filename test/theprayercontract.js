var ThePrayerContract = artifacts.require("./ThePrayerContract.sol");

 contract('ThePrayerContract', function(accounts) {
  it("...should send a prayer.", function() {
    var thePrayerContractInstance
    return ThePrayerContract.deployed().then(function(instance) {
      thePrayerContractInstance = instance;
      return thePrayerContractInstance.addPrayer("Help", "We all need to Pray", {from : accounts[0]});
    }).then(function(txResult) {
      assert.equal(txResult.logs[0].event, "PrayerAdded", "The Log-Event should be PrayerAdded");
      return thePrayerContractInstance.getNumberOfPrayers.call(accounts[0], {from : accounts[0]});
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
      return thePrayerContractInstance.addPrayer("Help", "We all need to Pray", {from : accounts[1]});
    }).then(function(txResult) {
      assert.equal(txResult.logs[0].event, "PrayerAdded", "The Log-Event should be PrayerAdded");
      return thePrayerContractInstance.answerPrayer(accounts[1], 0, {from : accounts[1]});
    }).then(function(txResult) {
      assert.equal(txResult.logs[0].event, "PrayerAnswered", "The Log-Event should be PrayerAnswered");
      return thePrayerContractInstance.isPrayerAnswered.call(accounts[1], 0);
    }).then(function(answered) {
      console.log("answered: " + answered);
      assert.equal(answered, true, "The Pray should be answered.");
    });
  });

});
