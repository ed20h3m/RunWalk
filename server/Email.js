// REFERENCE: https://www.w3schools.com/nodejs/nodejs_email.asp
// REFERENCE: https://blog.bitsrc.io/integrate-nodemailer-with-ejs-for-email-template-ea2f77aaee2a

// Import required packages
const mailer = require("nodemailer");
const ejs = require("ejs");
require("dotenv").config();

// Create sender object
const sender = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email,
    pass: process.env.Email_password,
  },
});
/* content :{
  subject
  Description
} */
// Function: Send email
const SendEmail = (email, items) => {
  ejs.renderFile(__dirname + "/templates/email.ejs", { items }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      // Create Email object
      const Email = {
        from: process.env.Email,
        to: email,
        subject: "Booking Confirmation",
        html: data,
      };
      // Send Email
      sender.sendMail(Email);
    }
  });
};
module.exports = { SendEmail };
