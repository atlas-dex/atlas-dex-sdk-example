const axios = require("axios");
const { ethers, Wallet } = require("ethers");
const Web3 = require("web3");
let EVM_WALLET_PRIVATE_ADDRESS = process.env.EVM_WALLET_PRIVATE_ADDRESS;
let BASE_URL = process.env.BASE_URL;

const performCrossChainEVMToEVM = async function performCrossChainEVMToEVM() {
  try {
    let evmProvider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    let evmWallet = new Wallet(EVM_WALLET_PRIVATE_ADDRESS, evmProvider);
    const { data: quoteData } = await axios({
      method: "POST",
      url: `${BASE_URL}/routes`,
      data: {
        fromAmount: "0.01",
        fromChainId: 56,
        fromTokenAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        toChainId: 137,
        toTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        slippage: 0.5,
        fromAccountAddress: evmWallet.address, //Ethereum
        toAccountAddress: evmWallet.address, //Ethereum
      },
    });
    const quote = quoteData.routes[0];
    for (const action of quote.actions) {
      const { data: swapData } = await axios({
        method: "POST",
        url: `${BASE_URL}/swap`,
        data: {
          route_id: quote.route_id,
          action,
        },
      });
      let gasPrice = await evmProvider.getGasPrice();
      const tx = {
        to: swapData.data.to,
        value: swapData.data.value,
        data: swapData.data.data,
        gasPrice,
      };
      const result = await evmWallet.sendTransaction(tx);
      await result.wait();
      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  performCrossChainEVMToEVM,
};
