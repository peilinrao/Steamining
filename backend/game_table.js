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
  API_get_game: function (){
    var mysql = require('mysql');
    var con = mysql.createConnection({
      multipleStatements: true,
      host:'localhost',
      user:'root',
      password:'UIuc7355608!!',
      database:'steamining_main'
    });
    const fetch = require('node-fetch')
    function APIGetAllGameIDs() {
      return fetch("http://api.steampowered.com/ISteamApps/GetAppList/v2")
             .then(res => res.json());
    }
    function APIGetAppInfor(appid) {
      return fetch("https://steamspy.com/api.php?request=appdetails&appid="+appid)
             .then(res => res.json());
    }

    function insert_to_game_table(responseOne, responseTwo){
      console.log("Sanity check:")
      console.log("Are we ok with GetPlayerSummaries?:",responseOne!=null);
      console.log("Are we ok with GetPlayerSummaries?:",responseTwo!=null);

      var sql = "";
      username = responseOne.response.players[0].personaname;
      steamId64 = responseOne.response.players[0].steamid;
      if(responseTwo.response.length == 0){
        throw new Error('The user have no game! We do not have to do anything for him');
      };
      for (var i = 0; i < responseTwo.response.games.length; i++){
        sql+= "INSERT INTO STEAMINING_MAIN.USERS(SteamId64, UserName, GameId, PlayTime) values (\""+steamId64+"\",\""+username+"\","+responseTwo.response.games[i].appid+","+responseTwo.response.games[i].playtime_forever+") ON DUPLICATE KEY UPDATE PlayTime = "+responseTwo.response.games[i].playtime_forever+";"
      }

      console.log(sql);
      con.connect(function(err) {
        if (err) throw err;
        console.log("Trying to add a new game into our database.");
        con.query(sql, function (err, result) { if (err) throw err; console.log("Successfully added");});
      });

    }

    key = "AA7FA6275849EC957DF95C8DE0945CB7";
    APIGetOwnedGames(key,steamid)
    .then(responseTwo => {
        APIGetPlayerSummaries(key,steamid)
        .then(responseOne => {
          insert_to_users_table(responseOne, responseTwo);
        });
    });
  }
};
