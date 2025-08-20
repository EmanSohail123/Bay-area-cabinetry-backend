<<<<<<< HEAD
import nodemailer from "nodemailer";

async function main() {
  // Create a test account (Ethereal)
  let testAccount = await nodemailer.createTestAccount();

  // Create transporter with Ethereal credentials
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send mail
  let info = await transporter.sendMail({
    from: '"Test Sender" <test@example.com>',
    to: "receiver@example.com",
    subject: "Hello from Nodemailer",
    text: "This is a test email using Ethereal.",
    html: "<b>This is a test email using Ethereal.</b>",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);
=======
import nodemailer from "nodemailer";

async function main() {
  // Create a test account (Ethereal)
  let testAccount = await nodemailer.createTestAccount();

  // Create transporter with Ethereal credentials
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send mail
  let info = await transporter.sendMail({
    from: '"Test Sender" <test@example.com>',
    to: "receiver@example.com",
    subject: "Hello from Nodemailer",
    text: "This is a test email using Ethereal.",
    html: "<b>This is a test email using Ethereal.</b>",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);
>>>>>>> d14d871147a815a7259cb9d03e9aa016b7abe220
