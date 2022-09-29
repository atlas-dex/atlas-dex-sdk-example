const axios = require('axios');
const  {
    Connection,Keypair,Transaction
  } = require('@solana/web3.js');
const { Wallet } = require("@project-serum/anchor");
const bs58 = require ('bs58');
const SOLANA_WALLET_PUBLIC_ADDRESS = process.env.SOLANA_WALLET_PUBLIC_ADDRESS;
const SOLANA_WALLET_PRIVATE_ADDRESS = process.env.SOLANA_WALLET_PRIVATE_ADDRESS;
const SOLANA_RPC = 'https://autumn-palpable-hexagon.solana-mainnet.discover.quiknode.pro/';

const performSolToSolSWAP =  async function performSolToSolSWAP () {
    try{
        let routeData
        try {
            const options = {
                method: 'POST',
                url:   'http://35.179.82.212:4000/api/routes',
                data: {
                    fromAmount: '0.01',
                    fromChainId: 101,
                    fromTokenAddress: 'HJbNXx2YMRxgfUJ6K4qeWtjatMK5KYQT1QnsCdDWywNv',
                    toChainId: 101,
                    toTokenAddress: 'EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o',
                    slippage: 0.5,
                    fromAccountAddress: process.env.SOLANA_WALLET_PUBLIC_ADDRESS, //SOLANA
                    toAccountAddress: process.env.SOLANA_WALLET_PUBLIC_ADDRESS, //SOLANA
                  }
              };
             const data = await axios(options);
             routeData = data.data;
        }
        catch (e) {
            console.log('error at http call', e);
        }

        
        //Data is an array and jupiter return 3 routes we are using the first route
        const quote = routeData.routes[0];
        const routeId = quote.route_id;
        //This call will perform the first step of a route and return the transaction
        let firstStepTransaction ;
        try {
            const options = {
                method: 'POST',
                url:   'http://35.179.82.212:4000/api/swap',
                data: { route_id: routeId, walletkey: SOLANA_WALLET_PUBLIC_ADDRESS }
              };
             const data = await axios(options);
             firstStepTransaction = data.data;
        }
        catch (e) {
            console.log('error at http call', e);
        }

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
        let transaction;
        try {
            const { setupTransaction, swapTransaction, cleanupTransaction } = firstStepTransaction.data[0];
            transaction = new Transaction();
    
            for (let serializedTransaction of [
                setupTransaction,
                swapTransaction,
                cleanupTransaction,
            ].filter(Boolean)) {
                // get transaction object from serialized transaction
                transaction.add(
                    Transaction.from(Buffer.from(serializedTransaction, 'base64')),
                );
            }
        }
        catch (e) {
            console.log('error at swap sol transaction: ', e);
        }
        const txid = await connection.sendTransaction(
            transaction,
            [wallet.payer],
            {
              skipPreflight: true,
            },
          );
          const hash = txid
          await connection.confirmTransaction(txid);
          let result
          try {
            const options = {
                method: 'POST',
                url:   'http://35.179.82.212:4000/api/swap',
                data: {
                    route_id: routeId,
                    walletkey: SOLANA_WALLET_PUBLIC_ADDRESS,
                    hash: hash,
                  }
              };
             const data = await axios(options);
             result = data.data;
        }
        catch (e) {
            console.log('error at http call', e);
        }
          console.log('Swap Performed successfully', result);
    }
    catch(e) {
        console.log(e);
    }
    
}
module.exports = {
    performSolToSolSWAP
}