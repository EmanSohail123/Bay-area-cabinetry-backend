import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Hardcoded transporter with Gmail Workspace account
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,         // false = TLS on port 587
  requireTLS: true,      // force TLS upgrade
  auth: {
    user: "info@bayareacabinetry.us",   // Workspace email
    pass: "rmfmuvcorkqtkqsl",           // Gmail App Password
  },
});

// ------------------- ROUTES -------------------

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
    message,
  } = req.body;

  console.log("📩 Estimate Request Body:", req.body);

  const mailOptions = {
    from: `"Estimate Request" <info@bayareacabinetry.us>`,
    to: "info@bayareacabinetry.us", // send to owner
    subject: "📐 New Estimate Request Received",
    html: `
      <h2>New Estimate Request</h2>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}, ${city}, ${state}, ${zipCode}</p>
      <p><strong>Preferred Contact Time:</strong> ${preferredContactTime}</p>
      <p><strong>Project Type:</strong> ${projectType}</p>
      <p><strong>Message:</strong></p>
      <blockquote>${message}</blockquote>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Estimate request sent successfully" });
  } catch (error) {
    console.error("❌ SMTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending estimate request",
      error: error.response || error.message || error,
    });
  }
});

app.post("/api/send-contact", async (req, res) => {
  const { firstName, lastName, email, phone, zipCode, message } = req.body;

  console.log("📩 Contact Request Body:", req.body);

  const mailOptions = {
    from: `"Contact Request" <info@bayareacabinetry.us>`,
    to: "info@bayareacabinetry.us",
    subject: "📩 New Contact Request Received",
    html: `
      <h2>New Contact Request</h2>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Zip Code:</strong> ${zipCode}</p>
      <p><strong>Message:</strong></p>
      <blockquote>${message}</blockquote>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Contact request sent successfully" });
  } catch (error) {
    console.error("❌ SMTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending contact request",
      error: error.response || error.message || error,
    });
  }
});

// ------------------- START SERVER -------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
