const   express = require('express'),
        jayson = require('jayson'),
        bodyParser = require('body-parser'),
        app = module.exports = express.Router();

app.use(bodyParser.json());

// Let configure auth RPC options
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

app.post('/', function(req, res) {

    const client = jayson.client.http(
        options
    );

    // Get user password
    const userPassword = req.body.safePass;

    // Check is password is strength or not
    let passwordCheck = false;
    let msg = '';

    // Must have capital letter, numbers and lowercase letters
    const strongRegex = new RegExp(
        '^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$',
        'g');

    // Must have either capitals and lowercase letters or lowercase and numbers
    const mediumRegex = new RegExp(
        '^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$',
        'g');

    // Must be at least 6 characters long
    const okRegex = new RegExp('(?=.{6,}).*', 'g');

    // Check strength
    if (okRegex.test(userPassword) === false) {
        msg = 'Password must be 6 characters long.'
    } else if (strongRegex.test(userPassword)) {
        passwordCheck = true;
    } else if (mediumRegex.test(userPassword)) {
        msg = 'Make your password stronger with more capital letters, more numbers and special characters!'
    } else {
        msg = 'Weak Password, try using numbers and capital letters.'
    }

    // Check if password Strength is cool else... Send error
    if (!passwordCheck) {
        return res.status(200).json(
            {
                "err":true,
                "msg":msg
            }
        );
    } else {

        // Invoke procedure_name('Parameters for the procedure','Parameter2');
        return client.request('encryptwallet', [userPassword], function (err, response) {
            if (err) {
                // If any err while making the call
                console.error('An error has occurred: ', err);

                // Reply to user
                return res.status(200).json(
                    {
                        "err": true,
                        "msg":'Error during generate wallet, please, try later.'
                    }
                );
            } else {
                // Reply to user
                return res.status(200).json(
                    {
                        data : response
                    }
                );
            }
        });
    }
});
