const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.route('/')
.all((req, res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) =>{
   res.end('Will send all the promotions to you!'); 
})
.delete((req,res,next) =>{
    res.end('Deleting all the promotions to you!'); 
}) 
.post((req,res,next) =>{
    res.end('will add the promotion: '+ req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
});
dishRouter.route('/:promoId')
.get((req,res,next) =>{
    res.end('Will send details of the promotion:'+ req.params.promoId + 'to you!'); 
})
.delete((req,res,next) =>{
     res.end('Deleting promotion: ' + req.params.promoId); 
})
.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+req.params.promoId);
})
.put((req,res,next) =>{
     res.write('Updating the promotion:'+req.params.promoId + '\n');
     res.end('Will update the promotion: '+req.body.name + ' with details: ' + req.body.description);
});


module.exports = dishRouter;