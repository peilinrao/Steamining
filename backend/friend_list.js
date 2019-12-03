module.exports = {
    API_friend_list: function(steamid){
      console.log("Getting your friends:",steamid)
      const fetch = require('node-fetch')
      key = "AA7FA6275849EC957DF95C8DE0945CB7";
      function APIGetFriendList(key,steamid) {
        return fetch("http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key="+key+"&steamid="+steamid+"&relationship=friend") // Call the fetch function passing the url of the API as a parameter
        .then((resp) => resp.json())
      }
      async function insert_to_mongo(listOfAll){
        console.log(listOfAll)
        friend_list = listOfAll.friendslist.friends;
        console.log(friend_list.length)
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, client) {
          if (err) throw err;
          var db = client.db("steamining");
          var arr = []
          for(var i = 0; i < friend_list.length; i++){
            var myobj = { steamid: friend_list[i].steamid, friend_since: friend_list[i].friend_since };
            arr.push(myobj)
          }
          var obj = { mysteam: steamid, friend_list:arr};
          console.log(obj);
          db.collection("friend_list").update(obj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            client.close();
          });
        });
      };

      APIGetFriendList(key,steamid).then(listOfAll => insert_to_mongo(listOfAll));

    }

};
