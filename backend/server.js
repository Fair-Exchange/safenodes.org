var cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser');

const app = express();

dotenv.config();

// Parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
    if (err.name === 'StatusError') {
        res.send(err.status, err.message);
    } else {
        next(err);
    }
});

if (process.env.NODE_ENV === 'development') {
    app.use(express.logger('dev'));
    app.use(errorhandler())
}

app.use(require('./routes'));

const port = process.env.PORT || 3001;

// start https server
let sslOptions = {
    key: 'xxx', //fs.readFileSync('key.pem'),
    cert: 'xxx', //fs.readFileSync('cert.pem')
    passphrase: 'YOUR PASSPHRASE HERE'
};

http.createServer(sslOptions, app).listen(port, function (err) {
    console.log('listening in http://localhost:' + port);
});
