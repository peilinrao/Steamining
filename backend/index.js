var users_table = require('./users_table');
var games_table = require('./games_table');
var visitors_table = require('./visitors_table');
var friend_list = require('./friend_list');
var top_game = require('./top_game');

const express = require('express');
const cors = require('cors');
const app = express();

//
var mysql = require('mysql');
var con = mysql.createConnection({
  multipleStatements: true,
  host:'localhost',
  user:'root',
  password:'UIuc7355608!!',
  database:'STEAMINING'
});
con.connect(err => {if(err) {return err;}})
app.use(cors());
app.get('/update_database',(req,res)=>{
  const{ steamid } = req.query;
  users_table.API_users_add(steamid);
  games_table.API_get_games(steamid);
  friend_list.API_friend_list(steamid);
})

app.get('/delete',(req,res)=>{
  const{ steamid } = req.query;
  users_table.API_users_delete(steamid);
})


app.get('/show',(req,res)=>{
  console.log("Getting game news");
  top_game.API_TopGame();
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url, function(err, client) {
    if (err) throw err;
    var db = client.db("steamining");
    //console.log(arr);
    db.collection("news").aggregate([{$sample:{size:6}}]).toArray().then((docs) =>{
      return res.json({news_data:docs})
    }).catch((err)=>{
      console.log(err);
    }).finally(()=>{
      client.close();
    });
  });
})

app.get('/search', (req, res) => {
  const {steamid} = req.query;
  const VIEW_GAMES_FOR_ID_QUERY = "\
  SELECT COUNT(GameId) \
  FROM STEAMINING.USERS \
  WHERE SteamId64 = " + steamid + " \
  GROUP BY SteamId64; SELECT SUM(PlayTime)\
  FROM STEAMINING.USERS WHERE SteamId64 = " + steamid + " \
  GROUP BY SteamId64; \
  SELECT SUM(G.price) \
  FROM STEAMINING.USERS as U, (SELECT DISTINCT appid, price FROM STEAMINING.GAMES) as G \
  WHERE U.GameId = G.appid and U.SteamId64 = " + steamid + " \
  GROUP BY U.SteamId64; \
  SELECT G.name, U.PlayTime \
  FROM STEAMINING.USERS as U, (SELECT DISTINCT appid, name FROM STEAMINING.GAMES) as G\
  WHERE U.GameId = G.appid and U.SteamId64 = " + steamid + " \
  ORDER BY U.PlayTime DESC Limit 5; \
  SELECT COUNT(GameId) \
  FROM STEAMINING.USERS \
  WHERE SteamId64 = " + steamid + " and PlayTime > 6000; \
  SELECT COUNT(GameId) \
  FROM STEAMINING.USERS \
  WHERE SteamId64 = " + steamid + " and PlayTime > 3000 and PlayTime <= 6000; \
  SELECT COUNT(GameId) \
  FROM STEAMINING.USERS \
  WHERE SteamId64 = " + steamid + " and PlayTime > 60 and PlayTime <= 3000; \
  SELECT COUNT(GameId) \
  FROM STEAMINING.USERS \
  WHERE SteamId64 = " + steamid + " and PlayTime > 0 and PlayTime <= 600; \
  SELECT COUNT(GameId) \
  FROM STEAMINING.USERS \
  WHERE SteamId64 = " + steamid + " and PlayTime = 0; \
  SELECT avatar \
  FROM STEAMINING.INFO \
  WHERE SteamId64 = " + steamid + "; \
  SELECT UserName \
  FROM STEAMINING.INFO \
  WHERE SteamId64 = " + steamid + "; \
  \
  SELECT I.SteamId64, I.UserName, I.Avatar \
  FROM STEAMINING.FRIEND as F, STEAMINING.INFO as I \
  WHERE F.SteamId64 = "+ steamid +" and I.SteamId64 = F.friendId; \
  \
  SELECT B.GameId \
  FROM ( \
  		SELECT A.GameId, A.PlayTime \
  		FROM (\
  				SELECT F.SteamId64, F.friendId, U.GameId, U.PlayTime \
  				FROM STEAMINING.FRIEND as F JOIN STEAMINING.USERS as U ON (F.friendId = U.SteamId64) \
  			) as A \
  		WHERE (A.SteamId64 = "+steamid+") \
    ) AS B \
  WHERE B.GameId NOT IN (SELECT GameId FROM STEAMINING.USERS WHERE SteamId64 = "+steamid+") \
  GROUP BY B.GameId \
  ORDER BY SUM(B.PlayTime) DESC \
  LIMIT 6; \
  \
  SELECT appid \
  FROM STEAMINING.GAMES \
  WHERE STEAMINING.GAMES.appid not in (SELECT GameId FROM STEAMINING.USERS WHERE SteamId64 = "+steamid+") \
  ORDER BY ((positive - negative)*0.45 + average_forever*0.45 + discount*0.1) DESC \
  LIMIT 6 \
  "

  //Data base stored procedure:


  con.query(VIEW_GAMES_FOR_ID_QUERY, (err, results) => {
    if(err) {return res.send(err)}
    else {
      return res.json({data: results})
    }
  });
})
app.listen(4000,()=>{
  console.log('backend listening on 4000');
})

//--------------------------mongodb starts here--------------------------

// app.get('/find_my_friends',(req,res)=>{
//   const{ steamid } = req.query;
//   friend_list.API_friend_list(steamid);
//   res.send("Your friends updated!");
// })
