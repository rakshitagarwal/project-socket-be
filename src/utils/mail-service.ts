import env from "../config/env";
import nodemailer from "nodemailer";
import logger from "../config/logger";
import { compile } from "handlebars";
import { Imail } from "./typing/utils-types";
import fs from "fs";

/**
 * @description - this function is used to send an email to the user with the given email, subject and template
 * @param props
 * @returns
 */
export async function mailService(props: Imail) {
    const htmlTemplate = fs.readFileSync(`assets/templates/${props.template}`, {
        encoding: "utf8",
    });
    const template = compile(htmlTemplate);
    const transporter = nodemailer.createTransport({
        service: env.EMAIL_SERVICE,
        auth: {
            user: env.FROM_EMAIL,
            pass: env.EMAIL_PASSWORD,
        },
        port: env.EMAIL_PORT,
        host: env.EMAIL_HOST,
    });

    const mailOptions = {
        from: env.FROM_EMAIL,
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
