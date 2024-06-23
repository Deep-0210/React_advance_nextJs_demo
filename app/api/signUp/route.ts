import { userLogInModel } from "@/models/logIn";
import { dbConnect } from "@/utils/dbConnect";
import { validateLogInUserData } from "@/validators/validateLogInData";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const data = await req.json()
        const validateData = validateLogInUserData(data)

        if (validateData?.error) {
            return new Response(JSON.stringify({ "message": validateData?.error?.details[0]?.message }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
        else {
            const isConnect = await dbConnect();

            if (isConnect) {

                const isUserExist = await userLogInModel.findOne({ "email": data.email });

                if (isUserExist) {
                    return new Response(JSON.stringify({ "userExist": "User exist" }), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                }
                else {

                    data.password = await bcrypt.hash(data.password, 10);
                    const userLogIn = new userLogInModel(data)
                    const isSaved = await userLogIn.save();

                    if (isSaved) {
                        const token = await jwt.sign({ "email": data.email }, `todo`, { expiresIn: '10 hr' });

                        return new Response(JSON.stringify({ "token": token }), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                    }
                    else {
                        const userData = await userLogInModel.findOne({ "email": data.email });
                        if (userData) {
                            await userLogInModel.findByIdAndDelete(userData?._id)
                        }
                    }
                }
            }
        }
    } catch (error) {
        return new Response(JSON.stringify({ "message": error }), { status: 500 })
    }
}