var express = require('express');
var router = express.Router();
var async = require('async');
const { OperationHelper } = require('apac');
var nodeTelegramBotApi = require("node-telegram-bot-api");
let request = require("request");
var config = require('../config/global');
const axios = require('axios');
var textVersion = require("textversionjs");
const cheerio = require('cheerio')
const opHelper = new OperationHelper({
  'awsId': 'AKIAJLFL6KDKK2CQOM3A',
  'awsSecret': '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',
  'assocId': 'kudrati-21',
  'locale': 'IN'
});
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/telegram_post', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@testchannel0112'; // <= replace with yours

      var savings = req.query.regularprice - req.query.sellprice;
      var savEPERCENT = Math.round(100 * savings / req.query.regularprice);

      var html = '🛍 ' + req.query.title + '\n\n' +
        '🚫 <b>M.R.P. : </b> ₹ ' + req.query.regularprice + '\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ₹ ' + req.query.sellprice + '\n' +
        '💰 <b>SAVINGS : </b> ₹ ' + savings + ' (' + savEPERCENT + '%)\n' +
        '🔗 <a href=' + req.query.productlink.text + '>' + req.query.productlink + '</a>\n' +
        '🚚 FREE Delivery\n\n' +
        'More Deals - @OnlyLooterJunction\n' +
        '🌐Website - <a href=' + req.query.productlink.text + '>' + req.query.productlink + '</a>\n';

      console.log('html: ', html);

      var buttons = [
        [
          // { "text": "➡️ ➡️ 🛒 BUY HERE 🛒 ⬅️ ⬅️", "url": req.query.productlink }
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": req.query.productlink }
        ]
      ];
      if (html) {
        bot = new nodeTelegramBotApi(token, { polling: true });
        bot.sendPhoto(chatId, req.query.imageurl, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
        nextCall(null, req.query);
      }

    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

router.get('/telegram', function (req, res, next) {
  async.waterfall([
    function (nextCall) {

      let requestHeaders1 = {
        "Content-Type": "application/json",
        "apikey": "4cac33db1c9140a8a9dfd6fa9f4c3510",
        //  "workspace": "07757180185b4e3da431e5f902b704c1"

      }

      let linkRequest1 = {
        destination: "https://www.amazon.in/Trost-Bluetooth-Ear-Compatible-Smartphone/dp/B07WTLWYYB?SubscriptionId=AKIAJLFL6KDKK2CQOM3A&tag=kudrati-21&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B07WTLWYYB",
        domain: { fullName: "link.bestshoppingdeal.in" },
        "id": "07757180185b4e3da431e5f902b704c1",
        // Content-Type: "application/json",
        // apikey: "4cac33db1c9140a8a9dfd6fa9f4c3510",
        //, slashtag: "A_NEW_SLASHTAG"
        title: "amzn"
      }

      request({
        uri: "https://api.rebrandly.com/v1/links",
        method: "POST",
        body: JSON.stringify(linkRequest1),
        headers: requestHeaders1
      }, (err, response, body) => {
        let link = JSON.parse(body);
        nextCall(null, link);

        console.log(`Long URL was ${link.destination}, short URL is ${link.shortUrl}`);
      })
    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

router.get('/telegram_posts', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@' + req.query.chanel; // <= replace with yours


      // var html = '🛍' + req.query.title + '\n\n' +
      //   '<b>Now  @' + req.query.sellprice + 'Rs.</b>\n' +
      //   '<i>(Regular Price:' + req.query.regularprice + 'Rs.)</i>\n' +
      //   '<a href='+req.query.productlink+'>'+req.query.productlink+'</a>\n';
      var savings = req.query.regularprice - req.query.sellprice;
      var savEPERCENT = Math.round(100 * savings / req.query.regularprice);

      var html = '🛍 ' + req.query.title + '\n\n' +
        '🚫 <b>M.R.P. : </b> ₹ ' + req.query.regularprice + '\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ₹ ' + req.query.sellprice + '\n' +
        '💰 <b>SAVINGS : </b> ₹ ' + savings + ' (' + savEPERCENT + '%)\n' +
        '🔗 <a href=' + req.query.productlink.text + '>' + req.query.productlink + '</a>\n' +
        '🚚 FREE Delivery\n\n' +
        // '👉 More Deals - <a href= @' + req.query.chanel + '> @' + req.query.chanel+'</a>\n'+
        // '👉 More Deals - @' + req.query.chanel;
        '👉 <a href="https://t.me/bestshoppingdeal00"> Join US for More Deals </a>\n';
      // +'\n'+
      // '🌐 Website - <a href=' + req.query.website.text + '>' + req.query.website + '</a>';


      // var html = 'Visko Tools 802 Home Tool Kit (3 Pieces)\n\n'+
      // '<b>Now  @ 116 Rs.</b>\n'+
      // '<i>(Regular Price: 216 Rs.)</i>\n'+
      // '<a href="https://amzn.to/2NCz4q0">https://amzn.to/2NCz4q0</a>\n';

      var buttons = [
        [
          // { "text": "➡️ ➡️ 🛒 BUY HERE 🛒 ⬅️ ⬅️", "url": req.query.productlink }
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": req.query.productlink }
        ]
      ];
      if (html) {
        bot = new nodeTelegramBotApi(token, { polling: true });
        bot.sendPhoto(chatId, req.query.imageurl, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
        nextCall(null, req.query);
      }

    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

router.get('/telegram_postss', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
      opHelper.execute('ItemSearch', {
        'SearchIndex': 'All',
        'Keywords': req.query.asin,
        // 'ASIN': 'B07W184FS2',
        'ItemPage': '1',
        'ResponseGroup': 'ItemAttributes,Offers,OfferFull,Reviews,SearchBins,SalesRank,Images,Tracks,OfferListings,PromotionSummary,PromotionalTag,EditorialReview,VariationOffers,Variations'
      }).then((response) => {
        let productUrl = response.result.ItemSearchResponse.Items.Item[0].DetailPageURL ? response.result.ItemSearchResponse.Items.Item[0].DetailPageURL : response.result.ItemSearchResponse.Items.MoreSearchResultsUrl;
        // let finalProductUrl = 'https://api.rebrandly.com/v1/links/new?Content-Type=application/json&apikey=4cac33db1c9140a8a9dfd6fa9f4c3510&destination=' + productUrl + '%2F&title=amzn&domain%5Bid%5D=07757180185b4e3da431e5f902b704c1&domain%5BfullName%5D=link.bestshoppingdeal.in';

        // console.log('response: ', response);
        // res.send(finalProductUrl)
        // debugger;
        // https://api.rebrandly.com/v1/links/
        // new?Content-Type=application/json&
        // apikey=4cac33db1c9140a8a9dfd6fa9f4c3510&destination=DESTINATION_LINK%2F
        // &title=amzn&domain%5Bid%5D=07757180185b4e3da431e5f902b704c1
        // &domain%5BfullName%5D=link.bestshoppingdeal.in

        nextCall(null, productUrl);
      }).catch((err) => {
        console.error("Something went wrong! ", err);
      })
    },
    function (body, nextCall) {


      let requestHeaders1 = {
        "Content-Type": "application/json",
        "apikey": "4cac33db1c9140a8a9dfd6fa9f4c3510",
        //  "workspace": "07757180185b4e3da431e5f902b704c1"

      }

      let linkRequest1 = {
        destination: body,
        domain: { fullName: "link.bestshoppingdeal.in" },
        "id": "07757180185b4e3da431e5f902b704c1",
        // Content-Type: "application/json",
        // apikey: "4cac33db1c9140a8a9dfd6fa9f4c3510",
        //, slashtag: "A_NEW_SLASHTAG"
        title: "amzn"
      }

      request({
        uri: "https://api.rebrandly.com/v1/links",
        method: "POST",
        body: JSON.stringify(linkRequest1),
        headers: requestHeaders1
      }, (err, response, body) => {
        let link = JSON.parse(body);
        // let postLink = link.shortUrl;
        // res.send(link.shortUrl);
        // debugger;
        nextCall(null, link.shortUrl);
      })

    },
    function (postLink, nextCall) {
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@' + req.query.chanel; // <= replace with yours
      var savings = req.query.regularprice - req.query.sellprice;
      var savEPERCENT = Math.round(100 * savings / req.query.regularprice);

      var html = '🛍 ' + req.query.title + '\n\n' +
        '🚫 <b>M.R.P. : </b> ₹ ' + req.query.regularprice + '\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ₹ ' + req.query.sellprice + '\n' +
        '💰 <b>SAVINGS : </b> ₹ ' + savings + ' (' + savEPERCENT + '%)\n' +
        '🔗 <a href=' + postLink.text + '>' + postLink + '</a>\n' +
        // '🔗 <a href=' + postLink + '>' + postLink + '</a>\n' +
        '🚚 FREE Delivery\n\n' +
        // // '👉 More Deals - <a href= @' + req.query.chanel + '> @' + req.query.chanel+'</a>\n'+
        '👉 <a href="https://t.me/bestshoppingdeal00"> Join US for More Deals </a>\n';
      // '🌐 Website - <a href=' + req.query.website.text + '>' + req.query.website + '</a>';

      var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": req.query.productlink }
        ]
      ];
      if (html) {
        bot = new nodeTelegramBotApi(token, { polling: true });
        bot.sendPhoto(chatId, req.query.imageurl, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
        nextCall(null, req.query);
      }

    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

router.get('/automation_posts', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
        let requestHeaders1 = {
          "Content-Type": "application/json",
          "accept": "application/json",
        }
        request({
          uri: "https://t.me/s/IHDBroadcast",
          method: "GET",
          headers: requestHeaders1
        }, (err, response, body) => {
          nextCall(null, body);
        })
    },function (bodyss,nextCall) {
      // var $ = bodyss;
      axios('https://t.me/s/IHDBroadcast')
      // axios('https://www.amazon.in/dp/B07RY8ZFSL')
      .then(response => {
          var html = response.data;
      var $ = cheerio.load(html);
      console.log('$: ', $);
      // var hhhs = $('.tgme_container').text();
      // console.log('hhhs: ', hhhs);
      // debugger;


      var matchObj = [];

      $('.tgme_widget_message_wrap').each((i, el) => {
      var  linkss = $(el).find('.tgme_widget_message_footer') .find('a').attr('href').split('/');
      console.log('linkss: ', Number(linkss[4]));
      
      var  link = textVersion($(el).find('.tgme_widget_message_text').html());
      console.log('link: ', link.toString());
      console.log("pppppp");
      });
      console.log("dd");

      let arrayGroupNumber =[
        {
          "name": "Amazon Offer Alert - 1🛍🛒🔥",
          "id": "916353594230-1570365608@g.us"
        },
        {
          "name": "Amazon Offer Alert - 2🛍🛒🔥",
          "id": "916353594230-1570379159@g.us"
        },
        {
          "name": "Amazon Offer Alert - 3🛍🛒🔥",
          "id": "916353594230-1570969831@g.us"
        },
        {
          "name": "Amazon Offer Alert - 4🛍🛒🔥",
          "id": "916353594230-1570971252@g.us"
        },
        {
          "name": "Amazon Offer Alert -5🛍🛒🔥",
          "id": "916353594230-1571493437@g.us"
        },
        {
          "name": "Amazon Offer Alert - 6🛍🛒🔥",
          "id": "916353594230-1571491746@g.us"
        },
        {
          "name": "Amazon Offer Alert - 7🛍🛒🔥",
          "id": "916353594230-1571491944@g.us"
        },
        {
          "name": "Amazon Offer Alert - 8🛍🛒🔥",
          "id": "916353594230-1571493106@g.us"
        },
        {
          "name": "Amazon Offer Alert - 9🛍🛒🔥",
          "id": "916353594230-1571493284@g.us"
        },
        {
          "name": "Amazon Offer Alert -10🛍🛒🔥",
          "id": "916353594230-1574959445@g.us"
        }
      ]

      for(let i =0 ; i < arrayGroupNumber.length ; i++){
      let requestHeaders1 = {
        "Content-Type": "application/json",
        "accept": "application/json",
        "x-maytapi-key": config.apiKey
      }

      let linkRequest1 = {
        "to_number": arrayGroupNumber[i].id,
        "type": "text",
        "message": '🛍 ' +decodeURI(encodeURI(req.query.message))
      }

      request({
        uri: "https://api.maytapi.com/api/" + config.productId + "/"+ config.phoneId+"/sendMessage",
        method: "POST",
        body: JSON.stringify(linkRequest1),
        headers: requestHeaders1
      }, (err, response, body) => {
        let link = JSON.parse(body);
      })
    }
    nextCall(null,bodyss);
      })

    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       console.log('req.param: ', req.query);

//       if(req.query.apiKey && req.query.productId){
//         config.apiKey = req.query.apiKey;
//         config.productId = req.query.productId;
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//           "x-maytapi-key": config.apiKey
//         }
//         request({
//           uri: "https://api.maytapi.com/api/" + config.productId + "/listPhones",
//           method: "GET",
//           // body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//           config.phoneId = req.query.phoneId;
//           nextCall(null, link);
//         })
//       }else{
//         nextCall(null, "demo");
//       }

//     },function (bodyss,nextCall) {
//       let arrayGroupNumber =[
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "916353594230-1570365608@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "916353594230-1570379159@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 3🛍🛒🔥",
//           "id": "916353594230-1570969831@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 4🛍🛒🔥",
//           "id": "916353594230-1570971252@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -5🛍🛒🔥",
//           "id": "916353594230-1571493437@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 6🛍🛒🔥",
//           "id": "916353594230-1571491746@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 7🛍🛒🔥",
//           "id": "916353594230-1571491944@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 8🛍🛒🔥",
//           "id": "916353594230-1571493106@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 9🛍🛒🔥",
//           "id": "916353594230-1571493284@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -10🛍🛒🔥",
//           "id": "916353594230-1574959445@g.us"
//         }
//       ]

//       for(let i =0 ; i < arrayGroupNumber.length ; i++){
//       let requestHeaders1 = {
//         "Content-Type": "application/json",
//         "accept": "application/json",
//         "x-maytapi-key": config.apiKey
//       }

//       let linkRequest1 = {
//         "to_number": arrayGroupNumber[i].id,
//         "type": "text",
//         "message": '🛍 ' +decodeURI(encodeURI(req.query.message))
//       }

//       request({
//         uri: "https://api.maytapi.com/api/" + config.productId + "/"+ config.phoneId+"/sendMessage",
//         method: "POST",
//         body: JSON.stringify(linkRequest1),
//         headers: requestHeaders1
//       }, (err, response, body) => {
//         let link = JSON.parse(body);
//       })
//     }
//     nextCall(null,bodyss);
//     },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });

// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       let arrayGroupNumber = [
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "916353594230-1570365608@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "916353594230-1570379159@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 3🛍🛒🔥",
//           "id": "916353594230-1570969831@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 4🛍🛒🔥",
//           "id": "916353594230-1570971252@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -5🛍🛒🔥",
//           "id": "916353594230-1571493437@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 6🛍🛒🔥",
//           "id": "916353594230-1571491746@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 7🛍🛒🔥",
//           "id": "916353594230-1571491944@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 8🛍🛒🔥",
//           "id": "916353594230-1571493106@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 9🛍🛒🔥",
//           "id": "916353594230-1571493284@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -10🛍🛒🔥",
//           "id": "916353594230-1574959445@g.us"
//         }
//       ]

//       const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ "];
//       const randomMonth = months[Math.floor(Math.random() * months.length)];


//       for (let i = 0; i < arrayGroupNumber.length; i++) {
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//           "x-maytapi-key": req.query.apiKey
//         }

//         let linkRequest1 = {
//           "to_number": arrayGroupNumber[i].id,
//           "type": "text",
//           "message": randomMonth + decodeURI(encodeURI(req.query.message))
//         }

//         request({
//           uri: "https://api.maytapi.com/api/" + req.query.productId + "/" + req.query.phoneId + "/sendMessage",
//           method: "POST",
//           body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//         })
//       }
//       nextCall(null, "demo");
//     },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });

// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       let arrayGroupNumber = [
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "916353594230-1570365608@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "916353594230-1570379159@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 3🛍🛒🔥",
//           "id": "916353594230-1570969831@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 4🛍🛒🔥",
//           "id": "916353594230-1570971252@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -5🛍🛒🔥",
//           "id": "916353594230-1571493437@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 6🛍🛒🔥",
//           "id": "916353594230-1571491746@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 7🛍🛒🔥",
//           "id": "916353594230-1571491944@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 8🛍🛒🔥",
//           "id": "916353594230-1571493106@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 9🛍🛒🔥",
//           "id": "916353594230-1571493284@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -10🛍🛒🔥",
//           "id": "916353594230-1574959445@g.us"
//         }
//       ]

//       const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ "];
//       const randomMonth = months[Math.floor(Math.random() * months.length)];


//       for (let i = 0; i < arrayGroupNumber.length; i++) {
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//         }

//         let linkRequest1 = {
//             "chatId": arrayGroupNumber[i].id,
//             "body": randomMonth + decodeURI(encodeURI(req.query.message))
//         }

//         request({
//           uri: "https://api.chat-api.com/instance109074/sendMessage?token=0xh48oclbsfv3zu3&_ga=2.130264071.962361358.1584778333-1227591583.1584778333",
//           method: "POST",
//           body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//         })
//       }
//       nextCall(null, "demo");
//     },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });

// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       console.log('req.param: ', req.query);

//       if(req.query.apiKey && req.query.productId){
//         config.apiKey = req.query.apiKey;
//         config.productId = req.query.productId;
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//           "x-maytapi-key": config.apiKey
//         }
//         request({
//           uri: "https://api.maytapi.com/api/" + config.productId + "/listPhones",
//           method: "GET",
//           // body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//           config.phoneId = req.query.phoneId;
//           nextCall(null, link);
//         })
//       }else{
//         nextCall(null, "demo");
//       }

//     },function (bodyss,nextCall) {
//       let arrayGroupNumber =[
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "916353594230-1570365608@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "916353594230-1570379159@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 3🛍🛒🔥",
//           "id": "916353594230-1570969831@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 4🛍🛒🔥",
//           "id": "916353594230-1570971252@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -5🛍🛒🔥",
//           "id": "916353594230-1571493437@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 6🛍🛒🔥",
//           "id": "916353594230-1571491746@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 7🛍🛒🔥",
//           "id": "916353594230-1571491944@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 8🛍🛒🔥",
//           "id": "916353594230-1571493106@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 9🛍🛒🔥",
//           "id": "916353594230-1571493284@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -10🛍🛒🔥",
//           "id": "916353594230-1574959445@g.us"
//         }
//       ]

//       // for(let i =0 ; i < arrayGroupNumber.length ; i++){
//       let requestHeaders1 = {
//         "Content-Type": "application/json",
//         "accept": "application/json",
//         "x-maytapi-key": config.apiKey
//       }

//       let ggff = decodeURI(encodeURI(req.query.message));
//       let linkRequest1 = {
//         "to_number": '17084352567-1495533551@g.us',
//         "type": "text",
//         "message": ggff
//       }

//       request({
//         uri: "https://api.maytapi.com/api/" + config.productId + "/"+ config.phoneId+"/sendMessage",
//         method: "POST",
//         body: JSON.stringify(linkRequest1),
//         headers: requestHeaders1
//       }, (err, response, body) => {
//         let link = JSON.parse(body);
//         nextCall(null, bodyss);
//       })
//     }
//     // },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });
module.exports = router;



