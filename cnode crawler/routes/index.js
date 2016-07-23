var express = require('express');
var router = express.Router();
var url=require("url");
var cnode=require("../spider/cnode");

/* GET home page. */
router.get('/', function(req, res, next) {
  var queryObj=req.query;
  var requestUrl="http://cnodejs.org/";
  if(queryObj.tab && queryObj.page){
    requestUrl+="?tab="+queryObj.tab+"&page="+queryObj.page;
  }
  var _cnode=new cnode(requestUrl);
  _cnode.getData(res);
});

module.exports = router;
