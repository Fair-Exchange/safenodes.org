var cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    jayson         = require('jayson'),
    bodyParser      = require('body-parser');


var options = {
    //  port of rpc server (int) or docker container port
    port: 8776,
    // string domain name or ip of rpc server, default '127.0.0.1'
    // If its is domain name(https://abc.com),then use abc.com as the host name
    host: '127.0.0.1',
    // string with default path for procedure, default '/'
    path: '/',
    // boolean false to turn rpc checks off, default true
    strict: true,
    //HTTP methods get,post,put etc
    method: 'POST',
    // set the header for the call,Here we are setting the authorization
    headers: {

    },
    // JSON RPC version 1,If it is JSON RPC call version 2 then put 2
    version: 1
};

var client = jayson.client.http(
    options
);

// Prepare body before send request
console.log(options);

// Invoke procedure_name('Parameters for the procedure','Parameter2');
client.request('encryptwallet', ['Parameter2'], function (err, response) {
    if (err) {
        // If any err while making the call
        console.log(err.name, err);
    } else {
        console.log("Success ", response);
    }
});




