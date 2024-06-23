import Joi from "joi";

export const validateTodo = (data: Object) => {
    const validateData = Joi.object({
        todo: Joi.string().required()
    });

    return validateData.validate(data);
};