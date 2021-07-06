
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const fs = require('fs');


/** Código fuente extraído de Nodemailer y GitHub
 *  Url= https://nodemailer.com/smtp/
 *  Url= https://github.com/LilyaMelkonyan/NodeMailer-with-Angular-7
*/

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/** Código fuente de Stackoverflow
 *  Url= https://stackoverflow.com/questions/39489229/pass-variable-to-html-template-in-nodemailer/39489955#39489955
*/

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    }
    else {
      callback(null, html);
    }
  });
};

app.use(bodyParser.json());


app.post('/sendFormData', (req, res) => {
  console.log(req.body, 'data of form');
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "exportandomateria@gmail.com",
      pass: ""
    }
  });

  readHTMLFile('public/index.html', function (err, html) {
    let template = handlebars.compile(html);
    let htmlToSend = template(req);

    var mailOptions = {
      from: 'exportandomateria@gmail.com',
      to: req.body.email,
      subject: "Information about the process of your order",
      html: htmlToSend

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).send(error.message);
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({
          message: 'successfuly sent!'
        })
      }
    });
  })
});

app.listen(3000, () => {
  console.log('server on port 3000');
});

module.exports = app;