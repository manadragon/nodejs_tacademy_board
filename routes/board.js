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

  //res.json({"result" : "success"});

  db_board.write(datas, function (success) {

    if (!success)
      //res.json({"result" : "fail"});  // 모바일 서버일 경우
      res.end('<head><meta charset="UTF-8">' +
               '<script>alert("에러가 발생하여 되돌아갑니다.");history.back();</script> </head>');
    else {
      //res.json({"result" : "success"});  // 모바일 서버일 경우
      res.redirect('/board/list/1');
    }
  });
});

router.get('/list', function (req, res, next) {
  res.redirect('/board/list/1');
});

router.get('/list/:page', function (req, res, next) {
  var page = req.params.page;
  page = parseInt(page, 10);

  console.log(page);
  db_board.list(page, function (datas) {
    res.render('list', datas);
  });
});


router.get('/write300', function (req, res) {

  for (var i = 1; i <=300; i++) {
    var title = i + "번째 글 입니다.";
    var content = i * Math.floor(200 * Math.random());
    var passwd = '1234';
    var datas = [title, content, passwd];

    db_board.write(datas, function (success) {

    });
  }

  res.send('<head><meta charset="utf-8"></head><script>alert("300개의 글이 생성되었습니다."></script>');
});

module.exports = router;
