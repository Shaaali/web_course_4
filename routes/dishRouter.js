const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','Text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will Send all the dishes to you!');
})
.post((req,res,next)=> {
res.end('Will add the dish: '+ req.body.name+ ' With details:' + req.body.description);
})
.put((req,res,next)=> {
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes');
})

.delete((req,res,next)=> {
    res.end('Deleting all the dishes');
});

dishRouter.route('/:dishId/')
.get((req,res,next) => {
    res.end('Will Send the dish ' + req.params.dishId + ' to you!');
})
.post((req,res,next)=> {
    res.statusCode = 403;
    res.end('Post operation not supported on /dishes/'+ req.params.dishId);
}).put((req,res,next)=> {
    res.write('Updating the dish: '+ req.params.dishId + '\n' );
    res.end('Will update the dish: '+req.body.name + ' With details: '+ req.body.description);
})
.delete((req,res,next)=> {
    res.end('Deleting the dish'+ req.params.dishId);
});

module.exports = dishRouter;