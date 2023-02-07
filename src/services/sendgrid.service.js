const sgMail = require('@sendgrid/mail');

const { sendgrid, template } = require('../config');
sgMail.setApiKey(sendgrid.API_KEY);

const sendMail = async message => {
  try {
    await sgMail.send(message);
    console.log('Mail Sent');
  } catch (error) {
    console.error('Error Sending Mail', error);
  }
};

exports.smProfileRegister = async email => {
  let message = {
    to: email,
    from: sendgrid.SENDER_EMAIL,
    subject: 'Profile Registration Successful',
    text: 'Welcome to ClosetNerds',
    html: '<h1>Welcome to ClosetNerds</h1>',
  };
  await sendMail(message);
};

exports.smProfileComplete = async email => {
  let message = {
    to: email,
    from: sendgrid.SENDER_EMAIL,
    subject: 'Profile Completed!',
    text: 'Welcome to ClosetNerds',
    html: '<h1>Welcome to ClosetNerds</h1>',
  };
  await sendMail(message);
};

exports.smSignUp = async email => {
  let message = {
    to: email,
    from: sendgrid.SENDER_EMAIL,
    subject: 'SignUp Successful',
    text: 'Welcome to ClosetNerds',
    html: '<h1>Welcome to ClosetNerds</h1>',
  };
  await sendMail(message);
};
