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
        title: Joi.string()
            .min(2)
            .max(100)
            .required()
            .escapeHTML(),

        price: Joi.number()
            .min(0)
            .required(),

        description: Joi.string()
            .min(2)
            .max(2000)
            .escapeHTML()
            .required(),

        address: Joi.string()
            .required()
            .escapeHTML(),

        categories: Joi.array()
            .items('Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic')
            .min(1)
            .required()

    }).required(),

    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().integer().min(1).max(5).required(),
        body: Joi.string().min(2).max(1000).required().escapeHTML()
    }).required()
})