module.exports = {
  migrations_directory: "./migrations",
  networks: {
      ropsten: {
          network_id: 3,
          host: '127.0.0.1',
          port: 8545,
          gas: 4000000,
          from: 0x5d33c3d0082f6d6a4a9709617c7d860968580244
    },
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*", // Match any network id
      gas: 5000000
    }
  },
  rpc: {
    host: 'localhost',
    post:8080
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
