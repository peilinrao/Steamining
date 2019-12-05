var users_table = require('./users_table');
module.exports = {

    API_friend_list: function(steamid){
      console.log("Getting your friends:",steamid)
      var mysql = require('mysql');
      var con = mysql.createConnection({
        multipleStatements: true,
        host:'localhost',
        user:'root',
        password:'UIuc7355608!!',
        database:'STEAMINING'
      });
      const fetch = require('node-fetch')
      key = "AA7FA6275849EC957DF95C8DE0945CB7";
      function APIGetFriendList(key,steamid) {
        return fetch("http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key="+key+"&steamid="+steamid+"&relationship=friend") // Call the fetch function passing the url of the API as a parameter
        .then((resp) => resp.json())
      }
      async function insert_to_friends(listOfAll){
        var sql = "";
        var friend_list = listOfAll.friendslist.friends;
        for(var i = 0; i < friend_list.length; i++){
          friendId = friend_list[i].steamid
          console.log("Adding your friends",friendId);
          users_table.API_users_add(friendId);
          friend_since = friend_list[i].friend_since
          sql += "INSERT INTO STEAMINING.FRIEND(SteamId64, friendId, friend_since)values(\""+steamid+"\",\""+friendId+"\","+friend_since+") ON DUPLICATE KEY UPDATE friend_since = "+ friend_since +";"

        }
        con.connect(function(err) {
          if (err) throw err;
          console.log("Trying to add friends into our database.");
          con.query(sql, function (err, result) { if (err) throw err; console.log(err);});
        });
      };

      APIGetFriendList(key,steamid).then(listOfAll => insert_to_friends(listOfAll));

    }


};
