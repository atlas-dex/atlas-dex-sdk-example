const axios = require("axios");
const { ethers, Wallet } = require("ethers");
const EVM_WALLET_PRIVATE_ADDRESS = process.env.EVM_WALLET_PRIVATE_ADDRESS;
const BASE_URL = process.env.BASE_URL;

const providerUrls = {
  250 : "https://rpc.ftm.tools/",
  137 : "https://rpc-mainnet.maticvigil.com/",
}
const performCrossChainEVMToEVM = async function performCrossChainEVMToEVM() {
  try {

    const fromToken = {
      fromChainId: 250,
      fromTokenAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      fromAmount: "0.001", // In decimals
    }

    const toToken = {
      toChainId: 137,
      toTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    }
    const fromTokenProvider = new ethers.providers.JsonRpcProvider(
      providerUrls[fromToken.chainId]
    );
    const fromTokenWallet = new Wallet(EVM_WALLET_PRIVATE_ADDRESS, fromTokenProvider);

    const toTokenProvider = new ethers.providers.JsonRpcProvider(
      providerUrls[toToken.chainId]
    );
    const toTokenWallet = new Wallet(EVM_WALLET_PRIVATE_ADDRESS, toTokenProvider);

    const { data: quoteData } = await axios({
      method: "POST",
      url: `${BASE_URL}/routes`,
      data: {
        ...fromToken,
        ...toToken,
        slippage: 0.5,
        fromAccountAddress: fromTokenWallet.address, // User Wallet Address (Optional)
        toAccountAddress: toTokenWallet.address, // User Wallet Address (Optional)
      },
    });

    const { actions, route_id } = quoteData.routes[0]; // assume we select top route provided by api.

    let hash = null;
    // iterating over actions and performing them onchain.
    for (const action of actions) {
      console.log(action);
      const options = {
        method: "POST",
        url: `${BASE_URL}/swap`,
        data: {
          route_id,
          action,
          hash,
        },
      };
      
      const { data: swapData } = await axios(options);

      const provider = new ethers.providers.JsonRpcProvider(
        providerUrls[swapData.data.chainId]
      );

      const wallet = new Wallet(EVM_WALLET_PRIVATE_ADDRESS, provider);

      let gasPrice = await provider.getGasPrice();
      const tx = {
        to: swapData.data.to,
        value: swapData.data.value,
        data: swapData.data.data,
        gasPrice,
      };


      const result = await wallet.sendTransaction(tx);
      hash = result.hash;
      
      let confirmationsForBlock = 1;
      if (action === "LOCK_EVM") {
        confirmationsForBlock = 15;
      }

      console.log(`Transaction Broadcasted : ${hash}.  Now Waiting for ${confirmationsForBlock} blocks to go to next step.`);


      await result.wait(confirmationsForBlock); //  we need to wait for blocks confirmation

      console.log("ACTION COMPLETED : ", action, hash);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  performCrossChainEVMToEVM,
};
