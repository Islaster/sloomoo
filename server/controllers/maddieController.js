const Prompt = require('../models/Prompt');
const nodemailer = require('nodemailer');


module.exports = {
    getPrompt,
    sendEmail
}

async function getPrompt(req, res) {
    try {
        console.log(req.body);
        const prompt = req.body;
        const newPrompt = await Prompt.create(prompt);
        res.status(201).json(newPrompt);
        console.log(req.body);
    } catch (err) {
    res.status(500);
    console.log(err);
  }
}

async function sendEmail(req, res) {
    // Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  auth: {
    user: 'your-email@gmail.com', // Your email
    pass: 'your-email-password', // Your email password or App Password
  },
});

// Define mail options
const mailOptions = {
  from: 'your-email@gmail.com', // Sender address
  to: 'recipient-email@example.com', // List of recipients
  subject: 'Test Email from Nodemailer', // Subject line
  text: 'Hello! This is a test email sent using Nodemailer.', // Plain text body
  html: '<b>Hello!</b> This is a test email sent using <i>Nodemailer</i>.', // HTML body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
    
}

async function sendPrompt(req, res) {
    try {
        const prompt = req.body;
        res.json(prompt);

    }
}