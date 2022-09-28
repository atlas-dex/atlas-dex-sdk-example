const axios = require("axios");
const { ethers, Wallet } = require("ethers");
let EVM_WALLET_PRIVATE_ADDRESS = process.env.EVM_WALLET_PRIVATE_ADDRESS;

const performCrossChainEVMToEVM = async function performCrossChainEVMToEVM() {
  try {
    let hash;
    let evmProvider = new ethers.providers.JsonRpcProvider(
      "https://rpc.ftm.tools/"
    );
    let evmWallet = new Wallet(EVM_WALLET_PRIVATE_ADDRESS, evmProvider);
    const { data: quoteData } = await axios({
      method: "POST",
      url: "http://localhost:4000/api/routes",
      data: {
        fromAmount: "0.001",
        fromChainId: 250,
        fromTokenAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
        toChainId: 137,
        toTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        slippage: 0.5,
        fromAccountAddress: evmWallet.address, //Ethereum
        toAccountAddress: evmWallet.address, //Ethereum
      },
    });
    const quote = quoteData.routes[0];
    for (const action of quote.actions) {
      console.log(action);
      if (action === "UNLOCK_EVM") {
        console.log("IN THE IF BLOCK");
        let evmProvider = new ethers.providers.JsonRpcProvider(
          "https://polygon-rpc.com"
        );
        let evmWallet = new Wallet(EVM_WALLET_PRIVATE_ADDRESS, evmProvider);
        const { data: swapData } = await axios({
          method: "POST",
          url: "http://localhost:4000/api/swap",
          data: {
            route_id: quote.route_id,
            hash,
            action,
          },
        });
        let gasPrice = await evmProvider.getGasPrice();
        const tx = {
          to: swapData.data.to,
          value: swapData.data.value,
          data: swapData.data.data,
          gasPrice: gasPrice,
          gasLimit: 500000,
        };
        const result = await evmWallet.sendTransaction(tx);
        await result.wait();
        console.log(result);
      }
      const { data: swapData } = await axios({
        method: "POST",
        url: "http://localhost:4000/api/swap",
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

      if (action === "LOCK_EVM") {
        console.log("IN THE LOCK EVM IF BLOCK");
        hash = result.hash;
        console.log(hash);
        await result.wait(10);
      }

      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  performCrossChainEVMToEVM,
};
