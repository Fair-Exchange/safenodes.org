const sha256 = require('sha256');
const bitgo_utxo_lib = require('bitgo-utxo-lib');
const readline = require('readline-sync');
var bigi = require('bigi');
var crypto = require('crypto');

const network_bitcoin = bitgo_utxo_lib.networks['bitcoin'];
const network_safecoin = bitgo_utxo_lib.networks['safecoin'];
const network_ravencoin = bitgo_utxo_lib.networks['ravencoin'];
const network_bitcoingold = bitgo_utxo_lib.networks['bitcoingold'];

var password = readline.question("SUPER STRONG PASSWORD: ");

var salt = "b3bCbCTBV5LUtsmwa6bpJY98Ep7rpHjA8AyXd9jMdkQFuUtSafc7zsjTA4N5ZxeDCWA6ZEDFEJXF2Cdq2DmRqx7v";
//var passwordhash = scrypt.hashSync(password,{"N":16384,"r":8,"p":1},64,salt);

var passwordhash =crypto.scryptSync(password, salt, 64, { N: 16384 });

console.log(passwordhash);

var hash_hex = sha256(passwordhash);

var hash_buffer = Buffer.from(hash_hex, "hex");
hash_buffer[0] = hash_buffer[0] & 248;
hash_buffer[31] = hash_buffer[31] & 127;
hash_buffer[31] = hash_buffer[31] | 64;
var big_integer_hash = bigi.fromBuffer(hash_buffer);

var key_pair = new bitgo_utxo_lib.ECPair(big_integer_hash);

// compressed
key_pair.compressed = true;


// BTC
key_pair.network = network_bitcoin;
var btc_compressed_address = key_pair.getAddress();
var btc_compressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
var btc_compressed_wif = key_pair.toWIF();

// SAFE
key_pair.network = network_safecoin;
var safe_compressed_address = key_pair.getAddress();
var safe_compressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
var safe_compressed_wif = key_pair.toWIF();

// RVN
key_pair.network = network_ravencoin;
var rvn_compressed_address = key_pair.getAddress();
var rvn_compressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
var rvn_compressed_wif = key_pair.toWIF();

// BTG
key_pair.network = network_bitcoingold;
var btg_compressed_address = key_pair.getAddress();
var btg_compressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
var btg_compressed_wif = key_pair.toWIF();

// uncompressed
key_pair.compressed = false;

// BTC
key_pair.network = network_bitcoin;
var btc_uncompressed_address = key_pair.getAddress();
var btc_uncompressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
var btc_uncompressed_wif = key_pair.toWIF();

// SAFE
key_pair.network = network_safecoin;
var safe_uncompressed_address = key_pair.getAddress();
var safe_uncompressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
var safe_uncompressed_wif = key_pair.toWIF();

// RVN
key_pair.network = network_ravencoin;
var rvn_uncompressed_address = key_pair.getAddress();
var rvn_uncompressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
var rvn_uncompressed_wif = key_pair.toWIF();

// BTG
key_pair.network = network_bitcoingold;
var btg_uncompressed_address = key_pair.getAddress();
var btg_uncompressed_pubkey = key_pair.getPublicKeyBuffer().toString("hex");
var btg_uncompressed_wif = key_pair.toWIF();

console.log("SAFENODES");
console.log("PUBLIC SAFEKEY: " + btc_compressed_pubkey);
console.log("PRIVATE KEY: " + hash_buffer.toString("hex"));
console.log();

console.log("SAFE");
//console.log("SAFE COMPRESSED PUBLIC KEY: " + safe_compressed_pubkey);
//console.log("SAFE UNCOMPRESSED PUBLIC KEY: " + safe_uncompressed_pubkey);
//console.log("SAFE PRIVATE KEY: " + hash_buffer.toString("hex"));
console.log("SAFE COMPRESSED WIF: " + safe_compressed_wif);
//console.log("SAFE UNCOMPRESSED WIF: " + safe_uncompressed_wif);
console.log("SAFE COMPRESSED ADDRESS: " + safe_compressed_address);
//console.log("SAFE UNCOMPRESSED ADDRESS: " + safe_uncompressed_address);
console.log();


console.log("BTC");
//console.log("BTC COMPRESSED PUBLIC KEY: " + btc_compressed_pubkey);
//console.log("BTC UNCOMPRESSED PUBLIC KEY: " + btc_uncompressed_pubkey);
//console.log("BTC PRIVATE KEY: " + hash_buffer.toString("hex"));
console.log("BTC COMPRESSED WIF: " + btc_compressed_wif);
//console.log("BTC UNCOMPRESSED WIF: " + btc_uncompressed_wif);
console.log("BTC COMPRESSED ADDRESS: " + btc_compressed_address);
//console.log("BTC UNCOMPRESSED ADDRESS: " + btc_uncompressed_address);
console.log();


console.log("RVN");
//console.log("RVN COMPRESSED PUBLIC KEY: " + rvn_compressed_pubkey);
//console.log("RVN UNCOMPRESSED PUBLIC KEY: " + rvn_uncompressed_pubkey);
//console.log("RVN PRIVATE KEY: " + hash_buffer.toString("hex"));
console.log("RVN COMPRESSED WIF: " + rvn_compressed_wif);
//console.log("RVN UNCOMPRESSED WIF: " + rvn_uncompressed_wif);
console.log("RVN COMPRESSED ADDRESS: " + rvn_compressed_address);
//console.log("RVN UNCOMPRESSED ADDRESS: " + rvn_uncompressed_address);
console.log();

console.log("BTG");
//console.log("BTG COMPRESSED PUBLIC KEY: " + btg_compressed_pubkey);
//console.log("BTG UNCOMPRESSED PUBLIC KEY: " + btg_uncompressed_pubkey);
//console.log("BTG PRIVATE KEY: " + hash_buffer.toString("hex"));
console.log("BTG COMPRESSED WIF: " + btg_compressed_wif);
//console.log("BTG UNCOMPRESSED WIF: " + btg_uncompressed_wif);
console.log("BTG COMPRESSED ADDRESS: " + btg_compressed_address);
//console.log("BTG UNCOMPRESSED ADDRESS: " + btg_uncompressed_address);
console.log();
