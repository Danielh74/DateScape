import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const backendURI = process.env.BACKEND_URI || 'http://localhost:8080/api';

const templatePath = path.join(
    __dirname,
    'emailTemplates',
    'verification.html'
);

function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
};

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })

async function sendVerificationEmail(email: string, token: string) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const verificationUrl =
            `${backendURI}/verify-email?token=${encodeURIComponent(token)}`;

        const html = fs.readFileSync(templatePath, 'utf8').replace('{{VERIFICATION_URL}}', verificationUrl);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken.token ?? undefined
            }
        });

        const mailOptions = {
            from: `"DateScape" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Verify Your Email',
            html
        };

        return await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log('Error sending email', error)
    }
};


export { generateVerificationToken, sendVerificationEmail };
