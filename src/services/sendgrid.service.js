const { sendgrid } = require('../config');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgrid.API_KEY);

const sendMail = async (to) => {
  let message = {
    to,
    from: sendgrid.SENDER_EMAIL,
    templateId: 'd-399f920f8cf7481eaecac05957c6cb78',
    dynamic_template_data: {
      username: to,
    },
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
