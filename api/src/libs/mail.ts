import { returnSecret } from "./aws";

const nodemailer = require('nodemailer')
const inlineBase64 = require('nodemailer-plugin-inline-base64');

const send = ((to, subject, email) => {
  return new Promise(async response => {
    console.log('Sending e-mail to ' + to + '..')
    const sender_host = await returnSecret("sender_host")
    const sender_port = await returnSecret("sender_port")
    const sender_secure = await returnSecret("sender_secure")
    const sender_username = await returnSecret("sender_username")
    const sender_password = await returnSecret("sender_password")
    const sender_name = await returnSecret("sender_name")
    const sender_email = await returnSecret("sender_email")

    try {
      let transporter = nodemailer.createTransport({
        host: sender_host,
        port: sender_port,
        secure: (sender_secure === 'true') ? true : false,
        auth: {
          user: sender_username,
          pass: sender_password
        },
      });
      transporter.use('compile', inlineBase64({ cidPrefix: 'email_' }))

      let info = await transporter.sendMail({
        from: '"' + sender_name + '" <' + sender_email + '>',
        to: to,
        subject: subject,
        html: email
      });
      console.log("SMTP response:", info)
      response(info)
    } catch (e) {
      console.log(e)
      response(false)
    }
  })
})

const sendTemplate = (to, subject, template, vars) => {
  return new Promise(async (response) => {
    console.log("Sending e-mail to " + to + "..");
    const sender_host = await returnSecret("sender_host");
    const sender_port = await returnSecret("sender_port");
    const sender_secure = await returnSecret("sender_secure");
    const sender_username = await returnSecret("sender_username");
    const sender_password = await returnSecret("sender_password");
    const sender_name = await returnSecret("sender_name");
    const sender_email = await returnSecret("sender_email");

    try {
      let transporter = nodemailer.createTransport({
        host: sender_host,
        port: sender_port,
        secure: sender_secure === "true" ? true : false,
        auth: {
          user: sender_username,
          pass: sender_password,
        },
      });
      transporter.use("compile", inlineBase64({ cidPrefix: "email_" }));

      let dynamicTemplate = template;
      vars.forEach((element) => {
        dynamicTemplate = dynamicTemplate.replace(element.key, element.value);
      });

      let info = await transporter.sendMail({
        from: '"' + sender_name + '" <' + sender_email + ">",
        to: to,
        subject: subject,
        html: dynamicTemplate,
      });
      console.log("SMTP response:", info);
      response(info);
    } catch (e) {
      console.log(e);
      response(false);
    }
  });
};

export { send, sendTemplate };
