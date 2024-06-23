import mongoose, { Schema } from "mongoose";

const addTodo = new mongoose.Schema({
    todo: { type: String, require: true },
    user: { type: Schema.Types.ObjectId, require: true, ref: 'logIn' }
},
    { timestamps: true }
);

export const addTodoModel = mongoose.models.todo || mongoose.model('todo', addTodo)