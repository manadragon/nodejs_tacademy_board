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

module.exports = router;
