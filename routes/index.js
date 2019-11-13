var express = require('express');
var router = express.Router();
var async = require('async');
var nodeTelegramBotApi = require("node-telegram-bot-api")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/telegram_post', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@testchannel0112'; // <= replace with yours

      var html = '🛍' + req.query.title + '\n\n' +
        '<b>Now  @' + req.query.sellprice + 'Rs.</b>\n' +
        '<i>(Regular Price:' + req.query.regularprice + 'Rs.)</i>\n' +
        '<a href=' + req.query.productlink + '>' + req.query.productlink + '</a>\n';

      var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 BUY HERE 🛒 ⬅️ ⬅️", "url": req.query.productlink }
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

module.exports = router;
