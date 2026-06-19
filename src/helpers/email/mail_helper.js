import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'dotsemicolon9@gmail.com',
    pass: 'xraa qefn ggrd cysy',
  },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Error:", error);
    } else {
        console.log("SMTP Server is ready");
    }
});

export const mailTrigger = async (mailOption) => {
  try {
    const info = await transporter.sendMail(mailOption);

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};