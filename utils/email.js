const nodemailer = require('nodemailer');
const { catchAsync } = require('../controllers/error.ctrl');

const sendEmail = catchAsync(async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptinos = {
    from: 'timebetov@flow.io',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptinos);
});

module.exports = sendEmail;
