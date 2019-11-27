/*
  users_table.js
  @ CREATOR: Peilin Rao
  @ DESCRIPTION: contains all the APIs related to games_table
  @ COMPONENTS:
  @ NOTE:
    CREATE TABLE STEAMINING.GAMES(
      appid INT NOT NULL,
      developer VARCHAR(50),
      publisher VARCHAR(50),
      positive INT,
      negative INT,
      owners VARCHAR(100),
      average_forever INT,
      price INT,
      init_price INT,
      discount INT,
      tag  VARCHAR(50) NOT NULL,
      tag_weight INT,
      PRIMARY KEY(appid, tag)
    );
*/
module.exports = {
  /*
  API_get_game:
  @ CREATOR: Peilin Rao
  @ DESCRIPTION: Add games in games table, should be occasionally called.
  @ INPUT:
  @ OUTPUT:
  @ EFFECT:
  @ COMPONENTS:
  @ NOTE:
  */
  API_get_games: function (){
    var mysql = require('mysql');
    var con = mysql.createConnection({
      multipleStatements: true,
      host:'localhost',
      user:'root',
      password:'UIuc7355608!!',
      database:'steamining'
    });
    const fetch = require('node-fetch')

    function APIGetAllGameIDs() {
      return fetch("http://api.steampowered.com/ISteamApps/GetAppList/v2")
             .then(res => res.json());
    }
    function APIGetAppInfo(appid) {
      return fetch("https://steamspy.com/api.php?request=appdetails&appid="+appid)
             .then(res => res.json())
             .catch(function(error) {return APIGetAppInfo(appid)});
    }

    async function insert_to_game_table(listOfAll){
      var sql = "";
      appid_list = listOfAll.applist.apps;
      // Only add 20 for testing, should change to appid_list.length

      for (var i = 0; i < 2000; i++){
        curr_appid = appid_list[i].appid;
        console.log("requested:"+curr_appid);
        await APIGetAppInfo(curr_appid).then(function(result){
          if (Object.keys(result.tags).length != 0){
            for(var t = 0; t < Object.keys(result.tags).length; t++){
              sql += "INSERT INTO STEAMINING.GAMES(appid, developer, publisher,positive, negative,"+
              "owners, average_forever, price, init_price, discount, tag, tag_weight)"+
              "values (\""+result.appid+"\",\""+result.developer+"\", \""+result.publisher+"\", "+result.positive+", "+result.negative+", \""+result.owners+"\", "+
              result.average_forever+", "+result.price+","+
              result.initialprice+","+result.discount+",\""+Object.keys(result.tags)[t]+"\","+result.tags[Object.keys(result.tags)[t]]+");"

              console.log("sql appended:",sql);

            }
          }
          // ON DUPLICATE KEY UPDATE PlayTime = "+responseTwo.response.games[i].playtime_forever+";"
        });
      }
      con.connect(function(err) {
        if (err) throw err;
        console.log("Trying to add a new game into our database.");
        con.query(sql, function (err, result) { if (err) throw err; console.log("Successfully added");});
      });

    }

    APIGetAllGameIDs().then(listOfAll => insert_to_game_table(listOfAll));
  }
};
