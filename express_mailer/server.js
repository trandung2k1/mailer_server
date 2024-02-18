require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { USER, PASSWORD, HOST, PORT_MAIL } = process.env;
const transport = nodemailer.createTransport({
  host: HOST,
  port: PORT_MAIL,
  secure: false,
  auth: {
    user: USER,
    pass: PASSWORD,
  },
});
// console.log(process.env.NODE_ENV);
const app = express();
const port = process.env.PORT || 4000;
transport.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Ready for message');
    console.log(success);
  }
});
app.get('/', async (req, res) => {
  try {
    const rs = await transport.sendMail({
      from: 'trandungksnb00@gmail.com',
      subject: 'Hello',
      to: 'trandungitksnb2001@gmail.com',
      html: '<h2>Hello</h2>',
    });
    return res.status(200).json(rs);
  } catch (error) {
    return res.status(500).json(error);
  }
});
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
