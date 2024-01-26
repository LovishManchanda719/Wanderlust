const Joi=require("joi");

const listingSchema=Joi.object(
    {
        listing:Joi.object(
            {
                title: Joi.string().required(),
                description:Joi.string().required(),
                country:Joi.string().required(),
                location:Joi.string().required(),
                imageUrl: Joi.string().allow('', null).default(''),  // Allow empty string or null, set default to ''
                price: Joi.number().required().min(0),
            }
        ).required()
    }
);
module.exports=listingSchema;
const reviewSchema=Joi.object(
    {
        review: Joi.object({
            rating: Joi.number().required().min(1).max(5),
            comment: Joi.string().required().required()
        }).required()
    }
);
module.exports=reviewSchema;