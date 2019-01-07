# nanodegree-blockchain-project4-notary-service

My 4th project while pursuing [Blockchain Developer Nanodegree](https://in.udacity.com/course/blockchain-developer-nanodegree--nd1309) from Udacity.

In this project, one can notarize their favorite star on the blockchain
This project is a webservice that creates a REAL blockchain. The blocks are stored
on the chain using [LevelDB](https://github.com/google/leveldb). It lets
you interact with the blockchain using a RESTful API.

### Getting started
- Clone this repository and `cd` into it from your terminal
- Type `npm install`
- Type `node app.js`
- Your server will start locally on port `8000`

## Endpoint documentation
### Request validation for star notarization

Requests a star notarizaiton request validation. This will return some data that
will be needed to be used in next API call

`POST /requestValidation`


**Request**
```
{
	"address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV"
}
```

**Response**
```
{
    "walletAddress": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV",
    "requestTimeStamp": "1546856892",
    "validationWindow": 300,
    "message": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV:1546856892:starRegistry"
}
```

### Signing the transaction

Sign the `message` field received in the response of the previous request
using wallet like Electrum and send it as a prameter in the request body.

`POST /message-signature/validate`


**Request**
```
{
	"address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV",
	"signature": "you-signature-using-wallet"
}
```

**Response**
```
{
    "status": {
        "walletAddress": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV",
        "requestTimeStamp": "1546857441",
        "validationWindow": 282,
        "message": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV:1546857441:starRegistry",
        "messageSignature": true
    },
    "registerStar": true
}
```

### Add block with star data to blockchain

Add the star data to the blockchain as shown in the request below.

`POST /block`


**Request**
```
{
    "body" : {
        "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV",
        "star": {
              "ra": "13h 03m 33.35sec",
              "dec": "-49° 31’ 38.1”",
              "mag": "4.83",
              "cen": "Cen",
              "story": "My first block before production"
        }
	}
}
```

**Response**
```
{
    "body": {
        "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV",
        "star": {
            "ra": "13h 03m 33.35sec",
            "dec": "-49° 31’ 38.1”",
            "mag": "4.83",
            "cen": "Cen",
            "story": "4d7920666972737420626c6f636b206265666f72652070726f64756374696f6e",
            "storyDecoded": "My first block before production"
        }
    },
    "height": 2,
    "time": 1546856454874,
    "previousBlockHash": "cffe3eb2e0d07e5fc9bb57335df196464c4f4d264fc93665abf30f6b3965116f",
    "hash": "fe3eff45c4be645767f31b480bccb19aebd273e460091c17f4ba420297e3cfc4"
}
```

