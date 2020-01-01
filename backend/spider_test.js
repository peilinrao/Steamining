const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const fetch = require('node-fetch')

const csgo_test = 'https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/'
const assassin_test = 'https://store.steampowered.com/app/812140/Assassins_Creed_Odyssey/'
const halo_test = "https://store.steampowered.com/app/813780/Age_of_Empires_II_Definitive_Edition/"

request(assassin_test,(error, response, html)=>{
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

  console.log(current_price_result,original_price_result,discount_result)

  //For positive reviews
  const reviews = $('.responsive_hidden')
  //console.log(parseInt(reviews.first().text().replace(/\D/g,'').trim()))
  comments = parseInt(reviews.last().text().replace(/\D/g,'').trim())
  const temp = $('.nonresponsive_hidden')
  var percentage_good = parseInt(temp.last().text().trim().split('%')[0].replace(/\D/g,''))
  positive = parseInt(comments*percentage_good/100)
  negative = comments-positive
  console.log(positive, negative)


  var result_json = {

    "name": name,
    "price": current_price_result,
    "init_price": original_price_result,
    "discount": discount_result,
    "positive": positive,
    "negative": negative,
    "owners": comments
  }

  return result_json
});

fetch(request).then(function(response){
  return response;
})
