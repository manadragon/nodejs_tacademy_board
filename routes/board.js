/**
 * Created by ProgrammingPearls on 15. 4. 9..
 */

var express = require('express');
var router = express.Router();

/* GET board listing. */
router.get('/', function(req, res, next) {
  res.render('board', { "title" : '게시판' });
});

router.get('/write', function (req, res, next) {
  res.render('writeform', { "title" : "글쓰기" });
});

router.post('/write', function (req, res, next) {
  console.log('req.body', req.body);

  res.json({"result" : "success"});
});

module.exports = router;
