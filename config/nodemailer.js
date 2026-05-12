import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user: "rainaaarav05@gmail.com",
        pass: EMAIL_PASSWORD
    },
});

export default transporter;
