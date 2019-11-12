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
      req.checkBody('title', "title reqired").notEmpty();
      req.checkBody('sellprice', "sellprice reqired").notEmpty();
      req.checkBody('regularprice', "regularprice reqired").notEmpty();
      req.checkBody('productlink', "productlink reqired").notEmpty();
      req.checkBody('imageurl', "imageurl reqired").notEmpty();
      var error = req.validationErrors();
      if (error && error.length) {
        return nextCall({ msg: error[0].msg });
      }
      nextCall(null, req.body);
    },
    function (body, nextCall) {
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@testchannel0112'; // <= replace with yours

      var html =  '🛍'+body.title+'\n\n' +
        '<b>Now  @'+ body.sellprice +'Rs.</b>\n' +
        '<i>(Regular Price:'+ body.regularprice + 'Rs.)</i>\n' +
        '<a href='+body.productlink+'>'+body.productlink+'</a>\n';

        // var html = ' <img src=' + body.imageurl+' alt="Smiley face" height="42" width="42"> \n\n' + body.title+'\n\n' +
        // '<b>Now  @'+ body.sellprice +'Rs.</b>\n' +
        // '<i>(Regular Price:'+ body.regularprice + 'Rs.)</i>\n' +
        // '<a href='+body.productlink+'>'+body.productlink+'</a>\n';

        var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 BUY HERE 🛒 ⬅️ ⬅️", "url": body.productlink }
        ]
      ];

      bot = new nodeTelegramBotApi(token, { polling: true });
      bot.sendPhoto(chatId,body.imageurl,{caption : html,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        "reply_markup": {
          "inline_keyboard": buttons
        }
      }  );
   
      // bot.sendMessage(chatId, html,
      //   {
      //     parse_mode: "HTML",
      //     disable_web_page_preview: true,
      //     "reply_markup": {
      //       "inline_keyboard": buttons
      //     }
      //   }
      // );
          nextCall(null, body);

      console.log('contactData: ', contactData);
      // let contactDatas = new contactUsSchema(contactData);
      // contactDatas.save((err, notification) => {
      //   if (err) {
      //     return nextCall({
      //       "message": message.SOMETHING_WENT_WRONG,
      //     });
      //   }
      //   else {
      //     nextCall(null, notification);
      //   }
      // })
    },
  ], function (err, response) {
    console.log('err: ', err);
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
