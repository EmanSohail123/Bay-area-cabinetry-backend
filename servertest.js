import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" })); // ✅ Allow all origins for testing (restrict later if needed)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Create transporter with Gmail account (uses env vars from Render or local .env)
let transporterPromise = Promise.resolve(
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,   // e.g. smtp.gmail.com
    port: process.env.SMTP_PORT,   // e.g. 587
    secure: false,                 // false for TLS (587), true for SSL (465)
    auth: {
      user: process.env.EMAIL_USER, // from .env / Render
      pass: process.env.EMAIL_PASS, // App Password from .env / Render
    },
  })
);

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

  console.log("Estimate Request Body:", req.body); // 👀 Debug log

  const mailOptions = {
    from: `"Estimate Request" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: "📐 New Estimate Request Received",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2c3e50;">New Estimate Request</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}, ${city}, ${state}, ${zipCode}</p>
        <p><strong>Preferred Contact Time:</strong> ${preferredContactTime}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #3498db; padding-left: 10px; color: #555;">
          ${message}
        </blockquote>
      </div>
    `,
  };

  try {
    const transporter = await transporterPromise;
    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Estimate request sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending estimate email:", error);
    res.status(500).json({ success: false, message: "Error sending estimate request" });
  }
});

app.post("/api/send-contact", async (req, res) => {
  const { firstName, lastName, email, phone, zipCode, message } = req.body;

  console.log("Contact Request Body:", req.body); // 👀 Debug log

  const mailOptions = {
    from: `"Contact Request" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: "📩 New Contact Request Received",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2c3e50;">New Contact Request</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Zip Code:</strong> ${zipCode}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #27ae60; padding-left: 10px; color: #555;">
          ${message}
        </blockquote>
      </div>
    `,
  };

  try {
    const transporter = await transporterPromise;
    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Contact request sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending contact email:", error);
    res.status(500).json({ success: false, message: "Error sending contact request" });
  }
});

// ------------------- UNIVERSAL EXPORT/LISTEN -------------------

// ✅ Always export for Vercel
export default app;

// ✅ If NOT running on Vercel, start server (Render / Hostinger / VPS)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
