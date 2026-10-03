import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import handleAsyncError from '../utils/handleAsyncError';
import { generateVerificationToken, sendVerificationEmail } from '../utils/emailService';
import fs from 'fs';
import path from 'path';

export const loginUser = handleAsyncError(async (req, res) => {
    const user = req.user!;
    if (!user.isVerified) {
        req.logout(async () => {
            await sendVerificationEmail(user.email, user.verificationToken!);
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        });
    } else {
        res.status(200).json({ user: req.user, message: 'Welcome back!' });
    }
});

export const checkAuthenticated = (req: Request, res: Response) => {
    res.status(200).json({ message: 'User is authenticated', user: req.user });
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.status(200).json('Logged out');
    });
};

export const registerUser = handleAsyncError(async (req, res, next) => {
    const { username, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).json('Email already in use');
    }

    const verificationToken = generateVerificationToken();

    const user = new User({
        email,
        username,
        verificationToken,
        verificationTokenExpires: Date.now() + 15 * 60 * 1000,
        isVerified: false
    });

    await User.register(user, password);

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
});

export const updateProfileImage = handleAsyncError(async (req, res) => {
    const image = (req.files as Express.Multer.File[])[0];
    const profileImage = { url: image.path, filename: image.filename }

    const updatedUser = await User.findByIdAndUpdate(req.user!._id, { avatar: profileImage }, { new: true });
    res.json({ user: updatedUser, message: 'Profile image updated successfully' });
});

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query;

    if (typeof token !== 'string') {
        return res.status(400).json({ message: 'Token is invalid or expired.' })
    }

    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Token is invalid or expired.' })
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    const frontendURI = process.env.FRONTEND_URI || 'http://localhost:5173';

    const templatePath = path.join(
        __dirname,
        '../utils/emailTemplates/verificationSuccess.html'
    );

    const html = fs.readFileSync(templatePath, 'utf8')
        .replace('{{FRONTEND_URL}}', frontendURI);

    res.send(html);
};
