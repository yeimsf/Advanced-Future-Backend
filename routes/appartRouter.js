const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Appartments = require('../models/appartments');
const cors = require('./cors');
const appartRouter = express.Router();

appartRouter.use(bodyParser.json());

appartRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req,res,next) =>{
    Appartments.find(req.query)
    .populate('comments.author')
    .then((appartments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(appartments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Appartments.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Appartments.create(req.body)
    .then((appartment) => {
        console.log('Appartment Created ', appartment);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(appartment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /appartments');
});

appartRouter.route('/:appartmentId')
.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) =>{
    Appartments.findById(req.params.appartmentId)
    .populate('comments.author')
    .then((appartment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(appartment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Appartments.findByIdAndRemove(req.params.appartmentId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /appartments/'+req.params.appartmentId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Appartments.findByIdAndUpdate(req.params.appartmentId, {
        $set: req.body
    }, { new: true })
    .then((appartment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(appartment);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = appartRouter;
