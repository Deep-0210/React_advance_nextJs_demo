import mongoose from "mongoose";

const userLogIn = new mongoose.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true }
},
    { timestamps: true }
);

export const userLogInModel = mongoose.models.logIn || mongoose.model('logIn', userLogIn)