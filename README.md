# Atlas Dex Sdk Examples

The demo of our sdk executes following use cases
1. SOL to SOL 
2. EVM to EVM same Chain
3. EVM to EVM cross chain

# Example Setup

Clone the repository https://github.com/atlas-dex/atlas-dex-sdk-example.git
Rename .evn-example file to .env  and update the required keys

Use follosing value for base url.
```bash
BASE_URL =
```

# 1. SOLANA to SOLANA

## Get Quote /routes 

Sample output
```bash
{
    "routes": [
        {
            "route_id": "92519a24-897d-4ef7-a644-485bcd3dee54",
            "inAmount": 10000000,
            "outAmount": 2162734017,
            "priceImpact": -0.02083,
            "steps": [
                "SWAP_SOLANA"
            ]
        },
        {
            "route_id": "38f9d67f-655f-40d7-81df-a8dcf03954fd",
            "inAmount": 10000000,
            "outAmount": 2149140000,
            "priceImpact": -0.021,
            "steps": [
                "SWAP_SOLANA"
            ]
        }
    ],
    "errors": []
}
```

## Get Swap Transaction /swap

Sample Output
```bash
{
    "message": "Sign Transaction and Send Hash",
    "data": {
        "chainId": 101,
        "txs": [
            "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAkcWWHrY2Y38rvdTNsEUXVekQfjMYXLnBeF8e4NhUhnkUQQRZUeQo8PyLxkYY35mL/ZO30pPSgcWMDpUuJ3auZJeCZl97b2E1RAaX2mnY1JBa9hP8tDBemJ1Evd0lG0Z6DjIgMC9HSScDlyCgvFR24IkeMXCbrbmxpqme7K4Mw3Rz83tnZZBaMu5w0BJfnoiJn9S8dN64WSFd20MpgcZB9Uezs8T6yweJbco6S/Fvq2FFGFCTWEM0i0IAsCdSSMEwNOPGnLo1P0ScfipO1Y73yILBN4+2TLqUrvHsYqofZz7dtEovP2eEMKGjmNw1Pl1qgHkDWp5qqPkTB0HT7wqD53JE/n1DDUmigeGV0JMbPYFE30QbQA2iOiRfJti1wKWGExgPvMeuEPVakRIW6i24aJ/aKXTMh0in03COtcvSTbsjGMRVISFahxhuGAwR/o78Ywit0jRqe53fp8vsOkAeGEQ5bpryrsiIqMxNfcdyEOT5z/RL/qVKQWxmjLtvpWB589qQr+ZPqR4vr0S15SwJpk00Mh7+0RROcaLb7JiR4nbhe0X1SPJO1bPYAZWLDoXLtvuSVL/rHU4KO9hdcsKWdM4br59qSe4EI0mmAyq8r2INUC+8eJd0ipfMSCDr7XA+SJtwhAH1WNoes8VRx5oIc93ubdcemmbTJiKeduRvioE8PltIcV08mqYFjPBIuzqoyjOaBdhADcfhxB+6xDEdFvFvAyXgwHePZZ0pHB7oVJlsQeP6FElkKKh7BXI/aG9SFf8sJtSKAO2mohApv3PxTyLHEgFdrP8M9uD69577Zrulgo/QYQdjEBkKvEPyKzUVmw7CxmxAcftA8ROAKLalNn1kFXsFgPMcX85EpiWC28+deO51lDoISjk7NQNo0iiZMIS9lJxDYCwz8gd5DtFqNSTKG5l1zxIaKpDP/sffi2is2FDy1uAqR6+CTQmradxC1wyyjL+iSft+5XudJWwSdi7/w8v0x/jjkc1tySR7wSP2lhs0TbmojPCJbjwin0QIy0BHnVH6nNSvb3qwqwbkgtxkwyjapZJyq+L06YgldeDngFLso2h2OllV9ic05A53KXg4jsK9j1DGvyI/ItJHtCrgbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpBwcvNCrmMP6T7EmFZ5Mxx1iQuIm2pm0eCo0luEtoYIMPjZeChayRoaiSZ051Ys2JFnUCFbfSe/rE8AK+UkdNVgMYAgMPCORVuXBOT00CGAsZGxoTABEPBgcJEhof+Dzi16g3xwGAlpgAAAAAAAAAAAAAAAAAABgTFRoQFAILBBYIAQ4NBQoXDwwAAxJF42Jd7crfjADbskOAAAAAAAA="
        ]
    },
    "action": "SWAP_SOLANA",
    "error": [
        null
    ]
}
```