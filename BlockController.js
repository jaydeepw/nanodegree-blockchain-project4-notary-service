const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii')
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const Mempool = require('./Mempool.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app
        this.myBlockChain = new BlockChain.Blockchain()
        this.myMempool = new Mempool.Mempool()
        this.getBlockByIndex()
        this.getBlockByHashOrAddress()
        this.postNewBlock()
        this.requestValidation()
        this.validate()
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        let self = this;
        this.app.get("/block/:height", (req, res) => {
            let height = req.params.height
            console.log("Getting block for index: " + height)

            // this serves as an optimization as we dont even
            // query the DB if index of the block to GET is -ve.
            if(height < 0) {
                res.send("Invalid block height. Cannot be negative")
            } else {
                self.myBlockChain.getBlockHeight().then((currentHeight) => {
                    console.log("height of the chain: " + currentHeight);
                    if(height > currentHeight) {
                        res.send("Invalid block height")
                    } else {
                        self.myBlockChain.getBlock(height).then((block) => {
                            block = JSON.parse(block)
                            let newResult = this.getCorrectedResponse(block)
                            res.status(200).send(newResult)
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    if (err.notFound) {
                        res.status(404).send(err)
                    } else {
                        res.status(400).send(err)
                    }
                });
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        let self = this
        self.app.post("/block", (req, res) => {
            let block = req.body
            console.log("req.body: " + JSON.stringify(block))

            // Verify if the request validation exists and if it is valid.
            // this will check existance of this request in the 
            // validRequests array as well as if it has timed out of 30 minutes
            let isValidRequest = self.myMempool.verifyAddressRequest(block);

            /* if (typeof block.body === 'undefined'
                || !block.body || block.body === "") {
                res.send("No data for block. block.body: " + block.body)
            } else */ if(!isValidRequest) {
                res.status(400).send("Request not found or timed out");
            } else {
                let starStory = block.star.story

                if(block.address == 'undefined'
                    || block.address == "") {
                    res.status(400).send("Address not present");
                }

                if(block.star == 'undefined'
                    || block.star == "") {
                    res.status(400).send("Star data not present");
                }

                if(block.star.ra == 'undefined'
                    || block.star.ra == "") {
                    res.status(400).send("star.ra not present");
                }

                if(block.star.dec == 'undefined'
                    || block.star.dec == "") {
                    res.status(400).send("star.dec not present");
                }

                if(block.star.story == 'undefined'
                    || block.star.story == "") {
                    res.status(400).send("star.story not present");
                }

                console.log("story before: " + starStory)
                block.star.story = Buffer(starStory).toString('hex')
                console.log("story after: " + block.star.story)
                self.myBlockChain.addBlock(block).then((result) => {
                    /* console.log(JSON.stringify(result))
                    result.star.storyDecoded = hex2ascii(result.star.story);
                    result.body = {}
                    result.body.star = result.star
                    delete result.star
                    result.body.address = result.address
                    delete result.address
                    console.log(JSON.stringify(result)) */
                    let newResult = this.getCorrectedResponse(result)
                    res.status(201).send(newResult);
                });
            }
        });
    }

    getCorrectedResponse(result) {
        // Making sure that each time you are 
        // returning a block you need to decode the star’s story
        result.star.storyDecoded = hex2ascii(result.star.story);
        result.body = {}
        result.body.star = result.star
        delete result.star
        result.body.address = result.address
        delete result.address
        console.log(JSON.stringify(result))
        return result
    }

    /**
     * 
     */
    requestValidation() {
        let self = this
        /* this.app.post("/requestValidation", (req, res) => { // Your code 
        }); */

        /*
        todo: input data will be in this format
        {
            "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
        } */
        self.app.post("/requestValidation", (req, res) => {
            let data = req.body
            // console.log("req.body: " + JSON.stringify(data))
            let updatedReq = self.myMempool.addRequestValidation(data);
            res.status(201).send(updatedReq);
        });
    }

    /**
     * 
     */
    validate() {
        let self = this

        /*
        todo: input data will be in this format
        {
            "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
        } */
        self.app.post("/message-signature/validate", (req, res) => {
            let data = req.body
            // console.log("req.body: " + JSON.stringify(data))
            let invalidResponse = self.myMempool.validateRequestByWallet(req);
            res.status(200).send(invalidResponse);
        });
    }

    getBlockByHashOrAddress() {
        let self = this
        self.app.get("/stars/:withColon", (req, res) => {
            // parse the hash from the url
            let withColon = req.params.withColon
            let type = withColon.toString().split(":")[0]
            if(type === "hash") {
                self.getBlockByHash(withColon, res)
            } else if (type === "address") {
                self.getBlockByAddress(withColon, res)
            } else {
                console.error("Invalid type: " + type)
            }
        });
    }

    getBlockByHash(withColon, res) {
        let self = this
        let hash = withColon.toString().split(":")[1]
        self.myBlockChain.getBlockByHash(hash).then((block) => {
            // block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            let result = this.getCorrectedResponse(block)
            res.status(200).send(result)
        }).catch((err) => {
            console.log(err);
            if (err.notFound) {
                res.status(404).send(err)
            } else {
                res.status(400).send(err)
            }
        });
    }

    getBlockByAddress(withColon, res) {
        let self = this
        let address = withColon.toString().split(":")[1]
        console.log("Getting block for address: " + address)
        self.myBlockChain.getBlockByAddress(address).then((blocks) => {
            // Making sure that each time you are 
            // returning a block you need to decode the star’s story
            blocks.forEach(block => {
                // block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                let result = this.getCorrectedResponse(block)
            });
            res.status(200).send(blocks)
        }).catch((err) => {
            console.log(err);
            if (err.notFound) {
                res.status(404).send(err)
            } else {
                res.status(400).send(err)
            }
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}