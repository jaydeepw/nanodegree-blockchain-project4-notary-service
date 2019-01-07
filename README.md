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

Description

Sample

**Request** `GET /block/1`

**Response**
```
{
    "body": "Data in the block",
    "height": 11,
    "time": 1545736272411,
    "previousBlockHash": "775aced2bceef18970d858b12dce556abcba578e4aad244c174f148d917457e8",
    "hash": "e89a04a161b214d866c2c58b6b36b31f1d79f9708e26924a4c550c688acc6b15"
}
```