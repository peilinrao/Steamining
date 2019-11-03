var users_table = require('./users_table');
var games_table = require('./games_table');

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

app.get('/test_apt_getgames',(req,res)=>{
  games_table.API_get_games();
});

app.get('/add_into_database',(req,res)=>{
  const{ steamid } = req.query;
  users_table.API_users_add(steamid);
  res.send("You are added!");
})

app.get('/delete_from_database',(req,res)=>{
  const{ steamid } = req.query;
  users_table.API_users_delete(steamid);
  res.send("You are deleted!");
})

app.get('/update_database',(req,res)=>{
  const{ steamid } = req.query;
  users_table.API_users_update(steamid);
  res.send("You are updated!");
})

app.get('/search', (req, res) => {
  const {steamid} = req.query;
  const VIEW_GAMES_FOR_ID_QUERY = "SELECT * FROM STEAMINING.USERS WHERE SteamId64 = " + steamid + ";"
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
