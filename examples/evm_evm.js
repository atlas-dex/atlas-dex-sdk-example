const axios = require("axios");
const { ethers, Wallet } = require("ethers");
const Web3 = require("web3");
let EVM_WALLET_PRIVATE_ADDRESS = process.env.EVM_WALLET_PRIVATE_ADDRESS;

const performEVMToEVM = async function performEVMToEVM() {
  try {
    let evmProvider = new ethers.providers.JsonRpcProvider(
      "https://rpc.ftm.tools/"
    );
    let evmWallet = new Wallet(EVM_WALLET_PRIVATE_ADDRESS, evmProvider);

    const { data: quoteData } = await axios({
      method: "POST",
      url: `${BASE_URL}/routes`,
      data: {
        fromAmount: "0.01",
        fromChainId: 250,
        fromTokenAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
        toChainId: 250,
        toTokenAddress: "0x049d68029688eabf473097a2fc38ef61633a3c7a",
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
      //Transaction details
      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  performEVMToEVM,
};