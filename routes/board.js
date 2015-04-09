/**
 * Created by ProgrammingPearls on 15. 4. 9..
 */

var express = require('express');
var router = express.Router();
var db_board = require('../models/db_board');

/* GET board listing. */
router.get('/', function(req, res, next) {
  res.render('board', { "title" : '게시판' });
});

router.get('/write', function (req, res, next) {
  res.render('writeform', { "title" : "글쓰기" });
});

router.post('/write', function (req, res, next) {
  console.log('req.body', req.body);

  var title = req.body.title;
  var content = req.body.content;
  var passwd = req.body.passwd;

  var datas = [title, content, passwd];

  res.json({"result" : "success"});

  db_board.write(datas, function (success) {

    if (!success)
      res.json({"result" : "fail"});  // 모바일 서버일 경우
    else {
      res.json({"result" : "success"});  // 모바일 서버일 경우
      //res.redirect('/board/list/1');
    }


  });
});

module.exports = router;
