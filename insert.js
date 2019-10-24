var mysql = require('mysql');
var con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'UIuc7355608!!',
  database:'steamining_main'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Trying to add UZI into our database.");
  var sql = "INSERT INTO USER_GAME values (2, 8888, 'ADC', 'UZI', 1, 30)";
  con.query(
    sql,
    function (err, result) {
    if (err) throw err;
    console.log("UZI created");
  });
});
