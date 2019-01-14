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
    "requestTimeStamp": "1547449250",
    "validationWindow": 279,
    "message": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV:1547449250:starRegistry"
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
        "requestTimeStamp": "1547449250",
        "validationWindow": 248,
        "message": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV:1547449250:starRegistry",
        "messageSignature": true,
        "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV"
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
    "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV",
    "star": {
          "ra": "13h 03m 33.35sec",
          "dec": "-49° 31’ 38.1”",
          "mag": "4.83",
          "cen": "Cen",
          "story": "My first block before production"
    }
}
```

**Response**
```
{
    "height": 22,
    "time": 1547449366339,
    "previousBlockHash": "f14fb3a565e77938407026dbbf0993c268e2931c7648b7ce77312b5b6dd91258",
    "hash": "e2abdf01c45ff4c67b20792e8db5bec3f6bbf1ca3880d4f1d0d750067b76fada",
    "body": {
        "star": {
            "ra": "13h 03m 33.35sec",
            "dec": "-49° 31’ 38.1”",
            "mag": "4.83",
            "cen": "Cen",
            "story": "4d7920666972737420626c6f636b206265666f72652070726f64756374696f6e",
            "storyDecoded": "My first block before production"
        },
        "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV"
    }
}
```

### Get block by hash

Retireve the block from the blockchain using the hash of the block

`GET /stars/hash:[HASH]`

**Response**
```
{
    "height": 22,
    "time": 1547449366339,
    "previousBlockHash": "f14fb3a565e77938407026dbbf0993c268e2931c7648b7ce77312b5b6dd91258",
    "hash": "e2abdf01c45ff4c67b20792e8db5bec3f6bbf1ca3880d4f1d0d750067b76fada",
    "body": {
        "star": {
            "ra": "13h 03m 33.35sec",
            "dec": "-49° 31’ 38.1”",
            "mag": "4.83",
            "cen": "Cen",
            "story": "4d7920666972737420626c6f636b206265666f72652070726f64756374696f6e",
            "storyDecoded": "My first block before production"
        },
        "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV"
    }
}
```

### Get block by address

Retireve the block from the blockchain using the address of the block.
This API will return all the blocks that have been added using a particular
address.

`GET /stars/address:[ADDRESS]`

**Response**
```
[
    {
        "height": 10,
        "time": 1547443410056,
        "previousBlockHash": "83b0a5c0c736f4358c98a78ca88176dc03c9fb28f928428870c43ce32230be2d",
        "hash": "5481268332618e6bcbc94dbda02a0c210ca0784283548897daa28ee310df2dfc",
        "body": {
            "star": {
                "ra": "13h 03m 33.35sec",
                "dec": "-49° 31’ 38.1”",
                "mag": "4.83",
                "cen": "Cen",
                "story": "4d7920666972737420626c6f636b206265666f72652070726f64756374696f6e",
                "storyDecoded": "My first block before production"
            },
            "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV"
        }
    },
    {
        "height": 11,
        "time": 1547443624653,
        "previousBlockHash": "5481268332618e6bcbc94dbda02a0c210ca0784283548897daa28ee310df2dfc",
        "hash": "388179f931d88089dccca2c76c073a0ac79ca3a38683187909ecb3a482ab9c8c",
        "body": {
            "star": {
                "ra": "13h 03m 33.35sec",
                "dec": "-49° 31’ 38.1”",
                "mag": "4.83",
                "cen": "Cen",
                "story": "4d7920666972737420626c6f636b206265666f72652070726f64756374696f6e",
                "storyDecoded": "My first block before production"
            },
            "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV"
        }
    }
]
```

### Get block by height

Retireve the block from the blockchain by the height of the block.

`GET /block/:height`

**Response**
```
{
    "height": 22,
    "time": 1547449366339,
    "previousBlockHash": "f14fb3a565e77938407026dbbf0993c268e2931c7648b7ce77312b5b6dd91258",
    "hash": "e2abdf01c45ff4c67b20792e8db5bec3f6bbf1ca3880d4f1d0d750067b76fada",
    "body": {
        "star": {
            "ra": "13h 03m 33.35sec",
            "dec": "-49° 31’ 38.1”",
            "mag": "4.83",
            "cen": "Cen",
            "story": "4d7920666972737420626c6f636b206265666f72652070726f64756374696f6e",
            "storyDecoded": "My first block before production"
        },
        "address": "17rsJAF4TyXbbHuasJCXQd8syQ2wkkutwV"
    }
}
```

