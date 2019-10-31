var users_table = require('./users_table');

const express = require('express');
const cors = require('cors');
const app = express();

//
var mysql = require('mysql');
var con = mysql.createConnection({
  multipleStatements: true,
  host:'localhost',
  user:'root',
  password:'password',
  database:'STEAMINING_MAIN'
});

con.connect(err => {if(err) {return err;}})
//
app.use(cors());

app.get('/',(req,res)=>{
  res.send('hello from the other side (backend)');
});

app.get('/add_into_database',(req,res)=>{
  const{ steamid } = req.query;
  users_table.API_users_add(steamid);
  res.send("You are added!");
})

//
app.get('/show', (req, res) => {
  const {steamid} = req.query;
  const VIEW_GAMES_FOR_ID_QUERY = "SELECT * FROM STEAMINING_MAIN.USERS WHERE SteamId64 = " + steamid + ";"
  con.query(VIEW_GAMES_FOR_ID_QUERY, (err, results) => {
    if(err) {return res.send(err)}
    else {
      return res.json({data: results})
    }
  });
})
//

app.listen(4000,()=>{
  console.log('backend listening on 4000');
})
