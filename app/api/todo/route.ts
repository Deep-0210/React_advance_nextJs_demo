import { addTodoModel } from "@/models/addTodo";
import { userLogInModel } from "@/models/logIn";
import { dbConnect } from "@/utils/dbConnect";
import { validateToken } from "@/utils/middleware";
import { validateTodo } from "@/validators/validateTodo";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const token = headers().get('token')
        const middleware: any = await validateToken(token as string);
        const data = await req.json();

        if (middleware?.valid) {
            const isConnect = await dbConnect()
            if (isConnect) {
                const validateData = await validateTodo(data)

                if (validateData?.error) {
                    return new Response(JSON.stringify({ "message": validateData?.error?.details[0]?.message }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                }
                else {
                    const userData = await userLogInModel.findOne({ "email": middleware?.decodeToken?.email });
                    if (userData) {
                        const newTodo = {
                            user: userData?._id,
                            todo: data?.todo
                        }

                        const todo = new addTodoModel(newTodo);
                        await todo.save();
                        return new Response(JSON.stringify({ "dataAdd": "Data added" }), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                    }
                }
            }
        }
        else {
            return new Response(JSON.stringify({ "message": "Unauthorize Access" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    }
    catch (error) {
        return new Response(JSON.stringify({ "message": error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
};

export const GET = async () => {
    try {
        const token = headers().get('token')
        const middleware: any = await validateToken(token as string);

        if (middleware?.valid) {
            const isConnect = await dbConnect();

            if (isConnect) {
                const userData = await userLogInModel.findOne({ "email": middleware?.decodeToken?.email });

                if (userData) {
                    const data = await addTodoModel.find({ user: userData?._id }).select({ __v: 0, updatedAt: 0, createdAt: 0, user: 0 });
                    if (data) {
                        return new Response(JSON.stringify({ "message": data }), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                    }
                }
            }
        }
        else {
            return new Response(JSON.stringify({ "message": "Unauthorize Access" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ "message": error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const data = await req.json()

        const token = headers().get('token')
        const middleware: any = await validateToken(token as string);

        if (middleware?.valid) {

            const validateData = await validateTodo({ todo: data.todo })

            if (validateData?.error) {
                return new Response(JSON.stringify({ "message": validateData?.error?.details[0]?.message }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            }
            else {
                const isConnect = await dbConnect();

                if (isConnect) {
                    const todoData = await addTodoModel.findById(data?.id);

                    if (todoData) {
                        await addTodoModel.findByIdAndUpdate(todoData?._id, { todo: data.todo }, { new: true });

                        return new Response(JSON.stringify({ "updated": "Data Updated" }), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                    }
                }
            }
        }
        else {
            return new Response(JSON.stringify({ "message": "Unauthorize Access" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ "message": error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const token = headers().get('token')
        const middleware: any = await validateToken(token as string);
        const data = await req.json();

        if (middleware?.valid) {
            const isConnect = await dbConnect();

            if (isConnect) {
                const todoData = await addTodoModel.findById(data?.id);

                if (todoData) {
                    await addTodoModel.findByIdAndDelete(todoData?._id);

                    return new Response(JSON.stringify({ "removed": "Data removed" }), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                }
            }
        }
        else {
            return new Response(JSON.stringify({ "message": "Unauthorize Access" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ "message": error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
};