/**
 * Created by ProgrammingPearls on 15. 4. 9..
 */

// db_board.js

var mysql = require('mysql');

// setting
var pool = mysql.createPool({
  "connectionLimit" : 300,
  "host" : "127.0.0.1",
  "user" : "root",
  "password" : "ppsung",
  "database" : "imsi1"
});

exports.write = function (datas, callback) {
  pool.getConnection(function (err, conn) {
    // err : 에러를 가져온다, conn : 결과를 가져온다.
    if (err)
      console.error('err', err);


    var sql = "insert into board(title, content, passwd, regdate, hit, reply, recmd, id) " +
              "values (?, ?, ?, now(), 1, 1, 1, 'hong')";

    conn.query(sql, datas, function (err, row) {
      if (err) console.error('err', err);

      console.log("row", row);

      var success = false;

      if (row.affectedRows == 1){
        success = true;
      }
      conn.release();
      // 요청한 곳에 callback함수를 돌려준다.
      callback(success);
    });
  });
}

/*
 exports.write = function (저장할 내용, 콜백) {

 }
 */

exports.list = function (page, callback) {
  pool.getConnection(function (err, conn) {
    if (err) console.error('err', err);
    var sql = "select * from board";

    conn.query(sql, [], function (err, rows) {
      console.log("rows", rows);
      var datas = {
        "title" : "리스트",
        "rows" : rows
      };
      conn.release();
      callback(datas);
    });
  });
}