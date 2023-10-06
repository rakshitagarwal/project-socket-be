import env from "../config/env";
// import logger from "../config/logger";
import { compile } from "handlebars";
import { Imail } from "./typing/utils-types";
import fs from "fs";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(env.SENDGRID_API_KEY);

/**
 * Sends an email using the nodemailer library.
 *
 * @param {Object} props - The email service properties.
 * @param {string} props.email - The email address of the recipient.
 * @param {string} props.template - The name of the email template file.
 * @param {string} props.subject - The subject of the email.
 * @param {string} [props.user_name] - The user's name (optional, used in the email template).
 * @param {string} [props.otp] - The one-time passcode (optional, used in the email template).
 * @param {string} props.message - The message content of the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully or rejects on error.
 */

export async function mailService(props: Imail) {
    const htmlTemplate = fs.readFileSync(`assets/templates/${props.template}`, {
        encoding: "utf8",
    });
    const template = compile(htmlTemplate);
    //ES6
    sgMail
        .send(
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
            () => console.log("mail sent"),
            (error) => {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body);
                }
            }
        );
}
