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


    async function insert_to_game_table(listOfAll){
      var sql = "";
      var safe = [];
      appid_list = listOfAll.response.games;

      for(var i = 0; i < appid_list.length; i++){
          curr_appid = appid_list[i].appid;
          console.log("requested:"+curr_appid);
          const cheerio = require('cheerio');
          const request = require('request');
          await new Promise((resolve, reject)=>{
            request('https://store.steampowered.com/app/'+curr_appid,(error, response, html)=>{
              console.log("resolving request")
              const $ = cheerio.load(html);
              var current_price_result = -1;
              var original_price_result = -1;
              var discount_result = -1;
              var comments = -1;
              var positive = -1;
              var negative = -1;
              var name = "";
              const get_name = $('.apphub_AppName')
              name = get_name.text().trim()

              const focus = $('.game_purchase_action')
              const theString = focus.children().first().text().trim()
              var firstLine = theString.split('\n')[0].trim();

              //For now only consider three possibilities:
              if (firstLine == "Free to Play"){
                current_price_result = 0
                original_price_result = 0
                discount_result = 0
              }else if(firstLine.startsWith('$')){
                var newString = firstLine.substr(1);
                var newNum = parseFloat(newString)
                current_price_result = parseInt(newNum*100)
                original_price_result = current_price_result
                discount_result = 0
              }else if(firstLine.startsWith('-')){
                var newString = firstLine.substr(1);
                var newArray = newString.split('$')
                discount_result = parseInt(newArray[0])
                current_price_result = parseInt(parseFloat(newArray[1])*100)
                original_price_result = parseInt(parseFloat(newArray[2])*100)
              }

              //For positive reviews
              const reviews = $('.responsive_hidden')
              //console.log(parseInt(reviews.first().text().replace(/\D/g,'').trim()))
              comments = parseInt(reviews.last().text().replace(/\D/g,'').trim())
              const temp = $('.nonresponsive_hidden')
              var percentage_good = parseInt(temp.last().text().trim().split('%')[0].replace(/\D/g,''))
              positive = parseInt(comments*percentage_good/100)
              negative = comments-positive


              safe.push(curr_appid)
              safe.push(name)
              safe.push(positive)
              safe.push(negative)
              safe.push(comments)
              safe.push(current_price_result)
              safe.push(original_price_result)
              safe.push(discount_result)

              sql += "INSERT IGNORE INTO STEAMINING.GAMES(appid,name,positive, negative,"+
              "owners, price, init_price, discount)"+
              "values (?, ?, ?, ?, ?, ? ,?,?);";
              resolve();

              });
          })

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
