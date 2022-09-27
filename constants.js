module.exports = {
BASE_URL : 'http://35.179.82.212:4000/api/',
 ROUTE_ENDPOINT : 'routes',
 SWAP_ENDPOINT : 'swap',
 HTTP_POST : 'POST',
 HTTP_GET : 'GET',
 SOLANA_RPC : 'https://autumn-palpable-hexagon.solana-mainnet.discover.quiknode.pro/',
 SOL_SOL_PARAMS : {
    fromAmount: '0.01',
    fromChainId: 101,
    fromTokenAddress: 'HJbNXx2YMRxgfUJ6K4qeWtjatMK5KYQT1QnsCdDWywNv',
    toChainId: 101,
    toTokenAddress: 'EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o',
    slippage: 0.5,
    fromAccountAddress: process.env.SOLANA_WALLET_PUBLIC_ADDRESS, //SOLANA
    toAccountAddress: process.env.SOLANA_WALLET_PUBLIC_ADDRESS, //SOLANA
  }
}
