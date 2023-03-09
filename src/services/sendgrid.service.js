const sgMail = require('@sendgrid/mail');

const { sendgrid, template } = require('../config');
sgMail.setApiKey(sendgrid.API_KEY);

const sendMail = async message => {
  try {
    await sgMail.send(message);
  } catch (error) {
    console.error('Error Sending Mail', error);
  }
};

module.exports = {
  smProfileRegister: async (email, username) => {
    let message = {
      from: sendgrid.SENDER_EMAIL,
      template_id: template.profile_registered,
      personalizations: [
        {
          to: {
            email,
          },
          dynamic_template_data: {
            username,
          },
        },
      ],
    };
    await sendMail(message);
  },

  smProfileComplete: async (email, username) => {
    let message = {
      from: sendgrid.SENDER_EMAIL,
      template_id: template.profile_completed,
      personalizations: [
        {
          to: {
            email,
          },
          dynamic_template_data: {
            username,
          },
        },
      ],
    };
    await sendMail(message);
  },

  smProfilePDF: async (email, username, pdf) => {
    let message = {
      from: sendgrid.SENDER_EMAIL,
      template_id: template.profile_completed,
      personalizations: [
        {
          to: {
            email,
          },
          dynamic_template_data: {
            username,
          },
        },
      ],
      attachments: [
        {
          content: pdf.toString('base64'),
          filename: 'Profile.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };
    await sendMail(message);
  },

  smSignUp: async (email, username) => {
    let message = {
      from: sendgrid.SENDER_EMAIL,
      template_id: template.user_registered,
      personalizations: [
        {
          to: {
            email,
          },
          dynamic_template_data: {
            username,
          },
        },
      ],
    };
    await sendMail(message);
  },

  smResetPassword: async (email, username, uri) => {
    let message = {
      from: sendgrid.SENDER_EMAIL,
      template_id: template.user_reset_password,
      personalizations: [
        {
          to: {
            email,
          },
          dynamic_template_data: {
            username,
            uri,
          },
        },
      ],
    };
    await sendMail(message);
  },

  smResetPasswordSuccess: async (email, username) => {
    let message = {
      from: sendgrid.SENDER_EMAIL,
      template_id: template.user_reset_password_success,
      personalizations: [
        {
          to: {
            email,
          },
          dynamic_template_data: {
            username,
          },
        },
      ],
    };
    await sendMail(message);
  },
};
