import Joi from "joi";

export const validateLogInUserData = (data: Object) => {
    const validateData = Joi.object({
        email: Joi.string().required().regex(/^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,5}$/),
        password: Joi.string().required().min(6)
    })

    return validateData.validate(data)
}