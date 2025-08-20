import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create transporter with Ethereal test account
let transporterPromise = nodemailer.createTestAccount().then(testAccount => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
});

app.post("/send-estimate", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    preferredContactTime,
    projectType,
    message
  } = req.body;

  const mailOptions = {
    from: '"Estimate Request" <test@example.com>',
    to: "receiver@example.com", // or your email
    subject: "New Estimate Request",
    text: `
      Full Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      Address: ${address}, ${city}, ${state}, ${zipCode}
      Preferred Contact Time: ${preferredContactTime}
      Project Type: ${projectType}
      Message: ${message}
    `
  };

  try {
    const transporter = await transporterPromise;
    let info = await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Estimate request sent successfully",
      previewURL: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error("Error sending estimate email:", error);
    res.status(500).json({ success: false, message: "Error sending estimate request" });
  }
});

app.post("/send-contact", async (req, res) => {
  const { firstName, lastName, email, phone, zipCode, message } = req.body;

  const mailOptions = {
    from: '"Contact Request" <test@example.com>',
    to: "receiver@example.com", // or your email
    subject: "New Contact Request",
    text: `
      First Name: ${firstName}
      Last Name: ${lastName}
      Email: ${email}
      Phone: ${phone}
      Zip Code: ${zipCode}
      Message: ${message}
    `
  };

  try {
    const transporter = await transporterPromise;
    let info = await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Contact request sent successfully",
      previewURL: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ success: false, message: "Error sending contact request" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
