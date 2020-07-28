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
   res.end('Will send all the leaders to you!'); 
})
.delete((req,res,next) =>{
    res.end('Deleting all the leaders to you!'); 
}) 
.post((req,res,next) =>{
    res.end('will add the leader: '+ req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
});
dishRouter.route('/:leaderId')
.get((req,res,next) =>{
    res.end('Will send details of the leader:'+ req.params.leaderId + 'to you!'); 
})
.delete((req,res,next) =>{
     res.end('Deleting leader: ' + req.params.leaderId); 
})
.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+req.params.leaderId);
})
.put((req,res,next) =>{
     res.write('Updating the leader:'+req.params.leaderId + '\n');
     res.end('Will update the leader: '+req.body.name + ' with details: ' + req.body.description);
});


module.exports = dishRouter;