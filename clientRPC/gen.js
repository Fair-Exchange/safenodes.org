const sha256 = require('sha256');
const Buffer = require('buffer');
const bitgo_utxo_lib = require('bitgo-utxo-lib');
const bigi = require('bigi');
const scrypt = require('scrypt-js');

const network_bitcoin = bitgo_utxo_lib.networks['bitcoin'];
const network_safecoin = bitgo_utxo_lib.networks['safecoin'];
const network_ravencoin = bitgo_utxo_lib.networks['ravencoin'];
const network_bitcoingold = bitgo_utxo_lib.networks['bitcoingold'];

const salt = "b3bCbCTBV5LUtsmwa6bpJY98Ep7rpHjA8AyXd9jMdkQFuUtSafc7zsjTA4N5ZxeDCWA6ZEDFEJXF2Cdq2DmRqx7v";

function sendKey(passBeforeHash, callback) {

    const password = Buffer.Buffer.from(String(passBeforeHash));
    const safeSalt = Buffer.Buffer.from(String(salt));

    // Scrypt accept only Buffer
    scrypt(Array.from(password), safeSalt, 16384, 8, 1, 64, function(error, progress, key) {
        if (error) {
            //console.log("Error: " + error);
        } else if (key) {
            //console.log("Found: " + key);

            const hash_hex = sha256(key);

            const hash_buffer = Buffer.Buffer.from(hash_hex, "hex"); // Buffer(hash_hex, 'hex'); // Buffer.from(hash_hex, "hex");
            hash_buffer[0] = hash_buffer[0] & 248;
            hash_buffer[31] = hash_buffer[31] & 127;
            hash_buffer[31] = hash_buffer[31] | 64;
            const big_integer_hash = bigi.fromBuffer(hash_buffer);

            const key_pair = new bitgo_utxo_lib.ECPair(big_integer_hash);

            // compressed
            key_pair.compressed = true;
            // Test

            // BTC
            key_pair.network = network_bitcoin;
            const btc_compressed_address = key_pair.getAddress();
            const btc_compressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
            const btc_compressed_wif = key_pair.toWIF();

            // SAFE
            key_pair.network = network_safecoin;
            const safe_compressed_address = key_pair.getAddress();
            const safe_compressed_wif = key_pair.toWIF();

            // RVN
            key_pair.network = network_ravencoin;
            const rvn_compressed_address = key_pair.getAddress();
            const rvn_compressed_wif = key_pair.toWIF();

            // BTG
            key_pair.network = network_bitcoingold;
            const btg_compressed_address = key_pair.getAddress();
            const btg_compressed_wif = key_pair.toWIF();

            // uncompressed
            key_pair.compressed = false;

            // Get generated keys
            const generatedKeys = {
                safeKey : btc_compressed_pubkey,
                safePrivateKey : hash_buffer.toString("hex"),
                safeWIF : safe_compressed_wif,
                safeAddress : safe_compressed_address,
                btcWIF : btc_compressed_wif,
                btcAddress : btc_compressed_address,
                rvnWIF : rvn_compressed_wif,
                rvnAddress : rvn_compressed_address,
                btgWIF : btg_compressed_wif,
                btgAddress : btg_compressed_address,
            };

            return callback(null, generatedKeys);
        } else {
            // update UI with progress complete 0 -> 1
            // updateInterface(progress);
        }
    });
}

module.exports.keyGenerate = keyGenerate = {
    hash : sendKey
};

