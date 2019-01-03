const BlockChain = require('./BlockChain.js')
const Block = require('./Block.js')
const bitcoinMessage = require('bitcoinjs-message'); 

// Constants
// const TimeoutRequestsWindowTime = 5*60*1000    // 5 minutes
const TimeoutRequestsWindowTime = 1*60*1000    // 1 minutes for testing

class Mempool {

    constructor() {
        this.mempool = []
        this.timeoutRequests = []
        this.mempoolValid = []
    }

    /**
     * Check if the request exists in the Mempool
     * @param {*} request 
     */
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

    getFromMempool(address) {
        let request = this.mempool[address]
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - request.requestTimeStamp
        this.setValidationWindowTime(request, timeElapse)
        return request
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
            console.log("Adding as a new request")
            console.log(new Date().getTime())
            updatedRequest.requestTimeStamp = (new Date().getTime().toString().slice(0,-3))
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - updatedRequest.requestTimeStamp
            this.setValidationWindowTime(updatedRequest, timeElapse)

            updatedRequest.message = updatedRequest.walletAddress + ":" + updatedRequest.requestTimeStamp
            + ":starRegistry"
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

    removeValidationRequest(address) {
        this.mempool[address] = null
        console.log("Removed request from the mempool")
        this.timeoutRequests[address] = null
        console.log("Remove timeout for this request")
    }
    
    verifyTimeLeft(request) {
        let originalRequest = this.mempool[request.address]
        // console.log("originalRequest: " + JSON.stringify(originalRequest))
        return (originalRequest != null
            && originalRequest.validationWindow > 0);
    }

    validateRequestByWallet(request) {
        request = request.body
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

        let response = {}

        if(!request || !request.address) {
            response.message = "Invalid request. Address:" + request.address
            return response
        }

        if(!this.exists(request)) {
            response.message = "Request not found in mempool"
            return response
        }

        // verify time left
        if(!this.verifyTimeLeft(request)) {
            response.message = "Timedout request"
            return response
        }

        // verify signature
        let originalRequest = this.getFromMempool(request.address)
        let isValid = bitcoinMessage.verify(originalRequest.message, 
            request.address, request.signature);
        if(!isValid) {
            response.message = "Not able to verify request with address and signature"
        } else {
            originalRequest.messageSignature = true
            response.status = originalRequest
            response.registerStar = true
        }

        // remove timeout
        this.timeoutRequests[request.address] = null

        // return final object to send
        // to send to the client
        return response
    }

}

module.exports.Mempool = Mempool;