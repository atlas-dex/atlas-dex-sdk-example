# Atlas DEX | DeFi Cross-chain Aggregator SDK Integration Examples


## Setup

Clone the repository https://github.com/atlas-dex/atlas-dex-sdk-example.git
Rename .evn-example file to .env  and update the required keys

Use following value for base url.
```bash
BASE_URL = https://api.atlasdex.finance
```

### Get Quotes/Routes 
Sample Input 
```bash
await axios({
        method: "POST",
        url: `${BASE_URL}/routes`,
        data: {
          fromAmount: "0.01",
          fromChainId: 101, // Token Chain
          fromTokenAddress: "HJbNXx2YMRxgfUJ6K4qeWtjatMK5KYQT1QnsCdDWywNv",// Token Address
          toChainId: 56, // Token Chain
          toTokenAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",// Token Address
          slippage: 1.5, // In Percentage like 1.5 shows 1.5%
          fromAccountAddress: YOUR_WALLET_ADDRESS, // Optional 
          toAccountAddress: YOUR_WALLET_ADDRESS, // Optional
        },
      });
```
Sample output
```bash
{
    "routes": [
        {
            "route_id": "d4484ea6-24e9-4937-a87e-0cff45ec9bba",
            "inAmount": 10000000,
            "outAmount": 2171540119,
            "priceImpact": -0.02083,
            "actions": [
                "SWAP", "LOCK", "BRIDGE", "UNLOCK"
            ]
        },
        {
            "route_id": "71294b87-2d87-4d6b-b9f6-d6726efcfe14",
            "inAmount": 10000000,
            "outAmount": 2159136000,
            "priceImpact": -0.021,
            "actions": [
                "SWAP", "LOCK", "BRIDGE", "UNLOCK"
            ]
        }
    ],
    "errors": []
}
```

### Get Swap Unsigend Transactions
Sample Input
#### Loop over actions you get in qoutes api and pass it in below swap api

```bash
await axios({
      method: "POST",
      url: `${BASE_URL}/swap`,
      data: {
        route_id: ROUTE_ID_FROM_QOUTE_REQUEST,
        walletkey: YOUR_WALLET_ADDRESS,
        action: EACH_ACTION_FROM_QOUTE_REQUEST,
      },
    });
```
Sample Output
#### Response in case of solana chain action
```bash
{
    "data": {
        "chainId": 101,
        "txs": [
            "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAkcWWHrY2Y38rvdTNsEUXVekQfjMYXLnBeF8e4NhUhnkUQQRZUeQo8PyLxkYY35mL/ZO30pPSgcWMDpUuJ3auZJeCZl97b2E1RAaX2mnY1JBa9hP8tDBemJ1Evd0lG0Z6DjIgMC9HSScDlyCgvFR24IkeMXCbrbmxpqme7K4Mw3Rz83tnZZBaMu5w0BJfnoiJn9S8dN64WSFd20MpgcZB9Uezs8T6yweJbco6S/Fvq2FFGFCTWEM0i0IAsCdSSMEwNOPGnLo1P0ScfipO1Y73yILBN4+2TLqUrvHsYqofZz7dtEovP2eEMKGjmNw1Pl1qgHkDWp5qqPkTB0HT7wqD53JE/n1DDUmigeGV0JMbPYFE30QbQA2iOiRfJti1wKWGExgPvMeuEPVakRIW6i24aJ/aKXTMh0in03COtcvSTbsjGMRVISFahxhuGAwR/o78Ywit0jRqe53fp8vsOkAeGEQ5bpryrsiIqMxNfcdyEOT5z/RL/qVKQWxmjLtvpWB589qQr+ZPqR4vr0S15SwJpk00Mh7+0RROcaLb7JiR4nbhe0X1SPJO1bPYAZWLDoXLtvuSVL/rHU4KO9hdcsKWdM4br59qSe4EI0mmAyq8r2INUC+8eJd0ipfMSCDr7XA+SJtwhAH1WNoes8VRx5oIc93ubdcemmbTJiKeduRvioE8PltIcV08mqYFjPBIuzqoyjOaBdhADcfhxB+6xDEdFvFvAyXgwHePZZ0pHB7oVJlsQeP6FElkKKh7BXI/aG9SFf8sJtSKAO2mohApv3PxTyLHEgFdrP8M9uD69577Zrulgo/QYQdjEBkKvEPyKzUVmw7CxmxAcftA8ROAKLalNn1kFXsFgPMcX85EpiWC28+deO51lDoISjk7NQNo0iiZMIS9lJxDYCwz8gd5DtFqNSTKG5l1zxIaKpDP/sffi2is2FDy1uAqR6+CTQmradxC1wyyjL+iSft+5XudJWwSdi7/w8v0x/jjkc1tySR7wSP2lhs0TbmojPCJbjwin0QIy0BHnVH6nNSvb3qwqwbkgtxkwyjapZJyq+L06YgldeDngFLso2h2OllV9ic05A53KXg4jsK9j1DGvyI/ItJHtCrgbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpBwcvNCrmMP6T7EmFZ5Mxx1iQuIm2pm0eCo0luEtoYIMPjZeChayRoaiSZ051Ys2JFnUCFbfSe/rE8AK+UkdNVgMYAgMPCORVuXBOT00CGAsZGxoTABEPBgcJEhof+Dzi16g3xwGAlpgAAAAAAAAAAAAAAAAAABgTFRoQFAILBBYIAQ4NBQoXDwwAAxJF42Jd7crfjADbskOAAAAAAAA="
        ]
    },
    "error": [
    ]
}
```
#### Response in case of EVM
```bash
{
    "data": {
        "chainId": 137,
        "nonce": 275,
        "to": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "value": 0,
        "data": "0x095ea7b3000000000000000000000000c180f11dbef1534ef29d1a1b34ab36dfc1ab76a20000000000000000000000000000000000000000000000000000000000002710"
    },
    "error": [
    ]
}
```
