const env = require('../configs');
const nodemailer = require('nodemailer');

exports.NodeMailer = (email, code) => {
  const mailOptions = {
    from: 'tanpn1099@gmail.com',
    to: email,
    subject: 'Password Reset For TANP-N',
    html: `<h2>Verification Code:</h2>
          <p>${code}</p>`,
  };

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
  });
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error ' + err);
    } else {
      console.log(`Email sent to ${data.accepted} successfully`);
    }
  });
};
