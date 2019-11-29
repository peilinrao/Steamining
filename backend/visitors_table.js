/*
  visitors_table.js
  @ CREATOR: Peilin Rao
  @ DESCRIPTION: contains all the APIs that needs both games_table and users_table
  @ COMPONENTS:
  @ NOTE:
*/

module.exports = {
  API_total_games: function (steamid){
    var mysql = require('mysql');
    var con = mysql.createConnection({
      multipleStatements: true,
      host:'localhost',
      user:'root',
      password:'UIuc7355608!!',
      database:'STEAMINING'
    });
    sql = "SELECT COUNT(GameId) FROM STEAMINING.USERS WHERE SteamId64 = " + steamid + " GROUP BY SteamId64;"
    con.connect(function(err) {
      if (err) throw err;
      console.log("Counting how many games you have.");
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Hmm, counting done");
        console.log(result[0]["COUNT(GameId)"]); //This is the number of games I have
      });
    });
  },

  API_search_add: function (steamid){
    var mysql = require('mysql');
    var con = mysql.createConnection({
      multipleStatements: true,
      host:'localhost',
      user:'root',
      password:'UIuc7355608!!',
      database:'STEAMINING'
    });
    sql = "SELECT SUM(PlayTime) FROM STEAMINING.USERS WHERE SteamId64 = " + steamid + " GROUP BY SteamId64;"
    con.connect(function(err) {
      if (err) throw err;
      console.log("Counting how much time you have wasted.");
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Hmm, counting done");
        console.log(result[0]["SUM(PlayTime)"]); //This is the number of games I have
      });
    });
  },

};
