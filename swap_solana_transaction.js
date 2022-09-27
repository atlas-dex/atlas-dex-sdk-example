const { Transaction } = require("@solana/web3.js");

const getSolSwapTransaction = async function (data)  {
    try {
        const { setupTransaction, swapTransaction, cleanupTransaction } = data;
        let transaction = new Transaction();

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
        return transaction;
    }
    catch (e) {
        console.log('error at swap sol transaction: ', e);
    }
}

module.exports = {
getSolSwapTransaction
}