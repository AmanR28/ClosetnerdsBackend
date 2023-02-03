const { sendgrid } = require('../config');

const sgMail  = require('@sendgrid/mail')
sgMail.setApiKey(sendgrid.API_KEY);

exports.sendMail = async (to, subject, text) => {
  let message = {
    to,
    from: sendgrid.SENDER_EMAIL,
    subject,
    text
  }

  try {
    await sgMail.send(message);
    console.log('Mail Sent');
  }
  catch (error) {
    console.error('Error Sending Mail', error);
  }
};

const sendMail = async (message) => {
  try {
    await sgMail.send(message);
    console.log('Mail Sent');
  }
  catch (error) {
    console.error('Error Sending Mail', error);
  }
}

exports.sendSignupMail = async (email) => {
  let message = {
    to: email,
    from: sendgrid.SENDER_EMAIL,
    subject: 'Registration Successful',
    text:  'Welcome to ClosetNerds',
    html:  '<h1>Welcome to ClosetNerds</h1>'
  }
  await sendMail(message);
}