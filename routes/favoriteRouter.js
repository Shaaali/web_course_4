const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorites');
const cors = require('./cors');

const favRouter = express.Router();

favRouter.use(bodyParser.json());


favRouter.route('/')
.options(cors.corsWithOptions, (req, res)=> {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({author : req.user._id})
    .populate('author')
    .populate('dishes.dishId')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
   Favorites.findOne({author : req.user._id})
   .then((favorite)=>{
       if(favorite){
            for (var i = (req.body.length -1); i >= 0; i--) {
                if (favorite.dishes.indexOf(req.body[i]._id)===-1)
                favorite.dishes.push(req.body[i]._id);
            }
            favorite.save()
            .then((favorite) => {   
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);      
            }, (err) => next(err));
       }
       else{
        Favorites.create({ author : req.user._id ,dishes : req.body  })
        .then((favorite)=>{
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(favorite)
        }, (err) => next(err));
       }
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOneAndRemove({author : req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favRouter.route('/:dishId')
.options(cors.corsWithOptions , (req, res)=> {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
   res.end('GET operation not supported on /favorites/:dishId');
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported on /favorites/:dishId');
 })
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({ author : req.user._id})
    .then((favorite) => {
        if (favorite)
        {
            if(favorite.dishes.indexOf(req.params.dishId)===-1)
                {
                    favorite.dishes.push({dishId : req.params.dishId})
                }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
        }
        else{
            Favorites.create({author : req.user._id,dishes:[req.params.dishId]})
            .then((favorite)=>{
                       res.statusCode = 200;
                       res.setHeader('Content-Type', 'application/json');
                       res.json(favorite);
            },(err) => next(err))  
            .catch((err) => next(err)) 
        }
    },(err) => next(err))
    .catch((err) => next(err)) 
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({author : req.user._id})
    .then((favorite)=>{
        if(favorite.dishes.indexOf(req.params.dishId)===-1){
            err = new Error('Dish not found!');
            err.status =404;
            return next(err);
        }
        else{
            favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId), 1);
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Deleted ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
        }
    }, (err)=>next(err))
    .catch((err)=>next(err));
})

module.exports = favRouter;