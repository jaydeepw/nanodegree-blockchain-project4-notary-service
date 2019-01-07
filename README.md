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
### Get block by `height`

`GET /requestValidation`

Requests a star notarizaiton request validation. This will return some data that
will be needed to be used in next API call

Sample

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