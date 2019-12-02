var users_table = require('./users_table');
var games_table = require('./games_table');
var visitors_table = require('./visitors_table');

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


app.get('/',(req,res)=>{
  res.send('hello from the other side (backend)');
});

// app.get('/test_apt_getgames',(req,res)=>{
//   res.send("Updating game table");
//   games_table.API_get_games();
//   res.send("Updated game table!");
// });
//
app.get('/update_user_database',(req,res)=>{
  const{ steamid } = req.query;
  users_table.API_users_add(steamid);
  res.send("You are added!");
})
//
// app.get('/delete_from_database',(req,res)=>{
//   const{ steamid } = req.query;
//   users_table.API_users_delete(steamid);
//   res.send("You are deleted!");
// })
//
app.get('/update_game_database',(req,res)=>{
  const{ steamid } = req.query;
  games_table.API_get_games(steamid);
  res.send("You are updated!");
})

app.get('/search', (req, res) => {

  const {steamid} = req.query;

  const VIEW_GAMES_FOR_ID_QUERY = "SELECT COUNT(GameId) FROM STEAMINING.USERS WHERE SteamId64 = " + steamid + " GROUP BY SteamId64; SELECT SUM(PlayTime) FROM STEAMINING.USERS WHERE SteamId64 = " + steamid + " GROUP BY SteamId64; SELECT SUM(G.price) FROM STEAMINING.USERS as U, (SELECT DISTINCT appid, price FROM STEAMINING.GAMES) as G WHERE U.GameId = G.appid and U.SteamId64 = " + steamid + " GROUP BY U.SteamId64; SELECT G.name, U.PlayTime FROM STEAMINING.USERS as U, (SELECT DISTINCT appid, name FROM STEAMINING.GAMES) as G WHERE U.GameId = G.appid and U.SteamId64 = " + steamid + " ORDER BY U.PlayTime DESC Limit 5;"
  con.query(VIEW_GAMES_FOR_ID_QUERY, (err, results) => {
    if(err) {return res.send(err)}
    else {
      return res.json({data: results})
    }
  });
})

//visitors_table.API_total_games("76561198269300487");
app.listen(4000,()=>{
  console.log('backend listening on 4000');
})
