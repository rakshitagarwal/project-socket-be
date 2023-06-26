import env from '../config/env';
import nodemailer from "nodemailer"
import logger from '../config/logger';
export interface Imail {
    email: string
    template: string
    subject: string
    otp: string
    user_name: string
}

/**
 * @description - this function is used to send an email to the user with the given email, subject and template 
 * @param props 
 * @returns 
 */
export async function mailService(props: Imail) {
    const transporter = nodemailer.createTransport({
        service: env.EMAIL_SERVICE,
        auth: {
            user: env.FROM_EMAIL,
            pass: env.EMAIL_PASSWORD
        },
        port: env.EMAIL_PORT,
        host: env.EMAIL_HOST
    })

    const mailOptions = {
        from: env.FROM_EMAIL,
        to: props.email,
        subject: props.subject,
        text: "",
        html: props.template
    }

    return transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            logger.error(`${env.NODE_ENV} - ${err.name} - ${err.message} - ${err.stack}`);
        }
        logger.info(info)
    })
}