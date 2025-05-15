const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const backendURI = process.env.BACKEND_URI || 'http://localhost:8080/api';

function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
};

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })

async function sendVerificationEmail(email, token) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: 'DateScape',
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${backendURI}/verify-email?token=${token}">here</a> to verify your email.</p>`
        };

        const sentMail = await transporter.sendMail(mailOptions);
        return sentMail;
    } catch (error) {
        console.log('Error sending email', error)
    }
};


module.exports = { generateVerificationToken, sendVerificationEmail }