import env from "../config/env";
import { compile } from "handlebars";
import { Imail } from "./typing/utils-types";
import fs from "fs";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import logger from "../config/logger";

/**
 * Set SendGrid API key using the environment variable SENDGRID_API_KEY
 */
sgMail.setApiKey(env.SENDGRID_API_KEY);

/**
 * Sends an email using the SendGrid API.
 * @param {Object} props - The email service properties.
 * @param {string} props.email - The email address of the recipient.
 * @param {string} props.template - The name of the email template file.
 * @param {string} props.subject - The subject of the email.
 * @param {string} [props.user_name] - The user's name (optional, used in the email template).
 * @param {string} [props.otp] - The one-time passcode (optional, used in the email template).
 * @param {string} props.message - The message content of the email.
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully or rejects on error.
 *
 * @throws {Error} If there is an issue sending the email, an error is thrown with a relevant message.
 *
 */
export async function mailService(props: Imail) {
    const htmlTemplate = fs.readFileSync(`assets/templates/${props.template}`, {encoding: "utf8",});
    const template = compile(htmlTemplate);
    if(env.NODE_ENV !== 'production'){
        const transporter = nodemailer.createTransport({
            service: env.EMAIL_SERVICE,
            auth: {
                user: "globalvox.mteam@gmail.com",
                pass: env.EMAIL_PASSWORD,
            },
            port: env.EMAIL_PORT,
            host: env.EMAIL_HOST,
        });
    
        const mailOptions = {
            from: "globalvox.mteam@gmail.com",
            to: props.email,
            subject: props.subject,
            text: "",
            html: template({
                userName: props.user_name,
                passcode: props.otp,
                message: props.message,
            }),
        };
        return transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                logger.error(
                    `${env.NODE_ENV} - ${err.name} - ${err.message} - ${err.stack}`
                );
            }
            logger.info(`accepted : ${info.accepted} messageId :${info.messageId}`);
        });
    }
    sgMail.send(
            {
                to: props.email,
                from: env.FROM_EMAIL,
                subject: props.subject,
                text: " ",
                html: template({
                    userName: props.user_name,
                    passcode: props.otp,
                    message: props.message,
                }),
            },            
        )
        .then(
            () => 
            console.log('mail sent successfully', ),
            (error) => {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body);
                }
            }
        );
}
