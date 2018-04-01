module.exports = {
  migrations_directory: "./migrations",
  networks: {
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
