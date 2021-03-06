/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.get(key, function(err, block) {
                if (err) {
                    reject("Not found in DB! for key: " + key);
                } else {
                    resolve(block);
                }
            });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // adding value to DB as a string instead of an object.
            self.db.put(key, JSON.stringify(value), function (err, value) {
                if (err) {
                  if (err.notFound) {
                    // handle a 'NotFoundError' here
                    reject("Not found");
                  }
                  // I/O or other error, pass it up the callback chain
                  reject(err);
                }
               
                resolve("Added value to DB successuflly");
              });
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject) {
            let dataSet = [];
                self.db.createReadStream()
                .on('data', function (data) {
                    dataSet.push(data);
                })
                .on('error', function (err) {
                    // reject with error
                    reject(err);
                })
                .on('close', function () {
                    // resolve with the count value
                    resolve(dataSet.length);
                });
            });
    }

    // method to return the block by hash
    getBlockByHash(hash) {
        console.log("hash: " + hash)
        let self = this;
        return new Promise(function(resolve, reject) {
            let block = null;
                self.db.createReadStream()
                .on('data', function (data) {
                    // console.log(data)
                    let blockData = JSON.parse(data.value)
                    // let blockData = data.value
                    if(blockData.hash === hash) {
                        block = blockData;
                    }
                })
                .on('error', function (err) {
                    // reject with error
                    reject(err);
                })
                .on('close', function () {
                    // resolve with the count value
                    resolve(block);
                });
            });
    }

    // method to return the block by hash
    getBlockByAddress(address) {
        console.log("address: " + address)
        let self = this
        return new Promise(function(resolve, reject) {
            let blocks = [];
                self.db.createReadStream()
                .on('data', function (data) {
                    // console.log(data)
                    let blockData = JSON.parse(data.value)
                    if(blockData.address === address) {
                        blocks.push(blockData);
                    }
                })
                .on('error', function (err) {
                    // reject with error
                    reject(err);
                })
                .on('close', function () {
                    // resolve with the count value
                    resolve(blocks);
                });
            });
    }
}

module.exports.LevelSandbox = LevelSandbox;