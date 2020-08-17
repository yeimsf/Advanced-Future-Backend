const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Appartments = require('../models/appartments');
const cors = require('./cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/images');
//     },
//
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });
//
// const imageFileFilter = (req, file, cb) => {
//     if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//         return cb(new Error('You can upload only image files!'), false);
//     }
//     cb(null, true);
// };

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

//const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const appartRouter = express.Router();

appartRouter.use(bodyParser.json());


appartRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req,res,next) =>{
    Appartments.find({})
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
.post(cors.corsWithOptions,upload.array('image'), (req,res,next) =>{
    Appartments.create(req.body)
    .then((appartment) => {
        var files = [].concat(req.files);
        for(var i = 0; i < files.length; i++){
          file = files[i];
          appartment.image.push({"image": file.path});
        }
        appartment.save();
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(appartment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// .post(upload.array('image', 7), (req, res, next) => {
//     const appartment = new Appartment();
//     appartment = {
//         _id: new mongoose.Types.ObjectId(),
//
//     };
//     var files = [].concat(req.files);
//
//     for(var i = 0; i < files.length; i++){
//       file = files[i];
//       appartment.image.push({"image": file.path});
//     }
//     appartment.save().then(result => {
//         res.status(201).json({
//             message: "Done upload!",
//             appartmentCreated: {
//                 _id: result._id,
//                 image: result.image,
//             }
//         })
//     }).catch(err => {
//         console.log(err),
//             res.status(500).json({
//                 error: err
//             });
//     })
// })
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /appartments');
});
// appartRouter.route('/sendfiles')
// .options(cors.corsWithOptions, (req,res) => {
//     res.sendStatus(200);
// })
// .get(cors.cors, (req,res,next) => {
//   Appartments.find({})
//   .then((appartments) => {
//     ims = appartments.image[0].image
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'image/png');
//     res.sendFile(path.join(__dirname + ims));
//   })
// });

appartRouter.route('/:appartmentId')
.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) =>{
    Appartments.findById(req.params.appartmentId)
    .then((appartment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(appartment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,(req,res,next) =>{
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
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, upload.array('imageFile'), (req,res,next) =>{
    Appartments.findByIdAndUpdate(req.params.appartmentId, {
        $set: req.body,
        $unset: {
          "image": ""
        }
    }, { new: true })
    .then((appartment) => {
        var files = [].concat(req.files);
        for(var x = 0; x < files.length; x++){
          file = files[x];
          appartment.image.push({"image": file.path});
        }
        appartment.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(appartment);
    }, (err) => next(err))
    .catch((err) => next(err));
});
module.exports = appartRouter;
