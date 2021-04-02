var express = require('express');
var router = express.Router();
const cors = require('cors');
/* GET home page. */
router.use(cors());
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
