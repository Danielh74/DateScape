import { Request, Response, NextFunction } from 'express';
import ExpressError from './utils/ExpressError';
import { dateLocationSchema, reviewSchema } from './schemas';
import { DateLocation } from './models/dateLocation';
import Review from './models/review';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authorized');
    }
    next();
};

export const validateLocation = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.location) {
        req.body.location = JSON.parse(req.body.location);
    }
    const { error } = dateLocationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(m => m.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

export const isLocationAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const currentLocation = await DateLocation.findById(id);
    if (!currentLocation) {
        return res.status(404).send('Location was not found');
    }
    if (!currentLocation.author.equals(req.user!._id)) {
        return res.status(403).send({ error: 'You do not have permission to do that' });
    }
    next();
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(m => m.message).join(',');
        throw new ExpressError(400, msg)
    } else {
        next();
    }
};

export const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params;
    const currentReview = await Review.findById(reviewId);
    if (!currentReview) {
        return res.status(404).send('Review was not found');
    }
    if (!currentReview.author.equals(req.user!._id)) {
        return res.status(403).send({ error: 'You do not have permission to do that' });
    }
    next();
};
