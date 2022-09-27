const axios = require('axios');
const { getHttpResponse } = require('./http-helper');
const  {
    Connection,Keypair
  } = require('@solana/web3.js');
const { Wallet } = require("@project-serum/anchor");
const bs58 = require ('bs58');
const { getSolSwapTransaction } = require('./swap_solana_transaction')
const {HTTP_POST, ROUTE_ENDPOINT, SOL_SOL_PARAMS, SWAP_ENDPOINT, SOLANA_RPC} = require('./constants')
const SOLANA_WALLET_PUBLIC_ADDRESS = process.env.SOLANA_WALLET_PUBLIC_ADDRESS;
const SOLANA_WALLET_PRIVATE_ADDRESS = process.env.SOLANA_WALLET_PRIVATE_ADDRESS;

const performSolToSolSWAP =  async function performSolToSolSWAP () {
    try{
        let routeData = await getHttpResponse(HTTP_POST, ROUTE_ENDPOINT, SOL_SOL_PARAMS);
        //Data is an array and jupiter return 3 routes we are using the first route
        const quote = routeData.routes[0];
        const routeId = quote.route_id;
        //This call will perform the first step of a route and return the transaction
        const firstStepTransaction = await getHttpResponse(HTTP_POST, SWAP_ENDPOINT, { route_id: routeId, walletkey: SOLANA_WALLET_PUBLIC_ADDRESS });
    
        //Get solana RPC connection
        const connection = new Connection(SOLANA_RPC);
        //Setup Solana Wallet
        console.log('seckey', SOLANA_WALLET_PRIVATE_ADDRESS);
        const wallet = await new Wallet(
            Keypair.fromSecretKey(
                bs58.decode((SOLANA_WALLET_PRIVATE_ADDRESS) || ''),
            ),
        );
        console.log(firstStepTransaction);
        const transaction = await getSolSwapTransaction(firstStepTransaction.data[0]);
        const txid = await connection.sendTransaction(
            transaction,
            [wallet.payer],
            {
              skipPreflight: true,
            },
          );
          const hash = txid
          await connection.confirmTransaction(txid);
          const resultHash = await getHttpResponse(HTTP_POST, SWAP_ENDPOINT, {
            route_id: routeId,
            walletkey: SOLANA_WALLET_PUBLIC_ADDRESS,
            hash: hash,
          });
          console.log('Swap Performed successfully', resultHash);
    }
    catch(e) {
        console.log(e);
    }
    
}
module.exports = {
    performSolToSolSWAP
}