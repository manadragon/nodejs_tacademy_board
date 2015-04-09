/**
 * Created by ProgrammingPearls on 15. 4. 9..
 */

// db_board.js

var mysql = require('mysql');

// setting
var pool = mysql.createPool({
  "connectionLimit" : 3,
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

    console.log('conn', conn);
    conn.release();

    // 요청한 곳에 callback함수를 돌려준다.
    callback(true);
  });
}

/*
 exports.write = function (저장할 내용, 콜백) {

 }
 */