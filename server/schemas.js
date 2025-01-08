const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = joi => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', { value });
                }
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension);

module.exports.dateLocationSchema = Joi.object({
    location: Joi.object({
        title: Joi.string().required("Title is required").min(2).escapeHTML(),
        price: Joi.number().required("Price is required").min(0),
        description: Joi.string().required("Description is required").min(2).escapeHTML(),
        address: Joi.string().required("Address is required").escapeHTML()
    }).required("Location is required"),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required().escapeHTML()
    }).required()
})