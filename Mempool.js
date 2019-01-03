const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const TimeoutRequestsWindowTime = 5*60*1000;    // 5 minutes

class Mempool {

    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
    }

    addRequestValidation(request) {
        // store only one request of the address
        this.mempool.push(request)
        this.setTimeOut(request)

        let updatedReq = {}
        console.log(new Date().getTime())
        updatedReq.requestTimeStamp = new Date().getTime()
        console.log(updatedReq.requestTimeStamp)
        updatedReq.walletAddress = request.address
        let timeElapse = new Date().getTime() - request.requestTimeStamp
        console.log("timeElapse: " + timeElapse)
        let timeLeft = TimeoutRequestsWindowTime - timeElapse
        console.log("timeLeft: " + timeLeft)
        updatedReq.validationWindow = timeLeft
        updatedReq.message = request.address + ":" + request.requestTimeStamp
                            + ":starRegistry"
        console.log("request.requestTimeStamp " + request.requestTimeStamp + 
            " updatedReq.walletAddress " + updatedReq.walletAddress + 
            " timeLeft " + timeLeft)
        return updatedReq
    }

    setTimeOut(request) {
        let self = this;
        this.timeoutRequests[request.address] = setTimeout(function() { 
            self.removeValidationRequest(request.address)
        }, TimeoutRequestsWindowTime)
        console.log("Added timeout for this request")
    }

    removeTimeOut() {
        self.timeoutRequests[request.address] = null
    }

    removeValidationRequest(request) {
        console.log("Removing request for address: " + address)
        this.mempool.pop(request)
    }

    validateRequest() {

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
        this.verifyTimeLeft()
        // bitcoinMessage.verify()
    }

}

module.exports.Mempool = Mempool;