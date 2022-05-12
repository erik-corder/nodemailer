const express = require("express");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

//view engine setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//static folder
app.use("/public", express.static(path.join(__dirname, "public")));

//body parser middle ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', // true for 465, false for other ports
    auth: {
      user: "sampathisuru516@gmail.com", // generated ethereal user
      pass: "kanishka125", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Contact" <sampathisuru516@gmail.com>', // sender address
    to: "eriktest@mailinator.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.send({
            emailSend: 'fail'
        });
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.send({
          emailSend: 'successFull'
      });
  });
});

app.listen(3000, () => console.log("Server Started..."));
