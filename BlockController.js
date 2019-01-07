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
        this.getBlockByHash()
        this.postNewBlock()
        this.requestValidation()
        this.validate()
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        let self = this;
        this.app.get("/block/:index", (req, res) => {
            let index = req.params.index
            console.log("Getting block for index: " + index)

            // this serves as an optimization as we dont even
            // query the DB if index of the block to GET is -ve.
            if(index < 0) {
                res.send("Invalid block height. Cannot be negative")
            } else {
                self.myBlockChain.getBlockHeight().then((height) => {
                    console.log("height of the chain: " + height);
                    if(index > height) {
                        res.send("Invalid block height")
                    } else {
                        self.myBlockChain.getBlock(index).then((block) => {
                            let blockJson = JSON.parse(block)
                            res.status(200).send(blockJson)
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

            // Verify if the request validation exists and if it is valid
            // this will check existance of this request in the 
            // validRequests array as well as if it has timed out of 30 minutes
            let isValidRequest = self.myMempool.verifyAddressRequest(block);

            if (typeof block.body === 'undefined'
                || !block.body || block.body === "") {
                res.send("No data for block. block.body: " + block.body)
            } else if(!isValidRequest) {
                res.status(400).send("Request not found or timed out");
            } else {
                let starStory = block.body.star.story
                console.log("story before: " + starStory)
                block.body.star.story = Buffer(starStory).toString('hex')
                console.log("story after: " + block.body.star.story)
                self.myBlockChain.addBlock(block).then((result) => {
                    result.body.star.storyDecoded = hex2ascii(result.body.star.story);
                    res.status(201).send(result);
                });
            }
        });
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

    getBlockByHash() {
        let self = this
        self.app.get("/stars/:hashWithColon", (req, res) => {
            // parse the hash from the url
            let hashWithColon = req.params.hashWithColon
            // console.log("Getting block for index: " + hashWithColon)
            let hash = hashWithColon.toString().split(":")[1]
            self.myBlockChain.getBlockByHash(hash).then((block) => {
                block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                res.status(200).send(block)
            }).catch((err) => {
                console.log(err);
                if (err.notFound) {
                    res.status(404).send(err)
                } else {
                    res.status(400).send(err)
                }
            });
        });
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}