const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    host: 'localhost',
    port: 2525,
    secure: false,
    auth: {
        user: 'username',
        pass: 'password',
    },
    tls: {
        rejectUnauthorized: false,
    },
});
transport
    .sendMail({
        from: 'trandungksnb00@gmail.com',
        subject: 'Hello',
        to: 'trandungitksnb2001@gmail.com',
        text: 'That was damn easy!',
    })
    .then((rs) => console.log(rs));
