var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 5,
  host : 'localhost',
  user : 'root',
  password : 'ppsung',
  database : 'imsi1'
});

/* GET users listing. */

router.get('/', function (req, res, next) {
  res.render('member', {title : '회원관리'});
});

router.get('/join', function(req, res, next) { // member/join
  res.render('member/join', { title :'회원가입' });
});

router.post('/join', function (req, res, next) {
  console.log('req.body', req.body);
  // id, passwd, name, email, tel, address, job, gender, birth, regdate, modidate, withdraw

  var id = req.body.id;
  var passwd = req.body.passwd;
  var name = req.body.name;
  var email = req.body.email;
  var tel = req.body.tel;
  var address = req.body.address;
  var job = req.body.job;
  var gender = req.body.gender;
  var birth = req.body.birth;

  pool.getConnection(function(err, conn){
    if (err) {
      console.log('err', err);
      res.json(err);
    }
    else {
      console.log("id", id);
      //console.log('conn', conn);
      var sql = 'insert into member(id, passwd, name, email, tel, address, ' +
                'job, gender, birth, regdate, modidate, withdraw) ' +
                'values(?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), "N")';
      var data = [id, passwd, name, email, tel, address, job, gender, birth];

      conn.query(sql, data, function (err, row) {
        if (err) {
          console.log('err', err);
          res.json(err);
          // connection을 되돌려줘야한다!! 중요!
          conn.release();
        }
        else {
          console.log('row', row);
          if (row.affectedRows == 1) {
            //res.json({ "result" : "success" }); // 모바일 서버 성공시
            res.redirect('/members/login');
          }
          else {
            //res.json({ "result" : "fail" }); // 모바일 서버 실패시
            res.end('<head>  <meta charset="utf-8">' +
                    '<script> alert("에러가 발생해서 되돌아갑니다!"); history.back(); </script></head>');
          }

          // connection을 되돌려줘야한다!! 중요!
          conn.release();
        }

      });
    }
  });
});

router.get('/login', function (req, res, next) {
  res.render('member/login', { title : '로그인'});
});

router.post('/login', function (req, res, next){
  console.log('req.body', req.body);
  //res.json({ "result" : "success" });  // Dummy Server
  pool.getConnection(function (err, conn) {
    if(err) {
      console.log("err", err);
    }
    else{
      var sql = 'select count(*) cnt from member where id=? and passwd=?';
      conn.query(sql, [req.body.id, req.body.passwd], function (err, rows) {
        if(err) {
          console.log("err", err);
          res.json({"result" : err});
          next(err);
          conn.release();
          return;
        }
        else{
          console.log("rows", rows);
          //res.json({ "result" : rows });
          if(rows[0].cnt == 1)
            //res.json({ "result" : "success"}); // 모바일 서버 성공시
            res.redirect('/members/' + req.body.id);
          else
            //res.json({ "result" : "fail"}); // 모바일 서버 실패시
            res.end('<head><meta charset="utf-8"><script> alert("에러가 발생해서 되돌아갑니다!"); ' +
            'history.back(); </script></head>');
        }
        conn.release();
      });
    }
  });
});

router.get('/:id', function (req, res, next) {
  console.log('req.params.id', req.params.id);
  //res.json({id : req.params.id});
  var id = req.params.id;
  pool.getConnection(function (err, conn) {
    if(err){
      console.log(err);
      res.json({"result" : err});
      return;
    }
    else {
      var sql = "select id, passwd, name, email, tel, address, job, gender, birth from member " +
                "where id = ?";
      var data = [id];

      conn.query(sql, data, function (err, rows) {
        console.log('rows', rows);
        var row = rows[0];
        var tel = row.tel.split('-');
        row.tel1 = tel[0];
        row.tel2 = tel[1];
        row.tel3 = tel[2];
        console.log('row', row);
        //res.json({"result" : row});  // 모바일 서버의 경우
        res.render('updateform', { "title" : "회원정보수정", "row" : row});
        conn.release();
      });
    }
  });
});

router.post('/update/:id', function (req, res, next) {
  //var id = req.params.id;
  console.log("req.body", req.body);
  var id = req.body.id;
  var passwd = req.body.passwd;
  var name = req.body.name;
  var email = req.body.email;
  var tel = req.body.tel;
  var address = req.body.address;
  var job = req.body.job;
  var gender = req.body.gender;
  var birth = req.body.birth;

  pool.getConnection(function(err, conn){
    var sql = "update member set name=?, email=?, tel=?, address=?, job=?, gender=?, " +
              "birth=?, modidate=now() where id=? and passwd=?";
    var data = [name, email, tel, address, job, gender, birth, id, passwd];

    conn.query(sql, data, function (err, row) {
      if(err) console.log('err', err);
      else {
        if(row.affectedRows == 1){
          //res.json({"result" : "success"});
          res.render('main', {"title" : "회원관리", "id" : id});
        }
        else{
          //res.json({"result" : "fail"});
          res.end('<head><meta charset="utf-8"><script> alert("에러가 발생해서 되돌아갑니다!"); ' +
          'history.back(); </script></head>');
        }
      }
      conn.release();
    });
  });
  //console.log("id", id);
});

router.get('/withdraw/:id', function (req, res, next){
  var id = req.params.id;
  res.render('member/withdrawform', {"id" : id, "title" : "회원 탈퇴"});
});

router.post('/withdraw/:id', function (req, res, next){
  var id = req.body.id;
  var passwd = req.body.passwd;
  //console.log('id', id);
  pool.getConnection(function(err, conn){

    if(err) console.log('err', err);
    else {
      var sql = "update member set withdraw='Y' where id=? and passwd=?";
      var queryArray = [id, passwd];
      conn.query(sql, queryArray, function(err, row){
        if (err) console.log('err', err);
        else {
          if (row.affectedRows == 1) {
            //res.json({"result" : "success"});  // 모바일 서버시
            res.redirect("/");
          }
          else{
            //res.json({"result" : "fail"});  // 모바일 서버시
            res.end('<head><meta charset="utf-8"><script> alert("에러가 발생해서 되돌아갑니다!"); ' +
            'history.back(); </script></head>');
          }
        }
        conn.release();
      });
    }
  });
});


module.exports = router;

