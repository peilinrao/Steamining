/*
  users_table.js
  @ CREATOR: Peilin Rao
  @ DESCRIPTION: contains all the APIs related to games_table
  @ COMPONENTS:
  @ NOTE:
  CREATE TABLE STEAMINING.GAMES(
    appid INT NOT NULL,
    name VARCHAR(100),
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
  API_get_games: function (steamid){
    var mysql = require('mysql');
    var con = mysql.createConnection({
      multipleStatements: true,
      host:'localhost',
      user:'root',
      password:'UIuc7355608!!',
      database:'steamining'
    });
    const fetch = require('node-fetch')

    function APIGetOwnedGames(key,steamid) {
      return fetch("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+key+"&steamid="+steamid+"&format=json") // Call the fetch function passing the url of the API as a parameter
      .then((resp) => resp.json())
    }

    function APIGetAppInfo(appid) {
      return fetch("https://steamspy.com/api.php?request=appdetails&appid="+appid)
             .then(res => res.json())
             .catch(function(error) {return APIGetAppInfo(appid)});
    }

    async function insert_to_game_table(listOfAll){
      var sql = "";
      var safe = [];
      console.log(listOfAll);
      appid_list = listOfAll.response.games;
      //appid_list.length
      for (var i = 0; i < appid_list.length ; i++){
        console.log("Progress:",i)
        curr_appid = appid_list[i].appid;
        console.log("requested:"+curr_appid);
        await APIGetAppInfo(curr_appid).then(function(result){

              safe.push(result.appid)
              safe.push(result.name)
              safe.push(result.developer)
              safe.push(result.publisher)
              safe.push(result.positive)
              safe.push(result.negative)
              safe.push(result.owners)
              safe.push(result.average_forever)
              safe.push(result.price)
              safe.push(result.initialprice)
              safe.push(result.discount)
              sql += "INSERT IGNORE INTO STEAMINING.GAMES(appid,name, developer, publisher,positive, negative,"+
              "owners, average_forever, price, init_price, discount)"+
              "values (?,?,?, ?, ?, ?, ?, ?, ? ,?,?);"

        });
      }
      con.connect(function(err) {
        if (err) throw err;
        console.log("Trying to add a new game into our database.");
        con.query(sql,safe, function (err, result) { if (err) throw err; console.log("Successfully added");});
      });

    }

    key = "AA7FA6275849EC957DF95C8DE0945CB7";
    APIGetOwnedGames(key,steamid).then(listOfAll => insert_to_game_table(listOfAll));
  }
};
