import * as joi from "joi"


export const validationSchema = joi.object({
    NODE_ENV: joi.string()
        .valid('development', 'test', 'production')
        .required(),
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),
    JWT_ACCESS_SECRET: joi.string().min(16).required(),
    JWT_REFRESH_SECRET: joi.string().min(16).required(),
})
