const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

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
app.use(bodyParser.json());


app.post('/sendFormData', (req, res) => {
    console.log(req.body, 'data of form');
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "331bc9da96e94e",
            pass: "cb4cdef121e364"
        }
    });

    var mailOptions = {
        from: 'aggc@gmail.com',
        to: 'info@info.com',
        subject: "Information about the process of your order",
        html: `
        <table style="width: 100%; border: none">
          <thead>
            <tr style="background-color: #000; color: #fff;">
              <th style="padding: 10px 0">Proceso</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style="text-align: center">${req.body.name}</th>
            </tr>
          </tbody>
        </table>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).json({
                message: 'Correo enviado exitosamente!'
            })
        }
    });
});

app.listen(3000, () => {
    console.log('server on port 3000');
});