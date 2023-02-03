const { sendgrid } = require('../config');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgrid.API_KEY);

const sendMail = async (to, subject, text, html) => {
  let message = {
    to,
    from: sendgrid.SENDER_EMAIL,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(message);
  } catch (error) {
    console.error('Error Sending Mail', error);
  }
};

module.exports = {
  sendMail,
};
