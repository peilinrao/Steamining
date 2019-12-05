module.exports = {
  
    API_TopGame: function(){
      console.log("Get top games")
      const fetch = require('node-fetch')
      function API_Get_TopGames() {
        return fetch("http://www.steamspy.com/api.php?request=top100owned") // Call the fetch function passing the url of the API as a parameter
        .then((resp) => resp.json())
      }
      async function insert_to_mongo(listOfAll){
        keys = Object.keys(listOfAll)
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, client) {
          if (err) throw err;
          var db = client.db("steamining");
          var arr = []
          for(var i = 0; i < keys.length ; i++){
            var myobj = { appid: listOfAll[keys[i]].appid, name: listOfAll[keys[i]].name };
            arr.push(myobj)
          }
          //console.log(arr);
          db.collection("news").insertMany(arr, function(err, res) {
            if (err) throw err;
            console.log("all document inserted");
            client.close();
          });
        });
      };

      API_Get_TopGames().then(listOfAll => insert_to_mongo(listOfAll));

    },
};
