var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dish = require('../models/dishes');

var Favorite = require('../models/favorite');

var authenticate = require('../authenticate');
const Favorites = require('../models/favorite');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all(authenticate.verifyUser)
.get(function (req, res, next) {
    Favorite.find({'postedBy': req.decoded._doc._id})
        .populate('postedBy')
        .populate('dishes')
        .exec(function (err, favorites) {
            if (err) return err;
            res.json(favorites);
        });
})
.post(function (req, res, next) {

    Favorite.findOne({user: req.user._id}, (err, favorite))
        if(err) return next(err);
            if (!favorite){
                Favorites.create({user: req.user._id})
                .then((favorite) => {
                    for(i = 0;i < req.body.length;i++)
                        if(favorite.dishes.indexOf(req.body[i]._id))
                            favorite.dishes.push(req.body[i]);
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    });
                })
                .catch((err) => {
                    return next(err);
                });
            })
            .catch((err) => {
                return next(err);
            })
        }
})
.delete(function (req, res, next) {
    Favorite.remove({'postedBy': req.decoded._doc._id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    })
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if(!favorites){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"Exists": false, "favorites": favorites});
        }
        else
        {
            if(favorites.dishes.indexOf(req.params.dishId) < 0)
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"Exists": false, "favorites": favorites});
            }
            else
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"Exists": true, "favorites": favorites});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete(function (req, res, next) {

    Favorite.find({'postedBy': req.decoded._doc._id}, function (err, favorites) {
        if (err) return err;
        var favorite = favorites ? favorites[0] : null;

        if (favorite) {
            for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                if (favorite.dishes[i] == req.params.dishId) {
                    favorite.dishes.remove(req.params.dishId);
                }
            }
            favorite.save(function (err, favorite) {
                if (err) throw err;
                console.log('Here you go!');
                res.json(favorite);
            });
        } else {
            console.log('No favourites!');
            res.json(favorite);
        }

    });
});

module.exports = favoriteRouter;