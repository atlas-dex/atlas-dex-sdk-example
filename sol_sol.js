const axios = require("axios");
const { Connection, Keypair, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const { Wallet } = require("@project-serum/anchor");
const bs58 = require("bs58");
const SOLANA_WALLET_PRIVATE_ADDRESS = process.env.SOLANA_WALLET_PRIVATE_ADDRESS;
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
//Declare this key in the .env and check readme for the url
const BASE_URL = process.env.BASE_URL;
console.log(BASE_URL);
const performSolToSolSWAP = async function performSolToSolSWAP() {
  try {
    //Setup a Solana Wallet
    //Create a .env file and use the key name SOLANA_WALLET_PRIVATE_ADDRESS=YOUR_SOLANA_ACCOUNT_PRIVATE_KEY
    const wallet = await new Wallet(
      Keypair.fromSecretKey(bs58.decode(SOLANA_WALLET_PRIVATE_ADDRESS || ""))
    );

    // Get Quote Data from /routes endpoint
    const { data: quoteData } = await axios({
        method: "POST",
        url: `${BASE_URL}/routes`,
        data: {
          fromAmount: "0.01",
          fromChainId: 101,
          fromTokenAddress: "HJbNXx2YMRxgfUJ6K4qeWtjatMK5KYQT1QnsCdDWywNv",
          toChainId: 101,
          toTokenAddress: "EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o",
          slippage: 10,
          fromAccountAddress: wallet.publicKey.toBase58(), //SOLANA
          toAccountAddress: wallet.publicKey.toBase58(), //SOLANA
        },
      });

    //Data is an array and jupiter return 3 routes we are using the first route
    const quote = quoteData.routes[0];
    
    // You have a quote now pass the below data to /swap endpoint to get transactions data for Swap Solana
    const { data: swapData } = await axios({
      method: "POST",
      url: `${BASE_URL}/swap`,
      data: {
        route_id: quote.route_id,
        walletkey: wallet.publicKey.toBase58(),
        action: "SWAP_SOLANA",
      },
    });

    //Get solana RPC connection
    const connection = new Connection(SOLANA_RPC);

    //Get the transactions for swap solana
    const { txs } = swapData.data;

    //loop each transaction and broadcast
    for (let serializedTransaction of txs) {
      
      const transaction = Transaction.from(
        Buffer.from(serializedTransaction, "base64")
      );
      const hash = await sendAndConfirmTransaction(connection,
        transaction,
        [wallet.payer],
        {
          skipPreflight: false,
        }
      );
      console.log(`https://solscan.io/tx/${hash}`);
    }
  } catch (e) {
    console.log('Error: ',e);
  }
};
module.exports = {
  performSolToSolSWAP,
};
