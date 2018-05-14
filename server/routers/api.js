

var express = require('express');
var router = express.Router();
var proxy = require('express-http-proxy');
router.get('/users',(req,res)=>{
    res.json({ a:1 });
});
module.exports = router;