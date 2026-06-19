import path from "path";
import ejs from "ejs";
import { mailTrigger } from "../../helpers/email/mail_helper.js";

export const onHandleEmailTrigger = async ({
  templateName = "email_verification",
  toAddress,
  subject = "Email Verification",
  data = {},
}) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src/helpers/templates",
      `${templateName}.ejs`
    );

    const htmlToSend = await ejs.renderFile(
      templatePath,
      {
        ...data,
        year: new Date().getFullYear(),
      }
    );

    const mailOption = {
      from: 'dotsemicolon9@gmail.com',
      to: toAddress,
      subject,
      html: htmlToSend,
    };

    return await mailTrigger(mailOption);
  } catch (error) {
    console.error("Email Trigger Error:", error);
    throw error;
  }
};