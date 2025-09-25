import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ FORCE HARDCODED VALUES - IGNORE ALL ENVIRONMENT VARIABLES
console.log("🚀 Using HARDCODED SMTP values (ignoring environment variables)");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@bayareacabinetry.us",
    pass: "rmfmuvcorkqtkqsl",
  },
});

// Test connection on startup
console.log("🔌 Testing SMTP connection on startup...");
transporter.verify(function(error, success) {
  if (error) {
    console.log("❌ SMTP Connection FAILED on startup:");
    console.log("Error:", error.message);
    console.log("Code:", error.code);
    console.log("Response:", error.response);
  } else {
    console.log("✅ SMTP Connection READY");
    console.log("📧 Using account: info@bayareacabinetry.us");
  }
});

// Simple error logging
function logError(error, type) {
  console.error(`\n❌ ${type} Error:`);
  console.error("Message:", error.message);
  console.error("Code:", error.code);
  console.error("Response:", error.response);
  console.error("");
}

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

  console.log("📩 Estimate Request Received");

  const mailOptions = {
    from: `"Estimate Request" <info@bayareacabinetry.us>`,
    to: "info@bayareacabinetry.us",
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
    console.log("✅ Estimate Email sent successfully");
    console.log("Message ID:", info.messageId);
    
    res.json({ 
      success: true, 
      message: "Estimate request sent successfully"
    });
  } catch (error) {
    logError(error, "ESTIMATE");

    res.status(500).json({
      success: false,
      message: "Error sending estimate request",
      error: error.message
    });
  }
});

app.post("/api/send-contact", async (req, res) => {
  const { firstName, lastName, email, phone, zipCode, message } = req.body;

  console.log("📩 Contact Request Received");

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
    console.log("✅ Contact Email sent successfully");
    console.log("Message ID:", info.messageId);
    
    res.json({ 
      success: true, 
      message: "Contact request sent successfully"
    });
  } catch (error) {
    logError(error, "CONTACT");

    res.status(500).json({
      success: false,
      message: "Error sending contact request",
      error: error.message
    });
  }
});

// Test SMTP route
app.get("/api/test-smtp", async (req, res) => {
  try {
    console.log("🧪 Testing SMTP configuration...");
    
    await transporter.verify();
    console.log("✅ SMTP connection verified");
    
    const testMailOptions = {
      from: `"Test Email" <info@bayareacabinetry.us>`,
      to: "info@bayareacabinetry.us",
      subject: "🧪 SMTP Test Email",
      html: "<p>This is a test email to verify SMTP configuration.</p>"
    };
    
    const info = await transporter.sendMail(testMailOptions);
    console.log("✅ Test email sent successfully");
    
    res.json({
      success: true,
      message: "SMTP test successful - email sent using hardcoded credentials"
    });
  } catch (error) {
    logError(error, "SMTP TEST");
    
    res.status(500).json({
      success: false,
      message: "SMTP test failed",
      error: error.message
    });
  }
});

// Debug route to show current configuration
app.get("/api/debug", (req, res) => {
  res.json({
    message: "Using hardcoded SMTP values",
    config: {
      host: "smtp.gmail.com",
      port: 465,
      user: "info@bayareacabinetry.us",
      status: "Hardcoded values enforced"
    },
    environmentVariables: {
      SMTP_USER: process.env.SMTP_USER ? "Set (but ignored)" : "Not set",
      SMTP_PASS: process.env.SMTP_PASS ? "Set (but ignored)" : "Not set"
    }
  });
});

// ------------------- START SERVER -------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Using HARDCODED Gmail account: info@bayareacabinetry.us`);
  console.log(`🔧 Test endpoints:`);
  console.log(`   - SMTP Test: http://localhost:${PORT}/api/test-smtp`);
  console.log(`   - Debug Info: http://localhost:${PORT}/api/debug`);
});