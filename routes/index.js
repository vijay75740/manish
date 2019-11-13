var express = require('express');
var router = express.Router();
var async = require('async');
var nodeTelegramBotApi = require("node-telegram-bot-api")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/telegram_post', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
      // req.checkBody('title', "title reqired").notEmpty();
      // req.checkBody('sellprice', "sellprice reqired").notEmpty();
      // req.checkBody('regularprice', "regularprice reqired").notEmpty();
      // req.checkBody('productlink', "productlink reqired").notEmpty();
      // req.checkBody('imageurl', "imageurl reqired").notEmpty();

      req.checkBody('url', "url reqired").notEmpty();
      var error = req.validationErrors();
      if (error && error.length) {
        return nextCall({ msg: error[0].msg });
      }
      nextCall(null, req.body);
    },
    function (body, nextCall) {
      var postarray = [];
      var keyval = body.url.split('?')[1].split('&');
      for (var x = 0, y = keyval.length; x < y; x += 1) {
        postarray.push(keyval[x].split('=')[1])
      }
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@testchannel0112'; // <= replace with yours

      var html = '🛍' + postarray[0] + '\n\n' +
        '<b>Now  @' + postarray[1] + 'Rs.</b>\n' +
        '<i>(Regular Price:' + postarray[2] + 'Rs.)</i>\n' +
        '<a href=' + postarray[3] + '>' + postarray[3] + '</a>\n';

      var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 BUY HERE 🛒 ⬅️ ⬅️", "url": postarray[3] }
        ]
      ];
      if (html) {
        bot = new nodeTelegramBotApi(token, { polling: true });
        bot.sendPhoto(chatId, postarray[4], {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
        nextCall(null, body);
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

module.exports = router;
