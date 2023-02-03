const { sendgrid } = require('../config');

// const sgMail  = require('@sendgrid/mail')
// sgMail.setApiKey(sendgrid.API_KEY);

// const sendMail = async (to, subject, text) => {
//   let message = {
//     to,
//     from: sendgrid.SENDER_EMAIL,
//     subject,
//     text
//   }

//   try {
//     await sgMail.send(message);
//     console.log('Mail Sent');
//   }
//   catch (error) {
//     console.error('Error Sending Mail', error);
//   }
// };

// module.exports = {
//   sendMail
// }

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: sendgrid.API_KEY,
    },
  }),
);

const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      to,
      from: sendgrid.SENDER_EMAIL,
      subject,
      text,
      html,
    });
    console.log('Email sent: ' + JSON.stringify(info));
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendMail,
};
