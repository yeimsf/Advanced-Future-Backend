const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
    'http://172.105.245.241:3443',
    'https://172.105.245.241:3443',
    'http://172.105.245.241:3000',
    'https://172.105.245.241:3000',
    'http://www.al-mostaqbaltoinvest.com',
    'https://www.al-mostaqbaltoinvest.com',
];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = {
            origin: true
        }
    }
    else
    {
        corsOptions = {
            origin: false
        }
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
