import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Gmail transporter using env file
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/send-estimate", async (req, res) => {
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
    from: `"Estimate Request" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL, // ✅ Send to your Gmail from env
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
    let info = await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Estimate request sent successfully",
      messageId: info.messageId, // ✅ Gmail doesn’t give preview URL
    });
  } catch (error) {
    console.error("Error sending estimate email:", error);
    res.status(500).json({ success: false, message: "Error sending estimate request" });
  }
});

app.post("/api/send-contact", async (req, res) => {
  const { firstName, lastName, email, phone, zipCode, message } = req.body;

  const mailOptions = {
    from: `"Contact Request" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL, // ✅ Send to your Gmail from env
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
    let info = await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Contact request sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ success: false, message: "Error sending contact request" });
  }
});

// ✅ Export app for Vercel
export default app;
