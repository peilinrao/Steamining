/*
API_get_game:
@ CREATOR: Peilin Rao
@ DESCRIPTION:
@ INPUT:
@ OUTPUT:
@ EFFECT:
@ COMPONENTS:
@ NOTE:
    create associated sql table using:
    CREATE TABLE STEAMINING_MAIN.USERS(
    SteamId64 VARCHAR(17) NOT NULL,
    UserName VARCHAR(100) NOT NULL,
    GameId INT,
    PlayTime INT,
    PRIMARY KEY(SteamId64, UserName, GameId)
    );
*/
module.exports = {
  API_get_games: function (){
    var mysql = require('mysql');
    var con = mysql.createConnection({
      multipleStatements: true,
      host:'localhost',
      user:'root',
      password:'UIuc7355608!!',
      database:'steamining_main'
    });
    const fetch = require('node-fetch')
    function sleep(delay) {
      var start = new Date().getTime();
      while (new Date().getTime() < start + delay);
    }
    function APIGetAllGameIDs() {
      return fetch("http://api.steampowered.com/ISteamApps/GetAppList/v2")
             .then(res => res.json());
    }
    function APIGetAppInfo(appid) {
      return fetch("https://steamspy.com/api.php?request=appdetails&appid="+appid)
             .then(res => res.json())
             .catch(function(error) {return APIGetAppInfo(appid)});
    }

    function insert_to_game_table(listOfAll){
      var sql = "";
      appid_list = listOfAll.applist.apps;
      for (var i = 0; i < 20; i++){
        curr_appid = appid_list[i].appid;
        console.log("requested:"+curr_appid);
        APIGetAppInfo(curr_appid).then(function(result){
          if (Object.keys(result.tags).length != 0){
            console.log("Is there anybody in there?");
            for(var t = 0; t < result.tag.length; t++){
              sql+= "INSERT INTO STEAMINING_MAIN.GAMES(appid, developer, publisher, negative, \
              owners, average_forever, average_2week, median_2week, price, init_price, discount, tag, tag_weight) \
              values (\""+result.appid+"\",\""+result.developer+"\", \""+result.publisher+"\", "+result.negative+", \""+result.owners+"\", \
              "+result.average_forever+", "+result.average_2week+", "+result.median_2week+", "+result.price+",\
              "+result.initialprice+","+result.discount+","+Object.keys(result.tags)[t]+","+result.tags[Object.keys(result.tags)[t]]+");"
              console.log("sql appended:",sql);
            }
          }
          // ON DUPLICATE KEY UPDATE PlayTime = "+responseTwo.response.games[i].playtime_forever+";"

        });
      }

      // console.log("sql:",sql);
      // con.connect(function(err) {
      //   if (err) throw err;
      //   console.log("Trying to add a new game into our database.");
      //   con.query(sql, function (err, result) { if (err) throw err; console.log("Successfully added");});
      // });

    }

    APIGetAllGameIDs().then(listOfAll => insert_to_game_table(listOfAll));
  }
};
