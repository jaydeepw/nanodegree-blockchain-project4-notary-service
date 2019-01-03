const BlockChain = require('./BlockChain.js')
const Block = require('./Block.js')
const bitcoinMessage = require('bitcoinjs-message'); 

// Constants
const TimeoutRequestsWindowTime = 5*60*1000    // 5 minutes

class Mempool {

    constructor() {
        this.mempool = []
        this.timeoutRequests = []
        this.mempoolValid = []
    }

    exists(request) {
        for(var key in this.mempool) {
            // console.log("key: " + key);
            if(key == request.address)
                return true
        }

        return false;
    }

    setValidationWindowTime(updatedRequest, timeElapse) {
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse
        updatedRequest.validationWindow = timeLeft
    }

    /**
     * Add a request for validation to mempool
     * @param {*} request 
     */
    addRequestValidation(request) {

        let updatedRequest = {}
        updatedRequest.walletAddress = request.address
        
        if(this.exists(request)) {
            console.log("Request already exists")
            // if same address sends another request,
            // update time left before this request timesout
            // and resent the same
            request = this.mempool[request.address]
            updatedRequest.requestTimeStamp = request.requestTimeStamp
            updatedRequest.message = updatedRequest.walletAddress + ":" + request.requestTimeStamp
                                + ":starRegistry"

            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - updatedRequest.requestTimeStamp
            this.setValidationWindowTime(updatedRequest, timeElapse)

            console.log(request.address)
            console.log(request)
        } else {
            console.log(new Date().getTime())
            updatedRequest.requestTimeStamp = (new Date().getTime().toString().slice(0,-3))
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - updatedRequest.requestTimeStamp
            this.setValidationWindowTime(updatedRequest, timeElapse)

            updatedRequest.message = updatedRequest.walletAddress + ":" + updatedRequest.requestTimeStamp
            + ":starRegistry"
            console.log("Adding as a new request")
            this.mempool[request.address] = updatedRequest
            this.setTimeOut(updatedRequest)
        }
        return updatedRequest
    }

    setTimeOut(request) {
        let self = this;
        this.timeoutRequests[request.address] = setTimeout(function() { 
            self.removeValidationRequest(request.address)
        }, TimeoutRequestsWindowTime)
        // console.log("Added timeout for this request")
    }

    removeTimeOut() {
        self.timeoutRequests[request.address] = null
    }

    removeValidationRequest(request) {
        console.log("Removing request for address: " + address)
        this.mempool.pop(request)
    }

    verifyTimeLeft(request) {
        return (request.validationWindow > 0);
    }

    validateRequestByWallet(request) {
        // Output
        /* {
            "registerStar": true,
            "status": {
                "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
                "requestTimeStamp": "1541605128",
                "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
                "validationWindow": 200,
                "messageSignature": true
            }
        } */

        let invalidResponse = {}

        // verify time left
        if(!this.verifyTimeLeft()) {
            invalidResponse.message = "Timedout request"
        }

        // verify signature
        /* let isValid = bitcoinMessage.verify(message, address, signature);
        if(!isValid) {
            invalidResponse.message = "Invalid request"
        } */

        // remove timeout
    }

}

module.exports.Mempool = Mempool;