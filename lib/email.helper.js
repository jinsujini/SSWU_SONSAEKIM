const nodemailer = require("nodemailer");
require("dotenv").config();

const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;

const generateRandomNumber = (n = 6) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

const sendEmail = async (email, code) => {
  const mailOptions = {
    from: NODEMAILER_USER,
    to: email,
    subject: "손새김 회원가입 인증 코드",
    text: `인증 코드: ${code}`,
  };
  return transporter.sendMail(mailOptions);
};

module.exports = { generateRandomNumber, sendEmail };