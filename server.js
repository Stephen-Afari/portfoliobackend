
const express = require("express");
const app = express();
//Import the dotenv file
const dotenv = require("dotenv");
//Indicate the path for the dotenv file
dotenv.config({ path: "./config.env" });


const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


//Nodemailer transporter configuration
//console.log(process.env.GOOGLEAPPPASSWORD)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GOOGLEAPPPASSWORD // Use app-specific password if 2FA is enabled
  }
});

app.post("/api/v1/send", (req, res) => {
  const mailOptions = {
    from: {
      name: 'Web Wizard',
      address: process.env.EMAIL,
    },
    to:req.body.email,
    subject: 'Mail from Web Portfolio!!!',
    html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Message:</strong> ${req.body.message}</p>
    <p><strong>Phone:</strong> ${req.body.phone}</p>
    <p><strong>Name:</strong> ${req.body.name}</p>
    <p><strong>Email:</strong> ${req.body.email}</p>
  `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send(error);
    }
    console.log('Email sent:', info.response);
    res.status(200).send("Email sent from Server!!!");
  });
  res.send('You can post this to another endpoint!!!')
});


//NB: Keep this React connection at the bottom of the page like this
app.use(express.static(path.join(__dirname, ".", "build")));
app.use(express.static("public"));

//Serve the front-end application
app.use((req, res) => {
  res.sendFile(path.join(__dirname, ".", "build", "index.html"));
});

app.listen(5000, (req, res) => {
  console.log("Server is listening on port 5000");
});
