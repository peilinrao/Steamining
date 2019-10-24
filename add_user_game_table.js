const fetch = require('node-fetch')

function APIGetPlayerSummaries(key,steamid) {
  return fetch("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="+key+"&steamids="+steamid+"&format=json")
         .then(res => res.json());
}
function APIGetOwnedGames(key,steamid) {
  return fetch("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+key+"&steamid="+steamid+"&format=json") // Call the fetch function passing the url of the API as a parameter
  .then((resp) => resp.json())
}


function APICalls(key, steamid){
  APIGetOwnedGames(key,steamid)
  .then(responseTwo => {
      APIGetPlayerSummaries(key,steamid)
      .then(responseOne => {
        insert_to_user_game_table(responseOne, responseTwo);
      });
  });
}

function insert_to_user_game_table(responseOne, responseTwo){
  console.log("Sanity check:")
  console.log("Are we ok with GetPlayerSummaries?:",responseOne!=null);
  console.log("Are we ok with GetPlayerSummaries?:",responseTwo!=null);

  
}


key = "AA7FA6275849EC957DF95C8DE0945CB7"
steamid = "76561198269300487"
APICalls(key,steamid);
