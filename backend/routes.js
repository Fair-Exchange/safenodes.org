const   express = require('express'),
        request = require('request'),
        bodyParser = require('body-parser'),
        app = module.exports = express.Router();

app.use(bodyParser.json());

// Let configure auth RPC options
let options = {
    url: "http://127.0.0.1:8771",
    method: "post",
    headers:
        {
            "content-type": "text/plain"
        },
    auth: {
        user: 'ayo',        // IMPORTANT : User for RPC request
        pass: 'ayo123'      // IMPORTANT : Password for RPC request
    }
};

app.post('/api/generateWallet', function(req, res) {

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

        return res.status(200).json(
            {
                //data : out
                data : {
                    "pubkey":"be0feb932cddbcf37f7a482be0a89e530d0416bec8b5acc237936a0159055056",
                    "RS":"NXT-ZXTB-QALH-CERS-8BXYW",
                    "NXT":"7961143348897511209",
                    "btcpubkey":"036950fa523b45afacd5d92748787253efe50ab1ce7868a97273ae5f59fc5f0263",
                    "rmd160":"4984fad8a19c7fae540e0559c736dda5ad1157a1",
                    "BTC":"RFyvi85fv9qoJL5ZJWMt1nZdviBNtnLVtn",
                    "SAFE":"RfKXhENxdLJg7mDeKvhCVuqRZDSKgh7g8n",
                    "result":"success",
                    "handle":"",
                    "myip":"94.237.52.137",
                    "persistent":"be0feb932cddbcf37f7a482be0a89e530d0416bec8b5acc237936a0159055056",
                    "status":"unlocked",
                    "duration":3600,
                    "privkey":"b0fd7e1cc130911f1d483e23049455df361ed516070a8e54cd1947a4280aa041",
                    "BTCwif":"L39kqqQoqw3ZtKYFwxdWtwhKKAuLKxTPrTnuyQogKHXsLDCB4mDd",
                    "KMDwif":"V4XDigPgXJvxKtM7gahzTZU2VgA8FUzjnQns77wTGUWHWQQ9vzQM",
                    "tag":"6837804746000623472"
                }
            }
        );

        // Prepare body before send request
        options.body = JSON.stringify( {"jsonrpc": "1.0", "id": "curltest", "method": "walletpassphrase", "params": [userPassword, 9999999] });

        // Launch RPC request
        request(options, (error, response, body) => {
            if (error) {
                console.error('An error has occurred: ', error);

                // Reply to user
                return res.status(200).json(
                    {
                        "err": true,
                        "msg":'Error during generate wallet, please, try later.'
                    }
                );
            } else {

                const out = JSON.parse(body);

                console.log('Post successful: response: ', out);

                // Reply to user
                return res.status(200).json(
                    {
                        //data : out
                        data : {
                            "pubkey":"be0feb932cddbcf37f7a482be0a89e530d0416bec8b5acc237936a0159055056",
                            "RS":"NXT-ZXTB-QALH-CERS-8BXYW",
                            "NXT":"7961143348897511209",
                            "btcpubkey":"036950fa523b45afacd5d92748787253efe50ab1ce7868a97273ae5f59fc5f0263",
                            "rmd160":"4984fad8a19c7fae540e0559c736dda5ad1157a1",
                            "BTC":"RFyvi85fv9qoJL5ZJWMt1nZdviBNtnLVtn",
                            "SAFE":"RfKXhENxdLJg7mDeKvhCVuqRZDSKgh7g8n",
                            "result":"success",
                            "handle":"",
                            "myip":"94.237.52.137",
                            "persistent":"be0feb932cddbcf37f7a482be0a89e530d0416bec8b5acc237936a0159055056",
                            "status":"unlocked",
                            "duration":3600,
                            "privkey":"b0fd7e1cc130911f1d483e23049455df361ed516070a8e54cd1947a4280aa041",
                            "BTCwif":"L39kqqQoqw3ZtKYFwxdWtwhKKAuLKxTPrTnuyQogKHXsLDCB4mDd",
                            "KMDwif":"V4XDigPgXJvxKtM7gahzTZU2VgA8FUzjnQns77wTGUWHWQQ9vzQM",
                            "tag":"6837804746000623472"
                        }
                    }
                );
            }
        });
    }
});

/*
{
    Return of RPC request example as JSON format
        {
            "pubkey":"be0feb932cddbcf37f7a482be0a89e530d0416bec8b5acc237936a0159055056",
            "RS":"NXT-ZXTB-QALH-CERS-8BXYW",
            "NXT":"7961143348897511209",
            "btcpubkey":"036950fa523b45afacd5d92748787253efe50ab1ce7868a97273ae5f59fc5f0263",
            "rmd160":"4984fad8a19c7fae540e0559c736dda5ad1157a1",
            "BTC":"RFyvi85fv9qoJL5ZJWMt1nZdviBNtnLVtn",
            "SAFE":"RfKXhENxdLJg7mDeKvhCVuqRZDSKgh7g8n",
            "result":"success",
            "handle":"",
            "myip":"94.237.52.137",
            "persistent":"be0feb932cddbcf37f7a482be0a89e530d0416bec8b5acc237936a0159055056",
            "status":"unlocked",
            "duration":3600,
            "privkey":"b0fd7e1cc130911f1d483e23049455df361ed516070a8e54cd1947a4280aa041",
            "BTCwif":"L39kqqQoqw3ZtKYFwxdWtwhKKAuLKxTPrTnuyQogKHXsLDCB4mDd",
            "KMDwif":"V4XDigPgXJvxKtM7gahzTZU2VgA8FUzjnQns77wTGUWHWQQ9vzQM",
            "tag":"6837804746000623472"
        }
 */
