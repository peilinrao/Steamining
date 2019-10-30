var users_table = require('./users_table');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/',(req,res)=>{
  res.send('hello from the other side (backend)');
});

app.get('/add_into_database',(req,res)=>{
  const{ steamid } = req.query;
  users_table.API_users_add_into_database(steamid);
  res.send("You are added!");
})

app.listen(4000,()=>{
  console.log('backend listening on 4000');
})
