var cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    request         = require('request'),
    bodyParser      = require('body-parser');

// Let configure auth RPC options
let options = {
    url: "http://127.0.0.1:8776",
    method: "POST",
    auth: {
        user: '',        // IMPORTANT : User for RPC request
        pass: ''      // IMPORTANT : Password for RPC request
    },
    json : JSON.stringify({
        "jsonrpc": "1.0",'agent': 'bitcoinrpc', "id" : "Cool", "method": "encryptwallet", "params": ["User password"]
    }),


    body : JSON.stringify( {"jsonrpc": "1.0",'agent': 'bitcoinrpc', "id" : "Cool", "method": "encryptwallet", "params": ["User password"]})
};

// Prepare body before send request
console.log(options);

// Launch RPC request
request(options, (error, response, body) => {

    console.log('Request send');

    if (error) {
        console.error('An error has occurred: ', error);

        // Reply to user
        return null;
    } else {

        console.log('Post successful: response: ', body);

        //const out = JSON.parse(body);

        // Reply to user
        return null;
    }
});
